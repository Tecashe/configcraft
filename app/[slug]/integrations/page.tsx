// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useParams, useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { useToast } from "@/hooks/use-toast"
// import {
//   Search,
//   CheckCircle,
//   AlertCircle,
//   Settings,
//   Plus,
//   Database,
//   Cloud,
//   MessageSquare,
//   Users,
//   Loader2,
//   ExternalLink,
//   Key,
//   Zap,
//   Mail,
//   CreditCard,
//   Bot,
//   Webhook,
// } from "lucide-react"

// interface Integration {
//   id: string
//   name: string
//   description: string
//   category: string
//   icon: any
//   status: "connected" | "available"
//   setupTime: string
//   features: string[]
//   connected: boolean
//   config?: any
//   authType: "oauth" | "api_key" | "webhook"
//   provider: string
// }

// export default function IntegrationsPage() {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [activeCategory, setActiveCategory] = useState("all")
//   const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([])
//   const [loading, setLoading] = useState(true)
//   const [connecting, setConnecting] = useState<string | null>(null)
//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const orgSlug = params?.slug as string

//   // Handle OAuth callback messages
//   useEffect(() => {
//     const error = searchParams.get("error")
//     const success = searchParams.get("success")

//     if (error) {
//       toast({
//         title: "Integration Failed",
//         description: error,
//         variant: "destructive",
//       })
//       // Clean up URL
//       router.replace(`/${orgSlug}/integrations`)
//     }

//     if (success) {
//       toast({
//         title: "Integration Connected",
//         description: success,
//       })
//       // Clean up URL and refresh data
//       router.replace(`/${orgSlug}/integrations`)
//       fetchConnectedIntegrations()
//     }
//   }, [searchParams, toast, router, orgSlug])

//   const availableIntegrations: Integration[] = [
//     // OAuth Integrations
//     {
//       id: "salesforce",
//       name: "Salesforce",
//       description: "Sync customer data and sales pipeline information",
//       category: "crm",
//       icon: Users,
//       status: "available",
//       setupTime: "2 min",
//       features: ["Contact sync", "Lead management", "Opportunity tracking"],
//       connected: false,
//       authType: "oauth",
//       provider: "salesforce",
//     },
//     {
//       id: "slack",
//       name: "Slack",
//       description: "Send notifications and updates to Slack channels",
//       category: "communication",
//       icon: MessageSquare,
//       status: "available",
//       setupTime: "1 min",
//       features: ["Real-time notifications", "Channel integration", "Bot commands"],
//       connected: false,
//       authType: "oauth",
//       provider: "slack",
//     },
//     {
//       id: "google",
//       name: "Google Drive",
//       description: "Access and manage files in Google Drive and Sheets",
//       category: "storage",
//       icon: Cloud,
//       status: "available",
//       setupTime: "2 min",
//       features: ["File access", "Spreadsheet integration", "Document management"],
//       connected: false,
//       authType: "oauth",
//       provider: "google",
//     },
//     {
//       id: "github",
//       name: "GitHub",
//       description: "Integrate with GitHub repositories and issues",
//       category: "productivity",
//       icon: Bot,
//       status: "available",
//       setupTime: "2 min",
//       features: ["Repository access", "Issue tracking", "Code management"],
//       connected: false,
//       authType: "oauth",
//       provider: "github",
//     },
//     // API Key Integrations
//     {
//       id: "postgresql",
//       name: "PostgreSQL",
//       description: "Connect to PostgreSQL databases for data storage",
//       category: "database",
//       icon: Database,
//       status: "available",
//       setupTime: "5 min",
//       features: ["SQL queries", "Real-time sync", "Data validation"],
//       connected: false,
//       authType: "api_key",
//       provider: "postgresql",
//     },
//     {
//       id: "mysql",
//       name: "MySQL",
//       description: "Connect to MySQL databases for data management",
//       category: "database",
//       icon: Database,
//       status: "available",
//       setupTime: "5 min",
//       features: ["Database queries", "Data synchronization", "Schema management"],
//       connected: false,
//       authType: "api_key",
//       provider: "mysql",
//     },
//     {
//       id: "sendgrid",
//       name: "SendGrid",
//       description: "Send transactional and marketing emails",
//       category: "communication",
//       icon: Mail,
//       status: "available",
//       setupTime: "3 min",
//       features: ["Email delivery", "Template management", "Analytics"],
//       connected: false,
//       authType: "api_key",
//       provider: "sendgrid",
//     },
//     {
//       id: "stripe",
//       name: "Stripe",
//       description: "Process payments and manage subscriptions",
//       category: "payment",
//       icon: CreditCard,
//       status: "available",
//       setupTime: "4 min",
//       features: ["Payment processing", "Subscription management", "Webhooks"],
//       connected: false,
//       authType: "api_key",
//       provider: "stripe",
//     },
//     {
//       id: "openai",
//       name: "OpenAI",
//       description: "Integrate AI capabilities with GPT models",
//       category: "productivity",
//       icon: Zap,
//       status: "available",
//       setupTime: "2 min",
//       features: ["Text generation", "Chat completion", "Embeddings"],
//       connected: false,
//       authType: "api_key",
//       provider: "openai",
//     },
//     {
//       id: "webhook",
//       name: "Custom Webhook",
//       description: "Send data to any webhook endpoint",
//       category: "productivity",
//       icon: Webhook,
//       status: "available",
//       setupTime: "3 min",
//       features: ["HTTP requests", "Custom headers", "Payload formatting"],
//       connected: false,
//       authType: "webhook",
//       provider: "webhook",
//     },
//   ]

