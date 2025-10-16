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

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useUser } from "@clerk/nextjs"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Textarea } from "@/components/ui/textarea"
// import { ArrowRight, Building2, Users, Target, Zap, CheckCircle } from "lucide-react"
// import { toast } from "@/hooks/use-toast"

// const companySizes = [
//   { value: "1-10", label: "1-10 employees" },
//   { value: "11-50", label: "11-50 employees" },
//   { value: "51-200", label: "51-200 employees" },
//   { value: "201-1000", label: "201-1000 employees" },
//   { value: "1000+", label: "1000+ employees" },
// ]

// const industries = [
//   "Technology",
//   "Healthcare",
//   "Finance",
//   "Education",
//   "Retail",
//   "Manufacturing",
//   "Real Estate",
//   "Marketing",
//   "Consulting",
//   "Other",
// ]

// const useCases = [
//   "Project Management",
//   "Customer Management",
//   "Inventory Tracking",
//   "Data Analysis",
//   "Team Collaboration",
//   "Process Automation",
//   "Reporting & Analytics",
//   "Other",
// ]

// const integrations = [
//   { id: "slack", name: "Slack", description: "Team communication" },
//   { id: "google", name: "Google Workspace", description: "Email and docs" },
//   { id: "microsoft", name: "Microsoft 365", description: "Office suite" },
//   { id: "salesforce", name: "Salesforce", description: "CRM platform" },
//   { id: "hubspot", name: "HubSpot", description: "Marketing & sales" },
//   { id: "zapier", name: "Zapier", description: "Automation" },
// ]

// export default function OnboardingPage() {
//   const { user } = useUser()
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     companyName: "",
//     companySize: "",
//     industry: "",
//     primaryUseCase: "",
//     selectedIntegrations: [] as string[],
//     toolRequirements: "",
//   })

//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handleIntegrationToggle = (integrationId: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       selectedIntegrations: prev.selectedIntegrations.includes(integrationId)
//         ? prev.selectedIntegrations.filter((id) => id !== integrationId)
//         : [...prev.selectedIntegrations, integrationId],
//     }))
//   }

