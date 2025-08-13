import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"
import { prisma } from "@/lib/prisma" // Declare prisma variable

export async function POST(req: NextRequest) {
  try {
    const { user, company } = await requireCompany()
    const { plan } = await req.json()

    const stripePlan = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]

    if (!stripePlan || !stripePlan.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // Create or get Stripe customer
    let stripeCustomerId = company.stripeCustomerId

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: company.name,
        metadata: {
          companyId: company.id,
          userId: user.id,
        },
      })

      stripeCustomerId = customer.id

      // Update company with Stripe customer ID
      await prisma.company.update({
        where: { id: company.id },
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
      metadata: {
        companyId: company.id,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
