import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { checkUserAccess } from "@/lib/organization"

export async function DELETE(request: NextRequest, { params }: { params: { slug: string; memberId: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, memberId } = params

    // Check user access (only owners and admins can remove members)
    const membership = await checkUserAccess(slug, "ADMIN")
    if (!membership) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const organization = await prisma.organization.findUnique({
      where: { slug },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if member exists and is not the owner
    const memberToRemove = await prisma.organizationMember.findUnique({
      where: { id: memberId },
    })

    if (!memberToRemove || memberToRemove.organizationId !== organization.id) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    if (memberToRemove.role === "OWNER") {
      return NextResponse.json({ error: "Cannot remove organization owner" }, { status: 400 })
    }

    // Remove the member
    await prisma.organizationMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 })
  }
}
