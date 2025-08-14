// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Zap, Building2, Puzzle, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react"
// import Link from "next/link"

// export default function OnboardingPage() {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const router = useRouter()

//   const [formData, setFormData] = useState({
//     // Step 1: Company Details
//     companyName: "",
//     industry: "",
//     companySize: "",
//     role: "",

//     // Step 2: Integration Preferences
//     currentTools: [] as string[],
//     primaryUseCase: "",

//     // Step 3: First Tool
//     toolDescription: "",
//   })

//   const totalSteps = 3
//   const progress = (currentStep / totalSteps) * 100

//   const industries = [
//     "Technology",
//     "Healthcare",
//     "Finance",
//     "Manufacturing",
//     "Retail",
//     "Education",
//     "Real Estate",
//     "Marketing",
//     "Consulting",
//     "Other",
//   ]

//   const companySizes = [
//     { label: "1-10 employees", value: "SMALL" },
//     { label: "11-50 employees", value: "MEDIUM" },
//     { label: "51-200 employees", value: "LARGE" },
//     { label: "201+ employees", value: "ENTERPRISE" },
//   ]

//   const roles = [
//     "CEO/Founder",
//     "CTO/VP Engineering",
//     "Operations Manager",
//     "Product Manager",
//     "Business Analyst",
//     "Other",
//   ]

//   const availableTools = [
//     "Salesforce",
//     "HubSpot",
//     "Slack",
//     "Microsoft Teams",
//     "Google Workspace",
//     "Notion",
//     "Airtable",
//     "Trello",
//     "Asana",
//     "Monday.com",
//     "Zapier",
//     "Other",
//   ]

//   const handleToolToggle = (tool: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       currentTools: prev.currentTools.includes(tool)
//         ? prev.currentTools.filter((t) => t !== tool)
//         : [...prev.currentTools, tool],
//     }))
//   }

//   const handleNext = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const handleBack = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const handleFinish = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch("/api/onboarding", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           companyName: formData.companyName,
//           companySize: formData.companySize,
//           industry: formData.industry,
//           primaryUseCase: formData.primaryUseCase,
//           integrations: formData.currentTools,
//           toolRequirements: formData.toolDescription,
//         }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.error || "Failed to complete onboarding")
//       }

//       const result = await response.json()
//       console.log("Onboarding completed:", result)

//       // Redirect to dashboard
//       router.push("/dashboard")
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred during onboarding")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: "#121212" }}>
//       {/* Header */}
//       <div className="border-b" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <Link href="/" className="flex items-center space-x-2">
//               <div
//                 className="w-8 h-8 rounded-lg flex items-center justify-center"
//                 style={{ backgroundColor: "#888888" }}
//               >
//                 <Zap className="w-5 h-5" style={{ color: "#121212" }} />
//               </div>
//               <span className="text-xl font-bold" style={{ color: "#E0E0E0" }}>
//                 ConfigCraft
//               </span>
//             </Link>
//             <div className="text-sm" style={{ color: "#B0B0B0" }}>
//               Step {currentStep} of {totalSteps}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="max-w-2xl mx-auto">
//           {/* Progress Bar */}
//           <div className="mb-8">
//             <Progress value={progress} className="h-2" />
//           </div>

//           {error && (
//             <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "#444444", borderColor: "#444444" }}>
//               <p className="text-sm" style={{ color: "#E0E0E0" }}>
//                 {error}
//               </p>
//             </div>
//           )}

