// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   ArrowLeft,
//   Eye,
//   Globe,
//   Code,
//   Settings,
//   Trash2,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   ExternalLink,
//   Copy,
//   Download,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// interface Tool {
//   id: string
//   name: string
//   description: string
//   category: string
//   status: string
//   generationStatus: string
//   generationError?: string
//   previewUrl?: string
//   publishedUrl?: string
//   createdAt: string
//   updatedAt: string
//   generatedCode?: string
//   requirements: string
// }

// export default function ToolPage() {
//   const [tool, setTool] = useState<Tool | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [isPublishing, setIsPublishing] = useState(false)
//   const [isDeleting, setIsDeleting] = useState(false)

//   const { toast } = useToast()
//   const router = useRouter()
//   const params = useParams()
//   const orgSlug = params?.slug as string
//   const toolId = params?.id as string

//   useEffect(() => {
//     fetchTool()
//   }, [toolId, orgSlug])

//   const fetchTool = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`)
//       if (!response.ok) {
//         throw new Error("Failed to fetch tool")
//       }
//       const toolData = await response.json()
//       setTool(toolData)
//     } catch (error) {
//       console.error("Error fetching tool:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load tool details.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handlePublish = async () => {
//     if (!tool) return

//     setIsPublishing(true)
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/publish`, {
//         method: "POST",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to publish tool")
//       }

//       const updatedTool = await response.json()
//       setTool(updatedTool)

//       toast({
//         title: "Tool Published!",
//         description: "Your tool is now live and accessible to users.",
//       })
//     } catch (error) {
//       console.error("Error publishing tool:", error)
//       toast({
//         title: "Publish Failed",
//         description: "Failed to publish the tool. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsPublishing(false)
//     }
//   }

//   const handleDelete = async () => {
//     if (!tool || !confirm("Are you sure you want to delete this tool? This action cannot be undone.")) return

//     setIsDeleting(true)
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete tool")
//       }

//       toast({
//         title: "Tool Deleted",
//         description: "The tool has been permanently deleted.",
//       })

//       router.push(`/${orgSlug}/tools`)
//     } catch (error) {
//       console.error("Error deleting tool:", error)
//       toast({
//         title: "Delete Failed",
//         description: "Failed to delete the tool. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(false)
//     }
//   }

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text)
//     toast({
//       title: "Copied!",
//       description: "URL copied to clipboard.",
//     })
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "GENERATED":
//         return "bg-green-100 text-green-800"
//       case "PUBLISHED":
//         return "bg-blue-100 text-blue-800"
//       case "GENERATING":
//         return "bg-yellow-100 text-yellow-800"
//       case "ERROR":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getGenerationStatusIcon = (status: string) => {
//     switch (status) {
//       case "completed":
//         return <CheckCircle className="h-4 w-4 text-green-500" />
//       case "error":
//         return <AlertCircle className="h-4 w-4 text-red-500" />
//       case "analyzing":
//       case "designing":
//       case "generating":
//       case "finalizing":
//         return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
//       default:
//         return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (!tool) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold mb-2">Tool Not Found</h2>
//           <p className="text-muted-foreground mb-4">The tool you're looking for doesn't exist.</p>
//           <Link href={`/${orgSlug}/tools`}>
//             <Button>Back to Tools</Button>
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="border-b bg-card">
//         <div className="flex items-center justify-between h-16 px-6">
//           <div className="flex items-center space-x-4">
//             <Link href={`/${orgSlug}/tools`}>
//               <Button variant="ghost" size="sm">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Tools
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-xl font-semibold">{tool.name}</h1>
//               <p className="text-sm text-muted-foreground">{tool.description}</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Badge className={getStatusColor(tool.status)}>{tool.status}</Badge>
//             {tool.generationStatus && (
//               <div className="flex items-center space-x-1">
//                 {getGenerationStatusIcon(tool.generationStatus)}
//                 <span className="text-sm text-muted-foreground capitalize">{tool.generationStatus}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto p-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2">
//             <Tabs defaultValue="preview" className="space-y-6">
//               <TabsList>
//                 <TabsTrigger value="preview">Preview</TabsTrigger>
//                 <TabsTrigger value="code">Code</TabsTrigger>
//                 <TabsTrigger value="settings">Settings</TabsTrigger>
//               </TabsList>

//               <TabsContent value="preview" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <Eye className="h-5 w-5" />
//                       <span>Tool Preview</span>
//                     </CardTitle>
//                     <CardDescription>Preview how your tool looks and functions</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {tool.status === "GENERATING" ? (
//                       <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
//                         <div className="text-center">
//                           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//                           <p className="text-sm text-muted-foreground">Generating your tool...</p>
//                         </div>
//                       </div>
//                     ) : tool.status === "ERROR" ? (
//                       <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
//                         <div className="text-center">
//                           <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
//                           <p className="text-sm text-red-600">Generation failed</p>
//                           {tool.generationError && <p className="text-xs text-red-500 mt-2">{tool.generationError}</p>}
//                         </div>
//                       </div>
//                     ) : tool.previewUrl ? (
//                       <div className="space-y-4">
//                         <div className="aspect-video bg-muted rounded-lg overflow-hidden">
//                           <iframe src={tool.previewUrl} className="w-full h-full border-0" title="Tool Preview" />
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Button variant="outline" size="sm" asChild>
//                             <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
//                               <ExternalLink className="h-4 w-4 mr-2" />
//                               Open in New Tab
//                             </a>
//                           </Button>
//                           <Button variant="outline" size="sm" onClick={() => copyToClipboard(tool.previewUrl!)}>
//                             <Copy className="h-4 w-4 mr-2" />
//                             Copy URL
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
//                         <p className="text-sm text-muted-foreground">No preview available</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="code" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <Code className="h-5 w-5" />
//                       <span>Generated Code</span>
//                     </CardTitle>
//                     <CardDescription>View and download the generated code for your tool</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     {tool.generatedCode ? (
//                       <div className="space-y-4">
//                         <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
//                           <pre className="text-sm">
//                             <code>{tool.generatedCode}</code>
//                           </pre>
//                         </div>
//                         <div className="flex items-center space-x-2">
//                           <Button variant="outline" size="sm">
//                             <Download className="h-4 w-4 mr-2" />
//                             Download Code
//                           </Button>
//                           <Button variant="outline" size="sm" onClick={() => copyToClipboard(tool.generatedCode!)}>
//                             <Copy className="h-4 w-4 mr-2" />
//                             Copy Code
//                           </Button>
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
//                         <p className="text-sm text-muted-foreground">No code available yet</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               <TabsContent value="settings" className="space-y-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="flex items-center space-x-2">
//                       <Settings className="h-5 w-5" />
//                       <span>Tool Settings</span>
//                     </CardTitle>
//                     <CardDescription>Manage your tool settings and configuration</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <h4 className="font-medium mb-2">Requirements</h4>
//                       <div className="bg-muted rounded-lg p-4">
//                         <p className="text-sm">{tool.requirements}</p>
//                       </div>
//                     </div>
//                     <div>
//                       <h4 className="font-medium mb-2">Category</h4>
//                       <Badge variant="secondary">{tool.category}</Badge>
//                     </div>
//                     <div>
//                       <h4 className="font-medium mb-2">Created</h4>
//                       <p className="text-sm text-muted-foreground">{new Date(tool.createdAt).toLocaleDateString()}</p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>
//             </Tabs>
//           </div>

//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Actions</CardTitle>
//                 <CardDescription>Manage your tool</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {tool.status === "GENERATED" && !tool.publishedUrl && (
//                   <Button onClick={handlePublish} disabled={isPublishing} className="w-full">
//                     {isPublishing ? (
//                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     ) : (
//                       <Globe className="h-4 w-4 mr-2" />
//                     )}
//                     Publish Tool
//                   </Button>
//                 )}

//                 {tool.publishedUrl && (
//                   <div className="space-y-2">
//                     <Button variant="outline" className="w-full bg-transparent" asChild>
//                       <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
//                         <ExternalLink className="h-4 w-4 mr-2" />
//                         View Published Tool
//                       </a>
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard(tool.publishedUrl!)}
//                       className="w-full"
//                     >
//                       <Copy className="h-4 w-4 mr-2" />
//                       Copy Public URL
//                     </Button>
//                   </div>
//                 )}

//                 <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full">
//                   {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
//                   Delete Tool
//                 </Button>
//               </CardContent>
//             </Card>

//             {tool.publishedUrl && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Public Access</CardTitle>
//                   <CardDescription>Your tool is live and accessible</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2 text-sm">
//                       <Globe className="h-4 w-4 text-green-500" />
//                       <span className="text-green-600">Published</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground break-all">{tool.publishedUrl}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Monitor, Code2, Download, Share2, ExternalLink, Command, PanelLeftClose, PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CinematicBuilder } from "@/components/generation/cinematic-builder"
import { ResizablePanels } from "@/components/tool-viewer/resizable-panels"
import { AdvancedFileTree } from "@/components/tool-viewer/advanced-file-tree"
import { CodeMinimap } from "@/components/tool-viewer/code-minimap"
import { CommandPalette } from "@/components/tool-viewer/command-palette"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface Tool {
  id: string
  name: string
  status: string
  previewUrl?: string
  files?: Array<{ name: string; content: string; type?: string; path: string }>
}

export default function ToolViewerPage() {
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<{
    name: string
    content: string
    type?: string
    path?: string
  } | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeView, setActiveView] = useState<"preview" | "code" | "split">("preview")
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)

  const params = useParams()
  const { toast } = useToast()
  const toolId = params?.id as string

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault()
        setActiveView("preview")
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault()
        setActiveView("code")
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        setActiveView("split")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    fetchTool()
  }, [toolId])

  useEffect(() => {
    if (tool?.files && tool.files.length > 0 && !selectedFile) {
      setSelectedFile(tool.files[0])
    }
  }, [tool?.files])

  const fetchTool = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setTool({
        id: toolId,
        name: "Customer Support Dashboard",
        status: "GENERATED",
        previewUrl: "https://v0.dev/chat/jYP8pRA7EFV",
        files: [
          {
            name: "page.tsx",
            path: "app/page.tsx",
            content: `'use client'\n\nimport { useState } from 'react'\nimport { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'\nimport { Button } from '@/components/ui/button'\n\nexport default function Dashboard() {\n  const [tickets, setTickets] = useState([])\n\n  return (\n    <div className="container mx-auto p-6">\n      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n        <Card>\n          <CardHeader>\n            <CardTitle>Open Tickets</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <p className="text-4xl font-bold">24</p>\n          </CardContent>\n        </Card>\n      </div>\n    </div>\n  )\n}`,
            type: "typescript",
          },
          {
            name: "layout.tsx",
            path: "app/layout.tsx",
            content: `export default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  )\n}`,
            type: "typescript",
          },
          {
            name: "globals.css",
            path: "app/globals.css",
            content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --background: 0 0% 100%;\n  --foreground: 224 71.4% 4.1%;\n}`,
            type: "css",
          },
        ],
      })
    } catch (error) {
      toast({ title: "Error loading tool", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleCommandAction = (action: string) => {
    if (action.startsWith("open-file:")) {
      const filePath = action.replace("open-file:", "")
      const file = tool?.files?.find((f) => f.path === filePath)
      if (file) {
        setSelectedFile(file)
        setActiveView("code")
      }
    } else if (action === "preview") {
      setActiveView("preview")
    } else if (action === "code") {
      setActiveView("code")
    } else if (action === "download") {
      handleDownload()
    } else if (action === "share") {
      handleShare()
    } else if (action === "deploy") {
      toast({ title: "Deploy feature coming soon!" })
    }
  }

  const handleDownload = () => {
    toast({ title: "Downloading files..." })
  }

  const handleShare = () => {
    if (tool?.previewUrl) {
      navigator.clipboard.writeText(tool.previewUrl)
      toast({ title: "Link copied to clipboard" })
    }
  }

  if (loading) {
    return <CinematicBuilder />
  }

  if (!tool) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Tool not found</h2>
          <p className="text-muted-foreground">The tool you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const PreviewPanel = () => (
    <div className="h-full bg-muted/20 relative">
      {tool.previewUrl ? (
        <iframe
          src={tool.previewUrl}
          className="w-full h-full border-0"
          title="Tool Preview"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        />
      ) : (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No preview available</p>
          </div>
        </div>
      )}
    </div>
  )

  const CodePanel = () => (
    <div className="h-full flex">
      <div className="flex-1 overflow-auto bg-card">
        {selectedFile ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-mono text-sm text-muted-foreground">{selectedFile.path}</h3>
                <p className="text-xs text-muted-foreground mt-1">{selectedFile.content.split("\n").length} lines</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile.content)
                    toast({ title: "Code copied to clipboard" })
                  }}
                >
                  Copy
                </Button>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm font-mono">{selectedFile.content}</code>
            </pre>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select a file to view</p>
            </div>
          </div>
        )}
      </div>
      {selectedFile && (
        <CodeMinimap content={selectedFile.content} currentLine={currentLine} onLineClick={setCurrentLine} />
      )}
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{tool.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCommandPaletteOpen(true)} className="gap-2">
            <Command className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">⌘K</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          {tool.previewUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="h-12 border-b border-border bg-card/30 flex items-center px-4 gap-2">
        <Button
          variant={activeView === "preview" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveView("preview")}
          className="gap-2"
        >
          <Monitor className="h-4 w-4" />
          Preview
        </Button>
        <Button
          variant={activeView === "code" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveView("code")}
          className="gap-2"
        >
          <Code2 className="h-4 w-4" />
          Code
        </Button>
        <Button
          variant={activeView === "split" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveView("split")}
          className="gap-2"
        >
          <PanelLeft className="h-4 w-4" />
          Split
        </Button>

        {activeView !== "preview" && (
          <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto">
            {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex">
        <AnimatePresence mode="wait">
          {activeView !== "preview" && !sidebarCollapsed && tool.files && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-r border-border bg-card/30 overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold mb-1">Files</h3>
                <p className="text-xs text-muted-foreground">{tool.files.length} files</p>
              </div>
              <div className="p-2 overflow-y-auto h-[calc(100%-73px)]">
                <AdvancedFileTree
                  files={tool?.files}
                  selectedFile={selectedFile?.name || null}
                  onFileSelect={setSelectedFile}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-hidden">
          {activeView === "preview" && <PreviewPanel />}
          {activeView === "code" && <CodePanel />}
          {activeView === "split" && (
            <ResizablePanels left={<PreviewPanel />} right={<CodePanel />} defaultLeftWidth={50} />
          )}
        </div>
      </div>

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onAction={handleCommandAction}
        files={tool.files || []}
      />
    </div>
  )
}

