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


// import type { Metadata, Viewport } from "next"
// import { Suspense } from "react"
// import EnhancedCreateToolInterface from "./CreateToolInterface"

// interface CreateToolPageProps {
//   params: { slug: string }
// }

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

// export default function CreateToolPage({ params }: CreateToolPageProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Suspense
//         fallback={
//           <div className="min-h-screen bg-background flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
//           </div>
//         }
//       >
//         <EnhancedCreateToolInterface organizationSlug={params.slug} />
//       </Suspense>
//     </div>
//   )
// }


// import type { Metadata, Viewport } from "next"
// import { Suspense } from "react"
// import EnhancedCreateToolInterface from "./CreateToolInterface"

// interface CreateToolPageProps {
//   params: { slug: string }
// }

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

// export default function CreateToolPage({ params }: CreateToolPageProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       <Suspense
//         fallback={
//           <div className="min-h-screen bg-background flex items-center justify-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
//           </div>
//         }
//       >
//         <EnhancedCreateToolInterface organizationSlug={params.slug} />
//       </Suspense>
//     </div>
//   )
// }

// import UltimateGenerationInterface from "@/components/create/ultimate-create-page"

// export default function CreateToolPage() {
//   return <UltimateGenerationInterface />
// }


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import {
//   Sparkles,
//   Rocket,
//   Eye,
//   Download,
//   Loader2,
//   ExternalLink,
//   Copy,
//   ChevronLeft,
//   Zap,
//   Database,
//   CreditCard,
//   Mail,
//   Brain,
//   FileCode,
// } from "lucide-react"
// import { v0ServiceAdvanced, type StreamEvent } from "@/lib/v0-service-advanced"
// import { vercelDeployment } from "@/lib/vercel-deployments"
// import { useToast } from "@/hooks/use-toast"

// interface GeneratedFile {
//   name: string
//   content: string
//   type: string
//   path?: string
// }

// interface GenerationResult {
//   chatId: string
//   demoUrl: string | null
//   webUrl: string
//   files: GeneratedFile[]
// }

// export default function CreateToolPage() {
//   const [step, setStep] = useState<"configure" | "generating" | "preview">("configure")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isDeploying, setIsDeploying] = useState(false)
//   const [generationProgress, setGenerationProgress] = useState(0)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [result, setResult] = useState<GenerationResult | null>(null)
//   const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
//   const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

//   // Form state
//   const [toolName, setToolName] = useState("")
//   const [category, setCategory] = useState("dashboard")
//   const [requirements, setRequirements] = useState("")
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string
//   const logsEndRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [streamingLogs])

//   const addLog = (message: string) => {
//     const timestamp = new Date().toLocaleTimeString()
//     setStreamingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
//   }

//   const handleGenerate = async () => {
//     if (!toolName || !requirements) {
//       toast({ title: "Please fill in tool name and requirements", variant: "destructive" })
//       return
//     }

//     setIsGenerating(true)
//     setGenerationProgress(0)
//     setStreamingLogs([])
//     setStep("generating")

//     try {
//       addLog("🚀 Initializing AI generation engine...")
//       setGenerationProgress(5)

//       const response = await v0ServiceAdvanced.generateToolWithStreaming(
//         {
//           toolName,
//           category,
//           requirements,
//           organizationSlug: orgSlug,
//           userEmail: "user@example.com",
//           integrations: selectedIntegrations,
//           attachments: [],
//           chatPrivacy: "private",
//         },
//         (event: StreamEvent) => {
//           if (event.type === "chunk") {
//             addLog(`${event.data.message}`)
//             setGenerationProgress((prev) => Math.min(prev + 5, 95))
//           } else if (event.type === "complete") {
//             addLog("✅ Generation complete!")
//             setGenerationProgress(100)
//           } else if (event.type === "error") {
//             addLog(`❌ Error: ${event.data.error}`)
//           }
//         },
//       )

//       const latestVersion = (response as any).latestVersion
//       const files: GeneratedFile[] =
//         latestVersion?.files?.map((file: any) => ({
//           name: file.name || file.path || "unnamed",
//           content: file.content || file.data || "",
//           type: file.type || file.language || "typescript",
//           path: file.path,
//         })) || []

//       const generationResult: GenerationResult = {
//         chatId: response.id,
//         demoUrl: latestVersion?.demoUrl || null,
//         webUrl: (response as any).webUrl || "",
//         files,
//       }

//       setResult(generationResult)
//       if (files.length > 0) {
//         setSelectedFile(files[0])
//       }

//       addLog(`✨ Generated ${files.length} files successfully!`)
//       setStep("preview")
//       toast({ title: "Tool generated successfully!" })
//     } catch (error) {
//       addLog(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       toast({ title: "Generation failed", description: "Please try again", variant: "destructive" })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleDeploy = async () => {
//     if (!result || result.files.length === 0) {
//       toast({ title: "No files to deploy", variant: "destructive" })
//       return
//     }

//     setIsDeploying(true)
//     addLog("🚀 Starting deployment to Vercel...")

//     try {
//       const deploymentResult = await vercelDeployment.deployToVercel({
//         projectName: toolName.toLowerCase().replace(/\s+/g, "-"),
//         files: result.files.map((file) => ({
//           path: file.path || file.name,
//           content: file.content,
//         })),
//       })

//       if (deploymentResult.success) {
//         setDeploymentUrl(deploymentResult.url || null)
//         addLog(`✅ Deployed successfully! URL: ${deploymentResult.url}`)
//         toast({ title: "Deployed successfully!", description: deploymentResult.url })
//       } else {
//         addLog(`❌ Deployment failed: ${deploymentResult.error}`)
//         toast({ title: "Deployment failed", variant: "destructive" })
//       }
//     } catch (error) {
//       addLog(`❌ Deployment error: ${error instanceof Error ? error.message : "Unknown error"}`)
//       toast({ title: "Deployment error", variant: "destructive" })
//     } finally {
//       setIsDeploying(false)
//     }
//   }

//   const downloadFiles = () => {
//     if (!result) return

//     result.files.forEach((file) => {
//       const blob = new Blob([file.content], { type: "text/plain" })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = file.name
//       a.click()
//       URL.revokeObjectURL(url)
//     })

//     toast({ title: `Downloaded ${result.files.length} files` })
//   }

//   const integrationOptions = [
//     { id: "supabase", name: "Supabase", icon: Database, color: "emerald" },
//     { id: "stripe", name: "Stripe", icon: CreditCard, color: "purple" },
//     { id: "openai", name: "OpenAI", icon: Brain, color: "blue" },
//     { id: "resend", name: "Resend", icon: Mail, color: "orange" },
//   ]

//   return (
//     <div className="min-h-screen bg-[#121212]">
//       <div className="border-b border-[#444444] bg-[#121212]/80 backdrop-blur-xl sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => router.push(`/${orgSlug}/tools`)}
//               className="text-[#B0B0B0] hover:text-[#E0E0E0] hover:bg-[#444444]"
//             >
//               <ChevronLeft className="h-4 w-4 mr-1" />
//               Back
//             </Button>
//             <div className="h-6 w-px bg-[#444444]" />
//             <div className="flex items-center gap-3">
//               <div
//                 className={`w-2 h-2 rounded-full ${step === "configure" ? "bg-[#888888]" : step === "generating" ? "bg-purple-400 animate-pulse" : "bg-emerald-400"}`}
//               />
//               <span className="text-[#E0E0E0] font-medium">
//                 {step === "configure" ? "Configure" : step === "generating" ? "Generating" : "Preview"}
//               </span>
//             </div>
//           </div>
//           {step === "preview" && result && (
//             <div className="flex items-center gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={downloadFiles}
//                 className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] hover:text-[#E0E0E0] bg-transparent"
//               >
//                 <Download className="h-4 w-4 mr-2" />
//                 Download
//               </Button>
//               <Button
//                 size="sm"
//                 onClick={handleDeploy}
//                 disabled={isDeploying}
//                 className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
//               >
//                 {isDeploying ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Rocket className="h-4 w-4 mr-2" />}
//                 Deploy
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {step === "configure" && (
//         <div className="max-w-4xl mx-auto px-6 py-12">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-[#888888]/10 rounded-2xl mb-6">
//               <Sparkles className="h-8 w-8 text-[#888888]" />
//             </div>
//             <h1 className="text-4xl font-bold text-[#E0E0E0] mb-3">Create Your Tool</h1>
//             <p className="text-[#B0B0B0] text-lg">Describe what you want to build and let AI do the rest</p>
//           </div>

//           <div className="space-y-8">
//             <Card className="bg-[#1a1a1a] border-[#444444] p-8">
//               <div className="space-y-6">
//                 <div>
//                   <Label htmlFor="toolName" className="text-base font-semibold text-[#E0E0E0] mb-3 block">
//                     Tool Name
//                   </Label>
//                   <Input
//                     id="toolName"
//                     value={toolName}
//                     onChange={(e) => setToolName(e.target.value)}
//                     placeholder="e.g., Customer Support Dashboard"
//                     className="h-12 bg-[#0a0a0a] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0] focus:border-[#888888]"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="category" className="text-base font-semibold text-[#E0E0E0] mb-3 block">
//                     Category
//                   </Label>
//                   <select
//                     id="category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full h-12 px-4 rounded-md bg-[#0a0a0a] border border-[#444444] text-[#E0E0E0] focus:border-[#888888] focus:outline-none"
//                   >
//                     <option value="dashboard">Dashboard</option>
//                     <option value="form">Form</option>
//                     <option value="landing-page">Landing Page</option>
//                     <option value="admin-panel">Admin Panel</option>
//                     <option value="e-commerce">E-commerce</option>
//                     <option value="analytics">Analytics</option>
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="requirements" className="text-base font-semibold text-[#E0E0E0] mb-3 block">
//                     Requirements
//                   </Label>
//                   <Textarea
//                     id="requirements"
//                     value={requirements}
//                     onChange={(e) => setRequirements(e.target.value)}
//                     placeholder="Describe your tool in detail. What features do you need? What should it look like? Who will use it?"
//                     rows={10}
//                     className="bg-[#0a0a0a] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0] focus:border-[#888888] resize-none"
//                   />
//                   <p className="text-sm text-[#B0B0B0] mt-2">{requirements.length} characters</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="bg-[#1a1a1a] border-[#444444] p-8">
//               <Label className="text-base font-semibold text-[#E0E0E0] mb-4 block">
//                 Integrations <span className="text-[#B0B0B0] font-normal">(Optional)</span>
//               </Label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {integrationOptions.map((integration) => {
//                   const Icon = integration.icon
//                   const isSelected = selectedIntegrations.includes(integration.id)
//                   return (
//                     <button
//                       key={integration.id}
//                       onClick={() => {
//                         setSelectedIntegrations((prev) =>
//                           prev.includes(integration.id)
//                             ? prev.filter((i) => i !== integration.id)
//                             : [...prev, integration.id],
//                         )
//                       }}
//                       className={`p-6 rounded-xl border-2 transition-all ${
//                         isSelected
//                           ? "border-[#888888] bg-[#888888]/10"
//                           : "border-[#444444] bg-[#0a0a0a] hover:border-[#666666]"
//                       }`}
//                     >
//                       <Icon className={`h-8 w-8 mx-auto mb-3 ${isSelected ? "text-[#888888]" : "text-[#B0B0B0]"}`} />
//                       <p className={`text-sm font-medium ${isSelected ? "text-[#E0E0E0]" : "text-[#B0B0B0]"}`}>
//                         {integration.name}
//                       </p>
//                     </button>
//                   )
//                 })}
//               </div>
//             </Card>

//             <Button
//               onClick={handleGenerate}
//               disabled={isGenerating || !toolName || !requirements}
//               className="w-full h-14 text-lg bg-[#888888] hover:bg-[#666666] text-[#121212] font-semibold"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="h-5 w-5 mr-2" />
//                   Generate Tool
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//       {step === "generating" && (
//         <div className="h-[calc(100vh-73px)] flex items-center justify-center p-6">
//           <div className="w-full max-w-4xl space-y-8">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-500/10 rounded-full mb-6 relative">
//                 <Sparkles className="h-10 w-10 text-purple-400 animate-pulse" />
//                 <div className="absolute inset-0 rounded-full border-2 border-purple-400/20 animate-ping" />
//               </div>
//               <h2 className="text-3xl font-bold text-[#E0E0E0] mb-2">Generating Your Tool</h2>
//               <p className="text-[#B0B0B0]">AI is crafting your custom tool...</p>
//             </div>

//             <Card className="bg-[#1a1a1a] border-[#444444] p-8">
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <span className="text-[#E0E0E0] font-medium">Progress</span>
//                   <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-base px-4 py-1">
//                     {generationProgress}%
//                   </Badge>
//                 </div>

//                 <div className="w-full bg-[#0a0a0a] rounded-full h-3 overflow-hidden">
//                   <div
//                     className="h-full bg-[#888888] transition-all duration-500 ease-out"
//                     style={{ width: `${generationProgress}%` }}
//                   />
//                 </div>

//                 <div className="bg-[#0a0a0a] rounded-lg p-6 h-96 overflow-y-auto font-mono text-sm space-y-1">
//                   {streamingLogs.map((log, index) => (
//                     <div key={index} className="text-[#B0B0B0]">
//                       {log}
//                     </div>
//                   ))}
//                   <div ref={logsEndRef} />
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       )}

//       {step === "preview" && result && (
//         <div className="h-[calc(100vh-73px)] flex">
//           <div className="w-80 border-r border-[#444444] bg-[#1a1a1a] flex flex-col">
//             <div className="p-4 border-b border-[#444444]">
//               <h3 className="text-sm font-semibold text-[#E0E0E0] mb-1">Generated Files</h3>
//               <p className="text-xs text-[#B0B0B0]">{result.files.length} files</p>
//             </div>
//             <div className="flex-1 overflow-y-auto p-2 space-y-1">
//               {result.files.map((file, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setSelectedFile(file)}
//                   className={`w-full text-left p-3 rounded-lg transition-colors ${
//                     selectedFile === file ? "bg-[#888888] text-[#121212]" : "text-[#B0B0B0] hover:bg-[#444444]"
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <FileCode className="h-4 w-4 flex-shrink-0" />
//                     <span className="text-sm font-mono truncate">{file.name}</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex-1 flex flex-col bg-[#0a0a0a]">
//             {result.demoUrl ? (
//               <>
//                 <div className="p-4 border-b border-[#444444] flex items-center justify-between bg-[#1a1a1a]">
//                   <div className="flex items-center gap-3">
//                     <div className="flex items-center gap-1.5">
//                       <div className="w-3 h-3 rounded-full bg-red-400" />
//                       <div className="w-3 h-3 rounded-full bg-yellow-400" />
//                       <div className="w-3 h-3 rounded-full bg-emerald-400" />
//                     </div>
//                     <span className="text-sm text-[#B0B0B0] font-mono">{result.demoUrl}</span>
//                   </div>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => window.open(result.demoUrl!, "_blank")}
//                     className="text-[#B0B0B0] hover:text-[#E0E0E0]"
//                   >
//                     <ExternalLink className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <iframe
//                   src={result.demoUrl}
//                   className="flex-1 w-full bg-white"
//                   title="Generated Tool Preview"
//                   sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//                 />
//               </>
//             ) : selectedFile ? (
//               <div className="flex-1 flex flex-col">
//                 <div className="p-4 border-b border-[#444444] flex items-center justify-between bg-[#1a1a1a]">
//                   <span className="text-sm font-mono text-[#E0E0E0]">{selectedFile.name}</span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       navigator.clipboard.writeText(selectedFile.content)
//                       toast({ title: "Copied to clipboard" })
//                     }}
//                     className="text-[#B0B0B0] hover:text-[#E0E0E0]"
//                   >
//                     <Copy className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="flex-1 overflow-auto p-6">
//                   <pre className="text-sm text-[#E0E0E0] font-mono whitespace-pre-wrap break-words">
//                     <code>{selectedFile.content}</code>
//                   </pre>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex-1 flex items-center justify-center">
//                 <div className="text-center text-[#B0B0B0]">
//                   <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
//                   <p className="text-lg">Select a file to view</p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import {
//   Sparkles,
//   Rocket,
//   Download,
//   Loader2,
//   ExternalLink,
//   Copy,
//   ChevronLeft,
//   Zap,
//   Database,
//   CreditCard,
//   Mail,
//   Brain,
//   FileCode,
//   Maximize2,
//   Minimize2,
//   Code2,
//   Monitor,
//   SplitSquareHorizontal,
//   Search,
//   Check,
//   ChevronRight,
//   Settings,
//   RefreshCw,
//   X,
// } from "lucide-react"
// import { v0ServiceAdvanced, type StreamEvent } from "@/lib/v0-service-advanced"
// import { vercelDeployment } from "@/lib/vercel-deployments"
// import { useToast } from "@/hooks/use-toast"

// interface GeneratedFile {
//   name: string
//   content: string
//   type: string
//   path?: string
// }

// interface GenerationResult {
//   chatId: string
//   demoUrl: string | null
//   webUrl: string
//   files: GeneratedFile[]
// }

// type ViewMode = "preview" | "code" | "split"

// export default function CreateToolPage() {
//   const [step, setStep] = useState<"configure" | "generating" | "preview">("configure")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isDeploying, setIsDeploying] = useState(false)
//   const [generationProgress, setGenerationProgress] = useState(0)
//   const [streamingLogs, setStreamingLogs] = useState<string[]>([])
//   const [result, setResult] = useState<GenerationResult | null>(null)
//   const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
//   const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

//   const [viewMode, setViewMode] = useState<ViewMode>("preview")
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [fileSearchQuery, setFileSearchQuery] = useState("")
//   const [showLogs, setShowLogs] = useState(false)
//   const [iframeScale, setIframeScale] = useState(100)

//   // Form state
//   const [toolName, setToolName] = useState("")
//   const [category, setCategory] = useState("dashboard")
//   const [requirements, setRequirements] = useState("")
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string
//   const logsEndRef = useRef<HTMLDivElement>(null)
//   const iframeRef = useRef<HTMLIFrameElement>(null)

//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [streamingLogs])

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (step !== "preview") return

//       if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setIsFullscreen(!isFullscreen)
//       }
//       if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setShowLogs(!showLogs)
//       }
//     }

//     window.addEventListener("keydown", handleKeyPress)
//     return () => window.removeEventListener("keydown", handleKeyPress)
//   }, [step, isFullscreen, showLogs])

//   const addLog = (message: string) => {
//     const timestamp = new Date().toLocaleTimeString()
//     setStreamingLogs((prev) => [...prev, `[${timestamp}] ${message}`])
//   }

//   const handleGenerate = async () => {
//     if (!toolName || !requirements) {
//       toast({ title: "Please fill in tool name and requirements", variant: "destructive" })
//       return
//     }

//     setIsGenerating(true)
//     setGenerationProgress(0)
//     setStreamingLogs([])
//     setStep("generating")

//     try {
//       addLog("🚀 Initializing AI generation engine...")
//       setGenerationProgress(5)

//       const response = await v0ServiceAdvanced.generateToolWithStreaming(
//         {
//           toolName,
//           category,
//           requirements,
//           organizationSlug: orgSlug,
//           userEmail: "user@example.com",
//           integrations: selectedIntegrations,
//           attachments: [],
//           chatPrivacy: "private",
//         },
//         (event: StreamEvent) => {
//           if (event.type === "chunk") {
//             addLog(`${event.data.message}`)
//             setGenerationProgress((prev) => Math.min(prev + 5, 95))
//           } else if (event.type === "complete") {
//             addLog("✅ Generation complete!")
//             setGenerationProgress(100)
//           } else if (event.type === "error") {
//             addLog(`❌ Error: ${event.data.error}`)
//           }
//         },
//       )

//       const latestVersion = (response as any).latestVersion
//       const files: GeneratedFile[] =
//         latestVersion?.files?.map((file: any) => ({
//           name: file.name || file.path || "unnamed",
//           content: file.content || file.data || "",
//           type: file.type || file.language || "typescript",
//           path: file.path,
//         })) || []

//       const generationResult: GenerationResult = {
//         chatId: response.id,
//         demoUrl: latestVersion?.demoUrl || null,
//         webUrl: (response as any).webUrl || "",
//         files,
//       }

//       setResult(generationResult)
//       if (files.length > 0) {
//         setSelectedFile(files[0])
//       }

//       addLog(`✨ Generated ${files.length} files successfully!`)
//       setStep("preview")
//       setViewMode(generationResult.demoUrl ? "preview" : "code")
//       toast({ title: "Tool generated successfully!" })
//     } catch (error) {
//       addLog(`❌ Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`)
//       toast({ title: "Generation failed", description: "Please try again", variant: "destructive" })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleDeploy = async () => {
//     if (!result || result.files.length === 0) {
//       toast({ title: "No files to deploy", variant: "destructive" })
//       return
//     }

//     setIsDeploying(true)
//     addLog("🚀 Starting deployment to Vercel...")

//     try {
//       const deploymentResult = await vercelDeployment.deployToVercel({
//         projectName: toolName.toLowerCase().replace(/\s+/g, "-"),
//         files: result.files.map((file) => ({
//           path: file.path || file.name,
//           content: file.content,
//         })),
//       })

//       if (deploymentResult.success) {
//         setDeploymentUrl(deploymentResult.url || null)
//         addLog(`✅ Deployed successfully! URL: ${deploymentResult.url}`)
//         toast({ title: "Deployed successfully!", description: deploymentResult.url })
//       } else {
//         addLog(`❌ Deployment failed: ${deploymentResult.error}`)
//         toast({ title: "Deployment failed", variant: "destructive" })
//       }
//     } catch (error) {
//       addLog(`❌ Deployment error: ${error instanceof Error ? error.message : "Unknown error"}`)
//       toast({ title: "Deployment error", variant: "destructive" })
//     } finally {
//       setIsDeploying(false)
//     }
//   }

//   const downloadFiles = () => {
//     if (!result) return

//     result.files.forEach((file) => {
//       const blob = new Blob([file.content], { type: "text/plain" })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = file.name
//       a.click()
//       URL.revokeObjectURL(url)
//     })

//     toast({ title: `Downloaded ${result.files.length} files` })
//   }

//   const downloadSingleFile = (file: GeneratedFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     a.click()
//     URL.revokeObjectURL(url)
//     toast({ title: `Downloaded ${file.name}` })
//   }

//   const filteredFiles =
//     result?.files.filter((file) => file.name.toLowerCase().includes(fileSearchQuery.toLowerCase())) || []

//   const integrationOptions = [
//     { id: "supabase", name: "Supabase", icon: Database, color: "emerald" },
//     { id: "stripe", name: "Stripe", icon: CreditCard, color: "purple" },
//     { id: "openai", name: "OpenAI", icon: Brain, color: "blue" },
//     { id: "resend", name: "Resend", icon: Mail, color: "orange" },
//   ]

//   return (
//     <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
//       <div className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
//         <div className="max-w-[2000px] mx-auto px-4 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             {!isFullscreen && (
//               <>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => router.push(`/${orgSlug}/tools`)}
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-1" />
//                   Back
//                 </Button>
//                 <div className="h-5 w-px bg-border" />
//               </>
//             )}
//             <div className="flex items-center gap-2">
//               <div
//                 className={`w-2 h-2 rounded-full transition-colors ${
//                   step === "configure"
//                     ? "bg-muted-foreground"
//                     : step === "generating"
//                       ? "bg-primary animate-pulse"
//                       : "bg-emerald-500"
//                 }`}
//               />
//               <span className="text-sm font-medium text-foreground">
//                 {step === "configure" ? "Configure" : step === "generating" ? "Generating" : toolName || "Preview"}
//               </span>
//             </div>
//           </div>

//           {step === "preview" && result && (
//             <div className="flex items-center gap-2">
//               {result.demoUrl && (
//                 <div className="flex items-center gap-1 mr-2 bg-muted rounded-lg p-1">
//                   <Button
//                     variant={viewMode === "preview" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("preview")}
//                     className="h-7 px-2"
//                   >
//                     <Monitor className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant={viewMode === "code" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("code")}
//                     className="h-7 px-2"
//                   >
//                     <Code2 className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant={viewMode === "split" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("split")}
//                     className="h-7 px-2"
//                   >
//                     <SplitSquareHorizontal className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               )}

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowLogs(!showLogs)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <Settings className="h-4 w-4" />
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
//               </Button>

//               <div className="h-5 w-px bg-border" />

//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={downloadFiles}
//                 className="text-muted-foreground hover:text-foreground bg-transparent"
//               >
//                 <Download className="h-4 w-4 mr-1.5" />
//                 All
//               </Button>

//               <Button
//                 size="sm"
//                 onClick={handleDeploy}
//                 disabled={isDeploying}
//                 className="bg-primary hover:bg-primary/90"
//               >
//                 {isDeploying ? (
//                   <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
//                 ) : (
//                   <Rocket className="h-4 w-4 mr-1.5" />
//                 )}
//                 Deploy
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {step === "configure" && (
//         <div className="max-w-5xl mx-auto px-6 py-12">
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
//               <Sparkles className="h-8 w-8 text-primary" />
//             </div>
//             <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Create Your Tool</h1>
//             <p className="text-muted-foreground text-lg text-pretty">
//               Describe what you want to build and let AI do the rest
//             </p>
//           </div>

//           <div className="space-y-6">
//             <Card className="bg-card border-border p-8">
//               <div className="space-y-6">
//                 <div>
//                   <Label htmlFor="toolName" className="text-base font-semibold text-foreground mb-3 block">
//                     Tool Name
//                   </Label>
//                   <Input
//                     id="toolName"
//                     value={toolName}
//                     onChange={(e) => setToolName(e.target.value)}
//                     placeholder="e.g., Customer Support Dashboard"
//                     className="h-12 bg-background border-border text-foreground placeholder-muted-foreground"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="category" className="text-base font-semibold text-foreground mb-3 block">
//                     Category
//                   </Label>
//                   <select
//                     id="category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full h-12 px-4 rounded-lg bg-background border border-border text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
//                   >
//                     <option value="dashboard">Dashboard</option>
//                     <option value="form">Form</option>
//                     <option value="landing-page">Landing Page</option>
//                     <option value="admin-panel">Admin Panel</option>
//                     <option value="e-commerce">E-commerce</option>
//                     <option value="analytics">Analytics</option>
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="requirements" className="text-base font-semibold text-foreground mb-3 block">
//                     Requirements
//                   </Label>
//                   <Textarea
//                     id="requirements"
//                     value={requirements}
//                     onChange={(e) => setRequirements(e.target.value)}
//                     placeholder="Describe your tool in detail. What features do you need? What should it look like? Who will use it?"
//                     rows={10}
//                     className="bg-background border-border text-foreground placeholder-muted-foreground resize-none"
//                   />
//                   <p className="text-sm text-muted-foreground mt-2">{requirements.length} characters</p>
//                 </div>
//               </div>
//             </Card>

//             <Card className="bg-card border-border p-8">
//               <Label className="text-base font-semibold text-foreground mb-4 block">
//                 Integrations <span className="text-muted-foreground font-normal">(Optional)</span>
//               </Label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {integrationOptions.map((integration) => {
//                   const Icon = integration.icon
//                   const isSelected = selectedIntegrations.includes(integration.id)
//                   return (
//                     <button
//                       key={integration.id}
//                       onClick={() => {
//                         setSelectedIntegrations((prev) =>
//                           prev.includes(integration.id)
//                             ? prev.filter((i) => i !== integration.id)
//                             : [...prev, integration.id],
//                         )
//                       }}
//                       className={`p-6 rounded-xl border-2 transition-all ${
//                         isSelected
//                           ? "border-primary bg-primary/10"
//                           : "border-border bg-background hover:border-primary/50"
//                       }`}
//                     >
//                       <Icon
//                         className={`h-8 w-8 mx-auto mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
//                       />
//                       <p className={`text-sm font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
//                         {integration.name}
//                       </p>
//                     </button>
//                   )
//                 })}
//               </div>
//             </Card>

//             <Button
//               onClick={handleGenerate}
//               disabled={isGenerating || !toolName || !requirements}
//               className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   Generating...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="h-5 w-5 mr-2" />
//                   Generate Tool
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//       {step === "generating" && (
//         <div className="h-[calc(100vh-73px)] flex items-center justify-center p-6">
//           <div className="w-full max-w-4xl space-y-8">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 relative">
//                 <Sparkles className="h-10 w-10 text-primary animate-pulse" />
//                 <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
//               </div>
//               <h2 className="text-3xl font-bold text-foreground mb-2">Generating Your Tool</h2>
//               <p className="text-muted-foreground">AI is crafting your custom tool...</p>
//             </div>

//             <Card className="bg-card border-border p-8">
//               <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                   <span className="text-foreground font-medium">Progress</span>
//                   <Badge className="bg-primary/10 text-primary border-primary/20 text-base px-4 py-1">
//                     {generationProgress}%
//                   </Badge>
//                 </div>

//                 <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
//                   <div
//                     className="h-full bg-primary transition-all duration-500 ease-out"
//                     style={{ width: `${generationProgress}%` }}
//                   />
//                 </div>

//                 <div className="bg-background rounded-lg p-6 h-96 overflow-y-auto font-mono text-sm space-y-1">
//                   {streamingLogs.map((log, index) => (
//                     <div key={index} className="text-muted-foreground">
//                       {log}
//                     </div>
//                   ))}
//                   <div ref={logsEndRef} />
//                 </div>
//               </div>
//             </Card>
//           </div>
//         </div>
//       )}

//       {step === "preview" && result && (
//         <div className={`flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-73px)]"}`}>
//           <div
//             className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
//               isSidebarCollapsed ? "w-12" : "w-80"
//             }`}
//           >
//             {isSidebarCollapsed ? (
//               <div className="p-2">
//                 <Button variant="ghost" size="sm" onClick={() => setIsSidebarCollapsed(false)} className="w-full">
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="p-4 border-b border-border space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-sm font-semibold text-foreground">Files</h3>
//                       <p className="text-xs text-muted-foreground">{result.files.length} total</p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setIsSidebarCollapsed(true)}
//                       className="h-7 w-7 p-0"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       value={fileSearchQuery}
//                       onChange={(e) => setFileSearchQuery(e.target.value)}
//                       placeholder="Search files..."
//                       className="pl-9 h-9 bg-background"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-2 space-y-1">
//                   {filteredFiles.map((file, index) => (
//                     <div
//                       key={index}
//                       className={`group rounded-lg transition-colors ${
//                         selectedFile === file ? "bg-primary text-primary-foreground" : "hover:bg-muted"
//                       }`}
//                     >
//                       <button
//                         onClick={() => setSelectedFile(file)}
//                         className="w-full text-left p-3 flex items-center gap-2"
//                       >
//                         <FileCode className="h-4 w-4 flex-shrink-0" />
//                         <span className="text-sm font-mono truncate flex-1">{file.name}</span>
//                         {selectedFile === file && <Check className="h-4 w-4 flex-shrink-0" />}
//                       </button>
//                       <div className="px-3 pb-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             navigator.clipboard.writeText(file.content)
//                             toast({ title: "Copied to clipboard" })
//                           }}
//                           className="h-6 px-2 text-xs"
//                         >
//                           <Copy className="h-3 w-3 mr-1" />
//                           Copy
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             downloadSingleFile(file)
//                           }}
//                           className="h-6 px-2 text-xs"
//                         >
//                           <Download className="h-3 w-3 mr-1" />
//                           Save
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}
//           </div>

//           <div className="flex-1 flex flex-col bg-background overflow-hidden">
//             {/* Preview/Code Area */}
//             <div className="flex-1 flex overflow-hidden">
//               {/* Preview Panel */}
//               {(viewMode === "preview" || viewMode === "split") && result.demoUrl && (
//                 <div
//                   className={`flex flex-col bg-muted ${viewMode === "split" ? "w-1/2 border-r border-border" : "flex-1"}`}
//                 >
//                   <div className="p-3 border-b border-border flex items-center justify-between bg-card">
//                     <div className="flex items-center gap-2 flex-1 min-w-0">
//                       <div className="flex items-center gap-1.5">
//                         <div className="w-3 h-3 rounded-full bg-red-400" />
//                         <div className="w-3 h-3 rounded-full bg-yellow-400" />
//                         <div className="w-3 h-3 rounded-full bg-emerald-400" />
//                       </div>
//                       <span className="text-xs text-muted-foreground font-mono truncate">{result.demoUrl}</span>
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           if (iframeRef.current) {
//                             iframeRef.current.src = result.demoUrl!
//                           }
//                         }}
//                         className="h-7 w-7 p-0"
//                       >
//                         <RefreshCw className="h-3.5 w-3.5" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => window.open(result.demoUrl!, "_blank")}
//                         className="h-7 w-7 p-0"
//                       >
//                         <ExternalLink className="h-3.5 w-3.5" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex-1 relative overflow-hidden">
//                     <iframe
//                       ref={iframeRef}
//                       src={result.demoUrl}
//                       className="absolute inset-0 w-full h-full bg-white"
//                       title="Generated Tool Preview"
//                       sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//                       style={{
//                         transform: `scale(${iframeScale / 100})`,
//                         transformOrigin: "top left",
//                         width: `${(100 / iframeScale) * 100}%`,
//                         height: `${(100 / iframeScale) * 100}%`,
//                       }}
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Code Panel */}
//               {(viewMode === "code" || viewMode === "split" || !result.demoUrl) && selectedFile && (
//                 <div className={`flex flex-col ${viewMode === "split" && result.demoUrl ? "w-1/2" : "flex-1"}`}>
//                   <div className="p-3 border-b border-border flex items-center justify-between bg-card">
//                     <span className="text-sm font-mono text-foreground">{selectedFile.name}</span>
//                     <div className="flex items-center gap-1">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           navigator.clipboard.writeText(selectedFile.content)
//                           toast({ title: "Copied to clipboard" })
//                         }}
//                         className="h-7 px-2 text-xs"
//                       >
//                         <Copy className="h-3.5 w-3.5 mr-1" />
//                         Copy
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => downloadSingleFile(selectedFile)}
//                         className="h-7 px-2 text-xs"
//                       >
//                         <Download className="h-3.5 w-3.5 mr-1" />
//                         Download
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex-1 overflow-auto p-6 bg-background">
//                     <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-words leading-relaxed">
//                       <code>{selectedFile.content}</code>
//                     </pre>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {showLogs && (
//               <div className="border-t border-border bg-card h-64 flex flex-col">
//                 <div className="p-3 border-b border-border flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Settings className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-semibold text-foreground">Generation Logs</span>
//                     <Badge variant="secondary" className="text-xs">
//                       {streamingLogs.length}
//                     </Badge>
//                   </div>
//                   <Button variant="ghost" size="sm" onClick={() => setShowLogs(false)} className="h-7 w-7 p-0">
//                     <X className="h-4 w-4" />
//                   </Button>
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-background">
//                   {streamingLogs.map((log, index) => (
//                     <div key={index} className="text-muted-foreground">
//                       {log}
//                     </div>
//                   ))}
//                   <div ref={logsEndRef} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import {
//   Sparkles,
//   Rocket,
//   Download,
//   Loader2,
//   ExternalLink,
//   Copy,
//   ChevronLeft,
//   Zap,
//   Database,
//   CreditCard,
//   Mail,
//   Brain,
//   FileCode,
//   Maximize2,
//   Minimize2,
//   Code2,
//   Monitor,
//   SplitSquareHorizontal,
//   Search,
//   Check,
//   ChevronRight,
//   RefreshCw,
//   X,
//   MessageSquare,
//   GitBranch,
//   BarChart3,
//   Clock,
//   RotateCcw,
//   FolderTree,
//   Terminal,
//   Smartphone,
//   Tablet,
//   Laptop,
//   CheckCircle2,
//   AlertCircle,
//   Info,
//   Send,
// } from "lucide-react"
// import { v0ServiceAdvanced, type StreamEvent } from "@/lib/v0-service-advanced"
// import { vercelDeployment } from "@/lib/vercel-deployments"
// import { useToast } from "@/hooks/use-toast"

// interface GeneratedFile {
//   name: string
//   content: string
//   type: string
//   path?: string
// }

// interface GenerationResult {
//   chatId: string
//   demoUrl: string | null
//   webUrl: string
//   files: GeneratedFile[]
// }

// type ViewMode = "preview" | "code" | "split"
// type DeviceMode = "desktop" | "tablet" | "mobile"
// type LogLevel = "info" | "success" | "warning" | "error"

// interface LogEntry {
//   id: string
//   timestamp: Date
//   level: LogLevel
//   message: string
//   details?: string
// }

// interface ChatHistory {
//   id: string
//   message: string
//   role: "user" | "assistant"
//   timestamp: Date
// }

// interface Version {
//   id: string
//   name: string
//   timestamp: Date
//   filesCount: number
// }

// export default function CreateToolPage() {
//   const [step, setStep] = useState<"configure" | "generating" | "preview">("configure")
//   const [isGenerating, setIsGenerating] = useState(false)
//   const [isDeploying, setIsDeploying] = useState(false)
//   const [generationProgress, setGenerationProgress] = useState(0)
//   const [result, setResult] = useState<GenerationResult | null>(null)
//   const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
//   const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

//   const [viewMode, setViewMode] = useState<ViewMode>("preview")
//   const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")
//   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
//   const [isFullscreen, setIsFullscreen] = useState(false)
//   const [fileSearchQuery, setFileSearchQuery] = useState("")
//   const [showLogs, setShowLogs] = useState(true)
//   const [showChat, setShowChat] = useState(false)
//   const [showVersions, setShowVersions] = useState(false)
//   const [showAnalytics, setShowAnalytics] = useState(false)
//   const [iframeScale, setIframeScale] = useState(100)
//   const [logs, setLogs] = useState<LogEntry[]>([])
//   const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
//   const [versions, setVersions] = useState<Version[]>([])
//   const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
//   const [chatMessage, setChatMessage] = useState("")
//   const [isSendingMessage, setIsSendingMessage] = useState(false)
//   const [fileFilter, setFileFilter] = useState<string>("all")
//   const [isRegenerating, setIsRegenerating] = useState(false)
//   const [regenerationFeedback, setRegenerationFeedback] = useState("")
//   const [showRegenerationDialog, setShowRegenerationDialog] = useState(false)
//   const [rightPanelTab, setRightPanelTab] = useState<"logs" | "chat" | "versions" | "analytics">("logs")

//   // Form state
//   const [toolName, setToolName] = useState("")
//   const [category, setCategory] = useState("dashboard")
//   const [requirements, setRequirements] = useState("")
//   const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string
//   const logsEndRef = useRef<HTMLDivElement>(null)
//   const iframeRef = useRef<HTMLIFrameElement>(null)
//   const chatEndRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [logs])

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [chatHistory])

