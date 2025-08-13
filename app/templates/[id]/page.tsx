"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Users, Clock, Play, Eye, Download, Heart, Share, CheckCircle, Settings } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function TemplateDetailPage() {
  const params = useParams()
  const templateId = params.id

  // Mock data - in real app, fetch based on templateId
  const template = {
    id: "lead-tracker",
    name: "Lead Tracking System",
    description:
      "Track leads from initial contact through deal closure with comprehensive pipeline management and team collaboration features",
    category: "Sales & CRM",
    difficulty: "Easy",
    setupTime: "15 min",
    rating: 4.8,
    reviews: 156,
    uses: 1247,
    lastUpdated: "2024-01-15",
    author: "ConfigCraft Team",
    features: [
      "Contact management with detailed profiles",
      "Customizable deal stages and pipeline",
      "Follow-up reminders and task management",
      "Team collaboration and notes",
      "Email integration and tracking",
      "Reporting and analytics dashboard",
      "Mobile-responsive interface",
      "Data export capabilities",
    ],
    requirements: ["Basic CRM knowledge helpful", "Email integration (optional)", "Team of 2-50 users"],
    preview: "/placeholder.svg?height=400&width=600",
    screenshots: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  }

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
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/templates">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Templates
                </Link>
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
                  <Badge className={getDifficultyColor(template.difficulty)}>{template.difficulty}</Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {template.rating} ({template.reviews} reviews)
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {template.uses.toLocaleString()} uses
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {template.setupTime} setup
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                asChild
              >
                <Link href={`/tools/create?template=${template.id}`}>
                  <Play className="w-4 h-4 mr-2" />
                  Use This Template
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-purple-600" />
                  Template Preview
                </CardTitle>
                <CardDescription>See how your tool will look and function</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  <Play className="w-4 h-4 mr-2" />
                  Launch Interactive Demo
                </Button>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Template</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{template.description}</p>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">What You'll Get</h4>
                      <ul className="space-y-2">
                        {template.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Feature List</CardTitle>
                    <CardDescription>Everything included in this template</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="screenshots" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Screenshots</CardTitle>
                    <CardDescription>See the template in action</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {template.screenshots.map((screenshot, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={screenshot || "/placeholder.svg"}
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>User Reviews</CardTitle>
                    <CardDescription>{template.reviews} reviews from real users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Sarah Johnson",
                          company: "TechFlow Inc",
                          rating: 5,
                          comment: "Perfect for our sales team. Easy to set up and customize.",
                          date: "2 weeks ago",
                        },
                        {
                          name: "Mike Davis",
                          company: "GrowthLabs",
                          rating: 5,
                          comment: "Saved us months of development time. Highly recommended!",
                          date: "1 month ago",
                        },
                        {
                          name: "Lisa Chen",
                          company: "DataSync",
                          rating: 4,
                          comment: "Great template with solid features. Could use more customization options.",
                          date: "1 month ago",
                        },
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-gray-900">{review.name}</p>
                              <p className="text-sm text-gray-600">{review.company}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    asChild
                  >
                    <Link href={`/tools/create?template=${template.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Use This Template
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="w-4 h-4 mr-2" />
                    Download Guide
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Template Info */}
            <Card>
              <CardHeader>
                <CardTitle>Template Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{template.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Difficulty</p>
                    <Badge className={getDifficultyColor(template.difficulty)} variant="secondary">
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-600">Setup Time</p>
                    <p className="font-medium">{template.setupTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-medium">{template.lastUpdated}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-2">Created by</p>
                  <p className="font-medium">{template.author}</p>
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {template.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Settings className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Uses</span>
                  <span className="font-medium">{template.uses.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{template.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="font-medium">{template.reviews}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
