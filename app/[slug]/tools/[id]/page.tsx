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

// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import { motion, AnimatePresence } from "framer-motion"
// import { Monitor, Code2, Download, Share2, ExternalLink, Command, PanelLeftClose, PanelLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { useToast } from "@/hooks/use-toast"
// import { CinematicBuilder } from "@/components/generation/cinematic-builder"
// import { ResizablePanels } from "@/components/tool-viewer/resizable-panels"
// import { AdvancedFileTree } from "@/components/tool-viewer/advanced-file-tree"
// import { CodeMinimap } from "@/components/tool-viewer/code-minimap"
// import { CommandPalette } from "@/components/tool-viewer/command-palette"
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"

// interface Tool {
//   id: string
//   name: string
//   status: string
//   previewUrl?: string
//   files?: Array<{ name: string; content: string; type?: string; path: string }>
// }

// export default function ToolViewerPage() {
//   const [tool, setTool] = useState<Tool | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [selectedFile, setSelectedFile] = useState<{
//     name: string
//     content: string
//     type?: string
//     path?: string
//   } | null>(null)
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [activeView, setActiveView] = useState<"preview" | "code" | "split">("preview")
//   const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
//   const [currentLine, setCurrentLine] = useState(0)

//   const params = useParams()
//   const { toast } = useToast()
//   const toolId = params?.id as string

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if ((e.metaKey || e.ctrlKey) && e.key === "k") {
//         e.preventDefault()
//         setCommandPaletteOpen(true)
//       }
//       if ((e.metaKey || e.ctrlKey) && e.key === "p") {
//         e.preventDefault()
//         setActiveView("preview")
//       }
//       if ((e.metaKey || e.ctrlKey) && e.key === "e") {
//         e.preventDefault()
//         setActiveView("code")
//       }
//       if ((e.metaKey || e.ctrlKey) && e.key === "s") {
//         e.preventDefault()
//         setActiveView("split")
//       }
//     }

//     window.addEventListener("keydown", handleKeyDown)
//     return () => window.removeEventListener("keydown", handleKeyDown)
//   }, [])

//   useEffect(() => {
//     fetchTool()
//   }, [toolId])

//   useEffect(() => {
//     if (tool?.files && tool.files.length > 0 && !selectedFile) {
//       setSelectedFile(tool.files[0])
//     }
//   }, [tool?.files])

//   const fetchTool = async () => {
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 3000))

//       setTool({
//         id: toolId,
//         name: "Customer Support Dashboard",
//         status: "GENERATED",
//         previewUrl: "https://v0.dev/chat/jYP8pRA7EFV",
//         files: [
//           {
//             name: "page.tsx",
//             path: "app/page.tsx",
//             content: `'use client'\n\nimport { useState } from 'react'\nimport { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'\nimport { Button } from '@/components/ui/button'\n\nexport default function Dashboard() {\n  const [tickets, setTickets] = useState([])\n\n  return (\n    <div className="container mx-auto p-6">\n      <h1 className="text-3xl font-bold mb-6">Support Dashboard</h1>\n      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\n        <Card>\n          <CardHeader>\n            <CardTitle>Open Tickets</CardTitle>\n          </CardHeader>\n          <CardContent>\n            <p className="text-4xl font-bold">24</p>\n          </CardContent>\n        </Card>\n      </div>\n    </div>\n  )\n}`,
//             type: "typescript",
//           },
//           {
//             name: "layout.tsx",
//             path: "app/layout.tsx",
//             content: `export default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode\n}) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  )\n}`,
//             type: "typescript",
//           },
//           {
//             name: "globals.css",
//             path: "app/globals.css",
//             content: `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n:root {\n  --background: 0 0% 100%;\n  --foreground: 224 71.4% 4.1%;\n}`,
//             type: "css",
//           },
//         ],
//       })
//     } catch (error) {
//       toast({ title: "Error loading tool", variant: "destructive" })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCommandAction = (action: string) => {
//     if (action.startsWith("open-file:")) {
//       const filePath = action.replace("open-file:", "")
//       const file = tool?.files?.find((f) => f.path === filePath)
//       if (file) {
//         setSelectedFile(file)
//         setActiveView("code")
//       }
//     } else if (action === "preview") {
//       setActiveView("preview")
//     } else if (action === "code") {
//       setActiveView("code")
//     } else if (action === "download") {
//       handleDownload()
//     } else if (action === "share") {
//       handleShare()
//     } else if (action === "deploy") {
//       toast({ title: "Deploy feature coming soon!" })
//     }
//   }

//   const handleDownload = () => {
//     toast({ title: "Downloading files..." })
//   }

//   const handleShare = () => {
//     if (tool?.previewUrl) {
//       navigator.clipboard.writeText(tool.previewUrl)
//       toast({ title: "Link copied to clipboard" })
//     }
//   }

//   if (loading) {
//     return <CinematicBuilder />
//   }

//   if (!tool) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold mb-2">Tool not found</h2>
//           <p className="text-muted-foreground">The tool you're looking for doesn't exist.</p>
//         </div>
//       </div>
//     )
//   }

//   const PreviewPanel = () => (
//     <div className="h-full bg-muted/20 relative">
//       {tool.previewUrl ? (
//         <iframe
//           src={tool.previewUrl}
//           className="w-full h-full border-0"
//           title="Tool Preview"
//           sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//         />
//       ) : (
//         <div className="h-full flex items-center justify-center">
//           <div className="text-center">
//             <Monitor className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//             <p className="text-muted-foreground">No preview available</p>
//           </div>
//         </div>
//       )}
//     </div>
//   )

//   const CodePanel = () => (
//     <div className="h-full flex">
//       <div className="flex-1 overflow-auto bg-card">
//         {selectedFile ? (
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h3 className="font-mono text-sm text-muted-foreground">{selectedFile.path}</h3>
//                 <p className="text-xs text-muted-foreground mt-1">{selectedFile.content.split("\n").length} lines</p>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     navigator.clipboard.writeText(selectedFile.content)
//                     toast({ title: "Code copied to clipboard" })
//                   }}
//                 >
//                   Copy
//                 </Button>
//                 <Button variant="ghost" size="sm">
//                   Download
//                 </Button>
//               </div>
//             </div>
//             <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
//               <code className="text-sm font-mono">{selectedFile.content}</code>
//             </pre>
//           </div>
//         ) : (
//           <div className="h-full flex items-center justify-center">
//             <div className="text-center">
//               <Code2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
//               <p className="text-muted-foreground">Select a file to view</p>
//             </div>
//           </div>
//         )}
//       </div>
//       {selectedFile && (
//         <CodeMinimap content={selectedFile.content} currentLine={currentLine} onLineClick={setCurrentLine} />
//       )}
//     </div>
//   )

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <div className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
//         <div className="flex items-center gap-4">
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/tools">Tools</BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbPage>{tool.name}</BreadcrumbPage>
//               </BreadcrumbItem>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>

//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm" onClick={() => setCommandPaletteOpen(true)} className="gap-2">
//             <Command className="h-4 w-4" />
//             <span className="text-xs text-muted-foreground">⌘K</span>
//           </Button>
//           <Button variant="ghost" size="sm" onClick={handleDownload}>
//             <Download className="h-4 w-4" />
//           </Button>
//           <Button variant="ghost" size="sm" onClick={handleShare}>
//             <Share2 className="h-4 w-4" />
//           </Button>
//           {tool.previewUrl && (
//             <Button variant="ghost" size="sm" asChild>
//               <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
//                 <ExternalLink className="h-4 w-4" />
//               </a>
//             </Button>
//           )}
//         </div>
//       </div>

//       <div className="h-12 border-b border-border bg-card/30 flex items-center px-4 gap-2">
//         <Button
//           variant={activeView === "preview" ? "default" : "ghost"}
//           size="sm"
//           onClick={() => setActiveView("preview")}
//           className="gap-2"
//         >
//           <Monitor className="h-4 w-4" />
//           Preview
//         </Button>
//         <Button
//           variant={activeView === "code" ? "default" : "ghost"}
//           size="sm"
//           onClick={() => setActiveView("code")}
//           className="gap-2"
//         >
//           <Code2 className="h-4 w-4" />
//           Code
//         </Button>
//         <Button
//           variant={activeView === "split" ? "default" : "ghost"}
//           size="sm"
//           onClick={() => setActiveView("split")}
//           className="gap-2"
//         >
//           <PanelLeft className="h-4 w-4" />
//           Split
//         </Button>

//         {activeView !== "preview" && (
//           <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="ml-auto">
//             {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
//           </Button>
//         )}
//       </div>

//       <div className="flex-1 overflow-hidden flex">
//         <AnimatePresence mode="wait">
//           {activeView !== "preview" && !sidebarCollapsed && tool.files && (
//             <motion.div
//               initial={{ width: 0, opacity: 0 }}
//               animate={{ width: 280, opacity: 1 }}
//               exit={{ width: 0, opacity: 0 }}
//               transition={{ duration: 0.2 }}
//               className="border-r border-border bg-card/30 overflow-hidden"
//             >
//               <div className="p-4 border-b border-border">
//                 <h3 className="text-sm font-semibold mb-1">Files</h3>
//                 <p className="text-xs text-muted-foreground">{tool.files.length} files</p>
//               </div>
//               <div className="p-2 overflow-y-auto h-[calc(100%-73px)]">
//                 <AdvancedFileTree
//                   files={tool?.files}
//                   selectedFile={selectedFile?.name || null}
//                   onFileSelect={setSelectedFile}
//                 />
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         <div className="flex-1 overflow-hidden">
//           {activeView === "preview" && <PreviewPanel />}
//           {activeView === "code" && <CodePanel />}
//           {activeView === "split" && (
//             <ResizablePanels left={<PreviewPanel />} right={<CodePanel />} defaultLeftWidth={50} />
//           )}
//         </div>
//       </div>

