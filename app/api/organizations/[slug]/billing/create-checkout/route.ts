import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { getOrganizationBySlug } from "@/lib/organization"
import { stripe, STRIPE_PLANS } from "@/lib/stripe"

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
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

    if (!plan || !["STARTER", "PROFESSIONAL"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS]
    if (!planConfig.priceId) {
      return NextResponse.json({ error: "Plan not available" }, { status: 400 })
    }

    // Get or create Stripe customer
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId: organization.id },
      orderBy: { createdAt: "desc" },
    })

    let customerId = subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0]?.emailAddress,
        name: `${user.firstName} ${user.lastName}`.trim(),
        metadata: {
          organizationId: organization.id,
          userId: userId,
        },
      })
      customerId = customer.id

      // Update subscription with customer ID
      if (subscription) {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { stripeCustomerId: customerId },
        })
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: planConfig.priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/${organization.slug}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/${organization.slug}/billing?canceled=true`,
      metadata: {
        organizationId: organization.id,
        userId: userId,
        plan: plan,
      },
      subscription_data: {
        metadata: {
          organizationId: organization.id,
          userId: userId,
          plan: plan,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Checkout creation error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
