"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  Users,
  Settings,
  Download,
  Upload,
  History,
  Activity,
  TrendingUp,
  Eye,
  Clock,
  UserPlus,
  UserMinus,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Edit,
  Share,
  Copy,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function ToolDetailPage() {
  const params = useParams()
  const toolId = params.id

  // Mock data - in real app, fetch based on toolId
  const tool = {
    id: 1,
    name: "Customer Onboarding Tracker",
    description: "Track leads through the sales pipeline with team collaboration",
    status: "published",
    created: "2024-01-15",
    lastModified: "2 hours ago",
    url: "configcraft.app/tools/customer-onboarding-tracker",
    owner: "John Doe",
    users: 8,
    totalViews: 245,
    weeklyViews: 67,
    team: [
      { email: "john@acme.com", name: "John Doe", role: "Admin", lastActive: "2 hours ago" },
      { email: "sarah@acme.com", name: "Sarah Johnson", role: "Manager", lastActive: "1 day ago" },
      { email: "mike@acme.com", name: "Mike Davis", role: "Team Member", lastActive: "3 hours ago" },
    ],
    integrations: [
      { name: "Slack", status: "connected", lastSync: "5 minutes ago" },
      { name: "Salesforce", status: "connected", lastSync: "1 hour ago" },
      { name: "Google Workspace", status: "error", lastSync: "2 days ago" },
    ],
    versions: [
      { version: "v1.3", date: "2024-01-20", changes: "Added team collaboration features", current: true },
      { version: "v1.2", date: "2024-01-18", changes: "Improved data validation" },
      { version: "v1.1", date: "2024-01-16", changes: "Fixed UI responsiveness issues" },
      { version: "v1.0", date: "2024-01-15", changes: "Initial release" },
    ],
  }

  const [activeTab, setActiveTab] = useState("analytics")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/tools">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tools
                </Link>
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
                  <Badge className="bg-green-100 text-green-800">Live</Badge>
                </div>
                <p className="text-gray-600 mt-1">{tool.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Clone
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Data
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center">
              <History className="w-4 h-4 mr-2" />
              Versions
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Views</p>
                      <p className="text-3xl font-bold text-gray-900">{tool.totalViews}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12% this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Users</p>
                      <p className="text-3xl font-bold text-gray-900">{tool.users}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-gray-600">3 new this week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Weekly Views</p>
                      <p className="text-3xl font-bold text-gray-900">{tool.weeklyViews}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">+8% vs last week</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Uptime</p>
                      <p className="text-3xl font-bold text-gray-900">99.9%</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-gray-600">Last 30 days</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Over Time</CardTitle>
                <CardDescription>Daily active users and page views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                    <p>Analytics chart would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Team Members ({tool.team.length})</h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {tool.team.map((member, index) => (
                    <div key={index} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <Badge variant={member.role === "Admin" ? "default" : "secondary"}>{member.role}</Badge>
                          <p className="text-xs text-gray-500 mt-1">Active {member.lastActive}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <UserMinus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="w-5 h-5 mr-2 text-blue-600" />
                    Export Data
                  </CardTitle>
                  <CardDescription>Download your tool's data in various formats</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Export Format</Label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="xlsx">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-green-600" />
                    Import Data
                  </CardTitle>
                  <CardDescription>Upload data to your tool from external sources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drop files here or click to browse</p>
                    <p className="text-xs text-gray-500">Supports CSV, JSON, and Excel files</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Versions Tab */}
          <TabsContent value="versions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Create Backup
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {tool.versions.map((version, index) => (
                    <div key={index} className="p-6 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${version.current ? "bg-green-500" : "bg-gray-300"}`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{version.version}</p>
                            {version.current && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{version.changes}</p>
                          <p className="text-xs text-gray-500 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {version.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {!version.current && (
                          <Button variant="outline" size="sm">
                            Rollback
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Connected Integrations</h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Add Integration
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tool.integrations.map((integration, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <div className="flex items-center space-x-1">
                        {integration.status === "connected" ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <Badge
                          variant={integration.status === "connected" ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {integration.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Last sync: {integration.lastSync}</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
