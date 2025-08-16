import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const generateToolSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  category: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = generateToolSchema.parse(body)

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        organizationMemberships: {
          include: {
            organization: {
              include: {
                subscriptions: true,
              },
            },
          },
          where: {
            status: "ACTIVE",
          },
        },
      },
    })

    if (!user || !user.organizationMemberships.length) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 })
    }

    const organization = user.organizationMemberships[0].organization
    const subscription = organization.subscriptions[0]

    // Check subscription limits
    if (!subscription || subscription.status !== "ACTIVE") {
      // Check free tier limits
      const toolCount = await prisma.tool.count({
        where: { organizationId: organization.id },
      })

      if (toolCount >= 3) {
        return NextResponse.json(
          {
            error: "Free tier limit reached. Please upgrade to create more tools.",
          },
          { status: 403 },
        )
      }
    }

    // Generate a unique slug
    const baseSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    let slug = baseSlug
    let counter = 1

    while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create the tool with initial status
    const tool = await prisma.tool.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        slug,
        status: "GENERATING",
        category: validatedData.category || "General",
        requirements: validatedData.requirements,
        generationStatus: "analyzing",
        config: {},
        schema: {},
        ui: {},
        createdById: user.id,
        organizationId: organization.id,
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId: user.id,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          category: validatedData.category,
          complexity: "medium",
          estimatedHours: 2,
        },
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: "TOOL_GENERATION_STARTED",
        resource: "tool",
        resourceId: tool.id,
        userId: user.id,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          toolName: tool.name,
          category: tool.category,
        },
      },
    })

    return NextResponse.json({
      success: true,
      toolId: tool.id,
      message: "Tool generation started",
    })
  } catch (error) {
    console.error("Error generating tool:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to generate tool",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
