// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Wand2,
//   FileText,
//   Database,
//   Users,
//   Calculator,
//   Calendar,
//   ShoppingCart,
//   BarChart3,
//   Settings,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   Sparkles,
//   Eye,
//   Code,
//   Zap,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// const toolCategories = [
//   {
//     id: "dashboard",
//     name: "Dashboard",
//     icon: BarChart3,
//     description: "Analytics and reporting tools",
//     color: "bg-blue-500/10 text-blue-600 border-blue-200",
//   },
//   {
//     id: "form",
//     name: "Forms",
//     icon: FileText,
//     description: "Data collection and surveys",
//     color: "bg-green-500/10 text-green-600 border-green-200",
//   },
//   {
//     id: "calculator",
//     name: "Calculator",
//     icon: Calculator,
//     description: "Financial and business calculators",
//     color: "bg-purple-500/10 text-purple-600 border-purple-200",
//   },
//   {
//     id: "crm",
//     name: "CRM",
//     icon: Users,
//     description: "Customer relationship management",
//     color: "bg-orange-500/10 text-orange-600 border-orange-200",
//   },
//   {
//     id: "inventory",
//     name: "Inventory",
//     icon: Database,
//     description: "Stock and asset management",
//     color: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
//   },
//   {
//     id: "scheduler",
//     name: "Scheduler",
//     icon: Calendar,
//     description: "Appointment and task scheduling",
//     color: "bg-pink-500/10 text-pink-600 border-pink-200",
//   },
//   {
//     id: "ecommerce",
//     name: "E-commerce",
//     icon: ShoppingCart,
//     description: "Online store and sales tools",
//     color: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
//   },
//   {
//     id: "settings",
//     name: "Settings",
//     icon: Settings,
//     description: "Configuration and admin panels",
//     color: "bg-gray-500/10 text-gray-600 border-gray-200",
//   },
// ]

// const examplePrompts = {
//   dashboard: [
//     "Create a sales dashboard showing revenue, leads, and conversion rates with interactive charts and filters",
//     "Build an employee performance dashboard with KPIs, goals, progress tracking, and team comparisons",
//     "Design a project management dashboard with task progress, timelines, team workload, and milestone tracking",
//   ],
//   form: [
//     "Create a customer feedback form with rating scales, comments, file uploads, and automated email responses",
//     "Build an employee onboarding form with personal details, document uploads, e-signatures, and workflow automation",
//     "Design a product order form with quantity selectors, pricing calculator, payment options, and inventory checking",
//   ],
//   calculator: [
//     "Build a loan calculator with monthly payments, interest rates, amortization schedule, and comparison tools",
//     "Create an ROI calculator for marketing campaigns with cost inputs, revenue projections, and performance metrics",
//     "Design a tax calculator with income brackets, deductions, estimated payments, and filing recommendations",
//   ],
//   crm: [
//     "Create a customer management system with contact details, interaction history, notes, and follow-up reminders",
//     "Build a lead tracking system with pipeline stages, probability scores, follow-up tasks, and conversion analytics",
//     "Design a support ticket system with priority levels, assignment rules, resolution tracking, and customer satisfaction",
//   ],
//   inventory: [
//     "Create an inventory management system with stock levels, reorder points, supplier info, and automated alerts",
//     "Build a warehouse management tool with location tracking, picking lists, shipping integration, and barcode scanning",
//     "Design an asset tracking system with maintenance schedules, depreciation calculations, and assignment management",
//   ],
//   scheduler: [
//     "Create an appointment booking system with calendar integration, automated reminders, and availability management",
//     "Build a task scheduler with deadlines, priorities, team assignments, and progress tracking",
//     "Design a resource booking system with availability checking, conflict resolution, and approval workflows",
//   ],
//   ecommerce: [
//     "Create a product catalog with categories, pricing, inventory tracking, customer reviews, and search functionality",
//     "Build an order management system with payment processing, shipping integration, tracking, and customer notifications",
//     "Design a customer portal with order history, returns processing, loyalty program features, and account management",
//   ],
//   settings: [
//     "Create a user management panel with roles, permissions, access controls, and audit logging",
//     "Build a system configuration tool with environment settings, feature toggles, and deployment management",
//     "Design a billing and subscription management interface with plans, usage tracking, and payment processing",
//   ],
// }

// interface GenerationStep {
//   id: string
//   name: string
//   description: string
//   status: "pending" | "active" | "completed" | "error"
//   icon: React.ComponentType<{ className?: string }>
// }

// interface ToolStatus {
//   id: string
//   status: string
//   generationStatus: string
//   currentStep: string
//   progress: number
//   previewUrl?: string
//   demoUrl?: string
//   error?: string
//   files: any[]
//   chatSession?: {
//     id: string
//     status: string
//     demoUrl?: string
//     files: any[]
//   }
// }

// export default function CreateToolPage() {
//   const [activeTab, setActiveTab] = useState("describe")
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const [toolName, setToolName] = useState("")
//   const [toolDescription, setToolDescription] = useState("")
//   const [requirements, setRequirements] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [generationProgress, setGenerationProgress] = useState(0)
//   const [currentToolId, setCurrentToolId] = useState<string | null>(null)
//   const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null)
//   const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
//     {
//       id: "analyze",
//       name: "Analyzing Requirements",
//       description: "AI is understanding your business needs and requirements",
//       status: "pending",
//       icon: Sparkles,
//     },
//     {
//       id: "design",
//       name: "Designing Interface",
//       description: "Creating the user interface layout and user experience",
//       status: "pending",
//       icon: Eye,
//     },
//     {
//       id: "generate",
//       name: "Generating Code",
//       description: "Building your custom tool with React and TypeScript",
//       status: "pending",
//       icon: Code,
//     },
//     {
//       id: "deploy",
//       name: "Finalizing Tool",
//       description: "Setting up your tool and making it ready to use",
//       status: "pending",
//       icon: Zap,
//     },
//   ])

//   const { toast } = useToast()
//   const router = useRouter()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId)
//     setActiveTab("details")
//   }

//   const handleExamplePrompt = (prompt: string) => {
//     setRequirements(prompt)
//   }

//   const validateForm = () => {
//     if (!selectedCategory) {
//       toast({
//         title: "Category Required",
//         description: "Please select a tool category to continue.",
//         variant: "destructive",
//       })
//       return false
//     }

//     if (!toolName.trim()) {
//       toast({
//         title: "Tool Name Required",
//         description: "Please enter a name for your tool.",
//         variant: "destructive",
//       })
//       return false
//     }

//     if (!toolDescription.trim()) {
//       toast({
//         title: "Description Required",
//         description: "Please provide a description for your tool.",
//         variant: "destructive",
//       })
//       return false
//     }

