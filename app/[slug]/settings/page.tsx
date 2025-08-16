

// "use client"

// import { useState, useEffect } from "react"
// import { useParams } from "next/navigation"
// import { useUser } from "@clerk/nextjs"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
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
// import { Settings, Users, Key, Trash2, Plus, Copy, Eye, Mail, Crown, Shield, Loader2 } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"

// const organizationSchema = z.object({
//   name: z.string().min(1, "Organization name is required").max(100),
//   description: z.string().optional(),
//   website: z.string().url().optional().or(z.literal("")),
//   industry: z.string().optional(),
//   size: z.enum(["SMALL", "MEDIUM", "LARGE", "ENTERPRISE"]),
// })

// const inviteSchema = z.object({
//   email: z.string().email("Please enter a valid email address"),
//   role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
// })

// type OrganizationForm = z.infer<typeof organizationSchema>
// type InviteForm = z.infer<typeof inviteSchema>

// interface Organization {
//   id: string
//   name: string
//   slug: string
//   description?: string | null
//   website?: string | null
//   industry?: string | null
//   size: "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE"
//   role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
//   memberCount: number
//   toolCount: number
// }

// interface Member {
//   id: string
//   role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER"
//   status: string
//   joinedAt: string
//   user: {
//     id: string
//     email: string
//     firstName?: string | null
//     lastName?: string | null
//     imageUrl?: string | null
//   }
// }

// interface Invitation {
//   id: string
//   email: string
//   role: "ADMIN" | "MEMBER" | "VIEWER"
//   status: string
//   createdAt: string
//   expiresAt: string
// }

// interface ApiKey {
//   id: string
//   name: string
//   keyPreview: string
//   createdAt: string
//   lastUsed?: string | null
// }

// const industryOptions = [
//   "Technology",
//   "Healthcare",
//   "Finance",
//   "Education",
//   "Manufacturing",
//   "Retail",
//   "Consulting",
//   "Non-profit",
//   "Government",
//   "Other",
// ]

// const sizeOptions = [
//   { value: "SMALL", label: "Small (1-10 people)" },
//   { value: "MEDIUM", label: "Medium (11-50 people)" },
//   { value: "LARGE", label: "Large (51-200 people)" },
//   { value: "ENTERPRISE", label: "Enterprise (200+ people)" },
// ]

// const roleOptions = [
//   { value: "ADMIN", label: "Admin", description: "Can manage organization and members" },
//   { value: "MEMBER", label: "Member", description: "Can create and manage tools" },
//   { value: "VIEWER", label: "Viewer", description: "Can view tools and data" },
// ]

// function getRoleIcon(role: string) {
//   switch (role) {
//     case "OWNER":
//       return <Crown className="h-4 w-4 text-yellow-500" />
//     case "ADMIN":
//       return <Shield className="h-4 w-4 text-blue-500" />
//     case "MEMBER":
//       return <Users className="h-4 w-4 text-green-500" />
//     case "VIEWER":
//       return <Eye className="h-4 w-4 text-gray-500" />
//     default:
//       return null
//   }
// }

// export default function SettingsPage() {
//   const params = useParams()
//   const { user } = useUser()
//   const { toast } = useToast()
//   const orgSlug = params?.slug as string

//   const [organization, setOrganization] = useState<Organization | null>(null)
//   const [members, setMembers] = useState<Member[]>([])
//   const [invitations, setInvitations] = useState<Invitation[]>([])
//   const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [inviting, setInviting] = useState(false)
//   const [creatingApiKey, setCreatingApiKey] = useState(false)
//   const [newApiKeyName, setNewApiKeyName] = useState("")
//   const [newApiKey, setNewApiKey] = useState<string | null>(null)

//   const form = useForm<OrganizationForm>({
//     resolver: zodResolver(organizationSchema),
//   })

//   const inviteForm = useForm<InviteForm>({
//     resolver: zodResolver(inviteSchema),
//     defaultValues: {
//       role: "MEMBER",
//     },
//   })

