import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()

    const companyData = await prisma.company.findUnique({
      where: { id: company.id },
      include: {
        members: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                imageUrl: true,
              },
            },
          },
        },
        subscriptions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
        _count: {
          select: {
            tools: true,
            members: true,
          },
        },
      },
    })

    return NextResponse.json(companyData)
  } catch (error) {
    console.error("Company fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { name, description, website, industry, size } = body

    const updatedCompany = await prisma.company.update({
      where: { id: company.id },
      data: {
        name,
        description,
        website,
        industry,
        size,
      },
    })

    return NextResponse.json(updatedCompany)
  } catch (error) {
    console.error("Company update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