//       <CommandPalette
//         isOpen={commandPaletteOpen}
//         onClose={() => setCommandPaletteOpen(false)}
//         onAction={handleCommandAction}
//         files={tool.files || []}
//       />
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import {
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Monitor,
//   Tablet,
//   Smartphone,
//   Code2,
//   Eye,
//   Settings,
//   MessageSquare,
//   Clock,
//   BarChart3,
//   Send,
//   Download,
//   Copy,
//   Check,
//   Search,
//   Maximize2,
//   Minimize2,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import type { GeneratedFile, GenerationResult, ChatMessage, LogEntry, LogLevel } from "@/types" // Assuming these types are defined in a separate file

// export default function ToolDetailPage() {
//   const [loading, setLoading] = useState(true)
//   const [tool, setTool] = useState<any>(null)
//   const [toolName, setToolName] = useState("")
//   const [category, setCategory] = useState("dashboard")
//   const [requirements, setRequirements] = useState("")
//   const [selectedIntegrations, setSelectedIntegrations] = useState<any[]>([])
//   const [result, setResult] = useState<GenerationResult | null>(null)
//   const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
//   const [logs, setLogs] = useState<LogEntry[]>([])
//   const [step, setStep] = useState("create")
//   const [viewMode, setViewMode] = useState("code")
//   const [currentToolId, setCurrentToolId] = useState("")

//   const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true)
//   const [isFileExplorerOpen, setIsFileExplorerOpen] = useState(true)
//   const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [fileFilter, setFileFilter] = useState("all")
//   const [copiedFile, setCopiedFile] = useState<string | null>(null)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [chatMessage, setChatMessage] = useState("")
//   const [isRegenerating, setIsRegenerating] = useState(false)
//   const [rightSidebarTab, setRightSidebarTab] = useState("logs")

//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string
//   const toolId = params?.id as string

//   useEffect(() => {
//     console.log("[v0] Tool detail page mounted", { orgSlug, toolId })
//     if (orgSlug && toolId) {
//       loadTool()
//     }
//   }, [orgSlug, toolId])

//   const loadTool = async () => {
//     try {
//       console.log("[v0] Loading tool...", { orgSlug, toolId })
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`)

//       console.log("[v0] Response status:", response.status)

//       if (!response.ok) {
//         throw new Error("Failed to load tool")
//       }

//       const toolData = await response.json()
//       console.log("[v0] Tool data loaded:", toolData)

//       setTool(toolData)

//       setToolName(toolData.name)
//       setCategory(toolData.category || "dashboard")
//       setRequirements(toolData.requirements || "")
//       setSelectedIntegrations(toolData.integrations || [])

//       const latestChatSession = toolData.chatSessions?.[0] // Get the first (most recent) chat session

//       if (latestChatSession) {
//         console.log("[v0] Loading files from chat session:", latestChatSession.id)

//         // Load files
//         const files: GeneratedFile[] = latestChatSession.files.map((f: any) => ({
//           id: f.id,
//           name: f.name,
//           path: f.name,
//           content: f.content,
//           type: f.type,
//           size: f.size || 0,
//           language: f.type,
//           createdAt: new Date(f.createdAt),
//           updatedAt: new Date(f.updatedAt),
//         }))

//         console.log("[v0] Loaded files:", files.length)

//         const generationResult: GenerationResult = {
//           success: true,
//           toolId: toolData.id,
//           chatSessionId: latestChatSession.id,
//           files,
//           previewUrl: toolData.previewUrl || undefined,
//           chatUrl: toolData.chatUrl || undefined,
//         }

//         setResult(generationResult)
//         if (files.length > 0) {
//           setSelectedFile(files[0])
//         }

//         // Load chat history
//         const chatMessages: ChatMessage[] = latestChatSession.messages.map((m: any) => ({
//           id: m.id,
//           content: m.content,
//           role: m.role,
//           timestamp: new Date(m.createdAt),
//         }))
//         setChatHistory(chatMessages)

//         console.log("[v0] Loaded chat messages:", chatMessages.length)

//         // Load logs from generation (if available)
//         if (toolData.generationLogs && Array.isArray(toolData.generationLogs)) {
//           const loadedLogs: LogEntry[] = toolData.generationLogs.map((msg: string, i: number) => ({
//             id: `log-${i}`,
//             timestamp: new Date(toolData.createdAt),
//             level: "info" as LogLevel,
//             message: msg,
//           }))
//           setLogs(loadedLogs)
//         }

//         setStep("preview")
//         setViewMode(generationResult.previewUrl ? "preview" : "code")
//         console.log("[v0] Set step to preview, viewMode:", generationResult.previewUrl ? "preview" : "code")
//       } else {
//         console.log("[v0] No chat sessions found for this tool")
//         // Tool exists but hasn't been generated yet
//         setStep("configure")
//       }

//       setCurrentToolId(toolData.id)
//     } catch (error) {
//       console.error("[v0] Failed to load tool:", error)
//       toast({ title: "Failed to load tool", variant: "destructive" })
//       router.push(`/${orgSlug}/tools`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCopyCode = (content: string, fileId: string) => {
//     navigator.clipboard.writeText(content)
//     setCopiedFile(fileId)
//     setTimeout(() => setCopiedFile(null), 2000)
//     toast({ title: "Code copied to clipboard" })
//   }

//   const handleDownloadFile = (file: GeneratedFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const handleSendMessage = async () => {
//     if (!chatMessage.trim() || !result) return

//     setIsRegenerating(true)
//     const userMessage: ChatMessage = {
//       id: `user-${Date.now()}`,
//       content: chatMessage,
//       role: "user",
//       timestamp: new Date(),
//     }
//     setChatHistory([...chatHistory, userMessage])
//     setChatMessage("")

//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/regenerate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           feedback: chatMessage,
//           chatSessionId: result.chatSessionId,
//         }),
//       })

//       if (!response.ok) throw new Error("Failed to regenerate")

//       const reader = response.body?.getReader()
//       const decoder = new TextDecoder()

//       if (reader) {
//         while (true) {
//           const { done, value } = await reader.read()
//           if (done) break

//           const chunk = decoder.decode(value)
//           const lines = chunk.split("\n")

//           for (const line of lines) {
//             if (line.startsWith("data: ")) {
//               const data = JSON.parse(line.slice(6))

//               if (data.type === "log") {
//                 setLogs((prev) => [
//                   ...prev,
//                   {
//                     id: `log-${Date.now()}`,
//                     timestamp: new Date(),
//                     level: data.level || "info",
//                     message: data.message,
//                   },
//                 ])
//               } else if (data.type === "file") {
//                 // Update files
//               } else if (data.type === "complete") {
//                 await loadTool()
//               }
//             }
//           }
//         }
//       }
//     } catch (error) {
//       console.error("[v0] Regeneration failed:", error)
//       toast({ title: "Failed to regenerate", variant: "destructive" })
//     } finally {
//       setIsRegenerating(false)
//     }
//   }

//   const filteredFiles = (result?.files ?? []).filter((file) => {
//     const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesFilter =
//       fileFilter === "all" ||
//       (fileFilter === "components" && file.name.includes("components")) ||
//       (fileFilter === "pages" && file.name.includes("app")) ||
//       (fileFilter === "styles" && file.name.includes(".css"))
//     return matchesSearch && matchesFilter
//   })

//   const getDeviceWidth = () => {
//     switch (deviceMode) {
//       case "mobile":
//         return "375px"
//       case "tablet":
//         return "768px"
//       default:
//         return "100%"
//     }
//   }

//   const renderCodeWithSyntax = (code: string) => {
//     const lines = code.split("\n")
//     return (
//       <div className="font-mono text-sm">
//         {lines.map((line, i) => {
//           let coloredLine = line
//           // Keywords
//           coloredLine = coloredLine.replace(
//             /\b(const|let|var|function|return|if|else|for|while|import|export|default|from|async|await|class|extends|interface|type|enum)\b/g,
//             '<span class="text-purple-400">$1</span>',
//           )
//           // Strings
//           coloredLine = coloredLine.replace(/(["'`])(.*?)\1/g, '<span class="text-green-400">$1$2$1</span>')
//           // Comments
//           coloredLine = coloredLine.replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>')
//           // Functions
//           coloredLine = coloredLine.replace(
//             /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g,
//             '<span class="text-blue-400">$1</span>(',
//           )
//           // Numbers
//           coloredLine = coloredLine.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')

//           return (
//             <div key={i} className="flex">
//               <span className="text-gray-600 select-none w-12 text-right pr-4">{i + 1}</span>
//               <span dangerouslySetInnerHTML={{ __html: coloredLine || "&nbsp;" }} />
//             </div>
//           )
//         })}
//       </div>
//     )
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-background">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-muted-foreground mx-auto" />
//           <p className="text-muted-foreground">Loading tool...</p>
//         </div>
//       </div>
//     )
//   }

//   console.log("[v0] Rendering tool detail page", { step, hasResult: !!result, hasFiles: result?.files?.length })

//   return (
//     <div className="h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
//       {/* Header */}
//       <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#111111]">
//         <div className="flex items-center gap-3">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => router.push(`/${orgSlug}/tools`)}
//             className="text-gray-400 hover:text-white"
//           >
//             <ChevronLeft className="h-4 w-4 mr-1" />
//             Back
//           </Button>
//           <div className="h-6 w-px bg-white/10" />
//           <h1 className="text-sm font-medium">{toolName || "Untitled Tool"}</h1>
//           <Badge variant="secondary" className="text-xs">
//             {tool?.status || "DRAFT"}
//           </Badge>
//         </div>

