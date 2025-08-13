import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireCompany } from "@/lib/auth"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"

export async function GET(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()

    const subscription = await prisma.subscription.findFirst({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
      include: {
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    })

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    const toolsCount = await prisma.tool.count({
      where: { companyId: company.id, status: { not: "ARCHIVED" } },
    })

    const teamCount = await prisma.companyUser.count({
      where: { companyId: company.id },
    })

    const planLimits = STRIPE_PLANS[subscription.plan as keyof typeof STRIPE_PLANS]

    return NextResponse.json({
      ...subscription,
      usage: {
        toolsUsed: toolsCount,
        toolsLimit: planLimits.toolLimit,
        teamMembers: teamCount,
        teamLimit: planLimits.teamLimit,
      },
    })
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const body = await req.json()
    const { plan } = body

    const subscription = await prisma.subscription.findFirst({
      where: { companyId: company.id },
      orderBy: { createdAt: "desc" },
    })

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    if (subscription.stripeSubscriptionId && plan !== "FREE") {
      const stripePlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

      if (!stripePlan.priceId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
      }

      // Update Stripe subscription
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [
          {
            id: subscription.stripeSubscriptionId,
            price: stripePlan.priceId,
          },
        ],
        proration_behavior: "create_prorations",
      })
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { plan },
    })

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error("Subscription update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
