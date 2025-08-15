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


"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Eye,
  Globe,
  Code,
  Settings,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
  MessageSquare,
  RefreshCw,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  status: string
  generationStatus: string
  generationError?: string
  previewUrl?: string
  publishedUrl?: string
  createdAt: string
  updatedAt: string
  generatedCode?: string
  requirements: string
  chatSessionId?: string
}

interface ChatSession {
  id: string
  messages: Array<{
    id: string
    role: "user" | "assistant" | "system"
    content: string
    timestamp: Date
  }>
  files: Array<{
    id: string
    name: string
    content: string
    type: string
    size: number
  }>
  status: "generating" | "completed" | "error"
  demoUrl?: string
  error?: string
}

interface ToolStatus {
  id: string
  status: string
  generationStatus: string
  previewUrl?: string
  error?: string
  progress: number
  chatSession?: ChatSession
}

export default function ToolPage() {
  const [tool, setTool] = useState<Tool | null>(null)
  const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showPublishDialog, setShowPublishDialog] = useState(false)
  const [publishConfig, setPublishConfig] = useState({
    subdomain: "",
    customDomain: "",
  })
  const [isPolling, setIsPolling] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const orgSlug = params?.slug as string
  const toolId = params?.id as string

  useEffect(() => {
    fetchTool()
  }, [toolId, orgSlug])

  useEffect(() => {
    // Start polling if tool is generating
    if (tool && (tool.status === "GENERATING" || tool.generationStatus === "generating")) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [tool])

  const fetchTool = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tool")
      }
      const toolData = await response.json()
      setTool(toolData)

      // Set initial subdomain suggestion
      if (toolData.name && !publishConfig.subdomain) {
        const suggestedSubdomain = toolData.name
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim()
        setPublishConfig((prev) => ({ ...prev, subdomain: suggestedSubdomain }))
      }
    } catch (error) {
      console.error("Error fetching tool:", error)
      toast({
        title: "Error",
        description: "Failed to load tool details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startPolling = () => {
    if (isPolling) return

    setIsPolling(true)
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
        if (response.ok) {
          const status: ToolStatus = await response.json()
          setToolStatus(status)

          // Update tool if status changed
          if (tool && (status.status !== tool.status || status.generationStatus !== tool.generationStatus)) {
            setTool((prev) =>
              prev
                ? {
                    ...prev,
                    status: status.status,
                    generationStatus: status.generationStatus,
                    previewUrl: status.previewUrl,
                    generationError: status.error,
                  }
                : null,
            )
          }

          // Stop polling if completed or error
          if (status.generationStatus === "completed" || status.generationStatus === "error") {
            stopPolling()
          }
        }
      } catch (error) {
        console.error("Polling error:", error)
      }
    }, 2000)

    // Store interval ID for cleanup
    ;(window as any).pollInterval = pollInterval
  }

  const stopPolling = () => {
    setIsPolling(false)
    if ((window as any).pollInterval) {
      clearInterval((window as any).pollInterval)
      ;(window as any).pollInterval = null
    }
  }

  const handlePublish = async () => {
    if (!tool || !publishConfig.subdomain) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(publishConfig),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to publish tool")
      }

      const result = await response.json()
      setTool((prev) => (prev ? { ...prev, status: "PUBLISHED", publishedUrl: result.url } : null))
      setShowPublishDialog(false)

      toast({
        title: "Tool Published!",
        description: `Your tool is now live at ${result.url}`,
      })
    } catch (error) {
      console.error("Error publishing tool:", error)
      toast({
        title: "Publish Failed",
        description: error instanceof Error ? error.message : "Failed to publish the tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!tool || !confirm("Are you sure you want to delete this tool? This action cannot be undone.")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tool")
      }

      toast({
        title: "Tool Deleted",
        description: "The tool has been permanently deleted.",
      })

      router.push(`/${orgSlug}/tools`)
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete the tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard.",
    })
  }

  const downloadCode = () => {
    if (!toolStatus?.chatSession?.files) return

    const files = toolStatus.chatSession.files
    const zip = files.map((file) => `// ${file.name}\n${file.content}`).join("\n\n// ===== NEXT FILE =====\n\n")

    const blob = new Blob([zip], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${tool?.name || "tool"}-code.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "GENERATED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "GENERATING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "ERROR":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getGenerationStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "analyzing":
      case "designing":
      case "generating":
      case "finalizing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Tool Not Found</h2>
          <p className="text-muted-foreground mb-4">The tool you're looking for doesn't exist.</p>
          <Link href={`/${orgSlug}/tools`}>
            <Button>Back to Tools</Button>
          </Link>
        </div>
      </div>
    )
  }

  const currentStatus = toolStatus || {
    id: tool.id,
    status: tool.status,
    generationStatus: tool.generationStatus,
    previewUrl: tool.previewUrl,
    error: tool.generationError,
    progress: tool.status === "GENERATED" ? 100 : 0,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <Link href={`/${orgSlug}/tools`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">{tool.name}</h1>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(currentStatus.status)}>{currentStatus.status}</Badge>
            {currentStatus.generationStatus && (
              <div className="flex items-center space-x-1">
                {getGenerationStatusIcon(currentStatus.generationStatus)}
                <span className="text-sm text-muted-foreground capitalize">{currentStatus.generationStatus}</span>
              </div>
            )}
            {isPolling && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>Live</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Live Preview</span>
                    </CardTitle>
                    <CardDescription>Interactive preview of your generated tool</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentStatus.status === "GENERATING" ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Generation Progress</span>
                          <span>{currentStatus.progress}%</span>
                        </div>
                        <Progress value={currentStatus.progress} className="h-2" />
                        <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                          <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                            <p className="text-sm text-muted-foreground capitalize">
                              {currentStatus.generationStatus}...
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : currentStatus.status === "ERROR" ? (
                      <div className="flex items-center justify-center h-64 bg-red-50 dark:bg-red-950 rounded-lg">
                        <div className="text-center">
                          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                          <p className="text-sm text-red-600 dark:text-red-400">Generation failed</p>
                          {currentStatus.error && (
                            <p className="text-xs text-red-500 mt-2 max-w-md">{currentStatus.error}</p>
                          )}
                        </div>
                      </div>
                    ) : currentStatus.previewUrl ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                          <iframe
                            src={currentStatus.previewUrl}
                            className="w-full h-full border-0"
                            title="Tool Preview"
                            sandbox="allow-scripts allow-same-origin allow-forms"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={currentStatus.previewUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in New Tab
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(currentStatus.previewUrl!)}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy URL
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">No preview available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Generated Files</span>
                    </CardTitle>
                    <CardDescription>View and download the generated code files</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {toolStatus?.chatSession?.files && toolStatus.chatSession.files.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            {toolStatus.chatSession.files.length} files generated
                          </p>
                          <Button variant="outline" size="sm" onClick={downloadCode}>
                            <Download className="h-4 w-4 mr-2" />
                            Download All
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {toolStatus.chatSession.files.map((file, index) => (
                            <Card key={file.id} className="bg-muted/50">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <Code className="h-4 w-4" />
                                    <span className="font-mono text-sm">{file.name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {file.type}
                                    </Badge>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </span>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <div className="bg-background rounded border p-3 max-h-48 overflow-auto">
                                  <pre className="text-xs">
                                    <code>{file.content}</code>
                                  </pre>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">No code files available yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Generation Chat</span>
                    </CardTitle>
                    <CardDescription>View the AI conversation that generated your tool</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {toolStatus?.chatSession?.messages && toolStatus.chatSession.messages.length > 0 ? (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {toolStatus.chatSession.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 rounded-lg ${
                              message.role === "user" ? "bg-primary/10 ml-8" : "bg-muted mr-8"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium capitalize">
                                {message.role === "user" ? "You" : "AI Assistant"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">No chat messages available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Tool Settings</span>
                    </CardTitle>
                    <CardDescription>Manage your tool configuration and metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm whitespace-pre-wrap">{tool.requirements}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Category</h4>
                        <Badge variant="secondary">{tool.category}</Badge>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Created</h4>
                        <p className="text-sm text-muted-foreground">{new Date(tool.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage your tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStatus.status === "GENERATED" && !tool.publishedUrl && (
                  <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Globe className="h-4 w-4 mr-2" />
                        Publish Tool
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Publish Your Tool</DialogTitle>
                        <DialogDescription>
                          Make your tool publicly accessible with a custom subdomain.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subdomain">Subdomain *</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id="subdomain"
                              value={publishConfig.subdomain}
                              onChange={(e) => setPublishConfig((prev) => ({ ...prev, subdomain: e.target.value }))}
                              placeholder="my-tool"
                            />
                            <span className="text-sm text-muted-foreground">.configcraft.app</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                          <Input
                            id="customDomain"
                            value={publishConfig.customDomain}
                            onChange={(e) => setPublishConfig((prev) => ({ ...prev, customDomain: e.target.value }))}
                            placeholder="tool.yourdomain.com"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handlePublish} disabled={isPublishing || !publishConfig.subdomain}>
                            {isPublishing ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <Globe className="h-4 w-4 mr-2" />
                            )}
                            Publish
                          </Button>
                          <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {tool.publishedUrl && (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Published Tool
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(tool.publishedUrl!)}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Public URL
                    </Button>
                  </div>
                )}

                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full">
                  {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete Tool
                </Button>
              </CardContent>
            </Card>

            {tool.publishedUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Public Access</CardTitle>
                  <CardDescription>Your tool is live and accessible</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">Published</span>
                    </div>
                    <p className="text-xs text-muted-foreground break-all">{tool.publishedUrl}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStatus.status === "GENERATING" && (
              <Card>
                <CardHeader>
                  <CardTitle>Generation Progress</CardTitle>
                  <CardDescription>AI is creating your tool</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span>{currentStatus.progress}%</span>
                    </div>
                    <Progress value={currentStatus.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground capitalize">{currentStatus.generationStatus}...</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
