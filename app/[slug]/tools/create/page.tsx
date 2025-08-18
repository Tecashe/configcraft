// "use client"

// import type React from "react"

// import { useState, useEffect, useRef, useCallback, useMemo } from "react"
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
//   Code,
//   Download,
//   Terminal,
//   Activity,
//   Wifi,
//   WifiOff,
// } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import Link from "next/link"

// interface ChatMessage {
//   id: string
//   role: "user" | "assistant"
//   content: string
//   timestamp: Date
// }

// interface GeneratedFile {
//   name: string
//   content: string
//   type: string
// }

// interface ToolStatus {
//   id: string
//   status: string
//   generationStatus?: string
//   progress: number
//   demoUrl?: string
//   chatUrl?: string
//   error?: string
//   chatId?: string
//   files?: GeneratedFile[]
//   lastUpdated: string
// }

// interface ToolCategory {
//   id: string
//   name: string
//   icon: any
//   description: string
//   color: string
//   examples: string[]
// }

// interface ExamplePrompt {
//   title: string
//   description: string
//   prompt: string
// }

// const TOOL_CATEGORIES: ToolCategory[] = [
//   {
//     id: "dashboard",
//     name: "Dashboard",
//     icon: BarChart3,
//     description: "Analytics and reporting tools",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["Sales Dashboard", "KPI Tracker", "Performance Monitor"],
//   },
//   {
//     id: "form",
//     name: "Forms",
//     icon: FileText,
//     description: "Data collection and surveys",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["Customer Survey", "Lead Capture", "Feedback Form"],
//   },
//   {
//     id: "calculator",
//     name: "Calculator",
//     icon: Calculator,
//     description: "Financial and business calculators",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["ROI Calculator", "Loan Calculator", "Tax Estimator"],
//   },
//   {
//     id: "crm",
//     name: "CRM",
//     icon: Users,
//     description: "Customer relationship management",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["Contact Manager", "Lead Tracker", "Customer Portal"],
//   },
//   {
//     id: "inventory",
//     name: "Inventory",
//     icon: Database,
//     description: "Stock and asset management",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["Stock Tracker", "Asset Manager", "Warehouse System"],
//   },
//   {
//     id: "scheduler",
//     name: "Scheduler",
//     icon: Calendar,
//     description: "Appointment and task scheduling",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["Appointment Booking", "Task Planner", "Resource Scheduler"],
//   },
//   {
//     id: "ecommerce",
//     name: "E-commerce",
//     icon: ShoppingCart,
//     description: "Online store and sales tools",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["Product Catalog", "Order Manager", "Customer Portal"],
//   },
//   {
//     id: "settings",
//     name: "Settings",
//     icon: Settings,
//     description: "Configuration and admin panels",
//     color: "from-[#444444] to-[#333333]",
//     examples: ["User Management", "System Config", "Admin Panel"],
//   },
// ]

// const EXAMPLE_PROMPTS: Record<string, ExamplePrompt[]> = {
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

// const GENERATION_STEPS = [
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

// const STATUS_MESSAGES: Record<string, string> = {
//   analyzing: "🔍 Analyzing your business requirements and understanding the scope...",
//   designing: "🎨 Designing the user interface and planning the architecture...",
//   generating: "⚡ Writing the code and building your custom tool...",
//   finalizing: "🔧 Setting up the final touches and testing everything...",
//   completed: "✅ Your tool is ready! It's fully functional and deployed.",
//   error: "❌ Something went wrong during generation. Let's try again.",
// }

// export default function CreateToolPage() {
//   // Core state
//   const [currentStep, setCurrentStep] = useState<"category" | "details" | "generating">("category")
//   const [selectedCategory, setSelectedCategory] = useState("")
//   const [toolName, setToolName] = useState("")
//   const [toolDescription, setToolDescription] = useState("")
//   const [requirements, setRequirements] = useState("")
//   const [activeTab, setActiveTab] = useState("basic")

