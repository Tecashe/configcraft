// import { auth } from "@clerk/nextjs/server"
// import { redirect } from "next/navigation"
// import { prisma } from "@/lib/prisma"
// import { DashboardClient } from "@/components/dashboard/dashboard-client"

// interface OrganizationDashboardPageProps {
//   params: {
//     slug: string
//   }
// }

// export default async function OrganizationDashboardPage({ params }: OrganizationDashboardPageProps) {
//   const { userId } = await auth()

//   if (!userId) {
//     redirect("/auth/signin")
//   }

//   // Get organization and verify user access
//   const organization = await prisma.organization.findUnique({
//     where: { slug: params.slug },
//     include: {
//       members: {
//         where: { userId, status: "ACTIVE" },
//       },
//       tools: {
//         take: 6,
//         orderBy: { updatedAt: "desc" },
//         include: {
//           _count: {
//             select: { usageRecords: true },
//           },
//         },
//       },
//       _count: {
//         select: {
//           members: true,
//           tools: true,
//         },
//       },
//     },
//   })

//   if (!organization || organization.members.length === 0) {
//     redirect("/onboarding")
//   }

//   // Get subscription info
//   const subscription = await prisma.subscription.findUnique({
//     where: { organizationId: organization.id },
//   })

//   // Get usage stats
//   const usageThisMonth = await prisma.usageRecord.count({
//     where: {
//       organizationId: organization.id,
//       createdAt: {
//         gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
//       },
//     },
//   })

//   const stats = {
//     toolsCount: organization._count.tools,
//     membersCount: organization._count.members,
//     usageThisMonth,
//     subscription: subscription?.plan || "FREE",
//   }

//   // Transform tools data to match expected interface
//   const recentTools = organization.tools.map((tool) => ({
//     id: tool.id,
//     name: tool.name,
//     description: tool.description,
//     category: tool.category,
//     status: tool.status,
//     createdAt: tool.createdAt,
//     updatedAt: tool.updatedAt,
//     usageRecords: tool._count.usageRecords,
//   }))

//   // Generate sample usage data (replace with real data from your analytics)
//   const usageData = Array.from({ length: 30 }, (_, i) => ({
//     date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
//     usage: Math.floor(Math.random() * 100) + 20,
//   }))

//   return (
//     <DashboardClient
//       organizationSlug={organization.slug}
//       organizationName={organization.name}
//       stats={stats}
//       recentTools={recentTools}
//       usageData={usageData}
//     />
//   )
// }


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
} from "lucide-react"
import Link from "next/link"

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
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800"
      case "GENERATING":
        return "bg-blue-100 text-blue-800"
      case "GENERATED":
        return "bg-primary/10 text-primary"
      case "ERROR":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Try Again</Button>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Unable to load dashboard data.</p>
        </div>
      </div>
    )
  }

  const isNearLimit = data.stats.tools.usagePercentage > 80

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">Here's what's happening with {data.organization.name} today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href={`/${orgSlug}/tools/create`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Tool
            </Button>
          </Link>
        </div>
      </div>

      {/* Usage Alert */}
      {isNearLimit && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium text-orange-800">Approaching Tool Limit</p>
                <p className="text-sm text-orange-700">
                  You're using {data.stats.tools.total} of {data.stats.tools.limit} tools.{" "}
                  {data.subscription?.plan === "FREE"
                    ? "Upgrade to create more tools."
                    : "Consider upgrading your plan."}
                </p>
              </div>
              <Link href={`/${orgSlug}/billing`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  {data.subscription?.plan === "FREE" ? "Upgrade Plan" : "View Billing"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
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

        <Card>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integrations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.integrations.total}</div>
            <p className="text-xs text-muted-foreground mt-2">Connected services</p>
            <Link href={`/${orgSlug}/integrations`}>
              <Button variant="outline" size="sm" className="mt-2 w-full bg-transparent">
                Manage
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Tools
              <Link href={`/${orgSlug}/tools`}>
                <Button variant="outline" size="sm" className="bg-transparent">
                  View All
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>Your latest tool creations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentTools.length > 0 ? (
                data.recentTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(tool.status)}
                      <div>
                        <p className="font-medium text-sm">{tool.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tool.category} • {new Date(tool.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getStatusColor(tool.status)}`}>{tool.status}</Badge>
                      <Link href={`/${orgSlug}/tools/${tool.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">No tools created yet</p>
                  <Link href={`/${orgSlug}/tools/create`}>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Tool
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.length > 0 ? (
                data.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 text-sm">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      {activity.user?.imageUrl ? (
                        <img
                          src={activity.user.imageUrl || "/placeholder.svg"}
                          alt="User"
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">
                        {activity.user?.firstName || "Someone"} {formatActivityType(activity.type).toLowerCase()}
                        {activity.tool && ` "${activity.tool.name}"`}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/${orgSlug}/tools/create`}>
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <Plus className="h-6 w-6" />
                <span>Create New Tool</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/integrations`}>
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <Zap className="h-6 w-6" />
                <span>Add Integration</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/settings`}>
              <Button variant="outline" className="w-full h-20 flex flex-col space-y-2 bg-transparent">
                <Settings className="h-6 w-6" />
                <span>Organization Settings</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