//   useEffect(() => {
//     if (orgSlug) {
//       fetchOrganizationData()
//     }
//   }, [orgSlug])

//   const fetchOrganizationData = async () => {
//     try {
//       setLoading(true)

//       // Fetch organization details
//       const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
//       if (orgResponse.ok) {
//         const orgData = await orgResponse.json()
//         setOrganization(orgData)
//         form.reset({
//           name: orgData.name,
//           description: orgData.description || "",
//           website: orgData.website || "",
//           industry: orgData.industry || "",
//           size: orgData.size,
//         })
//       } else {
//         console.error("Failed to fetch organization:", orgResponse.status)
//       }

//       // Fetch members
//       const membersResponse = await fetch(`/api/organizations/${orgSlug}/members`)
//       if (membersResponse.ok) {
//         const membersData = await membersResponse.json()
//         setMembers(membersData.members || [])
//       }

//       // Fetch invitations
//       const invitationsResponse = await fetch(`/api/organizations/${orgSlug}/invitations`)
//       if (invitationsResponse.ok) {
//         const invitationsData = await invitationsResponse.json()
//         setInvitations(invitationsData.invitations || [])
//       }

//       // Fetch API keys
//       const apiKeysResponse = await fetch(`/api/organizations/${orgSlug}/api-keys`)
//       if (apiKeysResponse.ok) {
//         const apiKeysData = await apiKeysResponse.json()
//         setApiKeys(apiKeysData.apiKeys || [])
//       }
//     } catch (error) {
//       console.error("Error fetching organization data:", error)
//       toast({
//         title: "Error",
//         description: "Failed to load organization data",
//         variant: "destructive",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   const onSubmit = async (data: OrganizationForm) => {
//     try {
//       setSaving(true)
//       const response = await fetch(`/api/organizations/${orgSlug}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to update organization")
//       }

//       toast({
//         title: "Success",
//         description: "Organization updated successfully",
//       })

//       fetchOrganizationData()
//     } catch (error) {
//       console.error("Error updating organization:", error)
//       toast({
//         title: "Error",
//         description: "Failed to update organization",
//         variant: "destructive",
//       })
//     } finally {
//       setSaving(false)
//     }
//   }

//   const handleInvite = async (data: InviteForm) => {
//     try {
//       setInviting(true)
//       const response = await fetch(`/api/organizations/${orgSlug}/invitations`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })

//       if (!response.ok) {
//         const error = await response.json()
//         throw new Error(error.error || "Failed to send invitation")
//       }

//       toast({
//         title: "Invitation sent",
//         description: `Invitation sent to ${data.email}`,
//       })

//       inviteForm.reset()
//       fetchOrganizationData()
//     } catch (error) {
//       console.error("Error sending invitation:", error)
//       toast({
//         title: "Error",
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

//       toast({
//         title: "Member removed",
//         description: "Member has been removed from the organization",
//       })

//       fetchOrganizationData()
//     } catch (error) {
//       console.error("Error removing member:", error)
//       toast({
//         title: "Error",
//         description: "Failed to remove member",
//         variant: "destructive",
//       })
//     }
//   }

//   const handleCreateApiKey = async () => {
//     if (!newApiKeyName.trim()) {
//       toast({
//         title: "Error",
//         description: "Please enter a name for the API key",
//         variant: "destructive",
//       })
//       return
//     }

//     try {
//       setCreatingApiKey(true)
//       const response = await fetch(`/api/organizations/${orgSlug}/api-keys`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name: newApiKeyName }),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to create API key")
//       }

//       const data = await response.json()
//       setNewApiKey(data.key)
//       setNewApiKeyName("")

//       toast({
//         title: "API key created",
//         description: "Your new API key has been created",
//       })

//       fetchOrganizationData()
//     } catch (error) {
//       console.error("Error creating API key:", error)
//       toast({
//         title: "Error",
//         description: "Failed to create API key",
//         variant: "destructive",
//       })
//     } finally {
//       setCreatingApiKey(false)
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

//       toast({
//         title: "API key deleted",
//         description: "API key has been deleted",
//       })