//         <div className="flex items-center gap-2">
//           {result?.previewUrl && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => window.open(result.previewUrl!, "_blank")}
//               className="text-gray-400 hover:text-white"
//             >
//               Open in v0
//             </Button>
//           )}
//           <Button variant="default" size="sm">
//             Publish
//           </Button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex overflow-hidden">
//         {/* Left Sidebar - File Explorer */}
//         <div
//           className={`${
//             isFileExplorerOpen ? "w-64" : "w-0"
//           } border-r border-white/10 bg-[#0f0f0f] transition-all duration-300 overflow-hidden flex flex-col`}
//         >
//           <div className="h-12 border-b border-white/10 flex items-center justify-between px-3">
//             <span className="text-sm font-medium">Files</span>
//             <Button variant="ghost" size="sm" onClick={() => setIsFileExplorerOpen(false)} className="h-7 w-7 p-0">
//               <ChevronLeft className="h-4 w-4" />
//             </Button>
//           </div>

//           <div className="p-2 space-y-2 border-b border-white/10">
//             <div className="relative">
//               <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
//               <Input
//                 placeholder="Search files..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="h-8 pl-8 bg-white/5 border-white/10 text-sm"
//               />
//             </div>
//             <div className="flex gap-1">
//               {["all", "components", "pages", "styles"].map((filter) => (
//                 <Button
//                   key={filter}
//                   variant={fileFilter === filter ? "secondary" : "ghost"}
//                   size="sm"
//                   onClick={() => setFileFilter(filter)}
//                   className="h-7 text-xs flex-1"
//                 >
//                   {filter}
//                 </Button>
//               ))}
//             </div>
//           </div>

//           <ScrollArea className="flex-1">
//             <div className="p-2 space-y-1">
//               {filteredFiles.map((file) => (
//                 <button
//                   key={file.id}
//                   onClick={() => setSelectedFile(file)}
//                   className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
//                     selectedFile?.id === file.id
//                       ? "bg-white/10 text-white"
//                       : "text-gray-400 hover:bg-white/5 hover:text-white"
//                   }`}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span className="truncate">{file.name}</span>
//                     <span className="text-xs text-gray-600 ml-2">{(file.size / 1024).toFixed(1)}kb</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>

//         {/* Toggle File Explorer Button */}
//         {!isFileExplorerOpen && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsFileExplorerOpen(true)}
//             className="absolute left-0 top-20 h-8 w-8 p-0 rounded-r-md rounded-l-none border border-l-0 border-white/10 bg-[#0f0f0f]"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         )}

//         {/* Center - Preview/Code Area */}
//         <div className="flex-1 flex flex-col overflow-hidden">
//           {/* Toolbar */}
//           <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#0f0f0f]">
//             <div className="flex items-center gap-2">
//               <Button
//                 variant={viewMode === "preview" ? "secondary" : "ghost"}
//                 size="sm"
//                 onClick={() => setViewMode("preview")}
//                 disabled={!result?.previewUrl}
//                 className="h-8"
//               >
//                 <Eye className="h-4 w-4 mr-2" />
//                 Preview
//               </Button>
//               <Button
//                 variant={viewMode === "code" ? "secondary" : "ghost"}
//                 size="sm"
//                 onClick={() => setViewMode("code")}
//                 className="h-8"
//               >
//                 <Code2 className="h-4 w-4 mr-2" />
//                 Code
//               </Button>

//               {viewMode === "preview" && result?.previewUrl && (
//                 <>
//                   <div className="h-6 w-px bg-white/10 mx-2" />
//                   <div className="flex items-center gap-1">
//                     <Button
//                       variant={deviceMode === "desktop" ? "secondary" : "ghost"}
//                       size="sm"
//                       onClick={() => setDeviceMode("desktop")}
//                       className="h-8 w-8 p-0"
//                     >
//                       <Monitor className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant={deviceMode === "tablet" ? "secondary" : "ghost"}
//                       size="sm"
//                       onClick={() => setDeviceMode("tablet")}
//                       className="h-8 w-8 p-0"
//                     >
//                       <Tablet className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant={deviceMode === "mobile" ? "secondary" : "ghost"}
//                       size="sm"
//                       onClick={() => setDeviceMode("mobile")}
//                       className="h-8 w-8 p-0"
//                     >
//                       <Smartphone className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </>
//               )}
//             </div>

//             <div className="flex items-center gap-2">
//               {selectedFile && viewMode === "code" && (
//                 <>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => handleCopyCode(selectedFile.content, selectedFile.id)}
//                     className="h-8"
//                   >
//                     {copiedFile === selectedFile.id ? (
//                       <Check className="h-4 w-4 mr-2" />
//                     ) : (
//                       <Copy className="h-4 w-4 mr-2" />
//                     )}
//                     Copy
//                   </Button>
//                   <Button variant="ghost" size="sm" onClick={() => handleDownloadFile(selectedFile)} className="h-8">
//                     <Download className="h-4 w-4 mr-2" />
//                     Download
//                   </Button>
//                 </>
//               )}
//               <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="h-8 w-8 p-0">
//                 {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
//               </Button>
//             </div>
//           </div>

//           {/* Content Area */}
//           <div className="flex-1 overflow-hidden bg-[#0a0a0a]">
//             {isRegenerating ? (
//               <div className="h-full flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                   <div className="relative w-24 h-24 mx-auto">
//                     <div
//                       className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-spin"
//                       style={{ animationDuration: "3s" }}
//                     />
//                     <div className="absolute inset-2 rounded-full bg-[#0a0a0a]" />
//                   </div>
//                   <div>
//                     <p className="text-lg font-medium">Enhancing your tool...</p>
//                     <p className="text-sm text-gray-500 mt-1">This may take a moment</p>
//                   </div>
//                 </div>
//               </div>
//             ) : viewMode === "preview" && result?.previewUrl ? (
//               <div className="h-full flex items-center justify-center p-4">
//                 <div
//                   className="bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300"
//                   style={{ width: getDeviceWidth(), height: "100%", maxHeight: "calc(100vh - 200px)" }}
//                 >
//                   <iframe src={result.previewUrl} className="w-full h-full" title="Preview" />
//                 </div>
//               </div>
//             ) : viewMode === "code" && selectedFile ? (
//               <ScrollArea className="h-full">
//                 <div className="p-6">{renderCodeWithSyntax(selectedFile.content)}</div>
//               </ScrollArea>
//             ) : (
//               <div className="h-full flex items-center justify-center text-gray-500">
//                 <div className="text-center">
//                   <Code2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                   <p>Select a file to view its contents</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Sidebar */}
//         <div
//           className={`${
//             isRightSidebarOpen ? "w-80" : "w-0"
//           } border-l border-white/10 bg-[#0f0f0f] transition-all duration-300 overflow-hidden flex flex-col`}
//         >
//           <div className="h-12 border-b border-white/10 flex items-center justify-between px-3">
//             <Tabs value={rightSidebarTab} onValueChange={setRightSidebarTab} className="flex-1">
//               <TabsList className="grid w-full grid-cols-4 h-9">
//                 <TabsTrigger value="logs" className="text-xs">
//                   <Settings className="h-3.5 w-3.5 mr-1" />
//                   Logs
//                 </TabsTrigger>
//                 <TabsTrigger value="chat" className="text-xs">
//                   <MessageSquare className="h-3.5 w-3.5 mr-1" />
//                   Chat
//                 </TabsTrigger>
//                 <TabsTrigger value="versions" className="text-xs">
//                   <Clock className="h-3.5 w-3.5 mr-1" />
//                   Versions
//                 </TabsTrigger>
//                 <TabsTrigger value="analytics" className="text-xs">
//                   <BarChart3 className="h-3.5 w-3.5 mr-1" />
//                   Stats
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>
//             <Button variant="ghost" size="sm" onClick={() => setIsRightSidebarOpen(false)} className="h-7 w-7 p-0 ml-2">
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>

//           <div className="flex-1 overflow-hidden">
//             <Tabs value={rightSidebarTab} className="h-full flex flex-col">
//               <TabsContent value="logs" className="flex-1 m-0 overflow-hidden flex flex-col">
//                 <ScrollArea className="flex-1">
//                   <div className="p-3 space-y-2">
//                     {logs.map((log) => (
//                       <div key={log.id} className="text-xs space-y-1">
//                         <div className="flex items-center gap-2">
//                           <span className="text-gray-600">{log.timestamp.toLocaleTimeString()}</span>
//                           <Badge variant={log.level === "error" ? "destructive" : "secondary"} className="text-xs h-5">
//                             {log.level}
//                           </Badge>
//                         </div>
//                         <p className="text-gray-300">{log.message}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </TabsContent>

//               <TabsContent value="chat" className="flex-1 m-0 overflow-hidden flex flex-col">
//                 <ScrollArea className="flex-1">
//                   <div className="p-3 space-y-3">
//                     {chatHistory.map((chat) => (
//                       <div key={chat.id} className={`text-sm ${chat.role === "user" ? "text-right" : "text-left"}`}>
//                         <div
//                           className={`inline-block max-w-[85%] p-3 rounded-lg ${
//                             chat.role === "user" ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300"
//                           }`}
//                         >
//                           {chat.content}
//                         </div>
//                         <div className="text-xs text-gray-600 mt-1">{chat.timestamp.toLocaleTimeString()}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>

//                 <div className="p-3 border-t border-white/10">
//                   <div className="flex gap-2">
//                     <Textarea
//                       placeholder="Describe how to improve this tool..."
//                       value={chatMessage}
//                       onChange={(e) => setChatMessage(e.target.value)}
//                       className="min-h-[80px] bg-white/5 border-white/10 resize-none"
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault()
//                           handleSendMessage()
//                         }
//                       }}
//                     />
//                   </div>
//                   <Button
//                     onClick={handleSendMessage}
//                     disabled={!chatMessage.trim() || isRegenerating}
//                     className="w-full mt-2"
//                     size="sm"
//                   >
//                     {isRegenerating ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Enhancing...
//                       </>
//                     ) : (
//                       <>
//                         <Send className="h-4 w-4 mr-2" />
//                         Enhance Tool
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </TabsContent>

