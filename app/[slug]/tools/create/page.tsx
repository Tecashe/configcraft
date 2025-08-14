"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Wand2,
  FileText,
  Database,
  Users,
  Calculator,
  Calendar,
  ShoppingCart,
  BarChart3,
  Settings,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const toolCategories = [
  { id: "dashboard", name: "Dashboard", icon: BarChart3, description: "Analytics and reporting tools" },
  { id: "form", name: "Forms", icon: FileText, description: "Data collection and surveys" },
  { id: "calculator", name: "Calculator", icon: Calculator, description: "Financial and business calculators" },
  { id: "crm", name: "CRM", icon: Users, description: "Customer relationship management" },
  { id: "inventory", name: "Inventory", icon: Database, description: "Stock and asset management" },
  { id: "scheduler", name: "Scheduler", icon: Calendar, description: "Appointment and task scheduling" },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart, description: "Online store and sales tools" },
  { id: "settings", name: "Settings", icon: Settings, description: "Configuration and admin panels" },
]

const examplePrompts = {
  dashboard: [
    "Create a sales dashboard showing revenue, leads, and conversion rates with charts",
    "Build an employee performance dashboard with KPIs, goals, and progress tracking",
    "Design a project management dashboard with task progress, timelines, and team workload",
  ],
  form: [
    "Create a customer feedback form with rating scales, comments, and file uploads",
    "Build an employee onboarding form with personal details, documents, and e-signatures",
    "Design a product order form with quantity selectors, pricing, and payment options",
  ],
  calculator: [
    "Build a loan calculator with monthly payments, interest rates, and amortization schedule",
    "Create an ROI calculator for marketing campaigns with cost inputs and revenue projections",
    "Design a tax calculator with income brackets, deductions, and estimated payments",
  ],
  crm: [
    "Create a customer management system with contact details, interaction history, and notes",
    "Build a lead tracking system with pipeline stages, probability scores, and follow-up tasks",
    "Design a support ticket system with priority levels, assignment, and resolution tracking",
  ],
  inventory: [
    "Create an inventory management system with stock levels, reorder points, and supplier info",
    "Build a warehouse management tool with location tracking, picking lists, and shipping",
    "Design an asset tracking system with maintenance schedules, depreciation, and assignments",
  ],
  scheduler: [
    "Create an appointment booking system with calendar integration and automated reminders",
    "Build a task scheduler with deadlines, priorities, and team assignments",
    "Design a resource booking system with availability, conflicts, and approval workflows",
  ],
  ecommerce: [
    "Create a product catalog with categories, pricing, inventory, and customer reviews",
    "Build an order management system with payment processing, shipping, and tracking",
    "Design a customer portal with order history, returns, and loyalty program features",
  ],
  settings: [
    "Create a user management panel with roles, permissions, and access controls",
    "Build a system configuration tool with environment settings and feature toggles",
    "Design a billing and subscription management interface with plans and usage tracking",
  ],
}

interface GenerationStep {
  id: string
  name: string
  description: string
  status: "pending" | "active" | "completed" | "error"
}

