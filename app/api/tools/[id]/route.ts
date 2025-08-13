import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, company } = await requireCompany()

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        companyId: company.id,
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        versions: {
          orderBy: {
            createdAt: "desc",
          },
        },
        integrations: {
          include: {
            integration: true,
          },
        },
        analytics: {
          orderBy: {
            date: "desc",
          },
          take: 30,
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
    const body = await req.json()
    const { name, description, category, config, schema, ui, status } = body

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        companyId: company.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    // Create version if config changed
    if (config && JSON.stringify(config) !== JSON.stringify(tool.config)) {
      await prisma.toolVersion.create({
        data: {
          toolId: tool.id,
          version: `${Number.parseFloat(tool.version) + 0.1}`,
          config: tool.config,
          schema: tool.schema,
          ui: tool.ui,
          changelog: "Updated configuration",
        },
      })
    }

    const updatedTool = await prisma.tool.update({
      where: { id: params.id },
      data: {
        name,
        description,
        category,
        config,
        schema,
        ui,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : tool.publishedAt,
      },
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    })

    // Track usage
    if (status === "PUBLISHED" && tool.status !== "PUBLISHED") {
      await prisma.usageRecord.create({
        data: {
          type: "TOOL_PUBLISHED",
          userId: user.id,
          companyId: company.id,
          toolId: tool.id,
        },
      })
    }

    return NextResponse.json(updatedTool)
  } catch (error) {
    console.error("Tool update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, company } = await requireCompany()

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        companyId: company.id,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    await prisma.tool.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Tool deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
