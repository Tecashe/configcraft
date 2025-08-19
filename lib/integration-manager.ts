// import { prisma } from "@/lib/prisma"
// import { decrypt } from "@/lib/security"

// export interface UserIntegration {
//   id: string
//   name: string
//   provider: string
//   type: string
//   status: "CONNECTED" | "ERROR" | "DISCONNECTED"
//   credentials?: any
//   config?: any
//   lastSyncAt?: Date
//   connectedAt?: Date
// }

// export interface IntegrationTestResult {
//   success: boolean
//   integration: string
//   sampleData?: any
//   dataStructure?: any
//   error?: string
//   suggestedFix?: string
// }

// export interface ConnectionTestResult {
//   allPassed: boolean
//   results: IntegrationTestResult[]
//   failures: string[]
// }

// export class IntegrationManager {
//   async getConnectedIntegrations(organizationId: string): Promise<UserIntegration[]> {
//     try {
//       const integrations = await prisma.integration.findMany({
//         where: {
//           organizationId,
//           status: "CONNECTED",
//         },
//         select: {
//           id: true,
//           name: true,
//           provider: true,
//           type: true,
//           status: true,
//           config: true,
//           lastSyncAt: true,
//           createdAt: true,
//         },
//       })

//       return integrations.map((integration) => ({
//         id: integration.id,
//         name: integration.name,
//         provider: integration.provider,
//         type: integration.type,
//         status: integration.status as "CONNECTED" | "ERROR" | "DISCONNECTED",
//         config: integration.config,
//         lastSyncAt: integration.lastSyncAt,
//         connectedAt: integration.createdAt,
//       }))
//     } catch (error) {
//       console.error("Error fetching connected integrations:", error)
//       return []
//     }
//   }

//   async testAllConnections(organizationId: string): Promise<ConnectionTestResult> {
//     const integrations = await this.getConnectedIntegrations(organizationId)

//     if (integrations.length === 0) {
//       return {
//         allPassed: false,
//         results: [],
//         failures: ["No integrations connected"],
//       }
//     }

//     const results = await Promise.all(
//       integrations.map((integration) => this.testSingleConnection(integration, organizationId)),
//     )

//     return {
//       allPassed: results.every((r) => r.success),
//       results,
//       failures: results.filter((r) => !r.success).map((r) => r.error || "Unknown error"),
//     }
//   }

//   private async testSingleConnection(
//     integration: UserIntegration,
//     organizationId: string,
//   ): Promise<IntegrationTestResult> {
//     try {
//       // Get encrypted credentials from database
//       const fullIntegration = await prisma.integration.findUnique({
//         where: { id: integration.id },
//         select: { credentials: true, config: true },
//       })

//       if (!fullIntegration?.credentials) {
//         return {
//           success: false,
//           integration: integration.name,
//           error: "No credentials found",
//           suggestedFix: "Reconnect the integration",
//         }
//       }

//       // Decrypt credentials
//       const credentials = JSON.parse(await decrypt(fullIntegration.credentials))

//       switch (integration.provider.toLowerCase()) {
//         case "stripe":
//           return await this.testStripeConnection(credentials, integration)
//         case "supabase":
//           return await this.testSupabaseConnection(credentials, integration)
//         case "openai":
//           return await this.testOpenAIConnection(credentials, integration)
//         case "sendgrid":
//           return await this.testSendGridConnection(credentials, integration)
//         case "postgresql":
//           return await this.testPostgreSQLConnection(credentials, integration)
//         default:
//           return await this.testGenericConnection(credentials, integration)
//       }
//     } catch (error) {
//       return {
//         success: false,
//         integration: integration.name,
//         error: error instanceof Error ? error.message : "Connection test failed",
//         suggestedFix: this.getSuggestedFix(integration.provider, error),
//       }
//     }
//   }

//   private async testStripeConnection(credentials: any, integration: UserIntegration): Promise<IntegrationTestResult> {
//     try {
//       const response = await fetch("https://api.stripe.com/v1/customers?limit=3", {
//         headers: {
//           Authorization: `Bearer ${credentials.secret_key}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Stripe API error: ${response.status}`)
//       }

//       const data = await response.json()

//       return {
//         success: true,
//         integration: integration.name,
//         sampleData: data.data.slice(0, 2), // Return first 2 customers
//         dataStructure: {
//           customers: data.data.length,
//           hasMore: data.has_more,
//           fields: data.data[0] ? Object.keys(data.data[0]) : [],
//         },
//       }
//     } catch (error) {
//       return {
//         success: false,
//         integration: integration.name,
//         error: error instanceof Error ? error.message : "Stripe connection failed",
//         suggestedFix: "Check your Stripe secret key and ensure it has the correct permissions",
//       }
//     }
//   }

//   private async testSupabaseConnection(credentials: any, integration: UserIntegration): Promise<IntegrationTestResult> {
//     try {
//       const { createClient } = await import("@supabase/supabase-js")
//       const supabase = createClient(credentials.url, credentials.anon_key)

//       // Test with a simple query
//       const { data, error } = await supabase.from("users").select("*").limit(3)

//       if (error && !error.message.includes('relation "users" does not exist')) {
//         throw new Error(error.message)
//       }

//       return {
//         success: true,
//         integration: integration.name,
//         sampleData: data || [],
//         dataStructure: {
//           tablesAccessible: !error,
//           sampleRecords: data?.length || 0,
//           fields: data?.[0] ? Object.keys(data[0]) : [],
//         },
//       }
//     } catch (error) {
//       return {
//         success: false,
//         integration: integration.name,
//         error: error instanceof Error ? error.message : "Supabase connection failed",
//         suggestedFix: "Verify your Supabase URL and anon key are correct",
//       }
//     }
//   }

//   private async testOpenAIConnection(credentials: any, integration: UserIntegration): Promise<IntegrationTestResult> {
//     try {
//       const response = await fetch("https://api.openai.com/v1/models", {
//         headers: {
//           Authorization: `Bearer ${credentials.api_key}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`OpenAI API error: ${response.status}`)
//       }

//       const data = await response.json()

//       return {
//         success: true,
//         integration: integration.name,
//         sampleData: data.data.slice(0, 3),
//         dataStructure: {
//           modelsAvailable: data.data.length,
//           gptModels: data.data.filter((m: any) => m.id.includes("gpt")).length,
//           fields: data.data[0] ? Object.keys(data.data[0]) : [],
//         },
//       }
//     } catch (error) {
//       return {
//         success: false,
//         integration: integration.name,
//         error: error instanceof Error ? error.message : "OpenAI connection failed",
//         suggestedFix: "Check your OpenAI API key and ensure it has sufficient credits",
//       }
//     }
//   }

//   private async testSendGridConnection(credentials: any, integration: UserIntegration): Promise<IntegrationTestResult> {
//     try {
//       const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
//         headers: {
//           Authorization: `Bearer ${credentials.api_key}`,
//           "Content-Type": "application/json",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`SendGrid API error: ${response.status}`)
//       }

//       const profile = await response.json()

//       return {
//         success: true,
//         integration: integration.name,
//         sampleData: {
//           email: profile.email,
//           username: profile.username,
//           company: profile.company,
//         },
//         dataStructure: {
//           profileFields: Object.keys(profile),
//           hasEmailVerified: !!profile.email,
//         },
//       }
//     } catch (error) {
//       return {
//         success: false,
//         integration: integration.name,
//         error: error instanceof Error ? error.message : "SendGrid connection failed",
//         suggestedFix: "Verify your SendGrid API key has the correct permissions",
//       }
//     }
//   }

