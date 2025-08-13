import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { name, customizations } = body

    const template = await prisma.template.findUnique({
      where: { id: params.id },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Apply customizations to template config
    const config = { ...template.config, ...customizations }
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-")

    const tool = await prisma.tool.create({
      data: {
        name,
        description: template.description,
        slug,
        category: template.category,
        config,
        schema: template.schema,
        ui: template.ui,
        creatorId: user.id,
        companyId: company.id,
        status: "GENERATED",
      },
    })

    // Update template download count
    await prisma.template.update({
      where: { id: params.id },
      data: {
        downloads: { increment: 1 },
      },
    })

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "TOOL_CREATED",
        userId: user.id,
        companyId: company.id,
        toolId: tool.id,
        metadata: { templateId: template.id },
      },
    })

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Template use error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
