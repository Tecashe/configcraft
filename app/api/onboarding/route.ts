

// import { type NextRequest, NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { OrganizationSize } from "@prisma/client"

// // Map form values to Prisma enum values
// function mapCompanySize(size: string): OrganizationSize {
//   switch (size) {
//     case "1-10":
//       return OrganizationSize.SMALL
//     case "11-50":
//       return OrganizationSize.MEDIUM
//     case "51-200":
//       return OrganizationSize.LARGE
//     case "200+":
//       return OrganizationSize.ENTERPRISE
//     default:
//       return OrganizationSize.SMALL
//   }
// }

// function generateSlug(name: string): string {
//   if (!name || typeof name !== "string") {
//     return `org-${Date.now()}`
//   }

//   return (
//     name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-+|-+$/g, "")
//       .substring(0, 50) || `org-${Date.now()}`
//   )
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth()

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { companyName, industry, companySize } = body

//     // Validate required fields
//     if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
//       return NextResponse.json({ error: "Company name is required" }, { status: 400 })
//     }

//     if (!industry || typeof industry !== "string") {
//       return NextResponse.json({ error: "Industry is required" }, { status: 400 })
//     }

//     if (!companySize || typeof companySize !== "string") {
//       return NextResponse.json({ error: "Company size is required" }, { status: 400 })
//     }

//     // Generate a unique slug
//     const baseSlug = generateSlug(companyName.trim())
//     let slug = baseSlug
//     let counter = 1

//     // Ensure slug is unique
//     while (await prisma.organization.findUnique({ where: { slug } })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }

//     // Map the company size to the enum
//     const mappedSize = mapCompanySize(companySize)

//     // Create the organization
//     const organization = await prisma.organization.create({
//       data: {
//         name: companyName.trim(),
//         slug,
//         industry: industry.trim(),
//         size: mappedSize,
//         ownerId: userId,
//       },
//     })