//     if (!requirements.trim()) {
//       toast({
//         title: "Requirements Required",
//         description: "Please describe what you want your tool to do.",
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const updateGenerationStep = (stepId: string, status: GenerationStep["status"]) => {
//     setGenerationSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)))
//   }

//   const pollToolStatus = async (toolId: string) => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to check status")
//       }

//       const data: ToolStatus = await response.json()
//       setToolStatus(data)

//       // Update progress
//       setGenerationProgress(data.progress)

//       // Update steps based on current step
//       const stepMap = {
//         analyzing: "analyze",
//         designing: "design",
//         generating: "generate",
//         finalizing: "deploy",
//         completed: "deploy",
//         error: data.currentStep || "analyze",
//       }

//       const currentStepId = stepMap[data.currentStep as keyof typeof stepMap] || "analyze"

//       // Reset all steps to pending first
//       setGenerationSteps((prev) => prev.map((step) => ({ ...step, status: "pending" as const })))

//       // Update steps based on progress
//       if (data.status === "ERROR" || data.generationStatus === "error") {
//         updateGenerationStep(currentStepId, "error")
//         setIsGenerating(false)

//         toast({
//           title: "Generation Failed",
//           description: data.error || "There was an error generating your tool. Please try again.",
//           variant: "destructive",
//         })
//         return
//       }

//       // Update completed steps
//       const steps = ["analyze", "design", "generate", "deploy"]
//       const currentIndex = steps.indexOf(currentStepId)

//       for (let i = 0; i < currentIndex; i++) {
//         updateGenerationStep(steps[i], "completed")
//       }

//       if (data.generationStatus === "completed" || data.status === "GENERATED") {
//         updateGenerationStep(currentStepId, "completed")
//         setGenerationProgress(100)
//         setIsGenerating(false)

//         toast({
//           title: "Tool Created Successfully!",
//           description: "Your tool has been generated and is ready to use.",
//         })

//         // Redirect to the tool page
//         setTimeout(() => {
//           router.push(`/${orgSlug}/tools/${toolId}`)
//         }, 2000)
//         return
//       } else {
//         updateGenerationStep(currentStepId, "active")
//       }

//       // Continue polling if still generating
//       if (data.status === "GENERATING") {
//         setTimeout(() => pollToolStatus(toolId), 3000)
//       }
//     } catch (error) {
//       console.error("Status polling error:", error)
//       setIsGenerating(false)
//       toast({
//         title: "Status Check Failed",
//         description: "Unable to check generation status. Please refresh the page.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateTool = async () => {
//     if (!validateForm()) return

//     setIsGenerating(true)
//     setActiveTab("generating")
//     setGenerationProgress(5)
//     updateGenerationStep("analyze", "active")

//     try {
//       // Create the tool and start generation
//       const response = await fetch(`/api/organizations/${orgSlug}/tools`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: toolName,
//           description: toolDescription,
//           category: selectedCategory,
//           requirements: requirements,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create tool")
//       }

//       const result = await response.json()
//       const toolId = result.toolId || result.id
//       setCurrentToolId(toolId)

//       toast({
//         title: "Tool Creation Started",
//         description: "Your tool is being generated. This may take a few minutes.",
//       })

//       // Start polling for status updates
//       setTimeout(() => pollToolStatus(toolId), 2000)
//     } catch (error) {
//       console.error("Tool creation error:", error)
//       toast({
//         title: "Creation Failed",
//         description:
//           error instanceof Error ? error.message : "There was an error creating your tool. Please try again.",
//         variant: "destructive",
//       })

//       // Reset generation state
//       setGenerationSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })))
//       setGenerationProgress(0)
//       setIsGenerating(false)
//       setActiveTab("details")
//     }
//   }

//   const selectedCategoryData = toolCategories.find((cat) => cat.id === selectedCategory)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//       {/* Header */}
//       <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50">
//         <div className="flex items-center justify-between h-16 px-6">
//           <div className="flex items-center space-x-4">
//             <Link href={`/${orgSlug}/tools`}>
//               <Button variant="ghost" size="sm" className="hover:bg-slate-100 dark:hover:bg-slate-800">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Tools
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
//                 Create New Tool
//               </h1>
//               <p className="text-sm text-slate-600 dark:text-slate-400">Build a custom business tool with AI</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-full border border-blue-200 dark:border-blue-800">
//             <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
//             <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-5xl mx-auto p-6">
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
//           <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-slate-800 shadow-sm">
//             <TabsTrigger
//               value="describe"
//               disabled={isGenerating}
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
//             >
//               1. Choose Category
//             </TabsTrigger>
//             <TabsTrigger
//               value="details"
//               disabled={!selectedCategory || isGenerating}
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
//             >
//               2. Tool Details
//             </TabsTrigger>
//             <TabsTrigger
//               value="generating"
//               disabled={!isGenerating}
//               className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
//             >
//               3. Generate
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="describe" className="space-y-8">
//             <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
//               <CardHeader className="text-center pb-8">
//                 <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent flex items-center justify-center space-x-3">
//                   <Wand2 className="h-6 w-6 text-blue-600" />
//                   <span>What type of tool do you want to create?</span>
//                 </CardTitle>
//                 <CardDescription className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
//                   Choose a category that best matches your business needs. Our AI will generate a custom tool tailored
//                   to your requirements.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                   {toolCategories.map((category) => (
//                     <Card
//                       key={category.id}
//                       className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group ${
//                         selectedCategory === category.id
//                           ? "ring-2 ring-blue-500 shadow-lg scale-105 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
//                           : "hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/50"
//                       }`}
//                       onClick={() => handleCategorySelect(category.id)}
//                     >
//                       <CardContent className="p-6">
//                         <div className="flex flex-col items-center text-center space-y-4">
//                           <div
//                             className={`p-4 rounded-2xl transition-all duration-300 ${
//                               selectedCategory === category.id
//                                 ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg"
//                                 : category.color
//                             }`}
//                           >
//                             <category.icon className="h-8 w-8" />
//                           </div>
//                           <div className="space-y-2">
//                             <h3 className="font-semibold text-lg">{category.name}</h3>
//                             <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
//                               {category.description}
//                             </p>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="details" className="space-y-8">
//             <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
//               <CardHeader>
//                 <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent flex items-center space-x-3">
//                   {selectedCategoryData && <selectedCategoryData.icon className="h-6 w-6 text-blue-600" />}
//                   <span>Tool Details</span>
//                   {selectedCategoryData && (
//                     <Badge
//                       variant="secondary"
//                       className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900 dark:to-purple-900 dark:text-blue-300"
//                     >
//                       {selectedCategoryData.name}
//                     </Badge>
//                   )}
//                 </CardTitle>
//                 <CardDescription className="text-base text-slate-600 dark:text-slate-400">
//                   Provide details about your tool so our AI can create exactly what you need.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                   <div className="space-y-6">
//                     <div className="space-y-3">
//                       <Label htmlFor="toolName" className="text-base font-medium">
//                         Tool Name
//                       </Label>
//                       <Input
//                         id="toolName"
//                         placeholder="e.g., Sales Dashboard, Customer Form"
//                         value={toolName}
//                         onChange={(e) => setToolName(e.target.value)}
//                         className="h-12 text-base"
//                       />
//                     </div>

//                     <div className="space-y-3">
//                       <Label htmlFor="toolDescription" className="text-base font-medium">
//                         Short Description
//                       </Label>
//                       <Textarea
//                         id="toolDescription"
//                         placeholder="Brief description of what this tool does..."
//                         value={toolDescription}
//                         onChange={(e) => setToolDescription(e.target.value)}
//                         rows={4}
//                         className="text-base resize-none"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-6">
//                     <div className="space-y-3">
//                       <Label className="text-base font-medium">Example Ideas</Label>
//                       <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
//                         {selectedCategory &&
//                           examplePrompts[selectedCategory as keyof typeof examplePrompts]?.map((prompt, index) => (
//                             <Button
//                               key={index}
//                               variant="outline"
//                               size="sm"
//                               className="w-full text-left justify-start h-auto p-4 text-sm bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-purple-50 dark:from-slate-800 dark:to-slate-700 dark:hover:from-blue-950 dark:hover:to-purple-950 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
//                               onClick={() => handleExamplePrompt(prompt)}
//                             >
//                               <Sparkles className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
//                               <span className="leading-relaxed">{prompt}</span>
//                             </Button>
//                           ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <Label htmlFor="requirements" className="text-base font-medium">
//                     Detailed Requirements
//                   </Label>
//                   <Textarea
//                     id="requirements"
//                     placeholder="Describe what you want your tool to do. Be as specific as possible. Include features, data fields, calculations, workflows, user interactions, etc."
//                     value={requirements}
//                     onChange={(e) => setRequirements(e.target.value)}
//                     rows={8}
//                     className="text-base resize-none"
//                   />
//                   <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
//                     💡 <strong>Tip:</strong> The more detailed your requirements, the better your tool will be. Include
//                     specific features, data fields, user workflows, and any integrations you need.
//                   </p>
//                 </div>

//                 <div className="flex justify-end pt-4">
//                   <Button
//                     onClick={handleCreateTool}
//                     className="px-8 py-3 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
//                     disabled={isGenerating}
//                     size="lg"
//                   >
//                     <Wand2 className="h-5 w-5 mr-2" />
//                     Create Tool with AI
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="generating" className="space-y-8">
//             <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-slate-800/80">
//               <CardHeader className="text-center">
//                 <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent flex items-center justify-center space-x-3">
//                   <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//                   <span>Generating Your Tool</span>
//                 </CardTitle>
//                 <CardDescription className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
//                   Our AI is creating your custom business tool. This process typically takes 2-5 minutes depending on
//                   complexity.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-8">
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-medium">Overall Progress</span>
//                     <span className="text-lg font-bold text-blue-600">{Math.round(generationProgress)}%</span>
//                   </div>
//                   <div className="relative">
//                     <Progress value={generationProgress} className="h-3 bg-slate-200 dark:bg-slate-700" />
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse" />
//                   </div>
//                 </div>

//                 <div className="grid gap-6">
//                   {generationSteps.map((step, index) => (
//                     <div
//                       key={step.id}
//                       className="flex items-start space-x-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 transition-all duration-300"
//                     >
//                       <div className="flex-shrink-0 mt-1">
//                         {step.status === "completed" && (
//                           <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
//                             <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
//                           </div>
//                         )}
//                         {step.status === "active" && (
//                           <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
//                             <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
//                           </div>
//                         )}
//                         {step.status === "pending" && (
//                           <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-full">
//                             <step.icon className="h-5 w-5 text-slate-400" />
//                           </div>
//                         )}
//                         {step.status === "error" && (
//                           <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
//                             <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-base font-medium text-slate-900 dark:text-slate-100">{step.name}</p>
//                         <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{step.description}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
//                   <div className="flex items-start space-x-4">
//                     <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
//                       <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                     </div>
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-2">
//                         Creating: {toolName}
//                       </h4>
//                       <p className="text-blue-700 dark:text-blue-300 mb-3">{toolDescription}</p>
//                       <div className="flex items-center space-x-2">
//                         <Badge
//                           variant="secondary"
//                           className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200"
//                         >
//                           {selectedCategoryData?.name}
//                         </Badge>
//                         {toolStatus?.demoUrl && (
//                           <Badge
//                             variant="secondary"
//                             className="bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
//                           >
//                             Preview Available
//                           </Badge>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {toolStatus?.demoUrl && (
//                   <Card className="border-2 border-green-200 dark:border-green-800">
//                     <CardHeader>
//                       <CardTitle className="text-lg text-green-800 dark:text-green-200 flex items-center space-x-2">
//                         <Eye className="h-5 w-5" />
//                         <span>Live Preview Available</span>
//                       </CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden">
//                         <iframe
//                           src={toolStatus.demoUrl}
//                           className="w-full h-full border-0"
//                           title="Tool Preview"
//                           sandbox="allow-scripts allow-same-origin"
//                         />
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import {
//   ArrowLeft,
//   Send,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   Sparkles,
//   Eye,
//   User,
//   Bot,
//   ExternalLink,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// interface ToolStatus {
//   id: string
//   status: string
//   progress: number
//   demoUrl?: string
//   error?: string
//   chatId?: string
// }

// const toolCategories = [
//   { id: "dashboard", name: "Dashboard", icon: "📊" },
//   { id: "form", name: "Forms", icon: "📝" },
//   { id: "calculator", name: "Calculator", icon: "🧮" },
//   { id: "crm", name: "CRM", icon: "👥" },
//   { id: "inventory", name: "Inventory", icon: "📦" },
//   { id: "scheduler", name: "Scheduler", icon: "📅" },
//   { id: "ecommerce", name: "E-commerce", icon: "🛒" },
//   { id: "settings", name: "Settings", icon: "⚙️" },
// ]

// export default function CreateToolPage() {
//   const [step, setStep] = useState<"category" | "details" | "chat">("category")
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const [toolName, setToolName] = useState("")
//   const [toolDescription, setToolDescription] = useState("")
//   const [requirements, setRequirements] = useState("")
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [currentMessage, setCurrentMessage] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null)
//   const [currentToolId, setCurrentToolId] = useState<string | null>(null)

//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const { toast } = useToast()
//   const router = useRouter()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId)
//     setStep("details")
//   }

//   const handleStartGeneration = async () => {
//     if (!toolName.trim() || !requirements.trim()) {
//       toast({
//         title: "Missing Information",
//         description: "Please provide both a tool name and requirements.",
//         variant: "destructive",
//       })
//       return
//     }

//     setStep("chat")
//     setIsGenerating(true)

//     // Add initial user message
//     const initialMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: `Create a ${selectedCategory} tool called "${toolName}". ${toolDescription ? `Description: ${toolDescription}. ` : ""}Requirements: ${requirements}`,
//       timestamp: new Date(),
//     }
//     setMessages([initialMessage])

//     try {
//       // Start tool generation
//       const response = await fetch(`/api/organizations/${orgSlug}/tools`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: toolName,
//           description: toolDescription,
//           category: selectedCategory,
//           requirements: requirements,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create tool")
//       }

//       const result = await response.json()
//       setCurrentToolId(result.toolId)

//       // Add assistant response
//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: `I'll create your ${selectedCategory} tool "${toolName}" for you. Let me analyze your requirements and start building...`,
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, assistantMessage])

//       // Start polling for status
//       pollToolStatus(result.toolId)
//     } catch (error) {
//       console.error("Tool creation error:", error)
//       toast({
//         title: "Creation Failed",
//         description: error instanceof Error ? error.message : "Failed to create tool",
//         variant: "destructive",
//       })
//       setIsGenerating(false)
//     }
//   }