//   const categories = [
//     { id: "all", label: "All Integrations", count: availableIntegrations.length },
//     {
//       id: "communication",
//       label: "Communication",
//       count: availableIntegrations.filter((i) => i.category === "communication").length,
//     },
//     { id: "crm", label: "CRM & Sales", count: availableIntegrations.filter((i) => i.category === "crm").length },
//     {
//       id: "database",
//       label: "Databases",
//       count: availableIntegrations.filter((i) => i.category === "database").length,
//     },
//     {
//       id: "storage",
//       label: "File Storage",
//       count: availableIntegrations.filter((i) => i.category === "storage").length,
//     },
//     {
//       id: "payment",
//       label: "Payments",
//       count: availableIntegrations.filter((i) => i.category === "payment").length,
//     },
//     {
//       id: "productivity",
//       label: "Productivity",
//       count: availableIntegrations.filter((i) => i.category === "productivity").length,
//     },
//   ]

//   useEffect(() => {
//     if (orgSlug) {
//       fetchConnectedIntegrations()
//     }
//   }, [orgSlug])

//   const fetchConnectedIntegrations = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/integrations`)
//       if (response.ok) {
//         const data = await response.json()
//         setConnectedIntegrations(data)
//       }
//     } catch (error) {
//       console.error("Failed to fetch integrations:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleOAuthConnect = async (integration: Integration) => {
//     setConnecting(integration.id)
//     try {
//       // Get organization ID
//       const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
//       if (!orgResponse.ok) {
//         throw new Error("Failed to get organization")
//       }
//       const org = await orgResponse.json()

//       // Get OAuth URL
//       const response = await fetch(`/api/integrations/oauth/${integration.provider}?organizationId=${org.id}`)
//       if (!response.ok) {
//         throw new Error("Failed to initiate OAuth")
//       }

//       const { authUrl } = await response.json()

//       // Redirect to OAuth provider
//       window.location.href = authUrl
//     } catch (error) {
//       toast({
//         title: "Connection Failed",
//         description: `Failed to connect ${integration.name}. Please try again.`,
//         variant: "destructive",
//       })
//       setConnecting(null)
//     }
//   }

//   const handleApiKeyConnect = async (integration: Integration, credentials: any) => {
//     setConnecting(integration.id)
//     try {
//       // Get organization ID
//       const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
//       if (!orgResponse.ok) {
//         throw new Error("Failed to get organization")
//       }
//       const org = await orgResponse.json()

//       const response = await fetch("/api/integrations/connect", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           provider: integration.provider,
//           organizationId: org.id,
//           credentials,
//         }),
//       })

//       if (response.ok) {
//         toast({
//           title: "Integration Connected",
//           description: `${integration.name} has been successfully connected.`,
//         })
//         fetchConnectedIntegrations()
//       } else {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to connect integration")
//       }
//     } catch (error) {
//       toast({
//         title: "Connection Failed",
//         description: error instanceof Error ? error.message : `Failed to connect ${integration.name}`,
//         variant: "destructive",
//       })
//     } finally {
//       setConnecting(null)
//     }
//   }

