"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
import { Building2, Users, Shield, Key, Trash2, Plus, Settings, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [organization, setOrganization] = useState<any>(null)
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [apiKeys, setApiKeys] = useState<any[]>([])
  const { toast } = useToast()
  const params = useParams()
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

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  <Input id="org-name" defaultValue={organization?.name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-slug" className="text-foreground">
                    Organization Slug
                  </Label>
                  <Input id="org-slug" defaultValue={organization?.slug || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="org-description" className="text-foreground">
                  Organization Description
                </Label>
                <Textarea
                  id="org-description"
                  placeholder="Brief description of your organization..."
                  defaultValue={organization?.description || ""}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={organization?.logoUrl || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">
                      {organization?.name?.substring(0, 2).toUpperCase() || "ORG"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline">Upload New Logo</Button>
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
                <Switch defaultChecked />
              </div>

              <Button className="config-button-primary">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card className="config-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-foreground">
                Team Members
                <Button className="config-button-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardTitle>
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
                        <AvatarImage src={member.user?.imageUrl || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.user?.firstName?.charAt(0)}
                          {member.user?.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{member.role}</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                <Button className="config-button-primary">
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
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{apiKey.name}</p>
                      <p className="text-sm font-mono text-muted-foreground">{apiKey.key}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {apiKey.created} • Last used {apiKey.lastUsed}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Copy
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
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
