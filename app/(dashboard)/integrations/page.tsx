"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Database,
  CreditCard,
  Cloud,
  MessageSquare,
  Users,
  Mail,
  FileText,
} from "lucide-react"

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const integrations = [
    // Popular Tools
    {
      id: "slack",
      name: "Slack",
      description: "Send notifications and updates to Slack channels",
      category: "communication",
      icon: MessageSquare,
      status: "connected",
      setupTime: "2 min",
      features: ["Real-time notifications", "Channel integration", "Bot commands"],
      connected: true,
    },
    {
      id: "salesforce",
      name: "Salesforce",
      description: "Sync customer data and sales pipeline information",
      category: "crm",
      icon: Users,
      status: "available",
      setupTime: "5 min",
      features: ["Contact sync", "Lead management", "Opportunity tracking"],
      connected: false,
    },
    {
      id: "google-workspace",
      name: "Google Workspace",
      description: "Connect with Gmail, Drive, Calendar, and Sheets",
      category: "productivity",
      icon: Mail,
      status: "connected",
      setupTime: "3 min",
      features: ["Email integration", "Calendar sync", "Drive storage"],
      connected: true,
    },
    {
      id: "microsoft-365",
      name: "Microsoft 365",
      description: "Integrate with Outlook, Teams, and OneDrive",
      category: "productivity",
      icon: FileText,
      status: "available",
      setupTime: "4 min",
      features: ["Outlook integration", "Teams notifications", "OneDrive storage"],
      connected: false,
    },

    // Databases
    {
      id: "postgresql",
      name: "PostgreSQL",
      description: "Connect to PostgreSQL databases for data storage",
      category: "database",
      icon: Database,
      status: "available",
      setupTime: "10 min",
      features: ["SQL queries", "Real-time sync", "Data validation"],
      connected: false,
    },
    {
      id: "mysql",
      name: "MySQL",
      description: "Integrate with MySQL databases",
      category: "database",
      icon: Database,
      status: "available",
      setupTime: "8 min",
      features: ["Database queries", "Auto-backup", "Performance monitoring"],
      connected: false,
    },
    {
      id: "mongodb",
      name: "MongoDB",
      description: "Connect to MongoDB for document-based storage",
      category: "database",
      icon: Database,
      status: "connected",
      setupTime: "6 min",
      features: ["Document queries", "Schema flexibility", "Aggregation pipelines"],
      connected: true,
    },

    // Payment
    {
      id: "stripe",
      name: "Stripe",
      description: "Process payments and manage subscriptions",
      category: "payment",
      icon: CreditCard,
      status: "available",
      setupTime: "7 min",
      features: ["Payment processing", "Subscription management", "Webhook support"],
      connected: false,
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Accept PayPal payments and manage transactions",
      category: "payment",
      icon: CreditCard,
      status: "available",
      setupTime: "5 min",
      features: ["Payment gateway", "Transaction tracking", "Refund management"],
      connected: false,
    },

    // File Storage
    {
      id: "aws-s3",
      name: "AWS S3",
      description: "Store and manage files in Amazon S3 buckets",
      category: "storage",
      icon: Cloud,
      status: "available",
      setupTime: "8 min",
      features: ["File upload", "CDN integration", "Access control"],
      connected: false,
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Store and share files using Google Drive",
      category: "storage",
      icon: Cloud,
      status: "connected",
      setupTime: "3 min",
      features: ["File sharing", "Collaborative editing", "Version control"],
      connected: true,
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Sync files with Dropbox for easy access",
      category: "storage",
      icon: Cloud,
      status: "available",
      setupTime: "4 min",
      features: ["File sync", "Team folders", "Link sharing"],
      connected: false,
    },
  ]

  const categories = [
    { id: "all", label: "All Integrations", count: integrations.length },
    {
      id: "communication",
      label: "Communication",
      count: integrations.filter((i) => i.category === "communication").length,
    },
    { id: "crm", label: "CRM & Sales", count: integrations.filter((i) => i.category === "crm").length },
    {
      id: "productivity",
      label: "Productivity",
      count: integrations.filter((i) => i.category === "productivity").length,
    },
    { id: "database", label: "Databases", count: integrations.filter((i) => i.category === "database").length },
    { id: "payment", label: "Payments", count: integrations.filter((i) => i.category === "payment").length },
    { id: "storage", label: "File Storage", count: integrations.filter((i) => i.category === "storage").length },
  ]

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const connectedIntegrations = integrations.filter((i) => i.connected)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
              <p className="text-gray-600 mt-1">Connect your tools with popular services and platforms</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                {connectedIntegrations.length} Connected
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
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <TabsList className="grid grid-cols-3 lg:grid-cols-7 w-full lg:w-auto">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  {category.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Connected Integrations Summary */}
          {connectedIntegrations.length > 0 && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Connected Integrations</h3>
                    <div className="flex items-center space-x-4">
                      {connectedIntegrations.slice(0, 4).map((integration) => (
                        <div key={integration.id} className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <integration.icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{integration.name}</span>
                        </div>
                      ))}
                      {connectedIntegrations.length > 4 && (
                        <span className="text-sm text-gray-600">+{connectedIntegrations.length - 4} more</span>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Integrations Grid */}
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration) => (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            <integration.icon className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <div className="flex items-center space-x-2 mt-1">
                              {integration.connected ? (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Connected
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  Available
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">{integration.setupTime} setup</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="mt-2">{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {integration.features.map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex space-x-2">
                          {integration.connected ? (
                            <>
                              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                <Settings className="w-3 h-3 mr-2" />
                                Configure
                              </Button>
                              <Button variant="outline" size="sm" className="bg-transparent">
                                <AlertCircle className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              <Plus className="w-3 h-3 mr-2" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredIntegrations.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
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
