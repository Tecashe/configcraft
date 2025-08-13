import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { performanceMonitor } from "@/lib/monitoring"

export async function GET() {
  try {
    const startTime = Date.now()

    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    const dbResponseTime = Date.now() - startTime

    // Get system metrics
    const metrics = {
      database: {
        status: "healthy",
        responseTime: dbResponseTime,
      },
      api: {
        averageResponseTime: performanceMonitor.getAverageMetric("api_response_time"),
        p95ResponseTime: performanceMonitor.getMetricPercentile("api_response_time", 95),
      },
      memory: {
        usage: process.memoryUsage(),
      },
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json({
      status: "healthy",
      version: process.env.npm_package_version || "unknown",
      environment: process.env.NODE_ENV,
      metrics,
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
