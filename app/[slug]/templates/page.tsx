"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Eye,
  Star,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  Heart,
  FileText,
  Clock,
  TrendingUp,
  Play,
  Loader2,
} from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: any
  difficulty: string
  setupTime: string
  rating: number
  uses: number
  features: string[]
  preview: string
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const params = useParams()
  const orgSlug = params?.slug as string

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch("/api/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error("Failed to fetch templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: "all", label: "All Templates", count: templates.length, icon: FileText },
    {
      id: "sales",
      label: "Sales & CRM",
      count: templates.filter((t) => t.category === "sales").length,
      icon: TrendingUp,
    },
    { id: "hr", label: "HR & People", count: templates.filter((t) => t.category === "hr").length, icon: Users },
    {
      id: "operations",
      label: "Operations",
      count: templates.filter((t) => t.category === "operations").length,
      icon: Briefcase,
    },
    {
      id: "finance",
      label: "Finance",
      count: templates.filter((t) => t.category === "finance").length,
      icon: DollarSign,
    },
    {
      id: "project",
      label: "Project Mgmt",
      count: templates.filter((t) => t.category === "project").length,
      icon: Calendar,
    },
  ]

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || template.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-status-success text-white"
      case "Medium":
        return "bg-status-warning text-white"
      case "Hard":
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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Template Library</h1>
          <p className="text-muted-foreground mt-1">Start with pre-built templates for common business processes</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {templates.length} Templates
          </Badge>
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
        {/* Search and Categories */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full lg:w-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                <category.icon className="w-3 h-3 mr-1" />
                {category.label}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Popular Templates */}
        <Card className="config-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Most Popular Templates</h3>
                <p className="text-sm text-muted-foreground">Templates used by thousands of businesses</p>
              </div>
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {templates
                .sort((a, b) => b.uses - a.uses)
                .slice(0, 3)
                .map((template) => (
                  <div key={template.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <template.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{template.name}</h4>
                        <p className="text-xs text-muted-foreground">{template.uses.toLocaleString()} uses</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="config-card hover:border-primary/50 transition-colors">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                      <img
                        src={template.preview || "/placeholder.svg?height=200&width=300"}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <template.icon className="w-5 h-5 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                        </div>
                        <Badge className={getDifficultyColor(template.difficulty)} variant="secondary">
                          {template.difficulty}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{template.description}</p>

                      <div className="flex items-center justify-between mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-status-warning mr-1" />
                            {template.rating}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {template.uses.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {template.setupTime}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-foreground mb-2">Features</h4>
                          <div className="flex flex-wrap gap-1">
                            {template.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {template.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{template.features.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={`/${orgSlug}/templates/${template.id}`}>
                              <Eye className="w-3 h-3 mr-2" />
                              Preview
                            </Link>
                          </Button>
                          <Button size="sm" className="flex-1 config-button-primary" asChild>
                            <Link href={`/${orgSlug}/tools/create?template=${template.id}`}>
                              <Play className="w-3 h-3 mr-2" />
                              Use Template
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
                <p className="text-muted-foreground">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