//     // Create organization membership for the owner
//     await prisma.organizationMember.create({
//       data: {
//         userId,
//         organizationId: organization.id,
//         role: "OWNER",
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       organization: {
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//       },
//     })
//   } catch (error) {
//     console.error("Onboarding error:", error)
//     return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
//   }
// }


// import { type NextRequest, NextResponse } from "next/server"
// import { auth, currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { OrganizationSize } from "@prisma/client"

// // Map form values to Prisma enum values
// function mapCompanySize(size: string): OrganizationSize {
//   switch (size) {
//     case "1-10":
//       return OrganizationSize.SMALL
//     case "11-50":
//       return OrganizationSize.MEDIUM
//     case "51-200":
//       return OrganizationSize.LARGE
//     case "201-1000":
//     case "1000+":
//       return OrganizationSize.ENTERPRISE
//     default:
//       return OrganizationSize.SMALL
//   }
// }

// function generateSlug(name: string): string {
//   if (!name || typeof name !== "string") {
//     return `org-${Date.now()}`
//   }

//   return (
//     name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/^-+|-+$/g, "")
//       .substring(0, 50) || `org-${Date.now()}`
//   )
// }

// export async function POST(request: NextRequest) {
//   try {
//     const { userId } = await auth()
//     const user = await currentUser()

//     if (!userId || !user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await request.json()
//     const { companyName, industry, companySize, primaryUseCase, integrations, toolRequirements } = body

//     // Validate required fields
//     if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
//       return NextResponse.json({ error: "Company name is required" }, { status: 400 })
//     }

//     // Ensure user exists in our database
//     const dbUser = await prisma.user.upsert({
//       where: { clerkId: userId },
//       update: {
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName,
//         lastName: user.lastName,
//         imageUrl: user.imageUrl,
//       },
//       create: {
//         clerkId: userId,
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName,
//         lastName: user.lastName,
//         imageUrl: user.imageUrl,
//       },
//     })

//     // Generate a unique slug
//     const baseSlug = generateSlug(companyName.trim())
//     let slug = baseSlug
//     let counter = 1

//     // Ensure slug is unique
//     while (await prisma.organization.findUnique({ where: { slug } })) {
//       slug = `${baseSlug}-${counter}`
//       counter++
//     }

//     // Map the company size to the enum
//     const mappedSize = mapCompanySize(companySize || "1-10")

//     // Create the organization
//     const organization = await prisma.organization.create({
//       data: {
//         name: companyName.trim(),
//         slug,
//         description: toolRequirements || null,
//         industry: industry || null,
//         size: mappedSize,
//         ownerId: dbUser.id,
//       },
//     })

//     // Create organization membership for the owner
//     await prisma.organizationMember.create({
//       data: {
//         userId: userId, // Use Clerk ID for membership
//         organizationId: organization.id,
//         role: "OWNER",
//         status: "ACTIVE",
//       },
//     })

//     // Create free subscription with proper limits
//     await prisma.subscription.create({
//       data: {
//         organizationId: organization.id,
//         plan: "FREE",
//         status: "ACTIVE",
//         currentPeriodStart: new Date(),
//         currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//         toolsLimit: 1,
//         membersLimit: 3,
//         storageLimit: 1000, // 1GB
//         apiCallsLimit: 1000,
//       },
//     })

//     // Create initial integrations if selected
//     if (integrations && Array.isArray(integrations) && integrations.length > 0) {
//       const integrationPromises = integrations.map((integrationId: string) => {
//         const integrationMap: Record<string, { name: string; type: string }> = {
//           slack: { name: "Slack", type: "COMMUNICATION" },
//           google: { name: "Google Workspace", type: "PRODUCTIVITY" },
//           microsoft: { name: "Microsoft 365", type: "PRODUCTIVITY" },
//           salesforce: { name: "Salesforce", type: "CRM" },
//           hubspot: { name: "HubSpot", type: "CRM" },
//           zapier: { name: "Zapier", type: "PRODUCTIVITY" },
//         }

//         const integration = integrationMap[integrationId]
//         if (integration) {
//           return prisma.integration.create({
//             data: {
//               name: integration.name,
//               type: integration.type as any,
//               provider: integrationId,
//               status: "PENDING",
//               organizationId: organization.id,
//               config: {},
//             },
//           })
//         }
//         return null
//       })

//       await Promise.all(integrationPromises.filter(Boolean))
//     }

//     // Track usage
//     await prisma.usageRecord.create({
//       data: {
//         type: "MEMBER_INVITED",
//         userId: userId,
//         organizationId: organization.id,
//         metadata: {
//           action: "organization_created",
//           industry,
//           size: mappedSize,
//           primaryUseCase,
//         },
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       organization: {
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//       },
//     })
//   } catch (error) {
//     console.error("Onboarding error:", error)
//     return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { OrganizationSize } from "@prisma/client"

// Map form values to Prisma enum values
function mapCompanySize(size: string): OrganizationSize {
  switch (size) {
    case "1-10":
      return OrganizationSize.SMALL
    case "11-50":
      return OrganizationSize.MEDIUM
    case "51-200":
      return OrganizationSize.LARGE
    case "201-1000":
    case "1000+":
      return OrganizationSize.ENTERPRISE
    default:
      return OrganizationSize.SMALL
  }
}

function generateSlug(name: string): string {
  if (!name || typeof name !== "string") {
    return `org-${Date.now()}`
  }

  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .substring(0, 50) || `org-${Date.now()}`
  )
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // ✅ CHECK IF USER ALREADY HAS AN ORGANIZATION
    const existingMemberships = await prisma.organizationMember.findMany({
      where: {
        userId: userId,
        status: "ACTIVE",
      },
      include: {
        organization: true,
      },
      orderBy: {
        joinedAt: "asc",
      },
    })

    // If user already has organizations, redirect to their first one
    if (existingMemberships.length > 0) {
      const firstOrg = existingMemberships[0].organization
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        organization: {
          id: firstOrg.id,
          name: firstOrg.name,
          slug: firstOrg.slug,
        },
      })
    }

    const body = await request.json()
    const { companyName, industry, companySize, primaryUseCase, integrations, toolRequirements } = body

    // Validate required fields
    if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    // Ensure user exists in our database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
      create: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    })

    // Generate a unique slug
    const baseSlug = generateSlug(companyName.trim())
    let slug = baseSlug
    let counter = 1

    // Ensure slug is unique
    while (await prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Map the company size to the enum
    const mappedSize = mapCompanySize(companySize || "1-10")

    // Create the organization
    const organization = await prisma.organization.create({
      data: {
        name: companyName.trim(),
        slug,
        description: toolRequirements || null,
        industry: industry || null,
        size: mappedSize,
        ownerId: dbUser.id,
      },
    })

    // Create organization membership for the owner
    await prisma.organizationMember.create({
      data: {
        userId: userId, // Use Clerk ID for membership
        organizationId: organization.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    })

    // Create free subscription with proper limits
    await prisma.subscription.create({
      data: {
        organizationId: organization.id,
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        toolsLimit: 1,
        membersLimit: 3,
        storageLimit: 1000, // 1GB
        apiCallsLimit: 1000,
      },
    })

    // Create initial integrations if selected
    if (integrations && Array.isArray(integrations) && integrations.length > 0) {
      const integrationPromises = integrations.map((integrationId: string) => {
        const integrationMap: Record<string, { name: string; type: string }> = {
          slack: { name: "Slack", type: "COMMUNICATION" },
          google: { name: "Google Workspace", type: "PRODUCTIVITY" },
          microsoft: { name: "Microsoft 365", type: "PRODUCTIVITY" },
          salesforce: { name: "Salesforce", type: "CRM" },
          hubspot: { name: "HubSpot", type: "CRM" },
          zapier: { name: "Zapier", type: "PRODUCTIVITY" },
        }

        const integration = integrationMap[integrationId]
        if (integration) {
          return prisma.integration.create({
            data: {
              name: integration.name,
              type: integration.type as any,
              provider: integrationId,
              status: "PENDING",
              organizationId: organization.id,
              config: {},
            },
          })
        }
        return null
      })

      await Promise.all(integrationPromises.filter(Boolean))
    }

    // Track usage
    await prisma.usageRecord.create({
      data: {
        type: "MEMBER_INVITED",
        userId: userId,
        organizationId: organization.id,
        metadata: {
          action: "organization_created",
          industry,
          size: mappedSize,
          primaryUseCase,
        },
      },
    })

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
    })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
  }
}