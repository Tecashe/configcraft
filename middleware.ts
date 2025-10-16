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
    // ✅ REMOVED THE PROBLEMATIC REDIRECT!
    // Let /dashboard page handle the logic itself
    // It will check if user has organizations and redirect accordingly
    
    // Handle old route redirects (tools, templates, integrations, billing, settings)
    // These routes require an organization context
    const oldRoutes = ["/tools", "/templates", "/integrations", "/billing", "/settings"]
    const matchedOldRoute = oldRoutes.find((route) => pathname.startsWith(route))

    if (matchedOldRoute) {
      // Redirect to dashboard which will handle organization routing
      const dashboardUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(dashboardUrl)
    }

    // Handle organization routes - validate slug format
    const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
    if (orgRouteMatch) {
      const [, slug, page] = orgRouteMatch

      // Basic slug validation (alphanumeric and hyphens only)
      if (!/^[a-z0-9-]+$/.test(slug)) {
        const dashboardUrl = new URL("/dashboard", req.url)
        return NextResponse.redirect(dashboardUrl)
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
//   "/api/monitoring/health",
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

//   // Get user info for authenticated requests
//   const { userId } = await auth()

//   // Handle organization-based routing and redirects
//   if (userId && !isPublicRoute(req)) {
//     // Handle old dashboard redirect
//     if (pathname === "/dashboard") {
//       // Redirect to onboarding for new users or to their organization dashboard
//       const onboardingUrl = new URL("/onboarding", req.url)
//       return NextResponse.redirect(onboardingUrl)
//     }

//     // Handle old route redirects (tools, templates, integrations, billing, settings)
//     const oldRoutes = ["/tools", "/templates", "/integrations", "/billing", "/settings"]
//     const matchedOldRoute = oldRoutes.find((route) => pathname.startsWith(route))

//     if (matchedOldRoute) {
//       // Redirect to onboarding to set up organization first
//       const onboardingUrl = new URL("/onboarding", req.url)
//       return NextResponse.redirect(onboardingUrl)
//     }

//     // Handle organization routes - validate slug format
//     const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
//     if (orgRouteMatch) {
//       const [, slug, page] = orgRouteMatch

//       // Basic slug validation (alphanumeric and hyphens only)
//       if (!/^[a-z0-9-]+$/.test(slug)) {
//         const onboardingUrl = new URL("/onboarding", req.url)
//         return NextResponse.redirect(onboardingUrl)
//       }

//       // Add organization context to headers for API routes
//       const response = NextResponse.next()
//       response.headers.set("x-organization-slug", slug)
//       response.headers.set("x-current-page", page)

//       // Continue with security headers and logging below
//     }
//   }

//   // Log request with user context if authenticated
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

//   // Add organization context if we're on an org route
//   const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
//   if (orgRouteMatch && userId) {
//     const [, slug] = orgRouteMatch
//     response.headers.set("x-organization-slug", slug)
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




// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
// import { type NextRequest, NextResponse } from "next/server"
// import { rateLimiter, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limit"
// import { addSecurityHeaders, setCORSHeaders, logSecurityEvent } from "@/lib/security"
// import { requestLogger, createRequestLog } from "@/lib/monitoring"
// import { prisma } from "@/lib/prisma"

// // Define public routes that don't require authentication
// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/auth/signin(.*)",
//   "/auth/signup(.*)",
//   "/api/webhooks/clerk",
//   "/api/webhooks/stripe",
//   "/api/monitoring/health",
// ])

// // Helper function to check if user has organizations with COMPREHENSIVE LOGGING
// async function getUserFirstOrganization(userId: string): Promise<string | null> {
//   console.log(`🔍 [MIDDLEWARE] Checking organizations for user: ${userId}`)

//   try {
//     // Ensure user exists in our database
//     console.log(`📊 [MIDDLEWARE] Looking up user in database...`)
//     let user = await prisma.user.findUnique({
//       where: { clerkId: userId },
//     })

//     if (!user) {
//       console.log(`⚠️ [MIDDLEWARE] User not found in DB, creating fallback user...`)
//       // Create user if they don't exist (fallback for webhook issues)
//       user = await prisma.user.create({
//         data: {
//           clerkId: userId,
//           email: `${userId}@temp.com`, // Temporary email, should be updated by webhook
//         },
//       })
//       console.log(`✅ [MIDDLEWARE] Fallback user created with ID: ${user.id}`)
//     } else {
//       console.log(`✅ [MIDDLEWARE] User found in DB with ID: ${user.id}`)
//     }

//     // Check if user owns any organizations
//     console.log(`🏢 [MIDDLEWARE] Checking owned organizations...`)
//     const ownedOrg = await prisma.organization.findFirst({
//       where: { ownerId: user.id },
//       orderBy: { createdAt: "asc" },
//     })

//     if (ownedOrg) {
//       console.log(`👑 [MIDDLEWARE] User OWNS organization: ${ownedOrg.slug} (${ownedOrg.name})`)
//       return ownedOrg.slug
//     } else {
//       console.log(`❌ [MIDDLEWARE] User owns NO organizations`)
//     }

//     // Check if user is a member of any organizations
//     console.log(`👥 [MIDDLEWARE] Checking organization memberships...`)
//     const memberOrg = await prisma.organizationMember.findFirst({
//       where: {
//         userId,
//         status: "ACTIVE",
//       },
//       include: {
//         organization: true,
//       },
//       orderBy: {
//         organization: {
//           createdAt: "asc",
//         },
//       },
//     })

//     if (memberOrg) {
//       console.log(
//         `🤝 [MIDDLEWARE] User is MEMBER of organization: ${memberOrg.organization.slug} (${memberOrg.organization.name})`,
//       )
//       return memberOrg.organization.slug
//     } else {
//       console.log(`❌ [MIDDLEWARE] User is NOT a member of any organizations`)
//     }

//     console.log(`🚫 [MIDDLEWARE] User has NO organizations at all - should go to onboarding`)
//     return null
//   } catch (error) {
//     console.error(`💥 [MIDDLEWARE] ERROR checking user organizations:`, error)
//     console.error(`💥 [MIDDLEWARE] Error details:`, {
//       message: error instanceof Error ? error.message : "Unknown error",
//       stack: error instanceof Error ? error.stack : undefined,
//       userId,
//     })
//     return null
//   }
// }

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   const startTime = Date.now()
//   const requestLog = createRequestLog(req)
//   const pathname = req.nextUrl.pathname

//   console.log(`🚀 [MIDDLEWARE] Processing request: ${req.method} ${pathname}`)

//   // Handle CORS preflight requests
//   if (req.method === "OPTIONS") {
//     console.log(`✈️ [MIDDLEWARE] Handling CORS preflight for: ${pathname}`)
//     const response = new NextResponse(null, { status: 200 })
//     return setCORSHeaders(response, req.headers.get("origin") || undefined)
//   }

//   // Apply rate limiting
//   const identifier = getClientIdentifier(req)

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
//     console.log(`🚫 [MIDDLEWARE] Rate limit exceeded for ${identifier} on ${pathname}`)
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

//   // Check if route is public
//   const isPublic = isPublicRoute(req)
//   console.log(`🔒 [MIDDLEWARE] Route ${pathname} is ${isPublic ? "PUBLIC" : "PROTECTED"}`)

//   // Protect private routes
//   if (!isPublic) {
//     console.log(`🛡️ [MIDDLEWARE] Protecting route: ${pathname}`)
//     await auth.protect()
//   }

//   // Get user info for authenticated requests
//   const { userId } = await auth()
//   console.log(`👤 [MIDDLEWARE] User ID: ${userId || "ANONYMOUS"}`)

//   // Handle organization-based routing and redirects
//   if (userId && !isPublic) {
//     console.log(`🎯 [MIDDLEWARE] Processing authenticated user routing for: ${pathname}`)

//     // Handle old dashboard redirect
//     if (pathname === "/dashboard") {
//       console.log(`📊 [MIDDLEWARE] User accessing old /dashboard route`)

//       // Check if user has existing organizations
//       const firstOrgSlug = await getUserFirstOrganization(userId)

//       if (firstOrgSlug) {
//         // Redirect existing users to their organization dashboard
//         const orgDashboardUrl = new URL(`/${firstOrgSlug}/dashboard`, req.url)
//         console.log(`↗️ [MIDDLEWARE] Redirecting existing user to: ${orgDashboardUrl.pathname}`)
//         return NextResponse.redirect(orgDashboardUrl)
//       } else {
//         // Redirect new users to onboarding
//         const onboardingUrl = new URL("/onboarding", req.url)
//         console.log(`🆕 [MIDDLEWARE] Redirecting new user to onboarding: ${onboardingUrl.pathname}`)
//         return NextResponse.redirect(onboardingUrl)
//       }
//     }

//     // Handle old route redirects (tools, templates, integrations, billing, settings)
//     const oldRoutes = ["/tools", "/templates", "/integrations", "/billing", "/settings"]
//     const matchedOldRoute = oldRoutes.find((route) => pathname.startsWith(route))

//     if (matchedOldRoute) {
//       console.log(`🔄 [MIDDLEWARE] User accessing old route: ${matchedOldRoute}`)

//       // Check if user has existing organizations
//       const firstOrgSlug = await getUserFirstOrganization(userId)

//       if (firstOrgSlug) {
//         // Redirect existing users to their organization's equivalent page
//         const routeName = matchedOldRoute.substring(1) // Remove leading slash
//         const orgRouteUrl = new URL(`/${firstOrgSlug}/${routeName}`, req.url)
//         console.log(`↗️ [MIDDLEWARE] Redirecting existing user to: ${orgRouteUrl.pathname}`)
//         return NextResponse.redirect(orgRouteUrl)
//       } else {
//         const onboardingUrl = new URL("/onboarding", req.url)
//         console.log(`🆕 [MIDDLEWARE] Redirecting new user to onboarding: ${onboardingUrl.pathname}`)
//         return NextResponse.redirect(onboardingUrl)
//       }
//     }

//     // Handle organization routes - validate slug format
//     const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
//     if (orgRouteMatch) {
//       const [, slug, page] = orgRouteMatch
//       console.log(`🏢 [MIDDLEWARE] Processing organization route: /${slug}/${page}`)

//       // Basic slug validation (alphanumeric and hyphens only)
//       if (!/^[a-z0-9-]+$/.test(slug)) {
//         console.log(`❌ [MIDDLEWARE] Invalid slug format: ${slug}`)

//         // Check if user has existing organizations before redirecting to onboarding
//         const firstOrgSlug = await getUserFirstOrganization(userId)

//         if (firstOrgSlug) {
//           // Redirect to their valid organization
//           const orgRouteUrl = new URL(`/${firstOrgSlug}/${page}`, req.url)
//           console.log(`↗️ [MIDDLEWARE] Redirecting to valid org: ${orgRouteUrl.pathname}`)
//           return NextResponse.redirect(orgRouteUrl)
//         } else {
//           const onboardingUrl = new URL("/onboarding", req.url)
//           console.log(`🆕 [MIDDLEWARE] No valid orgs, redirecting to onboarding: ${onboardingUrl.pathname}`)
//           return NextResponse.redirect(onboardingUrl)
//         }
//       }

//       console.log(`✅ [MIDDLEWARE] Valid organization route, continuing...`)
//     }
//   }

//   // Log request with user context if authenticated
//   requestLogger.log({
//     ...requestLog,
//     userId: userId || undefined,
//     duration: Date.now() - startTime,
//   })

//   console.log(`⏱️ [MIDDLEWARE] Request processed in ${Date.now() - startTime}ms`)

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

//   // Add organization context if we're on an org route
//   const orgRouteMatch = pathname.match(/^\/([^/]+)\/(dashboard|tools|templates|integrations|billing|settings)/)
//   if (orgRouteMatch && userId) {
//     const [, slug] = orgRouteMatch
//     response.headers.set("x-organization-slug", slug)
//   }

//   console.log(`✅ [MIDDLEWARE] Response ready for: ${pathname}`)
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
