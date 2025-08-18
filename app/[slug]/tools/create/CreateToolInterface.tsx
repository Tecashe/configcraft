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





//THIS HAS THE DARK-THEMED UI



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
// import { Badge } from "@/components/ui/badge"
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
//   History,
//   Lightbulb,
//   Clock,
//   Wand2,
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
//     examples: ["Sales Dashboard", "KPI Tracker", "Performance Analytics"],
//   },
//   {
//     value: "form",
//     label: "Form Builder",
//     description: "Data collection and form management",
//     icon: FileText,
//     color: "from-green-500 to-emerald-500",
//     examples: ["Contact Forms", "Survey Builder", "Application Forms"],
//   },
//   {
//     value: "calculator",
//     label: "Calculator Tool",
//     description: "Computation and calculation engines",
//     icon: Cpu,
//     color: "from-purple-500 to-violet-500",
//     examples: ["ROI Calculator", "Loan Calculator", "Price Estimator"],
//   },
//   {
//     value: "tracker",
//     label: "Progress Tracker",
//     description: "Activity and progress monitoring",
//     icon: Target,
//     color: "from-orange-500 to-red-500",
//     examples: ["Project Tracker", "Goal Monitor", "Time Tracker"],
//   },
//   {
//     value: "generator",
//     label: "Content Generator",
//     description: "Automated content and data generation",
//     icon: Sparkles,
//     color: "from-pink-500 to-rose-500",
//     examples: ["Report Generator", "Invoice Creator", "Template Builder"],
//   },
//   {
//     value: "analyzer",
//     label: "Data Analyzer",
//     description: "Advanced data analysis and insights",
//     icon: Brain,
//     color: "from-indigo-500 to-blue-500",
//     examples: ["Data Insights", "Trend Analysis", "Performance Review"],
//   },
// ]

// const GENERATION_STEPS = [
//   { id: "analyzing", label: "Analyzing Requirements", icon: Brain, description: "Understanding your needs" },
//   { id: "designing", label: "Designing Architecture", icon: Layers, description: "Planning the structure" },
//   { id: "generating", label: "Generating Code", icon: Code2, description: "Creating the application" },
//   { id: "optimizing", label: "Optimizing Performance", icon: Zap, description: "Enhancing efficiency" },
//   { id: "finalizing", label: "Finalizing Application", icon: CheckCircle, description: "Adding final touches" },
//   { id: "completed", label: "Ready to Deploy", icon: Rocket, description: "Your tool is ready!" },
// ]

// interface ToolFile {
//   name: string
//   content: string
//   type?: string
//   size?: number
// }

// interface GenerationStatus {
//   status: "idle" | "analyzing" | "generating" | "completed" | "error"
//   progress: number
//   step: string
//   message?: string
//   error?: string
//   files: ToolFile[]
//   demoUrl?: string
//   chatUrl?: string
//   chatId?: string
// }

// interface RequirementsAnalysis {
//   complexity: string
//   estimatedHours: number
//   suggestedTechnologies: string[]
//   features: string[]
//   followUpQuestions: string[]
//   v0Prompt: string
// }

// interface CreateToolInterfaceProps {
//   organizationSlug: string
// }

// export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
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

//   const [analysis, setAnalysis] = useState<RequirementsAnalysis | null>(null)
//   const [isAnalyzing, setIsAnalyzing] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
//   const [isPolling, setIsPolling] = useState(false)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [toolId, setToolId] = useState<string | null>(null)
//   const [savedDrafts, setSavedDrafts] = useState<any[]>([])
//   const [showTemplates, setShowTemplates] = useState(false)

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

//   const analyzeRequirements = async () => {
//     if (!formData.requirements || formData.requirements.length < 20) {
//       toast({
//         title: "Requirements Too Short",
//         description: "Please provide at least 20 characters of requirements for analysis.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsAnalyzing(true)
//     addLog("🔍 Analyzing your requirements...")

//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/tools/analyze`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           requirements: formData.requirements,
//           context: [formData.category, formData.description],
//         }),
//       })

//       if (!response.ok) throw new Error("Analysis failed")

//       const result = await response.json()
//       setAnalysis(result.analysis)
//       addLog("✅ Requirements analysis completed")

//       toast({
//         title: "Analysis Complete",
//         description: "Your requirements have been analyzed. Review the suggestions below.",
//       })
//     } catch (error) {
//       addLog("❌ Analysis failed")
//       toast({
//         title: "Analysis Failed",
//         description: "Could not analyze requirements. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsAnalyzing(false)
//     }
//   }

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//     // Auto-save draft every 5 seconds
//     if (field === "requirements" && value.length > 50) {
//       saveDraft()
//     }
//   }