//   // Generation state
//   const [messages, setMessages] = useState<ChatMessage[]>([])
//   const [currentMessage, setCurrentMessage] = useState("")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [toolStatus, setToolStatus] = useState<ToolStatus | null>(null)
//   const [currentToolId, setCurrentToolId] = useState<string | null>(null)
//   const [isPolling, setIsPolling] = useState(false)
//   const [pollingAttempts, setPollingAttempts] = useState(0)
//   const [generationLogs, setGenerationLogs] = useState<string[]>([])
//   const [showLogs, setShowLogs] = useState(false)

//   // Refs and hooks
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const logsEndRef = useRef<HTMLDivElement>(null)
//   const { toast } = useToast()
//   const router = useRouter()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   // Memoized computed values
//   const selectedCategoryData = useMemo(() => {
//     return TOOL_CATEGORIES.find((cat) => cat.id === selectedCategory)
//   }, [selectedCategory])

//   const categoryExamples = useMemo(() => {
//     return selectedCategory ? EXAMPLE_PROMPTS[selectedCategory] || [] : []
//   }, [selectedCategory])

//   const isFormValid = useMemo(() => {
//     return selectedCategory && toolName.trim() && requirements.trim() && requirements.length >= 20
//   }, [selectedCategory, toolName, requirements])

//   // Add log helper
//   const addLog = useCallback((message: string) => {
//     const timestamp = new Date().toLocaleTimeString()
//     setGenerationLogs((prev) => [...prev, `[${timestamp}] ${message}`])
//   }, [])

//   // Scroll effects
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [messages])

//   useEffect(() => {
//     if (logsEndRef.current) {
//       logsEndRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }, [generationLogs])

//   // Event handlers - all memoized with useCallback
//   const handleCategorySelect = useCallback((categoryId: string) => {
//     setSelectedCategory(categoryId)
//     setCurrentStep("details")
//   }, [])

//   const handleExampleSelect = useCallback((example: ExamplePrompt) => {
//     setToolName(example.title)
//     setToolDescription(example.description)
//     setRequirements(example.prompt)
//     setActiveTab("requirements")
//   }, [])

//   const handleToolNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setToolName(e.target.value)
//   }, [])

//   const handleToolDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setToolDescription(e.target.value)
//   }, [])

//   const handleRequirementsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setRequirements(e.target.value)
//   }, [])

//   const handleCurrentMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setCurrentMessage(e.target.value)
//   }, [])

//   const goToCategory = useCallback(() => {
//     setCurrentStep("category")
//   }, [])

//   const goToDetails = useCallback(() => {
//     setCurrentStep("details")
//   }, [])

//   const pollToolStatus = useCallback(
//     async (toolId: string) => {
//       if (!isPolling) return

//       try {
//         setPollingAttempts((prev) => prev + 1)
//         addLog(`Polling status (attempt ${pollingAttempts + 1})...`)

//         const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
//         if (!response.ok) {
//           addLog(`Status check failed: ${response.status}`)
//           return
//         }

//         const status: ToolStatus = await response.json()
//         setToolStatus(status)
//         addLog(`Status: ${status.status} | Generation: ${status.generationStatus} | Progress: ${status.progress}%`)

//         // Update messages based on status
//         if (status.generationStatus && STATUS_MESSAGES[status.generationStatus]) {
//           const statusMessage: ChatMessage = {
//             id: `status-${Date.now()}`,
//             role: "assistant",
//             content: STATUS_MESSAGES[status.generationStatus],
//             timestamp: new Date(),
//           }

//           setMessages((prev) => {
//             const lastMessage = prev[prev.length - 1]
//             if (lastMessage && lastMessage.content === statusMessage.content) {
//               return prev // Don't add duplicate messages
//             }
//             return [...prev, statusMessage]
//           })
//         }

//         if (status.status === "GENERATED" || status.status === "PUBLISHED") {
//           setIsGenerating(false)
//           setIsPolling(false)
//           addLog("✅ Generation completed successfully!")

//           const completionMessage: ChatMessage = {
//             id: Date.now().toString(),
//             role: "assistant",
//             content: `🎉 Excellent! Your tool "${toolName}" has been successfully created! You can now preview it and make any adjustments you need. The tool is fully functional and ready to use.`,
//             timestamp: new Date(),
//           }
//           setMessages((prev) => [...prev, completionMessage])

