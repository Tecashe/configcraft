// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import {
//   Search,
//   Plus,
//   MoreHorizontal,
//   Eye,
//   Trash2,
//   ExternalLink,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Wrench,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Tool {
//   id: string
//   name: string
//   description: string
//   category: string
//   status: "DRAFT" | "GENERATING" | "GENERATED" | "PUBLISHED" | "ERROR"
//   generationStatus: "pending" | "generating" | "generated" | "error"
//   createdAt: string
//   updatedAt: string
//   previewUrl?: string
//   publishedUrl?: string
//   generationError?: string
// }

// export default function ToolsPage() {
//   const [tools, setTools] = useState<Tool[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [activeTab, setActiveTab] = useState("all")
//   const { toast } = useToast()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   useEffect(() => {
//     if (orgSlug) {
//       fetchTools()
//     }
//   }, [orgSlug])

//   const fetchTools = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools`)
//       if (response.ok) {
//         const data = await response.json()
//         setTools(data)
//       }
//     } catch (error) {
//       console.error("Failed to fetch tools:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load tools",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (toolId: string) => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
//         method: "DELETE",
//       })
//       if (response.ok) {
//         setTools(tools.filter((tool) => tool.id !== toolId))
//         toast({
//           title: "Tool Deleted",
//           description: "Tool has been successfully deleted.",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to delete tool",
//         variant: "destructive",
//       })
//     }
//   }

//   const filteredTools = tools.filter((tool) => {
//     const matchesSearch =
//       tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       tool.category.toLowerCase().includes(searchQuery.toLowerCase())

//     const matchesTab =
//       activeTab === "all" ||
//       (activeTab === "published" && tool.status === "PUBLISHED") ||
//       (activeTab === "draft" && tool.status === "DRAFT") ||
//       (activeTab === "generating" && tool.status === "GENERATING")

//     return matchesSearch && matchesTab
//   })

//   const getStatusIcon = (status: string, generationStatus: string) => {
//     switch (status) {
//       case "PUBLISHED":
//         return <CheckCircle className="h-4 w-4 text-status-success" />
//       case "GENERATING":
//         return <Loader2 className="h-4 w-4 text-status-info animate-spin" />
//       case "ERROR":
//         return <AlertCircle className="h-4 w-4 text-status-error" />
//       default:
//         return <Clock className="h-4 w-4 text-muted-foreground" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PUBLISHED":
//         return "bg-status-success text-white"
//       case "GENERATING":
//         return "bg-status-info text-white"
//       case "GENERATED":
//         return "bg-primary text-primary-foreground"
//       case "ERROR":
//         return "bg-status-error text-white"
//       default:
//         return "bg-muted text-muted-foreground"
//     }
//   }

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
//           <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tools</h1>
//           <p className="text-muted-foreground mt-1">Manage your custom business tools</p>
//         </div>
//         <Link href={`/${orgSlug}/tools/create`}>
//           <Button className="config-button-primary">
//             <Plus className="h-4 w-4 mr-2" />
//             Create Tool
//           </Button>
//         </Link>
//       </div>

