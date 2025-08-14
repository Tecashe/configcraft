// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useUser } from "@clerk/nextjs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { CheckCircle, Loader2, AlertCircle } from "lucide-react"
// import { toast } from "sonner"

// interface CreateOrganizationModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// const INDUSTRIES = [
//   "Technology",
//   "Healthcare",
//   "Finance",
//   "Education",
//   "Retail",
//   "Manufacturing",
//   "Real Estate",
//   "Consulting",
//   "Marketing",
//   "Other",
// ]

// const COMPANY_SIZES = [
//   "1-10 employees",
//   "11-50 employees",
//   "51-200 employees",
//   "201-500 employees",
//   "501-1000 employees",
//   "1000+ employees",
// ]

// export function CreateOrganizationModal({ open, onOpenChange }: CreateOrganizationModalProps) {
//   const router = useRouter()
//   const { user } = useUser()
//   const [step, setStep] = useState(1)
//   const [isLoading, setIsLoading] = useState(false)
//   const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
//   const [checkingSlug, setCheckingSlug] = useState(false)

//   const [formData, setFormData] = useState({
//     name: "",
//     slug: "",
//     description: "",
//     industry: "",
//     companySize: "",
//     website: "",
//   })

//   const checkSlugAvailability = async (slug: string) => {
//     if (!slug || slug.length < 3) {
//       setSlugAvailable(null)
//       return
//     }

//     setCheckingSlug(true)
//     try {
//       const response = await fetch(`/api/organizations/check-slug?slug=${encodeURIComponent(slug)}`)
//       const data = await response.json()
//       setSlugAvailable(data.available)
//     } catch (error) {
//       console.error("Error checking slug:", error)
//       setSlugAvailable(null)
//     } finally {
//       setCheckingSlug(false)
//     }
//   }

//   const handleSlugChange = (value: string) => {
//     const slug = value
//       .toLowerCase()
//       .replace(/[^a-z0-9-]/g, "-")
//       .replace(/-+/g, "-")
//     setFormData((prev) => ({ ...prev, slug }))

//     // Debounce slug checking
//     const timeoutId = setTimeout(() => {
//       checkSlugAvailability(slug)
//     }, 500)

//     return () => clearTimeout(timeoutId)
//   }

//   const handleNameChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, name: value }))

//     // Auto-generate slug from name
//     if (!formData.slug) {
//       const autoSlug = value
//         .toLowerCase()
//         .replace(/[^a-z0-9]/g, "-")
//         .replace(/-+/g, "-")
//       setFormData((prev) => ({ ...prev, slug: autoSlug }))
//       checkSlugAvailability(autoSlug)
//     }
//   }

//   const canProceedToStep2 = formData.name && formData.slug && slugAvailable === true
//   const canProceedToStep3 = formData.industry && formData.companySize

//   const handleSubmit = async () => {
//     if (!user) return

//     setIsLoading(true)
//     try {
//       const response = await fetch("/api/organizations", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to create organization")
//       }

//       const organization = await response.json()

//       toast.success("Organization created successfully!")
//       onOpenChange(false)

//       // Reset form
//       setStep(1)
//       setFormData({
//         name: "",
//         slug: "",
//         description: "",
//         industry: "",
//         companySize: "",
//         website: "",
//       })

//       // Redirect to new organization
//       router.push(`/${organization.slug}/dashboard`)
//       router.refresh()
//     } catch (error) {
//       console.error("Error creating organization:", error)
//       toast.error(error instanceof Error ? error.message : "Failed to create organization")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const progress = (step / 3) * 100

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Create New Organization</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           <div className="space-y-2">
//             <div className="flex justify-between text-sm text-muted-foreground">
//               <span>Step {step} of 3</span>
//               <span>{Math.round(progress)}% complete</span>
//             </div>
//             <Progress value={progress} className="h-2" />
//           </div>

