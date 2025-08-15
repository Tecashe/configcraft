// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import { useToast } from "@/hooks/use-toast"

// interface SubscriptionData {
//   id: string
//   plan: string
//   status: string
//   currentPeriodEnd: string
//   usage: {
//     toolsUsed: number
//     toolsLimit: number
//     teamMembers: number
//     teamLimit: number
//   }
// }

// export function useSubscription() {
//   const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const params = useParams()
//   const { toast } = useToast()
//   const orgSlug = params?.slug as string

//   const fetchSubscription = async () => {
//     if (!orgSlug) return

//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/billing/subscription`)
//       if (response.ok) {
//         const data = await response.json()
//         setSubscription(data)
//       } else {
//         throw new Error("Failed to fetch subscription")
//       }
//     } catch (error) {
//       console.error("Failed to fetch subscription:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load subscription data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchSubscription()
//   }, [orgSlug])

//   const checkLimit = (feature: "tools" | "team") => {
//     if (!subscription) return false

//     if (feature === "tools") {
//       return subscription.usage.toolsUsed >= subscription.usage.toolsLimit
//     }

//     if (feature === "team") {
//       return subscription.usage.teamMembers >= subscription.usage.teamLimit
//     }

//     return false
//   }

//   const requiresUpgrade = (feature: "tools" | "team") => {
//     return checkLimit(feature) && subscription?.plan === "FREE"
//   }

//   return {
//     subscription,
//     loading,
//     checkLimit,
//     requiresUpgrade,
//     refetch: fetchSubscription,
//   }
// }
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

interface SubscriptionLimits {
  toolsUsed: number
  toolsLimit: number
  teamMembers: number
  teamLimit: number
  plan: string
}

export function useSubscription() {
  const params = useParams()
  const organizationSlug = params.slug as string
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!organizationSlug) return

    const fetchLimits = async () => {
      try {
        const response = await fetch(`/api/organizations/${organizationSlug}/billing/subscription`)
        if (response.ok) {
          const data = await response.json()
          setLimits({
            toolsUsed: data.usage.toolsUsed,
            toolsLimit: data.usage.toolsLimit,
            teamMembers: data.usage.teamMembers,
            teamLimit: data.usage.teamLimit,
            plan: data.plan,
          })
        }
      } catch (error) {
        console.error("Failed to fetch subscription limits:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLimits()
  }, [organizationSlug])

  const canCreateTool = () => {
    return !limits || limits.toolsUsed < limits.toolsLimit
  }

  const canInviteMember = () => {
    return !limits || limits.teamMembers < limits.teamLimit
  }

  const hasFeature = (feature: string) => {
    if (!limits) return false

    const planFeatures = {
      FREE: ["basic"],
      STARTER: ["basic", "templates", "support"],
      PROFESSIONAL: ["basic", "templates", "support", "branding", "api", "analytics"],
      ENTERPRISE: ["basic", "templates", "support", "branding", "api", "analytics", "sso", "custom"],
    }

    return planFeatures[limits.plan as keyof typeof planFeatures]?.includes(feature) || false
  }

  return {
    limits,
    loading,
    canCreateTool,
    canInviteMember,
    hasFeature,
  }
}
