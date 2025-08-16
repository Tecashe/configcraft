"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import {
  BarChart3,
  Users,
  Zap,
  TrendingUp,
  Plus,
  Eye,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  ArrowUpRight,
  Activity,
  Sparkles,
  Target,
  Cpu,
  Workflow,
  Timer,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DashboardData {
  organization: {
    id: string
    name: string
    slug: string
    description?: string
    industry?: string
    size: string
  } | null
  stats: {
    tools: {
      total: number
      limit: number
      usagePercentage: number
      byStatus: {
        DRAFT: number
        GENERATING: number
        GENERATED: number
        PUBLISHED: number
        ERROR: number
        ARCHIVED: number
      }
    }
    members: {
      total: number
      limit: number
      usagePercentage: number
    }
    integrations: {
      total: number
    }
  }
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: string
    toolsLimit: number
    membersLimit: number
  }
  recentTools: Array<{
    id: string
    name: string
    description?: string
    status: string
    generationStatus: string
    createdAt: string
    category?: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    createdAt: string
    user?: {
      firstName?: string
      lastName?: string
      imageUrl?: string
    }
    tool?: {
      name: string
    }
    metadata?: any
  }>
  analytics: {
    toolsOverTime: Array<{ date: string; count: number }>
    usageByCategory: Array<{ category: string; count: number; percentage: number }>
    memberActivity: Array<{ date: string; active: number; total: number }>
    integrationHealth: Array<{ name: string; status: string; uptime: number }>
    performanceMetrics: {
      avgGenerationTime: number
      successRate: number
      errorRate: number
      totalRequests: number
    }
  }
  error?: string
}

