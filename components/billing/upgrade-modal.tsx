// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Badge } from "@/components/ui/badge"
// import { Check, Loader2, CreditCard, Zap } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface UpgradeModalProps {
//   isOpen: boolean
//   onClose: () => void
//   currentPlan: string
//   organizationSlug: string
//   feature?: string
// }

// const plans = [
//   {
//     name: "Starter",
//     price: "$29",
//     period: "per month",
//     description: "Great for small teams and growing businesses",
//     features: ["5 custom tools", "All templates", "Priority support", "Basic integrations", "Usage analytics"],
//     toolLimit: 5,
//     teamLimit: 10,
//     planKey: "STARTER",
//     popular: true,
//   },
//   {
//     name: "Professional",
//     price: "$99",
//     period: "per month",
//     description: "Perfect for established businesses",
//     features: [
//       "25 custom tools",
//       "Advanced integrations",
//       "Custom branding",
//       "API access",
//       "Advanced analytics",
//       "SSO support",
//     ],
//     toolLimit: 25,
//     teamLimit: 50,
//     planKey: "PROFESSIONAL",
//     popular: false,
//   },
// ]

// export function UpgradeModal({ isOpen, onClose, currentPlan, organizationSlug, feature }: UpgradeModalProps) {
//   const [upgrading, setUpgrading] = useState<string | null>(null)
//   const { toast } = useToast()

//   const handleUpgrade = async (plan: string) => {
//     setUpgrading(plan)
//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/billing/create-checkout`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ plan }),
//       })

//       if (response.ok) {
//         const { url } = await response.json()
//         window.location.href = url
//       } else {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to create checkout session")
//       }
//     } catch (error) {
//       console.error("Upgrade error:", error)
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Failed to start upgrade process",
//         variant: "destructive",
//       })
//     } finally {
//       setUpgrading(null)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
//         <DialogHeader className="text-center">
//           <DialogTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
//             <Zap className="h-6 w-6 text-yellow-500" />
//             Upgrade Your Plan
//           </DialogTitle>
//           <DialogDescription className="text-muted-foreground">
//             {feature
//               ? `You need to upgrade to access ${feature}. Choose a plan that fits your needs.`
//               : "Choose a plan that fits your growing business needs."}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
//           {plans.map((plan) => (
//             <div
//               key={plan.name}
//               className={`relative rounded-lg border p-6 ${
//                 plan.popular ? "border-primary bg-primary/5 shadow-lg" : "border-border bg-card"
//               }`}
//             >
//               {plan.popular && (
//                 <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
//                   Most Popular
//                 </Badge>
//               )}

//               <div className="text-center mb-4">
//                 <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
//                 <div className="text-3xl font-bold text-foreground mt-2">
//                   {plan.price}
//                   <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
//                 </div>
//                 <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
//               </div>

//               <ul className="space-y-2 mb-6">
//                 {plan.features.map((feature, index) => (
//                   <li key={index} className="flex items-center gap-2">
//                     <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
//                     <span className="text-sm text-foreground">{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               <Button
//                 className={`w-full ${
//                   plan.popular
//                     ? "bg-primary hover:bg-primary/90 text-primary-foreground"
//                     : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
//                 }`}
//                 disabled={upgrading === plan.planKey || currentPlan === plan.planKey}
//                 onClick={() => handleUpgrade(plan.planKey)}
//               >
//                 {upgrading === plan.planKey ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                     Processing...
//                   </>
//                 ) : currentPlan === plan.planKey ? (
//                   "Current Plan"
//                 ) : (
//                   <>
//                     <CreditCard className="h-4 w-4 mr-2" />
//                     Upgrade to {plan.name}
//                   </>
//                 )}
//               </Button>
//             </div>
//           ))}
//         </div>

//         <DialogFooter className="flex flex-col sm:flex-row gap-2">
//           <Button variant="outline" onClick={onClose} className="bg-transparent">
//             Maybe Later
//           </Button>
//           <div className="text-xs text-muted-foreground text-center sm:text-left">
//             Secure payment powered by Stripe • Cancel anytime
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentPlan?: string
}

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "per month",
    description: "Great for small teams and growing businesses",
    features: ["5 custom tools", "All templates", "Priority support", "Basic integrations", "Usage analytics"],
    planId: "STARTER",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "per month",
    description: "Perfect for established businesses",
    features: [
      "25 custom tools",
      "Advanced integrations",
      "Custom branding",
      "API access",
      "Advanced analytics",
      "SSO support",
    ],
    planId: "PROFESSIONAL",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with specific needs",
    features: [
      "Unlimited tools",
      "Dedicated support",
      "Custom integrations",
      "On-premise deployment",
      "Advanced security",
      "SLA guarantee",
    ],
    planId: "ENTERPRISE",
    popular: false,
  },
]

export function UpgradeModal({ isOpen, onClose, currentPlan = "FREE" }: UpgradeModalProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const params = useParams()
  const { toast } = useToast()
  const orgSlug = params?.slug as string

  const handleUpgrade = async (planId: string) => {
    if (planId === "ENTERPRISE") {
      // Handle enterprise contact
      window.open("mailto:sales@configcraft.com?subject=Enterprise Plan Inquiry", "_blank")
      return
    }

    setLoading(planId)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/billing/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: planId }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Upgrade error:", error)
      toast({
        title: "Error",
        description: "Failed to start upgrade process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white">Choose Your Plan</DialogTitle>
          <p className="text-center text-zinc-400 mt-2">Upgrade to unlock more features and grow your business</p>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.planId
            const isDowngrade =
              (currentPlan === "PROFESSIONAL" && plan.planId === "STARTER") ||
              (currentPlan === "ENTERPRISE" && ["STARTER", "PROFESSIONAL"].includes(plan.planId))

            return (
              <div
                key={plan.planId}
                className={`relative rounded-xl border p-6 ${
                  plan.popular ? "border-emerald-500 bg-emerald-500/5" : "border-zinc-800 bg-zinc-900/50"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white">
                    Most Popular
                  </Badge>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-zinc-400 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleUpgrade(plan.planId)}
                  disabled={isCurrentPlan || loading === plan.planId}
                  className={`w-full ${
                    plan.popular
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  } ${isCurrentPlan ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading === plan.planId ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : isDowngrade ? (
                    "Downgrade"
                  ) : plan.planId === "ENTERPRISE" ? (
                    "Contact Sales"
                  ) : (
                    "Upgrade"
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-400">All plans include a 14-day free trial. Cancel anytime.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
