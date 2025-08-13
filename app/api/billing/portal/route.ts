import { type NextRequest, NextResponse } from "next/server"
import { requireCompany } from "@/lib/auth"
import { stripe } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const { company } = await requireCompany()

    if (!company.stripeCustomerId) {
      return NextResponse.json({ error: "No Stripe customer found" }, { status: 400 })
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: company.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Portal creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
