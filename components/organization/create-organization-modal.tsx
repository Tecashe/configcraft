// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Plus, Building2, Users, Globe, Loader2, Check, AlertCircle } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { generateSlug } from "@/lib/organization"

// interface CreateOrganizationModalProps {
//   children?: React.ReactNode
//   onSuccess?: (organization: any) => void
// }

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
//   "Non-profit",
//   "Government",
//   "Other",
// ]

// const companySizes = [
//   { value: "SMALL", label: "1-10 employees", description: "Small team or startup" },
//   { value: "MEDIUM", label: "11-50 employees", description: "Growing business" },
//   { value: "LARGE", label: "51-200 employees", description: "Established company" },
//   { value: "ENTERPRISE", label: "200+ employees", description: "Large enterprise" },
// ]

// export function CreateOrganizationModal({ children, onSuccess }: CreateOrganizationModalProps) {
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [step, setStep] = useState(1)
//   const [formData, setFormData] = useState({
//     name: "",
//     slug: "",
//     description: "",
//     industry: "",
//     size: "SMALL" as "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE",
//     website: "",
//   })
//   const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
//   const [checkingSlug, setCheckingSlug] = useState(false)

//   const { toast } = useToast()
//   const router = useRouter()

//   const handleNameChange = (name: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       name,
//       slug: generateSlug(name),
//     }))
//     setSlugAvailable(null)
//   }

//   const handleSlugChange = (slug: string) => {
//     const cleanSlug = generateSlug(slug)
//     setFormData((prev) => ({ ...prev, slug: cleanSlug }))
//     setSlugAvailable(null)
//   }

//   const checkSlugAvailability = async () => {
//     if (!formData.slug) return

//     setCheckingSlug(true)
//     try {
//       const response = await fetch(`/api/organizations/check-slug?slug=${formData.slug}`)
//       const data = await response.json()
//       setSlugAvailable(data.available)
//     } catch (error) {
//       console.error("Error checking slug:", error)
//     } finally {
//       setCheckingSlug(false)
//     }
//   }

//   const handleSubmit = async () => {
//     if (!formData.name.trim()) {
//       toast({
//         title: "Organization name required",
//         description: "Please enter a name for your organization.",
//         variant: "destructive",
//       })
//       return
//     }

//     if (!formData.slug.trim()) {
//       toast({
//         title: "Organization slug required",
//         description: "Please enter a URL slug for your organization.",
//         variant: "destructive",
//       })
//       return
//     }

//     if (slugAvailable === false) {
//       toast({
//         title: "Slug unavailable",
//         description: "This organization URL is already taken. Please choose another.",
//         variant: "destructive",
//       })
//       return
//     }

//     setLoading(true)
//     try {
//       const response = await fetch("/api/organizations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: formData.name.trim(),
//           slug: formData.slug.trim(),
//           description: formData.description.trim() || undefined,
//           industry: formData.industry || undefined,
//           size: formData.size,
//           website: formData.website.trim() || undefined,
//         }),
//       })

//       const data = await response.json()

//       if (!response.ok) {
//         throw new Error(data.error || "Failed to create organization")
//       }

//       toast({
//         title: "Organization created!",
//         description: `${formData.name} has been created successfully.`,
//       })

//       // Reset form
//       setFormData({
//         name: "",
//         slug: "",
//         description: "",
//         industry: "",
//         size: "SMALL",
//         website: "",
//       })
//       setStep(1)
//       setOpen(false)
//       setSlugAvailable(null)

//       // Call success callback
//       onSuccess?.(data.organization)

//       // Redirect to the new organization
//       router.push(`/${data.organization.slug}/dashboard`)
//     } catch (error) {
//       console.error("Organization creation error:", error)
//       toast({
//         title: "Creation failed",
//         description: error instanceof Error ? error.message : "Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const nextStep = () => {
//     if (step === 1) {
//       if (!formData.name.trim()) {
//         toast({
//           title: "Organization name required",
//           description: "Please enter a name for your organization.",
//           variant: "destructive",
//         })
//         return
//       }
//       if (!formData.slug.trim()) {
//         toast({
//           title: "Organization slug required",
//           description: "Please enter a URL slug for your organization.",
//           variant: "destructive",
//         })
//         return
//       }
//       if (slugAvailable === false) {
//         toast({
//           title: "Slug unavailable",
//           description: "This organization URL is already taken.",
//           variant: "destructive",
//         })
//         return
//       }
//     }
//     setStep((prev) => Math.min(prev + 1, 3))
//   }

