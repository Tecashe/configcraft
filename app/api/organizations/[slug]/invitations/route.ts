// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { checkUserAccess } from "@/lib/organization"
// import { z } from "zod"
// import crypto from "crypto"

// const inviteSchema = z.object({
//   email: z.string().email(),
//   role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
// })

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access (only owners and admins can invite)
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

//     const body = await request.json()
//     const { email, role } = inviteSchema.parse(body)

//     // Check if user is already a member
//     const existingMember = await prisma.organizationMember.findFirst({
//       where: {
//         organizationId: organization.id,
//         user: { email },
//       },
//     })

//     if (existingMember) {
//       return NextResponse.json({ error: "User is already a member" }, { status: 400 })
//     }

//     // Check if there's already a pending invitation
//     const existingInvitation = await prisma.organizationInvitation.findFirst({
//       where: {
//         organizationId: organization.id,
//         email,
//         status: "PENDING",
//         expiresAt: { gt: new Date() },
//       },
//     })

//     if (existingInvitation) {
//       return NextResponse.json({ error: "Invitation already sent" }, { status: 400 })
//     }

//     // Get the current user's database record
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId: user.id },
//     })

//     if (!dbUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Create invitation
//     const token = crypto.randomUUID()
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

//     const invitation = await prisma.organizationInvitation.create({
//       data: {
//         email,
//         role,
//         token,
//         expiresAt,
//         organizationId: organization.id,
//         invitedById: dbUser.id,
//         status: "PENDING",
//       },
//     })

//     // TODO: Send invitation email here
//     // await sendInvitationEmail(email, organization.name, token)

//     return NextResponse.json({
//       id: invitation.id,
//       email: invitation.email,
//       role: invitation.role,
//       status: invitation.status,
//       expiresAt: invitation.expiresAt,
//     })
//   } catch (error) {
//     console.error("Error creating invitation:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { checkUserAccess } from "@/lib/organization"
// import { z } from "zod"
// import crypto from "crypto"

// const inviteSchema = z.object({
//   email: z.string().email(),
//   role: z.enum(["ADMIN", "MEMBER", "VIEWER"]).default("MEMBER"),
// })

// export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access (only owners and admins can invite)
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

//     const body = await request.json()
//     const { email, role } = inviteSchema.parse(body)

//     // Check if user is already a member
//     const existingMember = await prisma.organizationMember.findFirst({
//       where: {
//         organizationId: organization.id,
//         user: { email },
//       },
//     })

//     if (existingMember) {
//       return NextResponse.json({ error: "User is already a member" }, { status: 400 })
//     }

//     // Check if there's already a pending invitation
//     const existingInvitation = await prisma.organizationInvitation.findFirst({
//       where: {
//         organizationId: organization.id,
//         email,
//         expiresAt: { gt: new Date() },
//       },
//     })

//     if (existingInvitation) {
//       return NextResponse.json({ error: "Invitation already sent" }, { status: 400 })
//     }

//     // Get the current user's database record
//     const dbUser = await prisma.user.findUnique({
//       where: { clerkId: user.id },
//     })

//     if (!dbUser) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 })
//     }

//     // Create invitation
//     const token = crypto.randomUUID()
//     const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

//     const invitation = await prisma.organizationInvitation.create({
//       data: {
//         email,
//         role,
//         token,
//         expiresAt,
//         organizationId: organization.id,
//         invitedById: dbUser.id,
//       },
//     })

//     // TODO: Send invitation email here
//     // await sendInvitationEmail(email, organization.name, token)

//     return NextResponse.json({
//       id: invitation.id,
//       email: invitation.email,
//       role: invitation.role,
//       expiresAt: invitation.expiresAt,
//     })
//   } catch (error) {
//     console.error("Error creating invitation:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import crypto from "crypto"

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
})

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const body = await request.json()
    const { email, role } = inviteSchema.parse(body)

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

    // Check if user has permission to invite (must be owner or admin)
    const userMembership = organization.members[0]
    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Check if user is already a member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: organization.id,
        user: { email },
      },
    })

    if (existingMember) {
      return NextResponse.json({ error: "User is already a member of this organization" }, { status: 400 })
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.organizationInvitation.findFirst({
      where: {
        organizationId: organization.id,
        email,
        expiresAt: { gt: new Date() },
      },
    })

    if (existingInvitation) {
      return NextResponse.json({ error: "Invitation already sent to this email" }, { status: 400 })
    }

    // Create invitation
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Get the inviting user
    const invitingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!invitingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const invitation = await prisma.organizationInvitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        organizationId: organization.id,
        invitedById: invitingUser.id,
      },
    })

    // TODO: Send invitation email here
    console.log(`Invitation created for ${email} to join ${organization.name}`)

    return NextResponse.json({
      id: invitation.id,
      email: invitation.email,
      role: invitation.role,
      createdAt: invitation.createdAt,
    })
  } catch (error) {
    console.error("Error creating invitation:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    // Get the organization and check permissions
    const organization = await prisma.organization.findUnique({
      where: { slug },
      include: {
        members: {
          where: { userId },
        },
        invitations: {
          where: {
            expiresAt: { gt: new Date() },
          },
          include: {
            invitedBy: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has permission to view invitations
    const userMembership = organization.members[0]
    if (!userMembership || !["OWNER", "ADMIN"].includes(userMembership.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    return NextResponse.json(organization.invitations)
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