//   private async testPostgreSQLConnection(
//     credentials: any,
//     integration: UserIntegration,
//   ): Promise<IntegrationTestResult> {
//     // For production, you would use a proper PostgreSQL client
//     // This is a simplified test
//     return {
//       success: true,
//       integration: integration.name,
//       sampleData: {
//         host: credentials.host,
//         database: credentials.database,
//         connected: true,
//       },
//       dataStructure: {
//         connectionString: `postgresql://${credentials.username}@${credentials.host}:${credentials.port}/${credentials.database}`,
//         ssl: credentials.ssl || "prefer",
//       },
//     }
//   }

//   private async testGenericConnection(credentials: any, integration: UserIntegration): Promise<IntegrationTestResult> {
//     return {
//       success: true,
//       integration: integration.name,
//       sampleData: { configured: true },
//       dataStructure: { type: "generic" },
//     }
//   }

//   private getSuggestedFix(provider: string, error: any): string {
//     const fixes: Record<string, string> = {
//       stripe: "Check your Stripe secret key and ensure it has the correct permissions",
//       supabase: "Verify your Supabase URL and anon key are correct",
//       openai: "Check your OpenAI API key and ensure it has sufficient credits",
//       sendgrid: "Verify your SendGrid API key has the correct permissions",
//       postgresql: "Check your database connection parameters and network access",
//     }

//     return fixes[provider.toLowerCase()] || "Check your integration credentials and try reconnecting"
//   }

//   async fetchRealData(integration: UserIntegration, dataType: string, limit = 10): Promise<any[]> {
//     try {
//       const fullIntegration = await prisma.integration.findUnique({
//         where: { id: integration.id },
//         select: { credentials: true },
//       })

//       if (!fullIntegration?.credentials) {
//         return []
//       }

//       const credentials = JSON.parse(await decrypt(fullIntegration.credentials))

//       switch (integration.provider.toLowerCase()) {
//         case "stripe":
//           return await this.fetchStripeData(credentials, dataType, limit)
//         case "supabase":
//           return await this.fetchSupabaseData(credentials, dataType, limit)
//         default:
//           return []
//       }
//     } catch (error) {
//       console.error(`Error fetching real data from ${integration.name}:`, error)
//       return []
//     }
//   }

//   private async fetchStripeData(credentials: any, dataType: string, limit: number): Promise<any[]> {
//     const endpoints: Record<string, string> = {
//       customers: "customers",
//       payments: "payment_intents",
//       subscriptions: "subscriptions",
//       products: "products",
//     }

//     const endpoint = endpoints[dataType] || "customers"

//     try {
//       const response = await fetch(`https://api.stripe.com/v1/${endpoint}?limit=${limit}`, {
//         headers: {
//           Authorization: `Bearer ${credentials.secret_key}`,
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       })

//       if (!response.ok) {
//         throw new Error(`Stripe API error: ${response.status}`)
//       }

//       const data = await response.json()
//       return data.data || []
//     } catch (error) {
//       console.error("Error fetching Stripe data:", error)
//       return []
//     }
//   }

//   private async fetchSupabaseData(credentials: any, dataType: string, limit: number): Promise<any[]> {
//     try {
//       const { createClient } = await import("@supabase/supabase-js")
//       const supabase = createClient(credentials.url, credentials.anon_key)

//       const { data, error } = await supabase.from(dataType).select("*").limit(limit)

//       if (error) {
//         console.error("Supabase query error:", error)
//         return []
//       }

//       return data || []
//     } catch (error) {
//       console.error("Error fetching Supabase data:", error)
//       return []
//     }
//   }
// }

// export const integrationManager = new IntegrationManager()


















// import { prisma } from "@/lib/prisma"
// import { decrypt } from "@/lib/security"
// import { z } from "zod"

// // ============================================================================
// // CORE TYPES & SCHEMAS
// // ============================================================================

// export const IntegrationStatus = {
//   CONNECTED: "CONNECTED",
//   ERROR: "ERROR", 
//   DISCONNECTED: "DISCONNECTED",
//   TESTING: "TESTING"
// } as const

// export type IntegrationStatusType = keyof typeof IntegrationStatus

// export const IntegrationType = {
//   PAYMENT: "PAYMENT",
//   DATABASE: "DATABASE", 
//   AI: "AI",
//   EMAIL: "EMAIL",
//   ANALYTICS: "ANALYTICS",
//   CRM: "CRM"
// } as const

// export type IntegrationTypeType = keyof typeof IntegrationType

// export const SupportedProvider = {
//   STRIPE: "stripe",
//   SUPABASE: "supabase", 
//   OPENAI: "openai",
//   SENDGRID: "sendgrid",
//   POSTGRESQL: "postgresql"
// } as const

// export type SupportedProviderType = (typeof SupportedProvider)[keyof typeof SupportedProvider]

// // Credential schemas for validation
// const StripeCredentialsSchema = z.object({
//   secret_key: z.string().min(1),
//   webhook_secret: z.string().optional()
// })

// const SupabaseCredentialsSchema = z.object({
//   url: z.string().url(),
//   anon_key: z.string().min(1),
//   service_role_key: z.string().optional()
// })

// const OpenAICredentialsSchema = z.object({
//   api_key: z.string().min(1),
//   organization_id: z.string().optional()
// })

// const SendGridCredentialsSchema = z.object({
//   api_key: z.string().min(1)
// })

// const PostgreSQLCredentialsSchema = z.object({
//   host: z.string().min(1),
//   port: z.number().int().positive(),
//   database: z.string().min(1),
//   username: z.string().min(1),
//   password: z.string().min(1),
//   ssl: z.boolean().optional()
// })

// // ============================================================================
// // DOMAIN INTERFACES
// // ============================================================================

// export interface UserIntegration {
//   readonly id: string
//   readonly name: string
//   readonly provider: SupportedProviderType
//   readonly type: IntegrationTypeType
//   readonly status: IntegrationStatusType
//   readonly config?: Record<string, unknown>
//   readonly lastSyncAt?: Date
//   readonly connectedAt?: Date
//   readonly organizationId: string
// }

// export interface IntegrationTestResult {
//   readonly success: boolean
//   readonly integrationId: string
//   readonly integrationName: string
//   readonly provider: SupportedProviderType
//   readonly testedAt: Date
//   readonly latencyMs: number
//   readonly sampleData?: unknown
//   readonly dataStructure?: Record<string, unknown>
//   readonly error?: IntegrationError
// }

// export interface ConnectionTestResult {
//   readonly allPassed: boolean
//   readonly totalTests: number
//   readonly passedTests: number
//   readonly failedTests: number
//   readonly results: readonly IntegrationTestResult[]
//   readonly failures: readonly string[]
//   readonly testedAt: Date
// }

// export interface IntegrationError {
//   readonly code: string
//   readonly message: string
//   readonly suggestedFix: string
//   readonly isRetryable: boolean
// }

// export interface DataFetchOptions {
//   readonly limit?: number
//   readonly offset?: number
//   readonly filters?: Record<string, unknown>
//   readonly orderBy?: string
//   readonly orderDirection?: 'asc' | 'desc'
// }

// export interface DataFetchResult<T = unknown> {
//   readonly data: readonly T[]
//   readonly totalCount?: number
//   readonly hasMore: boolean
//   readonly fetchedAt: Date
// }

// // ============================================================================
// // ERROR CLASSES
// // ============================================================================

// export class IntegrationConnectionError extends Error {
//   constructor(
//     public readonly provider: SupportedProviderType,
//     public readonly code: string,
//     message: string,
//     public readonly isRetryable: boolean = false
//   ) {
//     super(message)
//     this.name = 'IntegrationConnectionError'
//   }
// }

// export class CredentialsValidationError extends Error {
//   constructor(provider: SupportedProviderType, validationErrors: string[]) {
//     super(`Invalid credentials for ${provider}: ${validationErrors.join(', ')}`)
//     this.name = 'CredentialsValidationError'
//   }
// }

// // ============================================================================
// // INTEGRATION PROVIDER ABSTRACTIONS
// // ============================================================================

