// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { checkUserAccess } from "@/lib/organization"

// export async function DELETE(request: NextRequest, { params }: { params: { slug: string; keyId: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug, keyId } = params

//     // Check user access (only owners and admins can delete API keys)
//     const membership = await checkUserAccess(slug, "ADMIN")
//     if (!membership) {
//       return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
//     }

//     const organization = await prisma.organization.findUnique({
//       where: { slug },
//     })

//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if API key exists and belongs to this organization
//     const apiKey = await prisma.apiKey.findFirst({
//       where: {
//         id: keyId,
//         organizationId: organization.id,
//       },
//     })

//     if (!apiKey) {
//       return NextResponse.json({ error: "API key not found" }, { status: 404 })
//     }

//     // Delete the API key
//     await prisma.apiKey.delete({
//       where: { id: keyId },
//     })

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Error deleting API key:", error)
//     return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { slug: string; keyId: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, keyId } = params

    // Get the organization and check permissions
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has permission to delete API keys
    const userMembership = organization.members[0]
    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if API key exists and belongs to this organization
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        organizationId: organization.id,
      },
    })

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    // Delete the API key
    await prisma.apiKey.delete({
      where: { id: keyId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