//   const saveDraft = async () => {
//     if (!formData.name || !formData.requirements) return

//     try {
//       const response = await fetch(`/api/organizations/${organizationSlug}/tools/drafts`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (response.ok) {
//         addLog("💾 Draft saved automatically")
//       }
//     } catch (error) {
//       console.error("Draft save failed:", error)
//     }
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
//       }, 2000)
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
//       status: "analyzing",
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
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Enhanced Header with better dark theme integration */}
//       <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <Sparkles className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-foreground">AI Tool Generator</h1>
//                 <p className="text-sm text-muted-foreground">Create professional business tools with AI</p>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
//                 <History className="h-4 w-4 mr-2" />
//                 Templates
//               </Button>
//               {isPolling && (
//                 <Button variant="outline" size="sm" onClick={stopPolling}>
//                   <Pause className="h-4 w-4 mr-2" />
//                   Pause Monitoring
//                 </Button>
//               )}
//               {generationStatus.status === "completed" && generationStatus.demoUrl && (
//                 <Button variant="outline" size="sm" onClick={() => window.open(generationStatus.demoUrl, "_blank")}>
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
//           {/* Left Column - Enhanced Configuration */}
//           <div className="space-y-6">
//             {/* Tool Configuration with better dark theme */}
//             <Card className="bg-card border-border">
//               <CardHeader>
//                 <CardTitle className="text-foreground flex items-center gap-2">
//                   <Target className="h-5 w-5 text-blue-400" />
//                   Tool Configuration
//                 </CardTitle>
//                 <CardDescription className="text-muted-foreground">
//                   Define your business tool requirements and specifications
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="name" className="text-foreground">
//                         Tool Name *
//                       </Label>
//                       <Input
//                         id="name"
//                         value={formData.name}
//                         onChange={(e) => handleInputChange("name", e.target.value)}
//                         placeholder="e.g., Customer Analytics Dashboard"
//                         className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                         required
//                         disabled={generationStatus.status === "generating"}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="category" className="text-foreground">
//                         Category *
//                       </Label>
//                       <Select
//                         value={formData.category}
//                         onValueChange={(value) => handleInputChange("category", value)}
//                         disabled={generationStatus.status === "generating"}
//                       >
//                         <SelectTrigger className="bg-input border-border text-foreground">
//                           <SelectValue placeholder="Select category" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-popover border-border">
//                           {TOOL_CATEGORIES.map((category) => {
//                             const IconComponent = category.icon
//                             return (
//                               <SelectItem
//                                 key={category.value}
//                                 value={category.value}
//                                 className="text-foreground hover:bg-accent focus:bg-accent"
//                               >
//                                 <div className="flex items-center gap-3">
//                                   <div
//                                     className={`w-8 h-8 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
//                                   >
//                                     <IconComponent className="h-4 w-4 text-white" />
//                                   </div>
//                                   <div>
//                                     <div className="font-medium">{category.label}</div>
//                                     <div className="text-xs text-muted-foreground">{category.description}</div>
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
//                     <Label htmlFor="description" className="text-foreground">
//                       Description *
//                     </Label>
//                     <Input
//                       id="description"
//                       value={formData.description}
//                       onChange={(e) => handleInputChange("description", e.target.value)}
//                       placeholder="Brief description of what this tool does"
//                       className="bg-input border-border text-foreground placeholder:text-muted-foreground"
//                       required
//                       disabled={generationStatus.status === "generating"}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <Label htmlFor="requirements" className="text-foreground">
//                         Detailed Requirements *
//                       </Label>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         onClick={analyzeRequirements}
//                         disabled={isAnalyzing || !formData.requirements || formData.requirements.length < 20}
//                         className="border-border bg-transparent"
//                       >
//                         {isAnalyzing ? (
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                         ) : (
//                           <Wand2 className="h-4 w-4 mr-2" />
//                         )}
//                         Analyze
//                       </Button>
//                     </div>
//                     <Textarea
//                       id="requirements"
//                       value={formData.requirements}
//                       onChange={(e) => handleInputChange("requirements", e.target.value)}
//                       placeholder="Describe in detail what features and functionality you need. Include specific business logic, data inputs/outputs, user interactions, and any special requirements."
//                       className="bg-input border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-none"
//                       required
//                       disabled={generationStatus.status === "generating"}
//                     />
//                     <div className="flex items-center justify-between text-xs">
//                       <span className="text-muted-foreground">{formData.requirements.length} characters</span>
//                       <span className="text-muted-foreground">💡 More detail = better results</span>
//                     </div>
//                   </div>

//                   {analysis && (
//                     <Card className="bg-muted/50 border-border">
//                       <CardHeader className="pb-3">
//                         <CardTitle className="text-sm flex items-center gap-2">
//                           <Lightbulb className="h-4 w-4 text-yellow-500" />
//                           Requirements Analysis
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-4">
//                         <div className="grid grid-cols-2 gap-4">
//                           <div>
//                             <Label className="text-xs text-muted-foreground">Complexity</Label>
//                             <Badge variant="secondary" className="mt-1">
//                               {analysis.complexity}
//                             </Badge>
//                           </div>
//                           <div>
//                             <Label className="text-xs text-muted-foreground">Estimated Time</Label>
//                             <div className="flex items-center gap-1 mt-1">
//                               <Clock className="h-3 w-3 text-muted-foreground" />
//                               <span className="text-sm">{analysis.estimatedHours}h</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div>
//                           <Label className="text-xs text-muted-foreground">Suggested Technologies</Label>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {analysis.suggestedTechnologies.map((tech) => (
//                               <Badge key={tech} variant="outline" className="text-xs">
//                                 {tech}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>

//                         <div>
//                           <Label className="text-xs text-muted-foreground">Key Features</Label>
//                           <ul className="text-xs text-muted-foreground mt-1 space-y-1">
//                             {analysis.features.slice(0, 3).map((feature, index) => (
//                               <li key={index} className="flex items-center gap-2">
//                                 <CheckCircle className="h-3 w-3 text-green-500" />
//                                 {feature}
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   )}

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

