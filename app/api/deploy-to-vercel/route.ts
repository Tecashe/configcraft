import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { projectName, files, envVars } = await request.json()

    // Note: This requires VERCEL_ACCESS_TOKEN environment variable
    const vercelToken = process.env.VERCEL_ACCESS_TOKEN

    if (!vercelToken) {
      return NextResponse.json({ error: "Vercel access token not configured" }, { status: 500 })
    }

    // Create deployment using Vercel API
    const deploymentResponse = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        files: files.map((file: any) => ({
          file: file.path,
          data: file.content,
        })),
        projectSettings: {
          framework: "nextjs",
          buildCommand: "next build",
          installCommand: "npm install",
        },
        env: envVars
          ? Object.entries(envVars).map(([key, value]) => ({
              key,
              value,
              type: "encrypted",
            }))
          : [],
      }),
    })

    if (!deploymentResponse.ok) {
      const error = await deploymentResponse.json()
      return NextResponse.json({ error: error.message || "Deployment failed" }, { status: deploymentResponse.status })
    }

    const deployment = await deploymentResponse.json()

    return NextResponse.json({
      success: true,
      url: deployment.url,
      deploymentId: deployment.id,
    })
  } catch (error) {
    console.error("[deploy-to-vercel] Error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
