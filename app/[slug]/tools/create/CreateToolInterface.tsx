// "use client"

// import type React from "react"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import {
//   Loader2,
//   Sparkles,
//   Target,
//   Zap,
//   Code2,
//   Eye,
//   FileText,
//   CheckCircle,
//   AlertCircle,
//   ExternalLink,
//   Copy,
//   Download,
//   Pause,
//   Brain,
//   Cpu,
//   Layers,
//   Rocket,
//   Monitor,
//   Globe,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"

// const TOOL_CATEGORIES = [
//   {
//     value: "dashboard",
//     label: "Analytics Dashboard",
//     description: "Data visualization and reporting tools",
//     icon: Monitor,
//     color: "from-blue-500 to-cyan-500",
//   },
//   {
//     value: "form",
//     label: "Form Builder",
//     description: "Data collection and form management",
//     icon: FileText,
//     color: "from-green-500 to-emerald-500",
//   },
//   {
//     value: "calculator",
//     label: "Calculator Tool",
//     description: "Computation and calculation engines",
//     icon: Cpu,
//     color: "from-purple-500 to-violet-500",
//   },
//   {
//     value: "tracker",
//     label: "Progress Tracker",
//     description: "Activity and progress monitoring",
//     icon: Target,
//     color: "from-orange-500 to-red-500",
//   },
//   {
//     value: "generator",
//     label: "Content Generator",
//     description: "Automated content and data generation",
//     icon: Sparkles,
//     color: "from-pink-500 to-rose-500",
//   },
//   {
//     value: "analyzer",
//     label: "Data Analyzer",
//     description: "Advanced data analysis and insights",
//     icon: Brain,
//     color: "from-indigo-500 to-blue-500",
//   },
//   {
//     value: "manager",
//     label: "Resource Manager",
//     description: "Task and resource management systems",
//     icon: Layers,
//     color: "from-teal-500 to-green-500",
//   },
//   {
//     value: "other",
//     label: "Custom Tool",
//     description: "Specialized business applications",
//     icon: Rocket,
//     color: "from-yellow-500 to-orange-500",
//   },
// ]

// const GENERATION_STEPS = [
//   { id: "analyzing", label: "Analyzing Requirements", icon: Brain },
//   { id: "designing", label: "Designing Architecture", icon: Layers },
//   { id: "generating", label: "Generating Code", icon: Code2 },
//   { id: "optimizing", label: "Optimizing Performance", icon: Zap },
//   { id: "finalizing", label: "Finalizing Application", icon: CheckCircle },
//   { id: "completed", label: "Ready to Deploy", icon: Rocket },
// ]

// interface ToolFile {
//   name: string
//   content: string
//   type?: string
//   size?: number
// }

// interface GenerationStatus {
//   status: "idle" | "generating" | "completed" | "error"
//   progress: number
//   step: string
//   message?: string
//   error?: string
//   files: ToolFile[]
//   demoUrl?: string
//   chatUrl?: string
//   chatId?: string
// }

// interface CreateToolInterfaceProps {
//   organizationSlug: string
// }

// export default function CreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     requirements: "",
//   })

//   const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
//     status: "idle",
//     progress: 0,
//     step: "idle",
//     files: [],
//   })

//   const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
//   const [isPolling, setIsPolling] = useState(false)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [toolId, setToolId] = useState<string | null>(null)

//   const router = useRouter()
//   const { toast } = useToast()
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
//   const logsEndRef = useRef<HTMLDivElement>(null)

//   const addLog = useCallback((message: string) => {
//     const timestamp = new Date().toLocaleTimeString()
//     setStreamingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
//   }, [])

//   const scrollToBottom = useCallback(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [])

//   useEffect(() => {
//     scrollToBottom()
//   }, [streamingLogs, scrollToBottom])

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const startPolling = useCallback(
//     (toolId: string) => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current)
//       }

//       setIsPolling(true)
//       addLog("🔄 Starting real-time status monitoring...")

//       pollingIntervalRef.current = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/organizations/${organizationSlug}/tools/${toolId}/status`)
//           if (!response.ok) {
//             throw new Error(`Status check failed: ${response.status}`)
//           }

//           const status = await response.json()
//           addLog(`📊 Status: ${status.status} - ${status.step} (${status.progress}%)`)

//           setGenerationStatus((prev) => ({
//             ...prev,
//             status: status.status,
//             progress: status.progress || 0,
//             step: status.step || "unknown",
//             message: status.message,
//             error: status.error,
//             files: status.files || [],
//             demoUrl: status.demoUrl,
//             chatUrl: status.chatUrl,
//             chatId: status.chatId,
//           }))

//           if (status.status === "completed" || status.status === "error") {
//             if (pollingIntervalRef.current) {
//               clearInterval(pollingIntervalRef.current)
//             }
//             setIsPolling(false)

//             if (status.status === "completed") {
//               addLog("🎉 Tool generation completed successfully!")
//               toast({
//                 title: "Tool Generated Successfully!",
//                 description: "Your business tool is ready to use.",
//               })
//             } else {
//               addLog(`❌ Generation failed: ${status.error}`)
//               toast({
//                 title: "Generation Failed",
//                 description: status.error || "An unknown error occurred.",
//                 variant: "destructive",
//               })
//             }
//           }
//         } catch (error) {
//           addLog(`💥 Polling error: ${error instanceof Error ? error.message : "Unknown error"}`)
//           console.error("Polling error:", error)
//         }
//       }, 2000) // Poll every 2 seconds
//     },
//     [organizationSlug, addLog, toast],
//   )

//   const stopPolling = useCallback(() => {
//     if (pollingIntervalRef.current) {
//       clearInterval(pollingIntervalRef.current)
//       pollingIntervalRef.current = null
//     }
//     setIsPolling(false)
//     addLog("⏸️ Status monitoring paused")
//   }, [addLog])

//   useEffect(() => {
//     return () => {
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current)
//       }
//     }
//   }, [])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.name || !formData.description || !formData.category || !formData.requirements) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setGenerationStatus({
//       status: "generating",
//       progress: 0,
//       step: "analyzing",
//       files: [],
//     })

//     setStreamingLogs([])
//     addLog("🚀 Initiating tool generation process...")
//     addLog(`📝 Tool: ${formData.name}`)
//     addLog(`🏷️ Category: ${formData.category}`)
//     addLog(`📊 Requirements length: ${formData.requirements.length} characters`)

//     try {
//       addLog("📤 Sending generation request to v0 API...")

//       const response = await fetch(`/api/organizations/${organizationSlug}/tools`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || `HTTP ${response.status}`)
//       }

//       const result = await response.json()
//       addLog(`✅ Generation request accepted - Tool ID: ${result.toolId}`)

//       setToolId(result.toolId)
//       startPolling(result.toolId)
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
//       addLog(`💥 Generation failed: ${errorMessage}`)

//       setGenerationStatus({
//         status: "error",
//         progress: 0,
//         step: "error",
//         error: errorMessage,
//         files: [],
//       })