//           toast({
//             title: "Tool Created Successfully!",
//             description: "Your tool is ready to use. You can now preview and customize it.",
//           })
//           return
//         }

//         if (status.status === "ERROR") {
//           setIsGenerating(false)
//           setIsPolling(false)
//           addLog(`❌ Generation failed: ${status.error}`)

//           const errorMessage: ChatMessage = {
//             id: Date.now().toString(),
//             role: "assistant",
//             content: `❌ I encountered an issue while creating your tool: ${
//               status.error || "Unknown error"
//             }. Don't worry, let's try again with some adjustments.`,
//             timestamp: new Date(),
//           }
//           setMessages((prev) => [...prev, errorMessage])

//           toast({
//             title: "Generation Failed",
//             description: status.error || "Unknown error occurred",
//             variant: "destructive",
//           })
//           return
//         }

//         // Continue polling if still generating
//         if (status.status === "GENERATING" && pollingAttempts < 80) {
//           setTimeout(() => pollToolStatus(toolId), 5000)
//         } else if (pollingAttempts >= 80) {
//           addLog("⏰ Polling timeout reached")
//           setIsPolling(false)
//           toast({
//             title: "Generation Timeout",
//             description: "Generation is taking longer than expected. Please check back later.",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         console.error("Status polling error:", error)
//         addLog(`❌ Polling error: ${error instanceof Error ? error.message : "Unknown error"}`)
//       }
//     },
//     [orgSlug, toolName, toast, isPolling, pollingAttempts, addLog],
//   )

//   const handleStartGeneration = useCallback(async () => {
//     if (!isFormValid) {
//       toast({
//         title: "Form Incomplete",
//         description: "Please fill in all required fields before creating your tool.",
//         variant: "destructive",
//       })
//       return
//     }

//     setCurrentStep("generating")
//     setIsGenerating(true)
//     setIsPolling(true)
//     setPollingAttempts(0)
//     setGenerationLogs([])
//     addLog("🚀 Starting tool creation process...")

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
//       addLog("📤 Sending tool creation request...")

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
//       addLog(`✅ Tool creation initiated with ID: ${result.toolId}`)

//       // Add assistant response
//       const assistantMessage: ChatMessage = {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: `Perfect! I'll create your ${selectedCategory} tool "${toolName}" for you. Let me analyze your requirements and start building...`,
//         timestamp: new Date(),
//       }
//       setMessages((prev) => [...prev, assistantMessage])

//       // Start polling for status
//       setTimeout(() => pollToolStatus(result.toolId), 2000)
//     } catch (error) {
//       console.error("Tool creation error:", error)
//       addLog(`❌ Creation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       toast({
//         title: "Creation Failed",
//         description: error instanceof Error ? error.message : "Failed to create tool",
//         variant: "destructive",
//       })
//       setIsGenerating(false)
//       setIsPolling(false)
//       setCurrentStep("details")
//     }
//   }, [isFormValid, selectedCategory, toolName, toolDescription, requirements, orgSlug, pollToolStatus, toast, addLog])

//   const handleSendMessage = useCallback(async () => {
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
//     addLog(`💬 Sending message: ${currentMessage}`)

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
//         addLog("✅ Message sent successfully")

//         // Continue polling
//         if (currentToolId) {
//           setIsPolling(true)
//           setTimeout(() => pollToolStatus(currentToolId), 2000)
//         }
//       } else {
//         addLog("❌ Failed to send message")
//       }
//     } catch (error) {
//       console.error("Message send error:", error)
//       addLog(`❌ Message send error: ${error instanceof Error ? error.message : "Unknown error"}`)
//       setIsGenerating(false)
//     }
//   }, [currentMessage, currentToolId, orgSlug, pollToolStatus, addLog])

//   const handleKeyPress = useCallback(
//     (e: React.KeyboardEvent) => {
//       if (e.key === "Enter") {
//         handleSendMessage()
//       }
//     },
//     [handleSendMessage],
//   )