//               <TabsContent value="versions" className="flex-1 m-0 overflow-hidden">
//                 <ScrollArea className="h-full">
//                   <div className="p-3 space-y-2">
//                     <div className="text-sm text-gray-500 text-center py-8">Version history coming soon</div>
//                   </div>
//                 </ScrollArea>
//               </TabsContent>

//               <TabsContent value="analytics" className="flex-1 m-0 overflow-hidden">
//                 <ScrollArea className="h-full">
//                   <div className="p-3 space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-400">Total Files</span>
//                         <span className="font-medium">{result?.files?.length ?? 0}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-400">Total Size</span>
//                         <span className="font-medium">
//                           {((result?.files?.reduce((acc, f) => acc + f.size, 0) ?? 0) / 1024).toFixed(1)}kb
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-400">Created</span>
//                         <span className="font-medium">
//                           {tool?.createdAt ? new Date(tool.createdAt).toLocaleDateString() : "N/A"}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-400">Last Updated</span>
//                         <span className="font-medium">
//                           {tool?.updatedAt ? new Date(tool.updatedAt).toLocaleDateString() : "N/A"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </ScrollArea>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>

//         {/* Toggle Right Sidebar Button */}
//         {!isRightSidebarOpen && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setIsRightSidebarOpen(true)}
//             className="absolute right-0 top-20 h-8 w-8 p-0 rounded-l-md rounded-r-none border border-r-0 border-white/10 bg-[#0f0f0f]"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//         )}
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import {
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Monitor,
//   Tablet,
//   Smartphone,
//   Code2,
//   MessageSquare,
//   Clock,
//   BarChart3,
//   Send,
//   Download,
//   Copy,
//   Check,
//   Search,
//   Maximize2,
//   Minimize2,
//   Terminal,
//   FileCode,
//   Sparkles,
//   CheckCircle2,
//   AlertCircle,
//   Info,
//   PanelRightClose,
//   PanelRightOpen,
//   FolderTree,
//   ExternalLink,
//   Rocket,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Card } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import type { GeneratedFile, GenerationResult, ChatMessage, LogEntry, LogLevel } from "@/types"

// export default function ToolDetailPage() {
//   const [loading, setLoading] = useState(true)
//   const [tool, setTool] = useState<any>(null)
//   const [toolName, setToolName] = useState("")
//   const [category, setCategory] = useState("dashboard")
//   const [requirements, setRequirements] = useState("")
//   const [selectedIntegrations, setSelectedIntegrations] = useState<any[]>([])
//   const [result, setResult] = useState<GenerationResult | null>(null)
//   const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
//   const [logs, setLogs] = useState<LogEntry[]>([])
//   const [step, setStep] = useState("create")
//   const [viewMode, setViewMode] = useState<"preview" | "code">("code")
//   const [currentToolId, setCurrentToolId] = useState("")

//   const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
//   const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
//   const [searchQuery, setSearchQuery] = useState("")
//   const [fileFilter, setFileFilter] = useState("all")
//   const [copiedFile, setCopiedFile] = useState<string | null>(null)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [chatMessage, setChatMessage] = useState("")
//   const [isRegenerating, setIsRegenerating] = useState(false)
//   const [rightSidebarTab, setRightSidebarTab] = useState<"chat" | "logs" | "versions" | "analytics">("chat")
//   const [versions, setVersions] = useState<any[]>([])
//   const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string
//   const toolId = params?.id as string

//   useEffect(() => {
//     if (orgSlug && toolId) {
//       loadTool()
//     }
//   }, [orgSlug, toolId])

//   const loadTool = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`)

//       if (!response.ok) {
//         throw new Error("Failed to load tool")
//       }

//       const toolData = await response.json()

//       setTool(toolData)
//       setToolName(toolData.name)
//       setCategory(toolData.category || "dashboard")
//       setRequirements(toolData.requirements || "")
//       setSelectedIntegrations(toolData.integrations || [])

//       const latestChatSession = toolData.chatSessions?.[0]

//       if (latestChatSession) {
//         const files: GeneratedFile[] = latestChatSession.files.map((f: any) => ({
//           id: f.id,
//           name: f.name,
//           path: f.name,
//           content: f.content,
//           type: f.type,
//           size: f.size || 0,
//           language: f.type,
//           createdAt: new Date(f.createdAt),
//           updatedAt: new Date(f.updatedAt),
//         }))

//         const generationResult: GenerationResult = {
//           success: true,
//           toolId: toolData.id,
//           chatSessionId: latestChatSession.id,
//           files,
//           previewUrl: toolData.previewUrl || undefined,
//           chatUrl: toolData.chatUrl || undefined,
//         }

//         setResult(generationResult)
//         if (files.length > 0) {
//           setSelectedFile(files[0])
//         }

//         const chatMessages: ChatMessage[] = latestChatSession.messages.map((m: any) => ({
//           id: m.id,
//           content: m.content,
//           role: m.role,
//           timestamp: new Date(m.createdAt),
//         }))
//         setChatHistory(chatMessages)

//         setStep("preview")
//         setViewMode(generationResult.previewUrl ? "preview" : "code")
//       } else {
//         setStep("configure")
//       }

//       setCurrentToolId(toolData.id)
//     } catch (error) {
//       console.error("[v0] Failed to load tool:", error)
//       toast({ title: "Failed to load tool", variant: "destructive" })
//       router.push(`/${orgSlug}/tools`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCopyCode = (content: string, fileId: string) => {
//     navigator.clipboard.writeText(content)
//     setCopiedFile(fileId)
//     setTimeout(() => setCopiedFile(null), 2000)
//     toast({ title: "Code copied to clipboard" })
//   }

//   const handleDownloadFile = (file: GeneratedFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     a.click()
//     URL.revokeObjectURL(url)
//   }

//   const handleSendMessage = async () => {
//     if (!chatMessage.trim() || !result) return

//     setIsRegenerating(true)
//     const userMessage: ChatMessage = {
//       id: `user-${Date.now()}`,
//       content: chatMessage,
//       role: "user",
//       timestamp: new Date(),
//     }
//     setChatHistory([...chatHistory, userMessage])
//     setChatMessage("")

//     try {
//       // Simulate regeneration - replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const assistantMessage: ChatMessage = {
//         id: `assistant-${Date.now()}`,
//         content: "Tool enhanced successfully! The changes have been applied.",
//         role: "assistant",
//         timestamp: new Date(),
//       }
//       setChatHistory((prev) => [...prev, assistantMessage])

//       toast({ title: "Tool enhanced successfully!" })
//       await loadTool()
//     } catch (error) {
//       console.error("[v0] Regeneration failed:", error)
//       toast({ title: "Failed to regenerate", variant: "destructive" })
//     } finally {
//       setIsRegenerating(false)
//     }
//   }

//   const filteredFiles = (result?.files ?? []).filter((file) => {
//     const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
//     const matchesFilter =
//       fileFilter === "all" ||
//       (fileFilter === "components" && file.name.includes("components")) ||
//       (fileFilter === "pages" && file.name.includes("app")) ||
//       (fileFilter === "styles" && file.name.includes(".css"))
//     return matchesSearch && matchesFilter
//   })

//   const getDeviceDimensions = () => {
//     switch (deviceMode) {
//       case "mobile":
//         return { width: "375px", height: "667px" }
//       case "tablet":
//         return { width: "768px", height: "1024px" }
//       default:
//         return { width: "100%", height: "100%" }
//     }
//   }

//   const deviceDimensions = getDeviceDimensions()

//   const highlightCode = (code: string) => {
//     const keywords = [
//       "import",
//       "export",
//       "default",
//       "from",
//       "const",
//       "let",
//       "var",
//       "function",
//       "return",
//       "if",
//       "else",
//       "for",
//       "while",
//       "class",
//       "interface",
//       "type",
//       "async",
//       "await",
//       "try",
//       "catch",
//       "throw",
//       "new",
//       "this",
//       "extends",
//       "implements",
//     ]

//     let highlighted = code

//     highlighted = highlighted.replace(
//       /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g,
//       '<span class="text-emerald-400">$1$2$1</span>',
//     )
//     highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
//     highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')

//     keywords.forEach((keyword) => {
//       const regex = new RegExp(`\\b(${keyword})\\b`, "g")
//       highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-semibold">$1</span>')
//     })

//     highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
//     highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-yellow-400">$1</span>(')

//     return highlighted
//   }

//   const getLogIcon = (level: LogLevel) => {
//     switch (level) {
//       case "error":
//         return <AlertCircle className="h-4 w-4" />
//       case "success":
//         return <CheckCircle2 className="h-4 w-4" />
//       case "warning":
//         return <AlertCircle className="h-4 w-4" />
//       default:
//         return <Info className="h-4 w-4" />
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
//         <div className="text-center space-y-4">
//           <Loader2 className="h-12 w-12 animate-spin text-gray-500 mx-auto" />
//           <p className="text-gray-500">Loading tool...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
//       {/* Header - Same as create page */}
//       <div className="border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl sticky top-0 z-50">
//         <div className="max-w-[2400px] mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => router.push(`/${orgSlug}/tools`)}
//               className="text-gray-400 hover:text-white hover:bg-white/5"
//             >
//               <ChevronLeft className="h-4 w-4 mr-1" />
//               Back
//             </Button>
//             <Separator orientation="vertical" className="h-6 bg-white/10" />
//             <div className="flex items-center gap-3">
//               <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
//               <div>
//                 <span className="text-sm font-semibold text-white">{toolName}</span>
//                 {result && <p className="text-xs text-gray-500">{result.files?.length} files generated</p>}
//               </div>
//             </div>
//           </div>

//           {result && (
//             <div className="flex items-center gap-3">
//               {result.previewUrl && (
//                 <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
//                   <Button
//                     variant={viewMode === "preview" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("preview")}
//                     className="h-9 px-4 text-xs"
//                   >
//                     <Monitor className="h-4 w-4 mr-2" />
//                     Preview
//                   </Button>
//                   <Button
//                     variant={viewMode === "code" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("code")}
//                     className="h-9 px-4 text-xs"
//                   >
//                     <Code2 className="h-4 w-4 mr-2" />
//                     Code
//                   </Button>
//                 </div>
//               )}

//               {result.previewUrl && viewMode === "preview" && (
//                 <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
//                   <Button
//                     variant={deviceMode === "desktop" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setDeviceMode("desktop")}
//                     className="h-9 w-9 p-0"
//                   >
//                     <Monitor className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant={deviceMode === "tablet" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setDeviceMode("tablet")}
//                     className="h-9 w-9 p-0"
//                   >
//                     <Tablet className="h-4 w-4" />
//                   </Button>
//                   <Button
//                     variant={deviceMode === "mobile" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setDeviceMode("mobile")}
//                     className="h-9 w-9 p-0"
//                   >
//                     <Smartphone className="h-4 w-4" />
//                   </Button>
//                 </div>
//               )}

//               <Separator orientation="vertical" className="h-6 bg-white/10" />

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="text-gray-400 hover:text-white hover:bg-white/5"
//               >
//                 {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
//               </Button>

//               <Separator orientation="vertical" className="h-6 bg-white/10" />

//               <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
//                 <Rocket className="h-4 w-4 mr-2" />
//                 Deploy
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Main Content - Same structure as create page */}
//       {result && (
//         <div className="flex-1 flex overflow-hidden">
//           {/* Left Sidebar - File Explorer */}
//           <div
//             className={`border-r border-white/10 bg-[#111111] flex flex-col transition-all duration-300 ${
//               isSidebarCollapsed ? "w-14" : "w-80"
//             }`}
//           >
//             {isSidebarCollapsed ? (
//               <div className="p-3 flex flex-col items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsSidebarCollapsed(false)}
//                   className="w-full h-10 text-gray-400 hover:text-white hover:bg-white/5"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </Button>
//                 <Separator className="bg-white/10" />
//                 <Button variant="ghost" size="sm" className="w-full h-10 text-gray-400">
//                   <FolderTree className="h-5 w-5" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="p-5 border-b border-white/10 space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-base font-bold text-white flex items-center gap-2">
//                         <FolderTree className="h-4 w-4" />
//                         Project Files
//                       </h3>
//                       <p className="text-xs text-gray-500 mt-1">{result.files?.length} files</p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setIsSidebarCollapsed(true)}
//                       className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
//                     <Input
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       placeholder="Search files..."
//                       className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder-gray-500"
//                     />
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <Button
//                       variant={fileFilter === "all" ? "secondary" : "ghost"}
//                       size="sm"
//                       onClick={() => setFileFilter("all")}
//                       className="h-8 px-3 text-xs flex-1"
//                     >
//                       All
//                     </Button>
//                     <Button
//                       variant={fileFilter === "components" ? "secondary" : "ghost"}
//                       size="sm"
//                       onClick={() => setFileFilter("components")}
//                       className="h-8 px-3 text-xs flex-1"
//                     >
//                       Components
//                     </Button>
//                     <Button
//                       variant={fileFilter === "pages" ? "secondary" : "ghost"}
//                       size="sm"
//                       onClick={() => setFileFilter("pages")}
//                       className="h-8 px-3 text-xs flex-1"
//                     >
//                       Pages
//                     </Button>
//                   </div>
//                 </div>

