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
//     const { companyName, companySize, industry, primaryUseCase, integrations, toolRequirements } = body

//     // Create or update user in database
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

//     // Create organization (renamed from company)
//     const organization = await prisma.organization.create({
//       data: {
//         name: companyName,
//         slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
//         industry,
//         size: companySize,
//         ownerId: dbUser.id,
//       },
//     })

//     // Create organization membership
//     await prisma.organizationMember.create({
//       data: {
//         userId: dbUser.clerkId, // Use clerkId for member relationship
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

//     return NextResponse.json({ success: true, organization })
//   } catch (error) {
//     console.error("Onboarding error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
import { type NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { companyName, companySize, industry, primaryUseCase, integrations, toolRequirements } = body

    // Validate required fields
    if (!companyName || typeof companyName !== "string") {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 })
    }

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    })

    // Generate a safe slug from company name
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim()
      .substring(0, 50) // Limit length

    // Ensure slug is unique
    let uniqueSlug = slug
    let counter = 1
    while (await prisma.organization.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: companyName,
        slug: uniqueSlug,
        industry: industry || null,
        size: companySize || null,
        ownerId: dbUser.id,
      },
    })

    // Create organization membership
    await prisma.organizationMember.create({
      data: {
        userId: dbUser.clerkId, // Use clerkId for member relationship
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
      },
    })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
