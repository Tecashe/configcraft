import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const toolId = params.id

    // Get user record
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        organizationMemberships: {
          include: {
            organization: true,
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

    const organizationId = user.organizationMemberships[0].organization.id

    const tool = await prisma.tool.findFirst({
      where: {
        id: toolId,
        organizationId,
      },
      include: {
        organization: true,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    if (tool.status !== "GENERATED") {
      return NextResponse.json(
        {
          error: "Tool must be generated before publishing",
        },
        { status: 400 },
      )
    }

    // Generate published URL
    const publishedUrl = `https://configcraft.app/tools/${tool.slug}-${toolId.slice(-8)}`

    // Update tool status to published
    const updatedTool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        status: "PUBLISHED",
        publishedUrl,
        publishedAt: new Date(),
        isPublic: true,
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_PUBLISHED",
        userId: user.id,
        organizationId: tool.organizationId,
        toolId: tool.id,
        metadata: {
          publishedUrl,
          publishedAt: new Date().toISOString(),
        },
      },
    })

    return NextResponse.json({
      success: true,
      tool: updatedTool,
      publishedUrl,
    })
  } catch (error) {
    console.error("Publishing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