//       toast({
//         title: "Generation Failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     }
//   }

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast({
//         title: "Copied to Clipboard",
//         description: "Content has been copied to your clipboard.",
//       })
//     } catch (error) {
//       toast({
//         title: "Copy Failed",
//         description: "Failed to copy to clipboard.",
//         variant: "destructive",
//       })
//     }
//   }

//   const downloadFile = (file: ToolFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)

//     toast({
//       title: "File Downloaded",
//       description: `${file.name} has been downloaded.`,
//     })
//   }

//   const getCurrentStep = () => {
//     return GENERATION_STEPS.find((step) => step.id === generationStatus.step) || GENERATION_STEPS[0]
//   }

//   const getStepIndex = () => {
//     return GENERATION_STEPS.findIndex((step) => step.id === generationStatus.step)
//   }

//   const isFormValid = formData.name && formData.description && formData.category && formData.requirements

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Header */}
//       <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <Sparkles className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold">AI Tool Generator</h1>
//                 <p className="text-sm text-gray-400">Create professional business tools with AI</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {isPolling && (
//                 <Button variant="outline" size="sm" onClick={stopPolling} className="border-gray-700 bg-transparent">
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Monitoring
//                 </Button>
//               )}
//               {generationStatus.status === "completed" && generationStatus.demoUrl && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => window.open(generationStatus.demoUrl, "_blank")}
//                   className="border-gray-700"
//                 >
//                   <ExternalLink className="h-4 w-4 mr-2" />
//                   View Demo
//                 </Button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column - Configuration */}
//           <div className="space-y-6">
//             {/* Tool Configuration */}
//             <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Target className="h-5 w-5 text-blue-400" />
//                   Tool Configuration
//                 </CardTitle>
//                 <CardDescription className="text-gray-400">
//                   Define your business tool requirements and specifications
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name" className="text-gray-200">
//                         Tool Name *
//                       </Label>
//                       <Input
//                         id="name"
//                         value={formData.name}
//                         onChange={(e) => handleInputChange("name", e.target.value)}
//                         placeholder="e.g., Customer Analytics Dashboard"
//                         className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
//                         required
//                         disabled={generationStatus.status === "generating"}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="category" className="text-gray-200">
//                         Category *
//                       </Label>
//                       <Select
//                         value={formData.category}
//                         onValueChange={(value) => handleInputChange("category", value)}
//                         disabled={generationStatus.status === "generating"}
//                       >
//                         <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-gray-800 border-gray-700">
//                           {TOOL_CATEGORIES.map((category) => {
//                             const IconComponent = category.icon
//                             return (
//                               <SelectItem
//                                 key={category.value}
//                                 value={category.value}
//                                 className="text-white hover:bg-gray-700 focus:bg-gray-700"
//                               >
//                                 <div className="flex items-center gap-3">
//                                   <div
//                                     className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
//                                   >
//                                     <IconComponent className="h-4 w-4 text-white" />
//                                   </div>
//                                   <div>
//                                     <div className="font-medium">{category.label}</div>
//                                     <div className="text-xs text-gray-400">{category.description}</div>
//                                   </div>
//                                 </div>
//                               </SelectItem>
//                             )
//                           })}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="description" className="text-gray-200">
//                       Description *
//                     </Label>
//                     <Input
//                       id="description"
//                       value={formData.description}
//                       onChange={(e) => handleInputChange("description", e.target.value)}
//                       placeholder="Brief description of what this tool does"
//                       className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
//                       required
//                       disabled={generationStatus.status === "generating"}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="requirements" className="text-gray-200">
//                       Detailed Requirements *
//                     </Label>
//                     <Textarea
//                       id="requirements"
//                       value={formData.requirements}
//                       onChange={(e) => handleInputChange("requirements", e.target.value)}
//                       placeholder="Describe in detail what features and functionality you need. Include specific business logic, data inputs/outputs, user interactions, and any special requirements."
//                       className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
//                       required
//                       disabled={generationStatus.status === "generating"}
//                     />
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-gray-500">{formData.requirements.length} characters</span>
//                       <span className="text-gray-500">💡 More detail = better results</span>
//                     </div>
//                   </div>

//                   <Button
//                     type="submit"
//                     disabled={!isFormValid || generationStatus.status === "generating"}
//                     className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
//                   >
//                     {generationStatus.status === "generating" ? (
//                       <>
//                         <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         Generating Tool...
//                       </>
//                     ) : (
//                       <>
//                         <Rocket className="h-4 w-4 mr-2" />
//                         Generate Business Tool
//                       </>
//                     )}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>

//             {/* Generation Progress */}
//             {generationStatus.status !== "idle" && (
//               <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
//                 <CardHeader>
//                   <CardTitle className="text-white flex items-center gap-2">
//                     <Zap className="h-5 w-5 text-yellow-400" />
//                     Generation Progress
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-gray-300">{getCurrentStep().label}</span>
//                       <span className="text-sm text-gray-400">{generationStatus.progress}%</span>
//                     </div>
//                     <Progress value={generationStatus.progress} className="h-2 bg-gray-800" />
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {GENERATION_STEPS.map((step, index) => {
//                       const IconComponent = step.icon
//                       const isActive = step.id === generationStatus.step
//                       const isCompleted = index < getStepIndex()
//                       const isCurrent = index === getStepIndex()

//                       return (
//                         <div
//                           key={step.id}
//                           className={cn(
//                             "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
//                             isActive && "bg-blue-500/20 border border-blue-500/30",
//                             isCompleted && "bg-green-500/20 border border-green-500/30",
//                             !isActive && !isCompleted && "bg-gray-800/50 border border-gray-700",
//                           )}
//                         >
//                           <IconComponent
//                             className={cn(
//                               "h-3 w-3",
//                               isActive && "text-blue-400 animate-pulse",
//                               isCompleted && "text-green-400",
//                               !isActive && !isCompleted && "text-gray-500",
//                             )}
//                           />
//                           <span
//                             className={cn(
//                               isActive && "text-blue-300",
//                               isCompleted && "text-green-300",
//                               !isActive && !isCompleted && "text-gray-400",
//                             )}
//                           >
//                             {step.label}
//                           </span>
//                         </div>
//                       )
//                     })}
//                   </div>

//                   {generationStatus.error && (
//                     <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
//                       <AlertCircle className="h-4 w-4 text-red-400" />
//                       <span className="text-sm text-red-300">{generationStatus.error}</span>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Column - Results & Logs */}
//           <div className="space-y-6">
//             {/* Real-time Logs */}
//             <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-white flex items-center gap-2">
//                   <Monitor className="h-5 w-5 text-green-400" />
//                   Real-time Generation Logs
//                   {isPolling && (
//                     <div className="flex items-center gap-1 ml-auto">
//                       <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                       <span className="text-xs text-green-400">Live</span>
//                     </div>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ScrollArea className="h-64 w-full">
//                   <div className="space-y-1 font-mono text-xs">
//                     {streamingLogs.length === 0 ? (
//                       <div className="text-gray-500 italic">Logs will appear here during generation...</div>
//                     ) : (
//                       streamingLogs.map((log, index) => (
//                         <div
//                           key={index}
//                           className={cn(
//                             "p-2 rounded border-l-2",
//                             log.includes("✅") && "border-green-500 bg-green-500/10 text-green-300",
//                             log.includes("❌") && "border-red-500 bg-red-500/10 text-red-300",
//                             log.includes("⚠️") && "border-yellow-500 bg-yellow-500/10 text-yellow-300",
//                             log.includes("🔄") && "border-blue-500 bg-blue-500/10 text-blue-300",
//                             !log.includes("✅") &&
//                               !log.includes("❌") &&
//                               !log.includes("⚠️") &&
//                               !log.includes("🔄") &&
//                               "border-gray-600 bg-gray-800/30 text-gray-300",
//                           )}
//                         >
//                           {log}
//                         </div>
//                       ))
//                     )}
//                     <div ref={logsEndRef} />
//                   </div>
//                 </ScrollArea>
//               </CardContent>
//             </Card>

//             {/* Generated Files & Preview */}
//             {(generationStatus.files.length > 0 || generationStatus.demoUrl) && (
//               <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
//                 <CardHeader>
//                   <CardTitle className="text-white flex items-center gap-2">
//                     <Code2 className="h-5 w-5 text-purple-400" />
//                     Generated Application
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs defaultValue="preview" className="w-full">
//                     <TabsList className="grid w-full grid-cols-2 bg-gray-800">
//                       <TabsTrigger value="preview" className="data-[state=active]:bg-gray-700">
//                         <Eye className="h-4 w-4 mr-2" />
//                         Preview
//                       </TabsTrigger>
//                       <TabsTrigger value="files" className="data-[state=active]:bg-gray-700">
//                         <FileText className="h-4 w-4 mr-2" />
//                         Files ({generationStatus.files.length})
//                       </TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="preview" className="space-y-4">
//                       {generationStatus.demoUrl ? (
//                         <div className="space-y-4">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-gray-300">Live Preview</span>
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => window.open(generationStatus.demoUrl, "_blank")}
//                                 className="border-gray-700"
//                               >
//                                 <ExternalLink className="h-4 w-4 mr-2" />
//                                 Open in New Tab
//                               </Button>
//                               {generationStatus.chatUrl && (
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => window.open(generationStatus.chatUrl, "_blank")}
//                                   className="border-gray-700"
//                                 >
//                                   <Globe className="h-4 w-4 mr-2" />
//                                   View Chat
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                           <div className="border border-gray-700 rounded-lg overflow-hidden">
//                             <iframe
//                               src={generationStatus.demoUrl}
//                               className="w-full h-96 bg-white"
//                               title="Generated Tool Preview"
//                             />
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-8 text-gray-500">
//                           <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                           <p>Preview will appear once generation is complete</p>
//                         </div>
//                       )}
//                     </TabsContent>

//                     <TabsContent value="files" className="space-y-4">
//                       {generationStatus.files.length > 0 ? (
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 gap-2">
//                             {generationStatus.files.map((file, index) => (
//                               <div
//                                 key={index}
//                                 className={cn(
//                                   "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
//                                   selectedFile === file
//                                     ? "border-purple-500 bg-purple-500/10"
//                                     : "border-gray-700 bg-gray-800/30 hover:bg-gray-800/50",
//                                 )}
//                                 onClick={() => setSelectedFile(file)}
//                               >
//                                 <div className="flex items-center gap-3">
//                                   <FileText className="h-4 w-4 text-gray-400" />
//                                   <div>
//                                     <div className="text-sm font-medium text-white">{file.name}</div>
//                                     <div className="text-xs text-gray-400">
//                                       {file.type} • {(file.content.length / 1024).toFixed(1)}KB
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="flex gap-1">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       copyToClipboard(file.content)
//                                     }}
//                                     className="h-8 w-8 p-0"
//                                   >
//                                     <Copy className="h-3 w-3" />
//                                   </Button>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       downloadFile(file)
//                                     }}
//                                     className="h-8 w-8 p-0"
//                                   >
//                                     <Download className="h-3 w-3" />
//                                   </Button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>

//                           {selectedFile && (
//                             <div className="space-y-2">
//                               <div className="flex items-center justify-between">
//                                 <span className="text-sm font-medium text-white">{selectedFile.name}</span>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => copyToClipboard(selectedFile.content)}
//                                   className="border-gray-700"
//                                 >
//                                   <Copy className="h-4 w-4 mr-2" />
//                                   Copy Code
//                                 </Button>
//                               </div>
//                               <ScrollArea className="h-64 w-full">
//                                 <pre className="text-xs bg-gray-900 p-4 rounded-lg border border-gray-700 overflow-x-auto">
//                                   <code className="text-gray-300">{selectedFile.content}</code>
//                                 </pre>
//                               </ScrollArea>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="text-center py-8 text-gray-500">
//                           <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                           <p>Generated files will appear here</p>
//                         </div>
//                       )}
//                     </TabsContent>
//                   </Tabs>
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

// import type React from "react"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   Loader2,
//   Sparkles,
//   Target,
//   Code2,
//   Eye,
//   FileText,
//   CheckCircle,
//   ExternalLink,
//   Copy,
//   Download,
//   Brain,
//   Rocket,
//   Monitor,
//   Globe,
//   Lightbulb,
//   Wand2,
//   Database,
//   Settings,
//   MessageSquare,
//   Send,
//   Pause,
//   Zap,
//   Activity,
//   BarChart3,
//   Users,
//   Calendar,
//   ShoppingCart,
//   CreditCard,
//   AlertCircle,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"

// const TOOL_CATEGORIES = [
//   {
//     value: "dashboard",
//     label: "Analytics Dashboard",
//     description: "Data visualization and reporting tools",
//     icon: BarChart3,
//     color: "from-blue-500 to-cyan-500",
//     examples: ["Sales Dashboard", "KPI Tracker", "Performance Analytics"],
//   },
//   {
//     value: "crm",
//     label: "Customer Management",
//     description: "Customer relationship and contact management",
//     icon: Users,
//     color: "from-green-500 to-emerald-500",
//     examples: ["CRM System", "Contact Manager", "Lead Tracker"],
//   },
//   {
//     value: "ecommerce",
//     label: "E-commerce Tools",
//     description: "Online store and inventory management",
//     icon: ShoppingCart,
//     color: "from-purple-500 to-violet-500",
//     examples: ["Product Catalog", "Order Management", "Inventory Tracker"],
//   },
//   {
//     value: "finance",
//     label: "Financial Tools",
//     description: "Accounting and financial management",
//     icon: CreditCard,
//     color: "from-orange-500 to-red-500",
//     examples: ["Invoice Generator", "Expense Tracker", "Budget Planner"],
//   },
//   {
//     value: "project",
//     label: "Project Management",
//     description: "Task and project tracking systems",
//     icon: Calendar,
//     color: "from-pink-500 to-rose-500",
//     examples: ["Task Manager", "Project Tracker", "Team Planner"],
//   },
//   {
//     value: "automation",
//     label: "Workflow Automation",
//     description: "Process automation and workflow tools",
//     icon: Zap,
//     color: "from-indigo-500 to-blue-500",
//     examples: ["Email Automation", "Data Sync", "Report Generator"],
//   },
// ]

// const AVAILABLE_INTEGRATIONS = [
//   {
//     id: "supabase",
//     name: "Supabase",
//     description: "PostgreSQL database with real-time subscriptions",
//     icon: "🗄️",
//     type: "database",
//     popular: true,
//     dataTypes: ["Users", "Tables", "Real-time", "Auth"],
//     setupTime: "2 min",
//   },
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Payment processing and subscription management",
//     icon: "💳",
//     type: "payment",
//     popular: true,
//     dataTypes: ["Payments", "Customers", "Subscriptions", "Invoices"],
//     setupTime: "3 min",
//   },
//   {
//     id: "resend",
//     name: "Resend",
//     description: "Email delivery and transactional emails",
//     icon: "📧",
//     type: "communication",
//     popular: true,
//     dataTypes: ["Emails", "Templates", "Analytics", "Webhooks"],
//     setupTime: "1 min",
//   },
//   {
//     id: "openai",
//     name: "OpenAI",
//     description: "AI-powered text generation and analysis",
//     icon: "🤖",
//     type: "ai",
//     popular: true,
//     dataTypes: ["Text Generation", "Analysis", "Embeddings", "Chat"],
//     setupTime: "2 min",
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets",
//     description: "Spreadsheet data integration and automation",
//     icon: "📊",
//     type: "data",
//     dataTypes: ["Spreadsheets", "Charts", "Formulas", "Collaboration"],
//     setupTime: "4 min",
//   },
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Team communication and notifications",
//     icon: "💬",
//     type: "communication",
//     dataTypes: ["Messages", "Channels", "Users", "Files"],
//     setupTime: "3 min",
//   },
// ]

// const GENERATION_PHASES = [
//   { id: "analyzing", label: "Analyzing Requirements", icon: Brain, color: "text-blue-400" },
//   { id: "designing", label: "Designing UI Components", icon: Wand2, color: "text-purple-400" },
//   { id: "integrating", label: "Setting up Integrations", icon: Database, color: "text-green-400" },
//   { id: "generating", label: "Generating Code", icon: Code2, color: "text-orange-400" },
//   { id: "testing", label: "Testing & Optimization", icon: Activity, color: "text-cyan-400" },
//   { id: "deploying", label: "Preparing Deployment", icon: Rocket, color: "text-pink-400" },
// ]

// interface ToolFile {
//   name: string
//   content: string
//   type?: string
//   size?: number
// }

// interface GenerationStatus {
//   status: "idle" | "analyzing" | "generating" | "integrating" | "completed" | "error"
//   progress: number
//   step: string
//   message?: string
//   error?: string
//   files: ToolFile[]
//   demoUrl?: string
//   chatUrl?: string
//   chatId?: string
//   currentPhase: "setup" | "ui" | "integration" | "deploy"
//   deploymentUrl?: string
//   metrics?: {
//     linesOfCode: number
//     components: number
//     apiEndpoints: number
//     estimatedValue: string
//   }
// }

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant" | "system"
//   content: string
//   timestamp: Date
//   type?: "message" | "code" | "preview"
// }

// interface CreateToolInterfaceProps {
//   organizationSlug: string
// }

// export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
//   // Core state
//   const [activeTab, setActiveTab] = useState("configure")
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     requirements: "",
//   })

//   // Generation state
//   const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
//     status: "idle",
//     progress: 0,
//     step: "ready",
//     files: [],
//     currentPhase: "setup",
//   })

//   // Chat state
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
//   const [chatInput, setChatInput] = useState("")
//   const [isChatLoading, setIsChatLoading] = useState(false)

//   // UI state
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [isPolling, setIsPolling] = useState(false)
//   const [showMetrics, setShowMetrics] = useState(false)

//   const { toast } = useToast()
//   const router = useRouter()
//   const logsEndRef = useRef<HTMLDivElement>(null)
//   const chatEndRef = useRef<HTMLDivElement>(null)
//   const pollingRef = useRef<NodeJS.Timeout>()

//   const addLog = useCallback((message: string, type: "info" | "success" | "error" | "warning" = "info") => {
//     const timestamp = new Date().toLocaleTimeString()
//     const icons = {
//       info: "ℹ️",
//       success: "✅",
//       error: "❌",
//       warning: "⚠️",
//     }
//     const formattedMessage = `[${timestamp}] ${icons[type]} ${message}`

//     setStreamingLogs((prev) => [...prev.slice(-49), formattedMessage]) // Keep last 50 logs

//     setTimeout(() => {
//       logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, 100)
//   }, [])

//   const startPolling = useCallback(
//     (toolId: string) => {
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current)
//       }

//       setIsPolling(true)
//       addLog("🔄 Starting real-time monitoring...", "info")

//       pollingRef.current = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/organizations/${organizationSlug}/tools/${toolId}/status`)
//           if (!response.ok) throw new Error(`Status check failed: ${response.status}`)

//           const status = await response.json()

//           setGenerationStatus((prev) => ({
//             ...prev,
//             status: status.status,
//             progress: status.progress || 0,
//             step: status.step || "unknown",
//             message: status.message,
//             error: status.error,
//             files: status.files || [],
//             demoUrl: status.demoUrl,
//             chatUrl: status.chatUrl,
//             chatId: status.chatId,
//             metrics: status.metrics,
//           }))

//           if (status.status === "completed") {
//             addLog("🎉 Tool generation completed successfully!", "success")
//             setIsPolling(false)
//             setShowMetrics(true)
//             setActiveTab("preview")
//             if (pollingRef.current) clearInterval(pollingRef.current)
//           } else if (status.status === "error") {
//             addLog(`❌ Generation failed: ${status.error}`, "error")
//             setIsPolling(false)
//             if (pollingRef.current) clearInterval(pollingRef.current)
//           } else {
//             addLog(`📊 ${status.step} - ${status.progress}%`, "info")
//           }
//         } catch (error) {
//           addLog(`💥 Monitoring error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
//         }
//       }, 2000)
//     },
//     [organizationSlug, addLog],
//   )

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!formData.name || !formData.description || !formData.category || !formData.requirements) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields.",
//         variant: "destructive",
//       })
//       return
//     }

//     setGenerationStatus({
//       status: "analyzing",
//       progress: 0,
//       step: "analyzing",
//       files: [],
//       currentPhase: "setup",
//     })

//     setStreamingLogs([])
//     setActiveTab("generate")
//     addLog("🚀 Initiating tool generation process...", "info")
//     addLog(`📝 Tool: ${formData.name}`, "info")
//     addLog(`🏷️ Category: ${formData.category}`, "info")
//     addLog(`🔗 Integrations: ${selectedIntegrations.length}`, "info")

//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/tools`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           integrations: selectedIntegrations,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || `HTTP ${response.status}`)
//       }

//       const result = await response.json()
//       addLog(`✅ Generation request accepted - Tool ID: ${result.toolId}`, "success")

//       startPolling(result.toolId)
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
//       addLog(`💥 Generation failed: ${errorMessage}`, "error")

//       setGenerationStatus({
//         status: "error",
//         progress: 0,
//         step: "error",
//         error: errorMessage,
//         files: [],
//         currentPhase: "setup",
//       })

//       toast({
//         title: "Generation Failed",
//         description: errorMessage,
//         variant: "destructive",
//       })
//     }
//   }

//   const sendChatMessage = async () => {
//     if (!chatInput.trim() || !generationStatus.chatId) return

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: chatInput,
//       timestamp: new Date(),
//     }

//     setChatMessages((prev) => [...prev, userMessage])
//     setChatInput("")
//     setIsChatLoading(true)

//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/tools/${generationStatus.chatId}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: chatInput }),
//       })

//       if (!response.ok) throw new Error("Failed to send message")

//       const result = await response.json()

//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: result.message || "I've updated your tool based on your feedback.",
//         timestamp: new Date(),
//       }

//       setChatMessages((prev) => [...prev, assistantMessage])

//       // Update generation status if new files are available
//       if (result.files) {
//         setGenerationStatus((prev) => ({
//           ...prev,
//           files: result.files,
//           demoUrl: result.demoUrl || prev.demoUrl,
//         }))
//       }

//       addLog("💬 Chat message processed successfully", "success")
//     } catch (error) {
//       addLog(`💥 Chat error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
//       toast({
//         title: "Chat Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsChatLoading(false)
//     }
//   }

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast({ title: "Copied!", description: "Content copied to clipboard." })
//     } catch (error) {
//       toast({ title: "Copy Failed", description: "Failed to copy content.", variant: "destructive" })
//     }
//   }

//   const downloadFile = (file: ToolFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//     toast({ title: "Downloaded!", description: `${file.name} has been downloaded.` })
//   }

//   const getCurrentPhase = () => {
//     return GENERATION_PHASES.find((phase) => phase.id === generationStatus.step) || GENERATION_PHASES[0]
//   }

//   const isFormValid = formData.name && formData.description && formData.category && formData.requirements

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [chatMessages])

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
//                 <Sparkles className="h-5 w-5 text-primary-foreground" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-foreground">AI Business Tool Generator</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Create production-ready applications with real integrations
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {isPolling && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setIsPolling(false)}
//                   className="border-border bg-card hover:bg-accent"
//                 >
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Monitoring
//                 </Button>
//               )}
//               {showMetrics && generationStatus.metrics && (
//                 <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
//                   <Activity className="h-3 w-3 mr-1" />
//                   {generationStatus.metrics.estimatedValue} value
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4 bg-muted/30 border border-border">
//             <TabsTrigger value="configure" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
//               <Settings className="h-4 w-4 mr-2" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="generate" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
//               <Wand2 className="h-4 w-4 mr-2" />
//               Generate
//             </TabsTrigger>
//             <TabsTrigger
//               value="chat"
//               className="data-[state=active]:bg-card data-[state=active]:text-foreground"
//               disabled={!generationStatus.chatId}
//             >
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Chat & Refine
//             </TabsTrigger>
//             <TabsTrigger
//               value="preview"
//               className="data-[state=active]:bg-card data-[state=active]:text-foreground"
//               disabled={generationStatus.files.length === 0}
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Preview & Deploy
//             </TabsTrigger>
//           </TabsList>