//   const pollToolStatus = async (toolId: string) => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
//       if (!response.ok) return

//       const status: ToolStatus = await response.json()
//       setToolStatus(status)

//       if (status.status === "GENERATED" || status.status === "PUBLISHED") {
//         setIsGenerating(false)

//         const completionMessage: ChatMessage = {
//           id: Date.now().toString(),
//           role: "assistant",
//           content: `✅ Your tool "${toolName}" has been successfully created! You can now preview it and make any adjustments you need.`,
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, completionMessage])

//         toast({
//           title: "Tool Created!",
//           description: "Your tool has been generated successfully.",
//         })
//         return
//       }

//       if (status.status === "ERROR") {
//         setIsGenerating(false)

//         const errorMessage: ChatMessage = {
//           id: Date.now().toString(),
//           role: "assistant",
//           content: `❌ There was an error creating your tool: ${status.error || "Unknown error"}. Please try again or contact support.`,
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, errorMessage])

//         toast({
//           title: "Generation Failed",
//           description: status.error || "Unknown error occurred",
//           variant: "destructive",
//         })
//         return
//       }

//       // Continue polling if still generating
//       if (status.status === "GENERATING") {
//         setTimeout(() => pollToolStatus(toolId), 3000)
//       }
//     } catch (error) {
//       console.error("Status polling error:", error)
//     }
//   }

//   const handleSendMessage = async () => {
//     if (!currentMessage.trim() || !currentToolId) return

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: currentMessage,
//       timestamp: new Date(),
//     }
//     setMessages((prev) => [...prev, userMessage])
//     setCurrentMessage("")
//     setIsGenerating(true)

//     try {
//       // Send message to continue chat
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${currentToolId}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: currentMessage,
//         }),
//       })

//       if (response.ok) {
//         const assistantMessage: ChatMessage = {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "I'm updating your tool based on your feedback. This may take a moment...",
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, assistantMessage])

//         // Continue polling
//         if (currentToolId) {
//           pollToolStatus(currentToolId)
//         }
//       }
//     } catch (error) {
//       console.error("Message send error:", error)
//       setIsGenerating(false)
//     }
//   }

//   const selectedCategoryData = toolCategories.find((cat) => cat.id === selectedCategory)

//   return (
//     <div className="min-h-screen bg-slate-900 text-white">
//       {/* Header */}
//       <div className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
//         <div className="flex items-center justify-between h-16 px-6">
//           <div className="flex items-center space-x-4">
//             <Link href={`/${orgSlug}/tools`}>
//               <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Tools
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-xl font-semibold text-white">Create New Tool</h1>
//               <p className="text-sm text-slate-400">Build a custom business tool with AI</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
//             <Sparkles className="h-4 w-4 text-blue-400" />
//             <span className="text-sm font-medium text-blue-300">AI-Powered</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto p-6">
//         {step === "category" && (
//           <Card className="bg-slate-800 border-slate-700">
//             <CardHeader className="text-center pb-8">
//               <CardTitle className="text-2xl font-bold text-white flex items-center justify-center space-x-3">
//                 <Sparkles className="h-6 w-6 text-blue-400" />
//                 <span>What type of tool do you want to create?</span>
//               </CardTitle>
//               <p className="text-slate-400 max-w-2xl mx-auto">
//                 Choose a category that best matches your business needs. Our AI will generate a custom tool tailored to
//                 your requirements.
//               </p>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {toolCategories.map((category) => (
//                   <Card
//                     key={category.id}
//                     className={`cursor-pointer transition-all duration-300 hover:scale-105 group ${
//                       selectedCategory === category.id
//                         ? "ring-2 ring-blue-500 bg-blue-500/10 border-blue-500/20"
//                         : "bg-slate-700 border-slate-600 hover:bg-slate-600"
//                     }`}
//                     onClick={() => handleCategorySelect(category.id)}
//                   >
//                     <CardContent className="p-6 text-center">
//                       <div className="text-3xl mb-3">{category.icon}</div>
//                       <h3 className="font-semibold text-white">{category.name}</h3>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {step === "details" && (
//           <Card className="bg-slate-800 border-slate-700">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-white flex items-center space-x-3">
//                 {selectedCategoryData && <span className="text-2xl">{selectedCategoryData.icon}</span>}
//                 <span>Tool Details</span>
//                 {selectedCategoryData && (
//                   <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">{selectedCategoryData.name}</Badge>
//                 )}
//               </CardTitle>
//               <p className="text-slate-400">
//                 Provide details about your tool so our AI can create exactly what you need.
//               </p>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="space-y-3">
//                 <label className="text-sm font-medium text-slate-300">Tool Name</label>
//                 <Input
//                   placeholder="e.g., Sales Dashboard, Customer Form"
//                   value={toolName}
//                   onChange={(e) => setToolName(e.target.value)}
//                   className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <label className="text-sm font-medium text-slate-300">Short Description (Optional)</label>
//                 <Textarea
//                   placeholder="Brief description of what this tool does..."
//                   value={toolDescription}
//                   onChange={(e) => setToolDescription(e.target.value)}
//                   rows={3}
//                   className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <label className="text-sm font-medium text-slate-300">Detailed Requirements</label>
//                 <Textarea
//                   placeholder="Describe what you want your tool to do. Be as specific as possible. Include features, data fields, calculations, workflows, user interactions, etc."
//                   value={requirements}
//                   onChange={(e) => setRequirements(e.target.value)}
//                   rows={8}
//                   className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
//                 />
//                 <p className="text-sm text-slate-500">
//                   💡 <strong>Tip:</strong> The more detailed your requirements, the better your tool will be.
//                 </p>
//               </div>

//               <div className="flex justify-end pt-4">
//                 <Button
//                   onClick={handleStartGeneration}
//                   className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
//                   disabled={!toolName.trim() || !requirements.trim()}
//                 >
//                   <Sparkles className="h-5 w-5 mr-2" />
//                   Start Creating Tool
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {step === "chat" && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Chat Section */}
//             <div className="lg:col-span-2">
//               <Card className="bg-slate-800 border-slate-700 h-[600px] flex flex-col">
//                 <CardHeader className="border-b border-slate-700">
//                   <CardTitle className="text-lg text-white flex items-center space-x-2">
//                     <Bot className="h-5 w-5 text-blue-400" />
//                     <span>AI Assistant</span>
//                     {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
//                   </CardTitle>
//                 </CardHeader>

//                 {/* Messages */}
//                 <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex items-start space-x-3 ${
//                         message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
//                       }`}
//                     >
//                       <div className={`p-2 rounded-full ${message.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
//                         {message.role === "user" ? (
//                           <User className="h-4 w-4 text-white" />
//                         ) : (
//                           <Bot className="h-4 w-4 text-slate-300" />
//                         )}
//                       </div>
//                       <div className={`flex-1 max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
//                         <div
//                           className={`p-3 rounded-lg ${
//                             message.role === "user" ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-100"
//                           }`}
//                         >
//                           <p className="text-sm">{message.content}</p>
//                         </div>
//                         <p className="text-xs text-slate-500 mt-1">{message.timestamp.toLocaleTimeString()}</p>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>

//                 {/* Input */}
//                 <div className="border-t border-slate-700 p-4">
//                   <div className="flex space-x-2">
//                     <Input
//                       placeholder="Ask for changes or improvements..."
//                       value={currentMessage}
//                       onChange={(e) => setCurrentMessage(e.target.value)}
//                       onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                       className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
//                       disabled={isGenerating}
//                     />
//                     <Button
//                       onClick={handleSendMessage}
//                       disabled={!currentMessage.trim() || isGenerating}
//                       className="bg-blue-600 hover:bg-blue-700"
//                     >
//                       <Send className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             </div>

