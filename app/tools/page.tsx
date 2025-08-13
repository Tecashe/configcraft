// "use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Copy,
  Trash2,
  ExternalLink,
  Loader2,
  Wrench,
  Calendar,
  Users,
} from "lucide-react"
import Link from "next/link"

interface Tool {
  id: string
  name: string
  description: string
  status: string
  category: string
  createdAt: string
  updatedAt: string
  publishedUrl?: string
  _count?: {
    usageRecords: number
  }
}

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchTools()
  }, [])

  const fetchTools = async () => {
    try {
      const response = await fetch("/api/tools")
      if (response.ok) {
        const data = await response.json()
        setTools(data.tools || [])
      }
    } catch (error) {
      console.error("Failed to fetch tools:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-[#444444] text-[#B0B0B0]"
      case "GENERATING":
        return "bg-blue-900 text-blue-200"
      case "GENERATED":
        return "bg-green-900 text-green-200"
      case "PUBLISHED":
        return "bg-[#888888] text-[#121212]"
      case "ARCHIVED":
        return "bg-orange-900 text-orange-200"
      case "ERROR":
        return "bg-red-900 text-red-200"
      default:
        return "bg-[#444444] text-[#B0B0B0]"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "Draft"
      case "GENERATING":
        return "Generating..."
      case "GENERATED":
        return "Ready"
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

  const filteredTools = tools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const categories = ["all", ...Array.from(new Set(tools.map((tool) => tool.category)))]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#888888]" />
          <p className="text-[#B0B0B0]">Loading your tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <div className="border-b border-[#444444] bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-[#E0E0E0]">My Tools</h1>
              <p className="text-[#B0B0B0]">Manage and deploy your custom business tools</p>
            </div>
            <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]" asChild>
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
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0B0B0]" />
            <Input
              placeholder="Search tools by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#444444] border-[#444444] text-[#E0E0E0] placeholder-[#B0B0B0]"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-[#888888] text-[#121212]"
                    : "border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                }
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <Card className="bg-[#121212] border-[#444444]">
            <CardContent className="p-12 text-center">
              <Wrench className="w-16 h-16 text-[#888888] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#E0E0E0] mb-2">
                {searchTerm || selectedCategory !== "all" ? "No tools found" : "No tools yet"}
              </h3>
              <p className="text-[#B0B0B0] mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Create your first custom business tool to get started."}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Button className="bg-[#888888] hover:bg-[#666666] text-[#121212]" asChild>
                  <Link href="/tools/create">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Tool
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card
                key={tool.id}
                className="bg-[#121212] border-[#444444] hover:border-[#888888] transition-colors group"
              >
                <CardContent className="p-0">
                  {/* Tool Preview */}
                  <div className="aspect-video bg-[#444444] rounded-t-lg overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Wrench className="w-12 h-12 text-[#888888]" />
                    </div>
                    {tool.status === "PUBLISHED" && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-900 text-green-200">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Tool Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#E0E0E0] text-lg mb-1 line-clamp-1">{tool.name}</h3>
                        <p className="text-sm text-[#B0B0B0] mb-2">{tool.category}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#B0B0B0] hover:bg-[#444444] opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#121212] border-[#444444]">
                          <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]" asChild>
                            <Link href={`/tools/${tool.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {tool.status === "PUBLISHED" && tool.publishedUrl && (
                            <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]" asChild>
                              <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open Tool
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-[#E0E0E0] hover:bg-[#444444]">
                            <Copy className="w-4 h-4 mr-2" />
                            Clone
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:bg-red-900/20">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-[#B0B0B0] mb-4 line-clamp-2">
                      {tool.description || "No description available"}
                    </p>

                    {/* Status and Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                      <div className="flex items-center text-xs text-[#B0B0B0]">
                        <Users className="w-3 h-3 mr-1" />
                        {tool._count?.usageRecords || 0} uses
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center justify-between text-xs text-[#B0B0B0] mb-4">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created {new Date(tool.createdAt).toLocaleDateString()}
                      </div>
                      <div>Updated {new Date(tool.updatedAt).toLocaleDateString()}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-[#888888] hover:bg-[#666666] text-[#121212]" asChild>
                        <Link href={`/tools/${tool.id}`}>
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      {tool.status === "PUBLISHED" && tool.publishedUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                          asChild
                        >
                          <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
