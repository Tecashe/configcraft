import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"
import { v0Api, processRequirements } from "@/lib/v0-api"
import { aiRequirementsService } from "@/lib/openai"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access to this organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const tools = await prisma.tool.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        status: true,
        generationStatus: true,
        createdAt: true,
        updatedAt: true,
        previewUrl: true,
        publishedUrl: true,
        generationError: true,
        slug: true,
        isPublic: true,
        version: true,
      },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Failed to fetch tools:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access to this organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN", "MEMBER"] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({
      where: { organizationId: organization.id },
    })

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 400 })
    }

    // Count existing tools
    const toolCount = await prisma.tool.count({
      where: { organizationId: organization.id },
    })

    if (toolCount >= subscription.toolsLimit) {
      return NextResponse.json(
        {
          error: "Tool limit reached",
          limit: subscription.toolsLimit,
          current: toolCount,
          plan: subscription.plan,
        },
        { status: 403 },
      )
    }

    const body = await request.json()
    const { name, description, category, requirements } = body

    // Validate required fields
    if (!name || !description || !category || !requirements) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, category, requirements" },
        { status: 400 },
      )
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    // Check if slug already exists in this organization
    const existingTool = await prisma.tool.findFirst({
      where: {
        organizationId: organization.id,
        slug: slug,
      },
    })

    if (existingTool) {
      return NextResponse.json({ error: "A tool with this name already exists" }, { status: 409 })
    }

    // Create the tool in the database
    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        category,
        requirements,
        slug,
        status: "GENERATING",
        generationStatus: "analyzing",
        organizationId: organization.id,
        createdById: userId,
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId: userId,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          toolName: name,
          category,
        },
      },
    })

    // Start the REAL generation process asynchronously
    generateToolAsync(tool.id, name, requirements)

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Failed to create tool:", error)
    return NextResponse.json({ error: "Failed to create tool" }, { status: 500 })
  }
}

async function generateToolAsync(toolId: string, toolName: string, requirements: string) {
  try {
    // Step 1: Analyze requirements with AI
    await prisma.tool.update({
      where: { id: toolId },
      data: { generationStatus: "analyzing" },
    })

    const analysis = await aiRequirementsService.analyzeRequirements(requirements)

    // Step 2: Design phase
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        generationStatus: "designing",
        analysisData: JSON.stringify(analysis),
      },
    })

    // Step 3: Generate code with v0 API
    await prisma.tool.update({
      where: { id: toolId },
      data: { generationStatus: "generating" },
    })

    const prompt = processRequirements(requirements, toolName)
    const generationResult = await v0Api.generateTool(prompt)

    // Step 4: Finalize
    await prisma.tool.update({
      where: { id: toolId },
      data: { generationStatus: "finalizing" },
    })

    // Save the generated code and complete
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        generationStatus: "completed",
        status: "GENERATED",
        previewUrl: generationResult.preview_url,
        generatedCode: generationResult.code,
        v0GenerationId: generationResult.id,
        generatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Generation error:", error)
    await prisma.tool.update({
      where: { id: toolId },
      data: {
        generationStatus: "error",
        status: "ERROR",
        generationError: error instanceof Error ? error.message : "Unknown error occurred",
      },
    })
  }
}