//             {/* Enhanced Generation Progress */}
//             {generationStatus.status !== "idle" && (
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Zap className="h-5 w-5 text-yellow-400" />
//                     Generation Progress
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-foreground">{getCurrentStep().label}</span>
//                       <span className="text-sm text-muted-foreground">{generationStatus.progress}%</span>
//                     </div>
//                     <Progress value={generationStatus.progress} className="h-2" />
//                     <p className="text-xs text-muted-foreground">{getCurrentStep().description}</p>
//                   </div>

//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {GENERATION_STEPS.map((step, index) => {
//                       const IconComponent = step.icon
//                       const isActive = step.id === generationStatus.step
//                       const isCompleted = index < getStepIndex()

//                       return (
//                         <div
//                           key={step.id}
//                           className={cn(
//                             "flex items-center gap-2 p-2 rounded-lg text-xs transition-all border",
//                             isActive && "bg-blue-500/20 border-blue-500/30",
//                             isCompleted && "bg-green-500/20 border-green-500/30",
//                             !isActive && !isCompleted && "bg-muted/50 border-border",
//                           )}
//                         >
//                           <IconComponent
//                             className={cn(
//                               "h-3 w-3",
//                               isActive && "text-blue-400 animate-pulse",
//                               isCompleted && "text-green-400",
//                               !isActive && !isCompleted && "text-muted-foreground",
//                             )}
//                           />
//                           <span
//                             className={cn(
//                               isActive && "text-blue-300",
//                               isCompleted && "text-green-300",
//                               !isActive && !isCompleted && "text-muted-foreground",
//                             )}
//                           >
//                             {step.label}
//                           </span>
//                         </div>
//                       )
//                     })}
//                   </div>

//                   {generationStatus.error && (
//                     <div className="flex items-center gap-2 p-3 bg-destructive/20 border border-destructive/30 rounded-lg">
//                       <AlertCircle className="h-4 w-4 text-destructive" />
//                       <span className="text-sm text-destructive">{generationStatus.error}</span>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}
//           </div>

//           {/* Right Column - Enhanced Results & Logs */}
//           <div className="space-y-6">
//             {/* Enhanced Real-time Logs */}
//             <Card className="bg-card border-border">
//               <CardHeader>
//                 <CardTitle className="text-foreground flex items-center gap-2">
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
//                       <div className="text-muted-foreground italic">Logs will appear here during generation...</div>
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
//                               "border-border bg-muted/30 text-foreground",
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

//             {/* Enhanced Generated Files & Preview */}
//             {(generationStatus.files.length > 0 || generationStatus.demoUrl) && (
//               <Card className="bg-card border-border">
//                 <CardHeader>
//                   <CardTitle className="text-foreground flex items-center gap-2">
//                     <Code2 className="h-5 w-5 text-purple-400" />
//                     Generated Application
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <Tabs defaultValue="preview" className="w-full">
//                     <TabsList className="grid w-full grid-cols-2 bg-muted">
//                       <TabsTrigger value="preview" className="data-[state=active]:bg-background">
//                         <Eye className="h-4 w-4 mr-2" />
//                         Preview
//                       </TabsTrigger>
//                       <TabsTrigger value="files" className="data-[state=active]:bg-background">
//                         <FileText className="h-4 w-4 mr-2" />
//                         Files ({generationStatus.files.length})
//                       </TabsTrigger>
//                     </TabsList>