//           {/* Step 1: Company Details */}
//           {currentStep === 1 && (
//             <Card className="shadow-xl" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//               <CardHeader className="text-center">
//                 <div
//                   className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
//                   style={{ backgroundColor: "#888888" }}
//                 >
//                   <Building2 className="w-8 h-8" style={{ color: "#121212" }} />
//                 </div>
//                 <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
//                   Tell us about your company
//                 </CardTitle>
//                 <CardDescription style={{ color: "#B0B0B0" }}>
//                   Help us customize ConfigCraft for your business needs
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="companyName" style={{ color: "#E0E0E0" }}>
//                     Company name *
//                   </Label>
//                   <Input
//                     id="companyName"
//                     placeholder="Acme Corp"
//                     value={formData.companyName}
//                     onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
//                     required
//                     style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
//                     className="placeholder:text-[#B0B0B0]"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="industry" style={{ color: "#E0E0E0" }}>
//                     Industry *
//                   </Label>
//                   <Select
//                     value={formData.industry}
//                     onValueChange={(value) => setFormData({ ...formData, industry: value })}
//                   >
//                     <SelectTrigger style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}>
//                       <SelectValue placeholder="Select your industry" />
//                     </SelectTrigger>
//                     <SelectContent style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//                       {industries.map((industry) => (
//                         <SelectItem key={industry} value={industry} style={{ color: "#E0E0E0" }}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companySize" style={{ color: "#E0E0E0" }}>
//                     Company size *
//                   </Label>
//                   <Select
//                     value={formData.companySize}
//                     onValueChange={(value) => setFormData({ ...formData, companySize: value })}
//                   >
//                     <SelectTrigger style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}>
//                       <SelectValue placeholder="Select company size" />
//                     </SelectTrigger>
//                     <SelectContent style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//                       {companySizes.map((size) => (
//                         <SelectItem key={size.value} value={size.value} style={{ color: "#E0E0E0" }}>
//                           {size.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="role" style={{ color: "#E0E0E0" }}>
//                     Your role *
//                   </Label>
//                   <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
//                     <SelectTrigger style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}>
//                       <SelectValue placeholder="Select your role" />
//                     </SelectTrigger>
//                     <SelectContent style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//                       {roles.map((role) => (
//                         <SelectItem key={role} value={role} style={{ color: "#E0E0E0" }}>
//                           {role}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="flex justify-end pt-4">
//                   <Button
//                     onClick={handleNext}
//                     style={{ backgroundColor: "#888888", color: "#121212" }}
//                     className="hover:opacity-90"
//                     disabled={!formData.companyName || !formData.industry || !formData.companySize || !formData.role}
//                   >
//                     Continue
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Step 2: Integration Preferences */}
//           {currentStep === 2 && (
//             <Card className="shadow-xl" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//               <CardHeader className="text-center">
//                 <div
//                   className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
//                   style={{ backgroundColor: "#888888" }}
//                 >
//                   <Puzzle className="w-8 h-8" style={{ color: "#121212" }} />
//                 </div>
//                 <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
//                   What tools do you currently use?
//                 </CardTitle>
//                 <CardDescription style={{ color: "#B0B0B0" }}>
//                   We'll help you integrate with your existing workflow
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-3">
//                   <Label style={{ color: "#E0E0E0" }}>Current tools (select all that apply)</Label>
//                   <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                     {availableTools.map((tool) => (
//                       <Badge
//                         key={tool}
//                         variant={formData.currentTools.includes(tool) ? "default" : "outline"}
//                         className={`cursor-pointer p-2 text-center justify-center ${
//                           formData.currentTools.includes(tool) ? "" : "hover:opacity-80"
//                         }`}
//                         style={{
//                           backgroundColor: formData.currentTools.includes(tool) ? "#888888" : "transparent",
//                           color: formData.currentTools.includes(tool) ? "#121212" : "#B0B0B0",
//                           borderColor: "#444444",
//                         }}
//                         onClick={() => handleToolToggle(tool)}
//                       >
//                         {tool}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="primaryUseCase" style={{ color: "#E0E0E0" }}>
//                     What's your primary use case for ConfigCraft? *
//                   </Label>
//                   <Textarea
//                     id="primaryUseCase"
//                     placeholder="e.g., We need to streamline our customer onboarding process and track leads more effectively..."
//                     value={formData.primaryUseCase}
//                     onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value })}
//                     rows={4}
//                     required
//                     style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
//                     className="placeholder:text-[#B0B0B0]"
//                   />
//                 </div>

