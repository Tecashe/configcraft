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

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X, Building2, Users, Globe, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  description: z.string().optional(),
  industry: z.string().optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]).default("SMALL"),
  website: z.string().url().optional().or(z.literal("")),
})

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>

interface CreateOrganizationModalProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSuccess?: (organization: any) => void
}

const steps = [
  {
    id: "basic",
    title: "Basic Information",
    description: "Tell us about your organization",
    icon: Building2,
  },
  {
    id: "details",
    title: "Organization Details",
    description: "Additional information about your organization",
    icon: Briefcase,
  },
  {
    id: "review",
    title: "Review & Create",
    description: "Review your information and create the organization",
    icon: Check,
  },
]

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Consulting",
  "Non-profit",
  "Government",
  "Other",
]

const sizeOptions = [
  { value: "SMALL", label: "Small (1-10 people)", description: "Perfect for startups and small teams" },
  { value: "MEDIUM", label: "Medium (11-50 people)", description: "Growing companies and departments" },
  { value: "LARGE", label: "Large (51-200 people)", description: "Established companies" },
  { value: "ENTERPRISE", label: "Enterprise (200+ people)", description: "Large organizations" },
]

export function CreateOrganizationModal({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onSuccess,
}: CreateOrganizationModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [generatedSlug, setGeneratedSlug] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const open = controlledOpen ?? isOpen
  const onOpenChange = controlledOnOpenChange ?? setIsOpen

  const form = useForm<CreateOrganizationForm>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      name: "",
      description: "",
      industry: "",
      size: "SMALL",
      website: "",
    },
  })

  const watchedName = form.watch("name")

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50)
  }

  // Check slug availability
  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return

    setSlugStatus("checking")
    try {
      const response = await fetch(`/api/organizations/check-slug?slug=${encodeURIComponent(slug)}`)
      const data = await response.json()
      setSlugStatus(data.available ? "available" : "taken")
    } catch (error) {
      console.error("Error checking slug:", error)
      setSlugStatus("idle")
    }
  }

  // Update slug when name changes
  React.useEffect(() => {
    if (watchedName) {
      const slug = generateSlug(watchedName)
      setGeneratedSlug(slug)
      checkSlugAvailability(slug)
    } else {
      setGeneratedSlug("")
      setSlugStatus("idle")
    }
  }, [watchedName])

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: CreateOrganizationForm) => {
    if (slugStatus !== "available") {
      toast({
        title: "Invalid organization name",
        description: "Please choose a different organization name.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          slug: generatedSlug,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create organization")
      }

      const result = await response.json()

      toast({
        title: "Organization created!",
        description: `${data.name} has been created successfully.`,
      })

      // Reset form and close modal
      form.reset()
      setCurrentStep(0)
      onOpenChange(false)
      onSuccess?.(result.organization)

      // Redirect to the new organization
      router.push(`/${generatedSlug}/dashboard`)
    } catch (error) {
      console.error("Error creating organization:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create organization",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormDescription>This will be the display name for your organization.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {generatedSlug && (
              <div className="space-y-2">
                <FormLabel>Organization URL</FormLabel>
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-md">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">configcraft.com/</span>
                  <span className="font-medium">{generatedSlug}</span>
                  {slugStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {slugStatus === "available" && (
                    <Badge variant="secondary" className="text-green-600">
                      <Check className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  )}
                  {slugStatus === "taken" && (
                    <Badge variant="destructive">
                      <X className="h-3 w-3 mr-1" />
                      Taken
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  This URL will be automatically generated from your organization name.
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about your organization..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>A brief description of your organization (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>This helps us provide relevant features and templates.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Size *</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 gap-3">
                      {sizeOptions.map((option) => (
                        <div
                          key={option.value}
                          className={cn(
                            "flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors",
                            field.value === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/50",
                          )}
                          onClick={() => field.onChange(option.value)}
                        >
                          <div className="flex items-center space-x-2 flex-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{option.label}</p>
                              <p className="text-xs text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                              field.value === option.value ? "border-primary bg-primary" : "border-muted-foreground",
                            )}
                          >
                            {field.value === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>Your organization's website (optional).</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 2:
        const formData = form.getValues()
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Your Organization</h3>
              <p className="text-sm text-muted-foreground">
                Please review the information below before creating your organization.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{formData.name}</p>
                  <p className="text-sm text-muted-foreground">configcraft.com/{generatedSlug}</p>
                </div>
                <Badge variant="secondary" className="text-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              </div>

              {formData.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{formData.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {formData.industry && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Industry</p>
                    <p className="text-sm">{formData.industry}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Size</p>
                  <p className="text-sm">{sizeOptions.find((opt) => opt.value === formData.size)?.label}</p>
                </div>
              </div>

              {formData.website && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <p className="text-sm">{formData.website}</p>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Organization</DialogTitle>
          <DialogDescription>Set up a new organization to collaborate with your team.</DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                  index <= currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground text-muted-foreground",
                )}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn("w-16 h-0.5 mx-2 transition-colors", index < currentStep ? "bg-primary" : "bg-muted")}
                />
              )}
            </div>
          ))}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="min-h-[300px]">
              <div className="mb-4">
                <h3 className="font-semibold">{steps[currentStep].title}</h3>
                <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
              </div>
              {renderStepContent()}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={
                      (currentStep === 0 && (!watchedName || slugStatus !== "available")) ||
                      (currentStep === 1 && !form.getValues("size"))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isCreating || slugStatus !== "available"}>
                    {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Create Organization
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
