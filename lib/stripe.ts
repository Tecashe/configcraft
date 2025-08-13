import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
})

export const STRIPE_PLANS = {
  FREE: {
    name: "Free",
    priceId: null,
    price: 0,
    toolLimit: 1,
    teamLimit: 3,
  },
  STARTER: {
    name: "Starter",
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    price: 2900, // $29.00 in cents
    toolLimit: 5,
    teamLimit: 10,
  },
  PROFESSIONAL: {
    name: "Professional",
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    price: 9900, // $99.00 in cents
    toolLimit: 25,
    teamLimit: 50,
  },
} as const

export type StripePlan = keyof typeof STRIPE_PLANS
