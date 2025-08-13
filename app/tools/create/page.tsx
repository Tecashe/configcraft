"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Wrench,
  Users,
  BarChart3,
  DollarSign,
  Calendar,
  Package,
  Loader2,
  CheckCircle,
  Lightbulb,
} from "lucide-react"
import Link from "next/link"

export default function CreateToolPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    requirements: "",
    features: [] as string[],
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const categories = [
    { value: "sales", label: "Sales & CRM", icon: BarChart3, description: "Lead tracking, pipeline management" },
    { value: "hr", label: "HR & People", icon: Users, description: "Employee management, onboarding" },
    { value: "finance", label: "Finance", icon: DollarSign, description: "Expense tracking, budgeting" },
    { value: "operations", label: "Operations", icon: Package, description: "Inventory, asset management" },
    { value: "project", label: "Project Management", icon: Calendar, description: "Task tracking, collaboration" },
    { value: "other", label: "Other", icon: Wrench, description: "Custom business processes" },
  ]

  const commonFeatures = [
    "User authentication",
    "Data export/import",
    "Email notifications",
    "Team collaboration",
    "Mobile responsive",
    "Search & filtering",
    "Analytics dashboard",
    "API integration",
    "Custom branding",
    "Approval workflows",
  ]

  const examples = {
    sales:
      "A customer relationship management system that tracks leads from initial contact through deal closure. Include contact information, deal stages, follow-up reminders, sales pipeline visualization, and team collaboration features.",
    hr: "An employee onboarding system that guides new hires through their first weeks. Include document upload, task checklists, training modules, manager assignments, and progress tracking.",
    finance:
      "An expense reporting tool that allows employees to submit expenses with receipt photos. Include approval workflows, budget tracking, reimbursement status, and spending analytics.",
    operations:
      "An inventory management system that tracks stock levels across multiple locations. Include supplier information, reorder alerts, barcode scanning, and inventory reports.",
    project:
      "A project management dashboard that tracks tasks, deadlines, and team progress. Include Kanban boards, time tracking, file sharing, and milestone reporting.",
    other:
      "Describe your specific business process in detail, including who will use it, what data it should handle, and what outcomes you want to achieve.",
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          requirements: formData.requirements,
          features: formData.features,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create tool")
      }

      const result = await response.json()
      router.push(`/tools/${result.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while creating the tool")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
      {/* Header */}
      <div className="border-b" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                asChild
                style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
              >
                <Link href="/tools">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tools
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  Create New Tool
                </h1>
                <p style={{ color: "#B0B0B0" }}>Build a custom business tool with AI</p>
              </div>
            </div>
            <div className="text-sm" style={{ color: "#B0B0B0" }}>
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
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

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#888888" }}
                >
                  <Sparkles className="w-8 h-8" style={{ color: "#121212" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  What tool do you want to build?
                </CardTitle>
                <CardDescription style={{ color: "#B0B0B0" }}>
                  Give your tool a name and choose a category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: "#E0E0E0" }}>
                    Tool name *
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
                  <Label style={{ color: "#E0E0E0" }}>Category *</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categories.map((category) => (
                      <Card
                        key={category.value}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          formData.category === category.value ? "ring-2" : ""
                        }`}
                        style={{
                          backgroundColor: formData.category === category.value ? "#444444" : "#121212",
                          borderColor: formData.category === category.value ? "#888888" : "#444444",
                        }}
                        onClick={() => setFormData({ ...formData, category: category.value })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "#888888" }}
                            >
                              <category.icon className="w-5 h-5" style={{ color: "#121212" }} />
                            </div>
                            <div>
                              <h3 className="font-medium" style={{ color: "#E0E0E0" }}>
                                {category.label}
                              </h3>
                              <p className="text-sm" style={{ color: "#B0B0B0" }}>
                                {category.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" style={{ color: "#E0E0E0" }}>
                    Brief description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="A short description of what this tool will do..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    className="placeholder:text-[#B0B0B0]"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNext}
                    disabled={!formData.name || !formData.category}
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

          {/* Step 2: Detailed Requirements */}
          {currentStep === 2 && (
            <Card style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#888888" }}
                >
                  <Lightbulb className="w-8 h-8" style={{ color: "#121212" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  Describe your requirements
                </CardTitle>
                <CardDescription style={{ color: "#B0B0B0" }}>
                  The more detail you provide, the better your tool will be
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="requirements" style={{ color: "#E0E0E0" }}>
                    Detailed requirements *
                  </Label>
                  <Textarea
                    id="requirements"
                    placeholder={examples[formData.category as keyof typeof examples] || examples.other}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={8}
                    style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
                    className="placeholder:text-[#B0B0B0]"
                  />
                  <p className="text-xs" style={{ color: "#888888" }}>
                    Include who will use it, what data it should handle, key features needed, and desired outcomes.
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
                  <h4 className="font-medium mb-2" style={{ color: "#E0E0E0" }}>
                    💡 Tips for better results:
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: "#B0B0B0" }}>
                    <li>• Be specific about user roles and permissions</li>
                    <li>• Mention any integrations you need</li>
                    <li>• Describe the workflow step by step</li>
                    <li>• Include any reporting or analytics needs</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!formData.requirements}
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

          {/* Step 3: Features & Review */}
          {currentStep === 3 && (
            <Card style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
              <CardHeader className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#888888" }}
                >
                  <CheckCircle className="w-8 h-8" style={{ color: "#121212" }} />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
                  Select additional features
                </CardTitle>
                <CardDescription style={{ color: "#B0B0B0" }}>
                  Choose optional features to include in your tool
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label style={{ color: "#E0E0E0" }}>Optional features (select any that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonFeatures.map((feature) => (
                      <Badge
                        key={feature}
                        variant={formData.features.includes(feature) ? "default" : "outline"}
                        className={`cursor-pointer p-2 text-center justify-center ${
                          formData.features.includes(feature) ? "" : "hover:opacity-80"
                        }`}
                        style={{
                          backgroundColor: formData.features.includes(feature) ? "#888888" : "transparent",
                          color: formData.features.includes(feature) ? "#121212" : "#B0B0B0",
                          borderColor: "#444444",
                        }}
                        onClick={() => handleFeatureToggle(feature)}
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Review Section */}
                <div className="space-y-4 pt-6 border-t" style={{ borderColor: "#444444" }}>
                  <h3 className="font-semibold" style={{ color: "#E0E0E0" }}>
                    Review your tool
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#B0B0B0" }}>
                        Name
                      </p>
                      <p style={{ color: "#E0E0E0" }}>{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#B0B0B0" }}>
                        Category
                      </p>
                      <p style={{ color: "#E0E0E0" }}>{categories.find((c) => c.value === formData.category)?.label}</p>
                    </div>
                    {formData.description && (
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#B0B0B0" }}>
                          Description
                        </p>
                        <p style={{ color: "#E0E0E0" }}>{formData.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium" style={{ color: "#B0B0B0" }}>
                        Requirements
                      </p>
                      <p className="text-sm" style={{ color: "#E0E0E0" }}>
                        {formData.requirements.substring(0, 200)}...
                      </p>
                    </div>
                    {formData.features.length > 0 && (
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#B0B0B0" }}>
                          Selected Features
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.features.map((feature) => (
                            <Badge key={feature} style={{ backgroundColor: "#444444", color: "#E0E0E0" }}>
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
                  <h4 className="font-medium mb-2" style={{ color: "#E0E0E0" }}>
                    🚀 What happens next?
                  </h4>
                  <ul className="text-sm space-y-1" style={{ color: "#B0B0B0" }}>
                    <li>• AI will analyze your requirements and generate your tool</li>
                    <li>• You'll be able to preview and test the tool</li>
                    <li>• Once satisfied, publish it with a custom URL</li>
                    <li>• Share with your team and start using immediately</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={loading}
                    style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ backgroundColor: "#888888", color: "#121212" }}
                    className="hover:opacity-90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Tool...
                      </>
                    ) : (
                      <>
                        Create Tool
                        <Sparkles className="w-4 h-4 ml-2" />
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
