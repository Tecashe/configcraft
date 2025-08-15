// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Zap, X } from "lucide-react"
// import { UpgradeModal } from "./upgrade-modal"

// interface UpgradePromptProps {
//   feature: string
//   description: string
//   organizationSlug: string
//   currentPlan: string
//   onDismiss?: () => void
// }

// export function UpgradePrompt({ feature, description, organizationSlug, currentPlan, onDismiss }: UpgradePromptProps) {
//   const [showModal, setShowModal] = useState(false)

//   return (
//     <>
//       <Card className="border-yellow-500 bg-yellow-500/10">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <CardTitle className="text-lg flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
//               <Zap className="h-5 w-5" />
//               Upgrade Required
//             </CardTitle>
//             {onDismiss && (
//               <Button variant="ghost" size="sm" onClick={onDismiss}>
//                 <X className="h-4 w-4" />
//               </Button>
//             )}
//           </div>
//           <CardDescription className="text-yellow-600/80 dark:text-yellow-400/80">{description}</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button onClick={() => setShowModal(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
//             <Zap className="h-4 w-4 mr-2" />
//             Upgrade Now
//           </Button>
//         </CardContent>
//       </Card>

//       <UpgradeModal
//         isOpen={showModal}
//         onClose={() => setShowModal(false)}
//         currentPlan={currentPlan}
//         organizationSlug={organizationSlug}
//         feature={feature}
//       />
//     </>
//   )
// }

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap } from "lucide-react"
import { UpgradeModal } from "./upgrade-modal"

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  feature: string
  currentPlan?: string
  limit?: number
}

export function UpgradePrompt({ isOpen, onClose, feature, currentPlan = "FREE", limit }: UpgradePromptProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const getFeatureMessage = () => {
    switch (feature) {
      case "tools":
        return {
          title: "Tool Limit Reached",
          description: `You've reached your limit of ${limit} tools. Upgrade to create more custom tools and grow your business.`,
          icon: AlertTriangle,
        }
      case "team":
        return {
          title: "Team Member Limit Reached",
          description: `You've reached your limit of ${limit} team members. Upgrade to invite more people to your organization.`,
          icon: AlertTriangle,
        }
      case "api":
        return {
          title: "API Access Required",
          description:
            "API access is available on Professional and Enterprise plans. Upgrade to integrate with external services.",
          icon: Zap,
        }
      case "branding":
        return {
          title: "Custom Branding Required",
          description:
            "Custom branding is available on Professional and Enterprise plans. Upgrade to customize your tools with your brand.",
          icon: Zap,
        }
      default:
        return {
          title: "Upgrade Required",
          description: "This feature requires a paid plan. Upgrade to unlock all features.",
          icon: Zap,
        }
    }
  }

  const { title, description, icon: Icon } = getFeatureMessage()

  const handleUpgrade = () => {
    onClose()
    setShowUpgradeModal(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-900 border-zinc-800 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/10 rounded-full">
                <Icon className="h-5 w-5 text-yellow-500" />
              </div>
              <DialogTitle className="text-white">{title}</DialogTitle>
            </div>
            <DialogDescription className="text-zinc-400">{description}</DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleUpgrade} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} currentPlan={currentPlan} />
    </>
  )
}