//                 <ScrollArea className="flex-1 p-3">
//                   <div className="space-y-1">
//                     {filteredFiles.map((file) => (
//                       <div
//                         key={file.id}
//                         className={`group rounded-lg transition-all ${
//                           selectedFile?.id === file.id
//                             ? "bg-blue-500/10 border border-blue-500/20"
//                             : "hover:bg-white/5 border border-transparent"
//                         }`}
//                       >
//                         <button
//                           onClick={() => setSelectedFile(file)}
//                           className="w-full text-left p-3 flex items-center gap-3"
//                         >
//                           <FileCode
//                             className={`h-4 w-4 flex-shrink-0 ${selectedFile?.id === file.id ? "text-blue-500" : "text-gray-500"}`}
//                           />
//                           <div className="flex-1 min-w-0">
//                             <p
//                               className={`text-sm font-medium font-mono truncate ${selectedFile?.id === file.id ? "text-white" : "text-gray-400"}`}
//                             >
//                               {file.name}
//                             </p>
//                             <p className="text-xs text-gray-600 mt-0.5">{file.content.split("\n").length} lines</p>
//                           </div>
//                           {selectedFile?.id === file.id && <Check className="h-4 w-4 flex-shrink-0 text-blue-500" />}
//                         </button>
//                         <div
//                           className={`px-3 pb-2 flex items-center gap-1 transition-all ${
//                             selectedFile?.id === file.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
//                           }`}
//                         >
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleCopyCode(file.content, file.id)
//                             }}
//                             className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/5"
//                           >
//                             {copiedFile === file.id ? (
//                               <Check className="h-3 w-3 mr-1" />
//                             ) : (
//                               <Copy className="h-3 w-3 mr-1" />
//                             )}
//                             Copy
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               handleDownloadFile(file)
//                             }}
//                             className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/5"
//                           >
//                             <Download className="h-3 w-3 mr-1" />
//                             Save
//                           </Button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </>
//             )}
//           </div>

//           {/* Center - Preview/Code Area */}
//           <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden relative">
//             {isRegenerating && (
//               <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40 flex items-center justify-center">
//                 <div className="w-full max-w-4xl px-8">
//                   <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-6 relative">
//                       <Sparkles className="h-10 w-10 text-blue-500 animate-pulse" />
//                       <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-white mb-2">Enhancing Your Tool</h3>
//                     <p className="text-gray-400">AI is applying your requested changes...</p>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="h-12 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse" />
//                     <div className="grid grid-cols-3 gap-4">
//                       <div
//                         className="h-32 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-lg animate-pulse"
//                         style={{ animationDelay: "0.1s" }}
//                       />
//                       <div
//                         className="h-32 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-lg animate-pulse"
//                         style={{ animationDelay: "0.2s" }}
//                       />
//                       <div
//                         className="h-32 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-lg animate-pulse"
//                         style={{ animationDelay: "0.3s" }}
//                       />
//                     </div>
//                     <div
//                       className="h-64 bg-gradient-to-b from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse"
//                       style={{ animationDelay: "0.4s" }}
//                     />
//                   </div>

//                   <div className="mt-8 flex items-center justify-center gap-2">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
//                     <div
//                       className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.2s" }}
//                     />
//                     <div
//                       className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
//                       style={{ animationDelay: "0.4s" }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex-1 flex overflow-hidden">
//               {viewMode === "preview" && result.previewUrl ? (
//                 <div className="flex-1 flex flex-col bg-[#0f0f0f]">
//                   <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111111]/50 backdrop-blur-sm">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
//                         <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
//                         <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
//                       </div>
//                       <div className="flex-1 min-w-0 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
//                         <span className="text-xs text-gray-500 font-mono truncate block">{result.previewUrl}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-3">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => window.open(result.previewUrl!, "_blank")}
//                         className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
//                       >
//                         <ExternalLink className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent p-8">
//                     <div
//                       className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
//                       style={{
//                         width: deviceDimensions.width,
//                         height: deviceDimensions.height,
//                         maxWidth: "100%",
//                         maxHeight: "100%",
//                       }}
//                     >
//                       <iframe
//                         src={result.previewUrl}
//                         className="w-full h-full"
//                         title="Generated Tool Preview"
//                         sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex-1 flex flex-col">
//                   <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111111]/50 backdrop-blur-sm">
//                     <div className="flex items-center gap-3">
//                       <FileCode className="h-4 w-4 text-blue-500" />
//                       <span className="text-sm font-semibold font-mono text-white">
//                         {selectedFile?.name || "No file selected"}
//                       </span>
//                       {selectedFile && (
//                         <>
//                           <Badge variant="secondary" className="text-xs bg-white/5 text-gray-400">
//                             {selectedFile.type}
//                           </Badge>
//                           <Badge variant="outline" className="text-xs border-white/10 text-gray-500">
//                             {selectedFile.content.split("\n").length} lines
//                           </Badge>
//                         </>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           if (selectedFile) {
//                             handleCopyCode(selectedFile.content, selectedFile.id)
//                           }
//                         }}
//                         className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5"
//                         disabled={!selectedFile}
//                       >
//                         {copiedFile === selectedFile?.id ? (
//                           <Check className="h-3.5 w-3.5 mr-1.5" />
//                         ) : (
//                           <Copy className="h-3.5 w-3.5 mr-1.5" />
//                         )}
//                         Copy
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => selectedFile && handleDownloadFile(selectedFile)}
//                         className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5"
//                         disabled={!selectedFile}
//                       >
//                         <Download className="h-3.5 w-3.5 mr-1.5" />
//                         Download
//                       </Button>
//                     </div>
//                   </div>
//                   <ScrollArea className="flex-1 bg-[#1e1e1e]">
//                     {selectedFile ? (
//                       <div className="p-6">
//                         <pre className="text-sm font-mono leading-relaxed">
//                           {selectedFile.content.split("\n").map((line, i) => (
//                             <div key={i} className="flex">
//                               <span className="text-gray-600 select-none w-12 text-right pr-4 flex-shrink-0">
//                                 {i + 1}
//                               </span>
//                               <code
//                                 className="flex-1"
//                                 dangerouslySetInnerHTML={{
//                                   __html: highlightCode(line),
//                                 }}
//                               />
//                             </div>
//                           ))}
//                         </pre>
//                       </div>
//                     ) : (
//                       <div className="flex items-center justify-center h-full">
//                         <div className="text-center">
//                           <FileCode className="h-16 w-16 text-gray-700 mx-auto mb-4" />
//                           <p className="text-gray-500">Select a file to view its code</p>
//                         </div>
//                       </div>
//                     )}
//                   </ScrollArea>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right Sidebar - Enhanced (same as create page) */}
//           <div
//             className={`border-l border-white/10 bg-[#111111] flex flex-col transition-all duration-300 ${
//               isRightSidebarCollapsed ? "w-14" : "w-[420px]"
//             }`}
//           >
//             {isRightSidebarCollapsed ? (
//               <div className="p-3 flex flex-col items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsRightSidebarCollapsed(false)}
//                   className="w-full h-10 text-gray-400 hover:text-white hover:bg-white/5"
//                 >
//                   <PanelRightOpen className="h-5 w-5" />
//                 </Button>
//                 <Separator className="bg-white/10" />
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="w-full h-10 text-gray-400"
//                   onClick={() => {
//                     setIsRightSidebarCollapsed(false)
//                     setRightSidebarTab("chat")
//                   }}
//                 >
//                   <MessageSquare className="h-5 w-5" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="w-full h-10 text-gray-400"
//                   onClick={() => {
//                     setIsRightSidebarCollapsed(false)
//                     setRightSidebarTab("logs")
//                   }}
//                 >
//                   <Terminal className="h-5 w-5" />
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex flex-col h-full">
//                 <div className="border-b border-white/10 bg-[#111111]/50 backdrop-blur-sm flex-shrink-0">
//                   <div className="flex items-center justify-between px-4 py-3">
//                     <div className="flex items-center gap-2 flex-1">
//                       <Button
//                         variant={rightSidebarTab === "chat" ? "secondary" : "ghost"}
//                         size="sm"
//                         onClick={() => setRightSidebarTab("chat")}
//                         className="h-9 px-4 text-xs"
//                       >
//                         <MessageSquare className="h-4 w-4 mr-2" />
//                         Chat
//                       </Button>
//                       <Button
//                         variant={rightSidebarTab === "logs" ? "secondary" : "ghost"}
//                         size="sm"
//                         onClick={() => setRightSidebarTab("logs")}
//                         className="h-9 px-4 text-xs"
//                       >
//                         <Terminal className="h-4 w-4 mr-2" />
//                         Logs
//                       </Button>
//                       <Button
//                         variant={rightSidebarTab === "analytics" ? "secondary" : "ghost"}
//                         size="sm"
//                         onClick={() => setRightSidebarTab("analytics")}
//                         className="h-9 px-4 text-xs"
//                       >
//                         <BarChart3 className="h-4 w-4 mr-2" />
//                         Stats
//                       </Button>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setIsRightSidebarCollapsed(true)}
//                       className="h-8 w-8 p-0 ml-2 text-gray-400 hover:text-white hover:bg-white/5"
//                     >
//                       <PanelRightClose className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex-1 overflow-hidden flex flex-col min-h-0">
//                   {rightSidebarTab === "chat" && (
//                     <>
//                       <div className="p-5 border-b border-white/10 flex-shrink-0">
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
//                             <Sparkles className="h-5 w-5 text-white" />
//                           </div>
//                           <div>
//                             <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
//                             <p className="text-xs text-gray-500">Ready to enhance your tool</p>
//                           </div>
//                         </div>
//                       </div>