//             {/* Status Panel */}
//             <div className="space-y-6">
//               {/* Tool Info */}
//               <Card className="bg-slate-800 border-slate-700">
//                 <CardHeader>
//                   <CardTitle className="text-lg text-white">Tool Information</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <div>
//                     <p className="text-sm text-slate-400">Name</p>
//                     <p className="text-white font-medium">{toolName}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-slate-400">Category</p>
//                     <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/20">
//                       {selectedCategoryData?.name}
//                     </Badge>
//                   </div>
//                   {toolDescription && (
//                     <div>
//                       <p className="text-sm text-slate-400">Description</p>
//                       <p className="text-slate-300 text-sm">{toolDescription}</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Progress */}
//               {toolStatus && (
//                 <Card className="bg-slate-800 border-slate-700">
//                   <CardHeader>
//                     <CardTitle className="text-lg text-white">Generation Progress</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <div className="flex justify-between text-sm mb-2">
//                         <span className="text-slate-400">Progress</span>
//                         <span className="text-white font-medium">{toolStatus.progress}%</span>
//                       </div>
//                       <Progress value={toolStatus.progress} className="h-2" />
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       {toolStatus.status === "GENERATING" && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
//                       {toolStatus.status === "GENERATED" && <CheckCircle className="h-4 w-4 text-green-400" />}
//                       {toolStatus.status === "ERROR" && <AlertCircle className="h-4 w-4 text-red-400" />}
//                       <span className="text-sm text-slate-300 capitalize">{toolStatus.status.toLowerCase()}</span>
//                     </div>

//                     {toolStatus.demoUrl && (
//                       <div className="space-y-2">
//                         <p className="text-sm text-slate-400">Preview Available</p>
//                         <div className="flex space-x-2">
//                           <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
//                             <a href={toolStatus.demoUrl} target="_blank" rel="noopener noreferrer">
//                               <Eye className="h-4 w-4 mr-2" />
//                               Preview
//                             </a>
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
//                             onClick={() => {
//                               if (currentToolId) {
//                                 router.push(`/${orgSlug}/tools/${currentToolId}`)
//                               }
//                             }}
//                           >
//                             <ExternalLink className="h-4 w-4 mr-2" />
//                             View Details
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   ArrowLeft,
//   Send,
//   Loader2,
//   CheckCircle,
//   AlertCircle,
//   Sparkles,
//   Eye,
//   User,
//   Bot,
//   ExternalLink,
//   Lightbulb,
//   FileText,
//   Database,
//   Users,
//   Calculator,
//   Calendar,
//   ShoppingCart,
//   BarChart3,
//   Settings,
//   Zap,
//   Target,
//   Clock,
//   Star,
//   ChevronRight,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// interface ToolStatus {
//   id: string
//   status: string
//   progress: number
//   demoUrl?: string
//   error?: string
//   chatId?: string
// }

// const toolCategories = [
//   {
//     id: "dashboard",
//     name: "Dashboard",
//     icon: BarChart3,
//     description: "Analytics and reporting tools",
//     color: "from-blue-500 to-blue-600",
//     examples: ["Sales Dashboard", "KPI Tracker", "Performance Monitor"],
//   },
//   {
//     id: "form",
//     name: "Forms",
//     icon: FileText,
//     description: "Data collection and surveys",
//     color: "from-green-500 to-green-600",
//     examples: ["Customer Survey", "Lead Capture", "Feedback Form"],
//   },
//   {
//     id: "calculator",
//     name: "Calculator",
//     icon: Calculator,
//     description: "Financial and business calculators",
//     color: "from-purple-500 to-purple-600",
//     examples: ["ROI Calculator", "Loan Calculator", "Tax Estimator"],
//   },
//   {
//     id: "crm",
//     name: "CRM",
//     icon: Users,
//     description: "Customer relationship management",
//     color: "from-orange-500 to-orange-600",
//     examples: ["Contact Manager", "Lead Tracker", "Customer Portal"],
//   },
//   {
//     id: "inventory",
//     name: "Inventory",
//     icon: Database,
//     description: "Stock and asset management",
//     color: "from-indigo-500 to-indigo-600",
//     examples: ["Stock Tracker", "Asset Manager", "Warehouse System"],
//   },
//   {
//     id: "scheduler",
//     name: "Scheduler",
//     icon: Calendar,
//     description: "Appointment and task scheduling",
//     color: "from-pink-500 to-pink-600",
//     examples: ["Appointment Booking", "Task Planner", "Resource Scheduler"],
//   },
//   {
//     id: "ecommerce",
//     name: "E-commerce",
//     icon: ShoppingCart,
//     description: "Online store and sales tools",
//     color: "from-yellow-500 to-yellow-600",
//     examples: ["Product Catalog", "Order Manager", "Customer Portal"],
//   },
//   {
//     id: "settings",
//     name: "Settings",
//     icon: Settings,
//     description: "Configuration and admin panels",
//     color: "from-gray-500 to-gray-600",
//     examples: ["User Management", "System Config", "Admin Panel"],
//   },
// ]

// const examplePrompts = {
//   dashboard: [
//     {
//       title: "Sales Performance Dashboard",
//       description: "Track revenue, leads, and conversion rates with interactive charts",
//       prompt:
//         "Create a comprehensive sales dashboard that displays monthly revenue trends, lead conversion rates, top-performing products, sales team performance metrics, and pipeline analysis. Include filters for date ranges, sales regions, and product categories. Add export functionality for reports and real-time data updates.",
//     },
//     {
//       title: "Employee Performance Tracker",
//       description: "Monitor KPIs, goals, and team productivity metrics",
//       prompt:
//         "Build an employee performance dashboard showing individual and team KPIs, goal progress tracking, performance ratings, attendance metrics, and productivity scores. Include comparison charts, performance trends over time, and automated performance review scheduling.",
//     },
//     {
//       title: "Project Management Dashboard",
//       description: "Track project progress, timelines, and resource allocation",
//       prompt:
//         "Design a project management dashboard with task progress tracking, timeline visualization, resource allocation charts, budget monitoring, team workload distribution, and milestone tracking. Include Gantt charts, burndown charts, and project health indicators.",
//     },
//   ],
//   form: [
//     {
//       title: "Customer Feedback System",
//       description: "Collect and analyze customer satisfaction data",
//       prompt:
//         "Create a comprehensive customer feedback form with rating scales, multiple choice questions, text feedback areas, file upload capabilities, and automated email responses. Include sentiment analysis, feedback categorization, and response tracking dashboard.",
//     },
//     {
//       title: "Employee Onboarding Form",
//       description: "Streamline new hire documentation and processes",
//       prompt:
//         "Build an employee onboarding system with personal information collection, document uploads, e-signature capabilities, task checklists, training module assignments, and progress tracking. Include automated workflow triggers and manager notifications.",
//     },
//     {
//       title: "Lead Generation Form",
//       description: "Capture and qualify potential customers",
//       prompt:
//         "Design a lead generation form with progressive profiling, lead scoring, qualification questions, integration with CRM systems, automated follow-up sequences, and lead nurturing workflows. Include analytics on conversion rates and lead quality.",
//     },
//   ],
//   calculator: [
//     {
//       title: "ROI Calculator",
//       description: "Calculate return on investment for business decisions",
//       prompt:
//         "Create an ROI calculator that handles initial investment costs, ongoing expenses, revenue projections, time periods, and risk factors. Include scenario analysis, break-even calculations, NPV computations, and detailed financial projections with charts.",
//     },
//     {
//       title: "Loan Payment Calculator",
//       description: "Calculate loan payments and amortization schedules",
//       prompt:
//         "Build a comprehensive loan calculator with monthly payment calculations, amortization schedules, interest rate comparisons, extra payment scenarios, and total interest calculations. Include payment calendars and loan comparison tools.",
//     },
//     {
//       title: "Tax Estimator",
//       description: "Estimate tax obligations and deductions",
//       prompt:
//         "Design a tax estimation tool with income calculations, deduction tracking, tax bracket analysis, quarterly payment estimates, and tax planning scenarios. Include support for different filing statuses and tax optimization suggestions.",
//     },
//   ],
//   crm: [
//     {
//       title: "Customer Relationship Manager",
//       description: "Manage customer interactions and relationships",
//       prompt:
//         "Create a CRM system with contact management, interaction history tracking, deal pipeline management, task and reminder systems, email integration, and customer segmentation. Include sales forecasting, activity reporting, and customer lifetime value calculations.",
//     },
//     {
//       title: "Lead Tracking System",
//       description: "Track and nurture potential customers",
//       prompt:
//         "Build a lead tracking system with lead capture, scoring algorithms, pipeline stage management, automated follow-up sequences, conversion tracking, and lead source analysis. Include lead assignment rules and performance metrics.",
//     },
//     {
//       title: "Support Ticket System",
//       description: "Manage customer support requests efficiently",
//       prompt:
//         "Design a support ticket system with ticket creation, priority assignment, agent routing, status tracking, SLA monitoring, knowledge base integration, and customer satisfaction surveys. Include reporting and performance analytics.",
//     },
//   ],
//   inventory: [
//     {
//       title: "Stock Management System",
//       description: "Track inventory levels and automate reordering",
//       prompt:
//         "Create an inventory management system with stock level tracking, automated reorder points, supplier management, purchase order generation, barcode scanning support, and inventory valuation. Include low stock alerts and inventory turnover analysis.",
//     },
//     {
//       title: "Asset Tracking System",
//       description: "Monitor and manage company assets",
//       prompt:
//         "Build an asset tracking system with asset registration, location tracking, maintenance scheduling, depreciation calculations, assignment management, and audit trails. Include asset lifecycle management and reporting capabilities.",
//     },
//     {
//       title: "Warehouse Management Tool",
//       description: "Optimize warehouse operations and logistics",
//       prompt:
//         "Design a warehouse management system with location tracking, picking list generation, shipping integration, inventory movements, cycle counting, and performance metrics. Include barcode scanning and mobile device support.",
//     },
//   ],
//   scheduler: [
//     {
//       title: "Appointment Booking System",
//       description: "Allow customers to book appointments online",
//       prompt:
//         "Create an appointment booking system with calendar integration, availability management, automated reminders, customer notifications, service selection, staff assignment, and payment processing. Include booking confirmations and rescheduling capabilities.",
//     },
//     {
//       title: "Task Scheduler",
//       description: "Organize and prioritize team tasks",
//       prompt:
//         "Build a task scheduling system with task creation, priority assignment, deadline tracking, team member assignment, progress monitoring, and dependency management. Include calendar views, notifications, and productivity analytics.",
//     },
//     {
//       title: "Resource Booking System",
//       description: "Manage shared resources and equipment",
//       prompt:
//         "Design a resource booking system with availability checking, conflict resolution, approval workflows, usage tracking, maintenance scheduling, and cost allocation. Include booking history and utilization reports.",
//     },
//   ],
//   ecommerce: [
//     {
//       title: "Product Catalog Manager",
//       description: "Manage products, pricing, and inventory",
//       prompt:
//         "Create a product catalog system with product information management, pricing controls, inventory tracking, category organization, search functionality, and customer reviews. Include bulk operations and product performance analytics.",
//     },
//     {
//       title: "Order Management System",
//       description: "Process and track customer orders",
//       prompt:
//         "Build an order management system with order processing, payment handling, shipping integration, tracking capabilities, customer notifications, and return management. Include order analytics and fulfillment optimization.",
//     },
//     {
//       title: "Customer Portal",
//       description: "Self-service portal for customers",
//       prompt:
//         "Design a customer portal with account management, order history, tracking information, support ticket creation, loyalty program features, and personalized recommendations. Include mobile responsiveness and user preferences.",
//     },
//   ],
//   settings: [
//     {
//       title: "User Management Panel",
//       description: "Manage user accounts, roles, and permissions",
//       prompt:
//         "Create a user management system with user registration, role assignment, permission controls, access logging, password policies, and audit trails. Include bulk user operations and security monitoring.",
//     },
//     {
//       title: "System Configuration Tool",
//       description: "Configure application settings and preferences",
//       prompt:
//         "Build a system configuration interface with environment settings, feature toggles, integration configurations, backup management, and deployment controls. Include configuration validation and rollback capabilities.",
//     },
//     {
//       title: "Admin Dashboard",
//       description: "Administrative overview and controls",
//       prompt:
//         "Design an admin dashboard with system health monitoring, user activity tracking, performance metrics, security alerts, and administrative controls. Include system logs, analytics, and maintenance tools.",
//     },
//   ],
// }

// const generationSteps = [
//   {
//     id: "analyzing",
//     title: "Analyzing Requirements",
//     description: "AI is understanding your business needs",
//     icon: Target,
//   },
//   {
//     id: "designing",
//     title: "Designing Interface",
//     description: "Creating user experience and layout",
//     icon: Eye,
//   },
//   {
//     id: "generating",
//     title: "Generating Code",
//     description: "Building your custom tool",
//     icon: Zap,
//   },
//   {
//     id: "finalizing",
//     title: "Finalizing Tool",
//     description: "Setting up and testing",
//     icon: CheckCircle,
//   },
// ]

// export default function CreateToolPage() {
//   const [currentStep, setCurrentStep] = useState<"category" | "details" | "generating">("category")
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const [toolName, setToolName] = useState("")
//   const [toolDescription, setToolDescription] = useState("")
//   const [requirements, setRequirements] = useState("")
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [currentMessage, setCurrentMessage] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null)
//   const [currentToolId, setCurrentToolId] = useState<string | null>(null)
//   const [activeTab, setActiveTab] = useState("requirements")

//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const { toast } = useToast()
//   const router = useRouter()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [messages])