//   const handleSubmit = async () => {
//     if (!formData.companyName.trim()) {
//       toast({
//         title: "Company name required",
//         description: "Please enter your company name to continue.",
//         variant: "destructive",
//       })
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await fetch("/api/onboarding", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           companyName: formData.companyName.trim(),
//           companySize: formData.companySize,
//           industry: formData.industry,
//           primaryUseCase: formData.primaryUseCase,
//           integrations: formData.selectedIntegrations,
//           toolRequirements: formData.toolRequirements,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to complete onboarding")
//       }

//       toast({
//         title: "Welcome to ConfigCraft!",
//         description: "Your organization has been set up successfully.",
//       })

//       // Redirect to the organization dashboard
//       router.push(`/${data.organization.slug}/dashboard`)
//     } catch (error) {
//       console.error("Onboarding error:", error)
//       toast({
//         title: "Setup failed",
//         description: error instanceof Error ? error.message : "Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const nextStep = () => {
//     if (step === 1 && !formData.companyName.trim()) {
//       toast({
//         title: "Company name required",
//         description: "Please enter your company name to continue.",
//         variant: "destructive",
//       })
//       return
//     }
//     setStep((prev) => Math.min(prev + 1, 4))
//   }

//   const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1))
//   }

//   return (
//     <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-2xl">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center space-x-3 mb-6">
//             <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
//               <span className="text-white text-lg font-bold">C</span>
//             </div>
//             <span className="text-2xl font-bold text-white">ConfigCraft</span>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-2">Welcome to ConfigCraft</h1>
//           <p className="text-slate-400">Let's set up your organization and get you started</p>
//         </div>

//         {/* Progress Bar */}
//         <div className="mb-8">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm text-slate-400">Step {step} of 4</span>
//             <span className="text-sm text-slate-400">{Math.round((step / 4) * 100)}% complete</span>
//           </div>
//           <div className="w-full bg-slate-800 rounded-full h-2">
//             <div
//               className="bg-slate-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${(step / 4) * 100}%` }}
//             />
//           </div>
//         </div>

//         <Card className="bg-slate-800 border-slate-700">
//           <CardHeader>
//             <CardTitle className="text-white flex items-center">
//               {step === 1 && (
//                 <>
//                   <Building2 className="w-5 h-5 mr-2" />
//                   Company Information
//                 </>
//               )}
//               {step === 2 && (
//                 <>
//                   <Users className="w-5 h-5 mr-2" />
//                   Organization Details
//                 </>
//               )}
//               {step === 3 && (
//                 <>
//                   <Target className="w-5 h-5 mr-2" />
//                   Use Case & Goals
//                 </>
//               )}
//               {step === 4 && (
//                 <>
//                   <Zap className="w-5 h-5 mr-2" />
//                   Integrations
//                 </>
//               )}
//             </CardTitle>
//             <CardDescription className="text-slate-400">
//               {step === 1 && "Tell us about your company"}
//               {step === 2 && "Help us understand your organization"}
//               {step === 3 && "What do you want to build?"}
//               {step === 4 && "Connect your favorite tools"}
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {step === 1 && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="companyName" className="text-white">
//                     Company Name *
//                   </Label>
//                   <Input
//                     id="companyName"
//                     placeholder="Enter your company name"
//                     value={formData.companyName}
//                     onChange={(e) => handleInputChange("companyName", e.target.value)}
//                     className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
//                   />
//                 </div>
//                 <div>
//                   <Label htmlFor="companySize" className="text-white">
//                     Company Size
//                   </Label>
//                   <Select
//                     value={formData.companySize}
//                     onValueChange={(value) => handleInputChange("companySize", value)}
//                   >
//                     <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
//                       <SelectValue placeholder="Select company size" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-slate-600">
//                       {companySizes.map((size) => (
//                         <SelectItem key={size.value} value={size.value} className="text-white hover:bg-slate-700">
//                           {size.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}

//             {step === 2 && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="industry" className="text-white">
//                     Industry
//                   </Label>
//                   <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
//                     <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
//                       <SelectValue placeholder="Select your industry" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-slate-600">
//                       {industries.map((industry) => (
//                         <SelectItem key={industry} value={industry} className="text-white hover:bg-slate-700">
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}

//             {step === 3 && (
//               <div className="space-y-4">
//                 <div>
//                   <Label htmlFor="primaryUseCase" className="text-white">
//                     Primary Use Case
//                   </Label>
//                   <Select
//                     value={formData.primaryUseCase}
//                     onValueChange={(value) => handleInputChange("primaryUseCase", value)}
//                   >
//                     <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
//                       <SelectValue placeholder="What's your main goal?" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-slate-800 border-slate-600">
//                       {useCases.map((useCase) => (
//                         <SelectItem key={useCase} value={useCase} className="text-white hover:bg-slate-700">
//                           {useCase}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div>
//                   <Label htmlFor="toolRequirements" className="text-white">
//                     Describe your ideal tool
//                   </Label>
//                   <Textarea
//                     id="toolRequirements"
//                     placeholder="Tell us what kind of business tool you'd like to build..."
//                     value={formData.toolRequirements}
//                     onChange={(e) => handleInputChange("toolRequirements", e.target.value)}
//                     className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
//                     rows={4}
//                   />
//                 </div>
//               </div>
//             )}

//             {step === 4 && (
//               <div className="space-y-4">
//                 <div>
//                   <Label className="text-white">Select integrations you'd like to use</Label>
//                   <p className="text-sm text-slate-400 mb-4">You can add more integrations later</p>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {integrations.map((integration) => (
//                       <div
//                         key={integration.id}
//                         className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                           formData.selectedIntegrations.includes(integration.id)
//                             ? "border-slate-500 bg-slate-700"
//                             : "border-slate-600 bg-slate-900 hover:bg-slate-800"
//                         }`}
//                         onClick={() => handleIntegrationToggle(integration.id)}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <Checkbox
//                             checked={formData.selectedIntegrations.includes(integration.id)}
//                             onChange={() => handleIntegrationToggle(integration.id)}
//                             className="border-slate-500"
//                           />
//                           <div>
//                             <p className="text-white font-medium">{integration.name}</p>
//                             <p className="text-sm text-slate-400">{integration.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex justify-between pt-6">
//               <Button
//                 variant="outline"
//                 onClick={prevStep}
//                 disabled={step === 1}
//                 className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
//               >
//                 Previous
//               </Button>
//               {step < 4 ? (
//                 <Button onClick={nextStep} className="bg-slate-700 hover:bg-slate-600 text-white">
//                   Next
//                   <ArrowRight className="w-4 h-4 ml-2" />
//                 </Button>
//               ) : (
//                 <Button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="bg-slate-700 hover:bg-slate-600 text-white"
//                 >
//                   {loading ? "Setting up..." : "Complete Setup"}
//                   <CheckCircle className="w-4 h-4 ml-2" />
//                 </Button>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* User Info */}
//         <div className="text-center mt-8">
//           <p className="text-slate-400 text-sm">
//             Setting up for {user?.firstName} {user?.lastName} ({user?.primaryEmailAddress?.emailAddress})
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Building2, Users, Target, Zap, CheckCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

const companySizes = [
  { value: "1-10", label: "1-10 employees" },
  { value: "11-50", label: "11-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-1000", label: "201-1000 employees" },
  { value: "1000+", label: "1000+ employees" },
]

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Consulting",
  "Other",
]