export default function DashboardClientPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const orgSlug = params?.slug as string

  useEffect(() => {
    if (orgSlug) {
      fetchDashboardData()
    }
  }, [orgSlug])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/organizations/${orgSlug}/dashboard`)
      const dashboardData = await response.json()

      if (!response.ok) {
        throw new Error(dashboardData.error || "Failed to fetch dashboard data")
      }

      setData(dashboardData)
    } catch (err) {
      console.error("Dashboard fetch error:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4 text-emerald-400" />
      case "GENERATING":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
      case "ERROR":
        return <AlertTriangle className="h-4 w-4 text-red-400" />
      case "GENERATED":
        return <Eye className="h-4 w-4 text-purple-400" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "GENERATING":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "GENERATED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20"
      case "ERROR":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const formatActivityType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Chart configurations for dark theme
  const chartConfig = {
    tools: {
      label: "Tools",
      color: "hsl(var(--chart-1))",
    },
    usage: {
      label: "Usage",
      color: "hsl(var(--chart-2))",
    },
    members: {
      label: "Members",
      color: "hsl(var(--chart-3))",
    },
    performance: {
      label: "Performance",
      color: "hsl(var(--chart-4))",
    },
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
          <p className="text-sm text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-900">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2 text-white">Unable to Load Dashboard</h2>
            <p className="text-slate-400 mb-4">
              We're having trouble connecting to your organization data. This might be a temporary issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={fetchDashboardData} className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Try Again
              </Button>
              <Link href={`/${orgSlug}/tools/create`}>
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent">
                  Create Your First Tool
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-900">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Getting Started</h2>
          <p className="text-slate-400">Let's set up your organization dashboard.</p>
          <Link href={`/${orgSlug}/tools/create`}>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Tool
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Status distribution data for pie chart
  const statusData = data.stats?.tools?.byStatus
    ? [
        { name: "Published", value: data.stats.tools.byStatus.PUBLISHED, color: "#10b981" },
        { name: "Generated", value: data.stats.tools.byStatus.GENERATED, color: "#8b5cf6" },
        { name: "Generating", value: data.stats.tools.byStatus.GENERATING, color: "#3b82f6" },
        { name: "Draft", value: data.stats.tools.byStatus.DRAFT, color: "#64748b" },
        { name: "Error", value: data.stats.tools.byStatus.ERROR, color: "#ef4444" },
      ].filter((item) => item.value > 0)
    : []

  const isNearLimit = (data.stats?.tools?.usagePercentage || 0) > 80
  const organizationName = data.organization?.name || "Your Organization"

  return (
    <div className="space-y-6 animate-fade-in bg-slate-900 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Welcome back!</h1>
          <p className="text-slate-400">Here's what's happening with {organizationName} today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchDashboardData}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Link href={`/${orgSlug}/tools/create`}>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Tool</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Usage Alert */}
      {isNearLimit && (
        <Card className="border-orange-500/20 bg-orange-950/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-orange-200">Approaching Tool Limit</p>
                <p className="text-sm text-orange-300 mt-1">
                  You're using {data.stats.tools.total} of {data.stats.tools.limit} tools.{" "}
                  {data.subscription.plan === "FREE"
                    ? "Upgrade to create more tools."
                    : "Consider upgrading your plan."}
                </p>
              </div>
              <Link href={`/${orgSlug}/billing`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-500/30 text-orange-200 hover:bg-orange-950/70 bg-transparent"
                >
                  {data.subscription.plan === "FREE" ? "Upgrade Plan" : "View Billing"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Total Tools</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.tools.total}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">{data.stats.tools.limit - data.stats.tools.total} remaining</p>
              <Badge variant="secondary" className="text-xs bg-purple-500/10 text-purple-300 border-purple-500/20">
                {data.subscription.plan}
              </Badge>
            </div>
            <Progress value={data.stats.tools.usagePercentage} className="mt-2 h-1 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Team Members</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.members.total}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-slate-400">
                {data.stats.members.limit - data.stats.members.total} seats available
              </p>
            </div>
            <Progress value={data.stats.members.usagePercentage} className="mt-2 h-1 bg-slate-700" />
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Integrations</CardTitle>
            <Zap className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.integrations.total}</div>
            <p className="text-xs text-slate-400 mt-2">Connected services</p>
            <Link href={`/${orgSlug}/integrations`}>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">Published Tools</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{data.stats.tools.byStatus.PUBLISHED}</div>
            <p className="text-xs text-slate-400 mt-2">Live and accessible</p>
            <div className="mt-2 text-xs text-slate-400">
              {data.stats.tools.byStatus.GENERATING > 0 && (
                <span className="text-blue-400">{data.stats.tools.byStatus.GENERATING} generating</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualizations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tool Status Distribution */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-400" />
              Tool Status Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">Current status breakdown of all your tools</CardDescription>
          </CardHeader>
          <CardContent>
            {statusData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      contentStyle={{
                        backgroundColor: "rgb(30 41 59)",
                        border: "1px solid rgb(71 85 105)",
                        borderRadius: "8px",
                        color: "white",
                      }}
                    />
                    <Legend wrapperStyle={{ color: "rgb(148 163 184)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Target className="h-12 w-12 text-slate-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Ready to get started?</p>
                    <p className="text-xs text-slate-400 mb-4">Create your first tool to see insights here</p>
                  </div>
                  <Link href={`/${orgSlug}/tools/create`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Tool
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-400" />
              Performance Overview
            </CardTitle>
            <CardDescription className="text-slate-400">System performance and reliability metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Avg Generation Time</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {data.analytics.performanceMetrics.avgGenerationTime}s
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Success Rate</span>
                </div>
                <span className="text-sm font-medium text-emerald-400">
                  {data.analytics.performanceMetrics.successRate}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-sm text-slate-300">Error Rate</span>
                </div>
                <span className="text-sm font-medium text-red-400">{data.analytics.performanceMetrics.errorRate}%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Total Requests</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {data.analytics.performanceMetrics.totalRequests}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tools and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <span className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-purple-400" />
                Recent Tools
              </span>
              <Link href={`/${orgSlug}/tools`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <span className="hidden sm:inline">View All</span>
                  <ArrowUpRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription className="text-slate-400">Your latest tool creations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTools && data.recentTools.length > 0 ? (
                data.recentTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-3 border border-slate-700/50 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {getStatusIcon(tool.status)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate text-white">{tool.name}</p>
                        <p className="text-xs text-slate-400">
                          {tool.category && `${tool.category} • `}
                          {new Date(tool.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge className={cn("text-xs border", getStatusColor(tool.status))}>{tool.status}</Badge>
                      <Link href={`/${orgSlug}/tools/${tool.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white hover:bg-slate-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Sparkles className="h-12 w-12 text-slate-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium mb-1 text-white">Ready to build something amazing?</p>
                    <p className="text-xs text-slate-400 mb-4">
                      Create your first tool to get started with ConfigCraft
                    </p>
                  </div>
                  <Link href={`/${orgSlug}/tools/create`}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Tool
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-400" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-slate-400">Latest actions in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-slate-700/50 rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.user?.imageUrl ? (
                        <img
                          src={activity.user.imageUrl || "/placeholder.svg"}
                          alt="User"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <Activity className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200">
                        {activity.user?.firstName || "Someone"} {formatActivityType(activity.type).toLowerCase()}
                        {activity.tool && ` "${activity.tool.name}"`}
                      </p>
                      <p className="text-xs text-slate-400">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Clock className="h-12 w-12 text-slate-500 mx-auto" />
                  <div>
                    <p className="text-sm font-medium text-white">Activity will appear here</p>
                    <p className="text-xs text-slate-400">Start using ConfigCraft to see your team's activity</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-slate-400">Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href={`/${orgSlug}/tools/create`}>
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-purple-500/50 hover:text-white transition-all duration-200"
              >
                <Plus className="h-6 w-6 text-purple-400" />
                <span className="text-sm">Create New Tool</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/integrations`}>
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-emerald-500/50 hover:text-white transition-all duration-200"
              >
                <Zap className="h-6 w-6 text-emerald-400" />
                <span className="text-sm">Add Integration</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/settings`}>
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500/50 hover:text-white transition-all duration-200 sm:col-span-2 lg:col-span-1"
              >
                <Settings className="h-6 w-6 text-blue-400" />
                <span className="text-sm">Organization Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
