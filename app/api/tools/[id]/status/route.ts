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
      select: {
        id: true,
        name: true,
        status: true,
        generationStatus: true,
        generationError: true,
        previewUrl: true,
        generatedAt: true,
        updatedAt: true,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