//           {/* Configure Tab */}
//           <TabsContent value="configure" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2">
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Target className="h-5 w-5 text-primary" />
//                       Tool Configuration
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground">
//                       Define your business tool requirements and select integrations
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="name" className="text-foreground">
//                             Tool Name *
//                           </Label>
//                           <Input
//                             id="name"
//                             value={formData.name}
//                             onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                             placeholder="e.g., Customer Analytics Dashboard"
//                             className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                             required
//                             disabled={generationStatus.status === "generating"}
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="category" className="text-foreground">
//                             Category *
//                           </Label>
//                           <Select
//                             value={formData.category}
//                             onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
//                             disabled={generationStatus.status === "generating"}
//                           >
//                             <SelectTrigger className="bg-input border-border text-foreground">
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                               {TOOL_CATEGORIES.map((category) => {
//                                 const IconComponent = category.icon
//                                 return (
//                                   <SelectItem
//                                     key={category.value}
//                                     value={category.value}
//                                     className="text-foreground hover:bg-accent focus:bg-accent"
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <div
//                                         className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
//                                       >
//                                         <IconComponent className="h-4 w-4 text-white" />
//                                       </div>
//                                       <div>
//                                         <div className="font-medium">{category.label}</div>
//                                         <div className="text-xs text-muted-foreground">{category.description}</div>
//                                       </div>
//                                     </div>
//                                   </SelectItem>
//                                 )
//                               })}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="description" className="text-foreground">
//                           Description *
//                         </Label>
//                         <Input
//                           id="description"
//                           value={formData.description}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                           placeholder="Brief description of what this tool does"
//                           className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                           required
//                           disabled={generationStatus.status === "generating"}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="requirements" className="text-foreground">
//                           Detailed Requirements *
//                         </Label>
//                         <Textarea
//                           id="requirements"
//                           value={formData.requirements}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
//                           placeholder="Describe in detail what features and functionality you need. Include specific business logic, data inputs/outputs, user interactions, and any special requirements."
//                           className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
//                           required
//                           disabled={generationStatus.status === "generating"}
//                         />
//                         <div className="flex items-center justify-between text-xs">
//                           <span className="text-muted-foreground">{formData.requirements.length} characters</span>
//                           <span className="text-muted-foreground">💡 More detail = better results</span>
//                         </div>
//                       </div>

//                       <Button
//                         type="submit"
//                         disabled={!isFormValid || generationStatus.status === "generating"}
//                         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
//                       >
//                         {generationStatus.status === "generating" ? (
//                           <>
//                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                             Generating Tool...
//                           </>
//                         ) : (
//                           <>
//                             <Rocket className="h-4 w-4 mr-2" />
//                             Generate Business Tool
//                           </>
//                         )}
//                       </Button>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Integration Selection */}
//               <div>
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Database className="h-5 w-5 text-accent" />
//                       Integrations
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground">
//                       Select data sources and services
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {AVAILABLE_INTEGRATIONS.map((integration) => {
//                       const isSelected = selectedIntegrations.includes(integration.id)
//                       return (
//                         <div
//                           key={integration.id}
//                           className={cn(
//                             "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
//                             isSelected ? "border-primary bg-primary/10" : "border-border bg-muted/30",
//                             integration.popular && "ring-1 ring-primary/20",
//                           )}
//                           onClick={() => {
//                             setSelectedIntegrations((prev) =>
//                               isSelected ? prev.filter((id) => id !== integration.id) : [...prev, integration.id],
//                             )
//                           }}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="text-2xl">{integration.icon}</div>
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-medium text-foreground">{integration.name}</span>
//                                 {integration.popular && (
//                                   <Badge variant="outline" className="text-xs text-primary border-primary/20">
//                                     Popular
//                                   </Badge>
//                                 )}
//                                 {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
//                               </div>
//                               <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
//                               <div className="flex flex-wrap gap-1">
//                                 {integration.dataTypes.slice(0, 2).map((type) => (
//                                   <Badge key={type} variant="secondary" className="text-xs bg-secondary/50">
//                                     {type}
//                                   </Badge>
//                                 ))}
//                                 {integration.dataTypes.length > 2 && (
//                                   <Badge variant="secondary" className="text-xs bg-secondary/50">
//                                     +{integration.dataTypes.length - 2}
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Generate Tab */}
//           <TabsContent value="generate" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Generation Progress */}
//               <div className="space-y-6">
//                 {generationStatus.status !== "idle" && (
//                   <Card className="bg-card border-border">
//                     <CardHeader>
//                       <CardTitle className="text-foreground flex items-center gap-2">
//                         <Activity className="h-5 w-5 text-primary" />
//                         Generation Progress
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-foreground">{getCurrentPhase().label}</span>
//                           <span className="text-sm text-muted-foreground">{generationStatus.progress}%</span>
//                         </div>
//                         <Progress value={generationStatus.progress} className="h-2 bg-muted" />
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         {GENERATION_PHASES.map((phase, index) => {
//                           const IconComponent = phase.icon
//                           const isActive = phase.id === generationStatus.step
//                           const isCompleted = generationStatus.progress > index * 16.67

//                           return (
//                             <div
//                               key={phase.id}
//                               className={cn(
//                                 "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
//                                 isActive && "bg-primary/20 border border-primary/30",
//                                 isCompleted && !isActive && "bg-green-500/20 border border-green-500/30",
//                                 !isActive && !isCompleted && "bg-muted/50 border border-border",
//                               )}
//                             >
//                               <IconComponent
//                                 className={cn(
//                                   "h-3 w-3",
//                                   isActive && phase.color + " animate-pulse",
//                                   isCompleted && !isActive && "text-green-400",
//                                   !isActive && !isCompleted && "text-muted-foreground",
//                                 )}
//                               />
//                               <span
//                                 className={cn(
//                                   isActive && phase.color,
//                                   isCompleted && !isActive && "text-green-400",
//                                   !isActive && !isCompleted && "text-muted-foreground",
//                                 )}
//                               >
//                                 {phase.label}
//                               </span>
//                             </div>
//                           )
//                         })}
//                       </div>

//                       {generationStatus.error && (
//                         <div className="flex items-center gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
//                           <AlertCircle className="h-4 w-4 text-destructive" />
//                           <span className="text-sm text-destructive">{generationStatus.error}</span>
//                         </div>
//                       )}

//                       {showMetrics && generationStatus.metrics && (
//                         <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-green-400">
//                               {generationStatus.metrics.components}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Components</div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-green-400">
//                               {generationStatus.metrics.linesOfCode}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Lines of Code</div>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>

//               {/* Real-time Logs */}
//               <div>
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Monitor className="h-5 w-5 text-green-400" />
//                       Real-time Generation Logs
//                       {isPolling && (
//                         <div className="flex items-center gap-1 ml-auto">
//                           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                           <span className="text-xs text-green-400">Live</span>
//                         </div>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ScrollArea className="h-96 w-full">
//                       <div className="space-y-1 font-mono text-xs">
//                         {streamingLogs.length === 0 ? (
//                           <div className="text-muted-foreground italic">Logs will appear here during generation...</div>
//                         ) : (
//                           streamingLogs.map((log, index) => (
//                             <div
//                               key={index}
//                               className={cn(
//                                 "p-2 rounded border-l-2",
//                                 log.includes("✅") && "border-green-500 bg-green-500/10 text-green-300",
//                                 log.includes("❌") && "border-red-500 bg-red-500/10 text-red-300",
//                                 log.includes("⚠️") && "border-yellow-500 bg-yellow-500/10 text-yellow-300",
//                                 log.includes("ℹ️") && "border-blue-500 bg-blue-500/10 text-blue-300",
//                                 !log.includes("✅") &&
//                                   !log.includes("❌") &&
//                                   !log.includes("⚠️") &&
//                                   !log.includes("ℹ️") &&
//                                   "border-border bg-muted/30 text-foreground",
//                               )}
//                             >
//                               {log}
//                             </div>
//                           ))
//                         )}
//                         <div ref={logsEndRef} />
//                       </div>
//                     </ScrollArea>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Chat Tab */}
//           <TabsContent value="chat" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <MessageSquare className="h-5 w-5 text-primary" />
//                     Chat with AI Assistant
//                   </CardTitle>
//                   <CardDescription className="text-muted-foreground">
//                     Refine and improve your generated tool
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <ScrollArea className="h-96 w-full">
//                     <div className="space-y-4">
//                       {chatMessages.length === 0 ? (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                           <p>Start a conversation to refine your tool</p>
//                         </div>
//                       ) : (
//                         chatMessages.map((message) => (
//                           <div
//                             key={message.id}
//                             className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
//                           >
//                             <div
//                               className={cn(
//                                 "max-w-[80%] p-3 rounded-lg",
//                                 message.role === "user"
//                                   ? "bg-primary text-primary-foreground"
//                                   : "bg-muted text-foreground",
//                               )}
//                             >
//                               <p className="text-sm">{message.content}</p>
//                               <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                       <div ref={chatEndRef} />
//                     </div>
//                   </ScrollArea>

//                   <div className="flex gap-2">
//                     <Input
//                       value={chatInput}
//                       onChange={(e) => setChatInput(e.target.value)}
//                       placeholder="Ask for changes or improvements..."
//                       className="bg-input border-border text-foreground"
//                       onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
//                       disabled={isChatLoading}
//                     />
//                     <Button
//                       onClick={sendChatMessage}
//                       disabled={!chatInput.trim() || isChatLoading}
//                       className="bg-primary hover:bg-primary/90"
//                     >
//                       {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Chat History & Context */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Brain className="h-5 w-5 text-accent" />
//                     Context & Suggestions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
//                     <div className="grid grid-cols-1 gap-2">
//                       {[
//                         "Add a dark mode toggle",
//                         "Improve the mobile layout",
//                         "Add data export functionality",
//                         "Enhance the color scheme",
//                         "Add loading states",
//                         "Improve accessibility",
//                       ].map((suggestion) => (
//                         <Button
//                           key={suggestion}
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setChatInput(suggestion)}
//                           className="justify-start text-left h-auto p-2 border-border hover:bg-accent"
//                         >
//                           <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
//                           <span className="text-xs">{suggestion}</span>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Preview Tab */}
//           <TabsContent value="preview" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Preview */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Eye className="h-5 w-5 text-primary" />
//                     Live Preview
//                   </CardTitle>
//                   <CardDescription className="text-muted-foreground">
//                     Interactive preview of your generated tool
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {generationStatus.demoUrl ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-foreground">Live Application</span>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => window.open(generationStatus.demoUrl, "_blank")}
//                             className="border-border hover:bg-accent"
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             Open in New Tab
//                           </Button>
//                           {generationStatus.chatUrl && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => window.open(generationStatus.chatUrl, "_blank")}
//                               className="border-border hover:bg-accent"
//                             >
//                               <Globe className="h-4 w-4 mr-2" />
//                               View Chat
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                       <div className="border border-border rounded-lg overflow-hidden">
//                         <iframe
//                           src={generationStatus.demoUrl}
//                           className="w-full h-96 bg-background"
//                           title="Generated Tool Preview"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Preview will appear once generation is complete</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Files */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-accent" />
//                     Generated Files ({generationStatus.files.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {generationStatus.files.length > 0 ? (
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 gap-2">
//                         {generationStatus.files.map((file, index) => (
//                           <div
//                             key={index}
//                             className={cn(
//                               "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
//                               selectedFile === file
//                                 ? "border-primary bg-primary/10"
//                                 : "border-border bg-muted/30 hover:bg-muted/50",
//                             )}
//                             onClick={() => setSelectedFile(file)}
//                           >
//                             <div className="flex items-center gap-3">
//                               <FileText className="h-4 w-4 text-muted-foreground" />
//                               <div>
//                                 <div className="text-sm font-medium text-foreground">{file.name}</div>
//                                 <div className="text-xs text-muted-foreground">
//                                   {file.type} • {(file.content.length / 1024).toFixed(1)}KB
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   copyToClipboard(file.content)
//                                 }}
//                                 className="h-8 w-8 p-0 hover:bg-accent"
//                               >
//                                 <Copy className="h-3 w-3" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   downloadFile(file)
//                                 }}
//                                 className="h-8 w-8 p-0 hover:bg-accent"
//                               >
//                                 <Download className="h-3 w-3" />
//                               </Button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {selectedFile && (
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => copyToClipboard(selectedFile.content)}
//                               className="border-border hover:bg-accent"
//                             >
//                               <Copy className="h-4 w-4 mr-2" />
//                               Copy Code
//                             </Button>
//                           </div>
//                           <ScrollArea className="h-64 w-full">
//                             <pre className="text-xs bg-muted p-4 rounded-lg border border-border overflow-x-auto">
//                               <code className="text-foreground">{selectedFile.content}</code>
//                             </pre>
//                           </ScrollArea>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Generated files will appear here</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   Loader2,
//   Sparkles,
//   Target,
//   Code2,
//   Eye,
//   FileText,
//   CheckCircle,
//   ExternalLink,
//   Copy,
//   Download,
//   Brain,
//   Rocket,
//   Monitor,
//   Globe,
//   Lightbulb,
//   Wand2,
//   Database,
//   Settings,
//   MessageSquare,
//   Send,
//   Pause,
//   Zap,
//   Activity,
//   BarChart3,
//   Users,
//   Calendar,
//   ShoppingCart,
//   CreditCard,
//   AlertCircle,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"

// import { liveGenerationEngine, type LiveGenerationUpdate } from "@/lib/live-generation-engine"

// const TOOL_CATEGORIES = [
//   {
//     value: "dashboard",
//     label: "Analytics Dashboard",
//     description: "Data visualization and reporting tools",
//     icon: BarChart3,
//     color: "from-blue-500 to-cyan-500",
//     examples: ["Sales Dashboard", "KPI Tracker", "Performance Analytics"],
//   },
//   {
//     value: "crm",
//     label: "Customer Management",
//     description: "Customer relationship and contact management",
//     icon: Users,
//     color: "from-green-500 to-emerald-500",
//     examples: ["CRM System", "Contact Manager", "Lead Tracker"],
//   },
//   {
//     value: "ecommerce",
//     label: "E-commerce Tools",
//     description: "Online store and inventory management",
//     icon: ShoppingCart,
//     color: "from-purple-500 to-violet-500",
//     examples: ["Product Catalog", "Order Management", "Inventory Tracker"],
//   },
//   {
//     value: "finance",
//     label: "Financial Tools",
//     description: "Accounting and financial management",
//     icon: CreditCard,
//     color: "from-orange-500 to-red-500",
//     examples: ["Invoice Generator", "Expense Tracker", "Budget Planner"],
//   },
//   {
//     value: "project",
//     label: "Project Management",
//     description: "Task and project tracking systems",
//     icon: Calendar,
//     color: "from-pink-500 to-rose-500",
//     examples: ["Task Manager", "Project Tracker", "Team Planner"],
//   },
//   {
//     value: "automation",
//     label: "Workflow Automation",
//     description: "Process automation and workflow tools",
//     icon: Zap,
//     color: "from-indigo-500 to-blue-500",
//     examples: ["Email Automation", "Data Sync", "Report Generator"],
//   },
// ]

// const AVAILABLE_INTEGRATIONS = [
//   {
//     id: "supabase",
//     name: "Supabase",
//     description: "PostgreSQL database with real-time subscriptions",
//     icon: "🗄️",
//     type: "database",
//     popular: true,
//     dataTypes: ["Users", "Tables", "Real-time", "Auth"],
//     setupTime: "2 min",
//   },
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Payment processing and subscription management",
//     icon: "💳",
//     type: "payment",
//     popular: true,
//     dataTypes: ["Payments", "Customers", "Subscriptions", "Invoices"],
//     setupTime: "3 min",
//   },
//   {
//     id: "resend",
//     name: "Resend",
//     description: "Email delivery and transactional emails",
//     icon: "📧",
//     type: "communication",
//     popular: true,
//     dataTypes: ["Emails", "Templates", "Analytics", "Webhooks"],
//     setupTime: "1 min",
//   },
//   {
//     id: "openai",
//     name: "OpenAI",
//     description: "AI-powered text generation and analysis",
//     icon: "🤖",
//     type: "ai",
//     popular: true,
//     dataTypes: ["Text Generation", "Analysis", "Embeddings", "Chat"],
//     setupTime: "2 min",
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets",
//     description: "Spreadsheet data integration and automation",
//     icon: "📊",
//     type: "data",
//     dataTypes: ["Spreadsheets", "Charts", "Formulas", "Collaboration"],
//     setupTime: "4 min",
//   },
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Team communication and notifications",
//     icon: "💬",
//     type: "communication",
//     dataTypes: ["Messages", "Channels", "Users", "Files"],
//     setupTime: "3 min",
//   },
// ]

// const GENERATION_PHASES = [
//   { id: "analyzing", label: "Analyzing Requirements", icon: Brain, color: "text-blue-400" },
//   { id: "designing", label: "Designing UI Components", icon: Wand2, color: "text-purple-400" },
//   { id: "integrating", label: "Setting up Integrations", icon: Database, color: "text-green-400" },
//   { id: "generating", label: "Generating Code", icon: Code2, color: "text-orange-400" },
//   { id: "testing", label: "Testing & Optimization", icon: Activity, color: "text-cyan-400" },
//   { id: "deploying", label: "Preparing Deployment", icon: Rocket, color: "text-pink-400" },
// ]

// interface ToolFile {
//   name: string
//   content: string
//   type?: string
//   size?: number
// }

// interface GenerationStatus {
//   status: "idle" | "analyzing" | "generating" | "integrating" | "completed" | "error"
//   progress: number
//   step: string
//   message?: string
//   error?: string
//   files: ToolFile[]
//   demoUrl?: string
//   chatUrl?: string
//   chatId?: string
//   currentPhase: "setup" | "ui" | "integration" | "deploy"
//   deploymentUrl?: string
//   metrics?: {
//     linesOfCode: number
//     components: number
//     apiEndpoints: number
//     estimatedValue: string
//   }
// }

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant" | "system"
//   content: string
//   timestamp: Date
//   type?: "message" | "code" | "preview"
// }

// interface CreateToolInterfaceProps {
//   organizationSlug: string
// }

// export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
//   // Core state
//   const [activeTab, setActiveTab] = useState("configure")
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     requirements: "",
//   })

//   // Generation state
//   const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
//     status: "idle",
//     progress: 0,
//     step: "ready",
//     files: [],
//     currentPhase: "setup",
//   })

//   // Chat state
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
//   const [chatInput, setChatInput] = useState("")
//   const [isChatLoading, setIsChatLoading] = useState(false)

//   // UI state
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [isPolling, setIsPolling] = useState(false)
//   const [showMetrics, setShowMetrics] = useState(false)

//   const { toast } = useToast()
//   const router = useRouter()
//   const logsEndRef = useRef<HTMLDivElement>(null)
//   const chatEndRef = useRef<HTMLDivElement>(null)
//   const pollingRef = useRef<NodeJS.Timeout>()

//   const addLog = useCallback((message: string, type: "info" | "success" | "error" | "warning" = "info") => {
//     const timestamp = new Date().toLocaleTimeString()
//     const icons = {
//       info: "ℹ️",
//       success: "✅",
//       error: "❌",
//       warning: "⚠️",
//     }
//     const formattedMessage = `[${timestamp}] ${icons[type]} ${message}`

//     setStreamingLogs((prev) => [...prev.slice(-49), formattedMessage]) // Keep last 50 logs

//     setTimeout(() => {
//       logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, 100)
//   }, [])

//   const startPolling = useCallback(
//     (toolId: string) => {
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current)
//       }

//       setIsPolling(true)
//       addLog("🔄 Starting real-time monitoring...", "info")

//       pollingRef.current = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/organizations/${organizationSlug}/tools/${toolId}/status`)
//           if (!response.ok) throw new Error(`Status check failed: ${response.status}`)

//           const status = await response.json()

//           setGenerationStatus((prev) => ({
//             ...prev,
//             status: status.status,
//             progress: status.progress || 0,
//             step: status.step || "unknown",
//             message: status.message,
//             error: status.error,
//             files: status.files || [],
//             demoUrl: status.demoUrl,
//             chatUrl: status.chatUrl,
//             chatId: status.chatId,
//             metrics: status.metrics,
//           }))

//           if (status.status === "completed") {
//             addLog("🎉 Tool generation completed successfully!", "success")
//             setIsPolling(false)
//             setShowMetrics(true)
//             setActiveTab("preview")
//             if (pollingRef.current) clearInterval(pollingRef.current)
//           } else if (status.status === "error") {
//             addLog(`❌ Generation failed: ${status.error}`, "error")
//             setIsPolling(false)
//             if (pollingRef.current) clearInterval(pollingRef.current)
//           } else {
//             addLog(`📊 ${status.step} - ${status.progress}%`, "info")
//           }
//         } catch (error) {
//           addLog(`💥 Monitoring error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
//         }
//       }, 2000)
//     },
//     [organizationSlug, addLog],
//   )

//   const startRealTimeGeneration = useCallback(async () => {
//     if (!formData.name || !formData.description || !formData.category || !formData.requirements) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields before generating.",
//         variant: "destructive",
//       })
//       return
//     }

//     setGenerationStatus({
//       status: "analyzing",
//       progress: 0,
//       step: "analyzing",
//       files: [],
//       currentPhase: "setup",
//     })

//     setStreamingLogs([])
//     setActiveTab("generate")
//     addLog("🚀 Starting real-time tool generation...", "info")

//     try {
//       await liveGenerationEngine.generateBusinessTool(
//         {
//           toolName: formData.name,
//           requirements: formData.requirements,
//           category: formData.category,
//           userEmail: "", // Could be populated from user context
//         },
//         (update: LiveGenerationUpdate) => {
//           switch (update.type) {
//             case "progress":
//               setGenerationStatus((prev) => ({
//                 ...prev,
//                 status: update.step === "completed" ? "completed" : "generating",
//                 progress: update.progress || 0,
//                 step: update.step || "generating",
//                 message: update.message,
//               }))
//               if (update.message) {
//                 addLog(update.message, "info")
//               }
//               break

//             case "log":
//               if (update.message) {
//                 addLog(update.message, "info")
//               }
//               break

//             case "file_created":
//               if (update.file) {
//                 setGenerationStatus((prev) => ({
//                   ...prev,
//                   files: [...prev.files, update.file!],
//                   progress: update.progress || prev.progress,
//                 }))
//                 addLog(`📄 Created ${update.file.name}`, "success")
//               }
//               break

//             case "completed":
//               if (update.result) {
//                 setGenerationStatus((prev) => ({
//                   ...prev,
//                   status: "completed",
//                   progress: 100,
//                   step: "completed",
//                   files: update.result!.files,
//                   demoUrl: update.result!.demoUrl,
//                   chatUrl: update.result!.chatUrl,
//                   chatId: update.result!.chatId,
//                   metrics: update.result!.metrics,
//                 }))
//                 setShowMetrics(true)
//                 setActiveTab("preview")
//                 addLog("🎉 Generation completed successfully!", "success")
//                 toast({
//                   title: "Tool Generated!",
//                   description: "Your business tool has been generated successfully.",
//                 })
//               }
//               break

//             case "error":
//               setGenerationStatus((prev) => ({
//                 ...prev,
//                 status: "error",
//                 message: update.error || "An error occurred during generation",
//               }))
//               if (update.error) {
//                 addLog(`❌ Error: ${update.error}`, "error")
//               }
//               toast({
//                 title: "Generation Failed",
//                 description: update.error || "An error occurred during generation",
//                 variant: "destructive",
//               })
//               break
//           }
//         },
//       )
//     } catch (error) {
//       console.error("Generation error:", error)
//       setGenerationStatus((prev) => ({
//         ...prev,
//         status: "error",
//         message: error instanceof Error ? error.message : "Unknown error occurred",
//       }))
//       addLog(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
//       toast({
//         title: "Generation Failed",
//         description: error instanceof Error ? error.message : "An unexpected error occurred",
//         variant: "destructive",
//       })
//     }
//   }, [formData, toast, addLog])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await startRealTimeGeneration()
//   }

//   const sendChatMessage = async () => {
//     if (!chatInput.trim() || !generationStatus.chatId) return

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: chatInput,
//       timestamp: new Date(),
//     }

//     setChatMessages((prev) => [...prev, userMessage])
//     setChatInput("")
//     setIsChatLoading(true)

//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/tools/${generationStatus.chatId}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: chatInput }),
//       })

//       if (!response.ok) throw new Error("Failed to send message")

//       const result = await response.json()

//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: result.message || "I've updated your tool based on your feedback.",
//         timestamp: new Date(),
//       }

//       setChatMessages((prev) => [...prev, assistantMessage])

//       // Update generation status if new files are available
//       if (result.files) {
//         setGenerationStatus((prev) => ({
//           ...prev,
//           files: result.files,
//           demoUrl: result.demoUrl || prev.demoUrl,
//         }))
//       }

//       addLog("💬 Chat message processed successfully", "success")
//     } catch (error) {
//       addLog(`💥 Chat error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
//       toast({
//         title: "Chat Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsChatLoading(false)
//     }
//   }

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast({ title: "Copied!", description: "Content copied to clipboard." })
//     } catch (error) {
//       toast({ title: "Copy Failed", description: "Failed to copy content.", variant: "destructive" })
//     }
//   }

//   const downloadFile = (file: ToolFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//     toast({ title: "Downloaded!", description: `${file.name} has been downloaded.` })
//   }

//   const getCurrentPhase = () => {
//     return GENERATION_PHASES.find((phase) => phase.id === generationStatus.step) || GENERATION_PHASES[0]
//   }

//   const isFormValid = formData.name && formData.description && formData.category && formData.requirements

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [chatMessages])

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
//                 <Sparkles className="h-5 w-5 text-primary-foreground" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-foreground">AI Business Tool Generator</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Create production-ready applications with real integrations
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {isPolling && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setIsPolling(false)}
//                   className="border-border bg-card hover:bg-accent"
//                 >
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Monitoring
//                 </Button>
//               )}
//               {showMetrics && generationStatus.metrics && (
//                 <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
//                   <Activity className="h-3 w-3 mr-1" />
//                   {generationStatus.metrics.estimatedValue} value
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4 bg-muted/30 border border-border">
//             <TabsTrigger value="configure" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
//               <Settings className="h-4 w-4 mr-2" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="generate" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
//               <Wand2 className="h-4 w-4 mr-2" />
//               Generate
//             </TabsTrigger>
//             <TabsTrigger
//               value="chat"
//               className="data-[state=active]:bg-card data-[state=active]:text-foreground"
//               disabled={!generationStatus.chatId}
//             >
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Chat & Refine
//             </TabsTrigger>
//             <TabsTrigger
//               value="preview"
//               className="data-[state=active]:bg-card data-[state=active]:text-foreground"
//               disabled={generationStatus.files.length === 0}
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Preview & Deploy
//             </TabsTrigger>
//           </TabsList>

//           {/* Configure Tab */}
//           <TabsContent value="configure" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2">
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Target className="h-5 w-5 text-primary" />
//                       Tool Configuration
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground">
//                       Define your business tool requirements and select integrations
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="name" className="text-foreground">
//                             Tool Name *
//                           </Label>
//                           <Input
//                             id="name"
//                             value={formData.name}
//                             onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                             placeholder="e.g., Customer Analytics Dashboard"
//                             className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                             required
//                             disabled={generationStatus.status === "generating"}
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="category" className="text-foreground">
//                             Category *
//                           </Label>
//                           <Select
//                             value={formData.category}
//                             onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
//                             disabled={generationStatus.status === "generating"}
//                           >
//                             <SelectTrigger className="bg-input border-border text-foreground">
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                               {TOOL_CATEGORIES.map((category) => {
//                                 const IconComponent = category.icon
//                                 return (
//                                   <SelectItem
//                                     key={category.value}
//                                     value={category.value}
//                                     className="text-foreground hover:bg-accent focus:bg-accent"
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <div
//                                         className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
//                                       >
//                                         <IconComponent className="h-4 w-4 text-white" />
//                                       </div>
//                                       <div>
//                                         <div className="font-medium">{category.label}</div>
//                                         <div className="text-xs text-muted-foreground">{category.description}</div>
//                                       </div>
//                                     </div>
//                                   </SelectItem>
//                                 )
//                               })}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="description" className="text-foreground">
//                           Description *
//                         </Label>
//                         <Input
//                           id="description"
//                           value={formData.description}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                           placeholder="Brief description of what this tool does"
//                           className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                           required
//                           disabled={generationStatus.status === "generating"}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="requirements" className="text-foreground">
//                           Detailed Requirements *
//                         </Label>
//                         <Textarea
//                           id="requirements"
//                           value={formData.requirements}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
//                           placeholder="Describe in detail what features and functionality you need. Include specific business logic, data inputs/outputs, user interactions, and any special requirements."
//                           className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
//                           required
//                           disabled={generationStatus.status === "generating"}
//                         />
//                         <div className="flex items-center justify-between text-xs">
//                           <span className="text-muted-foreground">{formData.requirements.length} characters</span>
//                           <span className="text-muted-foreground">💡 More detail = better results</span>
//                         </div>
//                       </div>

//                       <Button
//                         type="submit"
//                         disabled={!isFormValid || generationStatus.status === "generating"}
//                         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
//                       >
//                         {generationStatus.status === "generating" ? (
//                           <>
//                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                             Generating Tool...
//                           </>
//                         ) : (
//                           <>
//                             <Rocket className="h-4 w-4 mr-2" />
//                             Generate Business Tool
//                           </>
//                         )}
//                       </Button>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Integration Selection */}
//               <div>
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Database className="h-5 w-5 text-accent" />
//                       Integrations
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground">
//                       Select data sources and services
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {AVAILABLE_INTEGRATIONS.map((integration) => {
//                       const isSelected = selectedIntegrations.includes(integration.id)
//                       return (
//                         <div
//                           key={integration.id}
//                           className={cn(
//                             "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
//                             isSelected ? "border-primary bg-primary/10" : "border-border bg-muted/30",
//                             integration.popular && "ring-1 ring-primary/20",
//                           )}
//                           onClick={() => {
//                             setSelectedIntegrations((prev) =>
//                               isSelected ? prev.filter((id) => id !== integration.id) : [...prev, integration.id],
//                             )
//                           }}
//                         >
//                           <div className="flex items-start gap-3">
//                             <div className="text-2xl">{integration.icon}</div>
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-medium text-foreground">{integration.name}</span>
//                                 {integration.popular && (
//                                   <Badge variant="outline" className="text-xs text-primary border-primary/20">
//                                     Popular
//                                   </Badge>
//                                 )}
//                                 {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
//                               </div>
//                               <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
//                               <div className="flex flex-wrap gap-1">
//                                 {integration.dataTypes.slice(0, 2).map((type) => (
//                                   <Badge key={type} variant="secondary" className="text-xs bg-secondary/50">
//                                     {type}
//                                   </Badge>
//                                 ))}
//                                 {integration.dataTypes.length > 2 && (
//                                   <Badge variant="secondary" className="text-xs bg-secondary/50">
//                                     +{integration.dataTypes.length - 2}
//                                   </Badge>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Generate Tab */}
//           <TabsContent value="generate" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Generation Progress */}
//               <div className="space-y-6">
//                 {generationStatus.status !== "idle" && (
//                   <Card className="bg-card border-border">
//                     <CardHeader>
//                       <CardTitle className="text-foreground flex items-center gap-2">
//                         <Activity className="h-5 w-5 text-primary" />
//                         Generation Progress
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-foreground">{getCurrentPhase().label}</span>
//                           <span className="text-sm text-muted-foreground">{generationStatus.progress}%</span>
//                         </div>
//                         <Progress value={generationStatus.progress} className="h-2 bg-muted" />
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         {GENERATION_PHASES.map((phase, index) => {
//                           const IconComponent = phase.icon
//                           const isActive = phase.id === generationStatus.step
//                           const isCompleted = generationStatus.progress > index * 16.67

//                           return (
//                             <div
//                               key={phase.id}
//                               className={cn(
//                                 "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
//                                 isActive && "bg-primary/20 border border-primary/30",
//                                 isCompleted && !isActive && "bg-green-500/20 border border-green-500/30",
//                                 !isActive && !isCompleted && "bg-muted/50 border border-border",
//                               )}
//                             >
//                               <IconComponent
//                                 className={cn(
//                                   "h-3 w-3",
//                                   isActive && phase.color + " animate-pulse",
//                                   isCompleted && !isActive && "text-green-400",
//                                   !isActive && !isCompleted && "text-muted-foreground",
//                                 )}
//                               />
//                               <span
//                                 className={cn(
//                                   isActive && phase.color,
//                                   isCompleted && !isActive && "text-green-400",
//                                   !isActive && !isCompleted && "text-muted-foreground",
//                                 )}
//                               >
//                                 {phase.label}
//                               </span>
//                             </div>
//                           )
//                         })}
//                       </div>

//                       {generationStatus.error && (
//                         <div className="flex items-center gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
//                           <AlertCircle className="h-4 w-4 text-destructive" />
//                           <span className="text-sm text-destructive">{generationStatus.error}</span>
//                         </div>
//                       )}

//                       {showMetrics && generationStatus.metrics && (
//                         <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-green-400">
//                               {generationStatus.metrics.components}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Components</div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-green-400">
//                               {generationStatus.metrics.linesOfCode}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Lines of Code</div>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>

//               {/* Real-time Logs */}
//               <div>
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Monitor className="h-5 w-5 text-green-400" />
//                       Real-time Generation Logs
//                       {isPolling && (
//                         <div className="flex items-center gap-1 ml-auto">
//                           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                           <span className="text-xs text-green-400">Live</span>
//                         </div>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ScrollArea className="h-96 w-full">
//                       <div className="space-y-1 font-mono text-xs">
//                         {streamingLogs.length === 0 ? (
//                           <div className="text-muted-foreground italic">Logs will appear here during generation...</div>
//                         ) : (
//                           streamingLogs.map((log, index) => (
//                             <div
//                               key={index}
//                               className={cn(
//                                 "p-2 rounded border-l-2",
//                                 log.includes("✅") && "border-green-500 bg-green-500/10 text-green-300",
//                                 log.includes("❌") && "border-red-500 bg-red-500/10 text-red-300",
//                                 log.includes("⚠️") && "border-yellow-500 bg-yellow-500/10 text-yellow-300",
//                                 log.includes("ℹ️") && "border-blue-500 bg-blue-500/10 text-blue-300",
//                                 !log.includes("✅") &&
//                                   !log.includes("❌") &&
//                                   !log.includes("⚠️") &&
//                                   !log.includes("ℹ️") &&
//                                   "border-border bg-muted/30 text-foreground",
//                               )}
//                             >
//                               {log}
//                             </div>
//                           ))
//                         )}
//                         <div ref={logsEndRef} />
//                       </div>
//                     </ScrollArea>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Chat Tab */}
//           <TabsContent value="chat" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <MessageSquare className="h-5 w-5 text-primary" />
//                     Chat with AI Assistant
//                   </CardTitle>
//                   <CardDescription className="text-muted-foreground">
//                     Refine and improve your generated tool
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <ScrollArea className="h-96 w-full">
//                     <div className="space-y-4">
//                       {chatMessages.length === 0 ? (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                           <p>Start a conversation to refine your tool</p>
//                         </div>
//                       ) : (
//                         chatMessages.map((message) => (
//                           <div
//                             key={message.id}
//                             className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
//                           >
//                             <div
//                               className={cn(
//                                 "max-w-[80%] p-3 rounded-lg",
//                                 message.role === "user"
//                                   ? "bg-primary text-primary-foreground"
//                                   : "bg-muted text-foreground",
//                               )}
//                             >
//                               <p className="text-sm">{message.content}</p>
//                               <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                       <div ref={chatEndRef} />
//                     </div>
//                   </ScrollArea>

//                   <div className="flex gap-2">
//                     <Input
//                       value={chatInput}
//                       onChange={(e) => setChatInput(e.target.value)}
//                       placeholder="Ask for changes or improvements..."
//                       className="bg-input border-border text-foreground"
//                       onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
//                       disabled={isChatLoading}
//                     />
//                     <Button
//                       onClick={sendChatMessage}
//                       disabled={!chatInput.trim() || isChatLoading}
//                       className="bg-primary hover:bg-primary/90"
//                     >
//                       {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Chat History & Context */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Brain className="h-5 w-5 text-accent" />
//                     Context & Suggestions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
//                     <div className="grid grid-cols-1 gap-2">
//                       {[
//                         "Add a dark mode toggle",
//                         "Improve the mobile layout",
//                         "Add data export functionality",
//                         "Enhance the color scheme",
//                         "Add loading states",
//                         "Improve accessibility",
//                       ].map((suggestion) => (
//                         <Button
//                           key={suggestion}
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setChatInput(suggestion)}
//                           className="justify-start text-left h-auto p-2 border-border hover:bg-accent"
//                         >
//                           <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
//                           <span className="text-xs">{suggestion}</span>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Preview Tab */}
//           <TabsContent value="preview" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Preview */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Eye className="h-5 w-5 text-primary" />
//                     Live Preview
//                   </CardTitle>
//                   <CardDescription className="text-muted-foreground">
//                     Interactive preview of your generated tool
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {generationStatus.demoUrl ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-foreground">Live Application</span>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => window.open(generationStatus.demoUrl, "_blank")}
//                             className="border-border hover:bg-accent"
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             Open in New Tab
//                           </Button>
//                           {generationStatus.chatUrl && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => window.open(generationStatus.chatUrl, "_blank")}
//                               className="border-border hover:bg-accent"
//                             >
//                               <Globe className="h-4 w-4 mr-2" />
//                               View Chat
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                       <div className="border border-border rounded-lg overflow-hidden">
//                         <iframe
//                           src={generationStatus.demoUrl}
//                           className="w-full h-96 bg-background"
//                           title="Generated Tool Preview"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Preview will appear once generation is complete</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Files */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-accent" />
//                     Generated Files ({generationStatus.files.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {generationStatus.files.length > 0 ? (
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 gap-2">
//                         {generationStatus.files.map((file, index) => (
//                           <div
//                             key={index}
//                             className={cn(
//                               "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
//                               selectedFile === file
//                                 ? "border-primary bg-primary/10"
//                                 : "border-border bg-muted/30 hover:bg-muted/50",
//                             )}
//                             onClick={() => setSelectedFile(file)}
//                           >
//                             <div className="flex items-center gap-3">
//                               <FileText className="h-4 w-4 text-muted-foreground" />
//                               <div>
//                                 <div className="text-sm font-medium text-foreground">{file.name}</div>
//                                 <div className="text-xs text-muted-foreground">
//                                   {file.type} • {(file.content.length / 1024).toFixed(1)}KB
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   copyToClipboard(file.content)
//                                 }}
//                                 className="h-8 w-8 p-0 hover:bg-accent"
//                               >
//                                 <Copy className="h-3 w-3" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   downloadFile(file)
//                                 }}
//                                 className="h-8 w-8 p-0 hover:bg-accent"
//                               >
//                                 <Download className="h-3 w-3" />
//                               </Button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {selectedFile && (
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => copyToClipboard(selectedFile.content)}
//                               className="border-border hover:bg-accent"
//                             >
//                               <Copy className="h-4 w-4 mr-2" />
//                               Copy Code
//                             </Button>
//                           </div>
//                           <ScrollArea className="h-64 w-full">
//                             <pre className="text-xs bg-muted p-4 rounded-lg border border-border overflow-x-auto">
//                               <code className="text-foreground">{selectedFile.content}</code>
//                             </pre>
//                           </ScrollArea>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Generated files will appear here</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }


// "use client"

// import type React from "react"

// import { useState, useEffect, useCallback, useRef } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   Loader2,
//   Sparkles,
//   Target,
//   Code2,
//   Eye,
//   FileText,
//   CheckCircle,
//   ExternalLink,
//   Copy,
//   Download,
//   Brain,
//   Rocket,
//   Monitor,
//   Globe,
//   Lightbulb,
//   Wand2,
//   Database,
//   Settings,
//   MessageSquare,
//   Send,
//   Pause,
//   Zap,
//   Activity,
//   BarChart3,
//   Users,
//   Calendar,
//   ShoppingCart,
//   CreditCard,
//   AlertCircle,
// } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { useToast } from "@/hooks/use-toast"

// import { liveGenerationEngine, type LiveGenerationUpdate } from "@/lib/live-generation-engine"

// const TOOL_CATEGORIES = [
//   {
//     value: "dashboard",
//     label: "Analytics Dashboard",
//     description: "Data visualization and reporting tools",
//     icon: BarChart3,
//     color: "from-blue-500 to-cyan-500",
//     examples: ["Sales Dashboard", "KPI Tracker", "Performance Analytics"],
//   },
//   {
//     value: "crm",
//     label: "Customer Management",
//     description: "Customer relationship and contact management",
//     icon: Users,
//     color: "from-green-500 to-emerald-500",
//     examples: ["CRM System", "Contact Manager", "Lead Tracker"],
//   },
//   {
//     value: "ecommerce",
//     label: "E-commerce Tools",
//     description: "Online store and inventory management",
//     icon: ShoppingCart,
//     color: "from-purple-500 to-violet-500",
//     examples: ["Product Catalog", "Order Management", "Inventory Tracker"],
//   },
//   {
//     value: "finance",
//     label: "Financial Tools",
//     description: "Accounting and financial management",
//     icon: CreditCard,
//     color: "from-orange-500 to-red-500",
//     examples: ["Invoice Generator", "Expense Tracker", "Budget Planner"],
//   },
//   {
//     value: "project",
//     label: "Project Management",
//     description: "Task and project tracking systems",
//     icon: Calendar,
//     color: "from-pink-500 to-rose-500",
//     examples: ["Task Manager", "Project Tracker", "Team Planner"],
//   },
//   {
//     value: "automation",
//     label: "Workflow Automation",
//     description: "Process automation and workflow tools",
//     icon: Zap,
//     color: "from-indigo-500 to-blue-500",
//     examples: ["Email Automation", "Data Sync", "Report Generator"],
//   },
// ]

// const AVAILABLE_INTEGRATIONS = [
//   {
//     id: "supabase",
//     name: "Supabase",
//     description: "PostgreSQL database with real-time subscriptions",
//     icon: "🗄️",
//     type: "database",
//     popular: true,
//     dataTypes: ["Users", "Tables", "Real-time", "Auth"],
//     setupTime: "2 min",
//   },
//   {
//     id: "stripe",
//     name: "Stripe",
//     description: "Payment processing and subscription management",
//     icon: "💳",
//     type: "payment",
//     popular: true,
//     dataTypes: ["Payments", "Customers", "Subscriptions", "Invoices"],
//     setupTime: "3 min",
//   },
//   {
//     id: "resend",
//     name: "Resend",
//     description: "Email delivery and transactional emails",
//     icon: "📧",
//     type: "communication",
//     popular: true,
//     dataTypes: ["Emails", "Templates", "Analytics", "Webhooks"],
//     setupTime: "1 min",
//   },
//   {
//     id: "openai",
//     name: "OpenAI",
//     description: "AI-powered text generation and analysis",
//     icon: "🤖",
//     type: "ai",
//     popular: true,
//     dataTypes: ["Text Generation", "Analysis", "Embeddings", "Chat"],
//     setupTime: "2 min",
//   },
//   {
//     id: "google-sheets",
//     name: "Google Sheets",
//     description: "Spreadsheet data integration and automation",
//     icon: "📊",
//     type: "data",
//     dataTypes: ["Spreadsheets", "Charts", "Formulas", "Collaboration"],
//     setupTime: "4 min",
//   },
//   {
//     id: "slack",
//     name: "Slack",
//     description: "Team communication and notifications",
//     icon: "💬",
//     type: "communication",
//     dataTypes: ["Messages", "Channels", "Users", "Files"],
//     setupTime: "3 min",
//   },
// ]

// const GENERATION_PHASES = [
//   { id: "analyzing", label: "Analyzing Requirements", icon: Brain, color: "text-blue-400" },
//   { id: "designing", label: "Designing UI Components", icon: Wand2, color: "text-purple-400" },
//   { id: "integrating", label: "Setting up Integrations", icon: Database, color: "text-green-400" },
//   { id: "generating", label: "Generating Code", icon: Code2, color: "text-orange-400" },
//   { id: "testing", label: "Testing & Optimization", icon: Activity, color: "text-cyan-400" },
//   { id: "deploying", label: "Preparing Deployment", icon: Rocket, color: "text-pink-400" },
// ]

// interface ToolFile {
//   name: string
//   content: string
//   type?: string
//   size?: number
// }

// interface GenerationStatus {
//   status: "idle" | "analyzing" | "generating" | "integrating" | "completed" | "error"
//   progress: number
//   step: string
//   message?: string
//   error?: string
//   files: ToolFile[]
//   demoUrl?: string
//   chatUrl?: string
//   chatId?: string
//   currentPhase: "setup" | "ui" | "integration" | "deploy"
//   deploymentUrl?: string
//   metrics?: {
//     linesOfCode: number
//     components: number
//     apiEndpoints: number
//     estimatedValue: string
//   }
// }

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant" | "system"
//   content: string
//   timestamp: Date
//   type?: "message" | "code" | "preview"
// }

// interface CreateToolInterfaceProps {
//   organizationSlug: string
// }

// export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
//   // Core state
//   const [activeTab, setActiveTab] = useState("configure")
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//     requirements: "",
//   })

//   // Generation state
//   const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
//     status: "idle",
//     progress: 0,
//     step: "ready",
//     files: [],
//     currentPhase: "setup",
//   })

//   // Chat state
//   const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
//   const [chatInput, setChatInput] = useState("")
//   const [isChatLoading, setIsChatLoading] = useState(false)

//   // UI state
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
//   const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [isPolling, setIsPolling] = useState(false)
//   const [showMetrics, setShowMetrics] = useState(false)

//   const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([])
//   const [integrationTests, setIntegrationTests] = useState<any>(null)

//   const { toast } = useToast()
//   const router = useRouter()
//   const logsEndRef = useRef<HTMLDivElement>(null)
//   const chatEndRef = useRef<HTMLDivElement>(null)
//   const pollingRef = useRef<NodeJS.Timeout>()

//   const addLog = useCallback((message: string, type: "info" | "success" | "error" | "warning" = "info") => {
//     const timestamp = new Date().toLocaleTimeString()
//     const icons = {
//       info: "ℹ️",
//       success: "✅",
//       error: "❌",
//       warning: "⚠️",
//     }
//     const formattedMessage = `[${timestamp}] ${icons[type]} ${message}`

//     setStreamingLogs((prev) => [...prev.slice(-49), formattedMessage]) // Keep last 50 logs

//     setTimeout(() => {
//       logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//     }, 100)
//   }, [])

//   const startPolling = useCallback(
//     (toolId: string) => {
//       if (pollingRef.current) {
//         clearInterval(pollingRef.current)
//       }

//       setIsPolling(true)
//       addLog("🔄 Starting real-time monitoring...", "info")

//       pollingRef.current = setInterval(async () => {
//         try {
//           const response = await fetch(`/api/organizations/${organizationSlug}/tools/${toolId}/status`)
//           if (!response.ok) throw new Error(`Status check failed: ${response.status}`)

//           const status = await response.json()

//           setGenerationStatus((prev) => ({
//             ...prev,
//             status: status.status,
//             progress: status.progress || 0,
//             step: status.step || "unknown",
//             message: status.message,
//             error: status.error,
//             files: status.files || [],
//             demoUrl: status.demoUrl,
//             chatUrl: status.chatUrl,
//             chatId: status.chatId,
//             metrics: status.metrics,
//           }))

//           if (status.status === "completed") {
//             addLog("🎉 Tool generation completed successfully!", "success")
//             setIsPolling(false)
//             setShowMetrics(true)
//             setActiveTab("preview")
//             if (pollingRef.current) clearInterval(pollingRef.current)
//           } else if (status.status === "error") {
//             addLog(`❌ Generation faileda: ${status.error}`, "error")
//             setIsPolling(false)
//             if (pollingRef.current) clearInterval(pollingRef.current)
//           } else {
//             addLog(`📊 ${status.step} - ${status.progress}%`, "info")
//           }
//         } catch (error) {
//           addLog(`💥 Monitoring error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
//         }
//       }, 2000)
//     },
//     [organizationSlug, addLog],
//   )

//   const startRealTimeGeneration = useCallback(async () => {
//     if (!formData.name || !formData.description || !formData.category || !formData.requirements) {
//       toast({
//         title: "Missing Information",
//         description: "Please fill in all required fields before generating.",
//         variant: "destructive",
//       })
//       return
//     }

//     setGenerationStatus({
//       status: "analyzing",
//       progress: 0,
//       step: "analyzing",
//       files: [],
//       currentPhase: "setup",
//     })

//     setStreamingLogs([])
//     setActiveTab("generate")
//     addLog("🚀 Starting real-time tool generation...", "info")

//     try {
//       await liveGenerationEngine.generateBusinessTool(
//         {
//           toolName: formData.name,
//           requirements: formData.requirements,
//           category: formData.category,
//           userEmail: "", // Could be populated from user context
//         },
//         (update: LiveGenerationUpdate) => {
//           switch (update.type) {
//             case "progress":
//               setGenerationStatus((prev) => ({
//                 ...prev,
//                 status: update.step === "completed" ? "completed" : "generating",
//                 progress: update.progress || 0,
//                 step: update.step || "generating",
//                 message: update.message,
//               }))
//               if (update.message) {
//                 addLog(update.message, "info")
//               }
//               break

//             case "log":
//               if (update.message) {
//                 addLog(update.message, "info")
//               }
//               break

//             case "file_created":
//               if (update.file) {
//                 setGenerationStatus((prev) => ({
//                   ...prev,
//                   files: [...prev.files, update.file!],
//                   progress: update.progress || prev.progress,
//                 }))
//                 addLog(`📄 Created ${update.file.name}`, "success")
//               }
//               break

//             case "completed":
//               if (update.result) {
//                 setGenerationStatus((prev) => ({
//                   ...prev,
//                   status: "completed",
//                   progress: 100,
//                   step: "completed",
//                   files: update.result!.files,
//                   demoUrl: update.result!.demoUrl,
//                   chatUrl: update.result!.chatUrl,
//                   chatId: update.result!.chatId,
//                   metrics: update.result!.metrics,
//                 }))
//                 setShowMetrics(true)
//                 setActiveTab("preview")
//                 addLog("🎉 Generation completed successfully!", "success")
//                 toast({
//                   title: "Tool Generated!",
//                   description: "Your business tool has been generated successfully.",
//                 })
//               }
//               break

//             case "error":
//               setGenerationStatus((prev) => ({
//                 ...prev,
//                 status: "error",
//                 message: update.error || "An error occurred during generation",
//               }))
//               if (update.error) {
//                 addLog(`❌ Error: ${update.error}`, "error")
//               }
//               toast({
//                 title: "Generation Failedb",
//                 description: update.error || "An error occurred during generation",
//                 variant: "destructive",
//               })
//               break
//           }
//         },
//       )
//     } catch (error) {
//       console.error("Generation error:", error)
//       setGenerationStatus((prev) => ({
//         ...prev,
//         status: "error",
//         message: error instanceof Error ? error.message : "Unknown error occurred",
//       }))
//       addLog(`❌ Generation failedc: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
//       toast({
//         title: "Generation Failedd",
//         description: error instanceof Error ? error.message : "An unexpected error occurred",
//         variant: "destructive",
//       })
//     }
//   }, [formData, toast, addLog])

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await startRealTimeGeneration()
//   }

//   const sendChatMessage = async () => {
//     if (!chatInput.trim() || !generationStatus.chatId) return

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: chatInput,
//       timestamp: new Date(),
//     }

//     setChatMessages((prev) => [...prev, userMessage])
//     setChatInput("")
//     setIsChatLoading(true)

//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/tools/${generationStatus.chatId}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: chatInput }),
//       })

//       if (!response.ok) throw new Error("Failed to send message")

//       const result = await response.json()

//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: result.message || "I've updated your tool based on your feedback.",
//         timestamp: new Date(),
//       }

//       setChatMessages((prev) => [...prev, assistantMessage])

//       // Update generation status if new files are available
//       if (result.files) {
//         setGenerationStatus((prev) => ({
//           ...prev,
//           files: result.files,
//           demoUrl: result.demoUrl || prev.demoUrl,
//         }))
//       }

//       addLog("💬 Chat message processed successfully", "success")
//     } catch (error) {
//       addLog(`💥 Chat error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
//       toast({
//         title: "Chat Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsChatLoading(false)
//     }
//   }

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast({ title: "Copied!", description: "Content copied to clipboard." })
//     } catch (error) {
//       toast({ title: "Copy Failed", description: "Failed to copy content.", variant: "destructive" })
//     }
//   }

//   const downloadFile = (file: ToolFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//     toast({ title: "Downloaded!", description: `${file.name} has been downloaded.` })
//   }

//   const getCurrentPhase = () => {
//     return GENERATION_PHASES.find((phase) => phase.id === generationStatus.step) || GENERATION_PHASES[0]
//   }

//   const isFormValid = formData.name && formData.description && formData.category && formData.requirements

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [chatMessages])

//   useEffect(() => {
//     if (organizationSlug) {
//       fetchConnectedIntegrations()
//     }
//   }, [organizationSlug])

//   const fetchConnectedIntegrations = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/integrations`)
//       if (response.ok) {
//         const data = await response.json()
//         setConnectedIntegrations(data.integrations || [])
//         addLog(`Found ${data.integrations?.length || 0} connected integrations`, "info")
//       }
//     } catch (error) {
//       addLog("Failed to fetch connected integrations", "error")
//     }
//   }

//   const generateTool = async () => {
//     if (!formData.name.trim() || !formData.requirements.trim()) {
//       toast({
//         title: "Missing Information",
//         description: "Please provide both tool name and requirements.",
//         variant: "destructive",
//       })
//       return
//     }

//     // Test integrations before generation
//     if (selectedIntegrations.length > 0) {
//       addLog("Testing selected integrations...", "info")
//       try {
//         const testResponse = await fetch(`/api/organizations/${organizationSlug}/integrations/test`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ integrations: selectedIntegrations }),
//         })

//         if (testResponse.ok) {
//           const testResults = await testResponse.json()
//           setIntegrationTests(testResults)

//           if (!testResults.allPassed) {
//             addLog(`Integration test warnings: ${testResults.failures.join(", ")}`, "warning")
//           } else {
//             addLog("All integration tests passed ✅", "success")
//           }
//         }
//       } catch (error) {
//         addLog("Integration testing failed", "error")
//       }
//     }

//     setGenerationStatus({
//       status: "analyzing",
//       progress: 0,
//       step: "analyzing",
//       files: [],
//       currentPhase: "setup",
//     })

//     setActiveTab("generate")
//     setStreamingLogs([])

//     try {
//       // Use the enhanced generation engine with real data
//       await liveGenerationEngine.generateBusinessToolWithRealData(
//         {
//           toolName: formData.name,
//           requirements: formData.requirements,
//           category: formData.category,
//           userEmail: "user@example.com", // Get from auth context
//         },
//         organizationSlug,
//         selectedIntegrations,
//         handleGenerationUpdate,
//       )
//     } catch (error) {
//       addLog(`Generation failede: ${error}`, "error")
//       setGenerationStatus((prev) => ({
//         ...prev,
//         status: "error",
//         error: error instanceof Error ? error.message : "Unknown error",
//       }))
//     }
//   }

//   const handleGenerationUpdate = (update: LiveGenerationUpdate) => {
//     switch (update.type) {
//       case "progress":
//         setGenerationStatus((prev) => ({
//           ...prev,
//           status: update.step === "completed" ? "completed" : "generating",
//           progress: update.progress || 0,
//           step: update.step || "generating",
//           message: update.message,
//         }))
//         if (update.message) {
//           addLog(update.message, "info")
//         }
//         break

//       case "log":
//         if (update.message) {
//           addLog(update.message, "info")
//         }
//         break

//       case "file_created":
//         if (update.file) {
//           setGenerationStatus((prev) => ({
//             ...prev,
//             files: [...prev.files, update.file!],
//             progress: update.progress || prev.progress,
//           }))
//           addLog(`📄 Created ${update.file.name}`, "success")
//         }
//         break

//       case "completed":
//         if (update.result) {
//           setGenerationStatus((prev) => ({
//             ...prev,
//             status: "completed",
//             progress: 100,
//             step: "completed",
//             files: update.result!.files,
//             demoUrl: update.result!.demoUrl,
//             chatUrl: update.result!.chatUrl,
//             chatId: update.result!.chatId,
//             metrics: update.result!.metrics,
//           }))
//           setShowMetrics(true)
//           setActiveTab("preview")
//           addLog("🎉 Generation completed successfully!", "success")
//           toast({
//             title: "Tool Generated!",
//             description: "Your business tool has been generated successfully.",
//           })
//         }
//         break

//       case "error":
//         setGenerationStatus((prev) => ({
//           ...prev,
//           status: "error",
//           message: update.error || "An error occurred during generation",
//         }))
//         if (update.error) {
//           addLog(`❌ Error: ${update.error}`, "error")
//         }
//         toast({
//           title: "Generation Failedf",
//           description: update.error || "An error occurred during generation",
//           variant: "destructive",
//         })
//         break
//     }
//   }

//   const handleSubmitEnhanced = async (e: React.FormEvent) => {
//     e.preventDefault()
//     await generateTool()
//   }

//   const renderIntegrationSelection = () => {
//     const availableIntegrations = AVAILABLE_INTEGRATIONS.filter((integration) =>
//       connectedIntegrations.some((connected) => connected.provider.toLowerCase() === integration.id.toLowerCase()),
//     )

//     if (availableIntegrations.length === 0) {
//       return (
//         <Card className="bg-card border-border">
//           <CardHeader>
//             <CardTitle className="text-foreground flex items-center gap-2">
//               <Database className="h-5 w-5 text-accent" />
//               Integrations
//             </CardTitle>
//             <CardDescription className="text-muted-foreground">No integrations connected</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-center py-8">
//               <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//               <h3 className="text-lg font-semibold mb-2">No Integrations Connected</h3>
//               <p className="text-muted-foreground mb-4">Connect your data sources to generate tools with real data</p>
//               <Button
//                 onClick={() => router.push(`/${organizationSlug}/integrations`)}
//                 className="bg-primary text-primary-foreground"
//               >
//                 <Settings className="h-4 w-4 mr-2" />
//                 Setup Integrations
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )
//     }

//     return (
//       <Card className="bg-card border-border">
//         <CardHeader>
//           <CardTitle className="text-foreground flex items-center gap-2">
//             <Database className="h-5 w-5 text-accent" />
//             Connected Integrations
//             <Badge variant="secondary" className="ml-2">
//               {connectedIntegrations.length} Connected
//             </Badge>
//           </CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Select integrations to use real data in your tool
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {availableIntegrations.map((integration) => {
//             const isSelected = selectedIntegrations.includes(integration.id)
//             const connectedIntegration = connectedIntegrations.find(
//               (c) => c.provider.toLowerCase() === integration.id.toLowerCase(),
//             )

//             return (
//               <div
//                 key={integration.id}
//                 className={cn(
//                   "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
//                   isSelected ? "border-primary bg-primary/10" : "border-border bg-muted/30",
//                   "ring-1 ring-green-500/20", // Show it's connected
//                 )}
//                 onClick={() => {
//                   setSelectedIntegrations((prev) =>
//                     isSelected ? prev.filter((id) => id !== integration.id) : [...prev, integration.id],
//                   )
//                 }}
//               >
//                 <div className="flex items-start gap-3">
//                   <div className="text-2xl">{integration.icon}</div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="font-medium text-foreground">{integration.name}</span>
//                       <Badge variant="outline" className="text-xs text-green-600 border-green-600/20">
//                         Connected
//                       </Badge>
//                       {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
//                     {connectedIntegration && (
//                       <p className="text-xs text-green-600 mb-2">
//                         Last sync:{" "}
//                         {connectedIntegration.lastSyncAt
//                           ? new Date(connectedIntegration.lastSyncAt).toLocaleString()
//                           : "Never"}
//                       </p>
//                     )}
//                     <div className="flex flex-wrap gap-1">
//                       {integration.dataTypes.slice(0, 2).map((type) => (
//                         <Badge key={type} variant="secondary" className="text-xs bg-secondary/50">
//                           {type}
//                         </Badge>
//                       ))}
//                       {integration.dataTypes.length > 2 && (
//                         <Badge variant="secondary" className="text-xs bg-secondary/50">
//                           +{integration.dataTypes.length - 2}
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )
//           })}
//         </CardContent>
//       </Card>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
//                 <Sparkles className="h-5 w-5 text-primary-foreground" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-foreground">AI Business Tool Generator</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Create production-ready applications with real integrations
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               {isPolling && (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setIsPolling(false)}
//                   className="border-border bg-card hover:bg-accent"
//                 >
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Monitoring
//                 </Button>
//               )}
//               {showMetrics && generationStatus.metrics && (
//                 <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
//                   <Activity className="h-3 w-3 mr-1" />
//                   {generationStatus.metrics.estimatedValue} value
//                 </Badge>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-4 bg-muted/30 border border-border">
//             <TabsTrigger value="configure" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
//               <Settings className="h-4 w-4 mr-2" />
//               Configure
//             </TabsTrigger>
//             <TabsTrigger value="generate" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
//               <Wand2 className="h-4 w-4 mr-2" />
//               Generate
//             </TabsTrigger>
//             <TabsTrigger
//               value="chat"
//               className="data-[state=active]:bg-card data-[state=active]:text-foreground"
//               disabled={!generationStatus.chatId}
//             >
//               <MessageSquare className="h-4 w-4 mr-2" />
//               Chat & Refine
//             </TabsTrigger>
//             <TabsTrigger
//               value="preview"
//               className="data-[state=active]:bg-card data-[state=active]:text-foreground"
//               disabled={generationStatus.files.length === 0}
//             >
//               <Eye className="h-4 w-4 mr-2" />
//               Preview & Deploy
//             </TabsTrigger>
//           </TabsList>

//           {/* Configure Tab */}

//           <TabsContent value="configure" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="lg:col-span-1">
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Target className="h-5 w-5 text-primary" />
//                       Tool Configuration
//                     </CardTitle>
//                     <CardDescription className="text-muted-foreground">
//                       Define your business tool requirements and select integrations
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <form onSubmit={handleSubmitEnhanced} className="space-y-6">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="name" className="text-foreground">
//                             Tool Name *
//                           </Label>
//                           <Input
//                             id="name"
//                             value={formData.name}
//                             onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                             placeholder="e.g., Customer Analytics Dashboard"
//                             className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                             required
//                             disabled={generationStatus.status === "generating"}
//                           />
//                         </div>

//                         <div className="space-y-2">
//                           <Label htmlFor="category" className="text-foreground">
//                             Category *
//                           </Label>
//                           <Select
//                             value={formData.category}
//                             onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
//                             disabled={generationStatus.status === "generating"}
//                           >
//                             <SelectTrigger className="bg-input border-border text-foreground">
//                               <SelectValue placeholder="Select category" />
//                             </SelectTrigger>
//                             <SelectContent className="bg-card border-border">
//                               {TOOL_CATEGORIES.map((category) => {
//                                 const IconComponent = category.icon
//                                 return (
//                                   <SelectItem
//                                     key={category.value}
//                                     value={category.value}
//                                     className="text-foreground hover:bg-accent focus:bg-accent"
//                                   >
//                                     <div className="flex items-center gap-3">
//                                       <div
//                                         className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
//                                       >
//                                         <IconComponent className="h-4 w-4 text-white" />
//                                       </div>
//                                       <div>
//                                         <div className="font-medium">{category.label}</div>
//                                         <div className="text-xs text-muted-foreground">{category.description}</div>
//                                       </div>
//                                     </div>
//                                   </SelectItem>
//                                 )
//                               })}
//                             </SelectContent>
//                           </Select>
//                         </div>
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="description" className="text-foreground">
//                           Description *
//                         </Label>
//                         <Input
//                           id="description"
//                           value={formData.description}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                           placeholder="Brief description of what this tool does"
//                           className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                           required
//                           disabled={generationStatus.status === "generating"}
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor="requirements" className="text-foreground">
//                           Detailed Requirements *
//                         </Label>
//                         <Textarea
//                           id="requirements"
//                           value={formData.requirements}
//                           onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
//                           placeholder="Describe in detail what features and functionality you need. Include specific business logic, data inputs/outputs, user interactions, and any special requirements."
//                           className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
//                           required
//                           disabled={generationStatus.status === "generating"}
//                         />
//                         <div className="flex items-center justify-between text-xs">
//                           <span className="text-muted-foreground">{formData.requirements.length} characters</span>
//                           <span className="text-muted-foreground">💡 More detail = better results</span>
//                         </div>
//                       </div>

//                       <Button
//                         type="submit"
//                         disabled={!isFormValid || generationStatus.status === "generating"}
//                         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
//                       >
//                         {generationStatus.status === "generating" ? (
//                           <>
//                             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                             Generating Tool...
//                           </>
//                         ) : (
//                           <>
//                             <Rocket className="h-4 w-4 mr-2" />
//                             Generate Business Tool
//                           </>
//                         )}
//                       </Button>
//                     </form>
//                   </CardContent>
//                 </Card>
//               </div>

//               <div className="lg:col-span-1">{renderIntegrationSelection()}</div>
//             </div>
//           </TabsContent>

//           {/* Generate Tab */}
//           <TabsContent value="generate" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Generation Progress */}
//               <div className="space-y-6">
//                 {generationStatus.status !== "idle" && (
//                   <Card className="bg-card border-border">
//                     <CardHeader>
//                       <CardTitle className="text-foreground flex items-center gap-2">
//                         <Activity className="h-5 w-5 text-primary" />
//                         Generation Progress
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm text-foreground">{getCurrentPhase().label}</span>
//                           <span className="text-sm text-muted-foreground">{generationStatus.progress}%</span>
//                         </div>
//                         <Progress value={generationStatus.progress} className="h-2 bg-muted" />
//                       </div>

//                       <div className="grid grid-cols-2 gap-2">
//                         {GENERATION_PHASES.map((phase, index) => {
//                           const IconComponent = phase.icon
//                           const isActive = phase.id === generationStatus.step
//                           const isCompleted = generationStatus.progress > index * 16.67

//                           return (
//                             <div
//                               key={phase.id}
//                               className={cn(
//                                 "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
//                                 isActive && "bg-primary/20 border border-primary/30",
//                                 isCompleted && !isActive && "bg-green-500/20 border border-green-500/30",
//                                 !isActive && !isCompleted && "bg-muted/50 border border-border",
//                               )}
//                             >
//                               <IconComponent
//                                 className={cn(
//                                   "h-3 w-3",
//                                   isActive && phase.color + " animate-pulse",
//                                   isCompleted && !isActive && "text-green-400",
//                                   !isActive && !isCompleted && "text-muted-foreground",
//                                 )}
//                               />
//                               <span
//                                 className={cn(
//                                   isActive && phase.color,
//                                   isCompleted && !isActive && "text-green-400",
//                                   !isActive && !isCompleted && "text-muted-foreground",
//                                 )}
//                               >
//                                 {phase.label}
//                               </span>
//                             </div>
//                           )
//                         })}
//                       </div>

//                       {generationStatus.error && (
//                         <div className="flex items-center gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
//                           <AlertCircle className="h-4 w-4 text-destructive" />
//                           <span className="text-sm text-destructive">{generationStatus.error}</span>
//                         </div>
//                       )}

//                       {showMetrics && generationStatus.metrics && (
//                         <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-green-400">
//                               {generationStatus.metrics.components}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Components</div>
//                           </div>
//                           <div className="text-center">
//                             <div className="text-lg font-bold text-green-400">
//                               {generationStatus.metrics.linesOfCode}
//                             </div>
//                             <div className="text-xs text-muted-foreground">Lines of Code</div>
//                           </div>
//                         </div>
//                       )}
//                     </CardContent>
//                   </Card>
//                 )}
//               </div>

//               {/* Real-time Logs */}
//               <div>
//                 <Card className="bg-card border-border">
//                   <CardHeader>
//                     <CardTitle className="text-foreground flex items-center gap-2">
//                       <Monitor className="h-5 w-5 text-green-400" />
//                       Real-time Generation Logs
//                       {isPolling && (
//                         <div className="flex items-center gap-1 ml-auto">
//                           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                           <span className="text-xs text-green-400">Live</span>
//                         </div>
//                       )}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <ScrollArea className="h-96 w-full">
//                       <div className="space-y-1 font-mono text-xs">
//                         {streamingLogs.length === 0 ? (
//                           <div className="text-muted-foreground italic">Logs will appear here during generation...</div>
//                         ) : (
//                           streamingLogs.map((log, index) => (
//                             <div
//                               key={index}
//                               className={cn(
//                                 "p-2 rounded border-l-2",
//                                 log.includes("✅") && "border-green-500 bg-green-500/10 text-green-300",
//                                 log.includes("❌") && "border-red-500 bg-red-500/10 text-red-300",
//                                 log.includes("⚠️") && "border-yellow-500 bg-yellow-500/10 text-yellow-300",
//                                 log.includes("ℹ️") && "border-blue-500 bg-blue-500/10 text-blue-300",
//                                 !log.includes("✅") &&
//                                   !log.includes("❌") &&
//                                   !log.includes("⚠️") &&
//                                   !log.includes("ℹ️") &&
//                                   "border-border bg-muted/30 text-foreground",
//                               )}
//                             >
//                               {log}
//                             </div>
//                           ))
//                         )}
//                         <div ref={logsEndRef} />
//                       </div>
//                     </ScrollArea>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </TabsContent>

//           {/* Chat Tab */}
//           <TabsContent value="chat" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <MessageSquare className="h-5 w-5 text-primary" />
//                     Chat with AI Assistant
//                   </CardTitle>
//                   <CardDescription className="text-muted-foreground">
//                     Refine and improve your generated tool
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <ScrollArea className="h-96 w-full">
//                     <div className="space-y-4">
//                       {chatMessages.length === 0 ? (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                           <p>Start a conversation to refine your tool</p>
//                         </div>
//                       ) : (
//                         chatMessages.map((message) => (
//                           <div
//                             key={message.id}
//                             className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
//                           >
//                             <div
//                               className={cn(
//                                 "max-w-[80%] p-3 rounded-lg",
//                                 message.role === "user"
//                                   ? "bg-primary text-primary-foreground"
//                                   : "bg-muted text-foreground",
//                               )}
//                             >
//                               <p className="text-sm">{message.content}</p>
//                               <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
//                             </div>
//                           </div>
//                         ))
//                       )}
//                       <div ref={chatEndRef} />
//                     </div>
//                   </ScrollArea>

//                   <div className="flex gap-2">
//                     <Input
//                       value={chatInput}
//                       onChange={(e) => setChatInput(e.target.value)}
//                       placeholder="Ask for changes or improvements..."
//                       className="bg-input border-border text-foreground"
//                       onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
//                       disabled={isChatLoading}
//                     />
//                     <Button
//                       onClick={sendChatMessage}
//                       disabled={!chatInput.trim() || isChatLoading}
//                       className="bg-primary hover:bg-primary/90"
//                     >
//                       {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Chat History & Context */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Brain className="h-5 w-5 text-accent" />
//                     Context & Suggestions
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
//                     <div className="grid grid-cols-1 gap-2">
//                       {[
//                         "Add a dark mode toggle",
//                         "Improve the mobile layout",
//                         "Add data export functionality",
//                         "Enhance the color scheme",
//                         "Add loading states",
//                         "Improve accessibility",
//                       ].map((suggestion) => (
//                         <Button
//                           key={suggestion}
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setChatInput(suggestion)}
//                           className="justify-start text-left h-auto p-2 border-border hover:bg-accent"
//                         >
//                           <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
//                           <span className="text-xs">{suggestion}</span>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           {/* Preview Tab */}
//           <TabsContent value="preview" className="space-y-6 mt-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Preview */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Eye className="h-5 w-5 text-primary" />
//                     Live Preview
//                   </CardTitle>
//                   <CardDescription className="text-muted-foreground">
//                     Interactive preview of your generated tool
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   {generationStatus.demoUrl ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-foreground">Live Application</span>
//                         <div className="flex gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => window.open(generationStatus.demoUrl, "_blank")}
//                             className="border-border hover:bg-accent"
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             Open in New Tab
//                           </Button>
//                           {generationStatus.chatUrl && (
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => window.open(generationStatus.chatUrl, "_blank")}
//                               className="border-border hover:bg-accent"
//                             >
//                               <Globe className="h-4 w-4 mr-2" />
//                               View Chat
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                       <div className="border border-border rounded-lg overflow-hidden">
//                         <iframe
//                           src={generationStatus.demoUrl}
//                           className="w-full h-96 bg-background"
//                           title="Generated Tool Preview"
//                         />
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Preview will appear once generation is complete</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Files */}
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <FileText className="h-5 w-5 text-accent" />
//                     Generated Files ({generationStatus.files.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {generationStatus.files.length > 0 ? (
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 gap-2">
//                         {generationStatus.files.map((file, index) => (
//                           <div
//                             key={index}
//                             className={cn(
//                               "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
//                               selectedFile === file
//                                 ? "border-primary bg-primary/10"
//                                 : "border-border bg-muted/30 hover:bg-muted/50",
//                             )}
//                             onClick={() => setSelectedFile(file)}
//                           >
//                             <div className="flex items-center gap-3">
//                               <FileText className="h-4 w-4 text-muted-foreground" />
//                               <div>
//                                 <div className="text-sm font-medium text-foreground">{file.name}</div>
//                                 <div className="text-xs text-muted-foreground">
//                                   {file.type} • {(file.content.length / 1024).toFixed(1)}KB
//                                 </div>
//                               </div>
//                             </div>
//                             <div className="flex gap-1">
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   copyToClipboard(file.content)
//                                 }}
//                                 className="h-8 w-8 p-0 hover:bg-accent"
//                               >
//                                 <Copy className="h-3 w-3" />
//                               </Button>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={(e) => {
//                                   e.stopPropagation()
//                                   downloadFile(file)
//                                 }}
//                                 className="h-8 w-8 p-0 hover:bg-accent"
//                               >
//                                 <Download className="h-3 w-3" />
//                               </Button>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       {selectedFile && (
//                         <div className="space-y-2">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => copyToClipboard(selectedFile.content)}
//                               className="border-border hover:bg-accent"
//                             >
//                               <Copy className="h-4 w-4 mr-2" />
//                               Copy Code
//                             </Button>
//                           </div>
//                           <ScrollArea className="h-64 w-full">
//                             <pre className="text-xs bg-muted p-4 rounded-lg border border-border overflow-x-auto">
//                               <code className="text-foreground">{selectedFile.content}</code>
//                             </pre>
//                           </ScrollArea>
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <div className="text-center py-8 text-muted-foreground">
//                       <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                       <p>Generated files will appear here</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }




"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Sparkles,
  Target,
  Code2,
  Eye,
  FileText,
  CheckCircle,
  ExternalLink,
  Copy,
  Download,
  Brain,
  Rocket,
  Monitor,
  Globe,
  Lightbulb,
  Wand2,
  Database,
  Settings,
  MessageSquare,
  Send,
  Pause,
  Zap,
  Activity,
  BarChart3,
  Users,
  Calendar,
  ShoppingCart,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

import { liveGenerationEngine, type LiveGenerationUpdate } from "@/lib/live-generation-engine"

const TOOL_CATEGORIES = [
  {
    value: "dashboard",
    label: "Analytics Dashboard",
    description: "Data visualization and reporting tools",
    icon: BarChart3,
    color: "from-blue-500 to-cyan-500",
    examples: ["Sales Dashboard", "KPI Tracker", "Performance Analytics"],
  },
  {
    value: "crm",
    label: "Customer Management",
    description: "Customer relationship and contact management",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    examples: ["CRM System", "Contact Manager", "Lead Tracker"],
  },
  {
    value: "ecommerce",
    label: "E-commerce Tools",
    description: "Online store and inventory management",
    icon: ShoppingCart,
    color: "from-purple-500 to-violet-500",
    examples: ["Product Catalog", "Order Management", "Inventory Tracker"],
  },
  {
    value: "finance",
    label: "Financial Tools",
    description: "Accounting and financial management",
    icon: CreditCard,
    color: "from-orange-500 to-red-500",
    examples: ["Invoice Generator", "Expense Tracker", "Budget Planner"],
  },
  {
    value: "project",
    label: "Project Management",
    description: "Task and project tracking systems",
    icon: Calendar,
    color: "from-pink-500 to-rose-500",
    examples: ["Task Manager", "Project Tracker", "Team Planner"],
  },
  {
    value: "automation",
    label: "Workflow Automation",
    description: "Process automation and workflow tools",
    icon: Zap,
    color: "from-indigo-500 to-blue-500",
    examples: ["Email Automation", "Data Sync", "Report Generator"],
  },
]

const AVAILABLE_INTEGRATIONS = [
  {
    id: "supabase",
    name: "Supabase",
    description: "PostgreSQL database with real-time subscriptions",
    icon: "🗄️",
    type: "database",
    popular: true,
    dataTypes: ["Users", "Tables", "Real-time", "Auth"],
    setupTime: "2 min",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and subscription management",
    icon: "💳",
    type: "payment",
    popular: true,
    dataTypes: ["Payments", "Customers", "Subscriptions", "Invoices"],
    setupTime: "3 min",
  },
  {
    id: "resend",
    name: "Resend",
    description: "Email delivery and transactional emails",
    icon: "📧",
    type: "communication",
    popular: true,
    dataTypes: ["Emails", "Templates", "Analytics", "Webhooks"],
    setupTime: "1 min",
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "AI-powered text generation and analysis",
    icon: "🤖",
    type: "ai",
    popular: true,
    dataTypes: ["Text Generation", "Analysis", "Embeddings", "Chat"],
    setupTime: "2 min",
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Spreadsheet data integration and automation",
    icon: "📊",
    type: "data",
    dataTypes: ["Spreadsheets", "Charts", "Formulas", "Collaboration"],
    setupTime: "4 min",
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and notifications",
    icon: "💬",
    type: "communication",
    dataTypes: ["Messages", "Channels", "Users", "Files"],
    setupTime: "3 min",
  },
]

const GENERATION_PHASES = [
  { id: "analyzing", label: "Analyzing Requirements", icon: Brain, color: "text-blue-400" },
  { id: "designing", label: "Designing UI Components", icon: Wand2, color: "text-purple-400" },
  { id: "integrating", label: "Setting up Integrations", icon: Database, color: "text-green-400" },
  { id: "generating", label: "Generating Code", icon: Code2, color: "text-orange-400" },
  { id: "testing", label: "Testing & Optimization", icon: Activity, color: "text-cyan-400" },
  { id: "deploying", label: "Preparing Deployment", icon: Rocket, color: "text-pink-400" },
]

interface ToolFile {
  name: string
  content: string
  type?: string
  size?: number
}

interface GenerationStatus {
  status: "idle" | "analyzing" | "generating" | "integrating" | "completed" | "error"
  progress: number
  step: string
  message?: string
  error?: string
  files: ToolFile[]
  demoUrl?: string
  chatUrl?: string
  chatId?: string
  currentPhase: "setup" | "ui" | "integration" | "deploy"
  deploymentUrl?: string
  metrics?: {
    linesOfCode: number
    components: number
    apiEndpoints: number
    estimatedValue: string
  }
}

interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  type?: "message" | "code" | "preview"
}

interface CreateToolInterfaceProps {
  organizationSlug: string
}

export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
  // Core state
  const [activeTab, setActiveTab] = useState("configure")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    requirements: "",
  })

  // Generation state
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: "idle",
    progress: 0,
    step: "ready",
    files: [],
    currentPhase: "setup",
  })

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  // UI state
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
  const [streamingLogs, setStreamingLogs] = useState<string[]>([])
  const [isPolling, setIsPolling] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

  const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([])
  const [integrationTests, setIntegrationTests] = useState<any>(null)

  const { toast } = useToast()
  const router = useRouter()
  const logsEndRef = useRef<HTMLDivElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const pollingRef = useRef<NodeJS.Timeout>()

  const addLog = useCallback((message: string, type: "info" | "success" | "error" | "warning" = "info") => {
    const timestamp = new Date().toLocaleTimeString()
    const icons = {
      info: "ℹ️",
      success: "✅",
      error: "❌",
      warning: "⚠️",
    }
    const formattedMessage = `[${timestamp}] ${icons[type]} ${message}`

    setStreamingLogs((prev) => [...prev.slice(-49), formattedMessage]) // Keep last 50 logs

    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [])

  const startPolling = useCallback(
    (toolId: string) => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }

      setIsPolling(true)
      addLog("🔄 Starting real-time monitoring...", "info")

      pollingRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/organizations/${organizationSlug}/tools/${toolId}/status`)
          if (!response.ok) throw new Error(`Status check failed: ${response.status}`)

          const status = await response.json()

          setGenerationStatus((prev) => ({
            ...prev,
            status: status.status,
            progress: status.progress || 0,
            step: status.step || "unknown",
            message: status.message,
            error: status.error,
            files: status.files || [],
            demoUrl: status.demoUrl,
            chatUrl: status.chatUrl,
            chatId: status.chatId,
            metrics: status.metrics,
          }))

          if (status.status === "completed") {
            addLog("🎉 Tool generation completed successfully!", "success")
            setIsPolling(false)
            setShowMetrics(true)
            setActiveTab("preview")
            if (pollingRef.current) clearInterval(pollingRef.current)
          } else if (status.status === "error") {
            addLog(`❌ Generation faileda: ${status.error}`, "error")
            setIsPolling(false)
            if (pollingRef.current) clearInterval(pollingRef.current)
          } else {
            addLog(`📊 ${status.step} - ${status.progress}%`, "info")
          }
        } catch (error) {
          addLog(`💥 Monitoring error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
        }
      }, 2000)
    },
    [organizationSlug, addLog],
  )

  const startRealTimeGeneration = useCallback(async () => {
    if (!formData.name || !formData.description || !formData.category || !formData.requirements) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating.",
        variant: "destructive",
      })
      return
    }

    setGenerationStatus({
      status: "analyzing",
      progress: 0,
      step: "analyzing",
      files: [],
      currentPhase: "setup",
    })

    setStreamingLogs([])
    setActiveTab("generate")
    addLog("🚀 Starting real-time tool generation...", "info")

    try {
      await liveGenerationEngine.generateBusinessTool(
        {
          toolName: formData.name,
          requirements: formData.requirements,
          category: formData.category,
          userEmail: "", // Could be populated from user context
        },
        (update: LiveGenerationUpdate) => {
          switch (update.type) {
            case "progress":
              setGenerationStatus((prev) => ({
                ...prev,
                status: update.step === "completed" ? "completed" : "generating",
                progress: update.progress || 0,
                step: update.step || "generating",
                message: update.message,
              }))
              if (update.message) {
                addLog(update.message, "info")
              }
              break

            case "log":
              if (update.message) {
                addLog(update.message, "info")
              }
              break

            case "file_created":
              if (update.file) {
                setGenerationStatus((prev) => ({
                  ...prev,
                  files: [...prev.files, update.file!],
                  progress: update.progress || prev.progress,
                }))
                addLog(`📄 Created ${update.file.name}`, "success")
              }
              break

            case "completed":
              if (update.result) {
                setGenerationStatus((prev) => ({
                  ...prev,
                  status: "completed",
                  progress: 100,
                  step: "completed",
                  files: update.result!.files,
                  demoUrl: update.result!.demoUrl,
                  chatUrl: update.result!.chatUrl,
                  chatId: update.result!.chatId,
                  metrics: update.result!.metrics,
                }))
                setShowMetrics(true)
                setActiveTab("preview")
                addLog("🎉 Generation completed successfully!", "success")
                toast({
                  title: "Tool Generated!",
                  description: "Your business tool has been generated successfully.",
                })
              }
              break

            case "error":
              setGenerationStatus((prev) => ({
                ...prev,
                status: "error",
                message: update.error || "An error occurred during generation",
              }))
              if (update.error) {
                addLog(`❌ Error: ${update.error}`, "error")
              }
              toast({
                title: "Generation Failedb",
                description: update.error || "An error occurred during generation",
                variant: "destructive",
              })
              break
          }
        },
      )
    } catch (error) {
      console.error("Generation error:", error)
      setGenerationStatus((prev) => ({
        ...prev,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      }))
      addLog(`❌ Generation failedc: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      toast({
        title: "Generation Failedd",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }, [formData, toast, addLog])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await startRealTimeGeneration()
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !generationStatus.chatId) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch(`/api/organizations/${organizationSlug}/tools/${generationStatus.chatId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      })

      if (!response.ok) throw new Error("Failed to send message")

      const result = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.message || "I've updated your tool based on your feedback.",
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])

      // Update generation status if new files are available
      if (result.files) {
        setGenerationStatus((prev) => ({
          ...prev,
          files: result.files,
          demoUrl: result.demoUrl || prev.demoUrl,
        }))
      }

      addLog("💬 Chat message processed successfully", "success")
    } catch (error) {
      addLog(`💥 Chat error: ${error instanceof Error ? error.message : "Unknown"}`, "error")
      toast({
        title: "Chat Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsChatLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({ title: "Copied!", description: "Content copied to clipboard." })
    } catch (error) {
      toast({ title: "Copy Failed", description: "Failed to copy content.", variant: "destructive" })
    }
  }

  const downloadFile = (file: ToolFile) => {
    const blob = new Blob([file.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({ title: "Downloaded!", description: `${file.name} has been downloaded.` })
  }

  const getCurrentPhase = () => {
    return GENERATION_PHASES.find((phase) => phase.id === generationStatus.step) || GENERATION_PHASES[0]
  }

  const isFormValid = formData.name && formData.description && formData.category && formData.requirements

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

  useEffect(() => {
    if (organizationSlug) {
      fetchConnectedIntegrations()
    }
  }, [organizationSlug])

  const fetchConnectedIntegrations = async () => {
    try {
      const response = await fetch(`/api/organizations/${organizationSlug}/integrations`)
      if (response.ok) {
        const data = await response.json()
        setConnectedIntegrations(data.integrations || [])
        addLog(`Found ${data.integrations?.length || 0} connected integrations`, "info")
      }
    } catch (error) {
      addLog("Failed to fetch connected integrations", "error")
    }
  }

  const generateTool = async () => {
    if (!formData.name.trim() || !formData.requirements.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both tool name and requirements.",
        variant: "destructive",
      })
      return
    }

    // Test integrations before generation
    if (selectedIntegrations.length > 0) {
      addLog("Testing selected integrations...", "info")
      try {
        const testResponse = await fetch(`/api/organizations/${organizationSlug}/integrations/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ integrations: selectedIntegrations }),
        })

        if (testResponse.ok) {
          const testResults = await testResponse.json()
          setIntegrationTests(testResults)

          if (!testResults.allPassed) {
            addLog(`Integration test warnings: ${testResults.failures.join(", ")}`, "warning")
          } else {
            addLog("All integration tests passed ✅", "success")
          }
        }
      } catch (error) {
        addLog("Integration testing failed", "error")
      }
    }

    setGenerationStatus({
      status: "analyzing",
      progress: 0,
      step: "analyzing",
      files: [],
      currentPhase: "setup",
    })

    setActiveTab("generate")
    setStreamingLogs([])

    try {
      // Use the enhanced generation engine with real data
      await liveGenerationEngine.generateBusinessToolWithRealData(
        {
          toolName: formData.name,
          requirements: formData.requirements,
          category: formData.category,
          userEmail: "user@example.com", // Get from auth context
        },
        organizationSlug,
        selectedIntegrations,
        handleGenerationUpdate,
      )
    } catch (error) {
      addLog(`Generation failede: ${error}`, "error")
      setGenerationStatus((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }))
    }
  }

  const handleGenerationUpdate = (update: LiveGenerationUpdate) => {
    switch (update.type) {
      case "progress":
        setGenerationStatus((prev) => ({
          ...prev,
          status: update.step === "completed" ? "completed" : "generating",
          progress: update.progress || 0,
          step: update.step || "generating",
          message: update.message,
        }))
        if (update.message) {
          addLog(update.message, "info")
        }
        break

      case "log":
        if (update.message) {
          addLog(update.message, "info")
        }
        break

      case "file_created":
        if (update.file) {
          setGenerationStatus((prev) => ({
            ...prev,
            files: [...prev.files, update.file!],
            progress: update.progress || prev.progress,
          }))
          addLog(`📄 Created ${update.file.name}`, "success")
        }
        break

      case "completed":
        if (update.result) {
          setGenerationStatus((prev) => ({
            ...prev,
            status: "completed",
            progress: 100,
            step: "completed",
            files: update.result!.files,
            demoUrl: update.result!.demoUrl,
            chatUrl: update.result!.chatUrl,
            chatId: update.result!.chatId,
            metrics: update.result!.metrics,
          }))
          setShowMetrics(true)
          setActiveTab("preview")
          addLog("🎉 Generation completed successfully!", "success")
          toast({
            title: "Tool Generated!",
            description: "Your business tool has been generated successfully.",
          })
        }
        break

      case "error":
        setGenerationStatus((prev) => ({
          ...prev,
          status: "error",
          message: update.error || "An error occurred during generation",
        }))
        if (update.error) {
          addLog(`❌ Error: ${update.error}`, "error")
        }
        toast({
          title: "Generation Failedf",
          description: update.error || "An error occurred during generation",
          variant: "destructive",
        })
        break
    }
  }

  const handleSubmitEnhanced = async (e: React.FormEvent) => {
    e.preventDefault()
    await generateTool()
  }

  const renderIntegrationSelection = () => {
    const availableIntegrations = AVAILABLE_INTEGRATIONS.filter((integration) =>
      connectedIntegrations.some((connected) => connected.provider.toLowerCase() === integration.id.toLowerCase()),
    )

    if (availableIntegrations.length === 0) {
      return (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Database className="h-5 w-5 text-accent" />
              Integrations
            </CardTitle>
            <CardDescription className="text-muted-foreground">No integrations connected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Integrations Connected</h3>
              <p className="text-muted-foreground mb-4">Connect your data sources to generate tools with real data</p>
              <Button
                onClick={() => router.push(`/${organizationSlug}/integrations`)}
                className="bg-primary text-primary-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                Setup Integrations
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-accent" />
            Connected Integrations
            <Badge variant="secondary" className="ml-2">
              {connectedIntegrations.length} Connected
            </Badge>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Select integrations to use real data in your tool
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableIntegrations.map((integration) => {
            const isSelected = selectedIntegrations.includes(integration.id)
            const connectedIntegration = connectedIntegrations.find(
              (c) => c.provider.toLowerCase() === integration.id.toLowerCase(),
            )

            return (
              <div
                key={integration.id}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50",
                  isSelected ? "border-primary bg-primary/10" : "border-border bg-muted/30",
                  "ring-1 ring-green-500/20", // Show it's connected
                )}
                onClick={() => {
                  setSelectedIntegrations((prev) =>
                    isSelected ? prev.filter((id) => id !== integration.id) : [...prev, integration.id],
                  )
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{integration.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{integration.name}</span>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600/20">
                        Connected
                      </Badge>
                      {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{integration.description}</p>
                    {connectedIntegration && (
                      <p className="text-xs text-green-600 mb-2">
                        Last sync:{" "}
                        {connectedIntegration.lastSyncAt
                          ? new Date(connectedIntegration.lastSyncAt).toLocaleString()
                          : "Never"}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {integration.dataTypes.slice(0, 2).map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs bg-secondary/50">
                          {type}
                        </Badge>
                      ))}
                      {integration.dataTypes.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-secondary/50">
                          +{integration.dataTypes.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Business Tool Generator</h1>
                <p className="text-sm text-muted-foreground">
                  Create production-ready applications with real integrations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isPolling && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPolling(false)}
                  className="border-border bg-card hover:bg-accent"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Monitoring
                </Button>
              )}
              {showMetrics && generationStatus.metrics && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                  <Activity className="h-3 w-3 mr-1" />
                  {generationStatus.metrics.estimatedValue} value
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted/30 border border-border">
            <TabsTrigger value="configure" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
              <Wand2 className="h-4 w-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
              disabled={!generationStatus.chatId}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat & Refine
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-card data-[state=active]:text-foreground"
              disabled={generationStatus.files.length === 0}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview & Deploy
            </TabsTrigger>
          </TabsList>

          {/* Configure Tab */}

          <TabsContent value="configure" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-1">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Tool Configuration
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Define your business tool requirements and select integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmitEnhanced} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-foreground">
                            Tool Name *
                          </Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Customer Analytics Dashboard"
                            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                            required
                            disabled={generationStatus.status === "generating"}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-foreground">
                            Category *
                          </Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                            disabled={generationStatus.status === "generating"}
                          >
                            <SelectTrigger className="bg-input border-border text-foreground">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              {TOOL_CATEGORIES.map((category) => {
                                const IconComponent = category.icon
                                return (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
                                    className="text-foreground hover:bg-accent focus:bg-accent"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
                                      >
                                        <IconComponent className="h-4 w-4 text-white" />
                                      </div>
                                      <div>
                                        <div className="font-medium">{category.label}</div>
                                        <div className="text-xs text-muted-foreground">{category.description}</div>
                                      </div>
                                    </div>
                                  </SelectItem>
                                )
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-foreground">
                          Description *
                        </Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of what this tool does"
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                          required
                          disabled={generationStatus.status === "generating"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="requirements" className="text-foreground">
                          Detailed Requirements *
                        </Label>
                        <Textarea
                          id="requirements"
                          value={formData.requirements}
                          onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
                          placeholder="Describe in detail what features and functionality you need. Include specific business logic, data inputs/outputs, user interactions, and any special requirements."
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
                          required
                          disabled={generationStatus.status === "generating"}
                        />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{formData.requirements.length} characters</span>
                          <span className="text-muted-foreground">💡 More detail = better results</span>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={!isFormValid || generationStatus.status === "generating"}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
                      >
                        {generationStatus.status === "generating" ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating Tool...
                          </>
                        ) : (
                          <>
                            <Rocket className="h-4 w-4 mr-2" />
                            Generate Business Tool
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">{renderIntegrationSelection()}</div>
            </div>
          </TabsContent>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Generation Progress */}
              <div className="space-y-6">
                {generationStatus.status !== "idle" && (
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Generation Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground">{getCurrentPhase().label}</span>
                          <span className="text-sm text-muted-foreground">{generationStatus.progress}%</span>
                        </div>
                        <Progress value={generationStatus.progress} className="h-2 bg-muted" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {GENERATION_PHASES.map((phase, index) => {
                          const IconComponent = phase.icon
                          const isActive = phase.id === generationStatus.step
                          const isCompleted = generationStatus.progress > index * 16.67

                          return (
                            <div
                              key={phase.id}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg text-xs transition-all",
                                isActive && "bg-primary/20 border border-primary/30",
                                isCompleted && !isActive && "bg-green-500/20 border border-green-500/30",
                                !isActive && !isCompleted && "bg-muted/50 border border-border",
                              )}
                            >
                              <IconComponent
                                className={cn(
                                  "h-3 w-3",
                                  isActive && phase.color + " animate-pulse",
                                  isCompleted && !isActive && "text-green-400",
                                  !isActive && !isCompleted && "text-muted-foreground",
                                )}
                              />
                              <span
                                className={cn(
                                  isActive && phase.color,
                                  isCompleted && !isActive && "text-green-400",
                                  !isActive && !isCompleted && "text-muted-foreground",
                                )}
                              >
                                {phase.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>

                      {generationStatus.error && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">{generationStatus.error}</span>
                        </div>
                      )}

                      {showMetrics && generationStatus.metrics && (
                        <div className="grid grid-cols-2 gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                              {generationStatus.metrics.components}
                            </div>
                            <div className="text-xs text-muted-foreground">Components</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                              {generationStatus.metrics.linesOfCode}
                            </div>
                            <div className="text-xs text-muted-foreground">Lines of Code</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Real-time Logs */}
              <div>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-green-400" />
                      Real-time Generation Logs
                      {isPolling && (
                        <div className="flex items-center gap-1 ml-auto">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Live</span>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-96 w-full">
                      <div className="space-y-1 font-mono text-xs">
                        {streamingLogs.length === 0 ? (
                          <div className="text-muted-foreground italic">Logs will appear here during generation...</div>
                        ) : (
                          streamingLogs.map((log, index) => (
                            <div
                              key={index}
                              className={cn(
                                "p-2 rounded border-l-2",
                                log.includes("✅") && "border-green-500 bg-green-500/10 text-green-300",
                                log.includes("❌") && "border-red-500 bg-red-500/10 text-red-300",
                                log.includes("⚠️") && "border-yellow-500 bg-yellow-500/10 text-yellow-300",
                                log.includes("ℹ️") && "border-blue-500 bg-blue-500/10 text-blue-300",
                                !log.includes("✅") &&
                                  !log.includes("❌") &&
                                  !log.includes("⚠️") &&
                                  !log.includes("ℹ️") &&
                                  "border-border bg-muted/30 text-foreground",
                              )}
                            >
                              {log}
                            </div>
                          ))
                        )}
                        <div ref={logsEndRef} />
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    Chat with AI Assistant
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Refine and improve your generated tool
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="h-96 w-full">
                    <div className="space-y-4">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Start a conversation to refine your tool</p>
                        </div>
                      ) : (
                        chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] p-3 rounded-lg",
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-foreground",
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask for changes or improvements..."
                      className="bg-input border-border text-foreground"
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      disabled={isChatLoading}
                    />
                    <Button
                      onClick={sendChatMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chat History & Context */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent" />
                    Context & Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Quick Actions</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        "Add a dark mode toggle",
                        "Improve the mobile layout",
                        "Add data export functionality",
                        "Enhance the color scheme",
                        "Add loading states",
                        "Improve accessibility",
                      ].map((suggestion) => (
                        <Button
                          key={suggestion}
                          variant="outline"
                          size="sm"
                          onClick={() => setChatInput(suggestion)}
                          className="justify-start text-left h-auto p-2 border-border hover:bg-accent"
                        >
                          <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0" />
                          <span className="text-xs">{suggestion}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preview */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Live Preview
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Interactive preview of your generated tool
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {generationStatus.demoUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">Live Application</span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(generationStatus.demoUrl, "_blank")}
                            className="border-border hover:bg-accent"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open in New Tab
                          </Button>
                          {generationStatus.chatUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(generationStatus.chatUrl, "_blank")}
                              className="border-border hover:bg-accent"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              View Chat
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <iframe
                          src={generationStatus.demoUrl}
                          className="w-full h-96 bg-background"
                          title="Generated Tool Preview"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Preview will appear once generation is complete</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Files */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-accent" />
                    Generated Files ({generationStatus.files.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generationStatus.files.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2">
                        {generationStatus.files.map((file, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                              selectedFile === file
                                ? "border-primary bg-primary/10"
                                : "border-border bg-muted/30 hover:bg-muted/50",
                            )}
                            onClick={() => setSelectedFile(file)}
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium text-foreground">{file.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {file.type} • {(file.content.length / 1024).toFixed(1)}KB
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(file.content)
                                }}
                                className="h-8 w-8 p-0 hover:bg-accent"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  downloadFile(file)
                                }}
                                className="h-8 w-8 p-0 hover:bg-accent"
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedFile && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(selectedFile.content)}
                              className="border-border hover:bg-accent"
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Code
                            </Button>
                          </div>
                          <ScrollArea className="h-64 w-full">
                            <pre className="text-xs bg-muted p-4 rounded-lg border border-border overflow-x-auto">
                              <code className="text-foreground">{selectedFile.content}</code>
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Generated files will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