//       {/* Search and Filters */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <div className="relative">
//             <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Search tools..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Tabs */}
//       <Tabs value={activeTab} onValueChange={setActiveTab}>
//         <TabsList>
//           <TabsTrigger value="all">All Tools ({tools.length})</TabsTrigger>
//           <TabsTrigger value="published">
//             Published ({tools.filter((t) => t.status === "PUBLISHED").length})
//           </TabsTrigger>
//           <TabsTrigger value="draft">Draft ({tools.filter((t) => t.status === "DRAFT").length})</TabsTrigger>
//           <TabsTrigger value="generating">
//             Generating ({tools.filter((t) => t.status === "GENERATING").length})
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value={activeTab} className="mt-6">
//           {filteredTools.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredTools.map((tool) => (
//                 <Card key={tool.id} className="config-card hover:border-primary/50 transition-colors">
//                   <CardHeader className="pb-3">
//                     <div className="flex items-start justify-between">
//                       <div className="flex-1">
//                         <CardTitle className="text-lg text-foreground mb-1">{tool.name}</CardTitle>
//                         <CardDescription className="text-muted-foreground text-sm">{tool.description}</CardDescription>
//                       </div>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end">
//                           <DropdownMenuItem asChild>
//                             <Link href={`/${orgSlug}/tools/${tool.id}`}>
//                               <Eye className="h-4 w-4 mr-2" />
//                               View Details
//                             </Link>
//                           </DropdownMenuItem>
//                           {tool.previewUrl && (
//                             <DropdownMenuItem asChild>
//                               <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
//                                 <ExternalLink className="h-4 w-4 mr-2" />
//                                 Open Preview
//                               </a>
//                             </DropdownMenuItem>
//                           )}
//                           <DropdownMenuItem onClick={() => handleDelete(tool.id)} className="text-status-error">
//                             <Trash2 className="h-4 w-4 mr-2" />
//                             Delete
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </div>
//                   </CardHeader>
//                   <CardContent className="pt-0">
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <Badge variant="secondary" className="text-xs">
//                           {tool.category}
//                         </Badge>
//                         <div className="flex items-center space-x-2">
//                           {getStatusIcon(tool.status, tool.generationStatus)}
//                           <Badge className={`text-xs ${getStatusColor(tool.status)}`}>{tool.status}</Badge>
//                         </div>
//                       </div>

//                       {tool.generationError && (
//                         <div className="text-xs text-status-error bg-status-error/10 p-2 rounded">
//                           {tool.generationError}
//                         </div>
//                       )}

//                       <div className="flex items-center justify-between text-xs text-muted-foreground">
//                         <span>Created {new Date(tool.createdAt).toLocaleDateString()}</span>
//                         <span>Updated {new Date(tool.updatedAt).toLocaleDateString()}</span>
//                       </div>