//   const handleCategorySelect = (categoryId: string) => {
//     setSelectedCategory(categoryId)
//     setCurrentStep("details")
//   }

//   const handleExampleSelect = (example: any) => {
//     setToolName(example.title)
//     setToolDescription(example.description)
//     setRequirements(example.prompt)
//     setActiveTab("requirements")
//   }

//   const validateForm = () => {
//     if (!selectedCategory) {
//       toast({
//         title: "Category Required",
//         description: "Please select a tool category to continue.",
//         variant: "destructive",
//       })
//       return false
//     }

//     if (!toolName.trim()) {
//       toast({
//         title: "Tool Name Required",
//         description: "Please enter a name for your tool.",
//         variant: "destructive",
//       })
//       return false
//     }

//     if (!requirements.trim() || requirements.length < 20) {
//       toast({
//         title: "Requirements Too Short",
//         description: "Please provide detailed requirements (at least 20 characters).",
//         variant: "destructive",
//       })
//       return false
//     }

//     return true
//   }

//   const handleStartGeneration = async () => {
//     if (!validateForm()) return

//     setCurrentStep("generating")
//     setIsGenerating(true)

//     // Add initial user message
//     const initialMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: `Create a ${selectedCategory} tool called "${toolName}". ${
//         toolDescription ? `Description: ${toolDescription}. ` : ""
//       }Requirements: ${requirements}`,
//       timestamp: new Date(),
//     }
//     setMessages([initialMessage])

//     try {
//       // Start tool generation
//       const response = await fetch(`/api/organizations/${orgSlug}/tools`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: toolName,
//           description: toolDescription,
//           category: selectedCategory,
//           requirements: requirements,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to create tool")
//       }

//       const result = await response.json()
//       setCurrentToolId(result.toolId)

//       // Add assistant response
//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: `Perfect! I'll create your ${selectedCategory} tool "${toolName}" for you. Let me analyze your requirements and start building...`,
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, assistantMessage])

//       // Start polling for status
//       pollToolStatus(result.toolId)
//     } catch (error) {
//       console.error("Tool creation error:", error)
//       toast({
//         title: "Creation Failed",
//         description: error instanceof Error ? error.message : "Failed to create tool",
//         variant: "destructive",
//       })
//       setIsGenerating(false)
//       setCurrentStep("details")
//     }
//   }

//   const pollToolStatus = async (toolId: string) => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
//       if (!response.ok) return

//       const status: ToolStatus = await response.json()
//       setToolStatus(status)

//       if (status.status === "GENERATED" || status.status === "PUBLISHED") {
//         setIsGenerating(false)

//         const completionMessage: ChatMessage = {
//           id: Date.now().toString(),
//           role: "assistant",
//           content: `🎉 Excellent! Your tool "${toolName}" has been successfully created! You can now preview it and make any adjustments you need. The tool is fully functional and ready to use.`,
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, completionMessage])

//         toast({
//           title: "Tool Created Successfully!",
//           description: "Your tool is ready to use. You can now preview and customize it.",
//         })
//         return
//       }

//       if (status.status === "ERROR") {
//         setIsGenerating(false)

//         const errorMessage: ChatMessage = {
//           id: Date.now().toString(),
//           role: "assistant",
//           content: `❌ I encountered an issue while creating your tool: ${
//             status.error || "Unknown error"
//           }. Don't worry, let's try again with some adjustments.`,
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, errorMessage])

//         toast({
//           title: "Generation Failed",
//           description: status.error || "Unknown error occurred",
//           variant: "destructive",
//         })
//         return
//       }

//       // Continue polling if still generating
//       if (status.status === "GENERATING") {
//         setTimeout(() => pollToolStatus(toolId), 3000)
//       }
//     } catch (error) {
//       console.error("Status polling error:", error)
//     }
//   }

//   const handleSendMessage = async () => {
//     if (!currentMessage.trim() || !currentToolId) return

//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: currentMessage,
//       timestamp: new Date(),
//     }
//     setMessages((prev) => [...prev, userMessage])
//     setCurrentMessage("")
//     setIsGenerating(true)

//     try {
//       // Send message to continue chat
//       const response = await fetch(`/api/organizations/${orgSlug}/tools/${currentToolId}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           message: currentMessage,
//         }),
//       })

//       if (response.ok) {
//         const assistantMessage: ChatMessage = {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "Great feedback! I'm updating your tool based on your suggestions. This will just take a moment...",
//           timestamp: new Date(),
//         }
//         setMessages((prev) => [...prev, assistantMessage])

//         // Continue polling
//         if (currentToolId) {
//           pollToolStatus(currentToolId)
//         }
//       }
//     } catch (error) {
//       console.error("Message send error:", error)
//       setIsGenerating(false)
//     }
//   }

//   const selectedCategoryData = toolCategories.find((cat) => cat.id === selectedCategory)
//   const categoryExamples = selectedCategory ? examplePrompts[selectedCategory as keyof typeof examplePrompts] : []

//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* Header */}
//       <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-50">
//         <div className="flex items-center justify-between h-16 px-6">
//           <div className="flex items-center space-x-4">
//             <Link href={`/${orgSlug}/tools`}>
//               <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Tools
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-xl font-semibold text-white">Create New Tool</h1>
//               <p className="text-sm text-slate-400">Build a custom business tool with AI</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20">
//             <Sparkles className="h-4 w-4 text-blue-400" />
//             <span className="text-sm font-medium text-blue-300">AI-Powered</span>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Category Selection */}
//         {currentStep === "category" && (
//           <div className="space-y-8">
//             <div className="text-center space-y-4">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
//                 What type of tool do you want to create?
//               </h2>
//               <p className="text-xl text-slate-400 max-w-3xl mx-auto">
//                 Choose a category that best matches your business needs. Our AI will generate a custom tool tailored to
//                 your specific requirements.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {toolCategories.map((category) => (
//                 <Card
//                   key={category.id}
//                   className={`cursor-pointer transition-all duration-300 hover:scale-105 group border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 ${
//                     selectedCategory === category.id ? "ring-2 ring-blue-500 bg-blue-500/10" : ""
//                   }`}
//                   onClick={() => handleCategorySelect(category.id)}
//                 >
//                   <CardContent className="p-6">
//                     <div className="space-y-4">
//                       <div
//                         className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} text-white w-fit mx-auto transition-transform group-hover:scale-110`}
//                       >
//                         <category.icon className="h-8 w-8" />
//                       </div>
//                       <div className="text-center space-y-2">
//                         <h3 className="font-semibold text-lg text-white">{category.name}</h3>
//                         <p className="text-sm text-slate-400 leading-relaxed">{category.description}</p>
//                         <div className="flex flex-wrap gap-1 justify-center">
//                           {category.examples.map((example, idx) => (
//                             <Badge
//                               key={idx}
//                               variant="secondary"
//                               className="text-xs bg-slate-800 text-slate-300 border-slate-600"
//                             >
//                               {example}
//                             </Badge>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Tool Details */}
//         {currentStep === "details" && (
//           <div className="space-y-8">
//             <div className="flex items-center space-x-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setCurrentStep("category")}
//                 className="text-slate-400 hover:text-white"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Change Category
//               </Button>
//               <div className="flex items-center space-x-3">
//                 {selectedCategoryData && (
//                   <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedCategoryData.color} text-white`}>
//                     <selectedCategoryData.icon className="h-5 w-5" />
//                   </div>
//                 )}
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">Configure Your {selectedCategoryData?.name} Tool</h2>
//                   <p className="text-slate-400">Provide details so our AI can create exactly what you need</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Main Form */}
//               <div className="lg:col-span-2">
//                 <Card className="bg-slate-900/50 border-slate-700">
//                   <CardHeader>
//                     <CardTitle className="text-white flex items-center space-x-2">
//                       <FileText className="h-5 w-5 text-blue-400" />
//                       <span>Tool Configuration</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                       <TabsList className="grid w-full grid-cols-2 bg-slate-800">
//                         <TabsTrigger
//                           value="basic"
//                           className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
//                         >
//                           Basic Info
//                         </TabsTrigger>
//                         <TabsTrigger
//                           value="requirements"
//                           className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
//                         >
//                           Requirements
//                         </TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="basic" className="space-y-6">
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium text-slate-300 mb-2">
//                               Tool Name <span className="text-red-400">*</span>
//                             </label>
//                             <Input
//                               placeholder="e.g., Sales Dashboard, Customer Survey"
//                               value={toolName}
//                               onChange={(e) => setToolName(e.target.value)}
//                               className="bg-slate-800 border-slate-600 text-white placeholder-slate-400 h-12"
//                             />
//                             <p className="text-xs text-slate-500 mt-1">
//                               Choose a clear, descriptive name for your tool
//                             </p>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-slate-300 mb-2">
//                               Short Description <span className="text-slate-500">(Optional)</span>
//                             </label>
//                             <Textarea
//                               placeholder="Brief description of what this tool does..."
//                               value={toolDescription}
//                               onChange={(e) => setToolDescription(e.target.value)}
//                               rows={3}
//                               className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
//                             />
//                             <p className="text-xs text-slate-500 mt-1">
//                               A brief summary that will help users understand the tool's purpose
//                             </p>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="requirements" className="space-y-6">
//                         <div>
//                           <label className="block text-sm font-medium text-slate-300 mb-2">
//                             Detailed Requirements <span className="text-red-400">*</span>
//                           </label>
//                           <Textarea
//                             placeholder="Describe exactly what you want your tool to do. Be specific about features, data fields, user interactions, workflows, etc."
//                             value={requirements}
//                             onChange={(e) => setRequirements(e.target.value)}
//                             rows={12}
//                             className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
//                           />
//                           <div className="flex items-center justify-between mt-2">
//                             <p className="text-xs text-slate-500">
//                               {requirements.length} characters (minimum 20 required)
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-400" />
//                               <span className="text-xs text-slate-400">More detail = better results</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
//                           <h4 className="font-medium text-white mb-2 flex items-center space-x-2">
//                             <Target className="h-4 w-4 text-green-400" />
//                             <span>Tips for Great Requirements</span>
//                           </h4>
//                           <ul className="text-sm text-slate-300 space-y-1">
//                             <li>• Specify what data you need to collect or display</li>
//                             <li>• Describe user roles and permissions</li>
//                             <li>• Mention any calculations or business logic</li>
//                             <li>• Include workflow steps and user interactions</li>
//                             <li>• Note any integrations or export needs</li>
//                           </ul>
//                         </div>
//                       </TabsContent>
//                     </Tabs>

