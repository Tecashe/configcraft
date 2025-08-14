"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Wrench, Users, TrendingUp, Plus, ArrowUpRight, Activity, Zap, Target, Loader2 } from "lucide-react"

interface DashboardStats {
  totalTools: number
  activeTools: number
  totalUsers: number
  monthlyUsage: number
}

interface RecentTool {
  id: string
  name: string
  category: string
  status: string
  createdAt: string
}

interface UsageData {
  date: string
  usage: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTools, setRecentTools] = useState<RecentTool[]>([])
  const [usageData, setUsageData] = useState<UsageData[]>([])
  const [loading, setLoading] = useState(true)
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
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentTools(data.recentTools)
        setUsageData(data.usageData)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your tools.</p>
        </div>
        <Link href={`/${orgSlug}/tools/create`}>
          <Button className="config-button-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Tool
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="config-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tools</CardTitle>
            <Wrench className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.totalTools || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-status-success">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="config-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Tools</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.activeTools || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-status-success">+1</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="config-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Team Members</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-status-info">+3</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card className="config-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.monthlyUsage || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-status-success">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card className="config-card">
          <CardHeader>
            <CardTitle className="text-foreground">Usage Over Time</CardTitle>
            <CardDescription className="text-muted-foreground">Tool usage in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line type="monotone" dataKey="usage" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Tools */}
        <Card className="config-card">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Tools</CardTitle>
            <CardDescription className="text-muted-foreground">Your latest created tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTools.length > 0 ? (
                recentTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tool.name}</p>
                        <p className="text-sm text-muted-foreground">{tool.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={tool.status === "PUBLISHED" ? "default" : "secondary"}
                        className={
                          tool.status === "PUBLISHED"
                            ? "bg-status-success text-white"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {tool.status}
                      </Badge>
                      <Link href={`/${orgSlug}/tools/${tool.id}`}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-foreground">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No tools created yet</p>
                  <Link href={`/${orgSlug}/tools/create`}>
                    <Button className="config-button-primary">Create Your First Tool</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="config-card">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
          <CardDescription className="text-muted-foreground">Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href={`/${orgSlug}/tools/create`}>
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2 border-border hover:bg-muted bg-transparent"
              >
                <Plus className="h-6 w-6 text-primary" />
                <span className="text-foreground">Create New Tool</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/templates`}>
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2 border-border hover:bg-muted bg-transparent"
              >
                <Zap className="h-6 w-6 text-primary" />
                <span className="text-foreground">Browse Templates</span>
              </Button>
            </Link>
            <Link href={`/${orgSlug}/integrations`}>
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2 border-border hover:bg-muted bg-transparent"
              >
                <Target className="h-6 w-6 text-primary" />
                <span className="text-foreground">Setup Integrations</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