//                       <ScrollArea className="flex-1 min-h-0">
//                         <div className="p-5 space-y-4">
//                           {chatHistory.length === 0 ? (
//                             <div className="text-center py-12">
//                               <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
//                                 <MessageSquare className="h-8 w-8 text-blue-500" />
//                               </div>
//                               <p className="text-sm text-white font-medium mb-1">Start a conversation</p>
//                               <p className="text-xs text-gray-500">Ask AI to improve or modify your tool</p>
//                             </div>
//                           ) : (
//                             chatHistory.map((msg) => (
//                               <div
//                                 key={msg.id}
//                                 className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                               >
//                                 {msg.role === "assistant" && (
//                                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
//                                     <Sparkles className="h-4 w-4 text-white" />
//                                   </div>
//                                 )}
//                                 <div
//                                   className={`max-w-[75%] rounded-2xl p-4 ${
//                                     msg.role === "user"
//                                       ? "bg-blue-600 text-white"
//                                       : "bg-white/5 text-gray-300 border border-white/10"
//                                   }`}
//                                 >
//                                   <p className="text-sm leading-relaxed">{msg.content}</p>
//                                   <p className="text-xs opacity-60 mt-2">{msg.timestamp.toLocaleTimeString()}</p>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </ScrollArea>

//                       <div className="p-5 border-t border-white/10 flex-shrink-0 bg-[#0f0f0f]">
//                         <div className="space-y-3">
//                           <Textarea
//                             value={chatMessage}
//                             onChange={(e) => setChatMessage(e.target.value)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault()
//                                 handleSendMessage()
//                               }
//                             }}
//                             placeholder="Describe what you want to improve...&#10;&#10;Examples:&#10;• Add a dark mode toggle&#10;• Make the layout more responsive&#10;• Add animation to the buttons"
//                             className="min-h-[120px] max-h-[200px] bg-white/5 border-white/10 text-white placeholder-gray-500 resize-none text-sm leading-relaxed"
//                             disabled={isRegenerating}
//                           />
//                           <Button
//                             onClick={handleSendMessage}
//                             disabled={!chatMessage.trim() || isRegenerating}
//                             size="sm"
//                             className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
//                           >
//                             {isRegenerating ? (
//                               <>
//                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                 Enhancing Tool...
//                               </>
//                             ) : (
//                               <>
//                                 <Send className="h-4 w-4 mr-2" />
//                                 Enhance Tool
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {rightSidebarTab === "logs" && (
//                     <>
//                       <div className="p-5 border-b border-white/10 flex-shrink-0">
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-2">
//                             <Terminal className="h-4 w-4 text-gray-500" />
//                             <span className="text-sm font-semibold text-white">Generation Logs</span>
//                           </div>
//                           <Badge variant="secondary" className="text-xs bg-white/5 text-gray-400">
//                             {logs.length} events
//                           </Badge>
//                         </div>
//                       </div>
//                       <ScrollArea className="flex-1 min-h-0">
//                         <div className="p-5 space-y-3">
//                           {logs.length === 0 ? (
//                             <div className="text-center py-12">
//                               <Terminal className="h-12 w-12 text-gray-700 mx-auto mb-3" />
//                               <p className="text-sm text-gray-500">No logs yet</p>
//                             </div>
//                           ) : (
//                             logs.map((log) => (
//                               <div
//                                 key={log.id}
//                                 className={`p-4 rounded-xl border ${
//                                   log.level === "error"
//                                     ? "bg-red-500/10 border-red-500/20"
//                                     : log.level === "success"
//                                       ? "bg-emerald-500/10 border-emerald-500/20"
//                                       : log.level === "warning"
//                                         ? "bg-yellow-500/10 border-yellow-500/20"
//                                         : "bg-white/5 border-white/10"
//                                 }`}
//                               >
//                                 <div className="flex items-start gap-3">
//                                   <span
//                                     className={`flex-shrink-0 mt-0.5 ${
//                                       log.level === "error"
//                                         ? "text-red-400"
//                                         : log.level === "success"
//                                           ? "text-emerald-400"
//                                           : log.level === "warning"
//                                             ? "text-yellow-400"
//                                             : "text-gray-400"
//                                     }`}
//                                   >
//                                     {getLogIcon(log.level)}
//                                   </span>
//                                   <div className="flex-1 min-w-0">
//                                     <p
//                                       className={`text-sm font-medium ${
//                                         log.level === "error"
//                                           ? "text-red-400"
//                                           : log.level === "success"
//                                             ? "text-emerald-400"
//                                             : log.level === "warning"
//                                               ? "text-yellow-400"
//                                               : "text-gray-300"
//                                       }`}
//                                     >
//                                       {log.message}
//                                     </p>
//                                     <p className="text-xs text-gray-600 mt-1.5">{log.timestamp.toLocaleTimeString()}</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))
//                           )}
//                         </div>
//                       </ScrollArea>
//                     </>
//                   )}

//                   {rightSidebarTab === "analytics" && (
//                     <>
//                       <div className="p-5 border-b border-white/10 flex-shrink-0">
//                         <div className="flex items-center gap-2">
//                           <BarChart3 className="h-4 w-4 text-gray-500" />
//                           <span className="text-sm font-semibold text-white">Generation Stats</span>
//                         </div>
//                       </div>
//                       <ScrollArea className="flex-1 min-h-0">
//                         <div className="p-5 space-y-4">
//                           <Card className="bg-white/5 border-white/10 p-5">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <p className="text-xs text-gray-500 mb-1">Total Files</p>
//                                 <p className="text-3xl font-bold text-white">{result.files?.length}</p>
//                               </div>
//                               <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
//                                 <FileCode className="h-6 w-6 text-blue-500" />
//                               </div>
//                             </div>
//                           </Card>

//                           <Card className="bg-white/5 border-white/10 p-5">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <p className="text-xs text-gray-500 mb-1">Lines of Code</p>
//                                 <p className="text-3xl font-bold text-white">
//                                   {result.files?.reduce((acc, f) => acc + f.content.split("\n").length, 0)}
//                                 </p>
//                               </div>
//                               <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
//                                 <Code2 className="h-6 w-6 text-emerald-500" />
//                               </div>
//                             </div>
//                           </Card>

//                           <Card className="bg-white/5 border-white/10 p-5">
//                             <div className="flex items-center justify-between">
//                               <div>
//                                 <p className="text-xs text-gray-500 mb-1">Created</p>
//                                 <p className="text-lg font-bold text-white">
//                                   {tool?.createdAt ? new Date(tool.createdAt).toLocaleDateString() : "N/A"}
//                                 </p>
//                               </div>
//                               <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
//                                 <Clock className="h-6 w-6 text-purple-500" />
//                               </div>
//                             </div>
//                           </Card>

//                           <Separator className="bg-white/10" />

//                           <div>
//                             <h4 className="text-sm font-semibold text-white mb-3">File Types</h4>
//                             <div className="space-y-2">
//                               {Object.entries(
//                                 result.files.reduce(
//                                   (acc, file) => {
//                                     const ext = file.name.split(".").pop() || "other"
//                                     acc[ext] = (acc[ext] || 0) + 1
//                                     return acc
//                                   },
//                                   {} as Record<string, number>,
//                                 ),
//                               ).map(([type, count]) => (
//                                 <div key={type} className="flex items-center justify-between">
//                                   <span className="text-sm text-gray-400 font-mono">.{type}</span>
//                                   <Badge variant="secondary" className="bg-white/5 text-gray-400">
//                                     {count}
//                                   </Badge>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         </div>
//                       </ScrollArea>
//                     </>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  MessageSquare,
  Clock,
  BarChart3,
  Send,
  Download,
  Copy,
  Check,
  Search,
  Maximize2,
  Minimize2,
  Terminal,
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  PanelRightClose,
  PanelRightOpen,
  FolderTree,
  ExternalLink,
  Rocket,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { GeneratedFile, GenerationResult, ChatMessage, LogEntry, LogLevel } from "@/types"

export default function ToolDetailPage() {
  const [loading, setLoading] = useState(true)
  const [tool, setTool] = useState<any>(null)
  const [toolName, setToolName] = useState("")
  const [category, setCategory] = useState("dashboard")
  const [requirements, setRequirements] = useState("")
  const [selectedIntegrations, setSelectedIntegrations] = useState<any[]>([])
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [step, setStep] = useState("create")
  const [viewMode, setViewMode] = useState<"preview" | "code">("code")
  const [currentToolId, setCurrentToolId] = useState("")

  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [searchQuery, setSearchQuery] = useState("")
  const [fileFilter, setFileFilter] = useState("all")
  const [copiedFile, setCopiedFile] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [rightSidebarTab, setRightSidebarTab] = useState<"chat" | "logs" | "versions" | "analytics">("chat")
  const [versions, setVersions] = useState<any[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.slug as string
  const toolId = params?.id as string

  useEffect(() => {
    if (orgSlug && toolId) {
      loadTool()
    }
  }, [orgSlug, toolId])

  const loadTool = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`)

      if (!response.ok) {
        throw new Error("Failed to load tool")
      }

      const toolData = await response.json()

      setTool(toolData)
      setToolName(toolData.name)
      setCategory(toolData.category || "dashboard")
      setRequirements(toolData.requirements || "")
      setSelectedIntegrations(toolData.integrations || [])

      const latestChatSession = toolData.chatSessions?.[0]

      if (latestChatSession) {
        const files: GeneratedFile[] = latestChatSession.files.map((f: any) => ({
          id: f.id,
          name: f.name,
          path: f.name,
          content: f.content,
          type: f.type,
          size: f.size || 0,
          language: f.type,
          createdAt: new Date(f.createdAt),
          updatedAt: new Date(f.updatedAt),
        }))

        const generationResult: GenerationResult = {
          success: true,
          toolId: toolData.id,
          chatSessionId: latestChatSession.id,
          files,
          previewUrl: toolData.previewUrl || undefined,
          chatUrl: toolData.chatUrl || undefined,
        }

        setResult(generationResult)
        if (files.length > 0) {
          setSelectedFile(files[0])
        }

        const chatMessages: ChatMessage[] = latestChatSession.messages.map((m: any) => ({
          id: m.id,
          content: m.content,
          role: m.role,
          timestamp: new Date(m.createdAt),
        }))
        setChatHistory(chatMessages)

        setStep("preview")
        setViewMode(generationResult.previewUrl ? "preview" : "code")
      } else {
        setStep("configure")
      }

      setCurrentToolId(toolData.id)
    } catch (error) {
      console.error("[v0] Failed to load tool:", error)
      toast({ title: "Failed to load tool", variant: "destructive" })
      router.push(`/${orgSlug}/tools`)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = (content: string, fileId: string) => {
    navigator.clipboard.writeText(content)
    setCopiedFile(fileId)
    setTimeout(() => setCopiedFile(null), 2000)
    toast({ title: "Code copied to clipboard" })
  }

  const handleDownloadFile = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !result) return

    setIsRegenerating(true)
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: chatMessage,
      role: "user",
      timestamp: new Date(),
    }
    setChatHistory([...chatHistory, userMessage])
    setChatMessage("")

    try {
      // Simulate regeneration - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        content: "Tool enhanced successfully! The changes have been applied.",
        role: "assistant",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, assistantMessage])

      toast({ title: "Tool enhanced successfully!" })
      await loadTool()
    } catch (error) {
      console.error("[v0] Regeneration failed:", error)
      toast({ title: "Failed to regenerate", variant: "destructive" })
    } finally {
      setIsRegenerating(false)
    }
  }

  const filteredFiles = (result?.files ?? []).filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      fileFilter === "all" ||
      (fileFilter === "components" && file.name.includes("components")) ||
      (fileFilter === "pages" && file.name.includes("app")) ||
      (fileFilter === "styles" && file.name.includes(".css"))
    return matchesSearch && matchesFilter
  })

  const getDeviceDimensions = () => {
    switch (deviceMode) {
      case "mobile":
        return { width: "375px", height: "667px" }
      case "tablet":
        return { width: "768px", height: "1024px" }
      default:
        return { width: "100%", height: "100%" }
    }
  }

  const deviceDimensions = getDeviceDimensions()

  const highlightCode = (code: string) => {
    const keywords = [
      "import",
      "export",
      "default",
      "from",
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "interface",
      "type",
      "async",
      "await",
      "try",
      "catch",
      "throw",
      "new",
      "this",
      "extends",
      "implements",
    ]

    let highlighted = code

    highlighted = highlighted.replace(
      /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g,
      '<span class="text-emerald-400">$1$2$1</span>',
    )
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "g")
      highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-semibold">$1</span>')
    })

    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')
    highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-yellow-400">$1</span>(')

    return highlighted
  }

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4" />
      case "success":
        return <CheckCircle2 className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-gray-500 mx-auto" />
          <p className="text-gray-500">Loading tool...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      {/* Header - Same as create page */}
      <div className="border-b border-white/10 bg-[#111111]/95 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[2400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/${orgSlug}/tools`)}
              className="text-gray-400 hover:text-white hover:bg-white/5"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
              <div>
                <span className="text-sm font-semibold text-white">{toolName}</span>
                {result && <p className="text-xs text-gray-500">{result.files?.length} files generated</p>}
              </div>
            </div>
          </div>

          {result && (
            <div className="flex items-center gap-3">
              {result.previewUrl && (
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                  <Button
                    variant={viewMode === "preview" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("preview")}
                    className="h-9 px-4 text-xs"
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button
                    variant={viewMode === "code" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("code")}
                    className="h-9 px-4 text-xs"
                  >
                    <Code2 className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                </div>
              )}

              {result.previewUrl && viewMode === "preview" && (
                <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                  <Button
                    variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceMode("desktop")}
                    className="h-9 w-9 p-0"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={deviceMode === "tablet" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceMode("tablet")}
                    className="h-9 w-9 p-0"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceMode("mobile")}
                    className="h-9 w-9 p-0"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Separator orientation="vertical" className="h-6 bg-white/10" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Separator orientation="vertical" className="h-6 bg-white/10" />

              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Rocket className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Same structure as create page */}
      {result && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - File Explorer */}
          <div
            className={`border-r border-white/10 bg-[#111111] flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? "w-14" : "w-80"
            }`}
          >
            {isSidebarCollapsed ? (
              <div className="p-3 flex flex-col items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="w-full h-10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Separator className="bg-white/10" />
                <Button variant="ghost" size="sm" className="w-full h-10 text-gray-400">
                  <FolderTree className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        Project Files
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{result.files?.length} files</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search files..."
                      className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder-gray-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant={fileFilter === "all" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFileFilter("all")}
                      className="h-8 px-3 text-xs flex-1"
                    >
                      All
                    </Button>
                    <Button
                      variant={fileFilter === "components" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFileFilter("components")}
                      className="h-8 px-3 text-xs flex-1"
                    >
                      Components
                    </Button>
                    <Button
                      variant={fileFilter === "pages" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setFileFilter("pages")}
                      className="h-8 px-3 text-xs flex-1"
                    >
                      Pages
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-1">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`group rounded-lg transition-all ${
                          selectedFile?.id === file.id
                            ? "bg-blue-500/10 border border-blue-500/20"
                            : "hover:bg-white/5 border border-transparent"
                        }`}
                      >
                        <button
                          onClick={() => setSelectedFile(file)}
                          className="w-full text-left p-3 flex items-center gap-3"
                        >
                          <FileCode
                            className={`h-4 w-4 flex-shrink-0 ${selectedFile?.id === file.id ? "text-blue-500" : "text-gray-500"}`}
                          />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium font-mono truncate ${selectedFile?.id === file.id ? "text-white" : "text-gray-400"}`}
                            >
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-600 mt-0.5">{file.content.split("\n").length} lines</p>
                          </div>
                          {selectedFile?.id === file.id && <Check className="h-4 w-4 flex-shrink-0 text-blue-500" />}
                        </button>
                        <div
                          className={`px-3 pb-2 flex items-center gap-1 transition-all ${
                            selectedFile?.id === file.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCopyCode(file.content, file.id)
                            }}
                            className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/5"
                          >
                            {copiedFile === file.id ? (
                              <Check className="h-3 w-3 mr-1" />
                            ) : (
                              <Copy className="h-3 w-3 mr-1" />
                            )}
                            Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownloadFile(file)
                            }}
                            className="h-7 px-2 text-xs text-gray-400 hover:text-white hover:bg-white/5"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>

          {/* Center - Preview/Code Area */}
          <div className="flex-1 flex flex-col bg-[#0a0a0a] overflow-hidden relative">
            {isRegenerating && (
              <div className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40 flex items-center justify-center">
                <div className="w-full max-w-4xl px-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-6 relative">
                      <Sparkles className="h-10 w-10 text-blue-500 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20 animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Enhancing Your Tool</h3>
                    <p className="text-gray-400">AI is applying your requested changes...</p>
                  </div>

                  <div className="space-y-4">
                    <div className="h-12 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className="h-32 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-lg animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="h-32 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-lg animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-32 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent rounded-lg animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                    <div
                      className="h-64 bg-gradient-to-b from-white/5 via-white/10 to-white/5 rounded-lg animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 flex overflow-hidden">
              {viewMode === "preview" && result.previewUrl ? (
                <div className="flex-1 flex flex-col bg-[#0f0f0f]">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111111]/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                        <span className="text-xs text-gray-500 font-mono truncate block">{result.previewUrl}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(result.previewUrl!, "_blank")}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-white/5"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent p-8">
                    <div
                      className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
                      style={{
                        width: deviceDimensions.width,
                        height: deviceDimensions.height,
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    >
                      <iframe
                        src={result.previewUrl}
                        className="w-full h-full"
                        title="Generated Tool Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111111]/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <FileCode className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-semibold font-mono text-white">
                        {selectedFile?.name || "No file selected"}
                      </span>
                      {selectedFile && (
                        <>
                          <Badge variant="secondary" className="text-xs bg-white/5 text-gray-400">
                            {selectedFile.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-white/10 text-gray-500">
                            {selectedFile.content.split("\n").length} lines
                          </Badge>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (selectedFile) {
                            handleCopyCode(selectedFile.content, selectedFile.id)
                          }
                        }}
                        className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5"
                        disabled={!selectedFile}
                      >
                        {copiedFile === selectedFile?.id ? (
                          <Check className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectedFile && handleDownloadFile(selectedFile)}
                        className="h-8 px-3 text-xs text-gray-400 hover:text-white hover:bg-white/5"
                        disabled={!selectedFile}
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 bg-[#1e1e1e]">
                    {selectedFile ? (
                      <div className="p-6">
                        <pre className="text-sm font-mono leading-relaxed">
                          {selectedFile.content.split("\n").map((line, i) => (
                            <div key={i} className="flex">
                              <span className="text-gray-600 select-none w-12 text-right pr-4 flex-shrink-0">
                                {i + 1}
                              </span>
                              <code
                                className="flex-1"
                                dangerouslySetInnerHTML={{
                                  __html: highlightCode(line),
                                }}
                              />
                            </div>
                          ))}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileCode className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                          <p className="text-gray-500">Select a file to view its code</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Enhanced (same as create page) */}
          <div
            className={`border-l border-white/10 bg-[#111111] flex flex-col transition-all duration-300 ${
              isRightSidebarCollapsed ? "w-14" : "w-[420px]"
            }`}
          >
            {isRightSidebarCollapsed ? (
              <div className="p-3 flex flex-col items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRightSidebarCollapsed(false)}
                  className="w-full h-10 text-gray-400 hover:text-white hover:bg-white/5"
                >
                  <PanelRightOpen className="h-5 w-5" />
                </Button>
                <Separator className="bg-white/10" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-10 text-gray-400"
                  onClick={() => {
                    setIsRightSidebarCollapsed(false)
                    setRightSidebarTab("chat")
                  }}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-10 text-gray-400"
                  onClick={() => {
                    setIsRightSidebarCollapsed(false)
                    setRightSidebarTab("logs")
                  }}
                >
                  <Terminal className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="border-b border-white/10 bg-[#111111]/50 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Button
                        variant={rightSidebarTab === "chat" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setRightSidebarTab("chat")}
                        className="h-9 px-4 text-xs"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                      <Button
                        variant={rightSidebarTab === "logs" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setRightSidebarTab("logs")}
                        className="h-9 px-4 text-xs"
                      >
                        <Terminal className="h-4 w-4 mr-2" />
                        Logs
                      </Button>
                      <Button
                        variant={rightSidebarTab === "analytics" ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setRightSidebarTab("analytics")}
                        className="h-9 px-4 text-xs"
                      >
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Stats
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRightSidebarCollapsed(true)}
                      className="h-8 w-8 p-0 ml-2 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <PanelRightClose className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                  {rightSidebarTab === "chat" && (
                    <>
                      <div className="p-5 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
                            <p className="text-xs text-gray-500">Ready to enhance your tool</p>
                          </div>
                        </div>
                      </div>

                      <ScrollArea className="flex-1 min-h-0">
                        <div className="p-5 space-y-4">
                          {chatHistory.length === 0 ? (
                            <div className="text-center py-12">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="h-8 w-8 text-blue-500" />
                              </div>
                              <p className="text-sm text-white font-medium mb-1">Start a conversation</p>
                              <p className="text-xs text-gray-500">Ask AI to improve or modify your tool</p>
                            </div>
                          ) : (
                            chatHistory.map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                              >
                                {msg.role === "assistant" && (
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    <Sparkles className="h-4 w-4 text-white" />
                                  </div>
                                )}
                                <div
                                  className={`max-w-[75%] rounded-2xl p-4 ${
                                    msg.role === "user"
                                      ? "bg-blue-600 text-white"
                                      : "bg-white/5 text-gray-300 border border-white/10"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed">{msg.content}</p>
                                  <p className="text-xs opacity-60 mt-2">{msg.timestamp.toLocaleTimeString()}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>

                      <div className="p-5 border-t border-white/10 flex-shrink-0 bg-[#0f0f0f]">
                        <div className="space-y-3">
                          <Textarea
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                              }
                            }}
                            placeholder="Describe what you want to improve...&#10;&#10;Examples:&#10;• Add a dark mode toggle&#10;• Make the layout more responsive&#10;• Add animation to the buttons"
                            className="min-h-[120px] max-h-[200px] bg-white/5 border-white/10 text-white placeholder-gray-500 resize-none text-sm leading-relaxed"
                            disabled={isRegenerating}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!chatMessage.trim() || isRegenerating}
                            size="sm"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          >
                            {isRegenerating ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Enhancing Tool...
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4 mr-2" />
                                Enhance Tool
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {rightSidebarTab === "logs" && (
                    <>
                      <div className="p-5 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Terminal className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-semibold text-white">Generation Logs</span>
                          </div>
                          <Badge variant="secondary" className="text-xs bg-white/5 text-gray-400">
                            {logs.length} events
                          </Badge>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 min-h-0">
                        <div className="p-5 space-y-3">
                          {logs.length === 0 ? (
                            <div className="text-center py-12">
                              <Terminal className="h-12 w-12 text-gray-700 mx-auto mb-3" />
                              <p className="text-sm text-gray-500">No logs yet</p>
                            </div>
                          ) : (
                            logs.map((log) => (
                              <div
                                key={log.id}
                                className={`p-4 rounded-xl border ${
                                  log.level === "error"
                                    ? "bg-red-500/10 border-red-500/20"
                                    : log.level === "success"
                                      ? "bg-emerald-500/10 border-emerald-500/20"
                                      : log.level === "warning"
                                        ? "bg-yellow-500/10 border-yellow-500/20"
                                        : "bg-white/5 border-white/10"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`flex-shrink-0 mt-0.5 ${
                                      log.level === "error"
                                        ? "text-red-400"
                                        : log.level === "success"
                                          ? "text-emerald-400"
                                          : log.level === "warning"
                                            ? "text-yellow-400"
                                            : "text-gray-400"
                                    }`}
                                  >
                                    {getLogIcon(log.level)}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className={`text-sm font-medium ${
                                        log.level === "error"
                                          ? "text-red-400"
                                          : log.level === "success"
                                            ? "text-emerald-400"
                                            : log.level === "warning"
                                              ? "text-yellow-400"
                                              : "text-gray-300"
                                      }`}
                                    >
                                      {log.message}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1.5">{log.timestamp.toLocaleTimeString()}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </>
                  )}

                  {rightSidebarTab === "analytics" && (
                    <>
                      <div className="p-5 border-b border-white/10 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-semibold text-white">Generation Stats</span>
                        </div>
                      </div>
                      <ScrollArea className="flex-1 min-h-0">
                        <div className="p-5 space-y-4">
                          <Card className="bg-white/5 border-white/10 p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Total Files</p>
                                <p className="text-3xl font-bold text-white">{result.files?.length}</p>
                              </div>
                              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <FileCode className="h-6 w-6 text-blue-500" />
                              </div>
                            </div>
                          </Card>

                          <Card className="bg-white/5 border-white/10 p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Lines of Code</p>
                                <p className="text-3xl font-bold text-white">
                                  {result.files?.reduce((acc, f) => acc + f.content.split("\n").length, 0)}
                                </p>
                              </div>
                              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Code2 className="h-6 w-6 text-emerald-500" />
                              </div>
                            </div>
                          </Card>

                          <Card className="bg-white/5 border-white/10 p-5">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Created</p>
                                <p className="text-lg font-bold text-white">
                                  {tool?.createdAt ? new Date(tool.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-purple-500" />
                              </div>
                            </div>
                          </Card>

                          <Separator className="bg-white/10" />

                          <div>
                            <h4 className="text-sm font-semibold text-white mb-3">File Types</h4>
                            <div className="space-y-2">
                              {Object.entries(
                                (result.files ?? []).reduce(
                                  (acc, file) => {
                                    const ext = file.name.split(".").pop() || "other"
                                    acc[ext] = (acc[ext] || 0) + 1
                                    return acc
                                  },
                                  {} as Record<string, number>,
                                ),
                              ).map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-400 font-mono">.{type}</span>
                                  <Badge variant="secondary" className="bg-white/5 text-gray-400">
                                    {count}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
