// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { checkUserAccess } from "@/lib/organization"
// import { z } from "zod"

// const updateOrganizationSchema = z.object({
//   name: z.string().min(1).max(100).optional(),
//   description: z.string().max(500).optional(),
//   website: z.string().url().optional().or(z.literal("")),
//   industry: z.string().optional(),
//   size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]).optional(),
//   customBranding: z.boolean().optional(),
// })

// export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access
//     const hasAccess = await checkUserAccess(slug)
//     if (!hasAccess) {
//       return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
//     }

//     // Get organization with user's role
//     const userId = user.id

//     // First check if user owns the organization
//     const ownedOrg = await prisma.organization.findFirst({
//       where: {
//         slug,
//         owner: { clerkId: userId },
//       },
//       include: {
//         owner: true,
//         _count: {
//           select: {
//             members: true,
//             tools: true,
//           },
//         },
//       },
//     })

//     if (ownedOrg) {
//       return NextResponse.json({
//         id: ownedOrg.id,
//         name: ownedOrg.name,
//         slug: ownedOrg.slug,
//         description: ownedOrg.description,
//         logoUrl: ownedOrg.logoUrl,
//         website: ownedOrg.website,
//         industry: ownedOrg.industry,
//         size: ownedOrg.size,
//         customBranding: ownedOrg.customBranding,
//         brandColors: ownedOrg.brandColors,
//         createdAt: ownedOrg.createdAt,
//         updatedAt: ownedOrg.updatedAt,
//         memberCount: ownedOrg._count.members,
//         toolCount: ownedOrg._count.tools,
//         role: "OWNER",
//       })
//     }

//     // Check if user is a member
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId,
//         status: "ACTIVE",
//         organization: { slug },
//       },
//       include: {
//         organization: {
//           include: {
//             _count: {
//               select: {
//                 members: true,
//                 tools: true,
//               },
//             },
//           },
//         },
//       },
//     })

//     if (!membership) {
//       return NextResponse.json({ error: "Organization not found or access denied" }, { status: 404 })
//     }

//     return NextResponse.json({
//       id: membership.organization.id,
//       name: membership.organization.name,
//       slug: membership.organization.slug,
//       description: membership.organization.description,
//       logoUrl: membership.organization.logoUrl,
//       website: membership.organization.website,
//       industry: membership.organization.industry,
//       size: membership.organization.size,
//       customBranding: membership.organization.customBranding,
//       brandColors: membership.organization.brandColors,
//       createdAt: membership.organization.createdAt,
//       updatedAt: membership.organization.updatedAt,
//       memberCount: membership.organization._count.members,
//       toolCount: membership.organization._count.tools,
//       role: membership.role,
//     })
//   } catch (error) {
//     console.error("Error fetching organization:", error)
//     return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 })
//   }
// }

// export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const { slug } = params

//     // Check user access (only owners and admins can update)
//     const hasAccess = await checkUserAccess(slug, "ADMIN")
//     if (!hasAccess) {
//       return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
//     }

//     const body = await request.json()
//     const validatedData = updateOrganizationSchema.parse(body)

//     const organization = await prisma.organization.update({
//       where: { slug },
//       data: {
//         ...validatedData,
//         updatedAt: new Date(),
//       },
//       include: {
//         _count: {
//           select: {
//             members: true,
//             tools: true,
//           },
//         },
//       },
//     })

//     return NextResponse.json({
//       id: organization.id,
//       name: organization.name,
//       slug: organization.slug,
//       description: organization.description,
//       logoUrl: organization.logoUrl,
//       website: organization.website,
//       industry: organization.industry,
//       size: organization.size,
//       customBranding: organization.customBranding,
//       brandColors: organization.brandColors,
//       createdAt: organization.createdAt,
//       updatedAt: organization.updatedAt,
//       memberCount: organization._count.members,
//       toolCount: organization._count.tools,
//     })
//   } catch (error) {
//     console.error("Error updating organization:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Failed to update organization" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]).default("SMALL"),
  website: z.string().url().optional().or(z.literal("")),
})

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createOrganizationSchema.parse(body)

    // Ensure user exists in our database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: user.emailAddresses?.[0]?.emailAddress || "",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
      },
    })

    // Generate unique slug
    const baseSlug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .substring(0, 50)

    let slug = baseSlug
    let counter = 1

    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create organization with a transaction to ensure consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create organization
      const organization = await tx.organization.create({
        data: {
          name: validatedData.name,
          slug,
          description: validatedData.description || null,
          industry: validatedData.industry || null,
          size: validatedData.size,
          website: validatedData.website || null,
          ownerId: dbUser.id,
        },
        include: {
          owner: true,
        },
      })

      // Create membership for the owner
      await tx.organizationMember.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      })

      // Create free subscription
      await tx.subscription.create({
        data: {
          organizationId: organization.id,
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      })

      return organization
    })

    return NextResponse.json({
      success: true,
      organization: {
        id: result.id,
        name: result.name,
        slug: result.slug,
        description: result.description,
        industry: result.industry,
        size: result.size,
        website: result.website,
        createdAt: result.createdAt,
        owner: result.owner,
      },
    })
  } catch (error) {
    console.error("Error creating organization:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user exists in database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {},
      create: {
        clerkId: user.id,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
      },
    })

    // Get all organizations where user is owner or member
    const [ownedOrgs, memberships] = await Promise.all([
      prisma.organization.findMany({
        where: { ownerId: dbUser.id },
        include: {
          owner: {
            select: {
              id: true,
              clerkId: true,
              email: true,
              firstName: true,
              lastName: true,
              imageUrl: true,
            },
          },
          _count: {
            select: {
              members: true,
              tools: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.organizationMember.findMany({
        where: {
          userId: user.id,
          status: "ACTIVE",
        },
        include: {
          organization: {
            include: {
              owner: {
                select: {
                  id: true,
                  clerkId: true,
                  email: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                },
              },
              _count: {
                select: {
                  members: true,
                  tools: true,
                },
              },
            },
          },
        },
        orderBy: {
          organization: {
            createdAt: "desc",
          },
        },
      }),
    ])

    const organizations = []

    // Add owned organizations
    for (const org of ownedOrgs) {
      organizations.push({
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        industry: org.industry,
        size: org.size,
        website: org.website,
        logoUrl: org.logoUrl,
        createdAt: org.createdAt,
        role: "OWNER",
        owner: org.owner,
        memberCount: org._count.members,
        toolCount: org._count.tools,
      })
    }

    // Add member organizations (avoid duplicates)
    for (const membership of memberships) {
      const existingOrg = organizations.find((o) => o.id === membership.organization.id)
      if (!existingOrg) {
        organizations.push({
          id: membership.organization.id,
          name: membership.organization.name,
          slug: membership.organization.slug,
          description: membership.organization.description,
          industry: membership.organization.industry,
          size: membership.organization.size,
          website: membership.organization.website,
          logoUrl: membership.organization.logoUrl,
          createdAt: membership.organization.createdAt,
          role: membership.role,
          owner: membership.organization.owner,
          memberCount: membership.organization._count.members,
          toolCount: membership.organization._count.tools,
        })
      }
    }

    return NextResponse.json({ organizations })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
  }
}
