import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkUserAccess } from "@/lib/organization"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Check user access
    const membership = await checkUserAccess(slug)
    if (!membership) {
      return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const members = await prisma.organizationMember.findMany({
      where: {
        organizationId: organization.id,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}