//                     <div className="flex justify-between items-center pt-6 border-t border-slate-700">
//                       <Button
//                         variant="outline"
//                         onClick={() => setCurrentStep("category")}
//                         className="border-slate-600 text-slate-300 hover:bg-slate-800"
//                       >
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back
//                       </Button>
//                       <Button
//                         onClick={handleStartGeneration}
//                         className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
//                         disabled={!validateForm()}
//                       >
//                         <Sparkles className="h-5 w-5 mr-2" />
//                         Create Tool
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Examples Sidebar */}
//               <div className="space-y-6">
//                 <Card className="bg-slate-900/50 border-slate-700">
//                   <CardHeader>
//                     <CardTitle className="text-white flex items-center space-x-2">
//                       <Star className="h-5 w-5 text-yellow-400" />
//                       <span>Popular Examples</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {categoryExamples.map((example, index) => (
//                       <div
//                         key={index}
//                         className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors group"
//                         onClick={() => handleExampleSelect(example)}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">
//                               {example.title}
//                             </h4>
//                             <p className="text-sm text-slate-400 mt-1">{example.description}</p>
//                           </div>
//                           <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
//                   <CardContent className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <Clock className="h-5 w-5 text-blue-400" />
//                       <span className="font-medium text-white">Generation Time</span>
//                     </div>
//                     <p className="text-sm text-slate-300 mb-4">
//                       Most tools are generated in 2-5 minutes. Complex tools with many features may take longer.
//                     </p>
//                     <div className="flex items-center space-x-2 text-xs text-slate-400">
//                       <Zap className="h-3 w-3" />
//                       <span>Powered by advanced AI</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Generation Progress */}
//         {currentStep === "generating" && (
//           <div className="max-w-6xl mx-auto">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Chat Interface */}
//               <div className="lg:col-span-2">
//                 <Card className="bg-slate-900/50 border-slate-700 h-[700px] flex flex-col">
//                   <CardHeader className="border-b border-slate-700">
//                     <CardTitle className="text-white flex items-center space-x-2">
//                       <Bot className="h-5 w-5 text-blue-400" />
//                       <span>AI Assistant</span>
//                       {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
//                     </CardTitle>
//                   </CardHeader>

//                   {/* Messages */}
//                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
//                     {messages.map((message) => (
//                       <div
//                         key={message.id}
//                         className={`flex items-start space-x-4 ${
//                           message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
//                         }`}
//                       >
//                         <div className={`p-3 rounded-full ${message.role === "user" ? "bg-blue-600" : "bg-slate-700"}`}>
//                           {message.role === "user" ? (
//                             <User className="h-4 w-4 text-white" />
//                           ) : (
//                             <Bot className="h-4 w-4 text-slate-300" />
//                           )}
//                         </div>
//                         <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
//                           <div
//                             className={`p-4 rounded-2xl ${
//                               message.role === "user"
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-slate-800 text-slate-100 border border-slate-700"
//                             }`}
//                           >
//                             <p className="text-sm leading-relaxed">{message.content}</p>
//                           </div>
//                           <p className="text-xs text-slate-500 mt-2 px-2">{message.timestamp.toLocaleTimeString()}</p>
//                         </div>
//                       </div>
//                     ))}
//                     <div ref={messagesEndRef} />
//                   </div>

//                   {/* Input */}
//                   <div className="border-t border-slate-700 p-4">
//                     <div className="flex space-x-3">
//                       <Input
//                         placeholder="Ask for changes or improvements..."
//                         value={currentMessage}
//                         onChange={(e) => setCurrentMessage(e.target.value)}
//                         onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                         className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
//                         disabled={isGenerating}
//                       />
//                       <Button
//                         onClick={handleSendMessage}
//                         disabled={!currentMessage.trim() || isGenerating}
//                         className="bg-blue-600 hover:bg-blue-700 px-6"
//                       >
//                         <Send className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-slate-500 mt-2">
//                       You can request changes, add features, or ask questions about your tool
//                     </p>
//                   </div>
//                 </Card>
//               </div>

//               {/* Status Panel */}
//               <div className="space-y-6">
//                 {/* Tool Info */}
//                 <Card className="bg-slate-900/50 border-slate-700">
//                   <CardHeader>
//                     <CardTitle className="text-white flex items-center space-x-2">
//                       <FileText className="h-5 w-5 text-blue-400" />
//                       <span>Tool Information</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <p className="text-sm text-slate-400">Name</p>
//                       <p className="text-white font-medium">{toolName}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-slate-400">Category</p>
//                       <Badge className={`bg-gradient-to-r ${selectedCategoryData?.color} text-white border-0`}>
//                         {selectedCategoryData?.name}
//                       </Badge>
//                     </div>
//                     {toolDescription && (
//                       <div>
//                         <p className="text-sm text-slate-400">Description</p>
//                         <p className="text-slate-300 text-sm">{toolDescription}</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Progress */}
//                 <Card className="bg-slate-900/50 border-slate-700">
//                   <CardHeader>
//                     <CardTitle className="text-white flex items-center space-x-2">
//                       <Zap className="h-5 w-5 text-yellow-400" />
//                       <span>Generation Progress</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     {toolStatus && (
//                       <div>
//                         <div className="flex justify-between text-sm mb-3">
//                           <span className="text-slate-400">Overall Progress</span>
//                           <span className="text-white font-medium">{toolStatus.progress}%</span>
//                         </div>
//                         <Progress value={toolStatus.progress} className="h-3" />
//                       </div>
//                     )}

//                     <div className="space-y-4">
//                       {generationSteps.map((step, index) => {
//                         const isActive = toolStatus?.status === "GENERATING" && index === 1
//                         const isCompleted = toolStatus?.progress && toolStatus.progress > (index + 1) * 25
//                         const isError = toolStatus?.status === "ERROR"

//                         return (
//                           <div key={step.id} className="flex items-center space-x-3">
//                             <div
//                               className={`p-2 rounded-full ${
//                                 isError && index === 0
//                                   ? "bg-red-500/20 text-red-400"
//                                   : isCompleted
//                                     ? "bg-green-500/20 text-green-400"
//                                     : isActive
//                                       ? "bg-blue-500/20 text-blue-400"
//                                       : "bg-slate-700 text-slate-500"
//                               }`}
//                             >
//                               {isError && index === 0 ? (
//                                 <AlertCircle className="h-4 w-4" />
//                               ) : isCompleted ? (
//                                 <CheckCircle className="h-4 w-4" />
//                               ) : isActive ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <step.icon className="h-4 w-4" />
//                               )}
//                             </div>
//                             <div className="flex-1">
//                               <p className="text-sm font-medium text-white">{step.title}</p>
//                               <p className="text-xs text-slate-400">{step.description}</p>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>

//                     {toolStatus?.demoUrl && (
//                       <div className="space-y-3 pt-4 border-t border-slate-700">
//                         <p className="text-sm font-medium text-green-400 flex items-center space-x-2">
//                           <CheckCircle className="h-4 w-4" />
//                           <span>Preview Available</span>
//                         </p>
//                         <div className="flex space-x-2">
//                           <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1" asChild>
//                             <a href={toolStatus.demoUrl} target="_blank" rel="noopener noreferrer">
//                               <Eye className="h-4 w-4 mr-2" />
//                               Preview
//                             </a>
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="outline"
//                             className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
//                             onClick={() => {
//                               if (currentToolId) {
//                                 router.push(`/${orgSlug}/tools/${currentToolId}`)
//                               }
//                             }}
//                           >
//                             <ExternalLink className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Tips */}
//                 <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
//                   <CardContent className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <Lightbulb className="h-5 w-5 text-yellow-400" />
//                       <span className="font-medium text-white">Pro Tips</span>
//                     </div>
//                     <ul className="text-sm text-slate-300 space-y-2">
//                       <li>• You can request changes at any time</li>
//                       <li>• Be specific about what you want modified</li>
//                       <li>• The AI learns from your feedback</li>
//                       <li>• Preview your tool before publishing</li>
//                     </ul>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Eye,
  User,
  Bot,
  ExternalLink,
  Lightbulb,
  FileText,
  Database,
  Users,
  Calculator,
  Calendar,
  ShoppingCart,
  BarChart3,
  Settings,
  Zap,
  Target,
  Clock,
  Star,
  ChevronRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ToolStatus {
  id: string
  status: string
  progress: number
  demoUrl?: string
  error?: string
  chatId?: string
}

const toolCategories = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: BarChart3,
    description: "Analytics and reporting tools",
    color: "from-[#444444] to-[#333333]",
    examples: ["Sales Dashboard", "KPI Tracker", "Performance Monitor"],
  },
  {
    id: "form",
    name: "Forms",
    icon: FileText,
    description: "Data collection and surveys",
    color: "from-[#444444] to-[#333333]",
    examples: ["Customer Survey", "Lead Capture", "Feedback Form"],
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: Calculator,
    description: "Financial and business calculators",
    color: "from-[#444444] to-[#333333]",
    examples: ["ROI Calculator", "Loan Calculator", "Tax Estimator"],
  },
  {
    id: "crm",
    name: "CRM",
    icon: Users,
    description: "Customer relationship management",
    color: "from-[#444444] to-[#333333]",
    examples: ["Contact Manager", "Lead Tracker", "Customer Portal"],
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: Database,
    description: "Stock and asset management",
    color: "from-[#444444] to-[#333333]",
    examples: ["Stock Tracker", "Asset Manager", "Warehouse System"],
  },
  {
    id: "scheduler",
    name: "Scheduler",
    icon: Calendar,
    description: "Appointment and task scheduling",
    color: "from-[#444444] to-[#333333]",
    examples: ["Appointment Booking", "Task Planner", "Resource Scheduler"],
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    icon: ShoppingCart,
    description: "Online store and sales tools",
    color: "from-[#444444] to-[#333333]",
    examples: ["Product Catalog", "Order Manager", "Customer Portal"],
  },
  {
    id: "settings",
    name: "Settings",
    icon: Settings,
    description: "Configuration and admin panels",
    color: "from-[#444444] to-[#333333]",
    examples: ["User Management", "System Config", "Admin Panel"],
  },
]

