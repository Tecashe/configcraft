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
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Building2, Users, Shield, Key, Trash2, Plus, Loader2, Save, Upload, UserPlus, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface OrganizationData {
  id: string
  name: string
  slug: string
  description?: string
  logoUrl?: string
  website?: string
  industry?: string
  size: string
  customBranding: boolean
  brandColors?: any
}

interface TeamMember {
  id: string
  role: string
  status: string
  joinedAt: string
  user: {
    id: string
    firstName?: string
    lastName?: string
    email: string
    imageUrl?: string
  }
}

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
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

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 50)
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [organization, setOrganization] = useState<OrganizationData | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("MEMBER")
  const [inviting, setInviting] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const orgSlug = params?.slug as string

  useEffect(() => {
    if (orgSlug) {
      fetchSettings()
    }
  }, [orgSlug])

  const fetchSettings = async () => {
    try {
      const [orgResponse, membersResponse, keysResponse] = await Promise.all([
        fetch(`/api/organizations/${orgSlug}`),
        fetch(`/api/organizations/${orgSlug}/members`),
        fetch(`/api/organizations/${orgSlug}/api-keys`),
      ])

      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        setOrganization(orgData)
      }

      if (membersResponse.ok) {
        const membersData = await membersResponse.json()
        setTeamMembers(membersData)
      }

      if (keysResponse.ok) {
        const keysData = await keysResponse.json()
        setApiKeys(keysData)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveOrganization = async () => {
    if (!organization) return

    setSaving(true)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: organization.name,
          description: organization.description,
          website: organization.website,
          industry: organization.industry,
          size: organization.size,
          customBranding: organization.customBranding,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update organization")
      }

      const updatedOrg = await response.json()
      setOrganization(updatedOrg)

      toast({
        title: "Settings saved",
        description: "Organization settings have been updated successfully.",
      })

      // If slug changed, redirect
      if (updatedOrg.slug !== orgSlug) {
        router.push(`/${updatedOrg.slug}/settings`)
      }
    } catch (error) {
      console.error("Failed to save organization:", error)
      toast({
        title: "Save failed",
        description: "Failed to save organization settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address to invite.",
        variant: "destructive",
      })
      return
    }

    setInviting(true)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/invitations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to send invitation")
      }

      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${inviteEmail}`,
      })

      setInviteEmail("")
      setInviteRole("MEMBER")
    } catch (error) {
      console.error("Failed to invite member:", error)
      toast({
        title: "Invitation failed",
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

      setTeamMembers((prev) => prev.filter((member) => member.id !== memberId))

      toast({
        title: "Member removed",
        description: "Team member has been removed from the organization.",
      })
    } catch (error) {
      console.error("Failed to remove member:", error)
      toast({
        title: "Remove failed",
        description: "Failed to remove team member. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateApiKey = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `API Key ${apiKeys.length + 1}`,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create API key")
      }

      const newKey = await response.json()
      setApiKeys((prev) => [...prev, newKey])

      toast({
        title: "API key created",
        description: "New API key has been generated successfully.",
      })
    } catch (error) {
      console.error("Failed to create API key:", error)
      toast({
        title: "Creation failed",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      })
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

      setApiKeys((prev) => prev.filter((key) => key.id !== keyId))

      toast({
        title: "API key deleted",
        description: "API key has been deleted successfully.",
      })
    } catch (error) {
      console.error("Failed to delete API key:", error)
      toast({
        title: "Delete failed",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(keyId)
      setTimeout(() => setCopiedKey(null), 2000)
      toast({
        title: "Copied",
        description: "API key copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy API key to clipboard",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Organization Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The organization you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2 text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings, team, and security preferences</p>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <Card className="config-card">
            <CardHeader>
              <CardTitle className="text-foreground">Organization Information</CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your organization details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="text-foreground">
                    Organization Name
                  </Label>
                  <Input
                    id="org-name"
                    value={organization.name}
                    onChange={(e) => setOrganization((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-slug" className="text-foreground">
                    Organization URL
                  </Label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">configcraft.com/</span>
                    <Input
                      id="org-slug"
                      value={organization.slug}
                      onChange={(e) =>
                        setOrganization((prev) => (prev ? { ...prev, slug: generateSlug(e.target.value) } : null))
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="org-description"
                  placeholder="Brief description of your organization..."
                  value={organization.description || ""}
                  onChange={(e) => setOrganization((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-foreground">
                    Industry
                  </Label>
                  <Select
                    value={organization.industry || ""}
                    onValueChange={(value) => setOrganization((prev) => (prev ? { ...prev, industry: value } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
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
                  <Label htmlFor="size" className="text-foreground">
                    Organization Size
                  </Label>
                  <Select
                    value={organization.size}
                    onValueChange={(value) => setOrganization((prev) => (prev ? { ...prev, size: value } : null))}
                  >
                    <SelectTrigger>
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
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website" className="text-foreground">
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcompany.com"
                  value={organization.website || ""}
                  onChange={(e) => setOrganization((prev) => (prev ? { ...prev, website: e.target.value } : null))}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={organization.logoUrl || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">
                      {organization.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                    <p className="text-sm text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-foreground">Custom Branding</h3>
                  <p className="text-sm text-muted-foreground">Apply your brand colors to generated tools</p>
                </div>
                <Switch
                  checked={organization.customBranding}
                  onCheckedChange={(checked) =>
                    setOrganization((prev) => (prev ? { ...prev, customBranding: checked } : null))
                  }
                />
              </div>

              <Button onClick={handleSaveOrganization} disabled={saving} className="config-button-primary">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="config-card">
            <CardHeader>
              <CardTitle className="text-foreground">Invite Team Member</CardTitle>
              <CardDescription className="text-muted-foreground">Add new members to your organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter email address"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleInviteMember} disabled={inviting} className="config-button-primary">
                  {inviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="config-card">
            <CardHeader>
              <CardTitle className="text-foreground">Team Members</CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your team members and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user.imageUrl || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.user.firstName?.charAt(0) || ""}
                          {member.user.lastName?.charAt(0) || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.user.firstName} {member.user.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{member.user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.status === "ACTIVE" ? "default" : "secondary"}>{member.status}</Badge>
                      <Badge variant="outline">{member.role}</Badge>
                      {member.role !== "OWNER" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {member.user.firstName} {member.user.lastName} from this
                                organization? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMember(member.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Remove Member
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
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="config-card">
            <CardHeader>
              <CardTitle className="text-foreground">Authentication & Security</CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure security settings for your organization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Require 2FA for all team members</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-foreground">Single Sign-On (SSO)</h4>
                  <p className="text-sm text-muted-foreground">Enable SSO with your identity provider</p>
                </div>
                <Button variant="outline">Configure SSO</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-foreground">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout" className="text-foreground">
                      Session Timeout (minutes)
                    </Label>
                    <Input id="session-timeout" type="number" defaultValue="480" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-sessions" className="text-foreground">
                      Max Concurrent Sessions
                    </Label>
                    <Input id="max-sessions" type="number" defaultValue="3" />
                  </div>
                </div>
              </div>

              <Button className="config-button-primary">Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card className="config-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                API Keys
                <Button onClick={handleCreateApiKey} className="config-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage API keys for integrating with ConfigCraft
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-8">
                    <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No API Keys</h3>
                    <p className="text-muted-foreground mb-4">
                      Create your first API key to start integrating with ConfigCraft
                    </p>
                    <Button onClick={handleCreateApiKey} className="config-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create API Key
                    </Button>
                  </div>
                ) : (
                  apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="font-medium text-foreground">{apiKey.name}</p>
                        <p className="text-sm font-mono text-muted-foreground">{apiKey.key}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(apiKey.createdAt).toLocaleDateString()}
                          {apiKey.lastUsed && ` • Last used ${apiKey.lastUsed}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(apiKey.key, apiKey.id)}>
                          {copiedKey === apiKey.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this API key? This action cannot be undone and will
                                break any integrations using this key.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteApiKey(apiKey.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Key
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="config-card">
            <CardHeader>
              <CardTitle className="text-foreground">API Usage</CardTitle>
              <CardDescription className="text-muted-foreground">
                Monitor your API usage and rate limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">1,247</div>
                  <p className="text-sm text-muted-foreground">Requests this month</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">10,000</div>
                  <p className="text-sm text-muted-foreground">Monthly limit</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">87%</div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-4">
                <div className="bg-primary h-2 rounded-full" style={{ width: "13%" }}></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
