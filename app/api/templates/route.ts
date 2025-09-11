
export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    const where: any = {
      isPublic: true,
    }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ]
    }

    const templates = await prisma.template.findMany({
      where,
      orderBy: [{ rating: "desc" }, { downloads: "desc" }],
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error("Templates fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