const examplePrompts = {
  dashboard: [
    {
      title: "Sales Performance Dashboard",
      description: "Track revenue, leads, and conversion rates with interactive charts",
      prompt:
        "Create a comprehensive sales dashboard that displays monthly revenue trends, lead conversion rates, top-performing products, sales team performance metrics, and pipeline analysis. Include filters for date ranges, sales regions, and product categories. Add export functionality for reports and real-time data updates.",
    },
    {
      title: "Employee Performance Tracker",
      description: "Monitor KPIs, goals, and team productivity metrics",
      prompt:
        "Build an employee performance dashboard showing individual and team KPIs, goal progress tracking, performance ratings, attendance metrics, and productivity scores. Include comparison charts, performance trends over time, and automated performance review scheduling.",
    },
    {
      title: "Project Management Dashboard",
      description: "Track project progress, timelines, and resource allocation",
      prompt:
        "Design a project management dashboard with task progress tracking, timeline visualization, resource allocation charts, budget monitoring, team workload distribution, and milestone tracking. Include Gantt charts, burndown charts, and project health indicators.",
    },
  ],
  form: [
    {
      title: "Customer Feedback System",
      description: "Collect and analyze customer satisfaction data",
      prompt:
        "Create a comprehensive customer feedback form with rating scales, multiple choice questions, text feedback areas, file upload capabilities, and automated email responses. Include sentiment analysis, feedback categorization, and response tracking dashboard.",
    },
    {
      title: "Employee Onboarding Form",
      description: "Streamline new hire documentation and processes",
      prompt:
        "Build an employee onboarding system with personal information collection, document uploads, e-signature capabilities, task checklists, training module assignments, and progress tracking. Include automated workflow triggers and manager notifications.",
    },
    {
      title: "Lead Generation Form",
      description: "Capture and qualify potential customers",
      prompt:
        "Design a lead generation form with progressive profiling, lead scoring, qualification questions, integration with CRM systems, automated follow-up sequences, and lead nurturing workflows. Include analytics on conversion rates and lead quality.",
    },
  ],
  calculator: [
    {
      title: "ROI Calculator",
      description: "Calculate return on investment for business decisions",
      prompt:
        "Create an ROI calculator that handles initial investment costs, ongoing expenses, revenue projections, time periods, and risk factors. Include scenario analysis, break-even calculations, NPV computations, and detailed financial projections with charts.",
    },
    {
      title: "Loan Payment Calculator",
      description: "Calculate loan payments and amortization schedules",
      prompt:
        "Build a comprehensive loan calculator with monthly payment calculations, amortization schedules, interest rate comparisons, extra payment scenarios, and total interest calculations. Include payment calendars and loan comparison tools.",
    },
    {
      title: "Tax Estimator",
      description: "Estimate tax obligations and deductions",
      prompt:
        "Design a tax estimation tool with income calculations, deduction tracking, tax bracket analysis, quarterly payment estimates, and tax planning scenarios. Include support for different filing statuses and tax optimization suggestions.",
    },
  ],
  crm: [
    {
      title: "Customer Relationship Manager",
      description: "Manage customer interactions and relationships",
      prompt:
        "Create a CRM system with contact management, interaction history tracking, deal pipeline management, task and reminder systems, email integration, and customer segmentation. Include sales forecasting, activity reporting, and customer lifetime value calculations.",
    },
    {
      title: "Lead Tracking System",
      description: "Track and nurture potential customers",
      prompt:
        "Build a lead tracking system with lead capture, scoring algorithms, pipeline stage management, automated follow-up sequences, conversion tracking, and lead source analysis. Include lead assignment rules and performance metrics.",
    },
    {
      title: "Support Ticket System",
      description: "Manage customer support requests efficiently",
      prompt:
        "Design a support ticket system with ticket creation, priority assignment, agent routing, status tracking, SLA monitoring, knowledge base integration, and customer satisfaction surveys. Include reporting and performance analytics.",
    },
  ],
  inventory: [
    {
      title: "Stock Management System",
      description: "Track inventory levels and automate reordering",
      prompt:
        "Create an inventory management system with stock level tracking, automated reorder points, supplier management, purchase order generation, barcode scanning support, and inventory valuation. Include low stock alerts and inventory turnover analysis.",
    },
    {
      title: "Asset Tracking System",
      description: "Monitor and manage company assets",
      prompt:
        "Build an asset tracking system with asset registration, location tracking, maintenance scheduling, depreciation calculations, assignment management, and audit trails. Include asset lifecycle management and reporting capabilities.",
    },
    {
      title: "Warehouse Management Tool",
      description: "Optimize warehouse operations and logistics",
      prompt:
        "Design a warehouse management system with location tracking, picking list generation, shipping integration, inventory movements, cycle counting, and performance metrics. Include barcode scanning and mobile device support.",
    },
  ],
  scheduler: [
    {
      title: "Appointment Booking System",
      description: "Allow customers to book appointments online",
      prompt:
        "Create an appointment booking system with calendar integration, availability management, automated reminders, customer notifications, service selection, staff assignment, and payment processing. Include booking confirmations and rescheduling capabilities.",
    },
    {
      title: "Task Scheduler",
      description: "Organize and prioritize team tasks",
      prompt:
        "Build a task scheduling system with task creation, priority assignment, deadline tracking, team member assignment, progress monitoring, and dependency management. Include calendar views, notifications, and productivity analytics.",
    },
    {
      title: "Resource Booking System",
      description: "Manage shared resources and equipment",
      prompt:
        "Design a resource booking system with availability checking, conflict resolution, approval workflows, usage tracking, maintenance scheduling, and cost allocation. Include booking history and utilization reports.",
    },
  ],
  ecommerce: [
    {
      title: "Product Catalog Manager",
      description: "Manage products, pricing, and inventory",
      prompt:
        "Create a product catalog system with product information management, pricing controls, inventory tracking, category organization, search functionality, and customer reviews. Include bulk operations and product performance analytics.",
    },
    {
      title: "Order Management System",
      description: "Process and track customer orders",
      prompt:
        "Build an order management system with order processing, payment handling, shipping integration, tracking capabilities, customer notifications, and return management. Include order analytics and fulfillment optimization.",
    },
    {
      title: "Customer Portal",
      description: "Self-service portal for customers",
      prompt:
        "Design a customer portal with account management, order history, tracking information, support ticket creation, loyalty program features, and personalized recommendations. Include mobile responsiveness and user preferences.",
    },
  ],
  settings: [
    {
      title: "User Management Panel",
      description: "Manage user accounts, roles, and permissions",
      prompt:
        "Create a user management system with user registration, role assignment, permission controls, access logging, password policies, and audit trails. Include bulk user operations and security monitoring.",
    },
    {
      title: "System Configuration Tool",
      description: "Configure application settings and preferences",
      prompt:
        "Build a system configuration interface with environment settings, feature toggles, integration configurations, backup management, and deployment controls. Include configuration validation and rollback capabilities.",
    },
    {
      title: "Admin Dashboard",
      description: "Administrative overview and controls",
      prompt:
        "Design an admin dashboard with system health monitoring, user activity tracking, performance metrics, security alerts, and administrative controls. Include system logs, analytics, and maintenance tools.",
    },
  ],
}

const generationSteps = [
  {
    id: "analyzing",
    title: "Analyzing Requirements",
    description: "AI is understanding your business needs",
    icon: Target,
  },
  {
    id: "designing",
    title: "Designing Interface",
    description: "Creating user experience and layout",
    icon: Eye,
  },
  {
    id: "generating",
    title: "Generating Code",
    description: "Building your custom tool",
    icon: Zap,
  },
  {
    id: "finalizing",
    title: "Finalizing Tool",
    description: "Setting up and testing",
    icon: CheckCircle,
  },
]