//                       <div className="flex space-x-2">
//                         <Link href={`/${orgSlug}/tools/${tool.id}`} className="flex-1">
//                           <Button variant="outline" size="sm" className="w-full bg-transparent">
//                             View Details
//                           </Button>
//                         </Link>
//                         {tool.previewUrl && (
//                           <Button variant="outline" size="sm" asChild>
//                             <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="h-4 w-4" />
//                             </a>
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//                 {searchQuery ? (
//                   <Search className="w-8 h-8 text-muted-foreground" />
//                 ) : (
//                   <Wrench className="w-8 h-8 text-muted-foreground" />
//                 )}
//               </div>
//               <h3 className="text-lg font-medium text-foreground mb-2">
//                 {searchQuery ? "No tools found" : "No tools yet"}
//               </h3>
//               <p className="text-muted-foreground mb-4">
//                 {searchQuery ? "Try adjusting your search terms" : "Create your first tool to get started"}
//               </p>
//               {!searchQuery && (
//                 <Link href={`/${orgSlug}/tools/create`}>
//                   <Button className="config-button-primary">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Create Your First Tool
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import {
//   Plus,
//   Search,
//   Filter,
//   MoreHorizontal,
//   Eye,
//   Globe,
//   Trash2,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   Loader2,
//   Lock,
//   Sparkles,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Tool {
//   id: string
//   name: string
//   description?: string
//   category?: string
//   status: string
//   generationStatus: string
//   createdAt: string
//   updatedAt: string
//   previewUrl?: string
//   publishedUrl?: string
//   generationError?: string
// }

// interface Subscription {
//   plan: string
//   toolsLimit: number
//   toolsUsed: number
// }

// export default function ToolsPage() {
//   const [tools, setTools] = useState<Tool[]>([])
//   const [subscription, setSubscription] = useState<Subscription | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [deleting, setDeleting] = useState<string | null>(null)

//   const { toast } = useToast()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   useEffect(() => {
//     if (orgSlug) {
//       fetchTools()
//       fetchSubscription()
//     }
//   }, [orgSlug])

//   const fetchTools = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools`)
//       if (response.ok) {
//         const toolsData = await response.json()
//         setTools(toolsData)
//       }
//     } catch (error) {
//       console.error("Failed to fetch tools:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load tools",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const fetchSubscription = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/billing/subscription`)
//       if (response.ok) {
//         const subData = await response.json()
//         setSubscription({
//           plan: subData.plan,
//           toolsLimit: subData.toolsLimit || subData.usage?.toolsLimit || 1,
//           toolsUsed: subData.usage?.toolsUsed || tools.length,
//         })
//       }
//     } catch (error) {
//       console.error("Failed to fetch subscription:", error)
//     }
//   }

//   const handleDeleteTool = async (toolId: string) => {
//     if (!confirm("Are you sure you want to delete this tool? This action cannot be undone.")) {
//       return
//     }

//     setDeleting(toolId)
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setTools(tools.filter((tool) => tool.id !== toolId))
//         toast({
//           title: "Tool Deleted",
//           description: "The tool has been permanently deleted.",
//         })
//       } else {
//         throw new Error("Failed to delete tool")
//       }
//     } catch (error) {
//       toast({
//         title: "Delete Failed",
//         description: "Failed to delete the tool. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setDeleting(null)
//     }
//   }

//   const getStatusIcon = (status: string, generationStatus: string) => {
//     switch (status) {
//       case "PUBLISHED":
//         return <CheckCircle className="h-4 w-4 text-green-400" />
//       case "GENERATING":
//         return <Loader2 className="h-4 w-4 text-[#888888] animate-spin" />
//       case "ERROR":
//         return <AlertTriangle className="h-4 w-4 text-red-400" />
//       case "GENERATED":
//         return <Eye className="h-4 w-4 text-emerald-400" />
//       default:
//         return <Clock className="h-4 w-4 text-[#B0B0B0]" />
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PUBLISHED":
//         return "bg-green-500/10 text-green-400 border-green-500/20"
//       case "GENERATING":
//         return "bg-[#888888]/10 text-[#888888] border-[#888888]/20"
//       case "GENERATED":
//         return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//       case "ERROR":
//         return "bg-red-500/10 text-red-400 border-red-500/20"
//       default:
//         return "bg-[#444444]/10 text-[#B0B0B0] border-[#444444]/20"
//     }
//   }

//   const filteredTools = tools.filter((tool) => {
//     const matchesSearch =
//       tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
//     const matchesStatus = statusFilter === "all" || tool.status.toLowerCase() === statusFilter.toLowerCase()
//     return matchesSearch && matchesStatus
//   })

//   const toolsByStatus = {
//     all: tools.length,
//     draft: tools.filter((t) => t.status === "DRAFT").length,
//     generating: tools.filter((t) => t.status === "GENERATING").length,
//     generated: tools.filter((t) => t.status === "GENERATED").length,
//     published: tools.filter((t) => t.status === "PUBLISHED").length,
//     error: tools.filter((t) => t.status === "ERROR").length,
//   }

//   const canCreateTool = !subscription || subscription.toolsUsed < subscription.toolsLimit
//   const isNearLimit = subscription && subscription.toolsUsed / subscription.toolsLimit > 0.8

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] bg-[#121212]">
//         <Loader2 className="h-8 w-8 animate-spin text-[#888888]" />
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#121212] text-white">
//       <div className="p-6 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-[#E0E0E0]">Tools</h1>
//             <p className="text-[#B0B0B0]">
//               Create and manage your custom business tools
//               {subscription && (
//                 <span className="ml-2 text-[#E0E0E0]">
//                   ({subscription.toolsUsed}/{subscription.toolsLimit} used)
//                 </span>
//               )}
//             </p>
//           </div>
//           <div className="flex items-center space-x-3">
//             {!canCreateTool && (
//               <div className="flex items-center space-x-2 text-sm text-orange-400">
//                 <Lock className="h-4 w-4" />
//                 <span>Tool limit reached</span>
//               </div>
//             )}
//             <Link href={canCreateTool ? `/${orgSlug}/tools/create` : `/${orgSlug}/billing`}>
//               <Button disabled={!canCreateTool} className="bg-[#888888] hover:bg-[#666666] text-[#121212] border-0">
//                 <Plus className="h-4 w-4 mr-2" />
//                 {canCreateTool ? "Create Tool" : "Upgrade Plan"}
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Usage Warning */}
//         {isNearLimit && canCreateTool && (
//           <Card className="border-orange-500/20 bg-orange-500/5">
//             <CardContent className="pt-6">
//               <div className="flex items-center gap-3">
//                 <AlertTriangle className="h-5 w-5 text-orange-400" />
//                 <div className="flex-1">
//                   <p className="font-medium text-orange-300">Approaching Tool Limit</p>
//                   <p className="text-sm text-orange-400">
//                     You're using {subscription?.toolsUsed} of {subscription?.toolsLimit} tools. Consider upgrading to
//                     create more tools.
//                   </p>
//                 </div>
//                 <Link href={`/${orgSlug}/billing`}>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="bg-transparent border-orange-500/20 text-orange-300 hover:bg-orange-500/10"
//                   >
//                     Upgrade Plan
//                   </Button>
//                 </Link>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Search and Filters */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search tools..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//             />
//           </div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="bg-[#444444] border-[#444444] text-[#B0B0B0] hover:bg-[#666666]">
//                 <Filter className="h-4 w-4 mr-2" />
//                 Status: {statusFilter === "all" ? "All" : statusFilter}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="bg-[#444444] border-[#444444]">
//               <DropdownMenuItem onClick={() => setStatusFilter("all")} className="text-[#E0E0E0] hover:bg-[#666666]">
//                 All ({toolsByStatus.all})
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setStatusFilter("draft")} className="text-[#E0E0E0] hover:bg-[#666666]">
//                 Draft ({toolsByStatus.draft})
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setStatusFilter("generating")}
//                 className="text-[#E0E0E0] hover:bg-[#666666]"
//               >
//                 Generating ({toolsByStatus.generating})
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setStatusFilter("generated")}
//                 className="text-[#E0E0E0] hover:bg-[#666666]"
//               >
//                 Generated ({toolsByStatus.generated})
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setStatusFilter("published")}
//                 className="text-[#E0E0E0] hover:bg-[#666666]"
//               >
//                 Published ({toolsByStatus.published})
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setStatusFilter("error")} className="text-[#E0E0E0] hover:bg-[#666666]">
//                 Error ({toolsByStatus.error})
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Tools Grid */}
//         {filteredTools.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredTools.map((tool) => (
//               <Card key={tool.id} className="bg-[#121212] border-[#444444] hover:bg-[#444444] transition-colors">
//                 <CardHeader className="pb-3">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center space-x-2">
//                       {getStatusIcon(tool.status, tool.generationStatus)}
//                       <CardTitle className="text-lg text-[#E0E0E0]">{tool.name}</CardTitle>
//                     </div>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#666666]"
//                         >
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="bg-[#444444] border-[#444444]">
//                         <DropdownMenuItem asChild className="text-[#E0E0E0] hover:bg-[#666666]">
//                           <Link href={`/${orgSlug}/tools/${tool.id}`}>
//                             <Eye className="h-4 w-4 mr-2" />
//                             View Details
//                           </Link>
//                         </DropdownMenuItem>
//                         {tool.publishedUrl && (
//                           <DropdownMenuItem asChild className="text-[#E0E0E0] hover:bg-[#666666]">
//                             <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
//                               <Globe className="h-4 w-4 mr-2" />
//                               Open Tool
//                             </a>
//                           </DropdownMenuItem>
//                         )}
//                         <DropdownMenuItem
//                           onClick={() => handleDeleteTool(tool.id)}
//                           className="text-red-400 hover:bg-red-500/10"
//                           disabled={deleting === tool.id}
//                         >
//                           {deleting === tool.id ? (
//                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           ) : (
//                             <Trash2 className="h-4 w-4 mr-2" />
//                           )}
//                           Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <Badge className={`text-xs ${getStatusColor(tool.status)}`}>{tool.status}</Badge>
//                     {tool.category && (
//                       <Badge variant="outline" className="text-xs border-[#444444] text-[#B0B0B0]">
//                         {tool.category}
//                       </Badge>
//                     )}
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <CardDescription className="mb-4 line-clamp-2 text-[#B0B0B0]">
//                     {tool.description || "No description provided"}
//                   </CardDescription>
//                   <div className="flex items-center justify-between text-sm text-[#B0B0B0]">
//                     <span>Created {new Date(tool.createdAt).toLocaleDateString()}</span>
//                     {tool.status === "GENERATING" && (
//                       <span className="text-[#888888] capitalize">{tool.generationStatus}</span>
//                     )}
//                   </div>
//                   {tool.generationError && (
//                     <div className="mt-2 p-2 bg-red-500/10 rounded text-xs text-red-400">{tool.generationError}</div>
//                   )}
//                   <div className="flex items-center space-x-2 mt-4">
//                     <Link href={`/${orgSlug}/tools/${tool.id}`} className="flex-1">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="w-full bg-transparent border-[#444444] text-[#B0B0B0] hover:bg-[#666666]"
//                       >
//                         <Eye className="h-4 w-4 mr-2" />
//                         View
//                       </Button>
//                     </Link>
//                     {tool.publishedUrl && (
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         asChild
//                         className="border-[#444444] text-[#B0B0B0] hover:bg-[#666666] bg-transparent"
//                       >
//                         <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
//                           <Globe className="h-4 w-4" />
//                         </a>
//                       </Button>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card className="bg-[#121212] border-[#444444]">
//             <CardContent className="flex flex-col items-center justify-center py-16">
//               <div className="w-16 h-16 bg-[#444444] rounded-full flex items-center justify-center mb-4">
//                 <Sparkles className="h-8 w-8 text-[#B0B0B0]" />
//               </div>
//               <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">
//                 {searchQuery || statusFilter !== "all" ? "No tools found" : "No tools yet"}
//               </h3>
//               <p className="text-[#B0B0B0] text-center mb-6 max-w-md">
//                 {searchQuery || statusFilter !== "all"
//                   ? "Try adjusting your search or filter criteria."
//                   : "Create your first custom business tool with AI assistance."}
//               </p>
//               {!searchQuery && statusFilter === "all" && (
//                 <Link href={canCreateTool ? `/${orgSlug}/tools/create` : `/${orgSlug}/billing`}>
//                   <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
//                     <Plus className="h-4 w-4 mr-2" />
//                     {canCreateTool ? "Create Your First Tool" : "Upgrade to Create Tools"}
//                   </Button>
//                 </Link>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import {
//   Plus,
//   Search,
//   Eye,
//   Globe,
//   Trash2,
//   AlertTriangle,
//   CheckCircle,
//   Clock,
//   Loader2,
//   Sparkles,
//   Code2,
//   Zap,
//   TrendingUp,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// interface Tool {
//   id: string
//   name: string
//   description?: string
//   category?: string
//   status: string
//   generationStatus: string
//   createdAt: string
//   updatedAt: string
//   previewUrl?: string
//   publishedUrl?: string
//   generationError?: string
// }

