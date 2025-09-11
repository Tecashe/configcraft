import type { NextRequest } from "next/server"

export interface RequestLog {
  timestamp: string
  method: string
  url: string
  ip: string
  userAgent: string
  userId?: string
  companyId?: string
  duration?: number
  status?: number
  error?: string
}

class RequestLogger {
  private logs: RequestLog[] = []
  private maxLogs = 1000

  log(data: RequestLog) {
    this.logs.push(data)

    // Keep only recent logs in memory
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === "production") {
      this.sendToMonitoring(data)
    }
  }

  private sendToMonitoring(data: RequestLog) {
    // Send to your monitoring service (DataDog, New Relic, etc.)
    // console.log("REQUEST_LOG:", JSON.stringify(data))
  }

  getRecentLogs(limit = 100): RequestLog[] {
    return this.logs.slice(-limit)
  }

  getErrorLogs(limit = 50): RequestLog[] {
    return this.logs.filter((log) => log.error || (log.status && log.status >= 400)).slice(-limit)
  }
}

export const requestLogger = new RequestLogger()

export function createRequestLog(req: NextRequest): Omit<RequestLog, "duration" | "status" | "error"> {
  return {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    ip: req.headers.get("x-forwarded-for") || req.ip || "unknown",
    userAgent: req.headers.get("user-agent") || "unknown",
    userId: req.headers.get("x-user-id") || undefined,
    companyId: req.headers.get("x-company-id") || undefined,
  }
}

export function logError(error: Error, context?: Record<string, any>) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
  }

  console.error("APPLICATION_ERROR:", JSON.stringify(errorLog))

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === "production") {
    // Send to Sentry, Bugsnag, etc.
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number[]> = new Map()

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const values = this.metrics.get(name)!
    values.push(value)

    // Keep only recent values
    if (values.length > 1000) {
      values.splice(0, values.length - 1000)
    }
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return 0

    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  getMetricPercentile(name: string, percentile: number): number {
    const values = this.metrics.get(name)
    if (!values || values.length === 0) return 0

    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[index] || 0
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance()
