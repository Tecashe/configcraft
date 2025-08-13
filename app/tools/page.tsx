"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Archive,
  Trash2,
  Users,
  BarChart3,
  ArrowUpDown,
  Download,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("modified")
  const [viewMode, setViewMode] = useState("grid") // grid or list

  // Mock data
  const tools = [
    {
      id: 1,
      name: "Customer Onboarding Tracker",
      description: "Track leads through the sales pipeline with team collaboration",
      status: "published",
      lastModified: "2 hours ago",
      created: "2024-01-15",
      users: 8,
      views: 245,
      thumbnail: "/placeholder.svg?height=120&width=200",
      owner: "John Doe",
      team: ["john@acme.com", "sarah@acme.com", "mike@acme.com"],
    },
    {
      id: 2,
      name: "Inventory Management",
      description: "Manage product inventory and stock levels with approval workflows",
      status: "generated",
      lastModified: "1 day ago",
      created: "2024-01-12",
      users: 5,
      views: 89,
      thumbnail: "/placeholder.svg?height=120&width=200",
      owner: "Sarah Johnson",
      team: ["sarah@acme.com", "lisa@acme.com"],
    },
    {
      id: 3,
      name: "Employee Expense Reports",
      description: "Submit and approve expense reports with automated workflows",
      status: "draft",
      lastModified: "3 days ago",
      created: "2024-01-10",
      users: 0,
      views: 12,
      thumbnail: "/placeholder.svg?height=120&width=200",
      owner: "Mike Davis",
      team: ["mike@acme.com"],
    },
    {
      id: 4,
      name: "Project Task Board",
      description: "Kanban-style project management with time tracking",
      status: "published",
      lastModified: "1 week ago",
      created: "2024-01-05",
      users: 12,
      views: 567,
      thumbnail: "/placeholder.svg?height=120&width=200",
      owner: "Lisa Chen",
      team: ["lisa@acme.com", "john@acme.com", "sarah@acme.com", "mike@acme.com"],
    },
    {
      id: 5,
      name: "Client Feedback Portal",
      description: "Collect and manage client feedback with automated responses",
      status: "archived",
      lastModified: "2 weeks ago",
      created: "2023-12-20",
      users: 3,
      views: 156,
      thumbnail: "/placeholder.svg?height=120&width=200",
      owner: "John Doe",
      team: ["john@acme.com", "sarah@acme.com"],
    },
    {
      id: 6,
      name: "Asset Tracking System",
      description: "Track company assets and equipment with maintenance schedules",
      status: "generated",
      lastModified: "3 weeks ago",
      created: "2023-12-15",
      users: 0,
      views: 34,
      thumbnail: "/placeholder.svg?height=120&width=200",
      owner: "Sarah Johnson",
      team: ["sarah@acme.com"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "generated":
        return "bg-blue-100 text-blue-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "archived":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft"
      case "generated":
        return "Ready for Review"
      case "published":
        return "Live"
      case "archived":
        return "Archived"
      default:
        return status
    }
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || tool.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Tools</h1>
              <p className="text-gray-600 mt-1">Manage and monitor your custom business tools</p>
            </div>
            <Button
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
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="generated">Ready for Review</SelectItem>
                <SelectItem value="published">Live</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modified">Last Modified</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Card key={tool.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={tool.thumbnail || "/placeholder.svg"}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{tool.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tool.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/tools/${tool.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Tool
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Clone Tool
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {tool.users} users
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Updated {tool.lastModified}</span>
                    <span>{tool.views} views</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="w-6 h-6 mr-2">
                        <AvatarFallback className="text-xs bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                          {tool.owner
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600">{tool.owner}</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/tools/${tool.id}`}>
                          <BarChart3 className="w-3 h-3 mr-1" />
                          Analytics
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/tools/${tool.id}/settings`}>
                          <Settings className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first custom business tool to get started"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                asChild
              >
                <Link href="/tools/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Tool
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
