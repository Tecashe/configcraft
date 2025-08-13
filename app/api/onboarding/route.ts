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

    // Create company
    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug: companyName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        industry,
        size: companySize,
        ownerId: dbUser.id,
      },
    })

    // Create company membership
    await prisma.companyMember.create({
      data: {
        userId: dbUser.id,
        companyId: company.id,
        role: "OWNER",
        status: "ACTIVE",
      },
    })

    // Create free subscription
    await prisma.subscription.create({
      data: {
        companyId: company.id,
        plan: "FREE",
        status: "ACTIVE",
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })

    return NextResponse.json({ success: true, company })
  } catch (error) {
    console.error("Onboarding error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
