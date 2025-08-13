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
import { Building2, Users, Shield, Key, Trash2, Plus, Settings } from "lucide-react"

export default function SettingsPage() {
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      email: "john@company.com",
      role: "Admin",
      status: "Active",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Editor",
      status: "Active",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@company.com",
      role: "Viewer",
      status: "Pending",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "Lisa Davis",
      email: "lisa@company.com",
      role: "Editor",
      status: "Active",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]
//ygyug
  const apiKeys = [
    {
      id: 1,
      name: "Production API",
      key: "ck_live_••••••••••••••••••••••••••••••••",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
    },
    {
      id: 2,
      name: "Development API",
      key: "ck_test_••••••••••••••••••••••••••••••••",
      created: "2024-01-10",
      lastUsed: "1 day ago",
    },
  ]

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your company settings, team, and security preferences</p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Company
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

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your company details and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-domain">Custom Domain</Label>
                  <Input id="company-domain" placeholder="tools.yourcompany.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-description">Company Description</Label>
                <Textarea
                  id="company-description"
                  placeholder="Brief description of your company..."
                  defaultValue="A leading technology company focused on innovation and growth."
                />
              </div>

              <div className="space-y-2">
                <Label>Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    AC
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline">Upload New Logo</Button>
                    <p className="text-sm text-muted-foreground">Recommended: 200x200px, PNG or JPG</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Custom Branding</h3>
                  <p className="text-sm text-muted-foreground">Apply your brand colors to generated tools</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Team Members
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </CardTitle>
              <CardDescription>Manage your team members and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
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

          <Card>
            <CardHeader>
              <CardTitle>Team Permissions</CardTitle>
              <CardDescription>Configure default permissions for team roles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Admin</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Create tools</span>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manage team</span>
                      <Switch defaultChecked disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Billing access</span>
                      <Switch defaultChecked disabled />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Editor</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Create tools</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manage team</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Billing access</span>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Viewer</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Create tools</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Manage team</span>
                      <Switch disabled />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Billing access</span>
                      <Switch disabled />
                    </div>
                  </div>
                </div>
              </div>
              <Button>Update Permissions</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication & Security</CardTitle>
              <CardDescription>Configure security settings for your organization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Require 2FA for all team members</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Single Sign-On (SSO)</h4>
                  <p className="text-sm text-muted-foreground">Enable SSO with your identity provider</p>
                </div>
                <Button variant="outline">Configure SSO</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="480" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-sessions">Max Concurrent Sessions</Label>
                    <Input id="max-sessions" type="number" defaultValue="3" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">IP Restrictions</h4>
                  <p className="text-sm text-muted-foreground">Limit access to specific IP addresses</p>
                </div>
                <Button variant="outline">Manage IPs</Button>
              </div>

              <Button>Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                API Keys
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create API Key
                </Button>
              </CardTitle>
              <CardDescription>Manage API keys for integrating with ConfigCraft</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{apiKey.name}</p>
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

          <Card>
            <CardHeader>
              <CardTitle>API Usage</CardTitle>
              <CardDescription>Monitor your API usage and rate limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-sm text-muted-foreground">Requests this month</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10,000</div>
                  <p className="text-sm text-muted-foreground">Monthly limit</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">87%</div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2 mt-4">
                <div className="bg-primary h-2 rounded-full" style={{ width: "13%" }}></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
