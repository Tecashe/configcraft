import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: any = {
      companyId: company.id,
    }

    if (category && category !== "all") {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    const tools = await prisma.tool.findMany({
      where,
      include: {
        _count: {
          select: {
            usageRecords: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json({ tools })
  } catch (error) {
    console.error("Tools fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { name, description, category } = body

    if (!name) {
      return NextResponse.json({ error: "Tool name is required" }, { status: 400 })
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        description: description || "",
        category: category || "Custom",
        slug: name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        creatorId: user.id,
        companyId: company.id,
        status: "DRAFT",
        generationStatus: "pending",
        config: {},
        schema: {},
        ui: {},
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Tool creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
