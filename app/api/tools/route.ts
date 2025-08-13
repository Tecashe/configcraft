import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const category = searchParams.get("category")

    const where: any = {
      companyId: company.id,
    }

    if (status) {
      where.status = status
    }

    if (category) {
      where.category = category
    }

    const tools = await prisma.tool.findMany({
      where,
      include: {
        creator: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        _count: {
          select: {
            usageRecords: true,
            analytics: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Tools fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { name, description, category, config, schema, ui } = body

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-")

    const tool = await prisma.tool.create({
      data: {
        name,
        description,
        slug,
        category,
        config,
        schema,
        ui,
        creatorId: user.id,
        companyId: company.id,
        status: "DRAFT",
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
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId: user.id,
        companyId: company.id,
        toolId: tool.id,
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Tool creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