const useCases = [
  "Project Management",
  "Customer Management",
  "Inventory Tracking",
  "Data Analysis",
  "Team Collaboration",
  "Process Automation",
  "Reporting & Analytics",
  "Other",
]

const integrations = [
  { id: "slack", name: "Slack", description: "Team communication" },
  { id: "google", name: "Google Workspace", description: "Email and docs" },
  { id: "microsoft", name: "Microsoft 365", description: "Office suite" },
  { id: "salesforce", name: "Salesforce", description: "CRM platform" },
  { id: "hubspot", name: "HubSpot", description: "Marketing & sales" },
  { id: "zapier", name: "Zapier", description: "Automation" },
]

export default function OnboardingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    companySize: "",
    industry: "",
    primaryUseCase: "",
    selectedIntegrations: [] as string[],
    toolRequirements: "",
  })

  // ✅ CHECK IF USER ALREADY HAS AN ORGANIZATION ON MOUNT
  useEffect(() => {
    const checkExistingOrganization = async () => {
      if (!isLoaded || !user) return

      try {
        setChecking(true)
        const response = await fetch("/api/onboarding", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: "check", // Dummy value to trigger the check
          }),
        })

        const data = await response.json()

        if (response.ok && data.alreadyExists) {
          // User already has an organization, redirect them
          router.push(`/${data.organization.slug}/dashboard`)
          return
        }
      } catch (error) {
        console.error("Error checking existing organization:", error)
      } finally {
        setChecking(false)
      }
    }

    checkExistingOrganization()
  }, [isLoaded, user, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleIntegrationToggle = (integrationId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedIntegrations: prev.selectedIntegrations.includes(integrationId)
        ? prev.selectedIntegrations.filter((id) => id !== integrationId)
        : [...prev.selectedIntegrations, integrationId],
    }))
  }

  const handleSubmit = async () => {
    if (!formData.companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name to continue.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName.trim(),
          companySize: formData.companySize,
          industry: formData.industry,
          primaryUseCase: formData.primaryUseCase,
          integrations: formData.selectedIntegrations,
          toolRequirements: formData.toolRequirements,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to complete onboarding")
      }

      // Handle the case where organization already exists
      if (data.alreadyExists) {
        toast({
          title: "Organization exists",
          description: "Redirecting to your existing organization...",
        })
        router.push(`/${data.organization.slug}/dashboard`)
        return
      }

      toast({
        title: "Welcome to ConfigCraft!",
        description: "Your organization has been set up successfully.",
      })

      // Redirect to the organization dashboard
      router.push(`/${data.organization.slug}/dashboard`)
    } catch (error) {
      console.error("Onboarding error:", error)
      toast({
        title: "Setup failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && !formData.companyName.trim()) {
      toast({
        title: "Company name required",
        description: "Please enter your company name to continue.",
        variant: "destructive",
      })
      return
    }
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1))
  }

  // Show loading state while checking for existing organization
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Checking your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700">
              <span className="text-white text-lg font-bold">C</span>
            </div>
            <span className="text-2xl font-bold text-white">ConfigCraft</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to ConfigCraft</h1>
          <p className="text-slate-400">Let's set up your organization and get you started</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {step} of 4</span>
            <span className="text-sm text-slate-400">{Math.round((step / 4) * 100)}% complete</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2">
            <div
              className="bg-slate-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              {step === 1 && (
                <>
                  <Building2 className="w-5 h-5 mr-2" />
                  Company Information
                </>
              )}
              {step === 2 && (
                <>
                  <Users className="w-5 h-5 mr-2" />
                  Organization Details
                </>
              )}
              {step === 3 && (
                <>
                  <Target className="w-5 h-5 mr-2" />
                  Use Case & Goals
                </>
              )}
              {step === 4 && (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Integrations
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {step === 1 && "Tell us about your company"}
              {step === 2 && "Help us understand your organization"}
              {step === 3 && "What do you want to build?"}
              {step === 4 && "Connect your favorite tools"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName" className="text-white">
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
                  />
                </div>
                <div>
                  <Label htmlFor="companySize" className="text-white">
                    Company Size
                  </Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => handleInputChange("companySize", value)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value} className="text-white hover:bg-slate-700">
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="industry" className="text-white">
                    Industry
                  </Label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry} className="text-white hover:bg-slate-700">
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="primaryUseCase" className="text-white">
                    Primary Use Case
                  </Label>
                  <Select
                    value={formData.primaryUseCase}
                    onValueChange={(value) => handleInputChange("primaryUseCase", value)}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                      <SelectValue placeholder="What's your main goal?" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {useCases.map((useCase) => (
                        <SelectItem key={useCase} value={useCase} className="text-white hover:bg-slate-700">
                          {useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="toolRequirements" className="text-white">
                    Describe your ideal tool
                  </Label>
                  <Textarea
                    id="toolRequirements"
                    placeholder="Tell us what kind of business tool you'd like to build..."
                    value={formData.toolRequirements}
                    onChange={(e) => handleInputChange("toolRequirements", e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder-slate-400"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Select integrations you'd like to use</Label>
                  <p className="text-sm text-slate-400 mb-4">You can add more integrations later</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {integrations.map((integration) => (
                      <div
                        key={integration.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.selectedIntegrations.includes(integration.id)
                            ? "border-slate-500 bg-slate-700"
                            : "border-slate-600 bg-slate-900 hover:bg-slate-800"
                        }`}
                        onClick={() => handleIntegrationToggle(integration.id)}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={formData.selectedIntegrations.includes(integration.id)}
                            onChange={() => handleIntegrationToggle(integration.id)}
                            className="border-slate-500"
                          />
                          <div>
                            <p className="text-white font-medium">{integration.name}</p>
                            <p className="text-sm text-slate-400">{integration.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
              >
                Previous
              </Button>
              {step < 4 ? (
                <Button onClick={nextStep} className="bg-slate-700 hover:bg-slate-600 text-white">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-slate-700 hover:bg-slate-600 text-white"
                >
                  {loading ? "Setting up..." : "Complete Setup"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Setting up for {user?.firstName} {user?.lastName} ({user?.primaryEmailAddress?.emailAddress})
          </p>
        </div>
      </div>
    </div>
  )
}