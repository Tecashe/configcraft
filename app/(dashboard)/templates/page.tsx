"use client"

import { useState } from "react"
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
  BarChart3,
  Heart,
  Package,
  FileText,
  Clock,
  TrendingUp,
  Play,
} from "lucide-react"
import Link from "next/link"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const templates = [
    // Sales & CRM
    {
      id: "lead-tracker",
      name: "Lead Tracking System",
      description: "Track leads from initial contact through deal closure with pipeline management",
      category: "sales",
      icon: TrendingUp,
      difficulty: "Easy",
      setupTime: "15 min",
      rating: 4.8,
      uses: 1247,
      features: ["Contact management", "Deal stages", "Follow-up reminders", "Team collaboration"],
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "pipeline-manager",
      name: "Sales Pipeline Manager",
      description: "Comprehensive sales pipeline with forecasting and reporting capabilities",
      category: "sales",
      icon: BarChart3,
      difficulty: "Medium",
      setupTime: "25 min",
      rating: 4.9,
      uses: 892,
      features: ["Pipeline visualization", "Sales forecasting", "Performance metrics", "Custom stages"],
      preview: "/placeholder.svg?height=200&width=300",
    },

    // HR & People
    {
      id: "employee-onboarding",
      name: "Employee Onboarding",
      description: "Streamline new hire onboarding with checklists and document management",
      category: "hr",
      icon: Users,
      difficulty: "Easy",
      setupTime: "20 min",
      rating: 4.7,
      uses: 634,
      features: ["Onboarding checklist", "Document upload", "Task assignments", "Progress tracking"],
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "performance-reviews",
      name: "Performance Review System",
      description: "Conduct structured performance reviews with goal tracking and feedback",
      category: "hr",
      icon: Star,
      difficulty: "Medium",
      setupTime: "30 min",
      rating: 4.6,
      uses: 445,
      features: ["Review templates", "Goal setting", "360-degree feedback", "Performance analytics"],
      preview: "/placeholder.svg?height=200&width=300",
    },

    // Operations
    {
      id: "inventory-management",
      name: "Inventory Management",
      description: "Track stock levels, manage suppliers, and automate reorder processes",
      category: "operations",
      icon: Package,
      difficulty: "Medium",
      setupTime: "35 min",
      rating: 4.8,
      uses: 756,
      features: ["Stock tracking", "Supplier management", "Reorder alerts", "Inventory reports"],
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "asset-tracking",
      name: "Asset Tracking System",
      description: "Monitor company assets, maintenance schedules, and depreciation",
      category: "operations",
      icon: Briefcase,
      difficulty: "Hard",
      setupTime: "45 min",
      rating: 4.5,
      uses: 323,
      features: ["Asset registry", "Maintenance tracking", "Depreciation calc", "QR code labels"],
      preview: "/placeholder.svg?height=200&width=300",
    },

    // Finance
    {
      id: "expense-reporting",
      name: "Expense Report System",
      description: "Submit, approve, and track employee expenses with receipt management",
      category: "finance",
      icon: DollarSign,
      difficulty: "Easy",
      setupTime: "18 min",
      rating: 4.7,
      uses: 1089,
      features: ["Receipt upload", "Approval workflow", "Expense categories", "Reimbursement tracking"],
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "budget-tracker",
      name: "Budget Tracking Tool",
      description: "Monitor departmental budgets with spending alerts and variance analysis",
      category: "finance",
      icon: BarChart3,
      difficulty: "Medium",
      setupTime: "28 min",
      rating: 4.6,
      uses: 567,
      features: ["Budget planning", "Spending alerts", "Variance reports", "Multi-department"],
      preview: "/placeholder.svg?height=200&width=300",
    },

    // Project Management
    {
      id: "task-board",
      name: "Project Task Board",
      description: "Kanban-style project management with time tracking and team collaboration",
      category: "project",
      icon: Calendar,
      difficulty: "Easy",
      setupTime: "12 min",
      rating: 4.9,
      uses: 1456,
      features: ["Kanban boards", "Time tracking", "Team assignments", "Progress reports"],
      preview: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "time-tracking",
      name: "Time Tracking System",
      description: "Track project time, generate timesheets, and analyze productivity",
      category: "project",
      icon: Clock,
      difficulty: "Medium",
      setupTime: "22 min",
      rating: 4.4,
      uses: 789,
      features: ["Time logging", "Project timesheets", "Productivity analytics", "Client billing"],
      preview: "/placeholder.svg?height=200&width=300",
    },
  ]

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
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Library</h1>
              <p className="text-gray-600 mt-1">Start with pre-built templates for common business processes</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {templates.length} Templates
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="space-y-6">
          {/* Search and Categories */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Most Popular Templates</h3>
                  <p className="text-sm text-gray-600">Templates used by thousands of businesses</p>
                </div>
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {templates
                  .sort((a, b) => b.uses - a.uses)
                  .slice(0, 3)
                  .map((template) => (
                    <div key={template.id} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <template.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-xs text-gray-600">{template.uses.toLocaleString()} uses</p>
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
                  <Card key={template.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={template.preview || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <template.icon className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                          </div>
                          <Badge className={getDifficultyColor(template.difficulty)} variant="secondary">
                            {template.difficulty}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

                        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 mr-1" />
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
                            <h4 className="text-xs font-medium text-gray-900 mb-2">Features</h4>
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
                              <Link href={`/templates/${template.id}`}>
                                <Eye className="w-3 h-3 mr-2" />
                                Preview
                              </Link>
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                              asChild
                            >
                              <Link href={`/tools/create?template=${template.id}`}>
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
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
