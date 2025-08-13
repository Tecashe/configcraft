import { authMiddleware } from "@clerk/nextjs"
import { type NextRequest, NextResponse } from "next/server"
import { rateLimiter, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { addSecurityHeaders, setCORSHeaders, logSecurityEvent } from "@/lib/security"
import { requestLogger, createRequestLog } from "@/lib/monitoring"

export default authMiddleware({
  // Routes that can be accessed while signed out
  publicRoutes: ["/", "/auth/signin", "/auth/signup", "/api/webhooks/clerk", "/api/webhooks/stripe"],
  // Routes that can always be accessed, and have
  // no authentication information
  ignoredRoutes: ["/api/webhooks/clerk", "/api/webhooks/stripe"],

  beforeAuth: async (req: NextRequest) => {
    const startTime = Date.now()
    const requestLog = createRequestLog(req)

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 200 })
      return setCORSHeaders(response, req.headers.get("origin") || undefined)
    }

    // Apply rate limiting
    const identifier = getClientIdentifier(req)
    const pathname = req.nextUrl.pathname

    let rateLimitConfig = RATE_LIMITS.api // default

    // Apply specific rate limits based on route
    if (pathname.startsWith("/api/auth")) {
      rateLimitConfig = RATE_LIMITS.auth
    } else if (pathname.startsWith("/api/upload")) {
      rateLimitConfig = RATE_LIMITS.upload
    } else if (pathname.startsWith("/api/tools/generate") || pathname.startsWith("/api/tools/analyze")) {
      rateLimitConfig = RATE_LIMITS.ai
    } else if (pathname.startsWith("/api/webhooks")) {
      rateLimitConfig = RATE_LIMITS.webhook
    }

    const rateLimit = await rateLimiter.limit(identifier, rateLimitConfig)

    if (!rateLimit.success) {
      logSecurityEvent(
        "RATE_LIMIT_EXCEEDED",
        {
          identifier,
          pathname,
          remaining: rateLimit.remaining,
        },
        req,
      )

      const response = NextResponse.json({ error: "Too many requests" }, { status: 429 })

      response.headers.set("X-RateLimit-Limit", rateLimitConfig.uniqueTokenPerInterval.toString())
      response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
      response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString())

      return addSecurityHeaders(response)
    }

    // Log request
    requestLogger.log({
      ...requestLog,
      duration: Date.now() - startTime,
    })

    return null // Continue to next middleware
  },

  afterAuth: (auth, req: NextRequest) => {
    // Add user context to logs if authenticated
    if (auth.userId) {
      req.headers.set("x-user-id", auth.userId)
    }

    return null // Continue
  },

  // Custom response handler to add security headers
  onSuccess: (req: NextRequest) => {
    const response = NextResponse.next()

    // Add security headers to all responses
    addSecurityHeaders(response)

    // Add CORS headers for API routes
    if (req.nextUrl.pathname.startsWith("/api")) {
      setCORSHeaders(response, req.headers.get("origin") || undefined)
    }

    return response
  },

  onError: (error: any, req: NextRequest) => {
    console.error("Auth middleware error:", error)

    logSecurityEvent(
      "AUTH_MIDDLEWARE_ERROR",
      {
        error: error.message,
        pathname: req.nextUrl.pathname,
      },
      req,
    )

    const response = NextResponse.json({ error: "Authentication error" }, { status: 500 })

    return addSecurityHeaders(response)
  },
})

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
