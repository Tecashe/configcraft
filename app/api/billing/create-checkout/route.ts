// import { type NextRequest, NextResponse } from "next/server"
// import { requireCompany } from "@/lib/auth"
// import { stripe, STRIPE_PLANS } from "@/lib/stripe"
// import { prisma } from "@/lib/prisma" // Declare prisma variable

// export async function POST(req: NextRequest) {
//   try {
//     const { user, company } = await requireCompany()
//     const { plan } = await req.json()

//     const stripePlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

//     if (!stripePlan || !stripePlan.priceId) {
//       return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
//     }

//     // Create or get Stripe customer
//     let stripeCustomerId = company.stripeCustomerId

//     if (!stripeCustomerId) {
//       const customer = await stripe.customers.create({
//         email: user.emailAddresses[0]?.emailAddress,
//         name: company.name,
//         metadata: {
//           companyId: company.id,
//           userId: user.id,
//         },
//       })

//       stripeCustomerId = customer.id

//       // Update company with Stripe customer ID
//       await prisma.company.update({
//         where: { id: company.id },
//         data: { stripeCustomerId },
//       })
//     }

//     // Create checkout session
//     const session = await stripe.checkout.sessions.create({
//       customer: stripeCustomerId,
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: stripePlan.priceId,
//           quantity: 1,
//         },
//       ],
//       mode: "subscription",
//       success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
//       cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
//       metadata: {
//         companyId: company.id,
//         plan,
//       },
//     })

//     return NextResponse.json({ url: session.url })
//   } catch (error) {
//     console.error("Checkout creation error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"
import { z } from "zod"

const createCheckoutSchema = z.object({
  plan: z.enum(["STARTER", "PROFESSIONAL", "ENTERPRISE"]),
  organizationId: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { plan, organizationId } = createCheckoutSchema.parse(body)

    // Verify user has access to organization
    const membership = await prisma.organizationMember.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
        status: "ACTIVE",
        role: { in: ["OWNER", "ADMIN"] },
      },
      include: {
        organization: true,
      },
    })

    if (!membership) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const organization = membership.organization
    const stripePlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

    if (!stripePlan || !stripePlan.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Create or get Stripe customer
    let stripeCustomerId = organization.stripeCustomerId

    if (!stripeCustomerId) {
      const user = await prisma.user.findUnique({
        where: { clerkId: userId },
      })

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const customer = await stripe.customers.create({
        email: user.email,
        name: organization.name,
        metadata: {
          organizationId: organization.id,
          userId: user.id,
        },
      })

      stripeCustomerId = customer.id

      // Update organization with Stripe customer ID
      await prisma.organization.update({
        where: { id: organization.id },
        data: { stripeCustomerId },
      })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: stripePlan.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${organization.slug}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${organization.slug}/billing?canceled=true`,
      metadata: {
        organizationId: organization.id,
        plan,
      },
      subscription_data: {
        metadata: {
          organizationId: organization.id,
          plan,
        },
      },
    })

    // Log the checkout creation
    await prisma.usageRecord.create({
      data: {
        type: "API_CALL",
        userId: userId,
        organizationId: organization.id,
        metadata: {
          action: "checkout_created",
          plan,
          sessionId: session.id,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout creation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
