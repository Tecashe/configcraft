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
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Sparkles,
  Target,
  Zap,
  Code2,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
  Pause,
  Brain,
  Cpu,
  Layers,
  Rocket,
  Monitor,
  Globe,
  History,
  Lightbulb,
  Clock,
  Wand2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

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

const GENERATION_STEPS = [
  { id: "analyzing", label: "Analyzing Requirements", icon: Brain, description: "Understanding your needs" },
  { id: "designing", label: "Designing Architecture", icon: Layers, description: "Planning the structure" },
  { id: "generating", label: "Generating Code", icon: Code2, description: "Creating the application" },
  { id: "optimizing", label: "Optimizing Performance", icon: Zap, description: "Enhancing efficiency" },
  { id: "finalizing", label: "Finalizing Application", icon: CheckCircle, description: "Adding final touches" },
  { id: "completed", label: "Ready to Deploy", icon: Rocket, description: "Your tool is ready!" },
]

interface ToolFile {
  name: string
  content: string
  type?: string
  size?: number
}

interface GenerationStatus {
  status: "idle" | "analyzing" | "generating" | "completed" | "error"
  progress: number
  step: string
  message?: string
  error?: string
  files: ToolFile[]
  demoUrl?: string
  chatUrl?: string
  chatId?: string
}

interface RequirementsAnalysis {
  complexity: string
  estimatedHours: number
  suggestedTechnologies: string[]
  features: string[]
  followUpQuestions: string[]
  v0Prompt: string
}

interface CreateToolInterfaceProps {
  organizationSlug: string
}

