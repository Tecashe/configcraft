import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()

    const integrations = await prisma.integration.findMany({
      where: {
        companyId: company.id,
      },
      include: {
        _count: {
          select: {
            toolIntegrations: true,
            logs: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return NextResponse.json(integrations)
  } catch (error) {
    console.error("Integrations fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { name, type, provider, config, credentials } = body

    const integration = await prisma.integration.create({
      data: {
        name,
        type,
        provider,
        config,
        credentials, // Should be encrypted in production
        companyId: company.id,
        status: "PENDING",
      },
    })

    return NextResponse.json(integration)
  } catch (error) {
    console.error("Integration creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