//   const filteredIntegrations = availableIntegrations.filter((integration) => {
//     const matchesSearch =
//       integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       integration.description.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesCategory = activeCategory === "all" || integration.category === activeCategory
//     const isConnected = connectedIntegrations.some((ci) => ci.provider === integration.provider)
//     integration.connected = isConnected
//     integration.status = isConnected ? "connected" : "available"
//     return matchesSearch && matchesCategory
//   })

//   if (loading) {
//     return (
//       <div className="p-4 lg:p-6">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Integrations</h1>
//           <p className="text-muted-foreground mt-1">Connect your tools with popular services and platforms</p>
//         </div>
//         <div className="flex items-center space-x-4">
//           <Badge variant="secondary" className="text-sm">
//             {connectedIntegrations.length} Connected
//           </Badge>
//         </div>
//       </div>

//       <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
//         {/* Search and Categories */}
//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//               <Input
//                 placeholder="Search integrations..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full lg:w-auto">
//             {categories.map((category) => (
//               <TabsTrigger key={category.id} value={category.id} className="text-xs">
//                 {category.label}
//                 <Badge variant="secondary" className="ml-1 text-xs">
//                   {category.count}
//                 </Badge>
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </div>

//         {/* Connected Integrations Summary */}
//         {connectedIntegrations.length > 0 && (
//           <Card className="config-card">
//             <CardContent className="p-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="font-semibold text-foreground mb-2">Connected Integrations</h3>
//                   <div className="flex items-center space-x-4">
//                     {connectedIntegrations.slice(0, 4).map((integration) => (
//                       <div key={integration.id} className="flex items-center space-x-2">
//                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
//                           <CheckCircle className="w-4 h-4 text-primary-foreground" />
//                         </div>
//                         <span className="text-sm font-medium text-foreground">{integration.name}</span>
//                       </div>
//                     ))}
//                     {connectedIntegrations.length > 4 && (
//                       <span className="text-sm text-muted-foreground">+{connectedIntegrations.length - 4} more</span>
//                     )}
//                   </div>
//                 </div>
//                 <Button variant="outline" size="sm">
//                   <Settings className="w-4 h-4 mr-2" />
//                   Manage
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Integrations Grid */}
//         {categories.map((category) => (
//           <TabsContent key={category.id} value={category.id}>
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredIntegrations.map((integration) => (
//                 <IntegrationCard
//                   key={integration.id}
//                   integration={integration}
//                   onOAuthConnect={handleOAuthConnect}
//                   onApiKeyConnect={handleApiKeyConnect}
//                   connecting={connecting === integration.id}
//                 />
//               ))}
//             </div>

//             {filteredIntegrations.length === 0 && (
//               <div className="text-center py-12">
//                 <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//                   <Search className="w-8 h-8 text-muted-foreground" />
//                 </div>
//                 <h3 className="text-lg font-medium text-foreground mb-2">No integrations found</h3>
//                 <p className="text-muted-foreground">Try adjusting your search or browse different categories</p>
//               </div>
//             )}
//           </TabsContent>
//         ))}
//       </Tabs>
//     </div>
//   )
// }

// function IntegrationCard({
//   integration,
//   onOAuthConnect,
//   onApiKeyConnect,
//   connecting,
// }: {
//   integration: Integration
//   onOAuthConnect: (integration: Integration) => void
//   onApiKeyConnect: (integration: Integration, credentials: any) => void
//   connecting: boolean
// }) {
//   const [credentials, setCredentials] = useState<any>({})
//   const [dialogOpen, setDialogOpen] = useState(false)

//   const handleConnect = () => {
//     if (integration.authType === "oauth") {
//       onOAuthConnect(integration)
//     } else {
//       // For API key and webhook integrations, open dialog
//       setDialogOpen(true)
//     }
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     onApiKeyConnect(integration, credentials)
//     setDialogOpen(false)
//     setCredentials({})
//   }

//   const getCredentialFields = () => {
//     switch (integration.provider) {
//       case "postgresql":
//         return [
//           { key: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
//           { key: "port", label: "Port", type: "number", required: true, placeholder: "5432" },
//           { key: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
//           { key: "username", label: "Username", type: "text", required: true },
//           { key: "password", label: "Password", type: "password", required: true },
//         ]
//       case "mysql":
//         return [
//           { key: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
//           { key: "port", label: "Port", type: "number", required: true, placeholder: "3306" },
//           { key: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
//           { key: "username", label: "Username", type: "text", required: true },
//           { key: "password", label: "Password", type: "password", required: true },
//         ]
//       case "sendgrid":
//         return [{ key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "SG.xxx" }]
//       case "stripe":
//         return [{ key: "secretKey", label: "Secret Key", type: "password", required: true, placeholder: "sk_xxx" }]
//       case "openai":
//         return [{ key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-xxx" }]
//       case "webhook":
//         return [
//           {
//             key: "url",
//             label: "Webhook URL",
//             type: "url",
//             required: true,
//             placeholder: "https://api.example.com/webhook",
//           },
//           { key: "method", label: "HTTP Method", type: "select", required: false, options: ["POST", "PUT", "PATCH"] },
//         ]
//       default:
//         return [{ key: "apiKey", label: "API Key", type: "password", required: true }]
//     }
//   }

//   const getAuthIcon = () => {
//     switch (integration.authType) {
//       case "oauth":
//         return <ExternalLink className="w-3 h-3" />
//       case "api_key":
//         return <Key className="w-3 h-3" />
//       case "webhook":
//         return <Webhook className="w-3 h-3" />
//       default:
//         return <Plus className="w-3 h-3" />
//     }
//   }

//   return (
//     <Card className="config-card hover:border-primary/50 transition-colors">
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
//               <integration.icon className="w-6 h-6 text-muted-foreground" />
//             </div>
//             <div>
//               <CardTitle className="text-lg text-foreground">{integration.name}</CardTitle>
//               <div className="flex items-center space-x-2 mt-1">
//                 {integration.connected ? (
//                   <Badge className="bg-status-success text-white text-xs">
//                     <CheckCircle className="w-3 h-3 mr-1" />
//                     Connected
//                   </Badge>
//                 ) : (
//                   <Badge variant="outline" className="text-xs">
//                     Available
//                   </Badge>
//                 )}
//                 <Badge variant="outline" className="text-xs">
//                   {integration.authType === "oauth"
//                     ? "OAuth"
//                     : integration.authType === "api_key"
//                       ? "API Key"
//                       : "Webhook"}
//                 </Badge>
//                 <span className="text-xs text-muted-foreground">{integration.setupTime} setup</span>
//               </div>
//             </div>
//           </div>
//         </div>
//         <CardDescription className="mt-2 text-muted-foreground">{integration.description}</CardDescription>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="space-y-4">
//           <div>
//             <h4 className="text-sm font-medium text-foreground mb-2">Features</h4>
//             <ul className="text-xs text-muted-foreground space-y-1">
//               {integration.features.map((feature, index) => (
//                 <li key={index} className="flex items-center">
//                   <div className="w-1 h-1 bg-primary rounded-full mr-2" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="flex space-x-2">
//             {integration.connected ? (
//               <>
//                 <Button variant="outline" size="sm" className="flex-1 bg-transparent">
//                   <Settings className="w-3 h-3 mr-2" />
//                   Configure
//                 </Button>
//                 <Button variant="outline" size="sm">
//                   <AlertCircle className="w-3 h-3" />
//                 </Button>
//               </>
//             ) : (
//               <>
//                 {integration.authType === "oauth" ? (
//                   <Button
//                     size="sm"
//                     className="flex-1 config-button-primary"
//                     disabled={connecting}
//                     onClick={handleConnect}
//                   >
//                     {connecting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : getAuthIcon()}
//                     {connecting ? "Connecting..." : "Connect"}
//                   </Button>
//                 ) : (
//                   <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                     <DialogTrigger asChild>
//                       <Button size="sm" className="flex-1 config-button-primary" disabled={connecting}>
//                         {connecting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : getAuthIcon()}
//                         Connect
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-md">
//                       <DialogHeader>
//                         <DialogTitle>Connect {integration.name}</DialogTitle>
//                         <DialogDescription>
//                           Enter your {integration.name} credentials to connect this integration.
//                         </DialogDescription>
//                       </DialogHeader>
//                       <form onSubmit={handleSubmit} className="space-y-4">
//                         {getCredentialFields().map((field) => (
//                           <div key={field.key}>
//                             <Label htmlFor={field.key}>
//                               {field.label} {field.required && <span className="text-status-error">*</span>}
//                             </Label>
//                             {field.type === "select" ? (
//                               <select
//                                 id={field.key}
//                                 required={field.required}
//                                 value={credentials[field.key] || "POST"}
//                                 onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
//                                 className="w-full px-3 py-2 border border-input rounded-md"
//                               >
//                                 {field.options?.map((option) => (
//                                   <option key={option} value={option}>
//                                     {option}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <Input
//                                 id={field.key}
//                                 type={field.type}
//                                 placeholder={field.placeholder}
//                                 required={field.required}
//                                 value={credentials[field.key] || ""}
//                                 onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
//                               />
//                             )}
//                           </div>
//                         ))}
//                         <div className="flex justify-end space-x-2">
//                           <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
//                             Cancel
//                           </Button>
//                           <Button type="submit" className="config-button-primary" disabled={connecting}>
//                             {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
//                           </Button>
//                         </div>
//                       </form>
//                     </DialogContent>
//                   </Dialog>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Database,
  Cloud,
  MessageSquare,
  Users,
  Loader2,
  ExternalLink,
  Key,
  Zap,
  Mail,
  CreditCard,
  Bot,
  Webhook,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: any
  status: "connected" | "available"
  setupTime: string
  features: string[]
  connected: boolean
  config?: any
  authType: "oauth" | "api_key" | "webhook"
  provider: string
}

interface CredentialField {
  key: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgSlug = params?.slug as string

  // Handle OAuth callback messages
  useEffect(() => {
    const error = searchParams.get("error")
    const success = searchParams.get("success")

    if (error) {
      toast({
        title: "Integration Failed",
        description: error,
        variant: "destructive",
      })
      // Clean up URL
      router.replace(`/${orgSlug}/integrations`)
    }

    if (success) {
      toast({
        title: "Integration Connected",
        description: success,
      })
      // Clean up URL and refresh data
      router.replace(`/${orgSlug}/integrations`)
      fetchConnectedIntegrations()
    }
  }, [searchParams, toast, router, orgSlug])

  const availableIntegrations: Integration[] = [
    // OAuth Integrations
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sync customer data and sales pipeline information",
      category: "crm",
      icon: Users,
      status: "available",
      setupTime: "2 min",
      features: ["Contact sync", "Lead management", "Opportunity tracking"],
      connected: false,
      authType: "oauth",
      provider: "salesforce",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Send notifications and updates to Slack channels",
      category: "communication",
      icon: MessageSquare,
      status: "available",
      setupTime: "1 min",
      features: ["Real-time notifications", "Channel integration", "Bot commands"],
      connected: false,
      authType: "oauth",
      provider: "slack",
    },
    {
      id: "google",
      name: "Google Drive",
      description: "Access and manage files in Google Drive and Sheets",
      category: "storage",
      icon: Cloud,
      status: "available",
      setupTime: "2 min",
      features: ["File access", "Spreadsheet integration", "Document management"],
      connected: false,
      authType: "oauth",
      provider: "google",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Integrate with GitHub repositories and issues",
      category: "productivity",
      icon: Bot,
      status: "available",
      setupTime: "2 min",
      features: ["Repository access", "Issue tracking", "Code management"],
      connected: false,
      authType: "oauth",
      provider: "github",
    },
    // API Key Integrations
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "Connect to PostgreSQL databases for data storage",
      category: "database",
      icon: Database,
      status: "available",
      setupTime: "5 min",
      features: ["SQL queries", "Real-time sync", "Data validation"],
      connected: false,
      authType: "api_key",
      provider: "postgresql",
    },
    {
      id: "mysql",
      name: "MySQL",
      description: "Connect to MySQL databases for data management",
      category: "database",
      icon: Database,
      status: "available",
      setupTime: "5 min",
      features: ["Database queries", "Data synchronization", "Schema management"],
      connected: false,
      authType: "api_key",
      provider: "mysql",
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Send transactional and marketing emails",
      category: "communication",
      icon: Mail,
      status: "available",
      setupTime: "3 min",
      features: ["Email delivery", "Template management", "Analytics"],
      connected: false,
      authType: "api_key",
      provider: "sendgrid",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      category: "payment",
      icon: CreditCard,
      status: "available",
      setupTime: "4 min",
      features: ["Payment processing", "Subscription management", "Webhooks"],
      connected: false,
      authType: "api_key",
      provider: "stripe",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Integrate AI capabilities with GPT models",
      category: "productivity",
      icon: Zap,
      status: "available",
      setupTime: "2 min",
      features: ["Text generation", "Chat completion", "Embeddings"],
      connected: false,
      authType: "api_key",
      provider: "openai",
    },
    {
      id: "webhook",
      name: "Custom Webhook",
      description: "Send data to any webhook endpoint",
      category: "productivity",
      icon: Webhook,
      status: "available",
      setupTime: "3 min",
      features: ["HTTP requests", "Custom headers", "Payload formatting"],
      connected: false,
      authType: "webhook",
      provider: "webhook",
    },
  ]

  const categories = [
    { id: "all", label: "All Integrations", count: availableIntegrations.length },
    {
      id: "communication",
      label: "Communication",
      count: availableIntegrations.filter((i) => i.category === "communication").length,
    },
    { id: "crm", label: "CRM & Sales", count: availableIntegrations.filter((i) => i.category === "crm").length },
    {
      id: "database",
      label: "Databases",
      count: availableIntegrations.filter((i) => i.category === "database").length,
    },
    {
      id: "storage",
      label: "File Storage",
      count: availableIntegrations.filter((i) => i.category === "storage").length,
    },
    {
      id: "payment",
      label: "Payments",
      count: availableIntegrations.filter((i) => i.category === "payment").length,
    },
    {
      id: "productivity",
      label: "Productivity",
      count: availableIntegrations.filter((i) => i.category === "productivity").length,
    },
  ]

  useEffect(() => {
    if (orgSlug) {
      fetchConnectedIntegrations()
    }
  }, [orgSlug])

  const fetchConnectedIntegrations = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/integrations`)
      if (response.ok) {
        const data = await response.json()
        setConnectedIntegrations(data)
      }
    } catch (error) {
      console.error("Failed to fetch integrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuthConnect = async (integration: Integration) => {
    setConnecting(integration.id)
    try {
      // Get organization ID
      const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
      if (!orgResponse.ok) {
        throw new Error("Failed to get organization")
      }
      const org = await orgResponse.json()

      // Get OAuth URL
      const response = await fetch(`/api/integrations/oauth/${integration.provider}?organizationId=${org.id}`)
      if (!response.ok) {
        throw new Error("Failed to initiate OAuth")
      }

      const { authUrl } = await response.json()

      // Redirect to OAuth provider
      window.location.href = authUrl
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${integration.name}. Please try again.`,
        variant: "destructive",
      })
      setConnecting(null)
    }
  }

  const handleApiKeyConnect = async (integration: Integration, credentials: any) => {
    setConnecting(integration.id)
    try {
      // Get organization ID
      const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
      if (!orgResponse.ok) {
        throw new Error("Failed to get organization")
      }
      const org = await orgResponse.json()

      const response = await fetch("/api/integrations/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: integration.provider,
          organizationId: org.id,
          credentials,
        }),
      })

      if (response.ok) {
        toast({
          title: "Integration Connected",
          description: `${integration.name} has been successfully connected.`,
        })
        fetchConnectedIntegrations()
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to connect integration")
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : `Failed to connect ${integration.name}`,
        variant: "destructive",
      })
    } finally {
      setConnecting(null)
    }
  }

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory
    const isConnected = connectedIntegrations.some((ci) => ci.provider === integration.provider)
    integration.connected = isConnected
    integration.status = isConnected ? "connected" : "available"
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect your tools with popular services and platforms</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {connectedIntegrations.length} Connected
          </Badge>
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        {/* Search and Categories */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full lg:w-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Connected Integrations Summary */}
        {connectedIntegrations.length > 0 && (
          <Card className="config-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Connected Integrations</h3>
                  <div className="flex items-center space-x-4">
                    {connectedIntegrations.slice(0, 4).map((integration) => (
                      <div key={integration.id} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{integration.name}</span>
                      </div>
                    ))}
                    {connectedIntegrations.length > 4 && (
                      <span className="text-sm text-muted-foreground">+{connectedIntegrations.length - 4} more</span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Integrations Grid */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onOAuthConnect={handleOAuthConnect}
                  onApiKeyConnect={handleApiKeyConnect}
                  connecting={connecting === integration.id}
                />
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No integrations found</h3>
                <p className="text-muted-foreground">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function IntegrationCard({
  integration,
  onOAuthConnect,
  onApiKeyConnect,
  connecting,
}: {
  integration: Integration
  onOAuthConnect: (integration: Integration) => void
  onApiKeyConnect: (integration: Integration, credentials: any) => void
  connecting: boolean
}) {
  const [credentials, setCredentials] = useState<any>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleConnect = () => {
    if (integration.authType === "oauth") {
      onOAuthConnect(integration)
    } else {
      // For API key and webhook integrations, open dialog
      setDialogOpen(true)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onApiKeyConnect(integration, credentials)
    setDialogOpen(false)
    setCredentials({})
  }

  const getCredentialFields = (): CredentialField[] => {
    switch (integration.provider) {
      case "postgresql":
        return [
          { key: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
          { key: "port", label: "Port", type: "number", required: true, placeholder: "5432" },
          { key: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ]
      case "mysql":
        return [
          { key: "host", label: "Host", type: "text", required: true, placeholder: "localhost" },
          { key: "port", label: "Port", type: "number", required: true, placeholder: "3306" },
          { key: "database", label: "Database", type: "text", required: true, placeholder: "mydb" },
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ]
      case "sendgrid":
        return [{ key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "SG.xxx" }]
      case "stripe":
        return [{ key: "secretKey", label: "Secret Key", type: "password", required: true, placeholder: "sk_xxx" }]
      case "openai":
        return [{ key: "apiKey", label: "API Key", type: "password", required: true, placeholder: "sk-xxx" }]
      case "webhook":
        return [
          {
            key: "url",
            label: "Webhook URL",
            type: "url",
            required: true,
            placeholder: "https://api.example.com/webhook",
          },
          { key: "method", label: "HTTP Method", type: "select", required: false, options: ["POST", "PUT", "PATCH"] },
        ]
      default:
        return [{ key: "apiKey", label: "API Key", type: "password", required: true }]
    }
  }

  const getAuthIcon = () => {
    switch (integration.authType) {
      case "oauth":
        return <ExternalLink className="w-3 h-3" />
      case "api_key":
        return <Key className="w-3 h-3" />
      case "webhook":
        return <Webhook className="w-3 h-3" />
      default:
        return <Plus className="w-3 h-3" />
    }
  }

  return (
    <Card className="config-card hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <integration.icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{integration.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {integration.connected ? (
                  <Badge className="bg-status-success text-white text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {integration.authType === "oauth"
                    ? "OAuth"
                    : integration.authType === "api_key"
                      ? "API Key"
                      : "Webhook"}
                </Badge>
                <span className="text-xs text-muted-foreground">{integration.setupTime} setup</span>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2 text-muted-foreground">{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Features</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {integration.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-1 h-1 bg-primary rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex space-x-2">
            {integration.connected ? (
              <>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Settings className="w-3 h-3 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm">
                  <AlertCircle className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <>
                {integration.authType === "oauth" ? (
                  <Button
                    size="sm"
                    className="flex-1 config-button-primary"
                    disabled={connecting}
                    onClick={handleConnect}
                  >
                    {connecting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : getAuthIcon()}
                    {connecting ? "Connecting..." : "Connect"}
                  </Button>
                ) : (
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex-1 config-button-primary" disabled={connecting}>
                        {connecting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : getAuthIcon()}
                        Connect
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Connect {integration.name}</DialogTitle>
                        <DialogDescription>
                          Enter your {integration.name} credentials to connect this integration.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {getCredentialFields().map((field) => (
                          <div key={field.key}>
                            <Label htmlFor={field.key}>
                              {field.label} {field.required && <span className="text-status-error">*</span>}
                            </Label>
                            {field.type === "select" && field.options ? (
                              <select
                                id={field.key}
                                required={field.required}
                                value={credentials[field.key] || "POST"}
                                onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                                className="w-full px-3 py-2 border border-input rounded-md"
                              >
                                {field.options.map((option: string) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <Input
                                id={field.key}
                                type={field.type}
                                placeholder={field.placeholder}
                                required={field.required}
                                value={credentials[field.key] || ""}
                                onChange={(e) => setCredentials({ ...credentials, [field.key]: e.target.value })}
                              />
                            )}
                          </div>
                        ))}
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" className="config-button-primary" disabled={connecting}>
                            {connecting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