//   const handleNavigateToTool = useCallback(() => {
//     if (currentToolId) {
//       router.push(`/${orgSlug}/tools/${currentToolId}`)
//     }
//   }, [currentToolId, orgSlug, router])

//   const handleDownloadFiles = useCallback(() => {
//     if (!toolStatus?.files) return

//     const files = toolStatus.files
//     const zip = files.map((file) => `// ${file.name}\n${file.content}`).join("\n\n// ===== NEXT FILE =====\n\n")

//     const blob = new Blob([zip], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = `${toolName || "tool"}-code.txt`
//     document.body.appendChild(a)
//     a.click()
//     document.body.removeChild(a)
//     URL.revokeObjectURL(url)
//   }, [toolStatus?.files, toolName])

//   return (
//     <div className="min-h-screen bg-[#121212] text-white">
//       {/* Header */}
//       <div className="border-b border-[#444444] bg-[#121212] sticky top-0 z-50">
//         <div className="flex items-center justify-between h-16 px-6">
//           <div className="flex items-center space-x-4">
//             <Link href={`/${orgSlug}/tools`}>
//               <Button variant="ghost" size="sm" className="text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]">
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Tools
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-xl font-semibold text-[#E0E0E0]">Create New Tool</h1>
//               <p className="text-sm text-[#B0B0B0]">Build a custom business tool with AI</p>
//             </div>
//           </div>
//           <div className="flex items-center space-4">
//             {/* Connection Status */}
//             <div className="flex items-center space-x-2">
//               {isPolling ? (
//                 <div className="flex items-center space-x-2 text-green-400">
//                   <Wifi className="h-4 w-4" />
//                   <span className="text-sm">Live</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-2 text-[#B0B0B0]">
//                   <WifiOff className="h-4 w-4" />
//                   <span className="text-sm">Idle</span>
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#444444] rounded-full border border-[#444444]">
//               <Sparkles className="h-4 w-4 text-[#B0B0B0]" />
//               <span className="text-sm font-medium text-[#E0E0E0]">AI-Powered</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto p-6">
//         {/* Category Selection */}
//         {currentStep === "category" && (
//           <div className="space-y-8">
//             <div className="text-center space-y-4">
//               <h2 className="text-3xl font-bold text-[#E0E0E0]">What type of tool do you want to create?</h2>
//               <p className="text-xl text-[#B0B0B0] max-w-3xl mx-auto">
//                 Choose a category that best matches your business needs. Our AI will generate a custom tool tailored to
//                 your specific requirements.
//               </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {TOOL_CATEGORIES.map((category) => {
//                 const IconComponent = category.icon
//                 return (
//                   <Card
//                     key={category.id}
//                     className={`cursor-pointer transition-all duration-300 hover:scale-105 group border-[#444444] bg-[#121212] hover:bg-[#444444] ${
//                       selectedCategory === category.id ? "ring-2 ring-[#888888] bg-[#444444]" : ""
//                     }`}
//                     onClick={() => handleCategorySelect(category.id)}
//                   >
//                     <CardContent className="p-6">
//                       <div className="space-y-4">
//                         <div
//                           className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} text-white w-fit mx-auto transition-transform group-hover:scale-110`}
//                         >
//                           <IconComponent className="h-8 w-8" />
//                         </div>
//                         <div className="text-center space-y-2">
//                           <h3 className="font-semibold text-lg text-[#E0E0E0]">{category.name}</h3>
//                           <p className="text-sm text-[#B0B0B0] leading-relaxed">{category.description}</p>
//                           <div className="flex flex-wrap gap-1 justify-center">
//                             {category.examples.map((example, idx) => (
//                               <Badge
//                                 key={idx}
//                                 variant="secondary"
//                                 className="text-xs bg-[#444444] text-[#B0B0B0] border-[#444444]"
//                               >
//                                 {example}
//                               </Badge>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         {/* Tool Details */}
//         {currentStep === "details" && (
//           <div className="space-y-8">
//             <div className="flex items-center space-x-4">
//               <Button variant="ghost" size="sm" onClick={goToCategory} className="text-[#B0B0B0] hover:text-[#E0E0E0]">
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
//                   <h2 className="text-2xl font-bold text-[#E0E0E0]">
//                     Configure Your {selectedCategoryData?.name} Tool
//                   </h2>
//                   <p className="text-[#B0B0B0]">Provide details so our AI can create exactly what you need</p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               {/* Main Form */}
//               <div className="lg:col-span-2">
//                 <Card className="bg-[#121212] border-[#444444]">
//                   <CardHeader>
//                     <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
//                       <FileText className="h-5 w-5 text-[#B0B0B0]" />
//                       <span>Tool Configuration</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//                       <TabsList className="grid w-full grid-cols-2 bg-[#444444]">
//                         <TabsTrigger
//                           value="basic"
//                           className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
//                         >
//                           Basic Info
//                         </TabsTrigger>
//                         <TabsTrigger
//                           value="requirements"
//                           className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
//                         >
//                           Requirements
//                         </TabsTrigger>
//                       </TabsList>

//                       <TabsContent value="basic" className="space-y-6">
//                         <div className="space-y-4">
//                           <div>
//                             <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
//                               Tool Name <span className="text-red-400">*</span>
//                             </label>
//                             <Input
//                               placeholder="e.g., Sales Dashboard, Customer Survey"
//                               value={toolName}
//                               onChange={handleToolNameChange}
//                               className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0] h-12"
//                             />
//                             <p className="text-xs text-[#B0B0B0] mt-1">
//                               Choose a clear, descriptive name for your tool
//                             </p>
//                           </div>

//                           <div>
//                             <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
//                               Short Description <span className="text-[#B0B0B0]">(Optional)</span>
//                             </label>
//                             <Textarea
//                               placeholder="Brief description of what this tool does..."
//                               value={toolDescription}
//                               onChange={handleToolDescriptionChange}
//                               rows={3}
//                               className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//                             />
//                             <p className="text-xs text-[#B0B0B0] mt-1">
//                               A brief summary that will help users understand the tool's purpose
//                             </p>
//                           </div>
//                         </div>
//                       </TabsContent>

//                       <TabsContent value="requirements" className="space-y-6">
//                         <div>
//                           <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
//                             Detailed Requirements <span className="text-red-400">*</span>
//                           </label>
//                           <Textarea
//                             placeholder="Describe exactly what you want your tool to do. Be specific about features, data fields, user interactions, workflows, etc."
//                             value={requirements}
//                             onChange={handleRequirementsChange}
//                             rows={12}
//                             className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//                           />
//                           <div className="flex items-center justify-between mt-2">
//                             <p className="text-xs text-[#B0B0B0]">
//                               {requirements.length} characters (minimum 20 required)
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               <Lightbulb className="h-4 w-4 text-yellow-400" />
//                               <span className="text-xs text-[#B0B0B0]">More detail = better results</span>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bg-[#444444] rounded-lg p-4 border border-[#444444]">
//                           <h4 className="font-medium text-[#E0E0E0] mb-2 flex items-center space-x-2">
//                             <Target className="h-4 w-4 text-[#B0B0B0]" />
//                             <span>Tips for Great Requirements</span>
//                           </h4>
//                           <ul className="text-sm text-[#B0B0B0] space-y-1">
//                             <li>• Specify what data you need to collect or display</li>
//                             <li>• Describe user roles and permissions</li>
//                             <li>• Mention any calculations or business logic</li>
//                             <li>• Include workflow steps and user interactions</li>
//                             <li>• Note any integrations or export needs</li>
//                           </ul>
//                         </div>
//                       </TabsContent>
//                     </Tabs>

//                     <div className="flex justify-between items-center pt-6 border-t border-[#444444]">
//                       <Button
//                         variant="outline"
//                         onClick={goToCategory}
//                         className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
//                       >
//                         <ArrowLeft className="h-4 w-4 mr-2" />
//                         Back
//                       </Button>
//                       <Button
//                         onClick={handleStartGeneration}
//                         className="bg-[#888888] hover:bg-[#666666] text-[#121212] px-8"
//                         disabled={!isFormValid}
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
//                 <Card className="bg-[#121212] border-[#444444]">
//                   <CardHeader>
//                     <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
//                       <Star className="h-5 w-5 text-yellow-400" />
//                       <span>Popular Examples</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {categoryExamples.map((example, index) => (
//                       <div
//                         key={index}
//                         className="p-4 rounded-lg bg-[#444444] border border-[#444444] cursor-pointer hover:bg-[#666666] transition-colors group"
//                         onClick={() => handleExampleSelect(example)}
//                       >
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1">
//                             <h4 className="font-medium text-[#E0E0E0] group-hover:text-[#E0E0E0] transition-colors">
//                               {example.title}
//                             </h4>
//                             <p className="text-sm text-[#B0B0B0] mt-1">{example.description}</p>
//                           </div>
//                           <ChevronRight className="h-4 w-4 text-[#B0B0B0] group-hover:text-[#E0E0E0] transition-colors" />
//                         </div>
//                       </div>
//                     ))}
//                   </CardContent>
//                 </Card>

//                 <Card className="bg-[#444444] border-[#444444]">
//                   <CardContent className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <Clock className="h-5 w-5 text-[#B0B0B0]" />
//                       <span className="font-medium text-[#E0E0E0]">Generation Time</span>
//                     </div>
//                     <p className="text-sm text-[#B0B0B0] mb-4">
//                       Most tools are generated in 2-5 minutes. Complex tools with many features may take longer.
//                     </p>
//                     <div className="flex items-center space-x-2 text-xs text-[#B0B0B0]">
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
//                 <Card className="bg-[#121212] border-[#444444] h-[700px] flex flex-col">
//                   <CardHeader className="border-b border-[#444444]">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <Bot className="h-5 w-5 text-[#B0B0B0]" />
//                         <span className="text-[#E0E0E0] font-medium">AI Assistant</span>
//                         {isGenerating && <Loader2 className="h-4 w-4 animate-spin text-[#B0B0B0]" />}
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setShowLogs(!showLogs)}
//                           className="text-[#B0B0B0] hover:text-[#E0E0E0]"
//                         >
//                           <Terminal className="h-4 w-4 mr-2" />
//                           {showLogs ? "Hide" : "Show"} Logs
//                         </Button>
//                         {toolStatus?.files && toolStatus.files.length > 0 && (
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={handleDownloadFiles}
//                             className="text-[#B0B0B0] hover:text-[#E0E0E0]"
//                           >
//                             <Download className="h-4 w-4 mr-2" />
//                             Download
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </CardHeader>

