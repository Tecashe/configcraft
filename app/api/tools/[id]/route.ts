import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, company } = await requireCompany()
    const toolId = params.id

    const tool = await prisma.tool.findFirst({
      where: {
        id: toolId,
        companyId: company.id,
      },
      include: {
        _count: {
          select: {
            usageRecords: true,
          },
        },
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Tool fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, company } = await requireCompany()
    const toolId = params.id
    const body = await req.json()

    const tool = await prisma.tool.findFirst({
      where: {
        id: toolId,
        companyId: company.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const updatedTool = await prisma.tool.update({
      where: { id: toolId },
      data: {
        name: body.name || tool.name,
        description: body.description || tool.description,
        category: body.category || tool.category,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedTool)
  } catch (error) {
    console.error("Tool update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    await prisma.tool.delete({
      where: { id: toolId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tool deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
