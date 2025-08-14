"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Eye,
  Globe,
  Code,
  Settings,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  Download,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  status: string
  generationStatus: string
  generationError?: string
  previewUrl?: string
  publishedUrl?: string
  createdAt: string
  updatedAt: string
  generatedCode?: string
  requirements: string
}

export default function ToolPage() {
  const [tool, setTool] = useState<Tool | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const orgSlug = params?.slug as string
  const toolId = params?.id as string

  useEffect(() => {
    fetchTool()
  }, [toolId, orgSlug])

  const fetchTool = async () => {
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tool")
      }
      const toolData = await response.json()
      setTool(toolData)
    } catch (error) {
      console.error("Error fetching tool:", error)
      toast({
        title: "Error",
        description: "Failed to load tool details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!tool) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}/publish`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to publish tool")
      }

      const updatedTool = await response.json()
      setTool(updatedTool)

      toast({
        title: "Tool Published!",
        description: "Your tool is now live and accessible to users.",
      })
    } catch (error) {
      console.error("Error publishing tool:", error)
      toast({
        title: "Publish Failed",
        description: "Failed to publish the tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleDelete = async () => {
    if (!tool || !confirm("Are you sure you want to delete this tool? This action cannot be undone.")) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/organizations/${orgSlug}/tools/${toolId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete tool")
      }

      toast({
        title: "Tool Deleted",
        description: "The tool has been permanently deleted.",
      })

      router.push(`/${orgSlug}/tools`)
    } catch (error) {
      console.error("Error deleting tool:", error)
      toast({
        title: "Delete Failed",
        description: "Failed to delete the tool. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "URL copied to clipboard.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "GENERATED":
        return "bg-green-100 text-green-800"
      case "PUBLISHED":
        return "bg-blue-100 text-blue-800"
      case "GENERATING":
        return "bg-yellow-100 text-yellow-800"
      case "ERROR":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGenerationStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "analyzing":
      case "designing":
      case "generating":
      case "finalizing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Tool Not Found</h2>
          <p className="text-muted-foreground mb-4">The tool you're looking for doesn't exist.</p>
          <Link href={`/${orgSlug}/tools`}>
            <Button>Back to Tools</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center space-x-4">
            <Link href={`/${orgSlug}/tools`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">{tool.name}</h1>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(tool.status)}>{tool.status}</Badge>
            {tool.generationStatus && (
              <div className="flex items-center space-x-1">
                {getGenerationStatusIcon(tool.generationStatus)}
                <span className="text-sm text-muted-foreground capitalize">{tool.generationStatus}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="space-y-6">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Tool Preview</span>
                    </CardTitle>
                    <CardDescription>Preview how your tool looks and functions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tool.status === "GENERATING" ? (
                      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                        <div className="text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">Generating your tool...</p>
                        </div>
                      </div>
                    ) : tool.status === "ERROR" ? (
                      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg">
                        <div className="text-center">
                          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                          <p className="text-sm text-red-600">Generation failed</p>
                          {tool.generationError && <p className="text-xs text-red-500 mt-2">{tool.generationError}</p>}
                        </div>
                      </div>
                    ) : tool.previewUrl ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                          <iframe src={tool.previewUrl} className="w-full h-full border-0" title="Tool Preview" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={tool.previewUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open in New Tab
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(tool.previewUrl!)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy URL
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">No preview available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Code className="h-5 w-5" />
                      <span>Generated Code</span>
                    </CardTitle>
                    <CardDescription>View and download the generated code for your tool</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {tool.generatedCode ? (
                      <div className="space-y-4">
                        <div className="bg-muted rounded-lg p-4 max-h-96 overflow-auto">
                          <pre className="text-sm">
                            <code>{tool.generatedCode}</code>
                          </pre>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download Code
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(tool.generatedCode!)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">No code available yet</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="h-5 w-5" />
                      <span>Tool Settings</span>
                    </CardTitle>
                    <CardDescription>Manage your tool settings and configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm">{tool.requirements}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Category</h4>
                      <Badge variant="secondary">{tool.category}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Created</h4>
                      <p className="text-sm text-muted-foreground">{new Date(tool.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Manage your tool</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {tool.status === "GENERATED" && !tool.publishedUrl && (
                  <Button onClick={handlePublish} disabled={isPublishing} className="w-full">
                    {isPublishing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Globe className="h-4 w-4 mr-2" />
                    )}
                    Publish Tool
                  </Button>
                )}

                {tool.publishedUrl && (
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Published Tool
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(tool.publishedUrl!)}
                      className="w-full"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Public URL
                    </Button>
                  </div>
                )}

                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="w-full">
                  {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
                  Delete Tool
                </Button>
              </CardContent>
            </Card>

            {tool.publishedUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Public Access</CardTitle>
                  <CardDescription>Your tool is live and accessible</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">Published</span>
                    </div>
                    <p className="text-xs text-muted-foreground break-all">{tool.publishedUrl}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