//                   {/* Messages or Logs */}
//                   <div className="flex-1 overflow-y-auto p-6">
//                     {showLogs ? (
//                       <div className="space-y-2">
//                         <div className="flex items-center space-x-2 mb-4">
//                           <Activity className="h-4 w-4 text-green-400" />
//                           <span className="text-sm font-medium text-[#E0E0E0]">Generation Logs</span>
//                           <Badge variant="secondary" className="bg-[#444444] text-[#B0B0B0]">
//                             {generationLogs.length} entries
//                           </Badge>
//                         </div>
//                         <div className="bg-black rounded-lg p-4 font-mono text-sm">
//                           {generationLogs.map((log, index) => (
//                             <div key={index} className="text-green-400 mb-1">
//                               {log}
//                             </div>
//                           ))}
//                           <div ref={logsEndRef} />
//                         </div>
//                       </div>
//                     ) : (
//                       <div className="space-y-6">
//                         {messages.map((message) => (
//                           <div
//                             key={message.id}
//                             className={`flex items-start space-x-4 ${
//                               message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
//                             }`}
//                           >
//                             <div
//                               className={`p-3 rounded-full ${
//                                 message.role === "user" ? "bg-[#888888]" : "bg-[#444444]"
//                               }`}
//                             >
//                               {message.role === "user" ? (
//                                 <User className="h-4 w-4 text-[#121212]" />
//                               ) : (
//                                 <Bot className="h-4 w-4 text-[#E0E0E0]" />
//                               )}
//                             </div>
//                             <div className={`flex-1 max-w-[85%] ${message.role === "user" ? "text-right" : ""}`}>
//                               <div
//                                 className={`p-4 rounded-2xl ${
//                                   message.role === "user"
//                                     ? "bg-[#888888] text-[#121212]"
//                                     : "bg-[#444444] text-[#E0E0E0] border border-[#444444]"
//                                 }`}
//                               >
//                                 <p className="text-sm leading-relaxed">{message.content}</p>
//                               </div>
//                               <p className="text-xs text-[#B0B0B0] mt-2 px-2">
//                                 {message.timestamp.toLocaleTimeString()}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                         <div ref={messagesEndRef} />
//                       </div>
//                     )}
//                   </div>

