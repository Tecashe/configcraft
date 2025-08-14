// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"
// import { rateLimiter, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
// import { addSecurityHeaders, setCORSHeaders, logSecurityEvent } from "@/lib/security"
// import { requestLogger, createRequestLog } from "@/lib/monitoring"

// // Define public routes that don't require authentication
// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/auth/signin(.*)",
//   "/auth/signup(.*)",
//   "/api/webhooks/clerk",
//   "/api/webhooks/stripe",
// ])

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   const startTime = Date.now()
//   const requestLog = createRequestLog(req)

//   // Handle CORS preflight requests
//   if (req.method === "OPTIONS") {
//     const response = new NextResponse(null, { status: 200 })
//     return setCORSHeaders(response, req.headers.get("origin") || undefined)
//   }

//   // Apply rate limiting
//   const identifier = getClientIdentifier(req)
//   const pathname = req.nextUrl.pathname

//   let rateLimitConfig = RATE_LIMITS.api // default

//   // Apply specific rate limits based on route
//   if (pathname.startsWith("/api/auth")) {
//     rateLimitConfig = RATE_LIMITS.auth
//   } else if (pathname.startsWith("/api/upload")) {
//     rateLimitConfig = RATE_LIMITS.upload
//   } else if (pathname.startsWith("/api/tools/generate") || pathname.startsWith("/api/tools/analyze")) {
//     rateLimitConfig = RATE_LIMITS.ai
//   } else if (pathname.startsWith("/api/webhooks")) {
//     rateLimitConfig = RATE_LIMITS.webhook
//   }

//   const rateLimit = await rateLimiter.limit(identifier, rateLimitConfig)

//   if (!rateLimit.success) {
//     logSecurityEvent(
//       "RATE_LIMIT_EXCEEDED",
//       {
//         identifier,
//         pathname,
//         remaining: rateLimit.remaining,
//       },
//       req,
//     )

//     const response = NextResponse.json({ error: "Too many requests" }, { status: 429 })

//     response.headers.set("X-RateLimit-Limit", rateLimitConfig.uniqueTokenPerInterval.toString())
//     response.headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString())
//     response.headers.set("X-RateLimit-Reset", rateLimit.resetTime.toString())

//     return addSecurityHeaders(response)
//   }

//   // Protect private routes
//   if (!isPublicRoute(req)) {
//     await auth.protect()
//   }

//   // Log request with user context if authenticated
//   const { userId } = await auth()
//   requestLogger.log({
//     ...requestLog,
//     userId: userId || undefined,
//     duration: Date.now() - startTime,
//   })

//   // Create response with security headers
//   const response = NextResponse.next()

//   // Add security headers to all responses
//   addSecurityHeaders(response)

//   // Add CORS headers for API routes
//   if (req.nextUrl.pathname.startsWith("/api")) {
//     setCORSHeaders(response, req.headers.get("origin") || undefined)
//   }

//   // Add user context to headers if authenticated
//   if (userId) {
//     response.headers.set("x-user-id", userId)
//   }

//   return response
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// }

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { type NextRequest, NextResponse } from "next/server"
import { rateLimiter, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
import { addSecurityHeaders, setCORSHeaders, logSecurityEvent } from "@/lib/security"
import { requestLogger, createRequestLog } from "@/lib/monitoring"

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/auth/signin(.*)",
  "/auth/signup(.*)",
  "/api/webhooks/clerk",
  "/api/webhooks/stripe",
  "/api/monitoring/health",
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
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

  // Protect private routes
  if (!isPublicRoute(req)) {
    await auth.protect()
  }

  // Get user info for authenticated requests
  const { userId } = await auth()

  // Handle organization-based routing and redirects
  if (userId && !isPublicRoute(req)) {
    // Handle old dashboard redirect
    if (pathname === "/dashboard") {
      // Redirect to onboarding for new users or to their organization dashboard
      const onboardingUrl = new URL("/onboarding", req.url)
      return NextResponse.redirect(onboardingUrl)
    }

    // Handle old route redirects (tools, templates, integrations, billing, settings)
    const oldRoutes = ["/tools", "/templates", "/integrations", "/billing", "/settings"]
    const matchedOldRoute = oldRoutes.find((route) => pathname.startsWith(route))

    if (matchedOldRoute) {
      // Redirect to onboarding to set up organization first
      const onboardingUrl = new URL("/onboarding", req.url)
      return NextResponse.redirect(onboardingUrl)
    }

    // Handle organization routes - validate slug format
    const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
    if (orgRouteMatch) {
      const [, slug, page] = orgRouteMatch

      // Basic slug validation (alphanumeric and hyphens only)
      if (!/^[a-z0-9-]+$/.test(slug)) {
        const onboardingUrl = new URL("/onboarding", req.url)
        return NextResponse.redirect(onboardingUrl)
      }

      // Add organization context to headers for API routes
      const response = NextResponse.next()
      response.headers.set("x-organization-slug", slug)
      response.headers.set("x-current-page", page)

      // Continue with security headers and logging below
    }
  }

  // Log request with user context if authenticated
  requestLogger.log({
    ...requestLog,
    userId: userId || undefined,
    duration: Date.now() - startTime,
  })

  // Create response with security headers
  const response = NextResponse.next()

  // Add security headers to all responses
  addSecurityHeaders(response)

  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith("/api")) {
    setCORSHeaders(response, req.headers.get("origin") || undefined)
  }

  // Add user context to headers if authenticated
  if (userId) {
    response.headers.set("x-user-id", userId)
  }

  // Add organization context if we're on an org route
  const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
  if (orgRouteMatch && userId) {
    const [, slug] = orgRouteMatch
    response.headers.set("x-organization-slug", slug)
  }

  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}
