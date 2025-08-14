import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getOrganizationBySlug } from "@/lib/organization"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
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

    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
      include: {
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!subscription) {
      // Create default free subscription
      const newSubscription = await prisma.subscription.create({
        data: {
          organizationId: organization.id,
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          toolsLimit: 1,
          membersLimit: 3,
          storageLimit: 1000,
          apiCallsLimit: 1000,
        },
        include: {
          invoices: true,
        },
      })

      return NextResponse.json({
        ...newSubscription,
        usage: {
          toolsUsed: 0,
          toolsLimit: 1,
          teamMembers: 1,
          teamLimit: 3,
        },
      })
    }

    // Get current usage
    const [toolsCount, membersCount] = await Promise.all([
      prisma.tool.count({
        where: { organizationId: organization.id, status: { not: "ARCHIVED" } },
      }),
      prisma.organizationMember.count({
        where: { organizationId: organization.id, status: "ACTIVE" },
      }),
    ])

    return NextResponse.json({
      ...subscription,
      usage: {
        toolsUsed: toolsCount,
        toolsLimit: subscription.toolsLimit,
        teamMembers: membersCount,
        teamLimit: subscription.membersLimit,
      },
    })
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { slug: string } }) {
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

    const body = await request.json()
    const { plan } = body

    if (!plan || !["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Get plan limits
    const planLimits = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

    // Update Stripe subscription if exists and not downgrading to free
    if (subscription.stripeSubscriptionId && plan !== "FREE") {
      if (!planLimits.priceId) {
        return NextResponse.json({ error: "Invalid plan configuration" }, { status: 400 })
      }

      try {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [
            {
              id: subscription.stripeSubscriptionId,
              price: planLimits.priceId,
            },
          ],
          proration_behavior: "create_prorations",
        })
      } catch (stripeError) {
        console.error("Stripe update error:", stripeError)
        return NextResponse.json({ error: "Failed to update payment" }, { status: 400 })
      }
    }

    // Update subscription in database
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: plan as any,
        toolsLimit: planLimits.toolLimit,
        membersLimit: planLimits.teamLimit,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error("Subscription update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
