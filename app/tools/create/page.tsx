"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowRight,
  ArrowLeft,
  Zap,
  MessageSquare,
  Settings,
  Eye,
  Sparkles,
  Users,
  Database,
  Workflow,
  Puzzle,
  Play,
  Globe,
  Lock,
  UserPlus,
  CheckCircle,
  Rocket,
} from "lucide-react"
import Link from "next/link"

export default function CreateToolPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    // Step 1: Requirements
    description: "",

    // Step 2: Configuration
    toolName: "",
    userRoles: [] as string[],
    dataFields: [] as string[],
    workflowSteps: [] as string[],
    integrations: [] as string[],

    // Step 3: Publishing
    toolUrl: "",
    accessLevel: "team",
    teamMembers: [] as string[],
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const examplePrompts = [
    "Customer onboarding tracker for sales team",
    "Inventory management with approval workflows",
    "Employee expense reporting system",
    "Project task board with time tracking",
    "Client feedback collection portal",
    "Asset management and maintenance tracker",
  ]

  const availableRoles = ["Admin", "Manager", "Team Member", "Viewer", "Guest"]

  const availableIntegrations = ["Slack", "Google Workspace", "Salesforce", "HubSpot", "Stripe", "Zapier"]

  const handleExamplePrompt = (prompt: string) => {
    setFormData((prev) => ({ ...prev, description: prompt }))
  }

  const handleGenerateTool = async () => {
    setIsGenerating(true)

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock generated configuration
    setFormData((prev) => ({
      ...prev,
      toolName: "Customer Onboarding Tracker",
      userRoles: ["Admin", "Manager", "Team Member"],
      dataFields: ["Contact Info", "Deal Stage", "Follow-up Date", "Notes"],
      workflowSteps: ["Lead Capture", "Qualification", "Proposal", "Negotiation", "Closed Won"],
      integrations: ["Slack", "Salesforce"],
      toolUrl: "customer-onboarding-tracker",
    }))

    setIsGenerating(false)
    setCurrentStep(2)
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

  const handlePublish = () => {
    // Handle tool publishing
    console.log("Publishing tool:", formData)
    // Redirect to dashboard or tool page
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/dashboard" className="flex items-center space-x-2">
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
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span className={currentStep >= 1 ? "text-purple-600 font-medium" : ""}>Requirements</span>
              <span className={currentStep >= 2 ? "text-purple-600 font-medium" : ""}>Configuration</span>
              <span className={currentStep >= 3 ? "text-purple-600 font-medium" : ""}>Preview & Publish</span>
            </div>
          </div>

          {/* Step 1: Requirements Gathering */}
          {currentStep === 1 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Describe your business tool</CardTitle>
                <CardDescription>
                  Tell our AI what you need. Be as detailed as possible about who uses it, what data it handles, and
                  what outcomes you want.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* AI Chat Interface */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white rounded-lg p-3 max-w-md shadow-sm">
                      <p className="text-gray-800 text-sm">
                        Hi! I'm your AI assistant. Describe the business process or tool you need, and I'll help you
                        build it. What would you like to create?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                  <Label htmlFor="description">Tool Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="I need a customer onboarding tracker that helps my sales team manage leads from initial contact through deal closure. It should include contact information, deal stages, follow-up reminders, and team collaboration features. The tool will be used by 8 sales reps and 2 managers..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={8}
                    className="resize-none"
                    required
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Be specific about users, data, and desired outcomes</span>
                    <span>{formData.description.length} characters</span>
                  </div>
                </div>

                {/* Example Prompts */}
                <div className="space-y-3">
                  <Label>Quick Start Examples</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {examplePrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="justify-start h-auto p-3 text-left bg-transparent"
                        onClick={() => handleExamplePrompt(prompt)}
                      >
                        <Sparkles className="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" />
                        <span className="text-sm">{prompt}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Suggestions */}
                {formData.description.length > 50 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900 mb-1">AI Suggestions</h4>
                        <p className="text-sm text-blue-700">
                          Great start! Consider mentioning specific integrations you need (Slack, Salesforce, etc.) and
                          any approval workflows required.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleGenerateTool}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={!formData.description || formData.description.length < 20 || isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating Tool...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Tool
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Tool Configuration */}
          {currentStep === 2 && (
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Configure your tool</CardTitle>
                <CardDescription>Review and customize the AI-generated configuration for your tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* AI Generated Summary */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">AI Generated Tool Summary</h3>
                      <p className="text-gray-700 mb-4">
                        Based on your description, I've created a <strong>Customer Onboarding Tracker</strong> with lead
                        management, progress tracking, and team collaboration features. Here's what I've configured:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Contact information and deal stage tracking</li>
                        <li>• 5-stage workflow from lead capture to closed won</li>
                        <li>• Team collaboration with notes and assignments</li>
                        <li>• Integration with Slack and Salesforce</li>
                        <li>• Role-based permissions for admins, managers, and team members</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Tool Name */}
                <div className="space-y-2">
                  <Label htmlFor="toolName">Tool Name *</Label>
                  <Input
                    id="toolName"
                    value={formData.toolName}
                    onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                    required
                  />
                </div>

                {/* User Roles */}
                <div className="space-y-3">
                  <Label>User Roles & Permissions</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {availableRoles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={formData.userRoles.includes(role)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({ ...prev, userRoles: [...prev.userRoles, role] }))
                            } else {
                              setFormData((prev) => ({ ...prev, userRoles: prev.userRoles.filter((r) => r !== role) }))
                            }
                          }}
                        />
                        <Label htmlFor={role} className="text-sm">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-3">
                  <Label>Data Fields</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.dataFields.map((field, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>{field}</span>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">AI has configured the optimal data fields for your use case</p>
                </div>

                {/* Workflow Steps */}
                <div className="space-y-3">
                  <Label>Workflow Steps</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.workflowSteps.map((step, index) => (
                      <Badge key={index} variant="outline" className="flex items-center space-x-1">
                        <Workflow className="w-3 h-3" />
                        <span>{step}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Integrations */}
                <div className="space-y-3">
                  <Label>Integrations</Label>
                  <div className="grid md:grid-cols-3 gap-2">
                    {availableIntegrations.map((integration) => (
                      <div key={integration} className="flex items-center space-x-2">
                        <Checkbox
                          id={integration}
                          checked={formData.integrations.includes(integration)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({ ...prev, integrations: [...prev.integrations, integration] }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                integrations: prev.integrations.filter((i) => i !== integration),
                              }))
                            }
                          }}
                        />
                        <Label htmlFor={integration} className="text-sm flex items-center">
                          <Puzzle className="w-3 h-3 mr-1" />
                          {integration}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Preview */}
                <div className="space-y-3">
                  <Label>Tool Structure Preview</Label>
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-200">
                    <div className="text-center text-gray-500">
                      <Eye className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">Interactive preview will be generated in the next step</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    disabled={!formData.toolName}
                  >
                    Preview Tool
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Preview & Publish */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Tool Preview */}
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold flex items-center">
                        <Eye className="w-6 h-6 mr-2 text-purple-600" />
                        Tool Preview
                      </CardTitle>
                      <CardDescription>Interactive preview of your {formData.toolName}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Play className="w-4 h-4 mr-2" />
                      Test Mode
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mock Tool Interface */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 border-b">
                      <h3 className="font-semibold text-gray-900">{formData.toolName}</h3>
                      <p className="text-sm text-gray-600">Live preview with sample data</p>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Lead Capture</h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-gray-50 rounded border">
                              <p className="font-medium text-sm">John Smith</p>
                              <p className="text-xs text-gray-600">Acme Corp • john@acme.com</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded border">
                              <p className="font-medium text-sm">Sarah Johnson</p>
                              <p className="text-xs text-gray-600">TechFlow • sarah@techflow.com</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Qualification</h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-blue-50 rounded border border-blue-200">
                              <p className="font-medium text-sm">Mike Davis</p>
                              <p className="text-xs text-gray-600">DataSync • mike@datasync.com</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-900">Proposal</h4>
                          <div className="space-y-2">
                            <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                              <p className="font-medium text-sm">Lisa Chen</p>
                              <p className="text-xs text-gray-600">GrowthLabs • lisa@growthlabs.com</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Publishing Settings */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-purple-600" />
                    Publish Settings
                  </CardTitle>
                  <CardDescription>Configure how your tool will be deployed and accessed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tool URL */}
                  <div className="space-y-2">
                    <Label htmlFor="toolUrl">Tool URL</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        configcraft.app/tools/
                      </span>
                      <Input
                        id="toolUrl"
                        value={formData.toolUrl}
                        onChange={(e) => setFormData({ ...formData, toolUrl: e.target.value })}
                        className="rounded-l-none"
                        placeholder="my-tool-name"
                      />
                    </div>
                  </div>

                  {/* Access Level */}
                  <div className="space-y-3">
                    <Label>Access Level</Label>
                    <Select
                      value={formData.accessLevel}
                      onValueChange={(value) => setFormData({ ...formData, accessLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">
                          <div className="flex items-center">
                            <Lock className="w-4 h-4 mr-2" />
                            Private - Only you
                          </div>
                        </SelectItem>
                        <SelectItem value="team">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Team - Selected members
                          </div>
                        </SelectItem>
                        <SelectItem value="company">
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            Company - All company members
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Team Assignment */}
                  {formData.accessLevel === "team" && (
                    <div className="space-y-3">
                      <Label>Team Members</Label>
                      <div className="flex items-center space-x-2">
                        <Input placeholder="Enter email address" />
                        <Button variant="outline" size="sm">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Team members will receive email invitations to access the tool
                      </p>
                    </div>
                  )}

                  {/* Deployment Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">Ready to Deploy</h4>
                        <p className="text-sm text-green-700">
                          Your tool will be live at <strong>configcraft.app/tools/{formData.toolUrl}</strong> and
                          accessible to your selected team members.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button
                      onClick={handlePublish}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      disabled={!formData.toolUrl}
                    >
                      <Rocket className="w-4 h-4 mr-2" />
                      Deploy Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