export default function CreateToolPage() {
  const [currentStep, setCurrentStep] = useState<"category" | "details" | "generating">("category")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [toolName, setToolName] = useState("")
  const [toolDescription, setToolDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null)
  const [currentToolId, setCurrentToolId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const orgSlug = params?.slug as string

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentStep("details")
  }, [])

  const handleExampleSelect = useCallback((example: any) => {
    setToolName(example.title)
    setToolDescription(example.description)
    setRequirements(example.prompt)
    setActiveTab("requirements")
  }, [])

  const validateForm = useCallback(() => {
    if (!selectedCategory) {
      toast({
        title: "Category Required",
        description: "Please select a tool category to continue.",
        variant: "destructive",
      })
      return false
    }

    if (!toolName.trim()) {
      toast({
        title: "Tool Name Required",
        description: "Please enter a name for your tool.",
        variant: "destructive",
      })
      return false
    }

    if (!requirements.trim() || requirements.length < 20) {
      toast({
        title: "Requirements Too Short",
        description: "Please provide detailed requirements (at least 20 characters).",
        variant: "destructive",
      })
      return false
    }

    return true
  }, [selectedCategory, toolName, requirements, toast])

  const pollToolStatus = useCallback(
    async (toolId: string) => {
      try {
        const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
        if (!response.ok) return

        const status: ToolStatus = await response.json()
        setToolStatus(status)

        if (status.status === "GENERATED" || status.status === "PUBLISHED") {
          setIsGenerating(false)

          const completionMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: `🎉 Excellent! Your tool "${toolName}" has been successfully created! You can now preview it and make any adjustments you need. The tool is fully functional and ready to use.`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, completionMessage])

          toast({
            title: "Tool Created Successfully!",
            description: "Your tool is ready to use. You can now preview and customize it.",
          })
          return
        }

        if (status.status === "ERROR") {
          setIsGenerating(false)

          const errorMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: `❌ I encountered an issue while creating your tool: ${
              status.error || "Unknown error"
            }. Don't worry, let's try again with some adjustments.`,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, errorMessage])

          toast({
            title: "Generation Failed",
            description: status.error || "Unknown error occurred",
            variant: "destructive",
          })
          return
        }

        // Continue polling if still generating
        if (status.status === "GENERATING") {
          setTimeout(() => pollToolStatus(toolId), 3000)
        }
      } catch (error) {
        console.error("Status polling error:", error)
      }
    },
    [orgSlug, toolName, toast],
  )

  const handleStartGeneration = useCallback(async () => {
    if (!validateForm()) return

    setCurrentStep("generating")
    setIsGenerating(true)

    // Add initial user message
    const initialMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: `Create a ${selectedCategory} tool called "${toolName}". ${
        toolDescription ? `Description: ${toolDescription}. ` : ""
      }Requirements: ${requirements}`,
      timestamp: new Date(),
    }
    setMessages([initialMessage])

    try {
      // Start tool generation
      const response = await fetch(`/api/organizations/${orgSlug}/tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: toolName,
          description: toolDescription,
          category: selectedCategory,
          requirements: requirements,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tool")
      }

      const result = await response.json()
      setCurrentToolId(result.toolId)

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Perfect! I'll create your ${selectedCategory} tool "${toolName}" for you. Let me analyze your requirements and start building...`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])

      // Start polling for status
      pollToolStatus(result.toolId)
    } catch (error) {
      console.error("Tool creation error:", error)
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create tool",
        variant: "destructive",
      })
      setIsGenerating(false)
      setCurrentStep("details")
    }
  }, [validateForm, selectedCategory, toolName, toolDescription, requirements, orgSlug, pollToolStatus, toast])

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.trim() || !currentToolId) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage("")
    setIsGenerating(true)

    try {
      // Send message to continue chat
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${currentToolId}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      })

      if (response.ok) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Great feedback! I'm updating your tool based on your suggestions. This will just take a moment...",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])

        // Continue polling
        if (currentToolId) {
          pollToolStatus(currentToolId)
        }
      }
    } catch (error) {
      console.error("Message send error:", error)
      setIsGenerating(false)
    }
  }, [currentMessage, currentToolId, orgSlug, pollToolStatus])

  const selectedCategoryData = toolCategories.find((cat) => cat.id === selectedCategory)
  const categoryExamples = selectedCategory ? examplePrompts[selectedCategory as keyof typeof examplePrompts] : []

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <div className="border-b border-[#444444] bg-[#121212] sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <Link href={`/${orgSlug}/tools`}>
              <Button variant="ghost" size="sm" className="text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-[#E0E0E0]">Create New Tool</h1>
              <p className="text-sm text-[#B0B0B0]">Build a custom business tool with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#444444] rounded-full border border-[#444444]">
            <Sparkles className="h-4 w-4 text-[#B0B0B0]" />
            <span className="text-sm font-medium text-[#E0E0E0]">AI-Powered</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Category Selection */}
        {currentStep === "category" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-[#E0E0E0]">What type of tool do you want to create?</h2>
              <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto">
                Choose a category that best matches your business needs. Our AI will generate a custom tool tailored to
                your specific requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {toolCategories.map((category) => (
                <Card
                  key={category.id}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 group border-[#444444] bg-[#121212] hover:bg-[#444444] ${
                    selectedCategory === category.id ? "ring-2 ring-[#888888] bg-[#444444]" : ""
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} text-white w-fit mx-auto transition-transform group-hover:scale-110`}
                      >
                        <category.icon className="h-8 w-8" />
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="font-semibold text-lg text-[#E0E0E0]">{category.name}</h3>
                        <p className="text-sm text-[#B0B0B0] leading-relaxed">{category.description}</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {category.examples.map((example, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs bg-[#444444] text-[#B0B0B0] border-[#444444]"
                            >
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tool Details */}
        {currentStep === "details" && (
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentStep("category")}
                className="text-[#B0B0B0] hover:text-[#E0E0E0]"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Change Category
              </Button>
              <div className="flex items-center space-x-3">
                {selectedCategoryData && (
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedCategoryData.color} text-white`}>
                    <selectedCategoryData.icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#E0E0E0]">
                    Configure Your {selectedCategoryData?.name} Tool
                  </h2>
                  <p className="text-[#B0B0B0]">Provide details so our AI can create exactly what you need</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-[#B0B0B0]" />
                      <span>Tool Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                      <TabsList className="grid w-full grid-cols-2 bg-[#444444]">
                        <TabsTrigger
                          value="basic"
                          className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
                        >
                          Basic Info
                        </TabsTrigger>
                        <TabsTrigger
                          value="requirements"
                          className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
                        >
                          Requirements
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="basic" className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                              Tool Name <span className="text-red-400">*</span>
                            </label>
                            <Input
                              placeholder="e.g., Sales Dashboard, Customer Survey"
                              value={toolName}
                              onChange={(e) => setToolName(e.target.value)}
                              className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0] h-12"
                            />
                            <p className="text-xs text-[#B0B0B0] mt-1">
                              Choose a clear, descriptive name for your tool
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                              Short Description <span className="text-[#B0B0B0]">(Optional)</span>
                            </label>
                            <Textarea
                              placeholder="Brief description of what this tool does..."
                              value={toolDescription}
                              onChange={(e) => setToolDescription(e.target.value)}
                              rows={3}
                              className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
                            />
                            <p className="text-xs text-[#B0B0B0] mt-1">
                              A brief summary that will help users understand the tool's purpose
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="requirements" className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                            Detailed Requirements <span className="text-red-400">*</span>
                          </label>
                          <Textarea
                            placeholder="Describe exactly what you want your tool to do. Be specific about features, data fields, user interactions, workflows, etc."
                            value={requirements}
                            onChange={(e) => setRequirements(e.target.value)}
                            rows={12}
                            className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
                          />
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-[#B0B0B0]">
                              {requirements.length} characters (minimum 20 required)
                            </p>
                            <div className="flex items-center space-x-2">
                              <Lightbulb className="h-4 w-4 text-yellow-400" />
                              <span className="text-xs text-[#B0B0B0]">More detail = better results</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#444444] rounded-lg p-4 border border-[#444444]">
                          <h4 className="font-medium text-[#E0E0E0] mb-2 flex items-center space-x-2">
                            <Target className="h-4 w-4 text-[#B0B0B0]" />
                            <span>Tips for Great Requirements</span>
                          </h4>
                          <ul className="text-sm text-[#B0B0B0] space-y-1">
                            <li>• Specify what data you need to collect or display</li>
                            <li>• Describe user roles and permissions</li>
                            <li>• Mention any calculations or business logic</li>
                            <li>• Include workflow steps and user interactions</li>
                            <li>• Note any integrations or export needs</li>
                          </ul>
                        </div>
                      </TabsContent>
                    </Tabs>

                    <div className="flex justify-between items-center pt-6 border-t border-[#444444]">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep("category")}
                        className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        onClick={handleStartGeneration}
                        className="bg-[#888888] hover:bg-[#666666] text-[#121212] px-8"
                        disabled={!validateForm()}
                      >
                        <Sparkles className="h-5 w-5 mr-2" />
                        Create Tool
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Examples Sidebar */}
              <div className="space-y-6">
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-400" />
                      <span>Popular Examples</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryExamples.map((example, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-[#444444] border border-[#444444] cursor-pointer hover:bg-[#666666] transition-colors group"
                        onClick={() => handleExampleSelect(example)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-[#E0E0E0] group-hover:text-[#E0E0E0] transition-colors">
                              {example.title}
                            </h4>
                            <p className="text-sm text-[#B0B0B0] mt-1">{example.description}</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[#B0B0B0] group-hover:text-[#E0E0E0] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-[#444444] border-[#444444]">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Clock className="h-5 w-5 text-[#B0B0B0]" />
                      <span className="font-medium text-[#E0E0E0]">Generation Time</span>
                    </div>
                    <p className="text-sm text-[#B0B0B0] mb-4">
                      Most tools are generated in 2-5 minutes. Complex tools with many features may take longer.
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-[#B0B0B0]">
                      <Zap className="h-3 w-3" />
                      <span>Powered by advanced AI</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Generation Progress */}
        {currentStep === "generating" && (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="bg-[#121212] border-[#444444] h-[700px] flex flex-col">
                  <CardHeader className="border-b border-[#444444]">
                    <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
                      <Bot className="h-5 w-5 text-[#B0B0B0]" />
                      <span>AI Assistant</span>
                      {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-[#B0B0B0]" />}
                    </CardTitle>
                  </CardHeader>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex items-start space-x-4 ${
                          message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <div
                          className={`p-3 rounded-full ${message.role === "user" ? "bg-[#888888]" : "bg-[#444444]"}`}
                        >
                          {message.role === "user" ? (
                            <User className="h-4 w-4 text-[#121212]" />
                          ) : (
                            <Bot className="h-4 w-4 text-[#E0E0E0]" />
                          )}
                        </div>
                        <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
                          <div
                            className={`p-4 rounded-2xl ${
                              message.role === "user"
                                ? "bg-[#888888] text-[#121212]"
                                : "bg-[#444444] text-[#E0E0E0] border border-[#444444]"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                          </div>
                          <p className="text-xs text-[#B0B0B0] mt-2 px-2">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-[#444444] p-4">
                    <div className="flex space-x-3">
                      <Input
                        placeholder="Ask for changes or improvements..."
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
                        disabled={isGenerating}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!currentMessage.trim() || isGenerating}
                        className="bg-[#888888] hover:bg-[#666666] text-[#121212] px-6"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-[#B0B0B0] mt-2">
                      You can request changes, add features, or ask questions about your tool
                    </p>
                  </div>
                </Card>
              </div>

              {/* Status Panel */}
              <div className="space-y-6">
                {/* Tool Info */}
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-[#B0B0B0]" />
                      <span>Tool Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Name</p>
                      <p className="text-[#E0E0E0] font-medium">{toolName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Category</p>
                      <Badge className={`bg-gradient-to-r ${selectedCategoryData?.color} text-white border-0`}>
                        {selectedCategoryData?.name}
                      </Badge>
                    </div>
                    {toolDescription && (
                      <div>
                        <p className="text-sm text-[#B0B0B0]">Description</p>
                        <p className="text-[#E0E0E0] text-sm">{toolDescription}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span>Generation Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {toolStatus && (
                      <div>
                        <div className="flex justify-between text-sm mb-3">
                          <span className="text-[#B0B0B0]">Overall Progress</span>
                          <span className="text-[#E0E0E0] font-medium">{toolStatus.progress}%</span>
                        </div>
                        <Progress value={toolStatus.progress} className="h-3" />
                      </div>
                    )}

                    <div className="space-y-4">
                      {generationSteps.map((step, index) => {
                        const isActive = toolStatus?.status === "GENERATING" && index === 1
                        const isCompleted = toolStatus?.progress && toolStatus.progress > (index + 1) * 25
                        const isError = toolStatus?.status === "ERROR"

                        return (
                          <div key={step.id} className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                isError && index === 0
                                  ? "bg-red-500/20 text-red-400"
                                  : isCompleted
                                    ? "bg-green-500/20 text-green-400"
                                    : isActive
                                      ? "bg-[#888888] text-[#121212]"
                                      : "bg-[#444444] text-[#B0B0B0]"
                              }`}
                            >
                              {isError && index === 0 ? (
                                <AlertCircle className="h-4 w-4" />
                              ) : isCompleted ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : isActive ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <step.icon className="h-4 w-4" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-[#E0E0E0]">{step.title}</p>
                              <p className="text-xs text-[#B0B0B0]">{step.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {toolStatus?.demoUrl && (
                      <div className="space-y-3 pt-4 border-t border-[#444444]">
                        <p className="text-sm font-medium text-green-400 flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>Preview Available</span>
                        </p>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white flex-1" asChild>
                            <a href={toolStatus.demoUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                            onClick={() => {
                              if (currentToolId) {
                                router.push(`/${orgSlug}/tools/${currentToolId}`)
                              }
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tips */}
                <Card className="bg-[#444444] border-[#444444]">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Lightbulb className="h-5 w-5 text-yellow-400" />
                      <span className="font-medium text-[#E0E0E0]">Pro Tips</span>
                    </div>
                    <ul className="text-sm text-[#B0B0B0] space-y-2">
                      <li>• You can request changes at any time</li>
                      <li>• Be specific about what you want modified</li>
                      <li>• The AI learns from your feedback</li>
                      <li>• Preview your tool before publishing</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
