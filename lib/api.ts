// API client utilities for ConfigCraft

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/api${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new ApiError(response.status, error.error || "Request failed")
  }

  return response.json()
}

// Dashboard API
export const dashboardApi = {
  getStats: () =>
    apiRequest<{
      stats: {
        toolsCount: number
        membersCount: number
        usageThisMonth: number
        subscription: string
      }
      toolsByStatus: Record<string, number>
      recentTools: any[]
      usageAnalytics: Record<string, number>
    }>("/dashboard/stats"),
}

// Tools API
export const toolsApi = {
  getAll: (params?: { status?: string; category?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set("status", params.status)
    if (params?.category) searchParams.set("category", params.category)
    const query = searchParams.toString()
    return apiRequest<any[]>(`/tools${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => apiRequest<any>(`/tools/${id}`),

  create: (data: {
    name: string
    description?: string
    category?: string
    config: any
    schema: any
    ui: any
  }) =>
    apiRequest<any>("/tools", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    apiRequest<any>(`/tools/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean }>(`/tools/${id}`, {
      method: "DELETE",
    }),
}

// Templates API
export const templatesApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.category) searchParams.set("category", params.category)
    if (params?.search) searchParams.set("search", params.search)
    const query = searchParams.toString()
    return apiRequest<any[]>(`/templates${query ? `?${query}` : ""}`)
  },

  getById: (id: string) => apiRequest<any>(`/templates/${id}`),

  use: (id: string, data: { name: string; customizations?: any }) =>
    apiRequest<any>(`/templates/${id}/use`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Company API
export const companyApi = {
  get: () => apiRequest<any>("/company"),

  update: (data: {
    name?: string
    description?: string
    website?: string
    industry?: string
    size?: string
  }) =>
    apiRequest<any>("/company", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}

// Integrations API
export const integrationsApi = {
  getAll: () => apiRequest<any[]>("/integrations"),

  create: (data: {
    name: string
    type: string
    provider: string
    config: any
    credentials?: any
  }) =>
    apiRequest<any>("/integrations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
}

// Billing API
export const billingApi = {
  getSubscription: () => apiRequest<any>("/billing/subscription"),

  updateSubscription: (data: { plan: string }) =>
    apiRequest<any>("/billing/subscription", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
}
