"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
  MessageSquare,
  Brain,
  Clock,
  Users,
  Database,
  Workflow,
} from "lucide-react"
import Link from "next/link"

interface RequirementsAnalysis {
  toolType: string
  dataFields: string[]
  userRoles: string[]
  workflows: string[]
  integrations: string[]
  complexity: "simple" | "medium" | "complex"
  estimatedHours: number
  followUpQuestions: string[]
}

export default function CreateToolPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<RequirementsAnalysis | null>(null)
  const [conversationHistory, setConversationHistory] = useState<
    Array<{
      type: "user" | "ai"
      content: string
      timestamp: Date
    }>
  >([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    requirements: "",
    category: "",
    additionalContext: "",
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  // Load template data if templateId is provided
  useEffect(() => {
    if (templateId) {
      // In a real app, fetch template data from API
      const templateData = getTemplateData(templateId)
      if (templateData) {
        setFormData({
          name: templateData.name,
          description: templateData.description,
          requirements: templateData.requirements,
          category: templateData.category,
          additionalContext: "",
        })
      }
    }
  }, [templateId])

  const getTemplateData = (id: string) => {
    const templates: Record<string, any> = {
      "lead-tracker": {
        name: "Lead Tracking System",
        description: "Track leads from initial contact through deal closure",
        requirements:
          "I need a customer onboarding tracker that helps my sales team manage leads from initial contact through deal closure. It should include contact information, deal stages, follow-up reminders, and team collaboration features.",
        category: "Sales & CRM",
      },
      "inventory-management": {
        name: "Inventory Management System",
        description: "Track stock levels, manage suppliers, and automate reorder processes",
        requirements:
          "I need an inventory management system to track stock levels, manage suppliers, and automate reorder processes. It should include low stock alerts, supplier management, purchase order generation, and inventory reports.",
        category: "Operations",
      },
      "expense-reporting": {
        name: "Expense Report System",
        description: "Submit, approve, and track employee expenses",
        requirements:
          "I need an employee expense reporting system where employees can submit expenses with receipts, managers can approve them, and we can track reimbursements. It should include receipt upload, approval workflows, and expense categories.",
        category: "Finance",
      },
    }
    return templates[id]
  }

  const handleAnalyzeRequirements = async () => {
    if (!formData.requirements || formData.requirements.length < 20) {
      setError("Please provide at least 20 characters describing your requirements")
      return
    }

    setAnalyzing(true)
    setError(null)

    try {
      const response = await fetch("/api/tools/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requirements: formData.requirements,
          context: conversationHistory.map((h) => h.content),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze requirements")
      }

      const result = await response.json()
      setAnalysis(result.analysis)

      // Add to conversation history
      setConversationHistory((prev) => [
        ...prev,
        {
          type: "user",
          content: formData.requirements,
          timestamp: new Date(),
        },
        {
          type: "ai",
          content: `I've analyzed your requirements and identified this as a ${result.analysis.toolType} with ${result.analysis.complexity} complexity. Here are some follow-up questions to refine the requirements.`,
          timestamp: new Date(),
        },
      ])

      setCurrentStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze requirements")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleAnswerFollowUp = async (question: string, answer: string) => {
    if (!answer.trim()) return

    setConversationHistory((prev) => [
      ...prev,
      {
        type: "user",
        content: `Q: ${question}\nA: ${answer}`,
        timestamp: new Date(),
      },
    ])

    // Update additional context
    setFormData((prev) => ({
      ...prev,
      additionalContext: prev.additionalContext + `\n${question}: ${answer}`,
    }))
  }

  const handleGenerateTool = async () => {
    if (!formData.name || !formData.requirements) {
      setError("Please provide a tool name and requirements")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/tools/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          requirements: formData.requirements + "\n\nAdditional Context:\n" + formData.additionalContext,
          category: formData.category || analysis?.toolType || "Custom",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate tool")
      }

      const result = await response.json()

      // Redirect to tool page to show generation progress
      router.push(`/tools/${result.toolId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate tool")
    } finally {
      setLoading(false)
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "simple":
        return "bg-green-900 text-green-200"
      case "medium":
        return "bg-yellow-900 text-yellow-200"
      case "complex":
        return "bg-red-900 text-red-200"
      default:
        return "bg-gray-900 text-gray-200"
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/tools" className="flex items-center space-x-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#888888" }}
              >
                <Zap className="w-5 h-5" style={{ color: "#121212" }} />
              </div>
              <span className="text-xl font-bold" style={{ color: "#E0E0E0" }}>
                ConfigCraft
              </span>
            </Link>
            <div className="text-sm" style={{ color: "#B0B0B0" }}>
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#444444", borderColor: "#444444" }}>
              <p className="text-sm" style={{ color: "#E0E0E0" }}>
                {error}
              </p>
            </div>
          )}

          {/* Step 1: Requirements Input */}
          {currentStep === 1 && (
            <Card className="shadow-xl" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#888888" }}
                >
                  <MessageSquare className="w-8 h-8" style={{ color: "#121212" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  Describe Your Business Tool
                </CardTitle>
                <CardDescription style={{ color: "#B0B0B0" }}>
                  Tell us what you need and our AI will help design the perfect solution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: "#E0E0E0" }}>
                    Tool Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Customer Onboarding Tracker"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    className="placeholder:text-[#B0B0B0]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ color: "#E0E0E0" }}>
                    Brief Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="One-line summary of what this tool does"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    className="placeholder:text-[#B0B0B0]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements" style={{ color: "#E0E0E0" }}>
                    Detailed Requirements *
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder="Describe in detail what you need this tool to do. Include who will use it, what data it should handle, what processes it should support, and what outcomes you want to achieve..."
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={8}
                    style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    className="placeholder:text-[#B0B0B0]"
                  />
                  <p className="text-xs" style={{ color: "#888888" }}>
                    {formData.requirements.length}/20 characters minimum
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
                  <h4 className="font-medium mb-2" style={{ color: "#E0E0E0" }}>
                    💡 Tips for better results:
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: "#B0B0B0" }}>
                    <li>• Be specific about who will use the tool</li>
                    <li>• Describe the data you need to track</li>
                    <li>• Mention any workflows or approval processes</li>
                    <li>• Include integration requirements</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleAnalyzeRequirements}
                    disabled={
                      !formData.name || !formData.requirements || formData.requirements.length < 20 || analyzing
                    }
                    style={{ backgroundColor: "#888888", color: "#121212" }}
                    className="hover:opacity-90"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Analyze with AI
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: AI Analysis Results */}
          {currentStep === 2 && analysis && (
            <Card className="shadow-xl" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#888888" }}
                >
                  <Brain className="w-8 h-8" style={{ color: "#121212" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  AI Analysis Complete
                </CardTitle>
                <CardDescription style={{ color: "#B0B0B0" }}>
                  Here's what we understand about your requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Analysis Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                        Tool Type
                      </h3>
                      <Badge style={{ backgroundColor: "#888888", color: "#121212" }}>{analysis.toolType}</Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                        Complexity
                      </h3>
                      <Badge className={getComplexityColor(analysis.complexity)}>{analysis.complexity}</Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                        <Clock className="w-4 h-4 inline mr-1" />
                        Estimated Time
                      </h3>
                      <p style={{ color: "#B0B0B0" }}>{analysis.estimatedHours} hours</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                        <Users className="w-4 h-4 inline mr-1" />
                        User Roles
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {analysis.userRoles.map((role, index) => (
                          <Badge key={index} variant="outline" style={{ borderColor: "#444444", color: "#B0B0B0" }}>
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                        <Database className="w-4 h-4 inline mr-1" />
                        Data Fields
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {analysis.dataFields.slice(0, 4).map((field, index) => (
                          <Badge key={index} variant="outline" style={{ borderColor: "#444444", color: "#B0B0B0" }}>
                            {field}
                          </Badge>
                        ))}
                        {analysis.dataFields.length > 4 && (
                          <Badge variant="outline" style={{ borderColor: "#444444", color: "#B0B0B0" }}>
                            +{analysis.dataFields.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
                        <Workflow className="w-4 h-4 inline mr-1" />
                        Key Workflows
                      </h3>
                      <div className="flex flex-wrap gap-1">
                        {analysis.workflows.slice(0, 3).map((workflow, index) => (
                          <Badge key={index} variant="outline" style={{ borderColor: "#444444", color: "#B0B0B0" }}>
                            {workflow}
                          </Badge>
                        ))}
                        {analysis.workflows.length > 3 && (
                          <Badge variant="outline" style={{ borderColor: "#444444", color: "#B0B0B0" }}>
                            +{analysis.workflows.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator style={{ backgroundColor: "#444444" }} />

                {/* Follow-up Questions */}
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
                    Help us refine your requirements
                  </h3>
                  <div className="space-y-4">
                    {analysis.followUpQuestions.map((question, index) => (
                      <FollowUpQuestion
                        key={index}
                        question={question}
                        onAnswer={(answer) => handleAnswerFollowUp(question, answer)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    style={{ backgroundColor: "#888888", color: "#121212" }}
                    className="hover:opacity-90"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Customize */}
          {currentStep === 3 && analysis && (
            <Card className="shadow-xl" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#888888" }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "#121212" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  Review & Customize
                </CardTitle>
                <CardDescription style={{ color: "#B0B0B0" }}>
                  Final review before we generate your custom business tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Conversation History */}
                <div>
                  <h3 className="font-semibold mb-4" style={{ color: "#E0E0E0" }}>
                    Conversation Summary
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {conversationHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg ${message.type === "user" ? "ml-4" : "mr-4"}`}
                        style={{
                          backgroundColor: message.type === "user" ? "#444444" : "#333333",
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium" style={{ color: "#888888" }}>
                            {message.type === "user" ? "You" : "AI Assistant"}
                          </span>
                          <span className="text-xs" style={{ color: "#888888" }}>
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm" style={{ color: "#E0E0E0" }}>
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator style={{ backgroundColor: "#444444" }} />

                {/* Final Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label style={{ color: "#E0E0E0" }}>Tool Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    />
                  </div>
                  <div>
                    <Label style={{ color: "#E0E0E0" }}>Category</Label>
                    <Input
                      value={formData.category || analysis.toolType}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    />
                  </div>
                </div>

                <div>
                  <Label style={{ color: "#E0E0E0" }}>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleGenerateTool}
                    disabled={loading}
                    style={{ backgroundColor: "#888888", color: "#121212" }}
                    className="hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Tool
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

// Follow-up Question Component
function FollowUpQuestion({ question, onAnswer }: { question: string; onAnswer: (answer: string) => void }) {
  const [answer, setAnswer] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (answer.trim()) {
      onAnswer(answer)
      setSubmitted(true)
    }
  }

  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
      <p className="font-medium mb-3" style={{ color: "#E0E0E0" }}>
        {question}
      </p>
      {!submitted ? (
        <div className="flex space-x-2">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            style={{ backgroundColor: "#333333", borderColor: "#333333", color: "#E0E0E0" }}
            className="placeholder:text-[#B0B0B0]"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={!answer.trim()}
            style={{ backgroundColor: "#888888", color: "#121212" }}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm" style={{ color: "#B0B0B0" }}>
            {answer}
          </span>
        </div>
      )}
    </div>
  )
}