//   const prevStep = () => {
//     setStep((prev) => Math.max(prev - 1, 1))
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         {children || (
//           <Button className="config-button-primary">
//             <Plus className="h-4 w-4 mr-2" />
//             Create Organization
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[600px] config-card">
//         <DialogHeader>
//           <DialogTitle className="flex items-center text-foreground">
//             <Building2 className="h-5 w-5 mr-2" />
//             Create New Organization
//           </DialogTitle>
//           <DialogDescription className="text-muted-foreground">
//             Set up a new organization to manage your tools and team members.
//           </DialogDescription>
//         </DialogHeader>

//         {/* Progress Indicator */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center space-x-2">
//             {[1, 2, 3].map((stepNumber) => (
//               <div key={stepNumber} className="flex items-center">
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                     step >= stepNumber ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
//                   }`}
//                 >
//                   {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
//                 </div>
//                 {stepNumber < 3 && (
//                   <div className={`w-12 h-0.5 mx-2 ${step > stepNumber ? "bg-primary" : "bg-muted"}`} />
//                 )}
//               </div>
//             ))}
//           </div>
//           <Badge variant="outline" className="text-xs">
//             Step {step} of 3
//           </Badge>
//         </div>

//         <div className="space-y-6">
//           {/* Step 1: Basic Information */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <div className="text-center mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
//                 <p className="text-sm text-muted-foreground">Let's start with the basics about your organization</p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="name" className="text-foreground">
//                   Organization Name *
//                 </Label>
//                 <Input
//                   id="name"
//                   placeholder="Enter organization name"
//                   value={formData.name}
//                   onChange={(e) => handleNameChange(e.target.value)}
//                   className="bg-background border-border text-foreground"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="slug" className="text-foreground">
//                   URL Slug *
//                 </Label>
//                 <div className="flex items-center space-x-2">
//                   <div className="flex-1">
//                     <Input
//                       id="slug"
//                       placeholder="organization-url"
//                       value={formData.slug}
//                       onChange={(e) => handleSlugChange(e.target.value)}
//                       onBlur={checkSlugAvailability}
//                       className="bg-background border-border text-foreground"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                       configcraft.com/<strong>{formData.slug || "your-org"}</strong>
//                     </p>
//                   </div>
//                   <div className="w-6 h-6 flex items-center justify-center">
//                     {checkingSlug ? (
//                       <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
//                     ) : slugAvailable === true ? (
//                       <Check className="h-4 w-4 text-status-success" />
//                     ) : slugAvailable === false ? (
//                       <AlertCircle className="h-4 w-4 text-status-error" />
//                     ) : null}
//                   </div>
//                 </div>
//                 {slugAvailable === false && <p className="text-xs text-status-error">This URL is already taken</p>}
//                 {slugAvailable === true && <p className="text-xs text-status-success">This URL is available</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="description" className="text-foreground">
//                   Description
//                 </Label>
//                 <Textarea
//                   id="description"
//                   placeholder="Brief description of your organization..."
//                   value={formData.description}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                   className="bg-background border-border text-foreground"
//                   rows={3}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Step 2: Organization Details */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <div className="text-center mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Organization Details</h3>
//                 <p className="text-sm text-muted-foreground">Help us understand your organization better</p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="industry" className="text-foreground">
//                   Industry
//                 </Label>
//                 <Select
//                   value={formData.industry}
//                   onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
//                 >
//                   <SelectTrigger className="bg-background border-border text-foreground">
//                     <SelectValue placeholder="Select your industry" />
//                   </SelectTrigger>
//                   <SelectContent className="bg-background border-border">
//                     {industries.map((industry) => (
//                       <SelectItem key={industry} value={industry} className="text-foreground hover:bg-muted">
//                         {industry}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-foreground">Organization Size</Label>
//                 <div className="grid grid-cols-1 gap-3">
//                   {companySizes.map((size) => (
//                     <div
//                       key={size.value}
//                       className={`p-3 rounded-lg border cursor-pointer transition-colors ${
//                         formData.size === size.value
//                           ? "border-primary bg-primary/10"
//                           : "border-border bg-background hover:bg-muted"
//                       }`}
//                       onClick={() => setFormData((prev) => ({ ...prev, size: size.value as any }))}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <p className="font-medium text-foreground">{size.label}</p>
//                           <p className="text-sm text-muted-foreground">{size.description}</p>
//                         </div>
//                         <Users className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Step 3: Additional Information */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <div className="text-center mb-4">
//                 <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
//                 <p className="text-sm text-muted-foreground">Optional details to complete your organization profile</p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="website" className="text-foreground">
//                   Website
//                 </Label>
//                 <div className="flex items-center space-x-2">
//                   <Globe className="h-4 w-4 text-muted-foreground" />
//                   <Input
//                     id="website"
//                     type="url"
//                     placeholder="https://yourcompany.com"
//                     value={formData.website}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
//                     className="bg-background border-border text-foreground"
//                   />
//                 </div>
//               </div>

//               {/* Summary */}
//               <div className="mt-6 p-4 bg-muted rounded-lg">
//                 <h4 className="font-medium text-foreground mb-3">Organization Summary</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Name:</span>
//                     <span className="text-foreground font-medium">{formData.name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">URL:</span>
//                     <span className="text-foreground font-mono">/{formData.slug}</span>
//                   </div>
//                   {formData.industry && (
//                     <div className="flex justify-between">
//                       <span className="text-muted-foreground">Industry:</span>
//                       <span className="text-foreground">{formData.industry}</span>
//                     </div>
//                   )}
//                   <div className="flex justify-between">
//                     <span className="text-muted-foreground">Size:</span>
//                     <span className="text-foreground">
//                       {companySizes.find((s) => s.value === formData.size)?.label}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <Separator />

//         <DialogFooter className="flex justify-between">
//           <Button variant="outline" onClick={prevStep} disabled={step === 1 || loading} className="bg-transparent">
//             Previous
//           </Button>
//           <div className="flex space-x-2">
//             <Button variant="outline" onClick={() => setOpen(false)} disabled={loading} className="bg-transparent">
//               Cancel
//             </Button>
//             {step < 3 ? (
//               <Button onClick={nextStep} className="config-button-primary">
//                 Next
//               </Button>
//             ) : (
//               <Button
//                 onClick={handleSubmit}
//                 disabled={loading || !formData.name.trim() || !formData.slug.trim() || slugAvailable === false}
//                 className="config-button-primary"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Building2 className="h-4 w-4 mr-2" />
//                     Create Organization
//                   </>
//                 )}
//               </Button>
//             )}
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface CreateOrganizationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Retail",
  "Manufacturing",
  "Real Estate",
  "Consulting",
  "Marketing",
  "Other",
]

const COMPANY_SIZES = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
]