//           {step === 1 && (
//             <div className="space-y-4">
//               <div className="text-center space-y-2">
//                 <h3 className="text-lg font-semibold">Basic Information</h3>
//                 <p className="text-sm text-muted-foreground">Let's start with the basics about your organization</p>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Organization Name *</Label>
//                   <Input
//                     id="name"
//                     value={formData.name}
//                     onChange={(e) => handleNameChange(e.target.value)}
//                     placeholder="Acme Inc."
//                     maxLength={100}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="slug">URL Slug *</Label>
//                   <div className="relative">
//                     <Input
//                       id="slug"
//                       value={formData.slug}
//                       onChange={(e) => handleSlugChange(e.target.value)}
//                       placeholder="acme-inc"
//                       maxLength={50}
//                       className={
//                         slugAvailable === false ? "border-red-500" : slugAvailable === true ? "border-green-500" : ""
//                       }
//                     />
//                     <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                       {checkingSlug && <Loader2 className="h-4 w-4 animate-spin" />}
//                       {!checkingSlug && slugAvailable === true && <CheckCircle className="h-4 w-4 text-green-500" />}
//                       {!checkingSlug && slugAvailable === false && <AlertCircle className="h-4 w-4 text-red-500" />}
//                     </div>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     This will be your organization's URL: configcraft.com/{formData.slug}
//                   </p>
//                   {slugAvailable === false && <p className="text-xs text-red-500">This slug is already taken</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea
//                     id="description"
//                     value={formData.description}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                     placeholder="Brief description of your organization..."
//                     maxLength={500}
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <Button onClick={() => setStep(2)} disabled={!canProceedToStep2}>
//                   Continue
//                 </Button>
//               </div>
//             </div>
//           )}

//           {step === 2 && (
//             <div className="space-y-4">
//               <div className="text-center space-y-2">
//                 <h3 className="text-lg font-semibold">Organization Details</h3>
//                 <p className="text-sm text-muted-foreground">Help us understand your organization better</p>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="industry">Industry *</Label>
//                   <Select
//                     value={formData.industry}
//                     onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select your industry" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {INDUSTRIES.map((industry) => (
//                         <SelectItem key={industry} value={industry}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="companySize">Company Size *</Label>
//                   <Select
//                     value={formData.companySize}
//                     onValueChange={(value) => setFormData((prev) => ({ ...prev, companySize: value }))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select company size" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {COMPANY_SIZES.map((size) => (
//                         <SelectItem key={size} value={size}>
//                           {size}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="website">Website</Label>
//                   <Input
//                     id="website"
//                     type="url"
//                     value={formData.website}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
//                     placeholder="https://example.com"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setStep(1)}>
//                   Back
//                 </Button>
//                 <Button onClick={() => setStep(3)} disabled={!canProceedToStep3}>
//                   Continue
//                 </Button>
//               </div>
//             </div>
//           )}

//           {step === 3 && (
//             <div className="space-y-4">
//               <div className="text-center space-y-2">
//                 <h3 className="text-lg font-semibold">Review & Create</h3>
//                 <p className="text-sm text-muted-foreground">Review your organization details before creating</p>
//               </div>

//               <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
//                 <div>
//                   <Label className="text-sm font-medium">Organization Name</Label>
//                   <p className="text-sm">{formData.name}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">URL</Label>
//                   <p className="text-sm">configcraft.com/{formData.slug}</p>
//                 </div>
//                 {formData.description && (
//                   <div>
//                     <Label className="text-sm font-medium">Description</Label>
//                     <p className="text-sm">{formData.description}</p>
//                   </div>
//                 )}
//                 <div>
//                   <Label className="text-sm font-medium">Industry</Label>
//                   <p className="text-sm">{formData.industry}</p>
//                 </div>
//                 <div>
//                   <Label className="text-sm font-medium">Company Size</Label>
//                   <p className="text-sm">{formData.companySize}</p>
//                 </div>
//                 {formData.website && (
//                   <div>
//                     <Label className="text-sm font-medium">Website</Label>
//                     <p className="text-sm">{formData.website}</p>
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-between">
//                 <Button variant="outline" onClick={() => setStep(2)}>
//                   Back
//                 </Button>
//                 <Button onClick={handleSubmit} disabled={isLoading}>
//                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Create Organization
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Building2, ArrowRight, ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreateOrganizationModalProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: (organization: any) => void
}

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
  "Non-profit",
  "Government",
  "Other",
]

const companySizes = [
  { value: "SMALL", label: "1-10 employees" },
  { value: "MEDIUM", label: "11-50 employees" },
  { value: "LARGE", label: "51-200 employees" },
  { value: "ENTERPRISE", label: "200+ employees" },
]