//                   {/* Input */}
//                   <div className="border-t border-[#444444] p-4">
//                     <div className="flex space-x-3">
//                       <Input
//                         placeholder="Ask for changes or improvements..."
//                         value={currentMessage}
//                         onChange={handleCurrentMessageChange}
//                         onKeyPress={handleKeyPress}
//                         className="bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
//                         disabled={isGenerating}
//                       />
//                       <Button
//                         onClick={handleSendMessage}
//                         disabled={!currentMessage.trim() || isGenerating}
//                         className="bg-[#888888] hover:bg-[#666666] text-[#121212] px-6"
//                       >
//                         <Send className="h-4 w-4" />
//                       </Button>
//                     </div>
//                     <p className="text-xs text-[#B0B0B0] mt-2">
//                       You can request changes, add features, or ask questions about your tool
//                     </p>
//                   </div>
//                 </Card>
//               </div>

//               {/* Status Panel */}
//               <div className="space-y-6">
//                 {/* Tool Info */}
//                 <Card className="bg-[#121212] border-[#444444]">
//                   <CardHeader>
//                     <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
//                       <FileText className="h-5 w-5 text-[#B0B0B0]" />
//                       <span>Tool Information</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div>
//                       <p className="text-sm text-[#B0B0B0]">Name</p>
//                       <p className="text-[#E0E0E0] font-medium">{toolName}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-[#B0B0B0]">Category</p>
//                       <Badge className={`bg-gradient-to-r ${selectedCategoryData?.color} text-white border-0`}>
//                         {selectedCategoryData?.name}
//                       </Badge>
//                     </div>
//                     {toolDescription && (
//                       <div>
//                         <p className="text-sm text-[#B0B0B0]">Description</p>
//                         <p className="text-[#E0E0E0] text-sm">{toolDescription}</p>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Progress */}
//                 <Card className="bg-[#121212] border-[#444444]">
//                   <CardHeader>
//                     <CardTitle className="text-[#E0E0E0] flex items-center space-x-2">
//                       <Zap className="h-5 w-5 text-yellow-400" />
//                       <span>Generation Progress</span>
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-6">
//                     {toolStatus && (
//                       <div>
//                         <div className="flex justify-between text-sm mb-3">
//                           <span className="text-[#B0B0B0]">Overall Progress</span>
//                           <span className="text-[#E0E0E0] font-medium">{toolStatus.progress}%</span>
//                         </div>
//                         <Progress value={toolStatus.progress} className="h-3" />
//                       </div>
//                     )}