export function CreateOrganizationModal({ open, onOpenChange }: CreateOrganizationModalProps) {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    industry: "",
    companySize: "",
    website: "",
  })

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      const response = await fetch(`/api/organizations/check-slug?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      setSlugAvailable(data.available)
    } catch (error) {
      console.error("Error checking slug:", error)
      setSlugAvailable(null)
    } finally {
      setCheckingSlug(false)
    }
  }

  const handleSlugChange = (value: string) => {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
    setFormData((prev) => ({ ...prev, slug }))

    // Debounce slug checking
    const timeoutId = setTimeout(() => {
      checkSlugAvailability(slug)
    }, 500)

    return () => clearTimeout(timeoutId)
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }))

    // Auto-generate slug from name
    if (!formData.slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
      setFormData((prev) => ({ ...prev, slug: autoSlug }))
      checkSlugAvailability(autoSlug)
    }
  }

  const canProceedToStep2 = formData.name && formData.slug && slugAvailable === true
  const canProceedToStep3 = formData.industry && formData.companySize

  const handleSubmit = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create organization")
      }

      const organization = await response.json()

      toast.success("Organization created successfully!")
      onOpenChange(false)

      // Reset form
      setStep(1)
      setFormData({
        name: "",
        slug: "",
        description: "",
        industry: "",
        companySize: "",
        website: "",
      })

      // Redirect to new organization
      router.push(`/${organization.slug}/dashboard`)
      router.refresh()
    } catch (error) {
      console.error("Error creating organization:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create organization")
    } finally {
      setIsLoading(false)
    }
  }

  const progress = (step / 3) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {step} of 3</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <p className="text-sm text-muted-foreground">Let's start with the basics about your organization</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Acme Inc."
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="relative">
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="acme-inc"
                      maxLength={50}
                      className={
                        slugAvailable === false ? "border-red-500" : slugAvailable === true ? "border-green-500" : ""
                      }
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingSlug && <Loader2 className="h-4 w-4 animate-spin" />}
                      {!checkingSlug && slugAvailable === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {!checkingSlug && slugAvailable === false && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be your organization's URL: configcraft.com/{formData.slug}
                  </p>
                  {slugAvailable === false && <p className="text-xs text-red-500">This slug is already taken</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your organization..."
                    maxLength={500}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Organization Details</h3>
                <p className="text-sm text-muted-foreground">Help us understand your organization better</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry *</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select
                    value={formData.companySize}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!canProceedToStep3}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Review & Create</h3>
                <p className="text-sm text-muted-foreground">Review your organization details before creating</p>
              </div>

              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Organization Name</Label>
                  <p className="text-sm">{formData.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">URL</Label>
                  <p className="text-sm">configcraft.com/{formData.slug}</p>
                </div>
                {formData.description && (
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm">{formData.description}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Industry</Label>
                  <p className="text-sm">{formData.industry}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Company Size</Label>
                  <p className="text-sm">{formData.companySize}</p>
                </div>
                {formData.website && (
                  <div>
                    <Label className="text-sm font-medium">Website</Label>
                    <p className="text-sm">{formData.website}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Organization
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
