
// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { z } from "zod"

// const createOrganizationSchema = z.object({
//   name: z.string().min(1, "Organization name is required").max(100),
//   description: z.string().optional(),
//   industry: z.string().optional(),
//   size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]).default("SMALL"),
//   website: z.string().url().optional().or(z.literal("")),
// })

// export async function POST(request: NextRequest) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const validatedData = createOrganizationSchema.parse(body)

//     // Ensure user exists in our database
//     const dbUser = await prisma.user.upsert({
//       where: { clerkId: user.id },
//       update: {
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName,
//         lastName: user.lastName,
//         imageUrl: user.imageUrl,
//       },
//       create: {
//         clerkId: user.id,
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName,
//         lastName: user.lastName,
//         imageUrl: user.imageUrl,
//       },
//     })

//     // Generate unique slug
//     const baseSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
//     let slug = baseSlug
//     let counter = 1

//     while (await prisma.organization.findUnique({ where: { slug } })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }

//     // Create organization
//     const organization = await prisma.organization.create({
//       data: {
//         name: validatedData.name,
//         slug,
//         description: validatedData.description || null,
//         industry: validatedData.industry || null,
//         size: validatedData.size,
//         website: validatedData.website || null,
//         ownerId: dbUser.id,
//       },
//       include: {
//         owner: true,
//       },
//     })

//     // Create membership for the owner
//     await prisma.organizationMember.create({
//       data: {
//         userId: user.id,
//         organizationId: organization.id,
//         role: "OWNER",
//         status: "ACTIVE",
//       },
//     })

//     // Create free subscription
//     await prisma.subscription.create({
//       data: {
//         organizationId: organization.id,
//         plan: "FREE",
//         status: "ACTIVE",
//         currentPeriodStart: new Date(),
//         currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       organization: {
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//         description: organization.description,
//         industry: organization.industry,
//         size: organization.size,
//         website: organization.website,
//         createdAt: organization.createdAt,
//         owner: organization.owner,
//       },
//     })
//   } catch (error) {
//     console.error("Error creating organization:", error)

//     if (error instanceof z.ZodError) {
//       return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
//     }

//     return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
//   }
// }

// export async function GET(request: NextRequest) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     // Get all organizations where user is a member
//     const memberships = await prisma.organizationMember.findMany({
//       where: {
//         userId: user.id,
//         status: "ACTIVE",
//       },
//       include: {
//         organization: {
//           include: {
//             owner: true,
//             _count: {
//               select: {
//                 members: true,
//                 tools: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         joinedAt: "desc",
//       },
//     })

//     const organizations = memberships.map((membership) => ({
//       id: membership.organization.id,
//       name: membership.organization.name,
//       slug: membership.organization.slug,
//       description: membership.organization.description,
//       industry: membership.organization.industry,
//       size: membership.organization.size,
//       website: membership.organization.website,
//       logoUrl: membership.organization.logoUrl,
//       createdAt: membership.organization.createdAt,
//       role: membership.role,
//       owner: membership.organization.owner,
//       memberCount: membership.organization._count.members,
//       toolCount: membership.organization._count.tools,
//     }))

//     return NextResponse.json({ organizations })
//   } catch (error) {
//     console.error("Error fetching organizations:", error)
//     return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
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
    const baseSlug = validatedData.name.toLowerCase().replace(/[^a-z0-9]/g, "-")
    let slug = baseSlug
    let counter = 1

    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create organization
    const organization = await prisma.organization.create({
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
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: organization.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    })

    // Create free subscription
    await prisma.subscription.create({
      data: {
        organizationId: organization.id,
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    return NextResponse.json({
      success: true,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        description: organization.description,
        industry: organization.industry,
        size: organization.size,
        website: organization.website,
        createdAt: organization.createdAt,
        owner: organization.owner,
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

    // Get all organizations where user is a member
    const memberships = await prisma.organizationMember.findMany({
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
        joinedAt: "desc",
      },
    })

    const organizations = memberships.map((membership) => {
      const org = membership.organization
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        description: org.description,
        industry: org.industry,
        size: org.size,
        website: org.website,
        logoUrl: org.logoUrl,
        createdAt: org.createdAt,
        role: membership.role,
        owner: org.owner,
        memberCount: org._count.members,
        toolCount: org._count.tools,
      }
    })

    return NextResponse.json({ organizations })
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 })
  }
}
