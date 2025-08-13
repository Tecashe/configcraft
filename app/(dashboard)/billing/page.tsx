"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, CreditCard, Download, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionData {
  id: string
  plan: string
  status: string
  currentPeriodEnd: string
  usage: {
    toolsUsed: number
    toolsLimit: number
    teamMembers: number
    teamLimit: number
  }
  invoices: Array<{
    id: string
    amount: number
    currency: string
    status: string
    createdAt: string
    invoiceUrl?: string
    pdfUrl?: string
  }>
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch("/api/billing/subscription")
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      } else if (response.status === 404) {
        // Create a default free subscription
        setSubscription({
          id: "free",
          plan: "FREE",
          status: "ACTIVE",
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          usage: {
            toolsUsed: 0,
            toolsLimit: 1,
            teamMembers: 1,
            teamLimit: 3,
          },
          invoices: [],
        })
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
      toast({
        title: "Error",
        description: "Failed to load subscription data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan)
    try {
      const response = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
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
        description: "Failed to start upgrade process",
        variant: "destructive",
      })
    } finally {
      setUpgrading(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/billing/portal", { method: "POST" })
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      }
    } catch (error) {
      console.error("Portal error:", error)
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#888888]" />
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#E0E0E0]">No Subscription Found</h1>
          <p className="text-[#B0B0B0] mb-4">Please contact support to set up your subscription.</p>
        </div>
      </div>
    )
  }

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out ConfigCraft",
      features: ["1 custom tool", "Basic templates", "Email support", "Community access"],
      toolLimit: 1,
      teamLimit: 3,
      current: subscription.plan === "FREE",
      planKey: "FREE",
    },
    {
      name: "Starter",
      price: "$29",
      period: "per month",
      description: "Great for small teams and growing businesses",
      features: ["5 custom tools", "All templates", "Priority support", "Basic integrations", "Usage analytics"],
      toolLimit: 5,
      teamLimit: 10,
      current: subscription.plan === "STARTER",
      planKey: "STARTER",
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
      toolLimit: 25,
      teamLimit: 50,
      current: subscription.plan === "PROFESSIONAL",
      planKey: "PROFESSIONAL",
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
      toolLimit: "Unlimited",
      teamLimit: "Unlimited",
      current: false,
      planKey: "ENTERPRISE",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-[#E0E0E0]">Billing & Subscription</h1>
        <p className="text-[#B0B0B0]">Manage your subscription, usage, and billing information</p>
      </div>

      {/* Current Plan & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-[#E0E0E0]">
              Current Plan
              <Badge
                variant={subscription.status === "ACTIVE" ? "default" : "secondary"}
                className="bg-green-600 text-white"
              >
                {subscription.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-[#E0E0E0]">{subscription.plan}</div>
            <p className="text-[#B0B0B0] mb-4">Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</p>
            <Button
              variant="outline"
              className="w-full border-[#444444] text-[#E0E0E0] hover:bg-[#444444] bg-transparent"
              onClick={handleManageSubscription}
            >
              Manage Subscription
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Tools Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-[#E0E0E0]">
              {subscription.usage.toolsUsed}/{subscription.usage.toolsLimit}
            </div>
            <div className="w-full bg-[#444444] rounded-full h-2 mb-4">
              <div
                className="bg-[#888888] h-2 rounded-full"
                style={{
                  width: `${Math.min((subscription.usage.toolsUsed / subscription.usage.toolsLimit) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-[#B0B0B0]">
              {subscription.usage.toolsLimit - subscription.usage.toolsUsed} tools remaining
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-[#E0E0E0]">
              {subscription.usage.teamMembers}/{subscription.usage.teamLimit}
            </div>
            <div className="w-full bg-[#444444] rounded-full h-2 mb-4">
              <div
                className="bg-[#888888] h-2 rounded-full"
                style={{
                  width: `${Math.min((subscription.usage.teamMembers / subscription.usage.teamLimit) * 100, 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-[#B0B0B0]">
              {subscription.usage.teamLimit - subscription.usage.teamMembers} seats available
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Alert */}
      {subscription.usage.toolsUsed / subscription.usage.toolsLimit > 0.8 && (
        <Card className="mb-8 border-orange-500 bg-orange-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <div>
                <p className="font-medium text-orange-300">Approaching Tool Limit</p>
                <p className="text-sm text-orange-400">
                  You're using {subscription.usage.toolsUsed} of {subscription.usage.toolsLimit} tools. Consider
                  upgrading to avoid interruptions.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto border-orange-500 text-orange-300 hover:bg-orange-950 bg-transparent"
                onClick={() => handleUpgrade("PROFESSIONAL")}
              >
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-[#E0E0E0]">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative bg-[#1E1E1E] border-[#444444] ${plan.current ? "border-[#888888] shadow-lg" : ""}`}
            >
              {plan.current && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#888888] text-[#121212]">
                  Current Plan
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-[#E0E0E0]">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-[#E0E0E0]">
                  {plan.price}
                  <span className="text-sm font-normal text-[#B0B0B0]">/{plan.period}</span>
                </div>
                <CardDescription className="text-[#B0B0B0]">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-[#E0E0E0]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.current ? "border-[#444444] text-[#E0E0E0] hover:bg-[#444444]" : "bg-[#888888] hover:bg-[#666666] text-[#121212]"}`}
                  variant={plan.current ? "outline" : "default"}
                  disabled={plan.current || upgrading === plan.planKey}
                  onClick={() => (plan.name === "Enterprise" ? null : handleUpgrade(plan.planKey))}
                >
                  {upgrading === plan.planKey ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : plan.current ? (
                    "Current Plan"
                  ) : plan.name === "Enterprise" ? (
                    "Contact Sales"
                  ) : (
                    "Upgrade"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Method & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#E0E0E0]">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#B0B0B0] mb-4">
              Manage your payment methods through the Stripe billing portal.
            </p>
            <Button
              variant="outline"
              className="w-full border-[#444444] text-[#E0E0E0] hover:bg-[#444444] bg-transparent"
              onClick={handleManageSubscription}
            >
              Manage Payment Methods
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subscription.invoices.length > 0 ? (
                subscription.invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border border-[#444444] rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-[#E0E0E0]">${(invoice.amount / 100).toFixed(2)}</p>
                      <p className="text-sm text-[#B0B0B0]">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-[#444444] text-[#B0B0B0]">
                          {invoice.status}
                        </Badge>
                        {invoice.pdfUrl && (
                          <Button variant="ghost" size="sm" asChild className="text-[#888888] hover:text-[#E0E0E0]">
                            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#B0B0B0]">No invoices yet</p>
              )}
            </div>
            <Separator className="my-4 bg-[#444444]" />
            <Button
              variant="outline"
              className="w-full border-[#444444] text-[#E0E0E0] hover:bg-[#444444] bg-transparent"
              onClick={handleManageSubscription}
            >
              View All Invoices
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