//                     <div className="space-y-4">
//                       {GENERATION_STEPS.map((step, index) => {
//                         const isActive =
//                           toolStatus?.generationStatus?.toLowerCase() === step.id ||
//                           (toolStatus?.status === "GENERATING" && index === 1)
//                         const isCompleted = toolStatus?.progress && toolStatus.progress > (index + 1) * 25
//                         const isError = toolStatus?.status === "ERROR"
//                         const StepIcon = step.icon

//                         return (
//                           <div key={step.id} className="flex items-center space-x-3">
//                             <div
//                               className={`p-2 rounded-full ${
//                                 isError && index === 0
//                                   ? "bg-red-500/20 text-red-400"
//                                   : isCompleted
//                                     ? "bg-green-500/20 text-green-400"
//                                     : isActive
//                                       ? "bg-[#888888] text-[#121212]"
//                                       : "bg-[#444444] text-[#B0B0B0]"
//                               }`}
//                             >
//                               {isError && index === 0 ? (
//                                 <AlertCircle className="h-4 w-4" />
//                               ) : isCompleted ? (
//                                 <CheckCircle className="h-4 w-4" />
//                               ) : isActive ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <StepIcon className="h-4 w-4" />
//                               )}
//                             </div>
//                             <div className="flex-1">
//                               <p className="text-sm font-medium text-[#E0E0E0]">{step.title}</p>
//                               <p className="text-xs text-[#B0B0B0]">{step.description}</p>
//                             </div>
//                           </div>
//                         )
//                       })}
//                     </div>

