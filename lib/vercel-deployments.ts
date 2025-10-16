export interface DeploymentOptions {
  projectName: string
  files: Array<{
    path: string
    content: string
  }>
  envVars?: Record<string, string>
}

export interface DeploymentResult {
  success: boolean
  url?: string
  deploymentId?: string
  error?: string
}

export class VercelDeploymentService {
  async deployToVercel(options: DeploymentOptions): Promise<DeploymentResult> {
    try {
      // This will call our API route that handles Vercel deployment
      const response = await fetch("/api/deploy-to-vercel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.message || "Deployment failed",
        }
      }

      const result = await response.json()
      return {
        success: true,
        url: result.url,
        deploymentId: result.deploymentId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  async getDeploymentStatus(deploymentId: string): Promise<any> {
    const response = await fetch(`/api/deployment-status?id=${deploymentId}`)
    return await response.json()
  }
}

export const vercelDeployment = new VercelDeploymentService()