// export default function ToolsPage() {
//   const [tools, setTools] = useState<Tool[]>([])
//   const [loading, setLoading] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [statusFilter, setStatusFilter] = useState("all")
//   const [hoveredTool, setHoveredTool] = useState<string | null>(null)

//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string

//   useEffect(() => {
//     if (orgSlug) {
//       fetchTools()
//     }
//   }, [orgSlug])

//   const fetchTools = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools`)
//       if (response.ok) {
//         const toolsData = await response.json()
//         setTools(toolsData)
//       }
//     } catch (error) {
//       console.error("Failed to fetch tools:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDeleteTool = async (toolId: string) => {
//     if (!confirm("Delete this tool permanently?")) return

//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         setTools(tools.filter((tool) => tool.id !== toolId))
//         toast({ title: "Tool deleted successfully" })
//       }
//     } catch (error) {
//       toast({ title: "Failed to delete tool", variant: "destructive" })
//     }
//   }

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case "PUBLISHED":
//         return <CheckCircle className="h-4 w-4 text-emerald-400" />
//       case "GENERATING":
//         return <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
//       case "ERROR":
//         return <AlertTriangle className="h-4 w-4 text-red-400" />
//       case "GENERATED":
//         return <Zap className="h-4 w-4 text-blue-400" />
//       default:
//         return <Clock className="h-4 w-4 text-slate-400" />
//     }
//   }

