"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  CheckCircle,
  AlertCircle,
  Settings,
  Plus,
  Database,
  Cloud,
  MessageSquare,
  Users,
  Loader2,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  icon: any
  status: "connected" | "available"
  setupTime: string
  features: string[]
  connected: boolean
  config?: any
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [connectedIntegrations, setConnectedIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const { toast } = useToast()
  const params = useParams()
  const orgSlug = params?.slug as string

  const availableIntegrations: Integration[] = [
    {
      id: "slack",
      name: "Slack",
      description: "Send notifications and updates to Slack channels",
      category: "communication",
      icon: MessageSquare,
      status: "available",
      setupTime: "2 min",
      features: ["Real-time notifications", "Channel integration", "Bot commands"],
      connected: false,
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
  ]

  const categories = [
    { id: "all", label: "All Integrations", count: availableIntegrations.length },
    {
      id: "communication",
      label: "Communication",
      count: availableIntegrations.filter((i) => i.category === "communication").length,
    },
    { id: "crm", label: "CRM & Sales", count: availableIntegrations.filter((i) => i.category === "crm").length },
    {
      id: "database",
      label: "Databases",
      count: availableIntegrations.filter((i) => i.category === "database").length,
    },
    {
      id: "storage",
      label: "File Storage",
      count: availableIntegrations.filter((i) => i.category === "storage").length,
    },
  ]

  useEffect(() => {
    if (orgSlug) {
      fetchConnectedIntegrations()
    }
  }, [orgSlug])

  const fetchConnectedIntegrations = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/integrations`)
      if (response.ok) {
        const data = await response.json()
        setConnectedIntegrations(data)
      }
    } catch (error) {
      console.error("Failed to fetch integrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (integration: Integration, config: any) => {
    setConnecting(integration.id)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/integrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: integration.name,
          type: integration.category,
          provider: integration.id,
          config,
          credentials: config,
        }),
      })

      if (response.ok) {
        toast({
          title: "Integration Connected",
          description: `${integration.name} has been successfully connected.`,
        })
        fetchConnectedIntegrations()
      } else {
        throw new Error("Failed to connect integration")
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${integration.name}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setConnecting(null)
    }
  }

  const filteredIntegrations = availableIntegrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || integration.category === activeCategory
    const isConnected = connectedIntegrations.some((ci) => ci.provider === integration.id)
    integration.connected = isConnected
    integration.status = isConnected ? "connected" : "available"
    return matchesSearch && matchesCategory
  })

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
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Integrations</h1>
          <p className="text-muted-foreground mt-1">Connect your tools with popular services and platforms</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            {connectedIntegrations.length} Connected
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
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full lg:w-auto">
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
          <Card className="config-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Connected Integrations</h3>
                  <div className="flex items-center space-x-4">
                    {connectedIntegrations.slice(0, 4).map((integration) => (
                      <div key={integration.id} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{integration.name}</span>
                      </div>
                    ))}
                    {connectedIntegrations.length > 4 && (
                      <span className="text-sm text-muted-foreground">+{connectedIntegrations.length - 4} more</span>
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
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onConnect={handleConnect}
                  connecting={connecting === integration.id}
                />
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No integrations found</h3>
                <p className="text-muted-foreground">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function IntegrationCard({
  integration,
  onConnect,
  connecting,
}: {
  integration: Integration
  onConnect: (integration: Integration, config: any) => void
  connecting: boolean
}) {
  const [config, setConfig] = useState<any>({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConnect(integration, config)
    setDialogOpen(false)
    setConfig({})
  }

  const getConfigFields = () => {
    switch (integration.id) {
      case "slack":
        return [
          { key: "webhook_url", label: "Webhook URL", type: "url", required: true },
          { key: "channel", label: "Default Channel", type: "text", required: false },
        ]
      case "salesforce":
        return [
          { key: "client_id", label: "Client ID", type: "text", required: true },
          { key: "client_secret", label: "Client Secret", type: "password", required: true },
          { key: "instance_url", label: "Instance URL", type: "url", required: true },
        ]
      case "postgresql":
        return [
          { key: "host", label: "Host", type: "text", required: true },
          { key: "port", label: "Port", type: "number", required: true },
          { key: "database", label: "Database", type: "text", required: true },
          { key: "username", label: "Username", type: "text", required: true },
          { key: "password", label: "Password", type: "password", required: true },
        ]
      default:
        return [
          { key: "api_key", label: "API Key", type: "password", required: true },
          { key: "endpoint", label: "Endpoint URL", type: "url", required: false },
        ]
    }
  }

  return (
    <Card className="config-card hover:border-primary/50 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
              <integration.icon className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">{integration.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {integration.connected ? (
                  <Badge className="bg-status-success text-white text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Available
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">{integration.setupTime} setup</span>
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-2 text-muted-foreground">{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Features</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              {integration.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-1 h-1 bg-primary rounded-full mr-2" />
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
                <Button variant="outline" size="sm">
                  <AlertCircle className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="flex-1 config-button-primary" disabled={connecting}>
                    {connecting ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Plus className="w-3 h-3 mr-2" />}
                    Connect
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect {integration.name}</DialogTitle>
                    <DialogDescription>
                      Enter your {integration.name} credentials to connect this integration.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {getConfigFields().map((field) => (
                      <div key={field.key}>
                        <Label htmlFor={field.key}>
                          {field.label} {field.required && <span className="text-status-error">*</span>}
                        </Label>
                        <Input
                          id={field.key}
                          type={field.type}
                          required={field.required}
                          value={config[field.key] || ""}
                          onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="config-button-primary" disabled={connecting}>
                        {connecting ? <Loader2 className="w-4 w-4 animate-spin" /> : "Connect"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