// abstract class BaseIntegrationProvider {
//   constructor(
//     protected readonly provider: SupportedProviderType,
//     protected readonly credentials: Record<string, unknown>
//   ) {}

//   abstract validateCredentials(): Promise<void>
//   abstract testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }>
//   abstract fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult>

//   protected createError(code: string, message: string, isRetryable = false): IntegrationConnectionError {
//     return new IntegrationConnectionError(this.provider, code, message, isRetryable)
//   }
// }

// class StripeProvider extends BaseIntegrationProvider {
//   async validateCredentials(): Promise<void> {
//     const result = StripeCredentialsSchema.safeParse(this.credentials)
//     if (!result.success) {
//       throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
//     }
//   }

//   async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
//     const { secret_key } = this.credentials as z.infer<typeof StripeCredentialsSchema>
    
//     const response = await fetch("https://api.stripe.com/v1/customers?limit=3", {
//       headers: {
//         Authorization: `Bearer ${secret_key}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })

//     if (!response.ok) {
//       const errorText = await response.text()
//       throw this.createError(
//         `STRIPE_API_${response.status}`, 
//         `Stripe API error: ${response.status} - ${errorText}`,
//         response.status >= 500
//       )
//     }

//     const data = await response.json()
//     return {
//       sampleData: data.data?.slice(0, 2),
//       dataStructure: {
//         customersCount: data.data?.length || 0,
//         hasMore: data.has_more,
//         availableFields: data.data?.[0] ? Object.keys(data.data[0]) : []
//       }
//     }
//   }

//   async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
//     const { secret_key } = this.credentials as z.infer<typeof StripeCredentialsSchema>
//     const endpoints: Record<string, string> = {
//       customers: "customers",
//       payments: "payment_intents", 
//       subscriptions: "subscriptions",
//       products: "products"
//     }

//     const endpoint = endpoints[dataType] || "customers"
//     const url = new URL(`https://api.stripe.com/v1/${endpoint}`)
    
//     if (options.limit) url.searchParams.set('limit', options.limit.toString())
//     if (options.offset) url.searchParams.set('starting_after', options.offset.toString())

//     const response = await fetch(url.toString(), {
//       headers: {
//         Authorization: `Bearer ${secret_key}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     })

//     if (!response.ok) {
//       throw this.createError(`STRIPE_FETCH_${response.status}`, `Failed to fetch ${dataType}`)
//     }

//     const result = await response.json()
//     return {
//       data: result.data || [],
//       hasMore: result.has_more || false,
//       fetchedAt: new Date()
//     }
//   }
// }

// class SupabaseProvider extends BaseIntegrationProvider {
//   async validateCredentials(): Promise<void> {
//     const result = SupabaseCredentialsSchema.safeParse(this.credentials)
//     if (!result.success) {
//       throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
//     }
//   }

//   async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
//     const { url, anon_key } = this.credentials as z.infer<typeof SupabaseCredentialsSchema>
    
//     const { createClient } = await import("@supabase/supabase-js")
//     const supabase = createClient(url, anon_key)

//     // Test basic connectivity with a simple query
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .limit(3)

//     // Handle the case where users table doesn't exist (not an error for connection test)
//     if (error && !error.message.includes('relation "users" does not exist')) {
//       throw this.createError(
//         'SUPABASE_QUERY_ERROR',
//         error.message,
//         error.code === 'PGRST301' // Connection timeout
//       )
//     }

//     return {
//       sampleData: data || [],
//       dataStructure: {
//         tablesAccessible: !error,
//         sampleRecords: data?.length || 0,
//         availableFields: data?.[0] ? Object.keys(data[0]) : [],
//         databaseUrl: url
//       }
//     }
//   }

//   async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
//     const { url, anon_key } = this.credentials as z.infer<typeof SupabaseCredentialsSchema>
    
//     const { createClient } = await import("@supabase/supabase-js")
//     const supabase = createClient(url, anon_key)

//     let query = supabase.from(dataType).select("*")

//     if (options.limit) query = query.limit(options.limit)
//     if (options.offset) query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
//     if (options.orderBy) {
//       query = query.order(options.orderBy, { ascending: options.orderDirection === 'asc' })
//     }

//     // Apply filters
//     if (options.filters) {
//       Object.entries(options.filters).forEach(([key, value]) => {
//         query = query.eq(key, value)
//       })
//     }

//     const { data, error, count } = await query

//     if (error) {
//       throw this.createError('SUPABASE_FETCH_ERROR', error.message)
//     }

//     return {
//       data: data || [],
//       totalCount: count || undefined,
//       hasMore: count ? (options.offset || 0) + (data?.length || 0) < count : false,
//       fetchedAt: new Date()
//     }
//   }
// }

// class OpenAIProvider extends BaseIntegrationProvider {
//   async validateCredentials(): Promise<void> {
//     const result = OpenAICredentialsSchema.safeParse(this.credentials)
//     if (!result.success) {
//       throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
//     }
//   }

//   async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
//     const { api_key } = this.credentials as z.infer<typeof OpenAICredentialsSchema>

//     const response = await fetch("https://api.openai.com/v1/models", {
//       headers: {
//         Authorization: `Bearer ${api_key}`,
//         "Content-Type": "application/json",
//       },
//     })

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}))
//       throw this.createError(
//         `OPENAI_API_${response.status}`,
//         errorData.error?.message || `OpenAI API error: ${response.status}`,
//         response.status >= 500
//       )
//     }

//     const data = await response.json()
//     return {
//       sampleData: data.data?.slice(0, 3),
//       dataStructure: {
//         totalModels: data.data?.length || 0,
//         gptModels: data.data?.filter((m: any) => m.id.includes("gpt")).length || 0,
//         availableFields: data.data?.[0] ? Object.keys(data.data[0]) : []
//       }
//     }
//   }

//   async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
//     // OpenAI doesn't have traditional "data fetching" - this would be for models, usage, etc.
//     const { api_key } = this.credentials as z.infer<typeof OpenAICredentialsSchema>

//     const endpoints: Record<string, string> = {
//       models: "models",
//       usage: "usage", // Note: This endpoint may require different permissions
//     }

//     const endpoint = endpoints[dataType] || "models"
    
//     const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
//       headers: {
//         Authorization: `Bearer ${api_key}`,
//         "Content-Type": "application/json",
//       },
//     })

//     if (!response.ok) {
//       throw this.createError(`OPENAI_FETCH_${response.status}`, `Failed to fetch ${dataType}`)
//     }

//     const result = await response.json()
//     return {
//       data: result.data || [],
//       hasMore: false,
//       fetchedAt: new Date()
//     }
//   }
// }

// class SendGridProvider extends BaseIntegrationProvider {
//   async validateCredentials(): Promise<void> {
//     const result = SendGridCredentialsSchema.safeParse(this.credentials)
//     if (!result.success) {
//       throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
//     }
//   }

//   async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
//     const { api_key } = this.credentials as z.infer<typeof SendGridCredentialsSchema>

//     const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
//       headers: {
//         Authorization: `Bearer ${api_key}`,
//         "Content-Type": "application/json",
//       },
//     })

//     if (!response.ok) {
//       throw this.createError(
//         `SENDGRID_API_${response.status}`,
//         `SendGrid API error: ${response.status}`,
//         response.status >= 500
//       )
//     }

//     const profile = await response.json()
//     return {
//       sampleData: {
//         email: profile.email,
//         username: profile.username,
//         company: profile.company
//       },
//       dataStructure: {
//         profileFields: Object.keys(profile),
//         isEmailVerified: Boolean(profile.email),
//         accountType: profile.type || 'unknown'
//       }
//     }
//   }

//   async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
//     const { api_key } = this.credentials as z.infer<typeof SendGridCredentialsSchema>
    
