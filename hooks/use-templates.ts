"use client"

import { useEffect, useState } from "react"
import { templatesApi } from "@/lib/api"

export function useTemplates(params?: { category?: string; search?: string }) {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const data = await templatesApi.getAll(params)
      setTemplates(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch templates")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [params?.category, params?.search])

  const useTemplate = async (id: string, data: { name: string; customizations?: any }) => {
    try {
      const tool = await templatesApi.use(id, data)
      return tool
    } catch (err) {
      throw err
    }
  }

  return {
    templates,
    loading,
    error,
    refetch: fetchTemplates,
    useTemplate,
  }
}
