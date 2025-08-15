import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"
import { publishingSystem } from "@/lib/publishing-system"
import { chatManager } from "@/lib/chat-management"

export async function POST(request: Request, { params }: { params: { slug: string; id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access
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

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    if (tool.status !== "GENERATED") {
      return NextResponse.json({ error: "Tool must be generated before publishing" }, { status: 400 })
    }

    const body = await request.json()
    const { subdomain, customDomain } = body

    if (!subdomain) {
      return NextResponse.json({ error: "Subdomain is required" }, { status: 400 })
    }

    // Check subdomain availability
    const isAvailable = await publishingSystem.checkSubdomainAvailability(subdomain)
    if (!isAvailable) {
      return NextResponse.json({ error: "Subdomain is already taken" }, { status: 409 })
    }

    // Get generated files from chat session
    if (!tool.chatSessionId) {
      return NextResponse.json({ error: "No chat session found for this tool" }, { status: 400 })
    }

    const chatSession = await chatManager.getChatSession(tool.chatSessionId)
    if (!chatSession || chatSession.files.length === 0) {
      return NextResponse.json({ error: "No generated files found" }, { status: 400 })
    }

    // Publish the tool
    const publishedTool = await publishingSystem.publishTool(
      tool.id,
      chatSession.files,
      {
        subdomain,
        customDomain,
        environment: {
          NODE_ENV: "production",
          NEXT_PUBLIC_TOOL_NAME: tool.name,
        },
      },
      organization.id,
    )

    // Update tool with published URL
    await prisma.tool.update({
      where: { id: tool.id },
      data: {
        status: "PUBLISHED",
        publishedUrl: publishedTool.url,
        publishedAt: new Date(),
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_PUBLISHED",
        userId: userId,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: {
          subdomain,
          customDomain,
          url: publishedTool.url,
        },
      },
    })

    return NextResponse.json({
      success: true,
      publishedTool,
      url: publishedTool.url,
    })
  } catch (error) {
    console.error("Failed to publish tool:", error)
    return NextResponse.json(
      { error: `Failed to publish tool: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