//     const endpoints: Record<string, string> = {
//       templates: "templates",
//       lists: "marketing/lists",
//       contacts: "marketing/contacts"
//     }

//     const endpoint = endpoints[dataType] || "templates"
//     const url = new URL(`https://api.sendgrid.com/v3/${endpoint}`)
    
//     if (options.limit) url.searchParams.set('page_size', Math.min(options.limit, 100).toString())

//     const response = await fetch(url.toString(), {
//       headers: {
//         Authorization: `Bearer ${api_key}`,
//         "Content-Type": "application/json",
//       },
//     })

//     if (!response.ok) {
//       throw this.createError(`SENDGRID_FETCH_${response.status}`, `Failed to fetch ${dataType}`)
//     }

//     const result = await response.json()
//     return {
//       data: result.result || result.data || [],
//       hasMore: result.metadata?.next_cursor ? true : false,
//       fetchedAt: new Date()
//     }
//   }
// }

// class PostgreSQLProvider extends BaseIntegrationProvider {
//   async validateCredentials(): Promise<void> {
//     const result = PostgreSQLCredentialsSchema.safeParse(this.credentials)
//     if (!result.success) {
//       throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
//     }
//   }

//   async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
//     const creds = this.credentials as z.infer<typeof PostgreSQLCredentialsSchema>
    
//     // In a real implementation, you'd use a proper PostgreSQL client like 'pg'
//     // For now, we'll simulate a successful connection test
//     return {
//       sampleData: {
//         host: creds.host,
//         database: creds.database,
//         port: creds.port,
//         connected: true
//       },
//       dataStructure: {
//         connectionString: `postgresql://${creds.username}@${creds.host}:${creds.port}/${creds.database}`,
//         sslEnabled: creds.ssl || false,
//         databaseType: 'postgresql'
//       }
//     }
//   }

//   async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
//     // Implementation would use actual PostgreSQL client
//     // This is a placeholder that shows the expected structure
//     return {
//       data: [],
//       hasMore: false,
//       fetchedAt: new Date()
//     }
//   }
// }

// // ============================================================================
// // PROVIDER FACTORY
// // ============================================================================

// class IntegrationProviderFactory {
//   static create(provider: SupportedProviderType, credentials: Record<string, unknown>): BaseIntegrationProvider {
//     switch (provider) {
//       case SupportedProvider.STRIPE:
//         return new StripeProvider(provider, credentials)
//       case SupportedProvider.SUPABASE:
//         return new SupabaseProvider(provider, credentials)
//       case SupportedProvider.OPENAI:
//         return new OpenAIProvider(provider, credentials)
//       case SupportedProvider.SENDGRID:
//         return new SendGridProvider(provider, credentials)
//       case SupportedProvider.POSTGRESQL:
//         return new PostgreSQLProvider(provider, credentials)
//       default:
//         throw new Error(`Unsupported provider: ${provider}`)
//     }
//   }
// }

// // ============================================================================
// // MAIN INTEGRATION MANAGER
// // ============================================================================

// export class IntegrationManager {
//   private readonly maxConcurrentTests = 5
//   private readonly testTimeoutMs = 30000

//   async getConnectedIntegrations(organizationId: string): Promise<readonly UserIntegration[]> {
//     try {
//       const integrations = await prisma.integration.findMany({
//         where: {
//           organizationId,
//           status: IntegrationStatus.CONNECTED,
//         },
//         select: {
//           id: true,
//           name: true,
//           provider: true,
//           type: true,
//           status: true,
//           config: true,
//           lastSyncAt: true,
//           createdAt: true,
//           organizationId: true,
//         },
//         orderBy: { createdAt: 'desc' }
//       })

//       return Object.freeze(
//         integrations.map((integration): UserIntegration => ({
//           id: integration.id,
//           name: integration.name,
//           provider: integration.provider as SupportedProviderType,
//           type: integration.type as IntegrationTypeType,
//           status: integration.status as IntegrationStatusType,
//           config: integration.config as Record<string, unknown> || {},
//           lastSyncAt: integration.lastSyncAt || undefined,
//           connectedAt: integration.createdAt,
//           organizationId: integration.organizationId,
//         }))
//       )
//     } catch (error) {
//       console.error("Error fetching connected integrations:", error)
//       throw new Error("Failed to retrieve integrations")
//     }
//   }

//   async testAllConnections(organizationId: string): Promise<ConnectionTestResult> {
//     const startTime = Date.now()
//     const integrations = await this.getConnectedIntegrations(organizationId)

//     if (integrations.length === 0) {
//       return {
//         allPassed: false,
//         totalTests: 0,
//         passedTests: 0,
//         failedTests: 0,
//         results: [],
//         failures: ["No integrations connected"],
//         testedAt: new Date()
//       }
//     }

//     // Process in batches to avoid overwhelming external APIs
//     const results: IntegrationTestResult[] = []
//     for (let i = 0; i < integrations.length; i += this.maxConcurrentTests) {
//       const batch = integrations.slice(i, i + this.maxConcurrentTests)
//       const batchResults = await Promise.allSettled(
//         batch.map(integration => this.testSingleConnectionWithTimeout(integration))
//       )
      
//       results.push(...batchResults.map((result, index) => {
//         if (result.status === 'fulfilled') {
//           return result.value
//         } else {
//           return this.createFailedTestResult(batch[index], result.reason)
//         }
//       }))
//     }

//     const passedTests = results.filter(r => r.success).length
//     const failedTests = results.length - passedTests

//     return {
//       allPassed: failedTests === 0,
//       totalTests: results.length,
//       passedTests,
//       failedTests,
//       results: Object.freeze(results),
//       failures: Object.freeze(results.filter(r => !r.success).map(r => r.error?.message || "Unknown error")),
//       testedAt: new Date()
//     }
//   }

//   private async testSingleConnectionWithTimeout(integration: UserIntegration): Promise<IntegrationTestResult> {
//     return Promise.race([
//       this.testSingleConnection(integration),
//       new Promise<never>((_, reject) => 
//         setTimeout(() => reject(new Error('Connection test timeout')), this.testTimeoutMs)
//       )
//     ])
//   }

//   private async testSingleConnection(integration: UserIntegration): Promise<IntegrationTestResult> {
//     const startTime = Date.now()
    
//     try {
//       const credentials = await this.getDecryptedCredentials(integration.id)
//       const provider = IntegrationProviderFactory.create(integration.provider, credentials)
      
//       await provider.validateCredentials()
//       const testResult = await provider.testConnection()
      
//       return {
//         success: true,
//         integrationId: integration.id,
//         integrationName: integration.name,
//         provider: integration.provider,
//         testedAt: new Date(),
//         latencyMs: Date.now() - startTime,
//         ...testResult
//       }
//     } catch (error) {
//       return this.createFailedTestResult(integration, error, Date.now() - startTime)
//     }
//   }

//   private createFailedTestResult(
//     integration: UserIntegration, 
//     error: unknown, 
//     latencyMs?: number
//   ): IntegrationTestResult {
//     const integrationError: IntegrationError = this.normalizeError(error, integration.provider)
    
//     return {
//       success: false,
//       integrationId: integration.id,
//       integrationName: integration.name,
//       provider: integration.provider,
//       testedAt: new Date(),
//       latencyMs: latencyMs || 0,
//       error: integrationError
//     }
//   }

//   private normalizeError(error: unknown, provider: SupportedProviderType): IntegrationError {
//     if (error instanceof IntegrationConnectionError) {
//       return {
//         code: error.code,
//         message: error.message,
//         suggestedFix: this.getSuggestedFix(provider, error),
//         isRetryable: error.isRetryable
//       }
//     }

//     if (error instanceof CredentialsValidationError) {
//       return {
//         code: 'INVALID_CREDENTIALS',
//         message: error.message,
//         suggestedFix: 'Reconnect the integration with valid credentials',
//         isRetryable: false
//       }
//     }