export function CreateOrganizationModal({ children, open, onOpenChange, onSuccess }: CreateOrganizationModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [slugChecking, setSlugChecking] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    industry: "",
    size: "SMALL",
    website: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const router = useRouter()

  const isControlled = open !== undefined && onOpenChange !== undefined
  const modalOpen = isControlled ? open : isOpen
  const setModalOpen = isControlled ? onOpenChange : setIsOpen

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50)
  }

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    setSlugChecking(true)
    try {
      const response = await fetch(`/api/organizations/check-slug?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      setSlugAvailable(data.available)
    } catch (error) {
      console.error("Error checking slug:", error)
      setSlugAvailable(null)
    } finally {
      setSlugChecking(false)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, name }))
    if (name && !formData.slug) {
      const newSlug = generateSlug(name)
      setFormData((prev) => ({ ...prev, slug: newSlug }))
      checkSlugAvailability(newSlug)
    }
  }

  const handleSlugChange = (slug: string) => {
    const cleanSlug = generateSlug(slug)
    setFormData((prev) => ({ ...prev, slug: cleanSlug }))
    checkSlugAvailability(cleanSlug)
  }

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Organization name is required"
      }
      if (!formData.slug.trim()) {
        newErrors.slug = "Organization URL is required"
      } else if (formData.slug.length < 3) {
        newErrors.slug = "URL must be at least 3 characters"
      } else if (slugAvailable === false) {
        newErrors.slug = "This URL is already taken"
      }
    }

    if (step === 2) {
      if (!formData.industry) {
        newErrors.industry = "Please select an industry"
      }
      if (!formData.size) {
        newErrors.size = "Please select organization size"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(2)) return

    setLoading(true)
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create organization")
      }

      const organization = await response.json()

      toast({
        title: "Organization created",
        description: `${organization.name} has been created successfully.`,
      })

      // Reset form
      setFormData({
        name: "",
        slug: "",
        description: "",
        industry: "",
        size: "SMALL",
        website: "",
      })
      setCurrentStep(1)
      setErrors({})
      setSlugAvailable(null)

      // Close modal
      setModalOpen?.(false)

      // Call success callback
      onSuccess?.(organization)

      // Redirect to new organization
      router.push(`/${organization.slug}/dashboard`)
    } catch (error) {
      console.error("Error creating organization:", error)
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / 3) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                placeholder="Enter your organization name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Organization URL *</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">configcraft.com/</span>
                <div className="flex-1 relative">
                  <Input
                    id="slug"
                    placeholder="your-organization"
                    value={formData.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className={errors.slug ? "border-destructive" : slugAvailable === true ? "border-green-500" : ""}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {slugChecking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {!slugChecking && slugAvailable === true && <Check className="h-4 w-4 text-green-500" />}
                    {!slugChecking && slugAvailable === false && <AlertCircle className="h-4 w-4 text-destructive" />}
                  </div>
                </div>
              </div>
              {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
              {!errors.slug && slugAvailable === true && (
                <p className="text-sm text-green-600">✓ This URL is available</p>
              )}
              {!errors.slug && slugAvailable === false && (
                <p className="text-sm text-destructive">✗ This URL is already taken</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your organization"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
              >
                <SelectTrigger className={errors.industry ? "border-destructive" : ""}>
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
              {errors.industry && <p className="text-sm text-destructive">{errors.industry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Organization Size *</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, size: value }))}
              >
                <SelectTrigger className={errors.size ? "border-destructive" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.size && <p className="text-sm text-destructive">{errors.size}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Review Your Organization</h3>
              <p className="text-muted-foreground">Please review the details before creating your organization.</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Name:</span>
                <span>{formData.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">URL:</span>
                <span className="text-sm">configcraft.com/{formData.slug}</span>
              </div>
              {formData.description && (
                <div className="flex justify-between items-start py-2 border-b">
                  <span className="font-medium">Description:</span>
                  <span className="text-right max-w-xs">{formData.description}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Industry:</span>
                <Badge variant="secondary">{formData.industry}</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="font-medium">Size:</span>
                <Badge variant="outline">{companySizes.find((s) => s.value === formData.size)?.label}</Badge>
              </div>
              {formData.website && (
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">Website:</span>
                  <span className="text-sm">{formData.website}</span>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const content = (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="flex items-center space-x-2">
          <Building2 className="w-5 h-5" />
          <span>Create Organization</span>
        </DialogTitle>
        <DialogDescription>
          Step {currentStep} of 3: {currentStep === 1 ? "Basic Information" : currentStep === 2 ? "Details" : "Review"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {renderStep()}
      </div>

      <DialogFooter className="flex justify-between">
        <div className="flex space-x-2">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handlePrevious} disabled={loading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          {currentStep < 3 ? (
            <Button
              onClick={handleNext}
              disabled={loading || (currentStep === 1 && (slugChecking || slugAvailable === false))}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Organization
                </>
              )}
            </Button>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  )

  if (children) {
    return (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        {content}
      </Dialog>
    )
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      {content}
    </Dialog>
  )
}