//   useEffect(() => {
//     const handleKeyPress = (e: KeyboardEvent) => {
//       if (step !== "preview") return

//       if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setIsFullscreen(!isFullscreen)
//       }
//       if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setRightPanelTab("logs")
//       }
//       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setRightPanelTab("chat")
//       }
//       if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setViewMode("preview")
//       }
//       if (e.key === "2" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setViewMode("code")
//       }
//       if (e.key === "3" && (e.metaKey || e.ctrlKey)) {
//         e.preventDefault()
//         setViewMode("split")
//       }
//     }

//     window.addEventListener("keydown", handleKeyPress)
//     return () => window.removeEventListener("keydown", handleKeyPress)
//   }, [step, isFullscreen])

//   const addLog = (message: string, level: LogLevel = "info", details?: string) => {
//     const newLog: LogEntry = {
//       id: Math.random().toString(36).substr(2, 9),
//       timestamp: new Date(),
//       level,
//       message,
//       details,
//     }
//     setLogs((prev) => [...prev, newLog])
//   }

//   const handleGenerate = async () => {
//     if (!toolName || !requirements) {
//       toast({ title: "Please fill in tool name and requirements", variant: "destructive" })
//       return
//     }

//     setIsGenerating(true)
//     setGenerationProgress(0)
//     setLogs([])
//     setStep("generating")