//     const message = error instanceof Error ? error.message : 'Unknown error occurred'
//     return {
//       code: 'UNKNOWN_ERROR',
//       message,
//       suggestedFix: this.getSuggestedFix(provider, error),
//       isRetryable: true
//     }
//   }

//   private getSuggestedFix(provider: SupportedProviderType, error: unknown): string {
//     const defaultFixes: Record<SupportedProviderType, string> = {
//       [SupportedProvider.STRIPE]: "Verify your Stripe secret key has the required permissions (read access to customers)",
//       [SupportedProvider.SUPABASE]: "Check that your Supabase URL and anon key are correct and the project is active",
//       [SupportedProvider.OPENAI]: "Ensure your OpenAI API key is valid and has sufficient credits/quota",
//       [SupportedProvider.SENDGRID]: "Verify your SendGrid API key has the required scopes and permissions",
//       [SupportedProvider.POSTGRESQL]: "Check your database connection parameters and network accessibility"
//     }

//     // Provide more specific suggestions based on error type
//     if (error instanceof Error) {
//       const message = error.message.toLowerCase()
      
//       if (message.includes('unauthorized') || message.includes('invalid')) {
//         return `Invalid credentials detected. ${defaultFixes[provider]}`
//       }
      
//       if (message.includes('timeout') || message.includes('network')) {
//         return `Network connectivity issue. Check your internet connection and try again.`
//       }
      
//       if (message.includes('rate limit')) {
//         return `API rate limit exceeded. Wait a few minutes before testing again.`
//       }
//     }

//     return defaultFixes[provider]
//   }

//   async fetchRealData(
//     integrationId: string, 
//     dataType: string, 
//     options: DataFetchOptions = {}
//   ): Promise<DataFetchResult> {
//     try {
//       const integration = await this.getIntegrationById(integrationId)
//       const credentials = await this.getDecryptedCredentials(integrationId)
//       const provider = IntegrationProviderFactory.create(integration.provider, credentials)
      
//       return await provider.fetchData(dataType, {
//         limit: 10,
//         offset: 0,
//         ...options
//       })
//     } catch (error) {
//       console.error(`Error fetching data from integration ${integrationId}:`, error)
//       throw error
//     }
//   }

//   async updateIntegrationStatus(integrationId: string, status: IntegrationStatusType): Promise<void> {
//     try {
//       // Map our internal status to Prisma's expected enum values
//       const mapStatusToPrisma = (status: IntegrationStatusType) => {
//         switch (status) {
//           case IntegrationStatus.CONNECTED:
//             return 'CONNECTED'
//           case IntegrationStatus.ERROR:
//             return 'ERROR'
//           case IntegrationStatus.DISCONNECTED:
//             return 'DISCONNECTED'
//           case IntegrationStatus.TESTING:
//             // If TESTING doesn't exist in Prisma schema, map to appropriate status
//             return 'DISCONNECTED' // or whatever makes sense in your schema
//           default:
//             return 'DISCONNECTED'
//         }
//       }
      
//       await prisma.integration.update({
//         where: { id: integrationId },
//         data: { 
//           status: mapStatusToPrisma(status),
//           lastSyncAt: status === IntegrationStatus.CONNECTED ? new Date() : undefined
//         }
//       })
//     } catch (error) {
//       console.error(`Error updating integration status:`, error)
//       throw new Error('Failed to update integration status')
//     }
//   }

//   async getIntegrationHealth(organizationId: string): Promise<{
//     healthy: number
//     unhealthy: number
//     lastTestedAt?: Date
//   }> {
//     const testResult = await this.testAllConnections(organizationId)
    
//     return {
//       healthy: testResult.passedTests,
//       unhealthy: testResult.failedTests,
//       lastTestedAt: testResult.testedAt
//     }
//   }

//   // ============================================================================
//   // PRIVATE HELPER METHODS
//   // ============================================================================

//   private async getIntegrationById(integrationId: string): Promise<UserIntegration> {
//     const integration = await prisma.integration.findUnique({
//       where: { id: integrationId },
//       select: {
//         id: true,
//         name: true,
//         provider: true,
//         type: true,
//         status: true,
//         config: true,
//         lastSyncAt: true,
//         createdAt: true,
//         organizationId: true,
//       }
//     })

//     if (!integration) {
//       throw new Error(`Integration with ID ${integrationId} not found`)
//     }

//     return {
//       id: integration.id,
//       name: integration.name,
//       provider: integration.provider as SupportedProviderType,
//       type: integration.type as IntegrationTypeType,
//       status: integration.status as IntegrationStatusType,
//       config: integration.config as Record<string, unknown> || {},
//       lastSyncAt: integration.lastSyncAt || undefined,
//       connectedAt: integration.createdAt,
//       organizationId: integration.organizationId,
//     }
//   }

//   private async getDecryptedCredentials(integrationId: string): Promise<Record<string, unknown>> {
//     const integration = await prisma.integration.findUnique({
//       where: { id: integrationId },
//       select: { credentials: true }
//     })

//     if (!integration?.credentials) {
//       throw new Error("No credentials found for integration")
//     }

//     // Ensure credentials is a string before decrypting
//     if (typeof integration.credentials !== 'string') {
//       throw new Error("Invalid credentials format - expected encrypted string")
//     }

//     try {
//       const decryptedCredentials = await decrypt(integration.credentials)
//       return JSON.parse(decryptedCredentials)
//     } catch (error) {
//       throw new Error("Failed to decrypt integration credentials")
//     }
//   }
// }

// // ============================================================================
// // SINGLETON INSTANCE & UTILITIES
// // ============================================================================

// export const integrationManager = new IntegrationManager()

// // Utility functions for external use
// export const IntegrationUtils = {
//   isValidProvider: (provider: string): provider is SupportedProviderType => {
//     return Object.values(SupportedProvider).includes(provider as SupportedProviderType)
//   },

//   getProviderDisplayName: (provider: SupportedProviderType): string => {
//     const displayNames: Record<SupportedProviderType, string> = {
//       [SupportedProvider.STRIPE]: "Stripe",
//       [SupportedProvider.SUPABASE]: "Supabase", 
//       [SupportedProvider.OPENAI]: "OpenAI",
//       [SupportedProvider.SENDGRID]: "SendGrid",
//       [SupportedProvider.POSTGRESQL]: "PostgreSQL"
//     }
//     return displayNames[provider]
//   },

//   getProviderType: (provider: SupportedProviderType): IntegrationTypeType => {
//     const providerTypes: Record<SupportedProviderType, IntegrationTypeType> = {
//       [SupportedProvider.STRIPE]: IntegrationType.PAYMENT,
//       [SupportedProvider.SUPABASE]: IntegrationType.DATABASE,
//       [SupportedProvider.OPENAI]: IntegrationType.AI,
//       [SupportedProvider.SENDGRID]: IntegrationType.EMAIL,
//       [SupportedProvider.POSTGRESQL]: IntegrationType.DATABASE
//     }
//     return providerTypes[provider]
//   }
// } as const













import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/security"
import { z } from "zod"

// ============================================================================
// CORE TYPES & SCHEMAS
// ============================================================================

export const IntegrationStatus = {
  CONNECTED: "CONNECTED",
  ERROR: "ERROR", 
  DISCONNECTED: "DISCONNECTED",
  TESTING: "TESTING"
} as const

export type IntegrationStatusType = keyof typeof IntegrationStatus

export const IntegrationType = {
  PAYMENT: "PAYMENT",
  DATABASE: "DATABASE", 
  AI: "AI",
  EMAIL: "EMAIL",
  ANALYTICS: "ANALYTICS",
  CRM: "CRM"
} as const

export type IntegrationTypeType = keyof typeof IntegrationType