//       fetchOrganizationData()
//     } catch (error) {
//       console.error("Error deleting API key:", error)
//       toast({
//         title: "Error",
//         description: "Failed to delete API key",
//         variant: "destructive",
//       })
//     }
//   }

//   const copyToClipboard = async (text: string) => {
//     try {
//       await navigator.clipboard.writeText(text)
//       toast({
//         title: "Copied",
//         description: "Copied to clipboard",
//       })
//     } catch (error) {
//       console.error("Error copying to clipboard:", error)
//       toast({
//         title: "Error",
//         description: "Failed to copy to clipboard",
//         variant: "destructive",
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="h-8 w-8 animate-spin" />
//           <p className="text-muted-foreground">Loading organization settings...</p>
//         </div>
//       </div>
//     )
//   }

//   if (!organization) {
//     return (
//       <div className="text-center py-12">
//         <div className="max-w-md mx-auto">
//           <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold mb-2">Organization not found</h2>
//           <p className="text-muted-foreground">
//             The organization you're looking for doesn't exist or you don't have access to it.
//           </p>
//         </div>
//       </div>
//     )
//   }

//   const canManageOrganization = ["OWNER", "ADMIN"].includes(organization.role)
//   const canInviteMembers = ["OWNER", "ADMIN"].includes(organization.role)
//   const canManageApiKeys = ["OWNER", "ADMIN"].includes(organization.role)

//   return (
//     <div className="space-y-6 p-4 lg:p-6">
//       <div className="space-y-2">
//         <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
//         <p className="text-muted-foreground">Manage your organization settings and preferences.</p>
//       </div>

