import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, company } = await requireCompany()
    const toolId = params.id

    const tool = await prisma.tool.findFirst({
      where: {
        id: toolId,
        companyId: company.id,
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
        companyId: company.id,
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
