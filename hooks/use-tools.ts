"use client"

import { useEffect, useState } from "react"
import { toolsApi } from "@/lib/api"

export function useTools(params?: { status?: string; category?: string }) {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTools = async () => {
    try {
      setLoading(true)
      const data = await toolsApi.getAll(params)
      setTools(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tools")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTools()
  }, [params?.status, params?.category])

  const createTool = async (toolData: {
    name: string
    description?: string
    category?: string
    config: any
    schema: any
    ui: any
  }) => {
    try {
      const newTool = await toolsApi.create(toolData)
      setTools((prev) => [newTool, ...prev])
      return newTool
    } catch (err) {
      throw err
    }
  }

  const updateTool = async (id: string, toolData: any) => {
    try {
      const updatedTool = await toolsApi.update(id, toolData)
      setTools((prev) => prev.map((tool) => (tool.id === id ? updatedTool : tool)))
      return updatedTool
    } catch (err) {
      throw err
    }
  }

  const deleteTool = async (id: string) => {
    try {
      await toolsApi.delete(id)
      setTools((prev) => prev.filter((tool) => tool.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    tools,
    loading,
    error,
    refetch: fetchTools,
    createTool,
    updateTool,
    deleteTool,
  }
}
