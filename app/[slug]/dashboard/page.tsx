
"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
  }
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
  } | null
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
}

export default function DashboardPage() {
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
      const response = await fetch(`/api/organizations/${orgSlug}/dashboard`)
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data")
      }
      const dashboardData = await response.json()
      setData(dashboardData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "GENERATING":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case "ERROR":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "GENERATED":
        return <Eye className="h-4 w-4 text-primary" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "GENERATING":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "GENERATED":
        return "bg-primary/10 text-primary border-primary/20"
      case "ERROR":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatActivityType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">No Data Available</h2>
          <p className="text-muted-foreground">Unable to load dashboard data.</p>
        </div>
      </div>
    )
  }

  const isNearLimit = data.stats.tools.usagePercentage > 80

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening with {data.organization.name} today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/${orgSlug}/tools/create`}>
            <Button className="focus-ring">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Tool</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Usage Alert */}
      {isNearLimit && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-orange-800 dark:text-orange-200">Approaching Tool Limit</p>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                  You're using {data.stats.tools.total} of {data.stats.tools.limit} tools.{" "}
                  {data.subscription?.plan === "FREE"
                    ? "Upgrade to create more tools."
                    : "Consider upgrading your plan."}
                </p>
              </div>
              <Link href={`/${orgSlug}/billing`}>
                <Button variant="outline" size="sm" className="bg-transparent focus-ring">
                  {data.subscription?.plan === "FREE" ? "Upgrade Plan" : "View Billing"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.tools.total}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {data.stats.tools.limit - data.stats.tools.total} remaining
              </p>
              <Badge variant="secondary" className="text-xs">
                {data.subscription?.plan || "FREE"}
              </Badge>
            </div>
            <Progress value={data.stats.tools.usagePercentage} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.members.total}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                {data.stats.members.limit - data.stats.members.total} seats available
              </p>
            </div>
            <Progress value={data.stats.members.usagePercentage} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.integrations.total}</div>
            <p className="text-xs text-muted-foreground mt-2">Connected services</p>
            <Link href={`/${orgSlug}/integrations`}>
              <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent focus-ring">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Tools</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.tools.byStatus.PUBLISHED}</div>
            <p className="text-xs text-muted-foreground mt-2">Live and accessible</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {data.stats.tools.byStatus.GENERATING > 0 && (
                <span>{data.stats.tools.byStatus.GENERATING} generating</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tools and Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Tools</span>
              <Link href={`/${orgSlug}/tools`}>
                <Button variant="outline" size="sm" className="bg-transparent focus-ring">
                  <span className="hidden sm:inline">View All</span>
                  <ArrowUpRight className="h-4 w-4 sm:ml-1" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>Your latest tool creations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentTools.length > 0 ? (
                data.recentTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {getStatusIcon(tool.status)}
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tool.category && `${tool.category} • `}
                          {new Date(tool.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Badge className={cn("text-xs border", getStatusColor(tool.status))}>{tool.status}</Badge>
                      <Link href={`/${orgSlug}/tools/${tool.id}`}>
                        <Button variant="ghost" size="sm" className="focus-ring">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-sm font-medium mb-1">No tools created yet</p>
                    <p className="text-xs text-muted-foreground mb-4">Create your first tool to get started</p>
                  </div>
                  <Link href={`/${orgSlug}/tools/create`}>
                    <Button size="sm" className="focus-ring">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Tool
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      {activity.user?.imageUrl ? (
                        <img
                          src={activity.user.imageUrl || "/placeholder.svg"}
                          alt="User"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <Activity className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground">
                        {activity.user?.firstName || "Someone"} {formatActivityType(activity.type).toLowerCase()}
                        {activity.tool && ` "${activity.tool.name}"`}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 space-y-4">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-sm font-medium">No recent activity</p>
                    <p className="text-xs text-muted-foreground">Activity will appear here as you use the platform</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href={`/${orgSlug}/tools/create`}>
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 bg-transparent hover:bg-accent focus-ring"
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm">Create New Tool</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/integrations`}>
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 bg-transparent hover:bg-accent focus-ring"
              >
                <Zap className="h-6 w-6" />
                <span className="text-sm">Add Integration</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/settings`}>
              <Button
                variant="outline"
                className="w-full h-20 flex flex-col space-y-2 bg-transparent hover:bg-accent focus-ring sm:col-span-2 lg:col-span-1"
              >
                <Settings className="h-6 w-6" />
                <span className="text-sm">Organization Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

