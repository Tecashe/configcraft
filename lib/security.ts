// import type { NextRequest, NextResponse } from "next/server"
// import { z } from "zod"

// export function addSecurityHeaders(response: NextResponse): NextResponse {
//   // Content Security Policy
//   response.headers.set(
//     "Content-Security-Policy",
//     [
//       "default-src 'self'",
//       "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://*.clerk.accounts.dev https://*.clerk.com https://www.google.com https://www.gstatic.com https://accounts.google.com",
//       "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//       "font-src 'self' https://fonts.gstatic.com",
//       "img-src 'self' data: https: blob:",
//       "connect-src 'self' https://api.openai.com https://api.stripe.com https://checkout.stripe.com https://*.clerk.accounts.dev https://*.clerk.com https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com",
//       "frame-src https://js.stripe.com https://checkout.stripe.com https://accounts.google.com https://www.google.com",
//       "object-src 'none'",
//       "base-uri 'self'",
//       "form-action 'self'",
//     ].join("; "),
//   )

//   // Security headers
//   response.headers.set("X-Frame-Options", "DENY")
//   response.headers.set("X-Content-Type-Options", "nosniff")
//   response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
//   response.headers.set("X-XSS-Protection", "1; mode=block")
//   response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

//   // HSTS (only in production)
//   if (process.env.NODE_ENV === "production") {
//     response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
//   }

//   return response
// }

// export function setCORSHeaders(response: NextResponse, origin?: string): NextResponse {
//   const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000", "https://localhost:3000"].filter(
//     Boolean,
//   )

//   if (origin && allowedOrigins.includes(origin)) {
//     response.headers.set("Access-Control-Allow-Origin", origin)
//   }

//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//   response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
//   response.headers.set("Access-Control-Max-Age", "86400")

//   return response
// }

// // Input validation schemas
// export const schemas = {
//   email: z.string().email().max(255),
//   password: z.string().min(8).max(128),
//   name: z.string().min(1).max(100).trim(),
//   description: z.string().max(2000).trim(),
//   url: z.string().url().max(500),
//   slug: z
//     .string()
//     .regex(/^[a-z0-9-]+$/)
//     .min(1)
//     .max(100),
//   id: z.string().uuid(),
// }

// export function validateInput<T>(
//   schema: z.ZodSchema<T>,
//   data: unknown,
// ): { success: true; data: T } | { success: false; error: string } {
//   try {
//     const result = schema.parse(data)
//     return { success: true, data: result }
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return { success: false, error: error.errors.map((e) => e.message).join(", ") }
//     }
//     return { success: false, error: "Invalid input" }
//   }
// }

// export function sanitizeHtml(input: string): string {
//   // Basic HTML sanitization - remove script tags and dangerous attributes
//   return input
//     .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
//     .replace(/javascript:/gi, "")
//     .replace(/on\w+\s*=/gi, "")
//     .trim()
// }

// export function logSecurityEvent(event: string, details: Record<string, any>, req?: NextRequest) {
//   const logData = {
//     timestamp: new Date().toISOString(),
//     event,
//     details,
//     ip: req?.headers.get("x-forwarded-for") || req?.ip,
//     userAgent: req?.headers.get("user-agent"),
//     url: req?.url,
//   }

//   console.warn("SECURITY_EVENT:", JSON.stringify(logData))

//   // In production, send to monitoring service
//   if (process.env.NODE_ENV === "production") {
//     // Send to Sentry, DataDog, etc.
//   }
// }

import type { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.stripe.com https://*.clerk.accounts.dev https://*.clerk.com https://www.google.com https://www.gstatic.com https://accounts.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.openai.com https://api.stripe.com https://checkout.stripe.com https://*.clerk.accounts.dev https://*.clerk.com https://accounts.google.com https://www.googleapis.com https://oauth2.googleapis.com https://clerk-telemetry.com",
      "frame-src https://js.stripe.com https://checkout.stripe.com https://accounts.google.com https://www.google.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  )

  // Security headers
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // HSTS (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload")
  }

  return response
}

export function setCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL, "http://localhost:3000", "https://localhost:3000"].filter(
    Boolean,
  )

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  response.headers.set("Access-Control-Max-Age", "86400")

  return response
}

// Input validation schemas
export const schemas = {
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
  name: z.string().min(1).max(100).trim(),
  description: z.string().max(2000).trim(),
  url: z.string().url().max(500),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .min(1)
    .max(100),
  id: z.string().uuid(),
}

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors.map((e) => e.message).join(", ") }
    }
    return { success: false, error: "Invalid input" }
  }
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim()
}

export function logSecurityEvent(event: string, details: Record<string, any>, req?: NextRequest) {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req?.headers.get("x-forwarded-for") || req?.ip,
    userAgent: req?.headers.get("user-agent"),
    url: req?.url,
  }

  console.warn("SECURITY_EVENT:", JSON.stringify(logData))

  // In production, send to monitoring service
  if (process.env.NODE_ENV === "production") {
    // Send to Sentry, DataDog, etc.
  }
}
