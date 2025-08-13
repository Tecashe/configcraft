"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  status: "DRAFT" | "GENERATING" | "GENERATED" | "PUBLISHED" | "ERROR"
  generationStatus: "pending" | "generating" | "generated" | "error"
  createdAt: string
  updatedAt: string
  previewUrl?: string
  publishedUrl?: string
  generationError?: string
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/tools")
      if (response.ok) {
        const data = await response.json()
        setTools(data)
      }
    } catch (error) {
      console.error("Failed to fetch tools:", error)
      toast({
        title: "Error",
        description: "Failed to load tools",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (toolId: string) => {
    try {
      const response = await fetch(`/api/tools/${toolId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setTools(tools.filter((tool) => tool.id !== toolId))
        toast({
          title: "Tool Deleted",
          description: "Tool has been successfully deleted.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tool",
        variant: "destructive",
      })
    }
  }

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" && tool.status === "PUBLISHED") ||
      (activeTab === "draft" && tool.status === "DRAFT") ||
      (activeTab === "generating" && tool.status === "GENERATING")

    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: string, generationStatus: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "GENERATING":
        return <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <Clock className="h-4 w-4 text-[#888888]" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-600 text-white"
      case "GENERATING":
        return "bg-blue-600 text-white"
      case "GENERATED":
        return "bg-[#888888] text-[#121212]"
      case "ERROR":
        return "bg-red-600 text-white"
      default:
        return "bg-[#444444] text-[#B0B0B0]"
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#888888]" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#E0E0E0]">Tools</h1>
          <p className="text-[#B0B0B0] mt-1">Manage your custom business tools</p>
        </div>
        <Link href="/tools/create">
          <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
            <Plus className="h-4 w-4 mr-2" />
            Create Tool
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1E1E1E] border-[#444444] text-[#E0E0E0]"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[#1E1E1E] border-[#444444]">
          <TabsTrigger value="all" className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]">
            All Tools ({tools.length})
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
          >
            Published ({tools.filter((t) => t.status === "PUBLISHED").length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]">
            Draft ({tools.filter((t) => t.status === "DRAFT").length})
          </TabsTrigger>
          <TabsTrigger
            value="generating"
            className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
          >
            Generating ({tools.filter((t) => t.status === "GENERATING").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="bg-[#1E1E1E] border-[#444444] hover:border-[#888888] transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#E0E0E0] mb-1">{tool.name}</CardTitle>
                        <CardDescription className="text-[#B0B0B0] text-sm">{tool.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-[#B0B0B0] hover:text-[#E0E0E0]">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#1E1E1E] border-[#444444]">
                          <DropdownMenuItem asChild className="text-[#E0E0E0] hover:bg-[#444444]">
                            <Link href={`/tools/${tool.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {tool.previewUrl && (
                            <DropdownMenuItem asChild className="text-[#E0E0E0] hover:bg-[#444444]">
                              <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Preview
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(tool.id)}
                            className="text-red-400 hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs bg-[#444444] text-[#B0B0B0]">
                          {tool.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(tool.status, tool.generationStatus)}
                          <Badge className={`text-xs ${getStatusColor(tool.status)}`}>{tool.status}</Badge>
                        </div>
                      </div>

                      {tool.generationError && (
                        <div className="text-xs text-red-400 bg-red-950/20 p-2 rounded">{tool.generationError}</div>
                      )}

                      <div className="flex items-center justify-between text-xs text-[#B0B0B0]">
                        <span>Created {new Date(tool.createdAt).toLocaleDateString()}</span>
                        <span>Updated {new Date(tool.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/tools/${tool.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-[#444444] text-[#E0E0E0] hover:bg-[#444444] bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>
                        {tool.previewUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-[#444444] text-[#E0E0E0] hover:bg-[#444444] bg-transparent"
                          >
                            <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#444444] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#B0B0B0]" />
              </div>
              <h3 className="text-lg font-medium text-[#E0E0E0] mb-2">
                {searchQuery ? "No tools found" : "No tools yet"}
              </h3>
              <p className="text-[#B0B0B0] mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Create your first tool to get started"}
              </p>
              {!searchQuery && (
                <Link href="/tools/create">
                  <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Tool
                  </Button>
                </Link>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
