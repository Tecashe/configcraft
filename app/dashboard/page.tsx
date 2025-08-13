"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Wrench,
  LayoutTemplateIcon as Template,
  Puzzle,
  Settings,
  CreditCard,
  Plus,
  MoreHorizontal,
  TrendingUp,
  Users,
  Activity,
  Copy,
  BarChart3,
  UserPlus,
  Search,
  Bell,
  Loader2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { UserButton } from "@/components/auth/user-button"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useUser()
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading dashboard: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const userData = {
    name: user?.fullName || `${user?.firstName} ${user?.lastName}` || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    company: "Your Company", // Will be updated with real company data
    avatar: user?.imageUrl || "",
  }

  const stats = data?.stats || {
    toolsCount: 0,
    membersCount: 0,
    usageThisMonth: 0,
    subscription: "FREE",
  }

  const recentTools = data?.recentTools || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800"
      case "GENERATED":
        return "bg-blue-100 text-blue-800"
      case "PUBLISHED":
        return "bg-green-100 text-green-800"
      case "ARCHIVED":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Draft"
      case "GENERATED":
        return "Ready for Review"
      case "PUBLISHED":
        return "Live"
      case "ARCHIVED":
        return "Archived"
      default:
        return status
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "tools", label: "My Tools", icon: Wrench, href: "/tools" },
    { id: "templates", label: "Templates", icon: Template, href: "/templates" },
    { id: "integrations", label: "Integrations", icon: Puzzle, href: "/integrations" },
    { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
    { id: "billing", label: "Billing", icon: CreditCard, href: "/billing" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ConfigCraft</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-2">
            <UserButton />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-gray-900">{userData.name}</p>
              <p className="text-xs text-gray-500">{userData.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {userData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search tools..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                asChild
              >
                <Link href="/tools/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Tool
                </Link>
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to {userData.company}!</h2>
              <p className="text-purple-100 mb-4">
                You've created {stats.toolsCount} custom tools and have {stats.membersCount} team members. Current plan:{" "}
                {stats.subscription}
              </p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                <Link href="/tools/create">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your Next Tool
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tools Created</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.toolsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{stats.usageThisMonth} this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.membersCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-gray-600">Active members</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Plan</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.subscription}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/billing">Manage Plan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tools */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Tools</h3>
              <Button variant="outline" size="sm" asChild>
                <Link href="/tools">View All Tools</Link>
              </Button>
            </div>

            {recentTools.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No tools yet</h4>
                  <p className="text-gray-600 mb-4">Create your first custom business tool to get started.</p>
                  <Button asChild>
                    <Link href="/tools/create">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Tool
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTools.map((tool: any) => (
                  <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt={tool.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 line-clamp-1">{tool.name}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Copy className="w-4 h-4 mr-2" />
                                Clone Tool
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Manage Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Users className="w-3 h-3 mr-1" />
                            {tool._count?.usageRecords || 0} uses
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Updated {new Date(tool.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Create Tool</h4>
                  <p className="text-sm text-gray-600">Build a new custom tool</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Template className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Browse Templates</h4>
                  <p className="text-sm text-gray-600">Start from a template</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Invite Team</h4>
                  <p className="text-sm text-gray-600">Add team members</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Puzzle className="w-6 h-6 text-orange-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Integrations</h4>
                  <p className="text-sm text-gray-600">Connect your tools</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
