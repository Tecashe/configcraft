import { NextResponse } from "next/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const tools = await prisma.tool.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        status: true,
        generationStatus: true,
        createdAt: true,
        updatedAt: true,
        previewUrl: true,
        publishedUrl: true,
        generationError: true,
      },
    })

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Failed to fetch tools:", error)
    return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 })
  }
}