//     try {
//       addLog("Initializing AI generation engine...", "info")
//       setGenerationProgress(5)

//       const response = await v0ServiceAdvanced.generateToolWithStreaming(
//         {
//           toolName,
//           category,
//           requirements,
//           organizationSlug: orgSlug,
//           userEmail: "user@example.com",
//           integrations: selectedIntegrations,
//           attachments: [],
//           chatPrivacy: "private",
//         },
//         (event: StreamEvent) => {
//           if (event.type === "chunk") {
//             addLog(event.data.message, "info")
//             setGenerationProgress((prev) => Math.min(prev + 5, 95))
//           } else if (event.type === "complete") {
//             addLog("Generation complete!", "success")
//             setGenerationProgress(100)
//           } else if (event.type === "error") {
//             addLog(`Error: ${event.data.error}`, "error")
//           }
//         },
//       )

//       const latestVersion = (response as any).latestVersion
//       const files: GeneratedFile[] =
//         latestVersion?.files?.map((file: any) => ({
//           name: file.name || file.path || "unnamed",
//           content: file.content || file.data || "",
//           type: file.type || file.language || "typescript",
//           path: file.path,
//         })) || []

//       const generationResult: GenerationResult = {
//         chatId: response.id,
//         demoUrl: latestVersion?.demoUrl || null,
//         webUrl: (response as any).webUrl || "",
//         files,
//       }