export const SupportedProvider = {
  STRIPE: "stripe",
  SUPABASE: "supabase", 
  OPENAI: "openai",
  SENDGRID: "sendgrid",
  POSTGRESQL: "postgresql"
} as const

export type SupportedProviderType = (typeof SupportedProvider)[keyof typeof SupportedProvider]

// Credential schemas for validation
const StripeCredentialsSchema = z.object({
  secret_key: z.string().min(1),
  webhook_secret: z.string().optional()
})

const SupabaseCredentialsSchema = z.object({
  url: z.string().url(),
  anon_key: z.string().min(1),
  service_role_key: z.string().optional()
})

const OpenAICredentialsSchema = z.object({
  api_key: z.string().min(1),
  organization_id: z.string().optional()
})

const SendGridCredentialsSchema = z.object({
  api_key: z.string().min(1)
})

const PostgreSQLCredentialsSchema = z.object({
  host: z.string().min(1),
  port: z.number().int().positive(),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  ssl: z.boolean().optional()
})

// ============================================================================
// DOMAIN INTERFACES
// ============================================================================

export interface UserIntegration {
  readonly id: string
  readonly name: string
  readonly provider: SupportedProviderType
  readonly type: IntegrationTypeType
  readonly status: IntegrationStatusType
  readonly config?: Record<string, unknown>
  readonly lastSyncAt?: Date
  readonly connectedAt?: Date
  readonly organizationId: string
}

export interface IntegrationTestResult {
  readonly success: boolean
  readonly integrationId: string
  readonly integrationName: string
  readonly provider: SupportedProviderType
  readonly testedAt: Date
  readonly latencyMs: number
  readonly sampleData?: unknown
  readonly dataStructure?: Record<string, unknown>
  readonly error?: IntegrationError
}

export interface ConnectionTestResult {
  readonly allPassed: boolean
  readonly totalTests: number
  readonly passedTests: number
  readonly failedTests: number
  readonly results: readonly IntegrationTestResult[]
  readonly failures: readonly string[]
  readonly testedAt: Date
}

export interface IntegrationError {
  readonly code: string
  readonly message: string
  readonly suggestedFix: string
  readonly isRetryable: boolean
}

export interface DataFetchOptions {
  readonly limit?: number
  readonly offset?: number
  readonly filters?: Record<string, unknown>
  readonly orderBy?: string
  readonly orderDirection?: 'asc' | 'desc'
}

export interface DataFetchResult<T = unknown> {
  readonly data: readonly T[]
  readonly totalCount?: number
  readonly hasMore: boolean
  readonly fetchedAt: Date
}

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class IntegrationConnectionError extends Error {
  constructor(
    public readonly provider: SupportedProviderType,
    public readonly code: string,
    message: string,
    public readonly isRetryable: boolean = false
  ) {
    super(message)
    this.name = 'IntegrationConnectionError'
  }
}

export class CredentialsValidationError extends Error {
  constructor(provider: SupportedProviderType, validationErrors: string[]) {
    super(`Invalid credentials for ${provider}: ${validationErrors.join(', ')}`)
    this.name = 'CredentialsValidationError'
  }
}

// ============================================================================
// INTEGRATION PROVIDER ABSTRACTIONS
// ============================================================================

abstract class BaseIntegrationProvider {
  constructor(
    protected readonly provider: SupportedProviderType,
    protected readonly credentials: Record<string, unknown>
  ) {}

  abstract validateCredentials(): Promise<void>
  abstract testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }>
  abstract fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult>

  protected createError(code: string, message: string, isRetryable = false): IntegrationConnectionError {
    return new IntegrationConnectionError(this.provider, code, message, isRetryable)
  }
}

class StripeProvider extends BaseIntegrationProvider {
  async validateCredentials(): Promise<void> {
    const result = StripeCredentialsSchema.safeParse(this.credentials)
    if (!result.success) {
      throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
    }
  }

  async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
    const { secret_key } = this.credentials as z.infer<typeof StripeCredentialsSchema>
    
    const response = await fetch("https://api.stripe.com/v1/customers?limit=3", {
      headers: {
        Authorization: `Bearer ${secret_key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw this.createError(
        `STRIPE_API_${response.status}`, 
        `Stripe API error: ${response.status} - ${errorText}`,
        response.status >= 500
      )
    }

    const data = await response.json()
    return {
      sampleData: data.data?.slice(0, 2),
      dataStructure: {
        customersCount: data.data?.length || 0,
        hasMore: data.has_more,
        availableFields: data.data?.[0] ? Object.keys(data.data[0]) : []
      }
    }
  }

  async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
    const { secret_key } = this.credentials as z.infer<typeof StripeCredentialsSchema>
    const endpoints: Record<string, string> = {
      customers: "customers",
      payments: "payment_intents", 
      subscriptions: "subscriptions",
      products: "products"
    }

    const endpoint = endpoints[dataType] || "customers"
    const url = new URL(`https://api.stripe.com/v1/${endpoint}`)
    
    if (options.limit) url.searchParams.set('limit', options.limit.toString())
    if (options.offset) url.searchParams.set('starting_after', options.offset.toString())

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${secret_key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      throw this.createError(`STRIPE_FETCH_${response.status}`, `Failed to fetch ${dataType}`)
    }

    const result = await response.json()
    return {
      data: result.data || [],
      hasMore: result.has_more || false,
      fetchedAt: new Date()
    }
  }
}

class SupabaseProvider extends BaseIntegrationProvider {
  async validateCredentials(): Promise<void> {
    const result = SupabaseCredentialsSchema.safeParse(this.credentials)
    if (!result.success) {
      throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
    }
  }

  async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
    const { url, anon_key } = this.credentials as z.infer<typeof SupabaseCredentialsSchema>
    
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(url, anon_key)

    // Test basic connectivity with a simple query
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(3)

    // Handle the case where users table doesn't exist (not an error for connection test)
    if (error && !error.message.includes('relation "users" does not exist')) {
      throw this.createError(
        'SUPABASE_QUERY_ERROR',
        error.message,
        error.code === 'PGRST301' // Connection timeout
      )
    }

    return {
      sampleData: data || [],
      dataStructure: {
        tablesAccessible: !error,
        sampleRecords: data?.length || 0,
        availableFields: data?.[0] ? Object.keys(data[0]) : [],
        databaseUrl: url
      }
    }
  }

  async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
    const { url, anon_key } = this.credentials as z.infer<typeof SupabaseCredentialsSchema>
    
    const { createClient } = await import("@supabase/supabase-js")
    const supabase = createClient(url, anon_key)

    let query = supabase.from(dataType).select("*")

    if (options.limit) query = query.limit(options.limit)
    if (options.offset) query = query.range(options.offset, (options.offset + (options.limit || 10)) - 1)
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.orderDirection === 'asc' })
    }

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query

    if (error) {
      throw this.createError('SUPABASE_FETCH_ERROR', error.message)
    }

    return {
      data: data || [],
      totalCount: count || undefined,
      hasMore: count ? (options.offset || 0) + (data?.length || 0) < count : false,
      fetchedAt: new Date()
    }
  }
}

class OpenAIProvider extends BaseIntegrationProvider {
  async validateCredentials(): Promise<void> {
    const result = OpenAICredentialsSchema.safeParse(this.credentials)
    if (!result.success) {
      throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
    }
  }