//                     <TabsContent value="preview" className="space-y-4">
//                       {generationStatus.demoUrl ? (
//                         <div className="space-y-4">
//                           <div className="flex items-center justify-between">
//                             <span className="text-sm text-foreground">Live Preview</span>
//                             <div className="flex gap-2">
//                               <Button
//                                 variant="outline"
//                                 size="sm"
//                                 onClick={() => window.open(generationStatus.demoUrl, "_blank")}
//                               >
//                                 <ExternalLink className="h-4 w-4 mr-2" />
//                                 Open in New Tab
//                               </Button>
//                               {generationStatus.chatUrl && (
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => window.open(generationStatus.chatUrl, "_blank")}
//                                 >
//                                   <Globe className="h-4 w-4 mr-2" />
//                                   View Chat
//                                 </Button>
//                               )}
//                             </div>
//                           </div>
//                           <div className="border border-border rounded-lg overflow-hidden">
//                             <iframe
//                               src={generationStatus.demoUrl}
//                               className="w-full h-96 bg-white"
//                               title="Generated Tool Preview"
//                             />
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-8 text-muted-foreground">
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
//                                     : "border-border bg-muted/30 hover:bg-muted/50",
//                                 )}
//                                 onClick={() => setSelectedFile(file)}
//                               >
//                                 <div className="flex items-center gap-3">
//                                   <FileText className="h-4 w-4 text-muted-foreground" />
//                                   <div>
//                                     <div className="text-sm font-medium text-foreground">{file.name}</div>
//                                     <div className="text-xs text-muted-foreground">
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
//                                 <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
//                                 <Button
//                                   variant="outline"
//                                   size="sm"
//                                   onClick={() => copyToClipboard(selectedFile.content)}
//                                 >
//                                   <Copy className="h-4 w-4 mr-2" />
//                                   Copy Code
//                                 </Button>
//                               </div>
//                               <ScrollArea className="h-64 w-full">
//                                 <pre className="text-xs bg-muted p-4 rounded-lg border border-border overflow-x-auto">
//                                   <code className="text-foreground">{selectedFile.content}</code>
//                                 </pre>
//                               </ScrollArea>
//                             </div>
//                           )}
//                         </div>
//                       ) : (
//                         <div className="text-center py-8 text-muted-foreground">
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


"use client"
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
  Cpu,
  Rocket,
  Monitor,
  Globe,
  Lightbulb,
  Wand2,
  Database,
  Link,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { v0ToolGenerator } from "@/lib/v0-tool-generator"

const TOOL_CATEGORIES = [
  {
    value: "dashboard",
    label: "Analytics Dashboard",
    description: "Data visualization and reporting tools",
    icon: Monitor,
    color: "from-blue-500 to-cyan-500",
    examples: ["Sales Dashboard", "KPI Tracker", "Performance Analytics"],
  },
  {
    value: "form",
    label: "Form Builder",
    description: "Data collection and form management",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
    examples: ["Contact Forms", "Survey Builder", "Application Forms"],
  },
  {
    value: "calculator",
    label: "Calculator Tool",
    description: "Computation and calculation engines",
    icon: Cpu,
    color: "from-purple-500 to-violet-500",
    examples: ["ROI Calculator", "Loan Calculator", "Price Estimator"],
  },
  {
    value: "tracker",
    label: "Progress Tracker",
    description: "Activity and progress monitoring",
    icon: Target,
    color: "from-orange-500 to-red-500",
    examples: ["Project Tracker", "Goal Monitor", "Time Tracker"],
  },
  {
    value: "generator",
    label: "Content Generator",
    description: "Automated content and data generation",
    icon: Sparkles,
    color: "from-pink-500 to-rose-500",
    examples: ["Report Generator", "Invoice Creator", "Template Builder"],
  },
  {
    value: "analyzer",
    label: "Data Analyzer",
    description: "Advanced data analysis and insights",
    icon: Brain,
    color: "from-indigo-500 to-blue-500",
    examples: ["Data Insights", "Trend Analysis", "Performance Review"],
  },
]

