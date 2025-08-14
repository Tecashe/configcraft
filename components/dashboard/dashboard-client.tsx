// "use client"

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
  Sparkles,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { UserButton } from "@/components/auth/user-button"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface RecentTool {
  id: string
  name: string
  description: string | null
  category: string | null
  status: string
  createdAt: Date
  updatedAt: Date
  usageRecords: number
}

interface UsageData {
  date: string
  usage: number
}

interface DashboardClientProps {
  organizationSlug: string
  organizationName: string
  stats: {
    toolsCount: number
    membersCount: number
    usageThisMonth: number
    subscription: string
  }
  recentTools: RecentTool[]
  usageData: UsageData[]
}

export function DashboardClient({
  organizationSlug,
  organizationName,
  stats,
  recentTools,
  usageData,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user } = useUser()

  const userData = {
    name: user?.fullName || `${user?.firstName} ${user?.lastName}` || "User",
    email: user?.primaryEmailAddress?.emailAddress || "",
    company: organizationName,
    avatar: user?.imageUrl || "",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-600 text-slate-200"
      case "GENERATING":
        return "bg-blue-600 text-blue-100"
      case "GENERATED":
        return "bg-green-600 text-green-100"
      case "PUBLISHED":
        return "bg-purple-600 text-purple-100"
      case "ARCHIVED":
        return "bg-orange-600 text-orange-100"
      case "ERROR":
        return "bg-red-600 text-red-100"
      default:
        return "bg-slate-600 text-slate-200"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Draft"
      case "GENERATING":
        return "Generating..."
      case "GENERATED":
        return "Ready for Review"
      case "PUBLISHED":
        return "Live"
      case "ARCHIVED":
        return "Archived"
      case "ERROR":
        return "Error"
      default:
        return status
    }
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: `/${organizationSlug}/dashboard` },
    { id: "tools", label: "My Tools", icon: Wrench, href: `/${organizationSlug}/tools` },
    { id: "templates", label: "Templates", icon: Template, href: `/${organizationSlug}/templates` },
    { id: "integrations", label: "Integrations", icon: Puzzle, href: `/${organizationSlug}/integrations` },
    { id: "settings", label: "Settings", icon: Settings, href: `/${organizationSlug}/settings` },
    { id: "billing", label: "Billing", icon: CreditCard, href: `/${organizationSlug}/billing` },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900/80 border-r border-slate-700 flex flex-col backdrop-blur-xl">
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-sm font-bold">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ConfigCraft
            </span>
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
                      ? "bg-slate-800 text-white border border-slate-600"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 p-2">
            <UserButton />
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-white">{userData.name}</p>
              <p className="text-xs text-slate-400">{userData.company}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-slate-900/80 border-b border-slate-700 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400">Welcome back, {userData.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search tools..."
                  className="pl-10 w-64 bg-slate-800 border-slate-600 text-white placeholder-slate-400"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                <Bell className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                asChild
              >
                <Link href={`/${organizationSlug}/tools/create`}>
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Welcome to {userData.company}!</h2>
              <p className="text-blue-100 mb-4">
                You've created {stats.toolsCount} custom tools and have {stats.membersCount} team members. Current plan:{" "}
                {stats.subscription}
              </p>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link href={`/${organizationSlug}/tools/create`}>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Tool
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Tools Created</p>
                    <p className="text-3xl font-bold text-white">{stats.toolsCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Wrench className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-green-400">{stats.usageThisMonth} this month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Team Members</p>
                    <p className="text-3xl font-bold text-white">{stats.membersCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <span className="text-slate-400">Active members</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">Current Plan</p>
                    <p className="text-3xl font-bold text-white">{stats.subscription}</p>
                  </div>
                  <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    asChild
                  >
                    <Link href={`/${organizationSlug}/billing`}>Manage Plan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Usage Chart */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Usage Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgb(71 85 105)" />
                      <XAxis dataKey="date" stroke="rgb(148 163 184)" fontSize={12} />
                      <YAxis stroke="rgb(148 163 184)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgb(30 41 59)",
                          border: "1px solid rgb(71 85 105)",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="usage"
                        stroke="rgb(59 130 246)"
                        strokeWidth={2}
                        dot={{ fill: "rgb(59 130 246)", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">New tool created</p>
                      <p className="text-xs text-slate-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Team member invited</p>
                      <p className="text-xs text-slate-400">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-white">Tool published</p>
                      <p className="text-xs text-slate-400">2 days ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Tools */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Recent Tools</h3>
              <Button
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                asChild
              >
                <Link href={`/${organizationSlug}/tools`}>View All Tools</Link>
              </Button>
            </div>

            {recentTools.length === 0 ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-8 text-center">
                  <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">Ready to build your first tool?</h4>
                  <p className="text-slate-400 mb-4">
                    Create custom business tools in minutes with AI. Just describe what you need, and we'll build it for
                    you.
                  </p>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    asChild
                  >
                    <Link href={`/${organizationSlug}/tools/create`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Tool
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTools.map((tool) => (
                  <Card
                    key={tool.id}
                    className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer"
                  >
                    <CardContent className="p-0">
                      <div className="aspect-video bg-slate-700 rounded-t-lg overflow-hidden">
                        <img
                          src="/placeholder.svg?height=120&width=200"
                          alt={tool.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white line-clamp-1">{tool.name}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:bg-slate-700"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem className="text-white hover:bg-slate-700">
                                <Copy className="w-4 h-4 mr-2" />
                                Clone Tool
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-slate-700">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                View Analytics
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-slate-700">
                                <UserPlus className="w-4 h-4 mr-2" />
                                Manage Team
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{tool.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                          <div className="flex items-center text-xs text-slate-400">
                            <Users className="w-3 h-3 mr-1" />
                            {tool.usageRecords || 0} uses
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
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
            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href={`/${organizationSlug}/tools/create`}>
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Create Tool</h4>
                    <p className="text-sm text-slate-400">Build a new custom tool</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/${organizationSlug}/templates`}>
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Template className="w-6 h-6 text-purple-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Browse Templates</h4>
                    <p className="text-sm text-slate-400">Start from a template</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/${organizationSlug}/settings`}>
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <UserPlus className="w-6 h-6 text-green-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Invite Team</h4>
                    <p className="text-sm text-slate-400">Add team members</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href={`/${organizationSlug}/integrations`}>
                <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Puzzle className="w-6 h-6 text-orange-400" />
                    </div>
                    <h4 className="font-semibold text-white mb-1">Integrations</h4>
                    <p className="text-sm text-slate-400">Connect your tools</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
