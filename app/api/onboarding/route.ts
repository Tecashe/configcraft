// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"

// export async function POST(req: NextRequest) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     console.log("Onboarding request body:", body)

//     const { companyName, companySize, industry, primaryUseCase, integrations, toolRequirements } = body

//     // Validate required fields
//     if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
//       return NextResponse.json({ error: "Company name is required" }, { status: 400 })
//     }

//     const cleanCompanyName = companyName.trim()

//     // Create or update user in database
//     const dbUser = await prisma.user.upsert({
//       where: { clerkId: user.id },
//       update: {
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         imageUrl: user.imageUrl || "",
//       },
//       create: {
//         clerkId: user.id,
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         imageUrl: user.imageUrl || "",
//       },
//     })

//     console.log("User created/updated:", dbUser.id)

//     // Generate a safe slug from company name
//     const baseSlug = cleanCompanyName
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
//       .replace(/\s+/g, "-") // Replace spaces with hyphens
//       .replace(/-+/g, "-") // Replace multiple hyphens with single
//       .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
//       .substring(0, 50) // Limit length

//     // Fallback if slug is empty
//     const slug = baseSlug || "organization"

//     // Ensure slug is unique
//     let uniqueSlug = slug
//     let counter = 1
//     while (await prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
//       uniqueSlug = `${slug}-${counter}`
//       counter++
//     }

//     console.log("Generated unique slug:", uniqueSlug)

//     // Create organization
//     const organization = await prisma.organization.create({
//       data: {
//         name: cleanCompanyName,
//         slug: uniqueSlug,
//         industry: industry || null,
//         size: companySize || null,
//         ownerId: dbUser.id,
//       },
//     })

//     console.log("Organization created:", organization.id)

//     // Create organization membership
//     await prisma.organizationMember.create({
//       data: {
//         userId: dbUser.clerkId, // Use clerkId for member relationship
//         organizationId: organization.id,
//         role: "OWNER",
//         status: "ACTIVE",
//       },
//     })

//     console.log("Organization membership created")

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

//     console.log("Subscription created")

//     return NextResponse.json({
//       success: true,
//       organization: {
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//       },
//     })
//   } catch (error) {
//     console.error("Onboarding error details:", error)

//     // More specific error handling
//     if (error instanceof Error) {
//       if (error.message.includes("Unique constraint")) {
//         return NextResponse.json({ error: "Organization name already exists" }, { status: 409 })
//       }
//       if (error.message.includes("Foreign key constraint")) {
//         return NextResponse.json({ error: "User validation failed" }, { status: 400 })
//       }
//     }

//     return NextResponse.json(
//       {
//         error: "Failed to create organization. Please try again.",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }

// import { type NextRequest, NextResponse } from "next/server"
// import { currentUser } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import type { OrganizationSize } from "@prisma/client"

// // Map form values to Prisma enum values
// const mapCompanySize = (size: string): OrganizationSize | null => {
//   switch (size) {
//     case "1-10":
//       return "SMALL"
//     case "11-50":
//       return "MEDIUM"
//     case "51-200":
//       return "LARGE"
//     case "201-1000":
//     case "1000+":
//       return "ENTERPRISE"
//     default:
//       return null
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user = await currentUser()
//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const body = await req.json()
//     console.log("Onboarding request body:", body)

//     const { companyName, companySize, industry, primaryUseCase, integrations, toolRequirements } = body

//     // Validate required fields
//     if (!companyName || typeof companyName !== "string" || !companyName.trim()) {
//       return NextResponse.json({ error: "Company name is required" }, { status: 400 })
//     }

//     const cleanCompanyName = companyName.trim()

//     // Create or update user in database
//     const dbUser = await prisma.user.upsert({
//       where: { clerkId: user.id },
//       update: {
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         imageUrl: user.imageUrl || "",
//       },
//       create: {
//         clerkId: user.id,
//         email: user.emailAddresses[0]?.emailAddress || "",
//         firstName: user.firstName || "",
//         lastName: user.lastName || "",
//         imageUrl: user.imageUrl || "",
//       },
//     })

//     console.log("User created/updated:", dbUser.id)

//     // Generate a safe slug from company name
//     const baseSlug = cleanCompanyName
//       .toLowerCase()
//       .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
//       .replace(/\s+/g, "-") // Replace spaces with hyphens
//       .replace(/-+/g, "-") // Replace multiple hyphens with single
//       .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
//       .substring(0, 50) // Limit length

//     // Fallback if slug is empty
//     const slug = baseSlug || "organization"

//     // Ensure slug is unique
//     let uniqueSlug = slug
//     let counter = 1
//     while (await prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
//       uniqueSlug = `${slug}-${counter}`
//       counter++
//     }

//     console.log("Generated unique slug:", uniqueSlug)

//     // Map company size to Prisma enum
//     const organizationSize = mapCompanySize(companySize)

//     // Create organization
//     const organization = await prisma.organization.create({
//       data: {
//         name: cleanCompanyName,
//         slug: uniqueSlug,
//         industry: industry || null,
//         size: organizationSize || "SMALL", // Default to SMALL if no size provided
//         ownerId: dbUser.id,
//       },
//     })

//     console.log("Organization created:", organization.id)

//     // Create organization membership
//     await prisma.organizationMember.create({
//       data: {
//         userId: dbUser.clerkId, // Use clerkId for member relationship
//         organizationId: organization.id,
//         role: "OWNER",
//         status: "ACTIVE",
//       },
//     })

//     console.log("Organization membership created")

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

//     console.log("Subscription created")

//     return NextResponse.json({
//       success: true,
//       organization: {
//         id: organization.id,
//         name: organization.name,
//         slug: organization.slug,
//       },
//     })
//   } catch (error) {
//     console.error("Onboarding error details:", error)

//     // More specific error handling
//     if (error instanceof Error) {
//       if (error.message.includes("Unique constraint")) {
//         return NextResponse.json({ error: "Organization name already exists" }, { status: 409 })
//       }
//       if (error.message.includes("Foreign key constraint")) {
//         return NextResponse.json({ error: "User validation failed" }, { status: 400 })
//       }
//     }

//     return NextResponse.json(
//       {
//         error: "Failed to create organization. Please try again.",
//         details: process.env.NODE_ENV === "development" ? error : undefined,
//       },
//       { status: 500 },
//     )
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
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
    case "200+":
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

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { companyName, industry, companySize } = body

    // Validate required fields
    if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    if (!industry || typeof industry !== "string") {
      return NextResponse.json({ error: "Industry is required" }, { status: 400 })
    }

    if (!companySize || typeof companySize !== "string") {
      return NextResponse.json({ error: "Company size is required" }, { status: 400 })
    }

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
    const mappedSize = mapCompanySize(companySize)

    // Create the organization
    const organization = await prisma.organization.create({
      data: {
        name: companyName.trim(),
        slug,
        industry: industry.trim(),
        size: mappedSize,
        ownerId: userId,
      },
    })

    // Create organization membership for the owner
    await prisma.organizationMember.create({
      data: {
        userId,
        organizationId: organization.id,
        role: "OWNER",
      },
    })

    return NextResponse.json({
      success: true,
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