export default function EnhancedCreateToolInterface({ organizationSlug }: CreateToolInterfaceProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    requirements: "",
  })

  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    status: "idle",
    progress: 0,
    step: "idle",
    files: [],
  })

  const [analysis, setAnalysis] = useState<RequirementsAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedFile, setSelectedFile] = useState<ToolFile | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [streamingLogs, setStreamingLogs] = useState<string[]>([])
  const [toolId, setToolId] = useState<string | null>(null)
  const [savedDrafts, setSavedDrafts] = useState<any[]>([])
  const [showTemplates, setShowTemplates] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setStreamingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }, [])

  const scrollToBottom = useCallback(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [streamingLogs, scrollToBottom])

  const analyzeRequirements = async () => {
    if (!formData.requirements || formData.requirements.length < 20) {
      toast({
        title: "Requirements Too Short",
        description: "Please provide at least 20 characters of requirements for analysis.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)
    addLog("🔍 Analyzing your requirements...")

    try {
      const response = await fetch(`/api/organizations/${organizationSlug}/tools/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirements: formData.requirements,
          context: [formData.category, formData.description],
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const result = await response.json()
      setAnalysis(result.analysis)
      addLog("✅ Requirements analysis completed")

      toast({
        title: "Analysis Complete",
        description: "Your requirements have been analyzed. Review the suggestions below.",
      })
    } catch (error) {
      addLog("❌ Analysis failed")
      toast({
        title: "Analysis Failed",
        description: "Could not analyze requirements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Auto-save draft every 5 seconds
    if (field === "requirements" && value.length > 50) {
      saveDraft()
    }
  }

  const saveDraft = async () => {
    if (!formData.name || !formData.requirements) return

    try {
      const response = await fetch(`/api/organizations/${organizationSlug}/tools/drafts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        addLog("💾 Draft saved automatically")
      }
    } catch (error) {
      console.error("Draft save failed:", error)
    }
  }

  const startPolling = useCallback(
    (toolId: string) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }

      setIsPolling(true)
      addLog("🔄 Starting real-time status monitoring...")

      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch(`/api/organizations/${organizationSlug}/tools/${toolId}/status`)
          if (!response.ok) {
            throw new Error(`Status check failed: ${response.status}`)
          }

          const status = await response.json()
          addLog(`📊 Status: ${status.status} - ${status.step} (${status.progress}%)`)

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
          }))

          if (status.status === "completed" || status.status === "error") {
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current)
            }
            setIsPolling(false)

            if (status.status === "completed") {
              addLog("🎉 Tool generation completed successfully!")
              toast({
                title: "Tool Generated Successfully!",
                description: "Your business tool is ready to use.",
              })
            } else {
              addLog(`❌ Generation failed: ${status.error}`)
              toast({
                title: "Generation Failed",
                description: status.error || "An unknown error occurred.",
                variant: "destructive",
              })
            }
          }
        } catch (error) {
          addLog(`💥 Polling error: ${error instanceof Error ? error.message : "Unknown error"}`)
          console.error("Polling error:", error)
        }
      }, 2000)
    },
    [organizationSlug, addLog, toast],
  )

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setIsPolling(false)
    addLog("⏸️ Status monitoring paused")
  }, [addLog])

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.description || !formData.category || !formData.requirements) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setGenerationStatus({
      status: "analyzing",
      progress: 0,
      step: "analyzing",
      files: [],
    })

    setStreamingLogs([])
    addLog("🚀 Initiating tool generation process...")
    addLog(`📝 Tool: ${formData.name}`)
    addLog(`🏷️ Category: ${formData.category}`)
    addLog(`📊 Requirements length: ${formData.requirements.length} characters`)

    try {
      addLog("📤 Sending generation request to v0 API...")

      const response = await fetch(`/api/organizations/${organizationSlug}/tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      addLog(`✅ Generation request accepted - Tool ID: ${result.toolId}`)

      setToolId(result.toolId)
      startPolling(result.toolId)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      addLog(`💥 Generation failed: ${errorMessage}`)

      setGenerationStatus({
        status: "error",
        progress: 0,
        step: "error",
        error: errorMessage,
        files: [],
      })

      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      })
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

    toast({
      title: "File Downloaded",
      description: `${file.name} has been downloaded.`,
    })
  }

  const getCurrentStep = () => {
    return GENERATION_STEPS.find((step) => step.id === generationStatus.step) || GENERATION_STEPS[0]
  }

  const getStepIndex = () => {
    return GENERATION_STEPS.findIndex((step) => step.id === generationStatus.step)
  }

  const isFormValid = formData.name && formData.description && formData.category && formData.requirements

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Enhanced Header with better dark theme integration */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">AI Tool Generator</h1>
                <p className="text-sm text-muted-foreground">Create professional business tools with AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
                <History className="h-4 w-4 mr-2" />
                Templates
              </Button>
              {isPolling && (
                <Button variant="outline" size="sm" onClick={stopPolling}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Monitoring
                </Button>
              )}
              {generationStatus.status === "completed" && generationStatus.demoUrl && (
                <Button variant="outline" size="sm" onClick={() => window.open(generationStatus.demoUrl, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Demo
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Enhanced Configuration */}
          <div className="space-y-6">
            {/* Tool Configuration with better dark theme */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Tool Configuration
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Define your business tool requirements and specifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-foreground">
                        Tool Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
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
                        onValueChange={(value) => handleInputChange("category", value)}
                        disabled={generationStatus.status === "generating"}
                      >
                        <SelectTrigger className="bg-input border-border text-foreground">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
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
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Brief description of what this tool does"
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                      required
                      disabled={generationStatus.status === "generating"}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requirements" className="text-foreground">
                        Detailed Requirements *
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={analyzeRequirements}
                        disabled={isAnalyzing || !formData.requirements || formData.requirements.length < 20}
                        className="border-border bg-transparent"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4 mr-2" />
                        )}
                        Analyze
                      </Button>
                    </div>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => handleInputChange("requirements", e.target.value)}
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

                  {analysis && (
                    <Card className="bg-muted/50 border-border">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-500" />
                          Requirements Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Complexity</Label>
                            <Badge variant="secondary" className="mt-1">
                              {analysis.complexity}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Estimated Time</Label>
                            <div className="flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{analysis.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Suggested Technologies</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysis.suggestedTechnologies.map((tech) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Key Features</Label>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                            {analysis.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Button
                    type="submit"
                    disabled={!isFormValid || generationStatus.status === "generating"}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
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

            {/* Enhanced Generation Progress */}
            {generationStatus.status !== "idle" && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Generation Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{getCurrentStep().label}</span>
                      <span className="text-sm text-muted-foreground">{generationStatus.progress}%</span>
                    </div>
                    <Progress value={generationStatus.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">{getCurrentStep().description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {GENERATION_STEPS.map((step, index) => {
                      const IconComponent = step.icon
                      const isActive = step.id === generationStatus.step
                      const isCompleted = index < getStepIndex()

                      return (
                        <div
                          key={step.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg text-xs transition-all border",
                            isActive && "bg-blue-500/20 border-blue-500/30",
                            isCompleted && "bg-green-500/20 border-green-500/30",
                            !isActive && !isCompleted && "bg-muted/50 border-border",
                          )}
                        >
                          <IconComponent
                            className={cn(
                              "h-3 w-3",
                              isActive && "text-blue-400 animate-pulse",
                              isCompleted && "text-green-400",
                              !isActive && !isCompleted && "text-muted-foreground",
                            )}
                          />
                          <span
                            className={cn(
                              isActive && "text-blue-300",
                              isCompleted && "text-green-300",
                              !isActive && !isCompleted && "text-muted-foreground",
                            )}
                          >
                            {step.label}
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
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Enhanced Results & Logs */}
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
                            log.includes("🔄") && "border-blue-500 bg-blue-500/10 text-blue-300",
                            !log.includes("✅") &&
                              !log.includes("❌") &&
                              !log.includes("⚠️") &&
                              !log.includes("🔄") &&
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

            {/* Enhanced Generated Files & Preview */}
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
