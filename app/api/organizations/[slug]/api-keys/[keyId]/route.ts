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
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest, { params }: { params: { slug: string; keyId: string } }) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, keyId } = params

    // Get organization and check permissions
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: {
            userId: user.id,
            status: "ACTIVE",
          },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    const userMembership = organization.members[0]
    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Delete API key
    const deletedKey = await prisma.apiKey.delete({
      where: {
        id: keyId,
        organizationId: organization.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: "API key deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}
