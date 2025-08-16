// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"
// import { requireCompany } from "@/lib/auth"
// import { stripe, STRIPE_PLANS } from "@/lib/stripe"

// export async function GET(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()

//     const subscription = await prisma.subscription.findFirst({
//       where: { companyId: company.id },
//       orderBy: { createdAt: "desc" },
//       include: {
//         invoices: {
//           orderBy: { createdAt: "desc" },
//           take: 10,
//         },
//       },
//     })

//     if (!subscription) {
//       return NextResponse.json({ error: "No subscription found" }, { status: 404 })
//     }

//     const toolsCount = await prisma.tool.count({
//       where: { companyId: company.id, status: { not: "ARCHIVED" } },
//     })

//     const teamCount = await prisma.companyUser.count({
//       where: { companyId: company.id },
//     })

//     const planLimits = STRIPE_PLANS[subscription.plan as keyof typeof STRIPE_PLANS]

//     return NextResponse.json({
//       ...subscription,
//       usage: {
//         toolsUsed: toolsCount,
//         toolsLimit: planLimits.toolLimit,
//         teamMembers: teamCount,
//         teamLimit: planLimits.teamLimit,
//       },
//     })
//   } catch (error) {
//     console.error("Subscription fetch error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const body = await req.json()
//     const { plan } = body

//     const subscription = await prisma.subscription.findFirst({
//       where: { companyId: company.id },
//       orderBy: { createdAt: "desc" },
//     })

//     if (!subscription) {
//       return NextResponse.json({ error: "No subscription found" }, { status: 404 })
//     }

//     if (subscription.stripeSubscriptionId && plan !== "FREE") {
//       const stripePlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

//       if (!stripePlan.priceId) {
//         return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
//       }

//       // Update Stripe subscription
//       await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
//         items: [
//           {
//             id: subscription.stripeSubscriptionId,
//             price: stripePlan.priceId,
//           },
//         ],
//         proration_behavior: "create_prorations",
//       })
//     }

//     const updatedSubscription = await prisma.subscription.update({
//       where: { id: subscription.id },
//       data: { plan },
//     })

//     return NextResponse.json(updatedSubscription)
//   } catch (error) {
//     console.error("Subscription update error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"
import { z } from "zod"

const updateSubscriptionSchema = z.object({
  plan: z.enum(["FREE", "STARTER", "PROFESSIONAL", "ENTERPRISE"]),
  organizationId: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get("organizationId")

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 })
    }

    // Verify user has access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
      },
      include: {
        organization: {
          include: {
            subscriptions: {
              orderBy: { createdAt: "desc" },
              take: 1,
              include: {
                invoices: {
                  orderBy: { createdAt: "desc" },
                  take: 10,
                },
              },
            },
          },
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const subscription = membership.organization.subscriptions[0]

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Get current usage
    const toolsCount = await prisma.tool.count({
      where: { organizationId: organizationId, status: { not: "ARCHIVED" } },
    })

    const membersCount = await prisma.organizationMember.count({
      where: { organizationId: organizationId, status: "ACTIVE" },
    })

    const currentMonthUsage = await prisma.usageRecord.count({
      where: {
        organizationId: organizationId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    })

    const planLimits = STRIPE_PLANS[subscription.plan as keyof typeof STRIPE_PLANS] || {
      toolLimit: 1,
      teamLimit: 3,
      apiCallsLimit: 1000,
    }

    return NextResponse.json({
      ...subscription,
      usage: {
        toolsUsed: toolsCount,
        toolsLimit: planLimits.toolLimit,
        teamMembers: membersCount,
        teamLimit: planLimits.teamLimit,
        apiCalls: currentMonthUsage,
        //apiCallsLimit: planLimits.apiCallsLimit,
      },
    })
  } catch (error) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { plan, organizationId } = updateSubscriptionSchema.parse(body)

    // Verify user has admin access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
      include: {
        organization: {
          include: {
            subscriptions: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const subscription = membership.organization.subscriptions[0]

    if (!subscription) {
      return NextResponse.json({ error: "No subscription found" }, { status: 404 })
    }

    // Handle plan changes
    if (plan !== "FREE" && subscription.stripeSubscriptionId) {
      const stripePlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

      if (!stripePlan.priceId) {
        return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
      }

      // Update Stripe subscription
      const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)

      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        items: [
          {
            id: stripeSubscription.items.data[0].id,
            price: stripePlan.priceId,
          },
        ],
        proration_behavior: "create_prorations",
      })
    }

    // Update local subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: plan as any,
        ...(plan === "FREE" && { status: "CANCELED" }),
      },
    })

    // Log the subscription change
    await prisma.usageRecord.create({
      data: {
        type: "API_CALL",
        userId: userId,
        organizationId: organizationId,
        metadata: {
          action: "subscription_updated",
          oldPlan: subscription.plan,
          newPlan: plan,
        },
      },
    })

    return NextResponse.json(updatedSubscription)
  } catch (error) {
    console.error("Subscription update error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