//   const filteredTools = tools.filter((tool) => {
//     const matchesSearch =
//       tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
//     const matchesStatus = statusFilter === "all" || tool.status.toLowerCase() === statusFilter.toLowerCase()
//     return matchesSearch && matchesStatus
//   })

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#121212]">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-[#888888] mx-auto" />
//           <p className="text-[#B0B0B0]">Loading your tools...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-[#121212] text-[#E0E0E0]">
//       <div className="border-b border-[#444444] bg-[#121212]/80 backdrop-blur-xl sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <h1 className="text-4xl font-bold text-[#E0E0E0] mb-2">Your Tools</h1>
//               <p className="text-[#B0B0B0]">Build, manage, and deploy AI-powered tools</p>
//             </div>
//             <Link href={`/${orgSlug}/tools/create`}>
//               <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212] h-12 px-6 text-base font-semibold">
//                 <Plus className="h-5 w-5 mr-2" />
//                 Create Tool
//               </Button>
//             </Link>
//           </div>

//           <div className="grid grid-cols-4 gap-4">
//             <Card className="bg-[#1a1a1a] border-[#444444] p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[#B0B0B0] text-sm">Total Tools</p>
//                   <p className="text-2xl font-bold text-[#E0E0E0] mt-1">{tools.length}</p>
//                 </div>
//                 <Code2 className="h-8 w-8 text-[#888888]" />
//               </div>
//             </Card>
//             <Card className="bg-[#1a1a1a] border-[#444444] p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[#B0B0B0] text-sm">Published</p>
//                   <p className="text-2xl font-bold text-emerald-400 mt-1">
//                     {tools.filter((t) => t.status === "PUBLISHED").length}
//                   </p>
//                 </div>
//                 <Globe className="h-8 w-8 text-emerald-400" />
//               </div>
//             </Card>
//             <Card className="bg-[#1a1a1a] border-[#444444] p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[#B0B0B0] text-sm">Generating</p>
//                   <p className="text-2xl font-bold text-purple-400 mt-1">
//                     {tools.filter((t) => t.status === "GENERATING").length}
//                   </p>
//                 </div>
//                 <Sparkles className="h-8 w-8 text-purple-400" />
//               </div>
//             </Card>
//             <Card className="bg-[#1a1a1a] border-[#444444] p-4">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[#B0B0B0] text-sm">This Month</p>
//                   <p className="text-2xl font-bold text-blue-400 mt-1">
//                     {tools.filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth()).length}
//                   </p>
//                 </div>
//                 <TrendingUp className="h-8 w-8 text-blue-400" />
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="flex gap-4 mb-8">
//           <div className="relative flex-1">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#B0B0B0]" />
//             <Input
//               placeholder="Search tools by name or description..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-12 h-12 bg-[#1a1a1a] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0] focus:border-[#888888]"
//             />
//           </div>
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="h-12 px-4 rounded-md bg-[#1a1a1a] border border-[#444444] text-[#E0E0E0] focus:border-[#888888] focus:outline-none"
//           >
//             <option value="all">All Status</option>
//             <option value="draft">Draft</option>
//             <option value="generating">Generating</option>
//             <option value="generated">Generated</option>
//             <option value="published">Published</option>
//             <option value="error">Error</option>
//           </select>
//         </div>