//       setResult(generationResult)
//       if (files.length > 0) {
//         setSelectedFile(files[0])
//       }

//       const initialVersion: Version = {
//         id: "v1",
//         name: "Initial Generation",
//         timestamp: new Date(),
//         filesCount: files.length,
//       }
//       setVersions([initialVersion])
//       setSelectedVersion("v1")

//       addLog(`Generated ${files.length} files successfully!`, "success")
//       setStep("preview")
//       setViewMode(generationResult.demoUrl ? "preview" : "code")
//       toast({ title: "Tool generated successfully!" })
//     } catch (error) {
//       addLog(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
//       toast({ title: "Generation failed", description: "Please try again", variant: "destructive" })
//     } finally {
//       setIsGenerating(false)
//     }
//   }

//   const handleRegenerate = async () => {
//     if (!result || !regenerationFeedback.trim()) {
//       toast({ title: "Please provide feedback for regeneration", variant: "destructive" })
//       return
//     }

//     setIsRegenerating(true)
//     setShowRegenerationDialog(false)
//     addLog("Starting regeneration with feedback...", "info")

//     try {
//       const response = await v0ServiceAdvanced.continueChat(
//         result.chatId,
//         `Please improve the tool based on this feedback: ${regenerationFeedback}`,
//         (event: StreamEvent) => {
//           if (event.type === "chunk") {
//             addLog(event.data.message, "info")
//           }
//         },
//       )

//       const latestVersion = (response as any).latestVersion
//       const files: GeneratedFile[] =
//         latestVersion?.files?.map((file: any) => ({
//           name: file.name || file.path || "unnamed",
//           content: file.content || file.data || "",
//           type: file.type || file.language || "typescript",
//           path: file.path,
//         })) || []

//       const updatedResult: GenerationResult = {
//         ...result,
//         files,
//         demoUrl: latestVersion?.demoUrl || result.demoUrl,
//       }

//       setResult(updatedResult)
//       if (files.length > 0) {
//         setSelectedFile(files[0])
//       }

//       const newVersion: Version = {
//         id: `v${versions.length + 1}`,
//         name: `Regeneration ${versions.length}`,
//         timestamp: new Date(),
//         filesCount: files.length,
//       }
//       setVersions((prev) => [...prev, newVersion])
//       setSelectedVersion(newVersion.id)

//       addLog("Regeneration complete!", "success")
//       setRegenerationFeedback("")
//       toast({ title: "Tool regenerated successfully!" })
//     } catch (error) {
//       addLog(`Regeneration failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
//       toast({ title: "Regeneration failed", variant: "destructive" })
//     } finally {
//       setIsRegenerating(false)
//     }
//   }

//   const handleSendMessage = async () => {
//     if (!chatMessage.trim() || !result) return

//     const userMessage: ChatHistory = {
//       id: Math.random().toString(36).substr(2, 9),
//       message: chatMessage,
//       role: "user",
//       timestamp: new Date(),
//     }
//     setChatHistory((prev) => [...prev, userMessage])
//     setChatMessage("")
//     setIsSendingMessage(true)

//     try {
//       const response = await v0ServiceAdvanced.continueChat(result.chatId, chatMessage)

//       const assistantMessage: ChatHistory = {
//         id: Math.random().toString(36).substr(2, 9),
//         message: "Message sent successfully. The tool will be updated based on your request.",
//         role: "assistant",
//         timestamp: new Date(),
//       }
//       setChatHistory((prev) => [...prev, assistantMessage])
//     } catch (error) {
//       const errorMessage: ChatHistory = {
//         id: Math.random().toString(36).substr(2, 9),
//         message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
//         role: "assistant",
//         timestamp: new Date(),
//       }
//       setChatHistory((prev) => [...prev, errorMessage])
//     } finally {
//       setIsSendingMessage(false)
//     }
//   }

//   const handleDeploy = async () => {
//     if (!result || result.files.length === 0) {
//       toast({ title: "No files to deploy", variant: "destructive" })
//       return
//     }

//     setIsDeploying(true)
//     addLog("Starting deployment to Vercel...", "info")

//     try {
//       const deploymentResult = await vercelDeployment.deployToVercel({
//         projectName: toolName.toLowerCase().replace(/\s+/g, "-"),
//         files: result.files.map((file) => ({
//           path: file.path || file.name,
//           content: file.content,
//         })),
//       })

//       if (deploymentResult.success) {
//         setDeploymentUrl(deploymentResult.url || null)
//         addLog(`Deployed successfully! URL: ${deploymentResult.url}`, "success")
//         toast({ title: "Deployed successfully!", description: deploymentResult.url })
//       } else {
//         addLog(`Deployment failed: ${deploymentResult.error}`, "error")
//         toast({ title: "Deployment failed", variant: "destructive" })
//       }
//     } catch (error) {
//       addLog(`Deployment error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
//       toast({ title: "Deployment error", variant: "destructive" })
//     } finally {
//       setIsDeploying(false)
//     }
//   }

//   const downloadFiles = () => {
//     if (!result) return

//     result.files.forEach((file) => {
//       const blob = new Blob([file.content], { type: "text/plain" })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = file.name
//       a.click()
//       URL.revokeObjectURL(url)
//     })

//     toast({ title: `Downloaded ${result.files.length} files` })
//   }

//   const downloadSingleFile = (file: GeneratedFile) => {
//     const blob = new Blob([file.content], { type: "text/plain" })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement("a")
//     a.href = url
//     a.download = file.name
//     a.click()
//     URL.revokeObjectURL(url)
//     toast({ title: `Downloaded ${file.name}` })
//   }

//   const copyAllCode = () => {
//     if (!result) return
//     const allCode = result.files.map((f) => `// ${f.name}\n${f.content}`).join("\n\n")
//     navigator.clipboard.writeText(allCode)
//     toast({ title: "All code copied to clipboard" })
//   }

//   const filteredFiles =
//     result?.files.filter((file) => {
//       const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase())
//       if (fileFilter === "all") return matchesSearch
//       if (fileFilter === "components") return matchesSearch && file.name.includes("component")
//       if (fileFilter === "pages") return matchesSearch && file.name.includes("page")
//       if (fileFilter === "styles") return matchesSearch && (file.name.includes(".css") || file.name.includes("style"))
//       return matchesSearch
//     }) || []

//   const integrationOptions = [
//     { id: "supabase", name: "Supabase", icon: Database, color: "emerald" },
//     { id: "stripe", name: "Stripe", icon: CreditCard, color: "purple" },
//     { id: "openai", name: "OpenAI", icon: Brain, color: "blue" },
//     { id: "resend", name: "Resend", icon: Mail, color: "orange" },
//   ]

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

//   return (
//     <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
//       <div className="border-b border-border bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
//         <div className="max-w-[2400px] mx-auto px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             {!isFullscreen && (
//               <>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => router.push(`/${orgSlug}/tools`)}
//                   className="text-muted-foreground hover:text-foreground"
//                 >
//                   <ChevronLeft className="h-4 w-4 mr-1" />
//                   Back
//                 </Button>
//                 <Separator orientation="vertical" className="h-6" />
//               </>
//             )}
//             <div className="flex items-center gap-3">
//               <div
//                 className={`w-2.5 h-2.5 rounded-full transition-all ${
//                   step === "configure"
//                     ? "bg-muted-foreground"
//                     : step === "generating"
//                       ? "bg-primary animate-pulse shadow-lg shadow-primary/50"
//                       : "bg-emerald-500 shadow-lg shadow-emerald-500/50"
//                 }`}
//               />
//               <div>
//                 <span className="text-sm font-semibold text-foreground">
//                   {step === "configure" ? "Configure Tool" : step === "generating" ? "Generating..." : toolName}
//                 </span>
//                 {step === "preview" && result && (
//                   <p className="text-xs text-muted-foreground">{result.files.length} files generated</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {step === "preview" && result && (
//             <div className="flex items-center gap-3">
//               {result.demoUrl && (
//                 <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
//                   <Button
//                     variant={viewMode === "preview" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("preview")}
//                     className="h-8 px-3 text-xs"
//                     title="Preview Only (⌘1)"
//                   >
//                     <Monitor className="h-3.5 w-3.5 mr-1.5" />
//                     Preview
//                   </Button>
//                   <Button
//                     variant={viewMode === "code" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("code")}
//                     className="h-8 px-3 text-xs"
//                     title="Code Only (⌘2)"
//                   >
//                     <Code2 className="h-3.5 w-3.5 mr-1.5" />
//                     Code
//                   </Button>
//                   <Button
//                     variant={viewMode === "split" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setViewMode("split")}
//                     className="h-8 px-3 text-xs"
//                     title="Split View (⌘3)"
//                   >
//                     <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1.5" />
//                     Split
//                   </Button>
//                 </div>
//               )}

//               {result.demoUrl && (viewMode === "preview" || viewMode === "split") && (
//                 <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
//                   <Button
//                     variant={deviceMode === "desktop" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setDeviceMode("desktop")}
//                     className="h-8 w-8 p-0"
//                     title="Desktop View"
//                   >
//                     <Laptop className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant={deviceMode === "tablet" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setDeviceMode("tablet")}
//                     className="h-8 w-8 p-0"
//                     title="Tablet View"
//                   >
//                     <Tablet className="h-3.5 w-3.5" />
//                   </Button>
//                   <Button
//                     variant={deviceMode === "mobile" ? "secondary" : "ghost"}
//                     size="sm"
//                     onClick={() => setDeviceMode("mobile")}
//                     className="h-8 w-8 p-0"
//                     title="Mobile View"
//                   >
//                     <Smartphone className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>
//               )}

//               <Separator orientation="vertical" className="h-6" />

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setShowRegenerationDialog(true)}
//                 disabled={isRegenerating}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 {isRegenerating ? (
//                   <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
//                 ) : (
//                   <RotateCcw className="h-4 w-4 mr-1.5" />
//                 )}
//                 Regenerate
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={copyAllCode}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <Copy className="h-4 w-4 mr-1.5" />
//                 Copy All
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={downloadFiles}
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 <Download className="h-4 w-4 mr-1.5" />
//                 Download
//               </Button>

//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsFullscreen(!isFullscreen)}
//                 className="text-muted-foreground hover:text-foreground"
//                 title="Fullscreen (⌘F)"
//               >
//                 {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
//               </Button>

//               <Separator orientation="vertical" className="h-6" />

//               <Button
//                 size="sm"
//                 onClick={handleDeploy}
//                 disabled={isDeploying}
//                 className="bg-primary hover:bg-primary/90"
//               >
//                 {isDeploying ? (
//                   <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
//                 ) : (
//                   <Rocket className="h-4 w-4 mr-1.5" />
//                 )}
//                 Deploy to Vercel
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>

//       {step === "configure" && (
//         <div className="max-w-6xl mx-auto px-6 py-16">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl mb-8 relative">
//               <Sparkles className="h-10 w-10 text-primary" />
//               <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
//             </div>
//             <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Create Your Business Tool</h1>
//             <p className="text-muted-foreground text-xl text-pretty max-w-2xl mx-auto">
//               Describe your vision and watch AI transform it into a production-ready application
//             </p>
//           </div>

//           <div className="space-y-8">
//             <Card className="bg-card border-border p-10 shadow-lg">
//               <div className="space-y-8">
//                 <div>
//                   <Label htmlFor="toolName" className="text-lg font-semibold text-foreground mb-4 block">
//                     Tool Name
//                   </Label>
//                   <Input
//                     id="toolName"
//                     value={toolName}
//                     onChange={(e) => setToolName(e.target.value)}
//                     placeholder="e.g., Customer Support Dashboard, Inventory Manager, Analytics Platform"
//                     className="h-14 bg-background border-border text-foreground placeholder-muted-foreground text-base"
//                   />
//                 </div>