//       <Tabs defaultValue="general" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:flex">
//           <TabsTrigger value="general" className="flex items-center space-x-2">
//             <Settings className="h-4 w-4" />
//             <span className="hidden sm:inline">General</span>
//           </TabsTrigger>
//           <TabsTrigger value="members" className="flex items-center space-x-2">
//             <Users className="h-4 w-4" />
//             <span className="hidden sm:inline">Members</span>
//           </TabsTrigger>
//           <TabsTrigger value="api-keys" className="flex items-center space-x-2">
//             <Key className="h-4 w-4" />
//             <span className="hidden sm:inline">API Keys</span>
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="general">
//           <Card>
//             <CardHeader>
//               <CardTitle>Organization Settings</CardTitle>
//               <CardDescription>Update your organization's basic information and preferences.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Form {...form}>
//                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                   <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Organization Name</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled={!canManageOrganization} />
//                         </FormControl>
//                         <FormDescription>This is your organization's display name.</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Description</FormLabel>
//                         <FormControl>
//                           <Textarea {...field} disabled={!canManageOrganization} className="resize-none" />
//                         </FormControl>
//                         <FormDescription>A brief description of your organization.</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <FormField
//                       control={form.control}
//                       name="industry"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Industry</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                             disabled={!canManageOrganization}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select industry" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {industryOptions.map((industry) => (
//                                 <SelectItem key={industry} value={industry}>
//                                   {industry}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="size"
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Organization Size</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                             disabled={!canManageOrganization}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {sizeOptions.map((option) => (
//                                 <SelectItem key={option.value} value={option.value}>
//                                   {option.label}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>

//                   <FormField
//                     control={form.control}
//                     name="website"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Website</FormLabel>
//                         <FormControl>
//                           <Input {...field} disabled={!canManageOrganization} />
//                         </FormControl>
//                         <FormDescription>Your organization's website URL.</FormDescription>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {canManageOrganization && (
//                     <Button type="submit" disabled={saving}>
//                       {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
//                       Save Changes
//                     </Button>
//                   )}
//                 </form>
//               </Form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="members">
//           <div className="space-y-6">
//             {canInviteMembers && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Invite Members</CardTitle>
//                   <CardDescription>Invite new members to join your organization.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <Form {...inviteForm}>
//                     <form onSubmit={inviteForm.handleSubmit(handleInvite)} className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <FormField
//                           control={inviteForm.control}
//                           name="email"
//                           render={({ field }) => (
//                             <FormItem className="md:col-span-2">
//                               <FormLabel>Email Address</FormLabel>
//                               <FormControl>
//                                 <Input placeholder="user@example.com" {...field} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />

//                         <FormField
//                           control={inviteForm.control}
//                           name="role"
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Role</FormLabel>
//                               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                 <FormControl>
//                                   <SelectTrigger>
//                                     <SelectValue />
//                                   </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                   {roleOptions.map((role) => (
//                                     <SelectItem key={role.value} value={role.value}>
//                                       {role.label}
//                                     </SelectItem>
//                                   ))}
//                                 </SelectContent>
//                               </Select>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>

//                       <Button type="submit" disabled={inviting}>
//                         {inviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
//                         <Mail className="h-4 w-4 mr-2" />
//                         Send Invitation
//                       </Button>
//                     </form>
//                   </Form>
//                 </CardContent>
//               </Card>
//             )}

//             <Card>
//               <CardHeader>
//                 <CardTitle>Members</CardTitle>
//                 <CardDescription>Manage your organization's members and their roles.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {members.map((member) => (
//                     <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex items-center space-x-3 min-w-0 flex-1">
//                         <Avatar className="h-10 w-10 flex-shrink-0">
//                           <AvatarImage src={member.user.imageUrl || undefined} />
//                           <AvatarFallback>
//                             {member.user.firstName?.[0]}
//                             {member.user.lastName?.[0]}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="min-w-0 flex-1">
//                           <p className="font-medium truncate">
//                             {member.user.firstName} {member.user.lastName}
//                           </p>
//                           <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-2 flex-shrink-0">
//                         <Badge variant="secondary" className="flex items-center space-x-1">
//                           {getRoleIcon(member.role)}
//                           <span className="hidden sm:inline">{member.role}</span>
//                         </Badge>
//                         {canManageOrganization && member.role !== "OWNER" && member.user.id !== user?.id && (
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button variant="ghost" size="sm">
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Remove Member</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to remove {member.user.firstName} {member.user.lastName} from
//                                   the organization? This action cannot be undone.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleRemoveMember(member.id)}
//                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                                 >
//                                   Remove
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {invitations.length > 0 && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Pending Invitations</CardTitle>
//                   <CardDescription>Invitations that haven't been accepted yet.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {invitations.map((invitation) => (
//                       <div key={invitation.id} className="flex items-center justify-between p-4 border rounded-lg">
//                         <div className="min-w-0 flex-1">
//                           <p className="font-medium truncate">{invitation.email}</p>
//                           <p className="text-sm text-muted-foreground">
//                             Invited {new Date(invitation.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <div className="flex items-center space-x-2 flex-shrink-0">
//                           <Badge variant="outline" className="flex items-center space-x-1">
//                             {getRoleIcon(invitation.role)}
//                             <span className="hidden sm:inline">{invitation.role}</span>
//                           </Badge>
//                           <Badge variant="secondary">Pending</Badge>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </TabsContent>

//         <TabsContent value="api-keys">
//           <div className="space-y-6">
//             {canManageApiKeys && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Create API Key</CardTitle>
//                   <CardDescription>
//                     Create a new API key to access your organization's data programmatically.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
//                     <div className="flex-1 w-full">
//                       <Label htmlFor="api-key-name">API Key Name</Label>
//                       <Input
//                         id="api-key-name"
//                         placeholder="My API Key"
//                         value={newApiKeyName}
//                         onChange={(e) => setNewApiKeyName(e.target.value)}
//                         className="mt-1"
//                       />
//                     </div>
//                     <Button onClick={handleCreateApiKey} disabled={creatingApiKey} className="w-full sm:w-auto">
//                       {creatingApiKey && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
//                       <Plus className="h-4 w-4 mr-2" />
//                       Create Key
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {newApiKey && (
//               <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
//                 <CardHeader>
//                   <CardTitle className="text-green-800 dark:text-green-200">API Key Created</CardTitle>
//                   <CardDescription className="text-green-700 dark:text-green-300">
//                     Your new API key has been created. Make sure to copy it now as you won't be able to see it again.
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-white dark:bg-green-900 border rounded-lg">
//                     <code className="flex-1 text-sm font-mono break-all">{newApiKey}</code>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => copyToClipboard(newApiKey)}
//                       className="w-full sm:w-auto"
//                     >
//                       <Copy className="h-4 w-4 mr-2" />
//                       Copy
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             <Card>
//               <CardHeader>
//                 <CardTitle>API Keys</CardTitle>
//                 <CardDescription>Manage your organization's API keys.</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {apiKeys.length === 0 ? (
//                   <div className="text-center py-8">
//                     <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//                     <h3 className="text-lg font-semibold">No API keys</h3>
//                     <p className="text-muted-foreground">Create your first API key to get started with the API.</p>
//                   </div>
//                 ) : (
//                   <div className="space-y-4">
//                     {apiKeys.map((apiKey) => (
//                       <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
//                         <div className="min-w-0 flex-1">
//                           <p className="font-medium">{apiKey.name}</p>
//                           <p className="text-sm text-muted-foreground font-mono break-all">{apiKey.keyPreview}</p>
//                           <p className="text-xs text-muted-foreground">
//                             Created {new Date(apiKey.createdAt).toLocaleDateString()}
//                             {apiKey.lastUsed && (
//                               <span> • Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</span>
//                             )}
//                           </p>
//                         </div>
//                         {canManageApiKeys && (
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button variant="ghost" size="sm" className="flex-shrink-0">
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>Delete API Key</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Are you sure you want to delete the API key "{apiKey.name}"? This action cannot be
//                                   undone and will immediately revoke access.
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                 <AlertDialogAction
//                                   onClick={() => handleDeleteApiKey(apiKey.id)}
//                                   className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import {
  Settings,
  Users,
  Key,
  Trash2,
  Plus,
  Copy,
  Eye,
  Mail,
  Crown,
  Shield,
  Loader2,
  AlertTriangle,
} from "lucide-react"
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
  const router = useRouter()
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
  const [deletingOrg, setDeletingOrg] = useState(false)
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

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
    console.log(`🔍 [SETTINGS_PAGE] Fetching organization data for: ${orgSlug}`)

    try {
      setLoading(true)

      // Fetch organization details
      const orgResponse = await fetch(`/api/organizations/${orgSlug}`)
      if (orgResponse.ok) {
        const orgData = await orgResponse.json()
        console.log(`✅ [SETTINGS_PAGE] Organization data loaded:`, orgData)
        setOrganization(orgData)
        form.reset({
          name: orgData.name,
          description: orgData.description || "",
          website: orgData.website || "",
          industry: orgData.industry || "",
          size: orgData.size,
        })
      } else {
        console.error(`❌ [SETTINGS_PAGE] Failed to fetch organization:`, orgResponse.status)
      }

      // Fetch members
      const membersResponse = await fetch(`/api/organizations/${orgSlug}/members`)
      if (membersResponse.ok) {
        const membersData = await membersResponse.json()
        console.log(`✅ [SETTINGS_PAGE] Members loaded:`, membersData.members?.length || 0)
        setMembers(membersData.members || [])
      }

      // Fetch invitations
      const invitationsResponse = await fetch(`/api/organizations/${orgSlug}/invitations`)
      if (invitationsResponse.ok) {
        const invitationsData = await invitationsResponse.json()
        console.log(`✅ [SETTINGS_PAGE] Invitations loaded:`, invitationsData.invitations?.length || 0)
        setInvitations(invitationsData.invitations || [])
      }

      // Fetch API keys
      const apiKeysResponse = await fetch(`/api/organizations/${orgSlug}/api-keys`)
      if (apiKeysResponse.ok) {
        const apiKeysData = await apiKeysResponse.json()
        console.log(`✅ [SETTINGS_PAGE] API keys loaded:`, apiKeysData.apiKeys?.length || 0)
        setApiKeys(apiKeysData.apiKeys || [])
      }
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error fetching organization data:`, error)
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
    console.log(`💾 [SETTINGS_PAGE] Saving organization data:`, data)

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

      console.log(`✅ [SETTINGS_PAGE] Organization updated successfully`)
      toast({
        title: "Success",
        description: "Organization updated successfully",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error updating organization:`, error)
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
    console.log(`📧 [SETTINGS_PAGE] Sending invitation:`, data)

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

      console.log(`✅ [SETTINGS_PAGE] Invitation sent successfully`)
      toast({
        title: "Invitation sent",
        description: `Invitation sent to ${data.email}`,
      })

      inviteForm.reset()
      fetchOrganizationData()
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error sending invitation:`, error)
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
    console.log(`👋 [SETTINGS_PAGE] Removing member:`, memberId)

    try {
      const response = await fetch(`/api/organizations/${orgSlug}/members/${memberId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove member")
      }

      console.log(`✅ [SETTINGS_PAGE] Member removed successfully`)
      toast({
        title: "Member removed",
        description: "Member has been removed from the organization",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error removing member:`, error)
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

    console.log(`🔑 [SETTINGS_PAGE] Creating API key:`, newApiKeyName)

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

      console.log(`✅ [SETTINGS_PAGE] API key created successfully`)
      toast({
        title: "API key created",
        description: "Your new API key has been created",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error creating API key:`, error)
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
    console.log(`🗑️ [SETTINGS_PAGE] Deleting API key:`, keyId)

    try {
      const response = await fetch(`/api/organizations/${orgSlug}/api-keys/${keyId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete API key")
      }

      console.log(`✅ [SETTINGS_PAGE] API key deleted successfully`)
      toast({
        title: "API key deleted",
        description: "API key has been deleted",
      })

      fetchOrganizationData()
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error deleting API key:`, error)
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  const handleDeleteOrganization = async () => {
    if (deleteConfirmText !== organization?.name) {
      toast({
        title: "Error",
        description: "Please type the organization name exactly to confirm deletion",
        variant: "destructive",
      })
      return
    }

    console.log(`🗑️ [SETTINGS_PAGE] Deleting organization:`, orgSlug)

    try {
      setDeletingOrg(true)
      const response = await fetch(`/api/organizations/${orgSlug}/delete`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete organization")
      }

      console.log(`✅ [SETTINGS_PAGE] Organization deleted successfully`)
      toast({
        title: "Organization deleted",
        description: "Your organization has been permanently deleted",
      })

      // Redirect to onboarding after successful deletion
      router.push("/onboarding")
    } catch (error) {
      console.error(`💥 [SETTINGS_PAGE] Error deleting organization:`, error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete organization",
        variant: "destructive",
      })
    } finally {
      setDeletingOrg(false)
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
  const canDeleteOrganization = organization.role === "OWNER"

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your organization settings and preferences.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
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
          <TabsTrigger value="danger" className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Danger</span>
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

        <TabsContent value="danger">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions. Please proceed with extreme caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {canDeleteOrganization && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-destructive">Delete Organization</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this organization and all of its data. This action cannot be undone.
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-destructive">This will permanently delete:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• All organization data and settings</li>
                            <li>• All tools and their configurations</li>
                            <li>• All member access and invitations</li>
                            <li>• All API keys and integrations</li>
                            <li>• All usage history and analytics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="delete-confirm">
                        Type <code className="bg-muted px-1 py-0.5 rounded text-sm">{organization.name}</code> to
                        confirm
                      </Label>
                      <Input
                        id="delete-confirm"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder={organization.name}
                        className="mt-1"
                      />
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={deleteConfirmText !== organization.name || deletingOrg}>
                          {deletingOrg && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Organization
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the organization "
                            {organization.name}" and remove all associated data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteOrganization}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, delete organization
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}

              {!canDeleteOrganization && (
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Owner Access Required</h3>
                  <p className="text-muted-foreground">Only organization owners can delete organizations.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
