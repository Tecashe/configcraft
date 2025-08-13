"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  ExternalLink,
  Edit,
  Share2,
  Download,
  Trash2,
  Eye,
  Code,
  BarChart3,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Rocket,
} from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  status: string
  category: string
  requirements?: string
  v0Code?: string
  previewUrl?: string
  publishedUrl?: string
  generationStatus: string
  generationError?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  _count?: {
    usageRecords: number
  }
}

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchTool(params.id as string)
    }
  }, [params.id])

  const fetchTool = async (toolId: string) => {
    try {
      const response = await fetch(`/api/tools/${toolId}`)
      if (response.ok) {
        const data = await response.json()
        setTool(data)
      } else {
        setError("Tool not found")
      }
    } catch (error) {
      setError("Failed to load tool")
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!tool) return

    setIsPublishing(true)
    try {
      const response = await fetch(`/api/tools/${tool.id}/publish`, {
        method: "POST",
      })

      if (response.ok) {
        const result = await response.json()
        setTool({ ...tool, status: "PUBLISHED", publishedUrl: result.publishedUrl })
      } else {
        const error = await response.json()
        setError(error.error || "Failed to publish tool")
      }
    } catch (error) {
      setError("Failed to publish tool")
    } finally {
      setIsPublishing(false)
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
        return "Ready to Publish"
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#888888]" />
          <p className="text-[#B0B0B0]">Loading tool details...</p>
        </div>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#E0E0E0] mb-2">Tool Not Found</h2>
          <p className="text-[#B0B0B0] mb-4">{error || "The requested tool could not be found."}</p>
          <Button onClick={() => router.push("/tools")} className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tools
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <div className="border-b border-[#444444] bg-[#121212]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/tools")}
                className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-[#E0E0E0]">{tool.name}</h1>
                  <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                </div>
                <p className="text-[#B0B0B0]">
                  {tool.category} • Created {new Date(tool.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {tool.status === "GENERATED" && (
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Publish Tool
                    </>
                  )}
                </Button>
              )}

              {tool.status === "PUBLISHED" && tool.publishedUrl && (
                <Button asChild className="bg-[#888888] hover:bg-[#666666] text-[#121212]">
                  <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Tool
                  </a>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[#444444] border-[#444444]">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]">
              <Code className="w-4 h-4 mr-2" />
              Code
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#888888] data-[state=active]:text-[#121212]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {/* Description */}
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0]">Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#B0B0B0]">{tool.description || "No description available"}</p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                {tool.requirements && (
                  <Card className="bg-[#121212] border-[#444444]">
                    <CardHeader>
                      <CardTitle className="text-[#E0E0E0]">Original Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#B0B0B0] whitespace-pre-wrap">{tool.requirements}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Generation Status */}
                {tool.status === "GENERATING" && (
                  <Card className="bg-[#121212] border-[#444444]">
                    <CardHeader>
                      <CardTitle className="text-[#E0E0E0] flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        Generation in Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <p className="text-[#B0B0B0]">
                          Your tool is being generated. This usually takes 30-60 seconds.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Generation Error */}
                {tool.status === "ERROR" && tool.generationError && (
                  <Card className="bg-[#121212] border-red-800">
                    <CardHeader>
                      <CardTitle className="text-red-300 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Generation Failed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-red-200 mb-4">{tool.generationError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-300 hover:bg-red-900/20 bg-transparent"
                      >
                        Retry Generation
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Success Message */}
                {tool.status === "GENERATED" && (
                  <Card className="bg-[#121212] border-green-800">
                    <CardHeader>
                      <CardTitle className="text-green-300 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Tool Generated Successfully
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-200 mb-4">
                        Your tool has been generated and is ready to publish. You can preview it and make any final
                        adjustments before going live.
                      </p>
                      <Button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="bg-[#888888] hover:bg-[#666666] text-[#121212]"
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Rocket className="w-4 h-4 mr-2" />
                            Publish Tool
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Tool Info */}
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0]">Tool Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Category</p>
                      <p className="text-[#E0E0E0]">{tool.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Status</p>
                      <Badge className={getStatusColor(tool.status)}>{getStatusLabel(tool.status)}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Created</p>
                      <p className="text-[#E0E0E0]">{new Date(tool.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Last Updated</p>
                      <p className="text-[#E0E0E0]">{new Date(tool.updatedAt).toLocaleDateString()}</p>
                    </div>
                    {tool.publishedAt && (
                      <div>
                        <p className="text-sm text-[#B0B0B0]">Published</p>
                        <p className="text-[#E0E0E0]">{new Date(tool.publishedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-[#B0B0B0]">Usage</p>
                      <p className="text-[#E0E0E0]">{tool._count?.usageRecords || 0} times</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-[#121212] border-[#444444]">
                  <CardHeader>
                    <CardTitle className="text-[#E0E0E0]">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tool.publishedUrl && (
                      <Button asChild className="w-full bg-[#888888] hover:bg-[#666666] text-[#121212]">
                        <a href={tool.publishedUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open Tool
                        </a>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Code
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-[#444444] text-[#B0B0B0] hover:bg-[#444444] bg-transparent"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Tool
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-600 text-red-300 hover:bg-red-900/20 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Tool
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview">
            <Card className="bg-[#121212] border-[#444444]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Tool Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {tool.previewUrl ? (
                  <div className="aspect-video bg-[#444444] rounded-lg overflow-hidden">
                    <iframe src={tool.previewUrl} className="w-full h-full" title={`Preview of ${tool.name}`} />
                  </div>
                ) : (
                  <div className="aspect-video bg-[#444444] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                      <p className="text-[#B0B0B0]">Preview not available</p>
                      <p className="text-sm text-[#888888]">
                        {tool.status === "GENERATING"
                          ? "Tool is still being generated"
                          : "No preview available for this tool"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code">
            <Card className="bg-[#121212] border-[#444444]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Generated Code</CardTitle>
              </CardHeader>
              <CardContent>
                {tool.v0Code ? (
                  <div className="bg-[#444444] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-[#E0E0E0] whitespace-pre-wrap">
                      <code>{tool.v0Code}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                    <p className="text-[#B0B0B0]">No code available</p>
                    <p className="text-sm text-[#888888]">
                      {tool.status === "GENERATING"
                        ? "Code will be available once generation is complete"
                        : "Code not generated for this tool"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="bg-[#121212] border-[#444444]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Usage Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                  <p className="text-[#B0B0B0]">Analytics coming soon</p>
                  <p className="text-sm text-[#888888]">
                    Detailed usage analytics will be available once your tool is published and being used.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-[#121212] border-[#444444]">
              <CardHeader>
                <CardTitle className="text-[#E0E0E0]">Tool Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="w-12 h-12 text-[#888888] mx-auto mb-4" />
                  <p className="text-[#B0B0B0]">Settings panel coming soon</p>
                  <p className="text-sm text-[#888888]">
                    Configure tool permissions, access controls, and other settings.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
