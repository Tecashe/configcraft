import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import type Stripe from "stripe"

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
        const organizationId = subscription.metadata?.organizationId

        if (!organizationId) {
          console.error("No organizationId in subscription metadata")
          break
        }

        // Get period dates from the first subscription item
        const firstItem = subscription.items?.data?.[0]
        const currentPeriodStart = firstItem?.current_period_start || subscription.created
        const currentPeriodEnd = firstItem?.current_period_end || subscription.created

        await prisma.subscription.upsert({
          where: { stripeSubscriptionId: subscription.id },
          update: {
            status: subscription.status.toUpperCase() as any,
            plan: (subscription.metadata?.plan || "STARTER") as any,
            currentPeriodEnd: new Date(currentPeriodEnd * 1000),
          },
          create: {
            organizationId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            status: subscription.status.toUpperCase() as any,
            plan: (subscription.metadata?.plan || "STARTER") as any,
            currentPeriodStart: new Date(currentPeriodStart * 1000),
            currentPeriodEnd: new Date(currentPeriodEnd * 1000),
          },
        })

        console.log(`Subscription ${event.type}: ${subscription.id}`)
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

        console.log(`Subscription canceled: ${subscription.id}`)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        
        // For subscription invoices, we can get the subscription from lines
        let subscriptionId: string | null = null
        
        // Check if this is a subscription invoice by looking at line items
        if (invoice.lines?.data && invoice.lines.data.length > 0) {
          const subscriptionLineItem = invoice.lines.data.find(
            (line: any) => line.subscription
          )
          if (subscriptionLineItem?.subscription) {
            subscriptionId = subscriptionLineItem.subscription as string
          }
        }

        if (subscriptionId) {
          const subscription = await prisma.subscription.findFirst({
            where: { stripeSubscriptionId: subscriptionId },
          })

          if (subscription) {
            await prisma.invoice.create({
              data: {
                subscriptionId: subscription.id,
                stripeInvoiceId: invoice.id,
                amount: invoice.amount_paid || 0,
                currency: invoice.currency || 'usd',
                status: "PAID",
                invoiceUrl: invoice.hosted_invoice_url || null,
                pdfUrl: invoice.invoice_pdf || null,
              },
            })

            console.log(`Invoice paid: ${invoice.id}`)
          }
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







// import { type NextRequest, NextResponse } from "next/server"
// import { headers } from "next/headers"
// import { stripe } from "@/lib/stripe"
// import { prisma } from "@/lib/prisma"
// import type Stripe from "stripe"

// export async function POST(req: NextRequest) {
//   const body = await req.text()
//   const signature = headers().get("stripe-signature")

//   if (!signature) {
//     console.error("Missing Stripe signature")
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
//         const organizationId = subscription.metadata.organizationId

//         if (!organizationId) {
//           console.error("No organizationId in subscription metadata")
//           break
//         }

//         // Find existing subscription by stripeSubscriptionId
//         const existingSubscription = await prisma.subscription.findUnique({
//           where: { stripeSubscriptionId: subscription.id },
//         })

//         if (existingSubscription) {
//           // Update existing subscription
//           await prisma.subscription.update({
//             where: { stripeSubscriptionId: subscription.id },
//             data: {
//               status: subscription.status.toUpperCase() as any,
//               plan: (subscription.metadata.plan || "STARTER") as any,
//               currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//               stripePriceId: subscription.items.data[0]?.price.id,
//             },
//           })
//         } else {
//           // Create new subscription
//           await prisma.subscription.create({
//             data: {
//               organizationId,
//               stripeSubscriptionId: subscription.id,
//               stripeCustomerId: subscription.customer as string,
//               status: subscription.status.toUpperCase() as any,
//               plan: (subscription.metadata.plan || "STARTER") as any,
//               currentPeriodStart: new Date(subscription.current_period_start * 1000),
//               currentPeriodEnd: new Date(subscription.current_period_end * 1000),
//               stripePriceId: subscription.items.data[0]?.price.id,
//             },
//           })
//         }

//         console.log(`Subscription ${event.type}: ${subscription.id}`)
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

//         console.log(`Subscription canceled: ${subscription.id}`)
//         break
//       }

//       case "invoice.payment_succeeded": {
//         const invoice = event.data.object as Stripe.Invoice
//         const subscriptionId = invoice.subscription as string

//         if (subscriptionId) {
//           const subscription = await prisma.subscription.findUnique({
//             where: { stripeSubscriptionId: subscriptionId },
//           })

//           if (subscription) {
//             await prisma.invoice.create({
//               data: {
//                 subscriptionId: subscription.id,
//                 stripeInvoiceId: invoice.id,
//                 amount: invoice.amount_paid,
//                 currency: invoice.currency,
//                 status: "PAID",
//                 invoiceUrl: invoice.hosted_invoice_url,
//                 pdfUrl: invoice.invoice_pdf,
//               },
//             })

//             console.log(`Invoice paid: ${invoice.id}`)
//           }
//         }
//         break
//       }

//       case "invoice.payment_failed": {
//         const invoice = event.data.object as Stripe.Invoice
//         const subscriptionId = invoice.subscription as string

//         if (subscriptionId) {
//           const subscription = await prisma.subscription.findUnique({
//             where: { stripeSubscriptionId: subscriptionId },
//           })

//           if (subscription) {
//             await prisma.subscription.update({
//               where: { id: subscription.id },
//               data: { status: "PAST_DUE" },
//             })

//             console.log(`Payment failed for subscription: ${subscriptionId}`)
//           }
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
