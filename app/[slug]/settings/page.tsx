// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Building2, Users, Shield, Key, Trash2, Plus, Settings, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// export default function SettingsPage() {
//   const [loading, setLoading] = useState(true)
//   const [organization, setOrganization] = useState<any>(null)
//   const [teamMembers, setTeamMembers] = useState<any[]>([])
//   const [apiKeys, setApiKeys] = useState<any[]>([])
//   const { toast } = useToast()
//   const params = useParams()
//   const orgSlug = params?.slug as string

//   useEffect(() => {
//     if (orgSlug) {
//       fetchSettings()
//     }
//   }, [orgSlug])

//   const fetchSettings = async () => {
//     try {
//       const [orgResponse, membersResponse, keysResponse] = await Promise.all([
//         fetch(`/api/organizations/${orgSlug}`),
//         fetch(`/api/organizations/${orgSlug}/members`),
//         fetch(`/api/organizations/${orgSlug}/api-keys`),
//       ])

//       if (orgResponse.ok) {
//         const orgData = await orgResponse.json()
//         setOrganization(orgData)
//       }

//       if (membersResponse.ok) {
//         const membersData = await membersResponse.json()
//         setTeamMembers(membersData)
//       }

//       if (keysResponse.ok) {
//         const keysData = await keysResponse.json()
//         setApiKeys(keysData)
//       }
//     } catch (error) {
//       console.error("Failed to fetch settings:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load settings",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-4 lg:p-6">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="mb-8">
//         <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-foreground">Settings</h1>
//         <p className="text-muted-foreground">Manage your organization settings, team, and security preferences</p>
//       </div>

//       <Tabs defaultValue="organization" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="organization" className="flex items-center gap-2">
//             <Building2 className="h-4 w-4" />
//             Organization
//           </TabsTrigger>
//           <TabsTrigger value="team" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Team
//           </TabsTrigger>
//           <TabsTrigger value="security" className="flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Security
//           </TabsTrigger>
//           <TabsTrigger value="api" className="flex items-center gap-2">
//             <Key className="h-4 w-4" />
//             API Keys
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="organization" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">Organization Information</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Update your organization details and branding
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="org-name" className="text-foreground">
//                     Organization Name
//                   </Label>
//                   <Input id="org-name" defaultValue={organization?.name || ""} />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="org-slug" className="text-foreground">
//                     Organization Slug
//                   </Label>
//                   <Input id="org-slug" defaultValue={organization?.slug || ""} />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="org-description" className="text-foreground">
//                   Organization Description
//                 </Label>
//                 <Textarea
//                   id="org-description"
//                   placeholder="Brief description of your organization..."
//                   defaultValue={organization?.description || ""}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-foreground">Organization Logo</Label>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="w-16 h-16">
//                     <AvatarImage src={organization?.logoUrl || "/placeholder.svg"} />
//                     <AvatarFallback className="text-xl">
//                       {organization?.name?.substring(0, 2).toUpperCase() || "ORG"}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="space-y-2">
//                     <Button variant="outline">Upload New Logo</Button>
//                     <p className="text-sm text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium text-foreground">Custom Branding</h3>
//                   <p className="text-sm text-muted-foreground">Apply your brand colors to generated tools</p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>

