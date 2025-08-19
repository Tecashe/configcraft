// import crypto from "crypto"
// import type { NextResponse } from "next/server"

// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "your-32-character-secret-key-here"
// const ALGORITHM = "aes-256-gcm"

// // Security headers configuration
// const SECURITY_HEADERS = {
//   "X-DNS-Prefetch-Control": "on",
//   "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
//   "X-Frame-Options": "SAMEORIGIN",
//   "X-Content-Type-Options": "nosniff",
//   "Referrer-Policy": "origin-when-cross-origin",
//   "X-XSS-Protection": "1; mode=block",
// }

// // CORS configuration
// const ALLOWED_ORIGINS = ["http://localhost:3000", "https://localhost:3000", process.env.NEXT_PUBLIC_APP_URL].filter(
//   Boolean,
// )

// export async function encrypt(text: string): Promise<string> {
//   try {
//     const iv = crypto.randomBytes(16)
//     const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)
//     const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

//     let encrypted = cipher.update(text, "utf8", "hex")
//     encrypted += cipher.final("hex")

//     const authTag = cipher.getAuthTag()

//     return iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
//   } catch (error) {
//     console.error("Encryption error:", error)
//     throw new Error("Failed to encrypt data")
//   }
// }

// export async function decrypt(encryptedData: string): Promise<string> {
//   try {
//     const parts = encryptedData.split(":")
//     if (parts.length !== 3) {
//       throw new Error("Invalid encrypted data format")
//     }

//     const iv = Buffer.from(parts[0], "hex")
//     const authTag = Buffer.from(parts[1], "hex")
//     const encrypted = parts[2]

//     const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32)
//     const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
//     decipher.setAuthTag(authTag)

//     let decrypted = decipher.update(encrypted, "hex", "utf8")
//     decrypted += decipher.final("utf8")

//     return decrypted
//   } catch (error) {
//     console.error("Decryption error:", error)
//     throw new Error("Failed to decrypt data")
//   }
// }

// export function hashPassword(password: string): string {
//   return crypto.createHash("sha256").update(password).digest("hex")
// }

// export function generateApiKey(): string {
//   return crypto.randomBytes(32).toString("hex")
// }

// export function generateSecureToken(): string {
//   return crypto.randomBytes(64).toString("hex")
// }

// export function addSecurityHeaders(response: NextResponse): NextResponse {
//   // Add security headers
//   Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
//     response.headers.set(key, value)
//   })

//   // Add CSP header
//   const csp = [
//     "default-src 'self'",
//     "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com",
//     "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//     "font-src 'self' https://fonts.gstatic.com",
//     "img-src 'self' data: https: blob:",
//     "connect-src 'self' https://api.stripe.com https://checkout.stripe.com https://api.openai.com https://api.v0.dev",
//     "frame-src 'self' https://js.stripe.com https://checkout.stripe.com",
//   ].join("; ")

//   response.headers.set("Content-Security-Policy", csp)

//   return response
// }

// export function setCORSHeaders(response: NextResponse, origin?: string): NextResponse {
//   // Handle CORS
//   if (origin && ALLOWED_ORIGINS.includes(origin)) {
//     response.headers.set("Access-Control-Allow-Origin", origin)
//   } else if (process.env.NODE_ENV === "development") {
//     response.headers.set("Access-Control-Allow-Origin", "*")
//   }

//   response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
//   response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
//   response.headers.set("Access-Control-Allow-Credentials", "true")

//   return response
// }

// export function logSecurityEvent(event: string, details: Record<string, any>, request: Request): void {
//   const logData = {
//     timestamp: new Date().toISOString(),
//     event,
//     details,
//     ip: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
//     userAgent: request.headers.get("user-agent") || "unknown",
//     url: request.url,
//   }

//   console.warn(`[SECURITY] ${event}:`, logData)

//   // In production, you might want to send this to a security monitoring service
//   if (process.env.NODE_ENV === "production") {
//     // Send to monitoring service
//   }
// }

// export function encryptCredentials(data: string): string {
//   const algorithm = "aes-256-gcm"
//   const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "default-key", "salt", 32)
//   const iv = crypto.randomBytes(16)

//   const cipher = crypto.createCipheriv(algorithm, key, iv)
//   let encrypted = cipher.update(data, "utf8", "hex")
//   encrypted += cipher.final("hex")

//   const authTag = cipher.getAuthTag()

//   return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`
// }

// export function decryptCredentials(encryptedData: string): string {
//   const algorithm = "aes-256-gcm"
//   const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || "default-key", "salt", 32)

//   const [ivHex, authTagHex, encrypted] = encryptedData.split(":")
//   const iv = Buffer.from(ivHex, "hex")
//   const authTag = Buffer.from(authTagHex, "hex")

//   const decipher = crypto.createDecipheriv(algorithm, key, iv)
//   decipher.setAuthTag(authTag)

//   let decrypted = decipher.update(encrypted, "hex", "utf8")
//   decrypted += decipher.final("utf8")

//   return decrypted
// }

import type { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Security headers configuration
const SECURITY_HEADERS = {
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-XSS-Protection": "1; mode=block",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
}

// CORS configuration
const CORS_HEADERS = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
}

// Add security headers to response
export function addSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

// Set CORS headers
export function setCORSHeaders(response: NextResponse, origin?: string): NextResponse {
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Log security events
export function logSecurityEvent(event: string, details: Record<string, any>, request: NextRequest) {
  console.log(`[SECURITY] ${event}:`, {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: request.ip || request.headers.get("x-forwarded-for"),
    userAgent: request.headers.get("user-agent"),
    url: request.url,
  })
}

// Encryption utilities
const ALGORITHM = "aes-256-gcm"
const KEY_LENGTH = 32
const IV_LENGTH = 16
const TAG_LENGTH = 16

function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET || "default-secret-key-change-in-production"
  return crypto.scryptSync(secret, "salt", KEY_LENGTH)
}

export function encrypt(text: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(text, "utf8", "hex")
    encrypted += cipher.final("hex")

    const authTag = cipher.getAuthTag()

    // Combine iv + authTag + encrypted
    return iv.toString("hex") + authTag.toString("hex") + encrypted
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt data")
  }
}

export function decrypt(encryptedData: string): string {
  try {
    const key = getEncryptionKey()

    // Extract iv, authTag, and encrypted data
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), "hex")
    const authTag = Buffer.from(encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + TAG_LENGTH) * 2), "hex")
    const encrypted = encryptedData.slice((IV_LENGTH + TAG_LENGTH) * 2)

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, "hex", "utf8")
    decrypted += decipher.final("utf8")

    return decrypted
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt data")
  }
}

// Hash utilities
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(":")
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
  return hash === verifyHash
}

// Generate secure tokens
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

// Validate input
export function sanitizeInput(input: string): string {
  return input.replace(/[<>"']/g, "")
}

// Rate limiting key generation
export function generateRateLimitKey(identifier: string, action: string): string {
  return `rate_limit:${action}:${identifier}`
}