//         {filteredTools.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredTools.map((tool) => (
//               <Card
//                 key={tool.id}
//                 onMouseEnter={() => setHoveredTool(tool.id)}
//                 onMouseLeave={() => setHoveredTool(null)}
//                 className="bg-[#1a1a1a] border-[#444444] hover:border-[#888888] transition-all duration-300 overflow-hidden group cursor-pointer"
//                 onClick={() => router.push(`/${orgSlug}/tools/${tool.id}`)}
//               >
//                 <div className="h-48 bg-[#0a0a0a] border-b border-[#444444] relative overflow-hidden">
//                   {tool.previewUrl ? (
//                     <iframe
//                       src={tool.previewUrl}
//                       className="w-full h-full pointer-events-none scale-50 origin-top-left"
//                       style={{ width: "200%", height: "200%" }}
//                       title={tool.name}
//                     />
//                   ) : (
//                     <div className="flex items-center justify-center h-full">
//                       <Code2 className="h-16 w-16 text-[#444444]" />
//                     </div>
//                   )}
//                   <div
//                     className={`absolute inset-0 bg-[#121212]/90 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-300 ${
//                       hoveredTool === tool.id ? "opacity-100" : "opacity-0"
//                     }`}
//                   >
//                     <Button
//                       size="sm"
//                       className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         router.push(`/${orgSlug}/tools/${tool.id}`)
//                       }}
//                     >
//                       <Eye className="h-4 w-4 mr-2" />
//                       View
//                     </Button>
//                     {tool.publishedUrl && (
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         className="border-[#888888] text-[#E0E0E0] hover:bg-[#888888] hover:text-[#121212] bg-transparent"
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           window.open(tool.publishedUrl, "_blank")
//                         }}
//                       >
//                         <Globe className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div className="flex items-start justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       {getStatusIcon(tool.status)}
//                       <h3 className="text-lg font-semibold text-[#E0E0E0] line-clamp-1">{tool.name}</h3>
//                     </div>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         handleDeleteTool(tool.id)
//                       }}
//                       className="text-[#B0B0B0] hover:text-red-400 transition-colors"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </button>
//                   </div>

