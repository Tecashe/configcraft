// import { type NextRequest, NextResponse } from "next/server"
// import { headers } from "next/headers"
// import { stripe } from "@/lib/stripe"
// import { prisma } from "@/lib/prisma"
// import type Stripe from "stripe"

// export async function POST(req: NextRequest) {
//   const body = await req.text()
//   const signature = headers().get("stripe-signature")

//   if (!signature) {
//     return NextResponse.json({ error: "No signature" }, { status: 400 })
//   }

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
//   } catch (error) {
//     console.error("Webhook signature verification failed:", error)
//     return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
//   }

//   try {
//     switch (event.type) {
//       case "customer.subscription.created":
//       case "customer.subscription.updated": {
//         const subscription = event.data.object as Stripe.Subscription
//         const companyId = subscription.metadata.companyId

//         if (!companyId) {
//           console.error("No companyId in subscription metadata")
//           break
//         }

//         await prisma.subscription.upsert({
//           where: { stripeSubscriptionId: subscription.id },
//           update: {
//             status: subscription.status.toUpperCase(),
//             plan: subscription.metadata.plan || "STARTER",
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//           },
//           create: {
//             companyId,
//             stripeSubscriptionId: subscription.id,
//             stripeCustomerId: subscription.customer as string,
//             status: subscription.status.toUpperCase(),
//             plan: subscription.metadata.plan || "STARTER",
//             currentPeriodStart: new Date(subscription.current_period_start * 1000),
//             currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//           },
//         })
//         break
//       }

//       case "customer.subscription.deleted": {
//         const subscription = event.data.object as Stripe.Subscription

//         await prisma.subscription.update({
//           where: { stripeSubscriptionId: subscription.id },
//           data: {
//             status: "CANCELED",
//             plan: "FREE",
//           },
//         })
//         break
//       }

//       case "invoice.payment_succeeded": {
//         const invoice = event.data.object as Stripe.Invoice
//         const subscriptionId = invoice.subscription as string

//         const subscription = await prisma.subscription.findFirst({
//           where: { stripeSubscriptionId: subscriptionId },
//         })

//         if (subscription) {
//           await prisma.invoice.create({
//             data: {
//               subscriptionId: subscription.id,
//               stripeInvoiceId: invoice.id,
//               amount: invoice.amount_paid,
//               currency: invoice.currency,
//               status: "PAID",
//               invoiceUrl: invoice.hosted_invoice_url,
//               pdfUrl: invoice.invoice_pdf,
//             },
//           })
//         }
//         break
//       }

//       default:
//         console.log(`Unhandled event type: ${event.type}`)
//     }

//     return NextResponse.json({ received: true })
//   } catch (error) {
//     console.error("Webhook processing error:", error)
//     return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
//   }
// }

import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const companyId = (subscription as any).metadata?.companyId

        if (!companyId) {
          console.error("No companyId in subscription metadata")
          break
        }

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          update: {
            status: subscription.status.toUpperCase(),
            plan: (subscription as any).metadata?.plan || "STARTER",
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
          create: {
            companyId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: typeof subscription.customer === 'string' 
              ? subscription.customer 
              : (subscription.customer as any)?.id || '',
            status: subscription.status.toUpperCase(),
            plan: (subscription as any).metadata?.plan || "STARTER",
            currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
          },
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: "CANCELED",
            plan: "FREE",
          },
        })
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = typeof (invoice as any).subscription === 'string' 
          ? (invoice as any).subscription 
          : (invoice as any).subscription?.id

        if (!subscriptionId) {
          console.error("No subscription ID found in invoice")
          break
        }

        const subscription = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        })

        if (subscription) {
          await prisma.invoice.create({
            data: {
              subscriptionId: subscription.id,
              stripeInvoiceId: invoice.id,
              amount: (invoice as any).amount_paid || 0,
              currency: (invoice as any).currency || 'usd',
              status: "PAID",
              invoiceUrl: (invoice as any).hosted_invoice_url,
              pdfUrl: (invoice as any).invoice_pdf,
            },
          })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}