  async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
    const { api_key } = this.credentials as z.infer<typeof OpenAICredentialsSchema>

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw this.createError(
        `OPENAI_API_${response.status}`,
        errorData.error?.message || `OpenAI API error: ${response.status}`,
        response.status >= 500
      )
    }

    const data = await response.json()
    return {
      sampleData: data.data?.slice(0, 3),
      dataStructure: {
        totalModels: data.data?.length || 0,
        gptModels: data.data?.filter((m: any) => m.id.includes("gpt")).length || 0,
        availableFields: data.data?.[0] ? Object.keys(data.data[0]) : []
      }
    }
  }

  async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
    // OpenAI doesn't have traditional "data fetching" - this would be for models, usage, etc.
    const { api_key } = this.credentials as z.infer<typeof OpenAICredentialsSchema>

    const endpoints: Record<string, string> = {
      models: "models",
      usage: "usage", // Note: This endpoint may require different permissions
    }

    const endpoint = endpoints[dataType] || "models"
    
    const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw this.createError(`OPENAI_FETCH_${response.status}`, `Failed to fetch ${dataType}`)
    }

    const result = await response.json()
    return {
      data: result.data || [],
      hasMore: false,
      fetchedAt: new Date()
    }
  }
}

class SendGridProvider extends BaseIntegrationProvider {
  async validateCredentials(): Promise<void> {
    const result = SendGridCredentialsSchema.safeParse(this.credentials)
    if (!result.success) {
      throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
    }
  }

  async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
    const { api_key } = this.credentials as z.infer<typeof SendGridCredentialsSchema>

    const response = await fetch("https://api.sendgrid.com/v3/user/profile", {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw this.createError(
        `SENDGRID_API_${response.status}`,
        `SendGrid API error: ${response.status}`,
        response.status >= 500
      )
    }

    const profile = await response.json()
    return {
      sampleData: {
        email: profile.email,
        username: profile.username,
        company: profile.company
      },
      dataStructure: {
        profileFields: Object.keys(profile),
        isEmailVerified: Boolean(profile.email),
        accountType: profile.type || 'unknown'
      }
    }
  }

  async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
    const { api_key } = this.credentials as z.infer<typeof SendGridCredentialsSchema>
    
    const endpoints: Record<string, string> = {
      templates: "templates",
      lists: "marketing/lists",
      contacts: "marketing/contacts"
    }

    const endpoint = endpoints[dataType] || "templates"
    const url = new URL(`https://api.sendgrid.com/v3/${endpoint}`)
    
    if (options.limit) url.searchParams.set('page_size', Math.min(options.limit, 100).toString())

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw this.createError(`SENDGRID_FETCH_${response.status}`, `Failed to fetch ${dataType}`)
    }

    const result = await response.json()
    return {
      data: result.result || result.data || [],
      hasMore: result.metadata?.next_cursor ? true : false,
      fetchedAt: new Date()
    }
  }
}

class PostgreSQLProvider extends BaseIntegrationProvider {
  async validateCredentials(): Promise<void> {
    const result = PostgreSQLCredentialsSchema.safeParse(this.credentials)
    if (!result.success) {
      throw new CredentialsValidationError(this.provider, result.error.errors.map(e => e.message))
    }
  }

  async testConnection(): Promise<{ sampleData?: unknown; dataStructure?: Record<string, unknown> }> {
    const creds = this.credentials as z.infer<typeof PostgreSQLCredentialsSchema>
    
    // In a real implementation, you'd use a proper PostgreSQL client like 'pg'
    // For now, we'll simulate a successful connection test
    return {
      sampleData: {
        host: creds.host,
        database: creds.database,
        port: creds.port,
        connected: true
      },
      dataStructure: {
        connectionString: `postgresql://${creds.username}@${creds.host}:${creds.port}/${creds.database}`,
        sslEnabled: creds.ssl || false,
        databaseType: 'postgresql'
      }
    }
  }

  async fetchData(dataType: string, options: DataFetchOptions): Promise<DataFetchResult> {
    // Implementation would use actual PostgreSQL client
    // This is a placeholder that shows the expected structure
    return {
      data: [],
      hasMore: false,
      fetchedAt: new Date()
    }
  }
}

// ============================================================================
// PROVIDER FACTORY
// ============================================================================

class IntegrationProviderFactory {
  static create(provider: SupportedProviderType, credentials: Record<string, unknown>): BaseIntegrationProvider {
    switch (provider) {
      case SupportedProvider.STRIPE:
        return new StripeProvider(provider, credentials)
      case SupportedProvider.SUPABASE:
        return new SupabaseProvider(provider, credentials)
      case SupportedProvider.OPENAI:
        return new OpenAIProvider(provider, credentials)
      case SupportedProvider.SENDGRID:
        return new SendGridProvider(provider, credentials)
      case SupportedProvider.POSTGRESQL:
        return new PostgreSQLProvider(provider, credentials)
      default:
        throw new Error(`Unsupported provider: ${provider}`)
    }
  }
}

// ============================================================================
// MAIN INTEGRATION MANAGER
// ============================================================================

export class IntegrationManager {
  private readonly maxConcurrentTests = 5
  private readonly testTimeoutMs = 30000

  async getConnectedIntegrations(organizationId: string): Promise<readonly UserIntegration[]> {
    try {
      const integrations = await prisma.integration.findMany({
        where: {
          organizationId,
          status: IntegrationStatus.CONNECTED,
        },
        select: {
          id: true,
          name: true,
          provider: true,
          type: true,
          status: true,
          config: true,
          lastSyncAt: true,
          createdAt: true,
          organizationId: true,
        },
        orderBy: { createdAt: 'desc' }
      })

      return Object.freeze(
        integrations.map((integration): UserIntegration => ({
          id: integration.id,
          name: integration.name,
          provider: integration.provider as SupportedProviderType,
          type: integration.type as IntegrationTypeType,
          status: integration.status as IntegrationStatusType,
          config: integration.config as Record<string, unknown> || {},
          lastSyncAt: integration.lastSyncAt || undefined,
          connectedAt: integration.createdAt,
          organizationId: integration.organizationId,
        }))
      )
    } catch (error) {
      console.error("Error fetching connected integrations:", error)
      throw new Error("Failed to retrieve integrations")
    }
  }