export default function CreateToolPage() {
  const [activeTab, setActiveTab] = useState("describe")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [toolName, setToolName] = useState("")
  const [toolDescription, setToolDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentToolId, setCurrentToolId] = useState<string | null>(null)
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    {
      id: "analyze",
      name: "Analyzing Requirements",
      description: "AI is understanding your business needs and requirements",
      status: "pending",
    },
    {
      id: "design",
      name: "Designing Interface",
      description: "Creating the user interface layout and user experience",
      status: "pending",
    },
    {
      id: "generate",
      name: "Generating Code",
      description: "Building your custom tool with React and TypeScript",
      status: "pending",
    },
    {
      id: "deploy",
      name: "Finalizing Tool",
      description: "Setting up your tool and making it ready to use",
      status: "pending",
    },
  ])

  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const orgSlug = params?.slug as string

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setActiveTab("details")
  }

  const handleExamplePrompt = (prompt: string) => {
    setRequirements(prompt)
  }

  const validateForm = () => {
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

    if (!toolDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description for your tool.",
        variant: "destructive",
      })
      return false
    }

    if (!requirements.trim()) {
      toast({
        title: "Requirements Required",
        description: "Please describe what you want your tool to do.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const updateGenerationStep = (stepId: string, status: GenerationStep["status"]) => {
    setGenerationSteps((prev) => prev.map((step) => (step.id === stepId ? { ...step, status } : step)))
  }

  const pollToolStatus = async (toolId: string) => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/status`)
      if (!response.ok) throw new Error("Failed to check status")

      const data = await response.json()

      // Update progress based on status
      switch (data.generationStatus) {
        case "analyzing":
          updateGenerationStep("analyze", "active")
          setGenerationProgress(10)
          break
        case "designing":
          updateGenerationStep("analyze", "completed")
          updateGenerationStep("design", "active")
          setGenerationProgress(30)
          break
        case "generating":
          updateGenerationStep("design", "completed")
          updateGenerationStep("generate", "active")
          setGenerationProgress(60)
          break
        case "finalizing":
          updateGenerationStep("generate", "completed")
          updateGenerationStep("deploy", "active")
          setGenerationProgress(90)
          break
        case "completed":
          updateGenerationStep("deploy", "completed")
          setGenerationProgress(100)
          setIsGenerating(false)

          toast({
            title: "Tool Created Successfully!",
            description: "Your tool has been generated and is ready to use.",
          })

          // Redirect to the tool page
          router.push(`/${orgSlug}/tools/${toolId}`)
          return
        case "error":
          setGenerationSteps((prev) =>
            prev.map((step) => ({ ...step, status: step.status === "active" ? "error" : step.status })),
          )
          setIsGenerating(false)

          toast({
            title: "Generation Failed",
            description: data.error || "There was an error generating your tool. Please try again.",
            variant: "destructive",
          })
          return
      }

      // Continue polling if still generating
      if (data.generationStatus !== "completed" && data.generationStatus !== "error") {
        setTimeout(() => pollToolStatus(toolId), 2000)
      }
    } catch (error) {
      console.error("Status polling error:", error)
      setIsGenerating(false)
      toast({
        title: "Status Check Failed",
        description: "Unable to check generation status. Please refresh the page.",
        variant: "destructive",
      })
    }
  }

  const handleCreateTool = async () => {
    if (!validateForm()) return

    setIsGenerating(true)
    setActiveTab("generating")
    setGenerationProgress(5)
    updateGenerationStep("analyze", "active")

    try {
      // Create the tool and start generation
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

      const tool = await response.json()
      setCurrentToolId(tool.id)

      // Start polling for status updates
      setTimeout(() => pollToolStatus(tool.id), 1000)
    } catch (error) {
      console.error("Tool creation error:", error)
      toast({
        title: "Creation Failed",
        description:
          error instanceof Error ? error.message : "There was an error creating your tool. Please try again.",
        variant: "destructive",
      })

      // Reset generation state
      setGenerationSteps((prev) => prev.map((step) => ({ ...step, status: "pending" })))
      setGenerationProgress(0)
      setIsGenerating(false)
      setActiveTab("details")
    }
  }

  const selectedCategoryData = toolCategories.find((cat) => cat.id === selectedCategory)

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
              <h1 className="text-xl font-semibold">Create New Tool</h1>
              <p className="text-sm text-muted-foreground">Build a custom business tool with AI</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">AI-Powered</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="describe" disabled={isGenerating}>
              1. Choose Category
            </TabsTrigger>
            <TabsTrigger value="details" disabled={!selectedCategory || isGenerating}>
              2. Tool Details
            </TabsTrigger>
            <TabsTrigger value="generating" disabled={!isGenerating}>
              3. Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="describe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5" />
                  <span>What type of tool do you want to create?</span>
                </CardTitle>
                <CardDescription>
                  Choose a category that best matches your business needs. Our AI will generate a custom tool for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {toolCategories.map((category) => (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCategory === category.id
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <category.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{category.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {selectedCategoryData && <selectedCategoryData.icon className="h-5 w-5" />}
                  <span>Tool Details</span>
                  <Badge variant="secondary">{selectedCategoryData?.name}</Badge>
                </CardTitle>
                <CardDescription>
                  Provide details about your tool so our AI can create exactly what you need.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="toolName">Tool Name</Label>
                      <Input
                        id="toolName"
                        placeholder="e.g., Sales Dashboard, Customer Form"
                        value={toolName}
                        onChange={(e) => setToolName(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="toolDescription">Short Description</Label>
                      <Textarea
                        id="toolDescription"
                        placeholder="Brief description of what this tool does..."
                        value={toolDescription}
                        onChange={(e) => setToolDescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Example Ideas</Label>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedCategory &&
                          examplePrompts[selectedCategory as keyof typeof examplePrompts]?.map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto p-3 text-xs bg-transparent"
                              onClick={() => handleExamplePrompt(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Detailed Requirements</Label>
                  <Textarea
                    id="requirements"
                    placeholder="Describe what you want your tool to do. Be as specific as possible. Include features, data fields, calculations, workflows, etc."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    rows={6}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    The more detailed your requirements, the better your tool will be. Include specific features, data
                    fields, and workflows.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleCreateTool} className="px-8" disabled={isGenerating}>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Create Tool with AI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generating" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Generating Your Tool</span>
                </CardTitle>
                <CardDescription>
                  Our AI is creating your custom business tool. This process typically takes 2-5 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>

                <div className="space-y-4">
                  {generationSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {step.status === "completed" && <CheckCircle className="h-5 w-5 text-green-500" />}
                        {step.status === "active" && <Loader2 className="h-5 w-5 text-primary animate-spin" />}
                        {step.status === "pending" && <div className="h-5 w-5 rounded-full border-2 border-muted" />}
                        {step.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.name}</p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">Creating: {toolName}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{toolDescription}</p>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategoryData?.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
