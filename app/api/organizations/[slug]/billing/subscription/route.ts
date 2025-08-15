import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getOrganizationBySlug } from "@/lib/organization"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"
import type { SubscriptionStatus } from "@prisma/client"
import type Stripe from "stripe"

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
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    let subscription = await prisma.subscription.findFirst({
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
      subscription = await prisma.subscription.create({
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

    // If subscription has Stripe subscription ID, sync with Stripe
    if (subscription.stripeSubscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId, {
          expand: ["latest_invoice", "customer"],
        }) as Stripe.Subscription

        // Map Stripe status to our enum
        const mapStripeStatus = (stripeStatus: Stripe.Subscription.Status): SubscriptionStatus => {
          switch (stripeStatus) {
            case "active":
              return "ACTIVE"
            case "canceled":
              return "CANCELED"
            case "past_due":
              return "PAST_DUE"
            case "unpaid":
              return "UNPAID"
            case "incomplete":
              return "INCOMPLETE"
            case "trialing":
              return "TRIALING"
            default:
              return "ACTIVE"
          }
        }

        const mappedStatus = mapStripeStatus(stripeSubscription.status)

        // Update local subscription status if needed
        if (mappedStatus !== subscription.status) {
          subscription = await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
              status: mappedStatus,
              currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            },
            include: {
              invoices: {
                orderBy: { createdAt: "desc" },
                take: 10,
              },
            },
          })
        }
      } catch (stripeError) {
        console.error("Stripe sync error:", stripeError)
      }
    }

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
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId) as Stripe.Subscription

        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
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