//               <Button className="config-button-primary">Save Changes</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="team" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between text-foreground">
//                 Team Members
//                 <Button className="config-button-primary">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Invite Member
//                 </Button>
//               </CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Manage your team members and their permissions
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {teamMembers.map((member) => (
//                   <div
//                     key={member.id}
//                     className="flex items-center justify-between p-4 border border-border rounded-lg"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Avatar>
//                         <AvatarImage src={member.user?.imageUrl || "/placeholder.svg"} />
//                         <AvatarFallback>
//                           {member.user?.firstName?.charAt(0)}
//                           {member.user?.lastName?.charAt(0)}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium text-foreground">
//                           {member.user?.firstName} {member.user?.lastName}
//                         </p>
//                         <p className="text-sm text-muted-foreground">{member.user?.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Badge variant="outline">{member.role}</Badge>
//                       <Button variant="ghost" size="sm">
//                         <Settings className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">Authentication & Security</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Configure security settings for your organization
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
//                   <p className="text-sm text-muted-foreground">Require 2FA for all team members</p>
//                 </div>
//                 <Switch />
//               </div>

//               <Separator />

//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h4 className="font-medium text-foreground">Single Sign-On (SSO)</h4>
//                   <p className="text-sm text-muted-foreground">Enable SSO with your identity provider</p>
//                 </div>
//                 <Button variant="outline">Configure SSO</Button>
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <h4 className="font-medium text-foreground">Session Management</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="session-timeout" className="text-foreground">
//                       Session Timeout (minutes)
//                     </Label>
//                     <Input id="session-timeout" type="number" defaultValue="480" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="max-sessions" className="text-foreground">
//                       Max Concurrent Sessions
//                     </Label>
//                     <Input id="max-sessions" type="number" defaultValue="3" />
//                   </div>
//                 </div>
//               </div>

//               <Button className="config-button-primary">Save Security Settings</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="api" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between text-foreground">
//                 API Keys
//                 <Button className="config-button-primary">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create API Key
//                 </Button>
//               </CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Manage API keys for integrating with ConfigCraft
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {apiKeys.map((apiKey) => (
//                   <div
//                     key={apiKey.id}
//                     className="flex items-center justify-between p-4 border border-border rounded-lg"
//                   >
//                     <div className="space-y-1">
//                       <p className="font-medium text-foreground">{apiKey.name}</p>
//                       <p className="text-sm font-mono text-muted-foreground">{apiKey.key}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Created {apiKey.created} • Last used {apiKey.lastUsed}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Button variant="outline" size="sm">
//                         Copy
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">API Usage</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Monitor your API usage and rate limits
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-foreground">1,247</div>
//                   <p className="text-sm text-muted-foreground">Requests this month</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-foreground">10,000</div>
//                   <p className="text-sm text-muted-foreground">Monthly limit</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-foreground">87%</div>
//                   <p className="text-sm text-muted-foreground">Remaining</p>
//                 </div>
//               </div>
//               <div className="w-full bg-muted rounded-full h-2 mt-4">
//                 <div className="bg-primary h-2 rounded-full" style={{ width: "13%" }}></div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Building2, Users, Shield, Key, Trash2, Plus, Loader2, Save, Upload, UserPlus, Copy, Check } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { generateSlug } from "@/lib/organization"

// interface OrganizationData {
//   id: string
//   name: string
//   slug: string
//   description?: string
//   logoUrl?: string
//   website?: string
//   industry?: string
//   size: string
//   customBranding: boolean
//   brandColors?: any
// }

// interface TeamMember {
//   id: string
//   role: string
//   status: string
//   joinedAt: string
//   user: {
//     id: string
//     firstName?: string
//     lastName?: string
//     email: string
//     imageUrl?: string
//   }
// }

// interface ApiKey {
//   id: string
//   name: string
//   key: string
//   createdAt: string
//   lastUsed?: string
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
//   { value: "SMALL", label: "1-10 employees" },
//   { value: "MEDIUM", label: "11-50 employees" },
//   { value: "LARGE", label: "51-200 employees" },
//   { value: "ENTERPRISE", label: "200+ employees" },
// ]

// export default function SettingsPage() {
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [organization, setOrganization] = useState<OrganizationData | null>(null)
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
//   const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
//   const [inviteEmail, setInviteEmail] = useState("")
//   const [inviteRole, setInviteRole] = useState("MEMBER")
//   const [inviting, setInviting] = useState(false)
//   const [copiedKey, setCopiedKey] = useState<string | null>(null)
//   const { toast } = useToast()
//   const params = useParams()
//   const router = useRouter()
//   const orgSlug = params?.slug as string

//   useEffect(() => {
//     if (orgSlug) {
//       fetchSettings()
//     }
//   }, [orgSlug])

//   const fetchSettings = async () => {
//     try {
//       const [orgResponse, membersResponse, keysResponse] = await Promise.all([
//         fetch(`/api/organizations/${orgSlug}`),
//         fetch(`/api/organizations/${orgSlug}/members`),
//         fetch(`/api/organizations/${orgSlug}/api-keys`),
//       ])

//       if (orgResponse.ok) {
//         const orgData = await orgResponse.json()
//         setOrganization(orgData)
//       }

//       if (membersResponse.ok) {
//         const membersData = await membersResponse.json()
//         setTeamMembers(membersData)
//       }

//       if (keysResponse.ok) {
//         const keysData = await keysResponse.json()
//         setApiKeys(keysData)
//       }
//     } catch (error) {
//       console.error("Failed to fetch settings:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load settings",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSaveOrganization = async () => {
//     if (!organization) return

//     setSaving(true)
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: organization.name,
//           description: organization.description,
//           website: organization.website,
//           industry: organization.industry,
//           size: organization.size,
//           customBranding: organization.customBranding,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update organization")
//       }

//       const updatedOrg = await response.json()
//       setOrganization(updatedOrg)

//       toast({
//         title: "Settings saved",
//         description: "Organization settings have been updated successfully.",
//       })

//       // If slug changed, redirect
//       if (updatedOrg.slug !== orgSlug) {
//         router.push(`/${updatedOrg.slug}/settings`)
//       }
//     } catch (error) {
//       console.error("Failed to save organization:", error)
//       toast({
//         title: "Save failed",
//         description: "Failed to save organization settings. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleInviteMember = async () => {
//     if (!inviteEmail.trim()) {
//       toast({
//         title: "Email required",
//         description: "Please enter an email address to invite.",
//         variant: "destructive",
//       })
//       return
//     }

//     setInviting(true)
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/invitations`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: inviteEmail.trim(),
//           role: inviteRole,
//         }),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to send invitation")
//       }

//       toast({
//         title: "Invitation sent",
//         description: `Invitation has been sent to ${inviteEmail}`,
//       })

//       setInviteEmail("")
//       setInviteRole("MEMBER")
//     } catch (error) {
//       console.error("Failed to invite member:", error)
//       toast({
//         title: "Invitation failed",
//         description: error instanceof Error ? error.message : "Failed to send invitation",
//         variant: "destructive",
//       })
//     } finally {
//       setInviting(false)
//     }
//   }

//   const handleRemoveMember = async (memberId: string) => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/members/${memberId}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to remove member")
//       }

//       setTeamMembers((prev) => prev.filter((member) => member.id !== memberId))

//       toast({
//         title: "Member removed",
//         description: "Team member has been removed from the organization.",
//       })
//     } catch (error) {
//       console.error("Failed to remove member:", error)
//       toast({
//         title: "Remove failed",
//         description: "Failed to remove team member. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateApiKey = async () => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/api-keys`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: `API Key ${apiKeys.length + 1}`,
//         }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create API key")
//       }

//       const newKey = await response.json()
//       setApiKeys((prev) => [...prev, newKey])

//       toast({
//         title: "API key created",
//         description: "New API key has been generated successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to create API key:", error)
//       toast({
//         title: "Creation failed",
//         description: "Failed to create API key. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleDeleteApiKey = async (keyId: string) => {
//     try {
//       const response = await fetch(`/api/organizations/${orgSlug}/api-keys/${keyId}`, {
//         method: "DELETE",
//       })

//       if (!response.ok) {
//         throw new Error("Failed to delete API key")
//       }

//       setApiKeys((prev) => prev.filter((key) => key.id !== keyId))

//       toast({
//         title: "API key deleted",
//         description: "API key has been deleted successfully.",
//       })
//     } catch (error) {
//       console.error("Failed to delete API key:", error)
//       toast({
//         title: "Delete failed",
//         description: "Failed to delete API key. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   const copyToClipboard = async (text: string, keyId: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       setCopiedKey(keyId)
//       setTimeout(() => setCopiedKey(null), 2000)
//       toast({
//         title: "Copied",
//         description: "API key copied to clipboard",
//       })
//     } catch (error) {
//       toast({
//         title: "Copy failed",
//         description: "Failed to copy API key to clipboard",
//         variant: "destructive",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="p-4 lg:p-6">
//         <div className="flex items-center justify-center h-64">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />
//         </div>
//       </div>
//     )
//   }

//   if (!organization) {
//     return (
//       <div className="p-4 lg:p-6">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4 text-foreground">Organization Not Found</h1>
//           <p className="text-muted-foreground mb-4">
//             The organization you're looking for doesn't exist or you don't have access to it.
//           </p>
//           <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 lg:p-6 space-y-6">
//       <div className="mb-8">
//         <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-foreground">Settings</h1>
//         <p className="text-muted-foreground">Manage your organization settings, team, and security preferences</p>
//       </div>

//       <Tabs defaultValue="organization" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="organization" className="flex items-center gap-2">
//             <Building2 className="h-4 w-4" />
//             Organization
//           </TabsTrigger>
//           <TabsTrigger value="team" className="flex items-center gap-2">
//             <Users className="h-4 w-4" />
//             Team
//           </TabsTrigger>
//           <TabsTrigger value="security" className="flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Security
//           </TabsTrigger>
//           <TabsTrigger value="api" className="flex items-center gap-2">
//             <Key className="h-4 w-4" />
//             API Keys
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="organization" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">Organization Information</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Update your organization details and branding
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="org-name" className="text-foreground">
//                     Organization Name
//                   </Label>
//                   <Input
//                     id="org-name"
//                     value={organization.name}
//                     onChange={(e) => setOrganization((prev) => (prev ? { ...prev, name: e.target.value } : null))}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="org-slug" className="text-foreground">
//                     Organization URL
//                   </Label>
//                   <div className="flex items-center space-x-2">
//                     <span className="text-sm text-muted-foreground">configcraft.com/</span>
//                     <Input
//                       id="org-slug"
//                       value={organization.slug}
//                       onChange={(e) =>
//                         setOrganization((prev) => (prev ? { ...prev, slug: generateSlug(e.target.value) } : null))
//                       }
//                       className="flex-1"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="org-description" className="text-foreground">
//                   Description
//                 </Label>
//                 <Textarea
//                   id="org-description"
//                   placeholder="Brief description of your organization..."
//                   value={organization.description || ""}
//                   onChange={(e) => setOrganization((prev) => (prev ? { ...prev, description: e.target.value } : null))}
//                   rows={3}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="industry" className="text-foreground">
//                     Industry
//                   </Label>
//                   <Select
//                     value={organization.industry || ""}
//                     onValueChange={(value) => setOrganization((prev) => (prev ? { ...prev, industry: value } : null))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select industry" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {industries.map((industry) => (
//                         <SelectItem key={industry} value={industry}>
//                           {industry}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="size" className="text-foreground">
//                     Organization Size
//                   </Label>
//                   <Select
//                     value={organization.size}
//                     onValueChange={(value) => setOrganization((prev) => (prev ? { ...prev, size: value } : null))}
//                   >
//                     <SelectTrigger>
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {companySizes.map((size) => (
//                         <SelectItem key={size.value} value={size.value}>
//                           {size.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="website" className="text-foreground">
//                   Website
//                 </Label>
//                 <Input
//                   id="website"
//                   type="url"
//                   placeholder="https://yourcompany.com"
//                   value={organization.website || ""}
//                   onChange={(e) => setOrganization((prev) => (prev ? { ...prev, website: e.target.value } : null))}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label className="text-foreground">Organization Logo</Label>
//                 <div className="flex items-center gap-4">
//                   <Avatar className="w-16 h-16">
//                     <AvatarImage src={organization.logoUrl || "/placeholder.svg"} />
//                     <AvatarFallback className="text-xl">
//                       {organization.name.substring(0, 2).toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="space-y-2">
//                     <Button variant="outline" size="sm">
//                       <Upload className="h-4 w-4 mr-2" />
//                       Upload Logo
//                     </Button>
//                     <p className="text-sm text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               <div className="flex justify-between items-center">
//                 <div>
//                   <h3 className="font-medium text-foreground">Custom Branding</h3>
//                   <p className="text-sm text-muted-foreground">Apply your brand colors to generated tools</p>
//                 </div>
//                 <Switch
//                   checked={organization.customBranding}
//                   onCheckedChange={(checked) =>
//                     setOrganization((prev) => (prev ? { ...prev, customBranding: checked } : null))
//                   }
//                 />
//               </div>

//               <Button onClick={handleSaveOrganization} disabled={saving} className="config-button-primary">
//                 {saving ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save className="h-4 w-4 mr-2" />
//                     Save Changes
//                   </>
//                 )}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="team" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">Invite Team Member</CardTitle>
//               <CardDescription className="text-muted-foreground">Add new members to your organization</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1">
//                   <Input
//                     placeholder="Enter email address"
//                     type="email"
//                     value={inviteEmail}
//                     onChange={(e) => setInviteEmail(e.target.value)}
//                   />
//                 </div>
//                 <Select value={inviteRole} onValueChange={setInviteRole}>
//                   <SelectTrigger className="w-full sm:w-32">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="ADMIN">Admin</SelectItem>
//                     <SelectItem value="MEMBER">Member</SelectItem>
//                     <SelectItem value="VIEWER">Viewer</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Button onClick={handleInviteMember} disabled={inviting} className="config-button-primary">
//                   {inviting ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <>
//                       <UserPlus className="h-4 w-4 mr-2" />
//                       Invite
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">Team Members</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Manage your team members and their permissions
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {teamMembers.map((member) => (
//                   <div
//                     key={member.id}
//                     className="flex items-center justify-between p-4 border border-border rounded-lg"
//                   >
//                     <div className="flex items-center gap-3">
//                       <Avatar>
//                         <AvatarImage src={member.user.imageUrl || "/placeholder.svg"} />
//                         <AvatarFallback>
//                           {member.user.firstName?.charAt(0) || ""}
//                           {member.user.lastName?.charAt(0) || ""}
//                         </AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <p className="font-medium text-foreground">
//                           {member.user.firstName} {member.user.lastName}
//                         </p>
//                         <p className="text-sm text-muted-foreground">{member.user.email}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>{member.status}</Badge>
//                       <Badge variant="outline">{member.role}</Badge>
//                       {member.role !== "OWNER" && (
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="ghost" size="sm">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to remove {member.user.firstName} {member.user.lastName} from this
//                                 organization? This action cannot be undone.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleRemoveMember(member.id)}
//                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               >
//                                 Remove Member
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">Authentication & Security</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Configure security settings for your organization
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
//                   <p className="text-sm text-muted-foreground">Require 2FA for all team members</p>
//                 </div>
//                 <Switch />
//               </div>

//               <Separator />

//               <div className="flex items-center justify-between">
//                 <div className="space-y-1">
//                   <h4 className="font-medium text-foreground">Single Sign-On (SSO)</h4>
//                   <p className="text-sm text-muted-foreground">Enable SSO with your identity provider</p>
//                 </div>
//                 <Button variant="outline">Configure SSO</Button>
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <h4 className="font-medium text-foreground">Session Management</h4>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="session-timeout" className="text-foreground">
//                       Session Timeout (minutes)
//                     </Label>
//                     <Input id="session-timeout" type="number" defaultValue="480" />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="max-sessions" className="text-foreground">
//                       Max Concurrent Sessions
//                     </Label>
//                     <Input id="max-sessions" type="number" defaultValue="3" />
//                   </div>
//                 </div>
//               </div>

//               <Button className="config-button-primary">Save Security Settings</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="api" className="space-y-6">
//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between text-foreground">
//                 API Keys
//                 <Button onClick={handleCreateApiKey} className="config-button-primary">
//                   <Plus className="h-4 w-4 mr-2" />
//                   Create API Key
//                 </Button>
//               </CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Manage API keys for integrating with ConfigCraft
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 {apiKeys.length === 0 ? (
//                   <div className="text-center py-8">
//                     <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h3 className="text-lg font-medium text-foreground mb-2">No API Keys</h3>
//                     <p className="text-muted-foreground mb-4">
//                       Create your first API key to start integrating with ConfigCraft
//                     </p>
//                     <Button onClick={handleCreateApiKey} className="config-button-primary">
//                       <Plus className="h-4 w-4 mr-2" />
//                       Create API Key
//                     </Button>
//                   </div>
//                 ) : (
//                   apiKeys.map((apiKey) => (
//                     <div
//                       key={apiKey.id}
//                       className="flex items-center justify-between p-4 border border-border rounded-lg"
//                     >
//                       <div className="space-y-1 flex-1">
//                         <p className="font-medium text-foreground">{apiKey.name}</p>
//                         <p className="text-sm font-mono text-muted-foreground">{apiKey.key}</p>
//                         <p className="text-xs text-muted-foreground">
//                           Created {new Date(apiKey.createdAt).toLocaleDateString()}
//                           {apiKey.lastUsed && ` • Last used ${apiKey.lastUsed}`}
//                         </p>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key, apiKey.id)}>
//                           {copiedKey === apiKey.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                         </Button>
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button variant="ghost" size="sm">
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>Delete API Key</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 Are you sure you want to delete this API key? This action cannot be undone and will
//                                 break any integrations using this key.
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>Cancel</AlertDialogCancel>
//                               <AlertDialogAction
//                                 onClick={() => handleDeleteApiKey(apiKey.id)}
//                                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                               >
//                                 Delete Key
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="config-card">
//             <CardHeader>
//               <CardTitle className="text-foreground">API Usage</CardTitle>
//               <CardDescription className="text-muted-foreground">
//                 Monitor your API usage and rate limits
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-foreground">1,247</div>
//                   <p className="text-sm text-muted-foreground">Requests this month</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-foreground">10,000</div>
//                   <p className="text-sm text-muted-foreground">Monthly limit</p>
//                 </div>
//                 <div className="text-center">
//                   <div className="text-2xl font-bold text-foreground">87%</div>
//                   <p className="text-sm text-muted-foreground">Remaining</p>
//                 </div>
//               </div>
//               <div className="w-full bg-muted rounded-full h-2 mt-4">
//                 <div className="bg-primary h-2 rounded-full" style={{ width: "13%" }}></div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Settings, Users, Key, Trash2, Plus, Copy, Eye, Mail, Crown, Shield, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]),
})

const inviteSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
})

type OrganizationForm = z.infer<typeof organizationSchema>
type InviteForm = z.infer<typeof inviteSchema>

interface Organization {
  id: string
  name: string
  slug: string
  description?: string | null
  website?: string | null
  industry?: string | null
  size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE"
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
  memberCount: number
  toolCount: number
}

interface Member {
  id: string
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
  status: string
  joinedAt: string
  user: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    imageUrl?: string | null
  }
}

interface Invitation {
  id: string
  email: string
  role: "ADMIN" | "MEMBER" | "VIEWER"
  status: string
  createdAt: string
  expiresAt: string
}

interface ApiKey {
  id: string
  name: string
  keyPreview: string
  createdAt: string
  lastUsed?: string | null
}

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
  { value: "SMALL", label: "Small (1-10 people)" },
  { value: "MEDIUM", label: "Medium (11-50 people)" },
  { value: "LARGE", label: "Large (51-200 people)" },
  { value: "ENTERPRISE", label: "Enterprise (200+ people)" },
]

const roleOptions = [
  { value: "ADMIN", label: "Admin", description: "Can manage organization and members" },
  { value: "MEMBER", label: "Member", description: "Can create and manage tools" },
  { value: "VIEWER", label: "Viewer", description: "Can view tools and data" },
]

function getRoleIcon(role: string) {
  switch (role) {
    case "OWNER":
      return <Crown className="h-4 w-4 text-yellow-500" />
    case "ADMIN":
      return <Shield className="h-4 w-4 text-blue-500" />
    case "MEMBER":
      return <Users className="h-4 w-4 text-green-500" />
    case "VIEWER":
      return <Eye className="h-4 w-4 text-gray-500" />
    default:
      return null
  }
}

export default function SettingsPage() {
  const params = useParams()
  const { user } = useUser()
  const { toast } = useToast()
  const orgSlug = params?.slug as string

  const [organization, setOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [creatingApiKey, setCreatingApiKey] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [newApiKey, setNewApiKey] = useState<string | null>(null)

  const form = useForm<OrganizationForm>({
    resolver: zodResolver(organizationSchema),
  })

  const inviteForm = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: "MEMBER",
    },
  })

  useEffect(() => {
    if (orgSlug) {
      fetchOrganizationData()
    }
  }, [orgSlug])

  const fetchOrganizationData = async () => {
    try {
      setLoading(true)

      // Fetch organization details
      const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData)
        form.reset({
          name: orgData.name,
          description: orgData.description || "",
          website: orgData.website || "",
          industry: orgData.industry || "",
          size: orgData.size,
        })
      } else {
        console.error("Failed to fetch organization:", orgResponse.status)
      }

      // Fetch members
      const membersResponse = await fetch(`/api/organizations/${orgSlug}/members`)
      if (membersResponse.ok) {
        const membersData = await membersResponse.json()
        setMembers(membersData.members || [])
      }

      // Fetch invitations
      const invitationsResponse = await fetch(`/api/organizations/${orgSlug}/invitations`)
      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json()
        setInvitations(invitationsData.invitations || [])
      }

      // Fetch API keys
      const apiKeysResponse = await fetch(`/api/organizations/${orgSlug}/api-keys`)
      if (apiKeysResponse.ok) {
        const apiKeysData = await apiKeysResponse.json()
        setApiKeys(apiKeysData.apiKeys || [])
      }
    } catch (error) {
      console.error("Error fetching organization data:", error)
      toast({
        title: "Error",
        description: "Failed to load organization data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: OrganizationForm) => {
    try {
      setSaving(true)
      const response = await fetch(`/api/organizations/${orgSlug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to update organization")
      }

      toast({
        title: "Success",
        description: "Organization updated successfully",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error("Error updating organization:", error)
      toast({
        title: "Error",
        description: "Failed to update organization",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInvite = async (data: InviteForm) => {
    try {
      setInviting(true)
      const response = await fetch(`/api/organizations/${orgSlug}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send invitation")
      }

      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${data.email}`,
      })

      inviteForm.reset()
      fetchOrganizationData()
    } catch (error) {
      console.error("Error sending invitation:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation",
        variant: "destructive",
      })
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      toast({
        title: "Member removed",
        description: "Member has been removed from the organization",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error("Error removing member:", error)
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive",
      })
    }
  }

  const handleCreateApiKey = async () => {
    if (!newApiKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the API key",
        variant: "destructive",
      })
      return
    }

    try {
      setCreatingApiKey(true)
      const response = await fetch(`/api/organizations/${orgSlug}/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newApiKeyName }),
      })

      if (!response.ok) {
        throw new Error("Failed to create API key")
      }

      const data = await response.json()
      setNewApiKey(data.key)
      setNewApiKeyName("")

      toast({
        title: "API key created",
        description: "Your new API key has been created",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error("Error creating API key:", error)
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setCreatingApiKey(false)
    }
  }

  const handleDeleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/api-keys/${keyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      toast({
        title: "API key deleted",
        description: "API key has been deleted",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error("Error deleting API key:", error)
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading organization settings...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Organization not found</h2>
          <p className="text-muted-foreground">
            The organization you're looking for doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    )
  }

  const canManageOrganization = ["OWNER", "ADMIN"].includes(organization.role)
  const canInviteMembers = ["OWNER", "ADMIN"].includes(organization.role)
  const canManageApiKeys = ["OWNER", "ADMIN"].includes(organization.role)

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Members</span>
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center space-x-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API Keys</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>Update your organization's basic information and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!canManageOrganization} />
                        </FormControl>
                        <FormDescription>This is your organization's display name.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} disabled={!canManageOrganization} className="resize-none" />
                        </FormControl>
                        <FormDescription>A brief description of your organization.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!canManageOrganization}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!canManageOrganization}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sizeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={!canManageOrganization} />
                        </FormControl>
                        <FormDescription>Your organization's website URL.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {canManageOrganization && (
                    <Button type="submit" disabled={saving}>
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <div className="space-y-6">
            {canInviteMembers && (
              <Card>
                <CardHeader>
                  <CardTitle>Invite Members</CardTitle>
                  <CardDescription>Invite new members to join your organization.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...inviteForm}>
                    <form onSubmit={inviteForm.handleSubmit(handleInvite)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                          control={inviteForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="user@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={inviteForm.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {roleOptions.map((role) => (
                                    <SelectItem key={role.value} value={role.value}>
                                      {role.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button type="submit" disabled={inviting}>
                        {inviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>Manage your organization's members and their roles.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={member.user.imageUrl || undefined} />
                          <AvatarFallback>
                            {member.user.firstName?.[0]}
                            {member.user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          {getRoleIcon(member.role)}
                          <span className="hidden sm:inline">{member.role}</span>
                        </Badge>
                        {canManageOrganization && member.role !== "OWNER" && member.user.id !== user?.id && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remove Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to remove {member.user.firstName} {member.user.lastName} from
                                  the organization? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveMember(member.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {invitations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pending Invitations</CardTitle>
                  <CardDescription>Invitations that haven't been accepted yet.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{invitation.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Invited {new Date(invitation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <Badge variant="outline" className="flex items-center space-x-1">
                            {getRoleIcon(invitation.role)}
                            <span className="hidden sm:inline">{invitation.role}</span>
                          </Badge>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <div className="space-y-6">
            {canManageApiKeys && (
              <Card>
                <CardHeader>
                  <CardTitle>Create API Key</CardTitle>
                  <CardDescription>
                    Create a new API key to access your organization's data programmatically.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 w-full">
                      <Label htmlFor="api-key-name">API Key Name</Label>
                      <Input
                        id="api-key-name"
                        placeholder="My API Key"
                        value={newApiKeyName}
                        onChange={(e) => setNewApiKeyName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleCreateApiKey} disabled={creatingApiKey} className="w-full sm:w-auto">
                      {creatingApiKey && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      <Plus className="h-4 w-4 mr-2" />
                      Create Key
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {newApiKey && (
              <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <CardHeader>
                  <CardTitle className="text-green-800 dark:text-green-200">API Key Created</CardTitle>
                  <CardDescription className="text-green-700 dark:text-green-300">
                    Your new API key has been created. Make sure to copy it now as you won't be able to see it again.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-white dark:bg-green-900 border rounded-lg">
                    <code className="flex-1 text-sm font-mono break-all">{newApiKey}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(newApiKey)}
                      className="w-full sm:w-auto"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Manage your organization's API keys.</CardDescription>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">No API keys</h3>
                    <p className="text-muted-foreground">Create your first API key to get started with the API.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{apiKey.name}</p>
                          <p className="text-sm text-muted-foreground font-mono break-all">{apiKey.keyPreview}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(apiKey.createdAt).toLocaleDateString()}
                            {apiKey.lastUsed && (
                              <span> • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
                            )}
                          </p>
                        </div>
                        {canManageApiKeys && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="flex-shrink-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the API key "{apiKey.name}"? This action cannot be
                                  undone and will immediately revoke access.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteApiKey(apiKey.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