//                 <div>
//                   <Label htmlFor="category" className="text-lg font-semibold text-foreground mb-4 block">
//                     Category
//                   </Label>
//                   <select
//                     id="category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full h-14 px-4 rounded-lg bg-background border border-border text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
//                   >
//                     <option value="dashboard">Dashboard & Analytics</option>
//                     <option value="form">Forms & Data Collection</option>
//                     <option value="landing-page">Landing Page</option>
//                     <option value="admin-panel">Admin Panel</option>
//                     <option value="e-commerce">E-commerce</option>
//                     <option value="crm">CRM & Sales</option>
//                     <option value="project-management">Project Management</option>
//                     <option value="inventory">Inventory Management</option>
//                   </select>
//                 </div>

//                 <div>
//                   <Label htmlFor="requirements" className="text-lg font-semibold text-foreground mb-4 block">
//                     Detailed Requirements
//                   </Label>
//                   <Textarea
//                     id="requirements"
//                     value={requirements}
//                     onChange={(e) => setRequirements(e.target.value)}
//                     placeholder="Describe your tool in detail:&#10;• What features do you need?&#10;• Who will use it?&#10;• What data will it display?&#10;• Any specific design preferences?&#10;• Integration requirements?"
//                     rows={12}
//                     className="bg-background border-border text-foreground placeholder-muted-foreground resize-none text-base leading-relaxed"
//                   />
//                   <div className="flex items-center justify-between mt-3">
//                     <p className="text-sm text-muted-foreground">{requirements.length} characters</p>
//                     <p className="text-xs text-muted-foreground">Tip: More detail = better results</p>
//                   </div>
//                 </div>
//               </div>
//             </Card>

//             <Card className="bg-card border-border p-10 shadow-lg">
//               <Label className="text-lg font-semibold text-foreground mb-6 block">
//                 Integrations <span className="text-muted-foreground font-normal text-base">(Optional)</span>
//               </Label>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {integrationOptions.map((integration) => {
//                   const Icon = integration.icon
//                   const isSelected = selectedIntegrations.includes(integration.id)
//                   return (
//                     <button
//                       key={integration.id}
//                       onClick={() => {
//                         setSelectedIntegrations((prev) =>
//                           prev.includes(integration.id)
//                             ? prev.filter((i) => i !== integration.id)
//                             : [...prev, integration.id],
//                         )
//                       }}
//                       className={`relative p-8 rounded-2xl border-2 transition-all ${
//                         isSelected
//                           ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
//                           : "border-border bg-background hover:border-primary/50 hover:shadow-md"
//                       }`}
//                     >
//                       {isSelected && (
//                         <div className="absolute top-3 right-3">
//                           <CheckCircle2 className="h-5 w-5 text-primary" />
//                         </div>
//                       )}
//                       <Icon
//                         className={`h-10 w-10 mx-auto mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
//                       />
//                       <p
//                         className={`text-base font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
//                       >
//                         {integration.name}
//                       </p>
//                     </button>
//                   )
//                 })}
//               </div>
//             </Card>

//             <Button
//               onClick={handleGenerate}
//               disabled={isGenerating || !toolName || !requirements}
//               className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
//             >
//               {isGenerating ? (
//                 <>
//                   <Loader2 className="h-6 w-6 mr-3 animate-spin" />
//                   Generating Your Tool...
//                 </>
//               ) : (
//                 <>
//                   <Zap className="h-6 w-6 mr-3" />
//                   Generate Tool with AI
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       )}

//       {step === "generating" && (
//         <div className="h-[calc(100vh-73px)] flex items-center justify-center p-6">
//           <div className="w-full max-w-5xl space-y-10">
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8 relative">
//                 <Sparkles className="h-12 w-12 text-primary animate-pulse" />
//                 <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
//                 <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse" />
//               </div>
//               <h2 className="text-4xl font-bold text-foreground mb-3">Generating Your Tool</h2>
//               <p className="text-muted-foreground text-lg">
//                 Our AI is analyzing your requirements and crafting a custom solution...
//               </p>
//             </div>

//             <Card className="bg-card border-border p-10 shadow-2xl">
//               <div className="space-y-8">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <span className="text-foreground font-semibold text-lg">Generation Progress</span>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       {generationProgress < 30
//                         ? "Analyzing requirements..."
//                         : generationProgress < 60
//                           ? "Designing architecture..."
//                           : generationProgress < 90
//                             ? "Generating code..."
//                             : "Finalizing..."}
//                     </p>
//                   </div>
//                   <Badge className="bg-primary/10 text-primary border-primary/20 text-xl px-6 py-2 font-bold">
//                     {generationProgress}%
//                   </Badge>
//                 </div>

//                 <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
//                   <div
//                     className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out shadow-lg"
//                     style={{ width: `${generationProgress}%` }}
//                   />
//                 </div>

//                 <Card className="bg-background border-border p-6 shadow-inner">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="flex items-center gap-2">
//                       <Terminal className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm font-semibold text-foreground">Generation Logs</span>
//                     </div>
//                     <Badge variant="secondary" className="text-xs">
//                       {logs.length} events
//                     </Badge>
//                   </div>
//                   <ScrollArea className="h-96">
//                     <div className="font-mono text-sm space-y-2 pr-4">
//                       {logs.map((log) => (
//                         <div
//                           key={log.id}
//                           className={`flex items-start gap-3 p-2 rounded ${
//                             log.level === "error"
//                               ? "bg-red-500/10 text-red-500"
//                               : log.level === "success"
//                                 ? "bg-emerald-500/10 text-emerald-500"
//                                 : log.level === "warning"
//                                   ? "bg-yellow-500/10 text-yellow-500"
//                                   : "text-muted-foreground"
//                           }`}
//                         >
//                           <span className="text-xs opacity-60 flex-shrink-0">{log.timestamp.toLocaleTimeString()}</span>
//                           <span className="flex-1">{log.message}</span>
//                         </div>
//                       ))}
//                       <div ref={logsEndRef} />
//                     </div>
//                   </ScrollArea>
//                 </Card>
//               </div>
//             </Card>
//           </div>
//         </div>
//       )}

//       {step === "preview" && result && (
//         <div className={`flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-73px)]"}`}>
//           {/* Left Sidebar - File Explorer */}
//           <div
//             className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
//               isSidebarCollapsed ? "w-14" : "w-96"
//             }`}
//           >
//             {isSidebarCollapsed ? (
//               <div className="p-3 flex flex-col items-center gap-3">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsSidebarCollapsed(false)}
//                   className="w-full h-10"
//                   title="Expand Sidebar"
//                 >
//                   <ChevronRight className="h-5 w-5" />
//                 </Button>
//                 <Separator />
//                 <Button variant="ghost" size="sm" className="w-full h-10" title="Files">
//                   <FolderTree className="h-5 w-5" />
//                 </Button>
//               </div>
//             ) : (
//               <>
//                 <div className="p-5 border-b border-border space-y-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-base font-bold text-foreground flex items-center gap-2">
//                         <FolderTree className="h-4 w-4" />
//                         Project Files
//                       </h3>
//                       <p className="text-xs text-muted-foreground mt-1">
//                         {result.files.length} files • {selectedVersion || "v1"}
//                       </p>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => setIsSidebarCollapsed(true)}
//                       className="h-8 w-8 p-0"
//                       title="Collapse Sidebar"
//                     >
//                       <ChevronLeft className="h-4 w-4" />
//                     </Button>
//                   </div>

//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       value={fileSearchQuery}
//                       onChange={(e) => setFileSearchQuery(e.target.value)}
//                       placeholder="Search files..."
//                       className="pl-10 h-10 bg-background border-border"
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
//                     {filteredFiles.length === 0 ? (
//                       <div className="text-center py-12">
//                         <FileCode className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
//                         <p className="text-sm text-muted-foreground">No files found</p>
//                       </div>
//                     ) : (
//                       filteredFiles.map((file, index) => (
//                         <div
//                           key={index}
//                           className={`group rounded-lg transition-all ${
//                             selectedFile === file ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/50"
//                           }`}
//                         >
//                           <button
//                             onClick={() => setSelectedFile(file)}
//                             className="w-full text-left p-3 flex items-center gap-3"
//                           >
//                             <FileCode className="h-4 w-4 flex-shrink-0" />
//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm font-medium font-mono truncate">{file.name}</p>
//                               <p className="text-xs opacity-70 mt-0.5">{file.content.split("\n").length} lines</p>
//                             </div>
//                             {selectedFile === file && <Check className="h-4 w-4 flex-shrink-0" />}
//                           </button>
//                           <div
//                             className={`px-3 pb-2 flex items-center gap-1 transition-all ${
//                               selectedFile === file ? "opacity-100" : "opacity-0 group-hover:opacity-100"
//                             }`}
//                           >
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 navigator.clipboard.writeText(file.content)
//                                 toast({ title: "Copied to clipboard" })
//                               }}
//                               className="h-7 px-2 text-xs"
//                             >
//                               <Copy className="h-3 w-3 mr-1" />
//                               Copy
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 downloadSingleFile(file)
//                               }}
//                               className="h-7 px-2 text-xs"
//                             >
//                               <Download className="h-3 w-3 mr-1" />
//                               Save
//                             </Button>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </ScrollArea>
//               </>
//             )}
//           </div>

//           {/* Center - Main Preview/Code Area */}
//           <div className="flex-1 flex flex-col bg-background overflow-hidden">
//             <div className="flex-1 flex overflow-hidden">
//               {/* Preview Panel */}
//               {(viewMode === "preview" || viewMode === "split") && result.demoUrl && (
//                 <div
//                   className={`flex flex-col bg-muted/30 ${viewMode === "split" ? "w-1/2 border-r border-border" : "flex-1"}`}
//                 >
//                   <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div className="flex items-center gap-2">
//                         <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
//                         <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
//                         <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
//                       </div>
//                       <div className="flex-1 min-w-0 bg-background/50 rounded-lg px-3 py-1.5 border border-border">
//                         <span className="text-xs text-muted-foreground font-mono truncate block">{result.demoUrl}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-2 ml-3">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           if (iframeRef.current) {
//                             iframeRef.current.src = result.demoUrl!
//                           }
//                         }}
//                         className="h-8 w-8 p-0"
//                         title="Refresh Preview"
//                       >
//                         <RefreshCw className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => window.open(result.demoUrl!, "_blank")}
//                         className="h-8 w-8 p-0"
//                         title="Open in New Tab"
//                       >
//                         <ExternalLink className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5">
//                     <div
//                       className="bg-white shadow-2xl rounded-lg overflow-hidden"
//                       style={{
//                         width: deviceDimensions.width,
//                         height: deviceDimensions.height,
//                         maxWidth: "100%",
//                         maxHeight: "100%",
//                       }}
//                     >
//                       <iframe
//                         ref={iframeRef}
//                         src={result.demoUrl}
//                         className="w-full h-full"
//                         title="Generated Tool Preview"
//                         sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Code Panel */}
//               {(viewMode === "code" || viewMode === "split" || !result.demoUrl) && selectedFile && (
//                 <div className={`flex flex-col ${viewMode === "split" && result.demoUrl ? "w-1/2" : "flex-1"}`}>
//                   <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
//                     <div className="flex items-center gap-3">
//                       <FileCode className="h-4 w-4 text-primary" />
//                       <span className="text-sm font-semibold font-mono text-foreground">{selectedFile.name}</span>
//                       <Badge variant="secondary" className="text-xs">
//                         {selectedFile.type}
//                       </Badge>
//                       <Badge variant="outline" className="text-xs">
//                         {selectedFile.content.split("\n").length} lines
//                       </Badge>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => {
//                           navigator.clipboard.writeText(selectedFile.content)
//                           toast({ title: "Copied to clipboard" })
//                         }}
//                         className="h-8 px-3 text-xs"
//                       >
//                         <Copy className="h-3.5 w-3.5 mr-1.5" />
//                         Copy
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => downloadSingleFile(selectedFile)}
//                         className="h-8 px-3 text-xs"
//                       >
//                         <Download className="h-3.5 w-3.5 mr-1.5" />
//                         Download
//                       </Button>
//                     </div>
//                   </div>
//                   <ScrollArea className="flex-1 bg-background">
//                     <div className="p-6">
//                       <pre className="text-sm text-foreground font-mono whitespace-pre-wrap break-words leading-relaxed">
//                         <code>{selectedFile.content}</code>
//                       </pre>
//                     </div>
//                   </ScrollArea>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="w-96 border-l border-border bg-card flex flex-col">
//             <Tabs
//               value={rightPanelTab}
//               onValueChange={(v) => setRightPanelTab(v as any)}
//               className="flex-1 flex flex-col"
//             >
//               <div className="border-b border-border bg-card/50 backdrop-blur-sm">
//                 <TabsList className="w-full grid grid-cols-4 h-12 bg-transparent p-1">
//                   <TabsTrigger value="logs" className="text-xs" title="Logs (⌘L)">
//                     <Terminal className="h-4 w-4 mr-1.5" />
//                     Logs
//                   </TabsTrigger>
//                   <TabsTrigger value="chat" className="text-xs" title="Chat (⌘K)">
//                     <MessageSquare className="h-4 w-4 mr-1.5" />
//                     Chat
//                   </TabsTrigger>
//                   <TabsTrigger value="versions" className="text-xs">
//                     <GitBranch className="h-4 w-4 mr-1.5" />
//                     Versions
//                   </TabsTrigger>
//                   <TabsTrigger value="analytics" className="text-xs">
//                     <BarChart3 className="h-4 w-4 mr-1.5" />
//                     Stats
//                   </TabsTrigger>
//                 </TabsList>
//               </div>

