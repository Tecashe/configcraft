"use client"

import { useEffect, useState } from "react"
import { dashboardApi } from "@/lib/api"

export function useDashboardData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const result = await dashboardApi.getStats()
      setData(result)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, error, refetch: fetchData }
}