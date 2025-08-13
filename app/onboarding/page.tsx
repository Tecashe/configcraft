"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Building2, Puzzle, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Step 1: Company Details
    companyName: "",
    industry: "",
    companySize: "",
    role: "",

    // Step 2: Integration Preferences
    currentTools: [] as string[],
    primaryUseCase: "",

    // Step 3: First Tool
    toolDescription: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Manufacturing",
    "Retail",
    "Education",
    "Real Estate",
    "Marketing",
    "Consulting",
    "Other",
  ]

  const companySizes = [
    { label: "1-10 employees", value: "SMALL" },
    { label: "11-50 employees", value: "MEDIUM" },
    { label: "51-200 employees", value: "LARGE" },
    { label: "201+ employees", value: "ENTERPRISE" },
  ]

  const roles = [
    "CEO/Founder",
    "CTO/VP Engineering",
    "Operations Manager",
    "Product Manager",
    "Business Analyst",
    "Other",
  ]

  const availableTools = [
    "Salesforce",
    "HubSpot",
    "Slack",
    "Microsoft Teams",
    "Google Workspace",
    "Notion",
    "Airtable",
    "Trello",
    "Asana",
    "Monday.com",
    "Zapier",
    "Other",
  ]

  const handleToolToggle = (tool: string) => {
    setFormData((prev) => ({
      ...prev,
      currentTools: prev.currentTools.includes(tool)
        ? prev.currentTools.filter((t) => t !== tool)
        : [...prev.currentTools, tool],
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

  const handleFinish = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          companySize: formData.companySize,
          industry: formData.industry,
          primaryUseCase: formData.primaryUseCase,
          integrations: formData.currentTools,
          toolRequirements: formData.toolDescription,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to complete onboarding")
      }

      const result = await response.json()
      console.log("Onboarding completed:", result)

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during onboarding")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ConfigCraft</span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Tell us about your company</CardTitle>
                <CardDescription>Help us customize ConfigCraft for your business needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company size *</Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={!formData.companyName || !formData.industry || !formData.companySize || !formData.role}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Integration Preferences */}
          {currentStep === 2 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Puzzle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">What tools do you currently use?</CardTitle>
                <CardDescription>We'll help you integrate with your existing workflow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Current tools (select all that apply)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableTools.map((tool) => (
                      <Badge
                        key={tool}
                        variant={formData.currentTools.includes(tool) ? "default" : "outline"}
                        className={`cursor-pointer p-2 text-center justify-center ${
                          formData.currentTools.includes(tool)
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleToolToggle(tool)}
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="primaryUseCase">What's your primary use case for ConfigCraft? *</Label>
                  <Textarea
                    id="primaryUseCase"
                    placeholder="e.g., We need to streamline our customer onboarding process and track leads more effectively..."
                    value={formData.primaryUseCase}
                    onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={!formData.primaryUseCase}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: First Tool Creation */}
          {currentStep === 3 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Let's create your first tool!</CardTitle>
                <CardDescription>
                  Describe the business process you'd like to streamline (included in your free trial)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">🎉 Free Trial Included</h3>
                  <p className="text-sm text-gray-600">
                    Your first custom tool is on us! Describe what you need and we'll build it in 24 hours.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toolDescription">Describe your first tool *</Label>
                  <Textarea
                    id="toolDescription"
                    placeholder="I need a customer onboarding tracker that helps my sales team manage leads from initial contact through deal closure. It should include contact information, deal stages, follow-up reminders, and team collaboration features..."
                    value={formData.toolDescription}
                    onChange={(e) => setFormData({ ...formData, toolDescription: e.target.value })}
                    rows={6}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Be as detailed as possible. Include who will use it, what data it should handle, and what outcomes
                    you want.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Example prompts:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• "Customer onboarding tracker for sales team"</li>
                    <li>• "Inventory management with approval workflows"</li>
                    <li>• "Employee expense reporting system"</li>
                  </ul>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} disabled={loading}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleFinish}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={!formData.toolDescription || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <CheckCircle className="w-4 h-4 ml-2" />
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