//                   <p className="text-[#B0B0B0] text-sm line-clamp-2 mb-4">
//                     {tool.description || "No description provided"}
//                   </p>

//                   <div className="flex items-center justify-between">
//                     <Badge
//                       className={`text-xs ${
//                         tool.status === "PUBLISHED"
//                           ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
//                           : tool.status === "GENERATING"
//                             ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
//                             : tool.status === "ERROR"
//                               ? "bg-red-500/10 text-red-400 border-red-500/20"
//                               : "bg-[#444444]/10 text-[#B0B0B0] border-[#444444]/20"
//                       }`}
//                     >
//                       {tool.status}
//                     </Badge>
//                     <span className="text-xs text-[#B0B0B0]">{new Date(tool.createdAt).toLocaleDateString()}</span>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <Card className="bg-[#1a1a1a] border-[#444444]">
//             <div className="flex flex-col items-center justify-center py-20">
//               <div className="w-20 h-20 bg-[#444444]/20 rounded-full flex items-center justify-center mb-6">
//                 <Sparkles className="h-10 w-10 text-[#888888]" />
//               </div>
//               <h3 className="text-2xl font-semibold text-[#E0E0E0] mb-2">
//                 {searchQuery || statusFilter !== "all" ? "No tools found" : "No tools yet"}
//               </h3>
//               <p className="text-[#B0B0B0] text-center mb-8 max-w-md">
//                 {searchQuery || statusFilter !== "all"
//                   ? "Try adjusting your search or filter criteria."
//                   : "Create your first AI-powered tool and watch it come to life."}
//               </p>
//               {!searchQuery && statusFilter === "all" && (
//                 <Link href={`/${orgSlug}/tools/create`}>
//                   <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212] h-12 px-8 text-base">
//                     <Plus className="h-5 w-5 mr-2" />
//                     Create Your First Tool
//                   </Button>
//                 </Link>
//               )}
//             </div>
//           </Card>
//         )}
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Eye,
  Globe,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Sparkles,
  Code2,
  Zap,
  TrendingUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  id: string
  name: string
  description?: string
  category?: string
  status: string
  generationStatus: string
  createdAt: string
  updatedAt: string
  previewUrl?: string
  publishedUrl?: string
  generationError?: string
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)

  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.slug as string

  useEffect(() => {
    if (orgSlug) {
      fetchTools()
    }
  }, [orgSlug])

  const fetchTools = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools`)
      if (response.ok) {
        const toolsData = await response.json()
        setTools(toolsData)
      }
    } catch (error) {
      console.error("Failed to fetch tools:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm("Delete this tool permanently?")) return

    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTools(tools.filter((tool) => tool.id !== toolId))
        toast({ title: "Tool deleted successfully" })
      }
    } catch (error) {
      toast({ title: "Failed to delete tool", variant: "destructive" })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "GENERATING":
        return <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
      case "ERROR":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "GENERATED":
        return <Zap className="h-4 w-4 text-blue-400" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || tool.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Loading your tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Your Tools</h1>
              <p className="text-muted-foreground">Build, manage, and deploy AI-powered tools</p>
            </div>
            <Link href={`/${orgSlug}/tools/create`}>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6 text-base font-semibold">
                <Plus className="h-5 w-5 mr-2" />
                Create Tool
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-card border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Tools</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{tools.length}</p>
                </div>
                <Code2 className="h-8 w-8 text-muted-foreground" />
              </div>
            </Card>
            <Card className="bg-card border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Published</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {tools.filter((t) => t.status === "PUBLISHED").length}
                  </p>
                </div>
                <Globe className="h-8 w-8 text-emerald-400" />
              </div>
            </Card>
            <Card className="bg-card border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Generating</p>
                  <p className="text-2xl font-bold text-purple-400 mt-1">
                    {tools.filter((t) => t.status === "GENERATING").length}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
            </Card>
            <Card className="bg-card border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">This Month</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">
                    {tools.filter((t) => new Date(t.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-400" />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search tools by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card border-border text-foreground placeholder-muted-foreground focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-4 rounded-md bg-card border border-border text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="generating">Generating</option>
            <option value="generated">Generated</option>
            <option value="published">Published</option>
            <option value="error">Error</option>
          </select>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                className="bg-card border-border hover:border-primary transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => router.push(`/${orgSlug}/tools/${tool.id}`)}
              >
                <div className="h-48 bg-muted border-b border-border relative overflow-hidden">
                  {tool.previewUrl ? (
                    <iframe
                      src={tool.previewUrl}
                      className="w-full h-full pointer-events-none scale-50 origin-top-left"
                      style={{ width: "200%", height: "200%" }}
                      title={tool.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Code2 className="h-16 w-16 text-muted-foreground/30" />
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-300 ${
                      hoveredTool === tool.id ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/${orgSlug}/tools/${tool.id}`)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    {tool.publishedUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border text-foreground hover:bg-primary hover:text-primary-foreground bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(tool.publishedUrl, "_blank")
                        }}
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tool.status)}
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1">{tool.name}</h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTool(tool.id)
                      }}
                      className="text-muted-foreground hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {tool.description || "No description provided"}
                  </p>

                  <div className="flex items-center justify-between">
                    <Badge
                      className={`text-xs ${
                        tool.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : tool.status === "GENERATING"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : tool.status === "ERROR"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {tool.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(tool.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {searchQuery || statusFilter !== "all" ? "No tools found" : "No tools yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first AI-powered tool and watch it come to life."}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Link href={`/${orgSlug}/tools/create`}>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 text-base">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Your First Tool
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
