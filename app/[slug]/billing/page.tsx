
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Download, ExternalLink, Loader2, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UpgradeModal } from "@/components/billing/upgrade-modal"

interface SubscriptionData {
  id: string
  plan: string
  status: string
  currentPeriodEnd: string
  stripeCustomerId?: string
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
    stripeInvoiceId?: string
  }>
}

const planDetails = {
  FREE: { name: "Free", price: "$0", color: "bg-zinc-600" },
  STARTER: { name: "Starter", price: "$29", color: "bg-blue-600" },
  PROFESSIONAL: { name: "Professional", price: "$99", color: "bg-emerald-600" },
  ENTERPRISE: { name: "Enterprise", price: "Custom", color: "bg-purple-600" },
}

const statusColors = {
  ACTIVE: "bg-emerald-500",
  CANCELED: "bg-red-500",
  PAST_DUE: "bg-yellow-500",
  UNPAID: "bg-red-500",
  INCOMPLETE: "bg-yellow-500",
  TRIALING: "bg-blue-500",
}

const statusIcons = {
  ACTIVE: CheckCircle,
  CANCELED: XCircle,
  PAST_DUE: AlertTriangle,
  UNPAID: XCircle,
  INCOMPLETE: Clock,
  TRIALING: Clock,
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const params = useParams()
  const { toast } = useToast()
  const orgSlug = params?.slug as string

  useEffect(() => {
    fetchSubscription()
  }, [orgSlug])

  const fetchSubscription = async () => {
    if (!orgSlug) return

    try {
      const response = await fetch(`/api/organizations/${orgSlug}/billing/subscription`)
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      } else {
        throw new Error("Failed to fetch subscription")
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error)
      toast({
        title: "Error",
        description: "Failed to load billing information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscription?.stripeCustomerId) {
      toast({
        title: "No billing account",
        description: "Please upgrade to a paid plan first",
        variant: "destructive",
      })
      return
    }

    setActionLoading("manage")
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/billing/portal`, {
        method: "POST",
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        throw new Error("Failed to create portal session")
      }
    } catch (error) {
      console.error("Portal error:", error)
      toast({
        title: "Error",
        description: "Failed to open billing portal",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const downloadInvoice = async (invoiceId: string, stripeInvoiceId?: string) => {
    if (!stripeInvoiceId) return

    setActionLoading(`invoice-${invoiceId}`)
    try {
      // In a real implementation, you'd create an endpoint to generate invoice PDFs
      const invoiceUrl = `https://invoice.stripe.com/i/acct_${stripeInvoiceId}`
      window.open(invoiceUrl, "_blank")
    } catch (error) {
      console.error("Invoice download error:", error)
      toast({
        title: "Error",
        description: "Failed to download invoice",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">No billing information found</h2>
        <p className="text-zinc-400 mb-6">There was an error loading your billing information.</p>
        <Button onClick={fetchSubscription} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const plan = planDetails[subscription.plan as keyof typeof planDetails]
  const StatusIcon = statusIcons[subscription.status as keyof typeof statusIcons]
  const toolsProgress = (subscription.usage.toolsUsed / subscription.usage.toolsLimit) * 100
  const teamProgress = (subscription.usage.teamMembers / subscription.usage.teamLimit) * 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-zinc-400 mt-2">Manage your subscription, billing, and usage</p>
      </div>

      {/* Current Plan */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-3">
                Current Plan
                <Badge className={`${plan.color} text-white`}>{plan.name}</Badge>
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-2">
                <StatusIcon className="h-4 w-4" />
                Status: {subscription.status.toLowerCase().replace("_", " ")}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{plan.price}</div>
              {subscription.plan !== "FREE" && <div className="text-sm text-zinc-400">per month</div>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription.plan !== "FREE" && (
            <div>
              <p className="text-sm text-zinc-400 mb-2">
                Current period ends: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Usage */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Usage</h4>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300">Tools</span>
                  <span className="text-zinc-400">
                    {subscription.usage.toolsUsed} / {subscription.usage.toolsLimit}
                  </span>
                </div>
                <Progress value={toolsProgress} className="h-2" />
                {toolsProgress >= 80 && (
                  <p className="text-xs text-yellow-500 mt-1">You're approaching your tools limit</p>
                )}
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-300">Team Members</span>
                  <span className="text-zinc-400">
                    {subscription.usage.teamMembers} / {subscription.usage.teamLimit}
                  </span>
                </div>
                <Progress value={teamProgress} className="h-2" />
                {teamProgress >= 80 && (
                  <p className="text-xs text-yellow-500 mt-1">You're approaching your team limit</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => setUpgradeModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {subscription.plan === "FREE" ? "Upgrade Plan" : "Change Plan"}
            </Button>

            {subscription.stripeCustomerId && (
              <Button
                onClick={handleManageSubscription}
                disabled={actionLoading === "manage"}
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
              >
                {actionLoading === "manage" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      {subscription.stripeCustomerId && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Payment Method</CardTitle>
            <CardDescription>Manage your payment methods through the Stripe billing portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleManageSubscription}
              disabled={actionLoading === "manage"}
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              {actionLoading === "manage" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Manage Payment Methods
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Invoices */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Invoices</CardTitle>
          <CardDescription>Your recent billing history and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {subscription.invoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-400">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {subscription.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-white">
                      ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                    </p>
                    <p className="text-sm text-zinc-400">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={invoice.status === "paid" ? "default" : "destructive"}
                      className={invoice.status === "paid" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}
                    >
                      {invoice.status}
                    </Badge>
                    {invoice.stripeInvoiceId && (
                      <Button
                        onClick={() => downloadInvoice(invoice.id, invoice.stripeInvoiceId)}
                        disabled={actionLoading === `invoice-${invoice.id}`}
                        size="sm"
                        variant="outline"
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        {actionLoading === `invoice-${invoice.id}` ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {subscription.stripeCustomerId && (
                <>
                  <Separator className="bg-zinc-800" />
                  <Button
                    onClick={handleManageSubscription}
                    variant="outline"
                    className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View All Invoices
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={subscription.plan}
      />
    </div>
  )
}
