// Core Generation Types
export type LogLevel = "info" | "success" | "error" | "warning" | "debug"

export interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  details?: string
}

export interface GeneratedFile {
  id: string
  name: string
  path: string
  content: string
  type: string
  size: number
  language?: string
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Tool Types
export type ToolStatus = "draft" | "generating" | "completed" | "failed" | "published"
export type ToolCategory = "dashboard" | "form" | "chart" | "table" | "report" | "other"

export interface ToolConfig {
  name: string
  description: string
  category: ToolCategory
  requirements: string
  integrations: string[]
  customizations?: Record<string, any>
}

export interface ToolMetadata {
  id: string
  slug: string
  name: string
  description: string
  category: ToolCategory
  status: ToolStatus
  previewUrl?: string
  chatUrl?: string
  publishedUrl?: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  organizationId: string
}

export interface ToolWithFiles extends ToolMetadata {
  files: GeneratedFile[]
  chatSessions: ChatSession[]
  versions: ToolVersion[]
  integrations: ToolIntegration[]
  analytics?: ToolAnalytics
}

// Chat Session Types
export interface ChatSession {
  id: string
  toolId: string
  v0ChatId?: string
  v0ProjectId?: string
  status: "active" | "completed" | "failed"
  messages: ChatMessage[]
  files: GeneratedFile[]
  createdAt: Date
  updatedAt: Date
}

// Version Types
export interface ToolVersion {
  id: string
  toolId: string
  version: number
  description?: string
  v0Code?: string
  previewUrl?: string
  chatUrl?: string
  files: GeneratedFile[]
  createdAt: Date
  createdBy: string
}

// Integration Types
export type IntegrationType = "supabase" | "stripe" | "openai" | "resend" | "clerk" | "vercel" | "other"

export interface Integration {
  id: string
  name: string
  type: IntegrationType
  description?: string
  isActive: boolean
  config?: Record<string, any>
}

export interface ToolIntegration {
  id: string
  toolId: string
  integrationId: string
  integration: Integration
  config?: Record<string, any>
  isEnabled: boolean
}

// Analytics Types
export interface ToolAnalytics {
  id: string
  toolId: string
  views: number
  uniqueVisitors: number
  averageSessionDuration: number
  lastViewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UsageRecord {
  id: string
  organizationId: string
  userId: string
  resourceType: string
  resourceId?: string
  quantity: number
  unit: string
  cost?: number
  metadata?: Record<string, any>
  createdAt: Date
}

// Organization Types
export type OrganizationRole = "owner" | "admin" | "member" | "viewer"
export type OrganizationSize = "solo" | "small" | "medium" | "large" | "enterprise"

export interface Organization {
  id: string
  name: string
  slug: string
  size: OrganizationSize
  logo?: string
  website?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: OrganizationRole
  joinedAt: Date
}

// Subscription Types
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "incomplete"
export type SubscriptionPlan = "free" | "starter" | "professional" | "enterprise"

export interface Subscription {
  id: string
  organizationId: string
  plan: SubscriptionPlan
  status: SubscriptionStatus
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  createdAt: Date
  updatedAt: Date
}

// Publishing Types
export type PublishStatus = "pending" | "deploying" | "deployed" | "failed"

export interface PublishedTool {
  id: string
  toolId: string
  versionId?: string
  status: PublishStatus
  deploymentUrl?: string
  subdomain?: string
  customDomain?: string
  vercelProjectId?: string
  vercelDeploymentId?: string
  publishedAt?: Date
  lastDeployedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalCount: number
  }
}

// Stream Event Types
export interface StreamEvent {
  type: "log" | "file" | "progress" | "complete" | "error"
  data: any
  timestamp: Date
}

export interface GenerationProgress {
  stage: "initializing" | "generating" | "processing" | "finalizing" | "complete"
  progress: number // 0-100
  message: string
  estimatedTimeRemaining?: number
}

// Audit Log Types
export type AuditAction =
  | "tool.created"
  | "tool.updated"
  | "tool.deleted"
  | "tool.published"
  | "tool.unpublished"
  | "file.created"
  | "file.updated"
  | "file.deleted"
  | "chat.message"
  | "version.created"
  | "integration.added"
  | "integration.removed"
  | "member.invited"
  | "member.removed"
  | "subscription.updated"

export interface AuditLog {
  id: string
  organizationId: string
  userId: string
  action: AuditAction
  resourceType: string
  resourceId: string
  metadata?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

// Template Types
export type TemplateCategory = "dashboard" | "form" | "chart" | "table" | "report" | "landing" | "other"

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  thumbnail?: string
  previewUrl?: string
  isPublic: boolean
  isPremium: boolean
  usageCount: number
  config?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Device Types for Preview
export type DeviceMode = "desktop" | "tablet" | "mobile"

export interface DeviceConfig {
  mode: DeviceMode
  width: number
  height: number
  scale: number
}

// View Mode Types
export type ViewMode = "preview" | "code" | "split"

// Filter and Sort Types
export interface ToolFilters {
  status?: ToolStatus[]
  category?: ToolCategory[]
  search?: string
  createdBy?: string
  dateFrom?: Date
  dateTo?: Date
}

export interface SortConfig {
  field: string
  direction: "asc" | "desc"
}

// Generation Result Types
export interface GenerationResult {
  success: boolean
  toolId?: string
  chatSessionId?: string
  files?: GeneratedFile[]
  previewUrl?: string
  chatUrl?: string
  error?: string
  logs?: LogEntry[]
}

// Advanced Generation Options Types
export interface AdvancedGenerationOptions {
  toolName: string
  category: string
  requirements: string
  integrations: string[]
  existingChatId?: string // For conversational regeneration
  feedback?: string // User feedback for improvements
}
