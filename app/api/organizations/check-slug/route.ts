import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateSlug } from "@/lib/organization"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug parameter is required" }, { status: 400 })
    }

    // Clean the slug
    const cleanSlug = generateSlug(slug)

    if (!cleanSlug) {
      return NextResponse.json({ available: false, error: "Invalid slug format" }, { status: 400 })
    }

    // Check if slug exists
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: cleanSlug },
    })

    return NextResponse.json({
      available: !existingOrg,
      slug: cleanSlug,
    })
  } catch (error) {
    console.error("Error checking slug availability:", error)
    return NextResponse.json({ error: "Failed to check slug availability" }, { status: 500 })
  }
}