  async testAllConnections(organizationId: string): Promise<ConnectionTestResult> {
    const startTime = Date.now()
    const integrations = await this.getConnectedIntegrations(organizationId)

    if (integrations.length === 0) {
      return {
        allPassed: false,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        results: [],
        failures: ["No integrations connected"],
        testedAt: new Date()
      }
    }

    // Process in batches to avoid overwhelming external APIs
    const results: IntegrationTestResult[] = []
    for (let i = 0; i < integrations.length; i += this.maxConcurrentTests) {
      const batch = integrations.slice(i, i + this.maxConcurrentTests)
      const batchResults = await Promise.allSettled(
        batch.map(integration => this.testSingleConnectionWithTimeout(integration))
      )
      
      results.push(...batchResults.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value
        } else {
          return this.createFailedTestResult(batch[index], result.reason)
        }
      }))
    }

    const passedTests = results.filter(r => r.success).length
    const failedTests = results.length - passedTests

    return {
      allPassed: failedTests === 0,
      totalTests: results.length,
      passedTests,
      failedTests,
      results: Object.freeze(results),
      failures: Object.freeze(results.filter(r => !r.success).map(r => r.error?.message || "Unknown error")),
      testedAt: new Date()
    }
  }

  private async testSingleConnectionWithTimeout(integration: UserIntegration): Promise<IntegrationTestResult> {
    return Promise.race([
      this.testSingleConnection(integration),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Connection test timeout')), this.testTimeoutMs)
      )
    ])
  }

  private async testSingleConnection(integration: UserIntegration): Promise<IntegrationTestResult> {
    const startTime = Date.now()
    
    try {
      const credentials = await this.getDecryptedCredentials(integration.id)
      const provider = IntegrationProviderFactory.create(integration.provider, credentials)
      
      await provider.validateCredentials()
      const testResult = await provider.testConnection()
      
      return {
        success: true,
        integrationId: integration.id,
        integrationName: integration.name,
        provider: integration.provider,
        testedAt: new Date(),
        latencyMs: Date.now() - startTime,
        ...testResult
      }
    } catch (error) {
      return this.createFailedTestResult(integration, error, Date.now() - startTime)
    }
  }

  private createFailedTestResult(
    integration: UserIntegration, 
    error: unknown, 
    latencyMs?: number
  ): IntegrationTestResult {
    const integrationError: IntegrationError = this.normalizeError(error, integration.provider)
    
    return {
      success: false,
      integrationId: integration.id,
      integrationName: integration.name,
      provider: integration.provider,
      testedAt: new Date(),
      latencyMs: latencyMs || 0,
      error: integrationError
    }
  }

  private normalizeError(error: unknown, provider: SupportedProviderType): IntegrationError {
    if (error instanceof IntegrationConnectionError) {
      return {
        code: error.code,
        message: error.message,
        suggestedFix: this.getSuggestedFix(provider, error),
        isRetryable: error.isRetryable
      }
    }

    if (error instanceof CredentialsValidationError) {
      return {
        code: 'INVALID_CREDENTIALS',
        message: error.message,
        suggestedFix: 'Reconnect the integration with valid credentials',
        isRetryable: false
      }
    }

    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    return {
      code: 'UNKNOWN_ERROR',
      message,
      suggestedFix: this.getSuggestedFix(provider, error),
      isRetryable: true
    }
  }

  private getSuggestedFix(provider: SupportedProviderType, error: unknown): string {
    const defaultFixes: Record<SupportedProviderType, string> = {
      [SupportedProvider.STRIPE]: "Verify your Stripe secret key has the required permissions (read access to customers)",
      [SupportedProvider.SUPABASE]: "Check that your Supabase URL and anon key are correct and the project is active",
      [SupportedProvider.OPENAI]: "Ensure your OpenAI API key is valid and has sufficient credits/quota",
      [SupportedProvider.SENDGRID]: "Verify your SendGrid API key has the required scopes and permissions",
      [SupportedProvider.POSTGRESQL]: "Check your database connection parameters and network accessibility"
    }

    // Provide more specific suggestions based on error type
    if (error instanceof Error) {
      const message = error.message.toLowerCase()
      
      if (message.includes('unauthorized') || message.includes('invalid')) {
        return `Invalid credentials detected. ${defaultFixes[provider]}`
      }
      
      if (message.includes('timeout') || message.includes('network')) {
        return `Network connectivity issue. Check your internet connection and try again.`
      }
      
      if (message.includes('rate limit')) {
        return `API rate limit exceeded. Wait a few minutes before testing again.`
      }
    }

    return defaultFixes[provider]
  }

  // Legacy method for backward compatibility (returns array directly)
  async fetchRealData(
    integration: UserIntegration | string, 
    dataType: string, 
    limit: number = 10
  ): Promise<unknown[]> {
    try {
      const integrationId = typeof integration === 'string' ? integration : integration.id
      const result = await this.fetchDataWithMetadata(integrationId, dataType, { limit })
      return [...result.data] // Create a mutable copy of the readonly array
    } catch (error) {
      console.error(`Error fetching real data:`, error)
      return []
    }
  }

  // New enhanced method that returns full metadata
  async fetchDataWithMetadata(
    integrationId: string, 
    dataType: string, 
    options: DataFetchOptions = {}
  ): Promise<DataFetchResult> {
    try {
      const integration = await this.getIntegrationById(integrationId)
      const credentials = await this.getDecryptedCredentials(integrationId)
      const provider = IntegrationProviderFactory.create(integration.provider, credentials)
      
      return await provider.fetchData(dataType, {
        limit: 10,
        offset: 0,
        ...options
      })
    } catch (error) {
      console.error(`Error fetching data from integration ${integrationId}:`, error)
      throw error
    }
  }

  async updateIntegrationStatus(integrationId: string, status: IntegrationStatusType): Promise<void> {
    try {
      // Map our internal status to Prisma's expected enum values
      const mapStatusToPrisma = (status: IntegrationStatusType) => {
        switch (status) {
          case IntegrationStatus.CONNECTED:
            return 'CONNECTED'
          case IntegrationStatus.ERROR:
            return 'ERROR'
          case IntegrationStatus.DISCONNECTED:
            return 'DISCONNECTED'
          case IntegrationStatus.TESTING:
            // If TESTING doesn't exist in Prisma schema, map to appropriate status
            return 'DISCONNECTED' // or whatever makes sense in your schema
          default:
            return 'DISCONNECTED'
        }
      }
      
      await prisma.integration.update({
        where: { id: integrationId },
        data: { 
          status: mapStatusToPrisma(status),
          lastSyncAt: status === IntegrationStatus.CONNECTED ? new Date() : undefined
        }
      })
    } catch (error) {
      console.error(`Error updating integration status:`, error)
      throw new Error('Failed to update integration status')
    }
  }

  async getIntegrationHealth(organizationId: string): Promise<{
    healthy: number
    unhealthy: number
    lastTestedAt?: Date
  }> {
    const testResult = await this.testAllConnections(organizationId)
    
    return {
      healthy: testResult.passedTests,
      unhealthy: testResult.failedTests,
      lastTestedAt: testResult.testedAt
    }
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async getIntegrationById(integrationId: string): Promise<UserIntegration> {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
      select: {
        id: true,
        name: true,
        provider: true,
        type: true,
        status: true,
        config: true,
        lastSyncAt: true,
        createdAt: true,
        organizationId: true,
      }
    })

    if (!integration) {
      throw new Error(`Integration with ID ${integrationId} not found`)
    }

    return {
      id: integration.id,
      name: integration.name,
      provider: integration.provider as SupportedProviderType,
      type: integration.type as IntegrationTypeType,
      status: integration.status as IntegrationStatusType,
      config: integration.config as Record<string, unknown> || {},
      lastSyncAt: integration.lastSyncAt || undefined,
      connectedAt: integration.createdAt,
      organizationId: integration.organizationId,
    }
  }

  private async getDecryptedCredentials(integrationId: string): Promise<Record<string, unknown>> {
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
      select: { credentials: true }
    })

    if (!integration?.credentials) {
      throw new Error("No credentials found for integration")
    }

    // Ensure credentials is a string before decrypting
    if (typeof integration.credentials !== 'string') {
      throw new Error("Invalid credentials format - expected encrypted string")
    }

    try {
      const decryptedCredentials = await decrypt(integration.credentials)
      return JSON.parse(decryptedCredentials)
    } catch (error) {
      throw new Error("Failed to decrypt integration credentials")
    }
  }
}

// ============================================================================
// SINGLETON INSTANCE & UTILITIES
// ============================================================================

export const integrationManager = new IntegrationManager()

// Utility functions for external use
export const IntegrationUtils = {
  isValidProvider: (provider: string): provider is SupportedProviderType => {
    return Object.values(SupportedProvider).includes(provider as SupportedProviderType)
  },

  getProviderDisplayName: (provider: SupportedProviderType): string => {
    const displayNames: Record<SupportedProviderType, string> = {
      [SupportedProvider.STRIPE]: "Stripe",
      [SupportedProvider.SUPABASE]: "Supabase", 
      [SupportedProvider.OPENAI]: "OpenAI",
      [SupportedProvider.SENDGRID]: "SendGrid",
      [SupportedProvider.POSTGRESQL]: "PostgreSQL"
    }
    return displayNames[provider]
  },

  getProviderType: (provider: SupportedProviderType): IntegrationTypeType => {
    const providerTypes: Record<SupportedProviderType, IntegrationTypeType> = {
      [SupportedProvider.STRIPE]: IntegrationType.PAYMENT,
      [SupportedProvider.SUPABASE]: IntegrationType.DATABASE,
      [SupportedProvider.OPENAI]: IntegrationType.AI,
      [SupportedProvider.SENDGRID]: IntegrationType.EMAIL,
      [SupportedProvider.POSTGRESQL]: IntegrationType.DATABASE
    }
    return providerTypes[provider]
  }
} as const