//                 <div className="flex justify-between pt-4">
//                   <Button
//                     variant="outline"
//                     onClick={handleBack}
//                     style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
//                   >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button
//                     onClick={handleNext}
//                     style={{ backgroundColor: "#888888", color: "#121212" }}
//                     className="hover:opacity-90"
//                     disabled={!formData.primaryUseCase}
//                   >
//                     Continue
//                     <ArrowRight className="w-4 h-4 ml-2" />
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {/* Step 3: First Tool Creation */}
//           {currentStep === 3 && (
//             <Card className="shadow-xl" style={{ backgroundColor: "#121212", borderColor: "#444444" }}>
//               <CardHeader className="text-center">
//                 <div
//                   className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
//                   style={{ backgroundColor: "#888888" }}
//                 >
//                   <CheckCircle className="w-8 h-8" style={{ color: "#121212" }} />
//                 </div>
//                 <CardTitle className="text-2xl font-bold" style={{ color: "#E0E0E0" }}>
//                   Let's create your first tool!
//                 </CardTitle>
//                 <CardDescription style={{ color: "#B0B0B0" }}>
//                   Describe the business process you'd like to streamline (included in your free trial)
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
//                   <h3 className="font-semibold mb-2" style={{ color: "#E0E0E0" }}>
//                     🎉 Free Trial Included
//                   </h3>
//                   <p className="text-sm" style={{ color: "#B0B0B0" }}>
//                     Your first custom tool is on us! Describe what you need and we'll build it in 24 hours.
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="toolDescription" style={{ color: "#E0E0E0" }}>
//                     Describe your first tool *
//                   </Label>
//                   <Textarea
//                     id="toolDescription"
//                     placeholder="I need a customer onboarding tracker that helps my sales team manage leads from initial contact through deal closure. It should include contact information, deal stages, follow-up reminders, and team collaboration features..."
//                     value={formData.toolDescription}
//                     onChange={(e) => setFormData({ ...formData, toolDescription: e.target.value })}
//                     rows={6}
//                     required
//                     style={{ backgroundColor: "#444444", borderColor: "#444444", color: "#E0E0E0" }}
//                     className="placeholder:text-[#B0B0B0]"
//                   />
//                   <p className="text-xs" style={{ color: "#888888" }}>
//                     Be as detailed as possible. Include who will use it, what data it should handle, and what outcomes
//                     you want.
//                   </p>
//                 </div>

//                 <div className="p-4 rounded-lg" style={{ backgroundColor: "#444444" }}>
//                   <h4 className="font-medium mb-2" style={{ color: "#E0E0E0" }}>
//                     Example prompts:
//                   </h4>
//                   <ul className="text-sm space-y-1" style={{ color: "#B0B0B0" }}>
//                     <li>• "Customer onboarding tracker for sales team"</li>
//                     <li>• "Inventory management with approval workflows"</li>
//                     <li>• "Employee expense reporting system"</li>
//                   </ul>
//                 </div>

//                 <div className="flex justify-between pt-4">
//                   <Button
//                     variant="outline"
//                     onClick={handleBack}
//                     disabled={loading}
//                     style={{ borderColor: "#444444", color: "#B0B0B0", backgroundColor: "transparent" }}
//                   >
//                     <ArrowLeft className="w-4 h-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button
//                     onClick={handleFinish}
//                     style={{ backgroundColor: "#888888", color: "#121212" }}
//                     className="hover:opacity-90"
//                     disabled={!formData.toolDescription || loading}
//                   >
//                     {loading ? (
//                       <>
//                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         Setting up...
//                       </>
//                     ) : (
//                       <>
//                         Complete Setup
//                         <CheckCircle className="w-4 h-4 ml-2" />
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight, ArrowLeft, Building2, Users, Zap } from "lucide-react"
import { toast } from "sonner"

interface OnboardingData {
  organizationName: string
  organizationSize: string
  industry: string
  website: string
  description: string
  useCases: string[]
  integrations: string[]
  requirements: string
}

const COMPANY_SIZES = [
  { value: "SMALL", label: "1-10 employees" },
  { value: "MEDIUM", label: "11-50 employees" },
  { value: "LARGE", label: "51-200 employees" },
  { value: "ENTERPRISE", label: "200+ employees" },
]

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Consulting",
  "Real Estate",
  "Marketing",
  "Other",
]

