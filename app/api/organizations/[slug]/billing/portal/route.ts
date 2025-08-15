// import { NextResponse } from "next/server"
// import { auth } from "@clerk/nextjs/server"
// import { prisma } from "@/lib/prisma"
// import { getOrganizationBySlug } from "@/lib/organization"
// import { stripe } from "@/lib/stripe"

// export async function POST(request: Request, { params }: { params: { slug: string } }) {
//   try {
//     const { userId } = await auth()
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//     }

//     const organization = await getOrganizationBySlug(params.slug)
//     if (!organization) {
//       return NextResponse.json({ error: "Organization not found" }, { status: 404 })
//     }

//     // Check if user has access
//     const membership = await prisma.organizationMember.findFirst({
//       where: {
//         userId: userId,
//         organizationId: organization.id,
//         status: "ACTIVE",
//         role: { in: ["OWNER", "ADMIN"] },
//       },
//     })

//     if (!membership) {
//       return NextResponse.json({ error: "Access denied" }, { status: 403 })
//     }

//     // Get subscription to find Stripe customer ID
//     const subscription = await prisma.subscription.findFirst({
//       where: { organizationId: organization.id },
//       orderBy: { createdAt: "desc" },
//     })

//     if (!subscription?.stripeCustomerId) {
//       return NextResponse.json({ error: "No billing account found" }, { status: 400 })
//     }

//     // Create Stripe billing portal session
//     const session = await stripe.billingPortal.sessions.create({
//       customer: subscription.stripeCustomerId,
//       return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${organization.slug}/billing`,
//     })

//     return NextResponse.json({ url: session.url })
//   } catch (error) {
//     console.error("Portal creation error:", error)
//     return NextResponse.json({ error: "Failed to create billing portal" }, { status: 500 })
//   }
// }

import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getOrganizationBySlug } from "@/lib/organization"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const organization = await getOrganizationBySlug(params.slug)
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    // Check if user has access
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organization.id,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Get subscription to find Stripe customer ID
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json({ error: "No billing account found" }, { status: 404 })
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/${organization.slug}/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Billing portal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