//               <TabsContent value="logs" className="flex-1 flex flex-col m-0 overflow-hidden">
//                 <div className="p-4 border-b border-border">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Terminal className="h-4 w-4 text-muted-foreground" />
//                       <span className="text-sm font-semibold text-foreground">Generation Logs</span>
//                     </div>
//                     <Badge variant="secondary" className="text-xs">
//                       {logs.length} events
//                     </Badge>
//                   </div>
//                 </div>
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-2">
//                     {logs.map((log) => (
//                       <div
//                         key={log.id}
//                         className={`p-3 rounded-lg border ${
//                           log.level === "error"
//                             ? "bg-red-500/10 border-red-500/20 text-red-500"
//                             : log.level === "success"
//                               ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
//                               : log.level === "warning"
//                                 ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
//                                 : "bg-muted/50 border-border text-muted-foreground"
//                         }`}
//                       >
//                         <div className="flex items-start gap-2">
//                           {log.level === "error" && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
//                           {log.level === "success" && <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />}
//                           {log.level === "warning" && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
//                           {log.level === "info" && <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />}
//                           <div className="flex-1 min-w-0">
//                             <p className="text-xs font-medium">{log.message}</p>
//                             <p className="text-xs opacity-60 mt-1">{log.timestamp.toLocaleTimeString()}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                     <div ref={logsEndRef} />
//                   </div>
//                 </ScrollArea>
//               </TabsContent>

//               <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden">
//                 <div className="p-4 border-b border-border">
//                   <div className="flex items-center gap-2">
//                     <MessageSquare className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-semibold text-foreground">Chat with AI</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">Ask questions or request changes</p>
//                 </div>
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-4">
//                     {chatHistory.length === 0 ? (
//                       <div className="text-center py-12">
//                         <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
//                         <p className="text-sm text-muted-foreground">No messages yet</p>
//                         <p className="text-xs text-muted-foreground mt-1">Start a conversation with AI</p>
//                       </div>
//                     ) : (
//                       chatHistory.map((msg) => (
//                         <div
//                           key={msg.id}
//                           className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
//                         >
//                           <div
//                             className={`max-w-[80%] rounded-lg p-3 ${
//                               msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
//                             }`}
//                           >
//                             <p className="text-sm">{msg.message}</p>
//                             <p className="text-xs opacity-60 mt-1">{msg.timestamp.toLocaleTimeString()}</p>
//                           </div>
//                         </div>
//                       ))
//                     )}
//                     <div ref={chatEndRef} />
//                   </div>
//                 </ScrollArea>
//                 <div className="p-4 border-t border-border">
//                   <div className="flex gap-2">
//                     <Input
//                       value={chatMessage}
//                       onChange={(e) => setChatMessage(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault()
//                           handleSendMessage()
//                         }
//                       }}
//                       placeholder="Type a message..."
//                       className="flex-1 h-10 bg-background"
//                       disabled={isSendingMessage}
//                     />
//                     <Button
//                       onClick={handleSendMessage}
//                       disabled={!chatMessage.trim() || isSendingMessage}
//                       size="sm"
//                       className="h-10 px-4"
//                     >
//                       {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//                     </Button>
//                   </div>
//                 </div>
//               </TabsContent>

//               <TabsContent value="versions" className="flex-1 flex flex-col m-0 overflow-hidden">
//                 <div className="p-4 border-b border-border">
//                   <div className="flex items-center gap-2">
//                     <GitBranch className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-semibold text-foreground">Version History</span>
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">{versions.length} versions</p>
//                 </div>
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-2">
//                     {versions.length === 0 ? (
//                       <div className="text-center py-12">
//                         <GitBranch className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
//                         <p className="text-sm text-muted-foreground">No versions yet</p>
//                       </div>
//                     ) : (
//                       versions.map((version) => (
//                         <button
//                           key={version.id}
//                           onClick={() => setSelectedVersion(version.id)}
//                           className={`w-full text-left p-4 rounded-lg border transition-all ${
//                             selectedVersion === version.id
//                               ? "bg-primary/10 border-primary"
//                               : "bg-muted/50 border-border hover:border-primary/50"
//                           }`}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex-1">
//                               <p className="text-sm font-semibold text-foreground">{version.name}</p>
//                               <p className="text-xs text-muted-foreground mt-1">
//                                 {version.filesCount} files • {version.timestamp.toLocaleString()}
//                               </p>
//                             </div>
//                             {selectedVersion === version.id && (
//                               <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
//                             )}
//                           </div>
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 </ScrollArea>
//               </TabsContent>

//               <TabsContent value="analytics" className="flex-1 flex flex-col m-0 overflow-hidden">
//                 <div className="p-4 border-b border-border">
//                   <div className="flex items-center gap-2">
//                     <BarChart3 className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-sm font-semibold text-foreground">Generation Stats</span>
//                   </div>
//                 </div>
//                 <ScrollArea className="flex-1 p-4">
//                   <div className="space-y-4">
//                     <Card className="bg-muted/50 border-border p-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs text-muted-foreground">Total Files</p>
//                           <p className="text-2xl font-bold text-foreground mt-1">{result.files.length}</p>
//                         </div>
//                         <FileCode className="h-8 w-8 text-primary" />
//                       </div>
//                     </Card>

//                     <Card className="bg-muted/50 border-border p-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs text-muted-foreground">Lines of Code</p>
//                           <p className="text-2xl font-bold text-foreground mt-1">
//                             {result.files.reduce((acc, f) => acc + f.content.split("\n").length, 0)}
//                           </p>
//                         </div>
//                         <Code2 className="h-8 w-8 text-emerald-500" />
//                       </div>
//                     </Card>

//                     <Card className="bg-muted/50 border-border p-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs text-muted-foreground">Versions</p>
//                           <p className="text-2xl font-bold text-foreground mt-1">{versions.length}</p>
//                         </div>
//                         <GitBranch className="h-8 w-8 text-blue-500" />
//                       </div>
//                     </Card>

//                     <Card className="bg-muted/50 border-border p-4">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="text-xs text-muted-foreground">Generation Time</p>
//                           <p className="text-2xl font-bold text-foreground mt-1">
//                             {logs.length > 0
//                               ? `${Math.round((logs[logs.length - 1].timestamp.getTime() - logs[0].timestamp.getTime()) / 1000)}s`
//                               : "0s"}
//                           </p>
//                         </div>
//                         <Clock className="h-8 w-8 text-orange-500" />
//                       </div>
//                     </Card>

//                     <Separator />

//                     <div>
//                       <h4 className="text-sm font-semibold text-foreground mb-3">File Breakdown</h4>
//                       <div className="space-y-2">
//                         {["tsx", "ts", "css", "json"].map((ext) => {
//                           const count = result.files.filter((f) => f.name.endsWith(`.${ext}`)).length
//                           if (count === 0) return null
//                           return (
//                             <div key={ext} className="flex items-center justify-between text-sm">
//                               <span className="text-muted-foreground">.{ext} files</span>
//                               <Badge variant="secondary">{count}</Badge>
//                             </div>
//                           )
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </ScrollArea>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       )}

//       {showRegenerationDialog && (
//         <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
//           <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
//             <div className="p-6 border-b border-border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-bold text-foreground">Regenerate Tool</h3>
//                   <p className="text-sm text-muted-foreground mt-1">Provide feedback to improve your tool</p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setShowRegenerationDialog(false)}
//                   className="h-8 w-8 p-0"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//             <div className="p-6 space-y-4">
//               <div>
//                 <Label htmlFor="feedback" className="text-sm font-semibold text-foreground mb-2 block">
//                   What would you like to improve?
//                 </Label>
//                 <Textarea
//                   id="feedback"
//                   value={regenerationFeedback}
//                   onChange={(e) => setRegenerationFeedback(e.target.value)}
//                   placeholder="E.g., Add a dark mode toggle, improve the layout, add more features..."
//                   rows={6}
//                   className="bg-background border-border text-foreground resize-none"
//                 />
//               </div>
//             </div>
//             <div className="p-6 border-t border-border flex items-center justify-end gap-3">
//               <Button variant="outline" onClick={() => setShowRegenerationDialog(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleRegenerate}
//                 disabled={!regenerationFeedback.trim() || isRegenerating}
//                 className="bg-primary hover:bg-primary/90"
//               >
//                 {isRegenerating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Regenerating...
//                   </>
//                 ) : (
//                   <>
//                     <RotateCcw className="h-4 w-4 mr-2" />
//                     Regenerate Tool
//                   </>
//                 )}
//               </Button>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sparkles,
  Rocket,
  Download,
  Loader2,
  ExternalLink,
  Copy,
  ChevronLeft,
  Zap,
  Database,
  CreditCard,
  Mail,
  Brain,
  FileCode,
  Maximize2,
  Minimize2,
  Code2,
  Monitor,
  SplitSquareHorizontal,
  Search,
  Check,
  ChevronRight,
  RefreshCw,
  X,
  MessageSquare,
  GitBranch,
  BarChart3,
  Clock,
  RotateCcw,
  FolderTree,
  Terminal,
  Smartphone,
  Tablet,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Info,
  Send,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react"
import { v0ServiceAdvanced, type StreamEvent } from "@/lib/v0-service-advanced"
import { vercelDeployment } from "@/lib/vercel-deployments"
import { useToast } from "@/hooks/use-toast"

interface GeneratedFile {
  name: string
  content: string
  type: string
  path?: string
}

interface GenerationResult {
  chatId: string
  demoUrl: string | null
  webUrl: string
  files: GeneratedFile[]
}

type ViewMode = "preview" | "code" | "split"
type DeviceMode = "desktop" | "tablet" | "mobile"
type LogLevel = "info" | "success" | "warning" | "error"

interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  details?: string
}

