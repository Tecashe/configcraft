import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getOrganizationBySlug } from "@/lib/organization"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { slug: string; id: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const tool = await prisma.tool.findFirst({
      where: {
        id: params.id,
        organizationId: organization.id,
      },
      select: {
        id: true,
        name: true,
        status: true,
        generationStatus: true,
        generationError: true,
        previewUrl: true,
        publishedUrl: true,
      },
    })

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    return NextResponse.json(tool)
  } catch (error) {
    console.error("Failed to get tool status:", error)
    return NextResponse.json({ error: "Failed to get tool status" }, { status: 500 })
  }
}
