import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"
import { publishingSystem } from "@/lib/publishing-system"
import { ChatManager } from "@/lib/chat-management" // Import the class instead of instance

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
      return NextResponse.json({ error: "Subdomain is already taken" }, { status: 400 })
    }

    // Get chat session files
    let files: any[] = []
    if (tool.chatSessionId) {
      // Fix: Use static method on the class instead of instance method
      const chatSession = await ChatManager.getChatSession(tool.chatSessionId)
      if (chatSession) {
        files = chatSession.files
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No generated files found to publish" }, { status: 400 })
    }

    // Publish the tool
    const publishedTool = await publishingSystem.publishTool(
      tool.id,
      files,
      {
        subdomain,
        customDomain,
        environment: {
          NODE_ENV: "production",
          NEXT_PUBLIC_ORG_ID: organization.id,
        },
      },
      organization.id,
    )

    return NextResponse.json({
      success: true,
      url: publishedTool.url,
      status: publishedTool.status,
    })
  } catch (error) {
    console.error("Failed to publish tool:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to publish tool" },
      { status: 500 },
    )
  }
}