interface ChatHistory {
  id: string
  message: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Version {
  id: string
  name: string
  timestamp: Date
  filesCount: number
}

export default function CreateToolPage() {
  const [step, setStep] = useState<"configure" | "generating" | "preview">("configure")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeploying, setIsDeploying] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null)
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null)

  const [viewMode, setViewMode] = useState<ViewMode>("preview")
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fileSearchQuery, setFileSearchQuery] = useState("")
  const [showLogs, setShowLogs] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showVersions, setShowVersions] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [iframeScale, setIframeScale] = useState(100)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [fileFilter, setFileFilter] = useState<string>("all")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [regenerationFeedback, setRegenerationFeedback] = useState("")
  const [showRegenerationDialog, setShowRegenerationDialog] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState<"logs" | "chat" | "versions" | "analytics">("logs")

  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)

  // Form state
  const [toolName, setToolName] = useState("")
  const [category, setCategory] = useState("dashboard")
  const [requirements, setRequirements] = useState("")
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])

  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.slug as string
  const logsEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [logs])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (step !== "preview") return

      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }
      if (e.key === "l" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setRightPanelTab("logs")
      }
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setRightPanelTab("chat")
      }
      if (e.key === "1" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setViewMode("preview")
      }
      if (e.key === "2" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setViewMode("code")
      }
      if (e.key === "3" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setViewMode("split")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [step, isFullscreen])

  const addLog = (message: string, level: LogLevel = "info", details?: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      level,
      message,
      details,
    }
    setLogs((prev) => [...prev, newLog])
  }

  const handleGenerate = async () => {
    if (!toolName || !requirements) {
      toast({ title: "Please fill in tool name and requirements", variant: "destructive" })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setLogs([])
    setStep("generating")

    try {
      addLog("Initializing AI generation engine...", "info")
      setGenerationProgress(5)

      const response = await v0ServiceAdvanced.generateToolWithStreaming(
        {
          toolName,
          category,
          requirements,
          organizationSlug: orgSlug,
          userEmail: "user@example.com",
          integrations: selectedIntegrations,
          attachments: [],
          chatPrivacy: "private",
        },
        (event: StreamEvent) => {
          if (event.type === "chunk") {
            addLog(event.data.message, "info")
            setGenerationProgress((prev) => Math.min(prev + 5, 95))
          } else if (event.type === "complete") {
            addLog("Generation complete!", "success")
            setGenerationProgress(100)
          } else if (event.type === "error") {
            addLog(`Error: ${event.data.error}`, "error")
          }
        },
      )

      const latestVersion = (response as any).latestVersion
      const files: GeneratedFile[] =
        latestVersion?.files?.map((file: any) => ({
          name: file.name || file.path || "unnamed",
          content: file.content || file.data || "",
          type: file.type || file.language || "typescript",
          path: file.path,
        })) || []

      const generationResult: GenerationResult = {
        chatId: response.id,
        demoUrl: latestVersion?.demoUrl || null,
        webUrl: (response as any).webUrl || "",
        files,
      }

      setResult(generationResult)
      if (files.length > 0) {
        setSelectedFile(files[0])
      }

      const initialVersion: Version = {
        id: "v1",
        name: "Initial Generation",
        timestamp: new Date(),
        filesCount: files.length,
      }
      setVersions([initialVersion])
      setSelectedVersion("v1")

      addLog(`Generated ${files.length} files successfully!`, "success")
      setStep("preview")
      setViewMode(generationResult.demoUrl ? "preview" : "code")
      toast({ title: "Tool generated successfully!" })
    } catch (error) {
      addLog(`Generation failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      toast({ title: "Generation failed", description: "Please try again", variant: "destructive" })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async () => {
    if (!result || !regenerationFeedback.trim()) {
      toast({ title: "Please provide feedback for regeneration", variant: "destructive" })
      return
    }

    setIsRegenerating(true)
    setShowRegenerationDialog(false)
    addLog("Starting regeneration with feedback...", "info")

    try {
      const response = await v0ServiceAdvanced.continueChat(
        result.chatId,
        `Please improve the tool based on this feedback: ${regenerationFeedback}`,
        (event: StreamEvent) => {
          if (event.type === "chunk") {
            addLog(event.data.message, "info")
          }
        },
      )

      const latestVersion = (response as any).latestVersion
      const files: GeneratedFile[] =
        latestVersion?.files?.map((file: any) => ({
          name: file.name || file.path || "unnamed",
          content: file.content || file.data || "",
          type: file.type || file.language || "typescript",
          path: file.path,
        })) || []

      const updatedResult: GenerationResult = {
        ...result,
        files,
        demoUrl: latestVersion?.demoUrl || result.demoUrl,
      }

      setResult(updatedResult)
      if (files.length > 0) {
        setSelectedFile(files[0])
      }

      const newVersion: Version = {
        id: `v${versions.length + 1}`,
        name: `Regeneration ${versions.length}`,
        timestamp: new Date(),
        filesCount: files.length,
      }
      setVersions((prev) => [...prev, newVersion])
      setSelectedVersion(newVersion.id)

      addLog("Regeneration complete!", "success")
      setRegenerationFeedback("")
      toast({ title: "Tool regenerated successfully!" })
    } catch (error) {
      addLog(`Regeneration failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      toast({ title: "Regeneration failed", variant: "destructive" })
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !result) return

    const userMessage: ChatHistory = {
      id: Math.random().toString(36).substr(2, 9),
      message: chatMessage,
      role: "user",
      timestamp: new Date(),
    }
    setChatHistory((prev) => [...prev, userMessage])
    const currentMessage = chatMessage
    setChatMessage("")
    setIsSendingMessage(true)
    setIsEnhancing(true) // Show enhancement loading

    try {
      addLog(`Enhancing tool based on: "${currentMessage}"`, "info")

      const response = await v0ServiceAdvanced.continueChat(result.chatId, currentMessage, (event: StreamEvent) => {
        if (event.type === "chunk") {
          addLog(event.data.message, "info")
        }
      })

      const latestVersion = (response as any).latestVersion
      const files: GeneratedFile[] =
        latestVersion?.files?.map((file: any) => ({
          name: file.name || file.path || "unnamed",
          content: file.content || file.data || "",
          type: file.type || file.language || "typescript",
          path: file.path,
        })) || []

      const updatedResult: GenerationResult = {
        ...result,
        files,
        demoUrl: latestVersion?.demoUrl || result.demoUrl,
      }

      setResult(updatedResult)
      if (files.length > 0) {
        setSelectedFile(files[0])
      }

      const newVersion: Version = {
        id: `v${versions.length + 1}`,
        name: `Enhancement ${versions.length}`,
        timestamp: new Date(),
        filesCount: files.length,
      }
      setVersions((prev) => [...prev, newVersion])
      setSelectedVersion(newVersion.id)

      const assistantMessage: ChatHistory = {
        id: Math.random().toString(36).substr(2, 9),
        message: "Tool enhanced successfully! The changes have been applied.",
        role: "assistant",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, assistantMessage])
      addLog("Enhancement complete!", "success")
      toast({ title: "Tool enhanced successfully!" })
    } catch (error) {
      const errorMessage: ChatHistory = {
        id: Math.random().toString(36).substr(2, 9),
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
        role: "assistant",
        timestamp: new Date(),
      }
      setChatHistory((prev) => [...prev, errorMessage])
      addLog(`Enhancement failed: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
    } finally {
      setIsSendingMessage(false)
      setIsEnhancing(false) // Hide enhancement loading
    }
  }

  const handleDeploy = async () => {
    if (!result || result.files.length === 0) {
      toast({ title: "No files to deploy", variant: "destructive" })
      return
    }

    setIsDeploying(true)
    addLog("Starting deployment to Vercel...", "info")

    try {
      const deploymentResult = await vercelDeployment.deployToVercel({
        projectName: toolName.toLowerCase().replace(/\s+/g, "-"),
        files: result.files.map((file) => ({
          path: file.path || file.name,
          content: file.content,
        })),
      })

      if (deploymentResult.success) {
        setDeploymentUrl(deploymentResult.url || null)
        addLog(`Deployed successfully! URL: ${deploymentResult.url}`, "success")
        toast({ title: "Deployed successfully!", description: deploymentResult.url })
      } else {
        addLog(`Deployment failed: ${deploymentResult.error}`, "error")
        toast({ title: "Deployment failed", variant: "destructive" })
      }
    } catch (error) {
      addLog(`Deployment error: ${error instanceof Error ? error.message : "Unknown error"}`, "error")
      toast({ title: "Deployment error", variant: "destructive" })
    } finally {
      setIsDeploying(false)
    }
  }

  const downloadFiles = () => {
    if (!result) return

    result.files.forEach((file) => {
      const blob = new Blob([file.content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    })

    toast({ title: `Downloaded ${result.files.length} files` })
  }

  const downloadSingleFile = (file: GeneratedFile) => {
    const blob = new Blob([file.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: `Downloaded ${file.name}` })
  }

  const copyAllCode = () => {
    if (!result) return
    const allCode = result.files.map((f) => `// ${f.name}\n${f.content}`).join("\n\n")
    navigator.clipboard.writeText(allCode)
    toast({ title: "All code copied to clipboard" })
  }

  const filteredFiles =
    result?.files.filter((file) => {
      const matchesSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase())
      if (fileFilter === "all") return matchesSearch
      if (fileFilter === "components") return matchesSearch && file.name.includes("component")
      if (fileFilter === "pages") return matchesSearch && file.name.includes("page")
      if (fileFilter === "styles") return matchesSearch && (file.name.includes(".css") || file.name.includes("style"))
      return matchesSearch
    }) || []

  const integrationOptions = [
    { id: "supabase", name: "Supabase", icon: Database, color: "emerald" },
    { id: "stripe", name: "Stripe", icon: CreditCard, color: "purple" },
    { id: "openai", name: "OpenAI", icon: Brain, color: "blue" },
    { id: "resend", name: "Resend", icon: Mail, color: "orange" },
  ]

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

  const highlightCode = (code: string, language: string) => {
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
      "public",
      "private",
      "protected",
      "static",
      "readonly",
    ]

    const types = ["string", "number", "boolean", "void", "any", "unknown", "never"]

    let highlighted = code

    // Highlight strings
    highlighted = highlighted.replace(
      /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g,
      '<span class="text-emerald-400">$1$2$1</span>',
    )

    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
    highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>')

    // Highlight keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b(${keyword})\\b`, "g")
      highlighted = highlighted.replace(regex, '<span class="text-purple-400 font-semibold">$1</span>')
    })

    // Highlight types
    types.forEach((type) => {
      const regex = new RegExp(`\\b(${type})\\b`, "g")
      highlighted = highlighted.replace(regex, '<span class="text-blue-400">$1</span>')
    })

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>')

    // Highlight functions
    highlighted = highlighted.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g, '<span class="text-yellow-400">$1</span>(')

    return highlighted
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      <div className="border-b border-border bg-card/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-[2400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!isFullscreen && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/${orgSlug}/tools`)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <Separator orientation="vertical" className="h-6" />
              </>
            )}
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === "configure"
                    ? "bg-muted-foreground"
                    : step === "generating"
                      ? "bg-primary animate-pulse shadow-lg shadow-primary/50"
                      : "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                }`}
              />
              <div>
                <span className="text-sm font-semibold text-foreground">
                  {step === "configure" ? "Configure Tool" : step === "generating" ? "Generating..." : toolName}
                </span>
                {step === "preview" && result && (
                  <p className="text-xs text-muted-foreground">{result.files.length} files generated</p>
                )}
              </div>
            </div>
          </div>

          {step === "preview" && result && (
            <div className="flex items-center gap-3">
              {result.demoUrl && (
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
                  <Button
                    variant={viewMode === "preview" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("preview")}
                    className="h-8 px-3 text-xs"
                    title="Preview Only (⌘1)"
                  >
                    <Monitor className="h-3.5 w-3.5 mr-1.5" />
                    Preview
                  </Button>
                  <Button
                    variant={viewMode === "code" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("code")}
                    className="h-8 px-3 text-xs"
                    title="Code Only (⌘2)"
                  >
                    <Code2 className="h-3.5 w-3.5 mr-1.5" />
                    Code
                  </Button>
                  <Button
                    variant={viewMode === "split" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("split")}
                    className="h-8 px-3 text-xs"
                    title="Split View (⌘3)"
                  >
                    <SplitSquareHorizontal className="h-3.5 w-3.5 mr-1.5" />
                    Split
                  </Button>
                </div>
              )}

              {result.demoUrl && (viewMode === "preview" || viewMode === "split") && (
                <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border">
                  <Button
                    variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceMode("desktop")}
                    className="h-8 w-8 p-0"
                    title="Desktop View"
                  >
                    <Laptop className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={deviceMode === "tablet" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceMode("tablet")}
                    className="h-8 w-8 p-0"
                    title="Tablet View"
                  >
                    <Tablet className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setDeviceMode("mobile")}
                    className="h-8 w-8 p-0"
                    title="Mobile View"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              <Separator orientation="vertical" className="h-6" />

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRegenerationDialog(true)}
                disabled={isRegenerating}
                className="text-muted-foreground hover:text-foreground"
              >
                {isRegenerating ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-1.5" />
                )}
                Regenerate
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={copyAllCode}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Copy All
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={downloadFiles}
                className="text-muted-foreground hover:text-foreground"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-muted-foreground hover:text-foreground"
                title="Fullscreen (⌘F)"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>

              <Separator orientation="vertical" className="h-6" />

              <Button
                size="sm"
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-primary hover:bg-primary/90"
              >
                {isDeploying ? (
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                ) : (
                  <Rocket className="h-4 w-4 mr-1.5" />
                )}
                Deploy to Vercel
              </Button>
            </div>
          )}
        </div>
      </div>

      {step === "configure" && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl mb-8 relative">
              <Sparkles className="h-10 w-10 text-primary" />
              <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Create Your Business Tool</h1>
            <p className="text-muted-foreground text-xl text-pretty max-w-2xl mx-auto">
              Describe your vision and watch AI transform it into a production-ready application
            </p>
          </div>

          <div className="space-y-8">
            <Card className="bg-card border-border p-10 shadow-lg">
              <div className="space-y-8">
                <div>
                  <Label htmlFor="toolName" className="text-lg font-semibold text-foreground mb-4 block">
                    Tool Name
                  </Label>
                  <Input
                    id="toolName"
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    placeholder="e.g., Customer Support Dashboard, Inventory Manager, Analytics Platform"
                    className="h-14 bg-background border-border text-foreground placeholder-muted-foreground text-base"
                  />
                </div>

                <div>
                  <Label htmlFor="category" className="text-lg font-semibold text-foreground mb-4 block">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-14 px-4 rounded-lg bg-background border border-border text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
                  >
                    <option value="dashboard">Dashboard & Analytics</option>
                    <option value="form">Forms & Data Collection</option>
                    <option value="landing-page">Landing Page</option>
                    <option value="admin-panel">Admin Panel</option>
                    <option value="e-commerce">E-commerce</option>
                    <option value="crm">CRM & Sales</option>
                    <option value="project-management">Project Management</option>
                    <option value="inventory">Inventory Management</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-lg font-semibold text-foreground mb-4 block">
                    Detailed Requirements
                  </Label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe your tool in detail:&#10;• What features do you need?&#10;• Who will use it?&#10;• What data will it display?&#10;• Any specific design preferences?&#10;• Integration requirements?"
                    rows={12}
                    className="bg-background border-border text-foreground placeholder-muted-foreground resize-none text-base leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-muted-foreground">{requirements.length} characters</p>
                    <p className="text-xs text-muted-foreground">Tip: More detail = better results</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-10 shadow-lg">
              <Label className="text-lg font-semibold text-foreground mb-6 block">
                Integrations <span className="text-muted-foreground font-normal text-base">(Optional)</span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {integrationOptions.map((integration) => {
                  const Icon = integration.icon
                  const isSelected = selectedIntegrations.includes(integration.id)
                  return (
                    <button
                      key={integration.id}
                      onClick={() => {
                        setSelectedIntegrations((prev) =>
                          prev.includes(integration.id)
                            ? prev.filter((i) => i !== integration.id)
                            : [...prev, integration.id],
                        )
                      }}
                      className={`relative p-8 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : "border-border bg-background hover:border-primary/50 hover:shadow-md"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <Icon
                        className={`h-10 w-10 mx-auto mb-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <p
                        className={`text-base font-semibold ${isSelected ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {integration.name}
                      </p>
                    </button>
                  )
                })}
              </div>
            </Card>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !toolName || !requirements}
              className="w-full h-16 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Generating Your Tool...
                </>
              ) : (
                <>
                  <Zap className="h-6 w-6 mr-3" />
                  Generate Tool with AI
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="h-[calc(100vh-73px)] flex items-center justify-center p-6">
          <div className="w-full max-w-5xl space-y-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8 relative">
                <Sparkles className="h-12 w-12 text-primary animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border-4 border-primary/10 animate-pulse" />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-3">Generating Your Tool</h2>
              <p className="text-muted-foreground text-lg">
                Our AI is analyzing your requirements and crafting a custom solution...
              </p>
            </div>

            <Card className="bg-card border-border p-10 shadow-2xl">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-foreground font-semibold text-lg">Generation Progress</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {generationProgress < 30
                        ? "Analyzing requirements..."
                        : generationProgress < 60
                          ? "Designing architecture..."
                          : generationProgress < 90
                            ? "Generating code..."
                            : "Finalizing..."}
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xl px-6 py-2 font-bold">
                    {generationProgress}%
                  </Badge>
                </div>

                <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out shadow-lg"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>

                <Card className="bg-background border-border p-6 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Generation Logs</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {logs.length} events
                    </Badge>
                  </div>
                  <ScrollArea className="h-96">
                    <div className="font-mono text-sm space-y-2 pr-4">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className={`flex items-start gap-3 p-2 rounded ${
                            log.level === "error"
                              ? "bg-red-500/10 text-red-500"
                              : log.level === "success"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : log.level === "warning"
                                  ? "bg-yellow-500/10 text-yellow-500"
                                  : "text-muted-foreground"
                          }`}
                        >
                          <span className="text-xs opacity-60 flex-shrink-0">{log.timestamp.toLocaleTimeString()}</span>
                          <span className="flex-1">{log.message}</span>
                        </div>
                      ))}
                      <div ref={logsEndRef} />
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </Card>
          </div>
        </div>
      )}

      {step === "preview" && result && (
        <div className={`flex ${isFullscreen ? "h-screen" : "h-[calc(100vh-73px)]"}`}>
          {/* Left Sidebar - File Explorer */}
          <div
            className={`border-r border-border bg-card flex flex-col transition-all duration-300 ${
              isSidebarCollapsed ? "w-14" : "w-96"
            }`}
          >
            {isSidebarCollapsed ? (
              <div className="p-3 flex flex-col items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarCollapsed(false)}
                  className="w-full h-10"
                  title="Expand Sidebar"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <Separator />
                <Button variant="ghost" size="sm" className="w-full h-10" title="Files">
                  <FolderTree className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="p-5 border-b border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        Project Files
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.files.length} files • {selectedVersion || "v1"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsSidebarCollapsed(true)}
                      className="h-8 w-8 p-0"
                      title="Collapse Sidebar"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={fileSearchQuery}
                      onChange={(e) => setFileSearchQuery(e.target.value)}
                      placeholder="Search files..."
                      className="pl-10 h-10 bg-background border-border"
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
                    {filteredFiles.length === 0 ? (
                      <div className="text-center py-12">
                        <FileCode className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">No files found</p>
                      </div>
                    ) : (
                      filteredFiles.map((file, index) => (
                        <div
                          key={index}
                          className={`group rounded-lg transition-all ${
                            selectedFile === file ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/50"
                          }`}
                        >
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="w-full text-left p-3 flex items-center gap-3"
                          >
                            <FileCode className="h-4 w-4 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium font-mono truncate">{file.name}</p>
                              <p className="text-xs opacity-70 mt-0.5">{file.content.split("\n").length} lines</p>
                            </div>
                            {selectedFile === file && <Check className="h-4 w-4 flex-shrink-0" />}
                          </button>
                          <div
                            className={`px-3 pb-2 flex items-center gap-1 transition-all ${
                              selectedFile === file ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigator.clipboard.writeText(file.content)
                                toast({ title: "Copied to clipboard" })
                              }}
                              className="h-7 px-2 text-xs"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                downloadSingleFile(file)
                              }}
                              className="h-7 px-2 text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>

          {/* Center - Main Preview/Code Area */}
          <div className="flex-1 flex flex-col bg-background overflow-hidden">
            {isEnhancing && (
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-40 flex items-center justify-center">
                <div className="w-full max-w-4xl px-8">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 relative">
                      <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Enhancing Your Tool</h3>
                    <p className="text-muted-foreground">AI is applying your requested changes...</p>
                  </div>

                  <div className="space-y-4">
                    <div className="h-12 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                      <div
                        className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg animate-pulse"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="h-32 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent rounded-lg animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="h-32 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent rounded-lg animate-pulse"
                        style={{ animationDelay: "0.3s" }}
                      />
                    </div>
                    <div
                      className="h-64 bg-gradient-to-b from-muted via-muted/30 to-muted rounded-lg animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className="h-24 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"
                        style={{ animationDelay: "0.5s" }}
                      />
                      <div
                        className="h-24 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-lg animate-pulse"
                        style={{ animationDelay: "0.6s" }}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 flex overflow-hidden">
              {viewMode === "preview" && result.demoUrl ? (
                <div className="flex-1 flex flex-col bg-muted/30">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm" />
                      </div>
                      <div className="flex-1 min-w-0 bg-background/50 rounded-lg px-3 py-1.5 border border-border">
                        <span className="text-xs text-muted-foreground font-mono truncate block">{result.demoUrl}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border mr-2">
                        <Button
                          variant={deviceMode === "desktop" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setDeviceMode("desktop")}
                          className="h-7 w-7 p-0"
                          title="Desktop View"
                        >
                          <Laptop className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant={deviceMode === "tablet" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setDeviceMode("tablet")}
                          className="h-7 w-7 p-0"
                          title="Tablet View"
                        >
                          <Tablet className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant={deviceMode === "mobile" ? "secondary" : "ghost"}
                          size="sm"
                          onClick={() => setDeviceMode("mobile")}
                          className="h-7 w-7 p-0"
                          title="Mobile View"
                        >
                          <Smartphone className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (iframeRef.current) {
                            iframeRef.current.src = result.demoUrl!
                          }
                        }}
                        className="h-8 w-8 p-0"
                        title="Refresh Preview"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(result.demoUrl!, "_blank")}
                        className="h-8 w-8 p-0"
                        title="Open in New Tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/5 p-8">
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
                        ref={iframeRef}
                        src={result.demoUrl}
                        className="w-full h-full"
                        title="Generated Tool Preview"
                        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <FileCode className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold font-mono text-foreground">
                        {selectedFile?.name || "No file selected"}
                      </span>
                      {selectedFile && (
                        <>
                          <Badge variant="secondary" className="text-xs">
                            {selectedFile.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
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
                            navigator.clipboard.writeText(selectedFile.content)
                            toast({ title: "Copied to clipboard" })
                          }
                        }}
                        className="h-8 px-3 text-xs"
                        disabled={!selectedFile}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => selectedFile && downloadSingleFile(selectedFile)}
                        className="h-8 px-3 text-xs"
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
                                  __html: highlightCode(line, selectedFile.type),
                                }}
                              />
                            </div>
                          ))}
                        </pre>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileCode className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                          <p className="text-muted-foreground">Select a file to view its code</p>
                        </div>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>

          <div
            className={`border-l border-border bg-card flex flex-col transition-all duration-300 ${
              isRightSidebarCollapsed ? "w-14" : "w-96"
            }`}
          >
            {isRightSidebarCollapsed ? (
              <div className="p-3 flex flex-col items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsRightSidebarCollapsed(false)}
                  className="w-full h-10"
                  title="Expand Panel"
                >
                  <PanelRightOpen className="h-5 w-5" />
                </Button>
                <Separator />
                <Button variant="ghost" size="sm" className="w-full h-10" title="Logs">
                  <Terminal className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-full h-10" title="Chat">
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-full h-10" title="Versions">
                  <GitBranch className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="w-full h-10" title="Stats">
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Tabs
                value={rightPanelTab}
                onValueChange={(v) => setRightPanelTab(v as any)}
                className="flex-1 flex flex-col h-full"
              >
                <div className="border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0">
                  <div className="flex items-center justify-between px-3 py-2">
                    <TabsList className="grid grid-cols-4 h-10 bg-transparent p-0 gap-1 flex-1">
                      <TabsTrigger value="logs" className="text-xs h-9" title="Logs (⌘L)">
                        <Terminal className="h-4 w-4 mr-1.5" />
                        Logs
                      </TabsTrigger>
                      <TabsTrigger value="chat" className="text-xs h-9" title="Chat (⌘K)">
                        <MessageSquare className="h-4 w-4 mr-1.5" />
                        Chat
                      </TabsTrigger>
                      <TabsTrigger value="versions" className="text-xs h-9">
                        <GitBranch className="h-4 w-4 mr-1.5" />
                        Versions
                      </TabsTrigger>
                      <TabsTrigger value="analytics" className="text-xs h-9">
                        <BarChart3 className="h-4 w-4 mr-1.5" />
                        Stats
                      </TabsTrigger>
                    </TabsList>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsRightSidebarCollapsed(true)}
                      className="h-8 w-8 p-0 ml-2"
                      title="Collapse Panel"
                    >
                      <PanelRightClose className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <TabsContent value="logs" className="flex-1 flex flex-col m-0 overflow-hidden min-h-0">
                  <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-semibold text-foreground">Generation Logs</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {logs.length} events
                      </Badge>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 space-y-2">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className={`p-3 rounded-lg border ${
                            log.level === "error"
                              ? "bg-red-500/10 border-red-500/20 text-red-500"
                              : log.level === "success"
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                : log.level === "warning"
                                  ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"
                                  : "bg-muted/50 border-border text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {log.level === "error" && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                            {log.level === "success" && <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                            {log.level === "warning" && <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                            {log.level === "info" && <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium">{log.message}</p>
                              <p className="text-xs opacity-60 mt-1">{log.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={logsEndRef} />
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="chat" className="flex-1 flex flex-col m-0 overflow-hidden min-h-0">
                  <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Chat with AI</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Request changes or improvements</p>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 space-y-4">
                      {chatHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">No messages yet</p>
                          <p className="text-xs text-muted-foreground mt-1">Start a conversation with AI</p>
                        </div>
                      ) : (
                        chatHistory.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-lg p-3 ${
                                msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <p className="text-xs opacity-60 mt-1.5">{msg.timestamp.toLocaleTimeString()}</p>
                            </div>
                          </div>
                        ))
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  </ScrollArea>
                  <div className="p-4 border-t border-border flex-shrink-0">
                    <div className="flex gap-2">
                      <Textarea
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        placeholder="Describe what you want to improve..."
                        className="flex-1 min-h-[80px] max-h-[120px] bg-background resize-none"
                        disabled={isSendingMessage}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatMessage.trim() || isSendingMessage}
                      size="sm"
                      className="w-full mt-2 h-9"
                    >
                      {isSendingMessage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Enhance Tool
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="versions" className="flex-1 flex flex-col m-0 overflow-hidden min-h-0">
                  <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Version History</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{versions.length} versions</p>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 space-y-2">
                      {versions.length === 0 ? (
                        <div className="text-center py-12">
                          <GitBranch className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground">No versions yet</p>
                        </div>
                      ) : (
                        versions.map((version) => (
                          <button
                            key={version.id}
                            onClick={() => setSelectedVersion(version.id)}
                            className={`w-full text-left p-4 rounded-lg border transition-all ${
                              selectedVersion === version.id
                                ? "bg-primary/10 border-primary"
                                : "bg-muted/50 border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-foreground">{version.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {version.filesCount} files • {version.timestamp.toLocaleString()}
                                </p>
                              </div>
                              {selectedVersion === version.id && (
                                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="analytics" className="flex-1 flex flex-col m-0 overflow-hidden min-h-0">
                  <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-semibold text-foreground">Generation Stats</span>
                    </div>
                  </div>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-4 space-y-4">
                      <Card className="bg-muted/50 border-border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Files</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{result.files.length}</p>
                          </div>
                          <FileCode className="h-8 w-8 text-primary" />
                        </div>
                      </Card>

                      <Card className="bg-muted/50 border-border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Lines of Code</p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                              {result.files.reduce((acc, f) => acc + f.content.split("\n").length, 0)}
                            </p>
                          </div>
                          <Code2 className="h-8 w-8 text-emerald-500" />
                        </div>
                      </Card>

                      <Card className="bg-muted/50 border-border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Versions</p>
                            <p className="text-2xl font-bold text-foreground mt-1">{versions.length}</p>
                          </div>
                          <GitBranch className="h-8 w-8 text-blue-500" />
                        </div>
                      </Card>

                      <Card className="bg-muted/50 border-border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">Generation Time</p>
                            <p className="text-2xl font-bold text-foreground mt-1">
                              {logs.length > 0
                                ? `${Math.round((logs[logs.length - 1].timestamp.getTime() - logs[0].timestamp.getTime()) / 1000)}s`
                                : "0s"}
                            </p>
                          </div>
                          <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                      </Card>

                      <Separator />

                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-3">File Breakdown</h4>
                        <div className="space-y-2">
                          {["tsx", "ts", "css", "json"].map((ext) => {
                            const count = result.files.filter((f) => f.name.endsWith(`.${ext}`)).length
                            if (count === 0) return null
                            return (
                              <div key={ext} className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">.{ext} files</span>
                                <Badge variant="secondary">{count}</Badge>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      )}

      {showRegenerationDialog && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Regenerate Tool</h3>
                  <p className="text-sm text-muted-foreground mt-1">Provide feedback to improve your tool</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRegenerationDialog(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Label htmlFor="feedback" className="text-sm font-semibold text-foreground mb-2 block">
                  What would you like to improve?
                </Label>
                <Textarea
                  id="feedback"
                  value={regenerationFeedback}
                  onChange={(e) => setRegenerationFeedback(e.target.value)}
                  placeholder="E.g., Add a dark mode toggle, improve the layout, add more features..."
                  rows={6}
                  className="bg-background border-border text-foreground resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setShowRegenerationDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRegenerate}
                disabled={!regenerationFeedback.trim() || isRegenerating}
                className="bg-primary hover:bg-primary/90"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Regenerate Tool
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
