"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
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
  Wrench,
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
  const params = useParams()
  const orgSlug = params?.slug as string

  useEffect(() => {
    if (orgSlug) {
      fetchTools()
    }
  }, [orgSlug])

  const fetchTools = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools`)
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
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
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
        return <CheckCircle className="h-4 w-4 text-status-success" />
      case "GENERATING":
        return <Loader2 className="h-4 w-4 text-status-info animate-spin" />
      case "ERROR":
        return <AlertCircle className="h-4 w-4 text-status-error" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-status-success text-white"
      case "GENERATING":
        return "bg-status-info text-white"
      case "GENERATED":
        return "bg-primary text-primary-foreground"
      case "ERROR":
        return "bg-status-error text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="p-4 lg:p-6">
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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tools</h1>
          <p className="text-muted-foreground mt-1">Manage your custom business tools</p>
        </div>
        <Link href={`/${orgSlug}/tools/create`}>
          <Button className="config-button-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Tool
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Tools ({tools.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({tools.filter((t) => t.status === "PUBLISHED").length})
          </TabsTrigger>
          <TabsTrigger value="draft">Draft ({tools.filter((t) => t.status === "DRAFT").length})</TabsTrigger>
          <TabsTrigger value="generating">
            Generating ({tools.filter((t) => t.status === "GENERATING").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <Card key={tool.id} className="config-card hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-foreground mb-1">{tool.name}</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">{tool.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/${orgSlug}/tools/${tool.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {tool.previewUrl && (
                            <DropdownMenuItem asChild>
                              <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Preview
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(tool.id)} className="text-status-error">
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
                        <Badge variant="secondary" className="text-xs">
                          {tool.category}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(tool.status, tool.generationStatus)}
                          <Badge className={`text-xs ${getStatusColor(tool.status)}`}>{tool.status}</Badge>
                        </div>
                      </div>

                      {tool.generationError && (
                        <div className="text-xs text-status-error bg-status-error/10 p-2 rounded">
                          {tool.generationError}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Created {new Date(tool.createdAt).toLocaleDateString()}</span>
                        <span>Updated {new Date(tool.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex space-x-2">
                        <Link href={`/${orgSlug}/tools/${tool.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full bg-transparent">
                            View Details
                          </Button>
                        </Link>
                        {tool.previewUrl && (
                          <Button variant="outline" size="sm" asChild>
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
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                {searchQuery ? (
                  <Search className="w-8 h-8 text-muted-foreground" />
                ) : (
                  <Wrench className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? "No tools found" : "No tools yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "Try adjusting your search terms" : "Create your first tool to get started"}
              </p>
              {!searchQuery && (
                <Link href={`/${orgSlug}/tools/create`}>
                  <Button className="config-button-primary">
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
