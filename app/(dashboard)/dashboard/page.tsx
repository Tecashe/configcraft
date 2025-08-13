"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Wrench, Users, TrendingUp, Plus, ArrowUpRight, Activity, Zap, Target } from "lucide-react"
import Link from "next/link"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#444444] rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[#444444] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#E0E0E0] mb-2">Error Loading Dashboard</h2>
          <p className="text-[#B0B0B0]">{error}</p>
        </div>
      </div>
    )
  }

  const stats = data?.stats || {
    totalTools: 0,
    activeTools: 0,
    totalUsers: 0,
    monthlyUsage: 0,
  }

  const recentTools = data?.recentTools || []
  const usageData = data?.usageData || []

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#E0E0E0]">Dashboard</h1>
          <p className="text-[#B0B0B0] mt-1">Welcome back! Here's what's happening with your tools.</p>
        </div>
        <Link href="/tools/create">
          <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
            <Plus className="h-4 w-4 mr-2" />
            Create Tool
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#B0B0B0]">Total Tools</CardTitle>
            <Wrench className="h-4 w-4 text-[#888888]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E0E0E0]">{stats.totalTools}</div>
            <p className="text-xs text-[#B0B0B0]">
              <span className="text-green-400">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#B0B0B0]">Active Tools</CardTitle>
            <Activity className="h-4 w-4 text-[#888888]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E0E0E0]">{stats.activeTools}</div>
            <p className="text-xs text-[#B0B0B0]">
              <span className="text-green-400">+1</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#B0B0B0]">Team Members</CardTitle>
            <Users className="h-4 w-4 text-[#888888]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E0E0E0]">{stats.totalUsers}</div>
            <p className="text-xs text-[#B0B0B0]">
              <span className="text-blue-400">+3</span> new this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#B0B0B0]">Monthly Usage</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#888888]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E0E0E0]">{stats.monthlyUsage}%</div>
            <p className="text-xs text-[#B0B0B0]">
              <span className="text-green-400">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Chart */}
        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Usage Over Time</CardTitle>
            <CardDescription className="text-[#B0B0B0]">Tool usage in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                <XAxis dataKey="date" stroke="#B0B0B0" />
                <YAxis stroke="#B0B0B0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E1E1E",
                    border: "1px solid #444444",
                    borderRadius: "8px",
                    color: "#E0E0E0",
                  }}
                />
                <Line type="monotone" dataKey="usage" stroke="#888888" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Tools */}
        <Card className="bg-[#1E1E1E] border-[#444444]">
          <CardHeader>
            <CardTitle className="text-[#E0E0E0]">Recent Tools</CardTitle>
            <CardDescription className="text-[#B0B0B0]">Your latest created tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTools.length > 0 ? (
                recentTools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-[#2A2A2A]">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-[#888888] rounded-lg flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-[#121212]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#E0E0E0]">{tool.name}</p>
                        <p className="text-sm text-[#B0B0B0]">{tool.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={tool.status === "PUBLISHED" ? "default" : "secondary"}
                        className={
                          tool.status === "PUBLISHED" ? "bg-green-600 text-white" : "bg-[#444444] text-[#B0B0B0]"
                        }
                      >
                        {tool.status}
                      </Badge>
                      <Link href={`/tools/${tool.id}`}>
                        <Button variant="ghost" size="sm" className="text-[#888888] hover:text-[#E0E0E0]">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-[#444444] mx-auto mb-4" />
                  <p className="text-[#B0B0B0] mb-4">No tools created yet</p>
                  <Link href="/tools/create">
                    <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">Create Your First Tool</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#1E1E1E] border-[#444444]">
        <CardHeader>
          <CardTitle className="text-[#E0E0E0]">Quick Actions</CardTitle>
          <CardDescription className="text-[#B0B0B0]">Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/tools/create">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2 border-[#444444] hover:bg-[#444444] bg-transparent"
              >
                <Plus className="h-6 w-6 text-[#888888]" />
                <span className="text-[#E0E0E0]">Create New Tool</span>
              </Button>
            </Link>
            <Link href="/templates">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2 border-[#444444] hover:bg-[#444444] bg-transparent"
              >
                <Zap className="h-6 w-6 text-[#888888]" />
                <span className="text-[#E0E0E0]">Browse Templates</span>
              </Button>
            </Link>
            <Link href="/integrations">
              <Button
                variant="outline"
                className="w-full h-20 flex-col space-y-2 border-[#444444] hover:bg-[#444444] bg-transparent"
              >
                <Target className="h-6 w-6 text-[#888888]" />
                <span className="text-[#E0E0E0]">Setup Integrations</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
