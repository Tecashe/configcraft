import type { NextRequest } from "next/server"

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

class RateLimiter {
  private cache = new Map<string, { count: number; resetTime: number }>()

  async limit(
    identifier: string,
    config: RateLimitConfig,
  ): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const key = identifier
    const windowStart = now - config.interval

    // Clean up old entries
    for (const [k, v] of this.cache.entries()) {
      if (v.resetTime < now) {
        this.cache.delete(k)
      }
    }

    const current = this.cache.get(key)

    if (!current || current.resetTime < now) {
      // First request in window or window expired
      this.cache.set(key, {
        count: 1,
        resetTime: now + config.interval,
      })
      return {
        success: true,
        remaining: config.uniqueTokenPerInterval - 1,
        resetTime: now + config.interval,
      }
    }

    if (current.count >= config.uniqueTokenPerInterval) {
      // Rate limit exceeded
      return {
        success: false,
        remaining: 0,
        resetTime: current.resetTime,
      }
    }

    // Increment counter
    current.count++
    this.cache.set(key, current)

    return {
      success: true,
      remaining: config.uniqueTokenPerInterval - current.count,
      resetTime: current.resetTime,
    }
  }
}

export const rateLimiter = new RateLimiter()

export function getClientIdentifier(req: NextRequest): string {
  // Try to get user ID from headers (set by Clerk)
  const userId = req.headers.get("x-user-id")
  if (userId) return `user:${userId}`

  // Fallback to IP address
  const forwarded = req.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : req.ip || "unknown"
  return `ip:${ip}`
}

export const RATE_LIMITS = {
  // API endpoints
  api: { interval: 60 * 1000, uniqueTokenPerInterval: 100 }, // 100 requests per minute
  auth: { interval: 15 * 60 * 1000, uniqueTokenPerInterval: 5 }, // 5 auth attempts per 15 minutes
  upload: { interval: 60 * 1000, uniqueTokenPerInterval: 10 }, // 10 uploads per minute
  ai: { interval: 60 * 1000, uniqueTokenPerInterval: 20 }, // 20 AI requests per minute

  // Webhooks
  webhook: { interval: 60 * 1000, uniqueTokenPerInterval: 1000 }, // 1000 webhook calls per minute
}