const USE_CASES = [
  "Customer Management",
  "Project Tracking",
  "Inventory Management",
  "Lead Generation",
  "Data Analytics",
  "Team Collaboration",
  "Document Management",
  "Workflow Automation",
]

const INTEGRATIONS = [
  "Google Workspace",
  "Microsoft 365",
  "Slack",
  "Salesforce",
  "HubSpot",
  "Stripe",
  "PayPal",
  "Zapier",
]

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    organizationName: user?.firstName ? `${user.firstName}'s Organization` : "My Organization",
    organizationSize: "",
    industry: "",
    website: "",
    description: "",
    useCases: [],
    integrations: [],
    requirements: "",
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleUseCaseToggle = (useCase: string) => {
    setData((prev) => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter((uc) => uc !== useCase)
        : [...prev.useCases, useCase],
    }))
  }

  const handleIntegrationToggle = (integration: string) => {
    setData((prev) => ({
      ...prev,
      integrations: prev.integrations.includes(integration)
        ? prev.integrations.filter((i) => i !== integration)
        : [...prev.integrations, integration],
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to complete onboarding")
      }

      const result = await response.json()
      toast.success("Welcome to ConfigCraft! Your organization has been created.")

      // Redirect to the new organization dashboard
      router.push(`/${result.organization.slug}/dashboard`)
    } catch (error) {
      console.error("Onboarding error:", error)
      toast.error("Failed to complete onboarding. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedStep1 = data.organizationName && data.organizationSize && data.industry
  const canProceedStep2 = data.useCases.length > 0
  const canSubmit = canProceedStep1 && canProceedStep2

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to ConfigCraft</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Let's set up your organization in just a few steps</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-fit">
              {currentStep === 1 && <Building2 className="h-6 w-6 text-white" />}
              {currentStep === 2 && <Users className="h-6 w-6 text-white" />}
              {currentStep === 3 && <Zap className="h-6 w-6 text-white" />}
            </div>
            <CardTitle className="text-2xl">
              {currentStep === 1 && "Organization Details"}
              {currentStep === 2 && "How will you use ConfigCraft?"}
              {currentStep === 3 && "Integrations & Requirements"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Tell us about your organization"}
              {currentStep === 2 && "Select your primary use cases"}
              {currentStep === 3 && "Connect your tools and share requirements"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Organization Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    value={data.organizationName}
                    onChange={(e) => setData((prev) => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="Enter your organization name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="organizationSize">Organization Size *</Label>
                  <Select
                    value={data.organizationSize}
                    onValueChange={(value) => setData((prev) => ({ ...prev, organizationSize: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select organization size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={data.industry}
                    onValueChange={(value) => setData((prev) => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={data.website}
                    onChange={(e) => setData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourcompany.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={data.description}
                    onChange={(e) => setData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your organization"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Use Cases */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Select the primary ways you plan to use ConfigCraft (select at least one):
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {USE_CASES.map((useCase) => (
                    <div key={useCase} className="flex items-center space-x-2">
                      <Checkbox
                        id={useCase}
                        checked={data.useCases.includes(useCase)}
                        onCheckedChange={() => handleUseCaseToggle(useCase)}
                      />
                      <Label htmlFor={useCase} className="text-sm font-normal">
                        {useCase}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Integrations & Requirements */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Integrations (Optional)</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Select the tools you'd like to integrate with:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {INTEGRATIONS.map((integration) => (
                      <div key={integration} className="flex items-center space-x-2">
                        <Checkbox
                          id={integration}
                          checked={data.integrations.includes(integration)}
                          onCheckedChange={() => handleIntegrationToggle(integration)}
                        />
                        <Label htmlFor={integration} className="text-sm font-normal">
                          {integration}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">Special Requirements (Optional)</Label>
                  <textarea
                    id="requirements"
                    value={data.requirements}
                    onChange={(e) => setData((prev) => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Tell us about any specific requirements, compliance needs, or custom features you need..."
                    className="mt-1 w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={(currentStep === 1 && !canProceedStep1) || (currentStep === 2 && !canProceedStep2)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  {isLoading ? "Creating..." : "Complete Setup"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