//                     {/* Generated Files */}
//                     {toolStatus?.files && toolStatus.files.length > 0 && (
//                       <div className="space-y-3 pt-4 border-t border-[#444444]">
//                         <div className="flex items-center justify-between">
//                           <p className="text-sm font-medium text-[#E0E0E0] flex items-center space-x-2">
//                             <Code className="h-4 w-4 text-[#B0B0B0]" />
//                             <span>Generated Files</span>
//                           </p>
//                           <Badge variant="secondary" className="bg-[#444444] text-[#B0B0B0]">
//                             {toolStatus.files.length}
//                           </Badge>
//                         </div>
//                         <div className="space-y-2 max-h-32 overflow-y-auto">
//                           {toolStatus.files.map((file, index) => (
//                             <div key={index} className="flex items-center space-x-2 text-sm">
//                               <Code className="h-3 w-3 text-[#B0B0B0]" />
//                               <span className="text-[#E0E0E0] font-mono">{file.name}</span>
//                               <Badge variant="outline" className="text-xs border-[#444444] text-[#B0B0B0]">
//                                 {file.type}
//                               </Badge>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Preview Available */}
//                     {toolStatus?.demoUrl && (
//                       <div className="space-y-3 pt-4 border-t border-[#444444]">
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
//                             className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
//                             onClick={handleNavigateToTool}
//                           >
//                             <ExternalLink className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </CardContent>
//                 </Card>

//                 {/* Tips */}
//                 <Card className="bg-[#444444] border-[#444444]">
//                   <CardContent className="p-6">
//                     <div className="flex items-center space-x-3 mb-4">
//                       <Lightbulb className="h-5 w-5 text-yellow-400" />
//                       <span className="font-medium text-[#E0E0E0]">Pro Tips</span>
//                     </div>
//                     <ul className="text-sm text-[#B0B0B0] space-y-2">
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

// import type { Metadata, Viewport } from "next"
// import { Suspense } from "react"
// import CreateToolInterface from "./CreateToolInterface"

// export const metadata: Metadata = {
//   title: "Create Business Tool - ConfigCraft",
//   description: "Generate professional business tools with AI-powered code generation",
//   keywords: ["AI", "tool generation", "business automation", "React", "TypeScript"],
// }

// export const viewport: Viewport = {
//   width: "device-width",
//   initialScale: 1,
//   themeColor: "#000000",
// }

// interface CreateToolPageProps {
//   params: { slug: string }
// }

// export default function CreateToolPage({ params }: CreateToolPageProps) {
//   return (
//     <div className="min-h-screen bg-black">
//       <Suspense
//         fallback={
//           <div className="min-h-screen bg-black flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
//           </div>
//         }
//       >
//         <CreateToolInterface organizationSlug={params.slug} />
//       </Suspense>
//     </div>
//   )
// }


import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import EnhancedCreateToolInterface from "./CreateToolInterface"

interface CreateToolPageProps {
  params: { slug: string }
}

export const metadata: Metadata = {
  title: "Create Business Tool - ConfigCraft",
  description: "Generate professional business tools with AI-powered code generation",
  keywords: ["AI", "tool generation", "business automation", "React", "TypeScript"],
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function CreateToolPage({ params }: CreateToolPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense
        fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
          </div>
        }
      >
        <EnhancedCreateToolInterface organizationSlug={params.slug} />
      </Suspense>
    </div>
  )
}
