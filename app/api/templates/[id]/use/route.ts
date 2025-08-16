import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import type { JsonValue } from "@prisma/client/runtime/library"

const useTemplateSchema = z.object({
  name: z.string().min(1, "Tool name is required"),
  customizations: z.record(z.any()).optional().default({}),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, customizations } = useTemplateSchema.parse(body)

    // Get user's organization
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        organizationMemberships: {
          include: {
            organization: true,
          },
          where: {
            status: "ACTIVE",
          },
        },
      },
    })

    if (!user || !user.organizationMemberships.length) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 })
    }

    const organization = user.organizationMemberships[0].organization

    const template = await prisma.template.findUnique({
      where: { id: params.id },
    })

    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Apply customizations to template config - handle JsonValue properly
    let config: JsonValue = {}
    if (template.config && typeof template.config === "object" && template.config !== null) {
      config = { ...(template.config as Record<string, any>), ...customizations }
    } else {
      config = customizations
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "-")

    // Ensure unique slug
    let uniqueSlug = slug
    let counter = 1
    while (await prisma.tool.findFirst({ where: { organizationId: organization.id, slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    const tool = await prisma.tool.create({
      data: {
        name,
        description: template.description,
        slug: uniqueSlug,
        category: template.category,
        config,
        schema: template.schema||{},
        ui: template.ui||{},
        createdById: user.id,
        organizationId: organization.id,
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
        type: "TEMPLATE_USED",
        userId: user.id,
        organizationId: organization.id,
        toolId: tool.id,
        metadata: { templateId: template.id, templateName: template.name },
      },
    })

    return NextResponse.json({
      success: true,
      tool,
      message: "Tool created from template successfully",
    })
  } catch (error) {
    console.error("Template use error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