const GENERATION_PHASES = [
  {
    id: "requirements",
    label: "Requirements Analysis",
    icon: Brain,
    description: "Understanding your business needs",
    phase: "setup",
  },
  {
    id: "ui-generation",
    label: "UI Generation",
    icon: Code2,
    description: "Creating the user interface with v0",
    phase: "ui",
  },
  {
    id: "data-integration",
    label: "Data Integration",
    icon: Database,
    description: "Connecting real business data",
    phase: "integration",
  },
  {
    id: "finalization",
    label: "Finalization",
    icon: Rocket,
    description: "Deploying your business tool",
    phase: "deploy",
  },
]

const AVAILABLE_INTEGRATIONS = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "CRM data, leads, opportunities, accounts",
    icon: "🏢",
    type: "oauth",
    dataTypes: ["contacts", "leads", "opportunities", "accounts"],
    popular: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Marketing, sales, and service data",
    icon: "🎯",
    type: "oauth",
    dataTypes: ["contacts", "deals", "companies", "tickets"],
    popular: true,
  },
  {
    id: "google-sheets",
    name: "Google Sheets",
    description: "Spreadsheet data and calculations",
    icon: "📊",
    type: "oauth",
    dataTypes: ["spreadsheets", "data", "calculations"],
    popular: true,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Team communication and notifications",
    icon: "💬",
    type: "oauth",
    dataTypes: ["messages", "channels", "users"],
    popular: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Payment processing and financial data",
    icon: "💳",
    type: "api_key",
    dataTypes: ["payments", "customers", "subscriptions"],
    popular: true,
  },
  {
    id: "airtable",
    name: "Airtable",
    description: "Database and project management",
    icon: "🗃️",
    type: "api_key",
    dataTypes: ["records", "tables", "bases"],
    popular: false,
  },
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
}

interface RequirementsAnalysis {
  complexity: string
  estimatedHours: number
  suggestedTechnologies: string[]
  features: string[]
  followUpQuestions: string[]
  v0Prompt: string
  requiredIntegrations: string[]
}

interface CreateToolInterfaceProps {
  organizationSlug: string
}

interface DataSourceAnalysis {
  requiredIntegrations: Array<{
    id: string
    name: string
    purpose: string
    required: boolean
    type: "oauth" | "api_key" | "webhook"
  }>
  dataTypes: string[]
  suggestedWorkflow: string[]
  complexity: "simple" | "moderate" | "complex"
}

interface ConnectedIntegration {
  id: string
  name: string
  provider: string
  status: "connected" | "disconnected" | "testing"
  lastSync?: string
  testResult?: "success" | "failed"
}

export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [toolName, setToolName] = useState("")
  const [requirements, setRequirements] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: "idle",
    progress: 0,
    step: "ready",
    files: [],
    currentPhase: "setup",
  })

  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [connectedIntegrations, setConnectedIntegrations] = useState<ConnectedIntegration[]>([])
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false)
  const [testingIntegration, setTestingIntegration] = useState<string | null>(null)

  const [streamingLogs, setStreamingLogs] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [requirementsAnalysis, setRequirementsAnalysis] = useState<RequirementsAnalysis | null>(null)

  const { toast } = useToast()
  const router = useRouter()
  const logsEndRef = useRef<HTMLDivElement>(null)
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

    setStreamingLogs((prev) => [...prev, formattedMessage])

    setTimeout(() => {
      logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [])

  const analyzeRequirements = useCallback(async () => {
    if (!toolName.trim() || !requirements.trim() || !selectedCategory) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before analyzing requirements.",
        variant: "destructive",
      })
      return
    }

    addLog("Starting requirements analysis...", "info")
    setGenerationStatus((prev) => ({
      ...prev,
      status: "analyzing",
      progress: 10,
      step: "Analyzing business requirements",
      currentPhase: "setup",
    }))

    try {
      // Simulate analysis with realistic timing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const detectedIntegrations = AVAILABLE_INTEGRATIONS.filter(
        (integration) =>
          requirements.toLowerCase().includes(integration.name.toLowerCase()) ||
          integration.dataTypes.some((type) => requirements.toLowerCase().includes(type)),
      ).map((integration) => integration.id)

      const analysis: RequirementsAnalysis = {
        complexity: requirements.length > 500 ? "complex" : requirements.length > 200 ? "moderate" : "simple",
        estimatedHours: Math.ceil(requirements.length / 100) + 2,
        suggestedTechnologies: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        features: requirements
          .split(".")
          .filter((f) => f.trim().length > 10)
          .slice(0, 5),
        followUpQuestions: [
          "Should this tool support multiple user roles?",
          "Do you need real-time data updates?",
          "Should it include email notifications?",
        ],
        v0Prompt: `Create a professional ${selectedCategory} tool: ${toolName}\n\n${requirements}`,
        requiredIntegrations: detectedIntegrations,
      }

      setRequirementsAnalysis(analysis)
      setSelectedIntegrations(detectedIntegrations)

      addLog(`Analysis complete! Detected ${analysis.features.length} key features`, "success")
      addLog(`Complexity: ${analysis.complexity}, Estimated time: ${analysis.estimatedHours}h`, "info")

      if (detectedIntegrations.length > 0) {
        addLog(`Detected ${detectedIntegrations.length} required integrations`, "info")
      }

      setGenerationStatus((prev) => ({
        ...prev,
        status: "idle",
        progress: 25,
        step: "Requirements analyzed - ready for UI generation",
        currentPhase: "ui",
      }))

      setCurrentStep(1)
    } catch (error) {
      addLog("Requirements analysis failed", "error")
      setGenerationStatus((prev) => ({
        ...prev,
        status: "error",
        error: "Failed to analyze requirements",
        currentPhase: "setup",
      }))
    }
  }, [toolName, requirements, selectedCategory, addLog, toast])

  const generateUI = useCallback(async () => {
    if (!requirementsAnalysis) return

    addLog("Starting UI generation with v0...", "info")
    setGenerationStatus((prev) => ({
      ...prev,
      status: "generating",
      progress: 30,
      step: "Generating user interface",
      currentPhase: "ui",
    }))
    setIsPolling(true)

    try {
      const result = await v0ToolGenerator.generateTool({
        toolName,
        requirements,
        category: selectedCategory,
        userEmail: "user@example.com", // This should come from auth context
      })

      if (result.status === "error") {
        throw new Error(result.error || "Generation failed")
      }

      addLog("UI generation completed successfully!", "success")
      addLog(`Generated ${result.files.length} files`, "info")

      if (result.demoUrl) {
        addLog("Live preview is ready", "success")
      }

      setGenerationStatus((prev) => ({
        ...prev,
        status: "completed",
        progress: 60,
        step: "UI generated - ready for data integration",
        files: result.files,
        demoUrl: result.demoUrl,
        chatUrl: result.chatUrl,
        chatId: result.chatId,
        currentPhase: "integration",
      }))

      setCurrentStep(2)
    } catch (error) {
      addLog(`UI generation failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      setGenerationStatus((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Generation failed",
        currentPhase: "ui",
      }))
    } finally {
      setIsPolling(false)
    }
  }, [requirementsAnalysis, toolName, requirements, selectedCategory, addLog])

  const connectIntegration = useCallback(
    async (integrationId: string) => {
      setTestingIntegration(integrationId)
      addLog(`Connecting to ${integrationId}...`, "info")

      try {
        // Simulate integration connection
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === integrationId)
        if (!integration) throw new Error("Integration not found")

        const connectedIntegration: ConnectedIntegration = {
          id: integrationId,
          name: integration.name,
          provider: integration.name,
          status: "connected",
          lastSync: new Date().toISOString(),
          testResult: "success",
        }

        setConnectedIntegrations((prev) => [...prev.filter((i) => i.id !== integrationId), connectedIntegration])
        addLog(`Successfully connected to ${integration.name}`, "success")

        toast({
          title: "Integration Connected",
          description: `${integration.name} has been successfully connected and tested.`,
        })
      } catch (error) {
        addLog(`Failed to connect to ${integrationId}`, "error")
        toast({
          title: "Connection Failed",
          description: `Failed to connect to ${integrationId}. Please check your credentials.`,
          variant: "destructive",
        })
      } finally {
        setTestingIntegration(null)
      }
    },
    [addLog, toast],
  )

  const finalizeApplication = useCallback(async () => {
    addLog("Finalizing application with integrated data...", "info")
    setGenerationStatus((prev) => ({
      ...prev,
      status: "generating",
      progress: 80,
      step: "Finalizing application",
      currentPhase: "deploy",
    }))

    try {
      // Simulate finalization process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      addLog("Application finalized successfully!", "success")
      addLog("Your business tool is ready for deployment", "success")

      setGenerationStatus((prev) => ({
        ...prev,
        status: "completed",
        progress: 100,
        step: "Application ready for deployment",
        currentPhase: "deploy",
      }))

      setCurrentStep(3)
    } catch (error) {
      addLog("Finalization failed", "error")
      setGenerationStatus((prev) => ({
        ...prev,
        status: "error",
        error: "Failed to finalize application",
        currentPhase: "deploy",
      }))
    }
  }, [addLog])

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        toast({
          title: "Copied to clipboard",
          description: "Content has been copied to your clipboard.",
        })
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy content to clipboard.",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const downloadFile = useCallback(
    (file: ToolFile) => {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "File downloaded",
        description: `${file.name} has been downloaded.`,
      })
    },
    [toast],
  )

  const goToStep = useCallback(
    (step: number) => {
      if (step < 0 || step > 3) return

      // Validate step transitions
      if (step === 1 && !requirementsAnalysis) {
        toast({
          title: "Requirements Analysis Required",
          description: "Please complete the requirements analysis first.",
          variant: "destructive",
        })
        return
      }

      if (step === 2 && generationStatus.files.length === 0) {
        toast({
          title: "UI Generation Required",
          description: "Please generate the UI first.",
          variant: "destructive",
        })
        return
      }

      setCurrentStep(step)
    },
    [requirementsAnalysis, generationStatus.files.length, toast],
  )

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Business Tool Generator
              </h1>
              <p className="text-muted-foreground mt-2">
                Create professional business tools with AI-powered generation and real data integration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Two-Step Process
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            {GENERATION_PHASES.map((phase, index) => {
              const Icon = phase.icon
              const isActive = currentStep === index
              const isCompleted = currentStep > index
              const isCurrent = generationStatus.currentPhase === phase.phase

              return (
                <div
                  key={phase.id}
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer",
                    isActive && "border-purple-500 bg-purple-500/10",
                    isCompleted && "border-green-500 bg-green-500/10",
                    !isActive && !isCompleted && "border-border bg-muted/30 hover:bg-muted/50",
                  )}
                  onClick={() => goToStep(index)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all",
                      isCompleted && "border-green-500 bg-green-500 text-white",
                      isActive && "border-purple-500 bg-purple-500 text-white",
                      !isActive && !isCompleted && "border-muted-foreground text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium truncate",
                        isActive || isCompleted ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {phase.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{phase.description}</div>
                  </div>
                  {isCurrent && generationStatus.status === "generating" && (
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  )}
                </div>
              )
            })}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="text-foreground font-medium">{generationStatus.progress}%</span>
            </div>
            <Progress value={generationStatus.progress} className="h-2" />
            {generationStatus.step && <p className="text-sm text-muted-foreground">{generationStatus.step}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Step 0: Requirements */}
            {currentStep === 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-400" />
                    Business Requirements
                  </CardTitle>
                  <CardDescription>Describe your business tool requirements in detail</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="toolName" className="text-foreground">
                      Tool Name
                    </Label>
                    <Input
                      id="toolName"
                      placeholder="e.g., Sales Performance Dashboard"
                      value={toolName}
                      onChange={(e) => setToolName(e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category
                    </Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {TOOL_CATEGORIES.map((category) => {
                          const Icon = category.icon
                          return (
                            <SelectItem key={category.value} value={category.value} className="text-foreground">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
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

                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-foreground">
                      Detailed Requirements
                    </Label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe what your tool should do, what data it should display, what features it needs, and how users will interact with it..."
                      value={requirements}
                      onChange={(e) => setRequirements(e.target.value)}
                      className="min-h-32 bg-background border-border text-foreground"
                    />
                    <div className="text-xs text-muted-foreground">
                      {requirements.length}/1000 characters • Be specific about features, data sources, and user
                      workflows
                    </div>
                  </div>

                  <Button
                    onClick={analyzeRequirements}
                    disabled={
                      generationStatus.status === "analyzing" ||
                      !toolName.trim() ||
                      !requirements.trim() ||
                      !selectedCategory
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {generationStatus.status === "analyzing" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Requirements...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Analyze Requirements
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 1: UI Generation */}
            {currentStep === 1 && requirementsAnalysis && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-400" />
                    UI Generation
                  </CardTitle>
                  <CardDescription>Generate the user interface with v0 AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/30 p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-2">Requirements Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Complexity:</span>
                        <Badge variant="outline" className="ml-2">
                          {requirementsAnalysis.complexity}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Est. Time:</span>
                        <span className="ml-2 text-foreground">{requirementsAnalysis.estimatedHours}h</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-muted-foreground text-sm">Key Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {requirementsAnalysis.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature.trim().substring(0, 30)}...
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={generateUI}
                    disabled={generationStatus.status === "generating"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {generationStatus.status === "generating" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating UI...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate UI with v0
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Data Integration */}
            {currentStep === 2 && generationStatus.files.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Database className="h-5 w-5 text-green-400" />
                    Data Integration
                  </CardTitle>
                  <CardDescription>Connect real business data to replace mock data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {requirementsAnalysis?.requiredIntegrations &&
                    requirementsAnalysis.requiredIntegrations.length > 0 && (
                      <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-blue-400" />
                          <span className="text-sm font-medium text-blue-400">Recommended Integrations</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Based on your requirements, we recommend connecting these data sources:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {requirementsAnalysis.requiredIntegrations.map((integrationId) => {
                            const integration = AVAILABLE_INTEGRATIONS.find((i) => i.id === integrationId)
                            return integration ? (
                              <Badge key={integrationId} variant="outline" className="text-blue-400 border-blue-500/20">
                                {integration.icon} {integration.name}
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Available Integrations</h4>
                      <Badge variant="outline" className="text-xs">
                        {connectedIntegrations.length} connected
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {AVAILABLE_INTEGRATIONS.filter(
                        (integration) => integration.popular || selectedIntegrations.includes(integration.id),
                      ).map((integration) => {
                        const isConnected = connectedIntegrations.some(
                          (c) => c.id === integration.id && c.status === "connected",
                        )
                        const isTesting = testingIntegration === integration.id
                        const isRecommended = requirementsAnalysis?.requiredIntegrations.includes(integration.id)

                        return (
                          <div
                            key={integration.id}
                            className={cn(
                              "flex items-center justify-between p-3 rounded-lg border transition-all",
                              isConnected && "border-green-500 bg-green-500/10",
                              isRecommended && !isConnected && "border-blue-500 bg-blue-500/10",
                              !isConnected && !isRecommended && "border-border bg-muted/30",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">{integration.icon}</div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{integration.name}</span>
                                  {isRecommended && (
                                    <Badge variant="outline" className="text-xs text-blue-400 border-blue-500/20">
                                      Recommended
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">{integration.description}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {integration.dataTypes.slice(0, 3).map((type) => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isConnected ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-400" />
                                  <span className="text-sm text-green-400">Connected</span>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => connectIntegration(integration.id)}
                                  disabled={isTesting}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  {isTesting ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      Testing...
                                    </>
                                  ) : (
                                    <>
                                      <Link className="h-3 w-3 mr-1" />
                                      Connect
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    onClick={finalizeApplication}
                    disabled={connectedIntegrations.length === 0 || generationStatus.status === "generating"}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {generationStatus.status === "generating" ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Finalizing...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-2" />
                        Finalize Application ({connectedIntegrations.length} integrations)
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Finalization */}
            {currentStep === 3 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-purple-400" />
                    Application Ready
                  </CardTitle>
                  <CardDescription>Your business tool is ready for deployment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="font-medium text-green-400">Generation Complete!</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your business tool has been successfully generated with real data integration.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/30 p-3 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Files Generated</div>
                      <div className="text-lg font-semibold text-foreground">{generationStatus.files.length}</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-lg border border-border">
                      <div className="text-sm text-muted-foreground">Integrations</div>
                      <div className="text-lg font-semibold text-foreground">{connectedIntegrations.length}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {generationStatus.demoUrl && (
                      <Button
                        onClick={() => window.open(generationStatus.demoUrl, "_blank")}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open Application
                      </Button>
                    )}
                    {generationStatus.chatUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(generationStatus.chatUrl, "_blank")}
                        className="flex-1"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        View Chat
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => goToStep(currentStep - 1)} disabled={currentStep === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" onClick={() => goToStep(currentStep + 1)} disabled={currentStep === 3}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Column - Logs and Preview */}
          <div className="space-y-6">
            {/* Enhanced Real-time Logs */}
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
                <ScrollArea className="h-64 w-full">
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

            {(generationStatus.files.length > 0 || generationStatus.demoUrl) && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-purple-400" />
                    Generated Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="preview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-background">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="files" className="data-[state=active]:bg-background">
                        <FileText className="h-4 w-4 mr-2" />
                        Files ({generationStatus.files.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="space-y-4">
                      {generationStatus.demoUrl ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Live Preview</span>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(generationStatus.demoUrl, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open in New Tab
                              </Button>
                              {generationStatus.chatUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(generationStatus.chatUrl, "_blank")}
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
                              className="w-full h-96 bg-white"
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
                    </TabsContent>

                    <TabsContent value="files" className="space-y-4">
                      {generationStatus.files.length > 0 ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-2">
                            {generationStatus.files.map((file, index) => (
                              <div
                                key={index}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all",
                                  selectedFile === file
                                    ? "border-purple-500 bg-purple-500/10"
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
                                    className="h-8 w-8 p-0"
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
                                    className="h-8 w-8 p-0"
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
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
