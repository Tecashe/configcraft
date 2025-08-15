import type { ChatFile } from "@/lib/chat-management"

export interface ProcessedCode {
  mainComponent: string
  dependencies: string[]
  assets: string[]
  styles: string
  config: Record<string, any>
}

export interface DeploymentPackage {
  files: Record<string, string>
  packageJson: Record<string, any>
  buildConfig: Record<string, any>
  entryPoint: string
}

// Production-ready Code Processing System
export class CodeProcessor {
  // Process generated files into deployable code
  async processGeneratedFiles(files: ChatFile[]): Promise<ProcessedCode> {
    try {
      let mainComponent = ""
      const dependencies: string[] = []
      const assets: string[] = []
      let styles = ""
      const config: Record<string, any> = {}

      for (const file of files) {
        switch (file.type) {
          case "react":
          case "typescript":
            if (file.name.includes("component") || file.name.includes("index") || file.name.includes("page")) {
              mainComponent = this.sanitizeCode(file.content)
            }
            dependencies.push(...this.extractDependencies(file.content))
            break

          case "css":
            styles += this.sanitizeCSS(file.content) + "\n"
            break

          case "json":
            if (file.name.includes("package")) {
              const packageData = JSON.parse(file.content)
              dependencies.push(...Object.keys(packageData.dependencies || {}))
            } else {
              config[file.name] = JSON.parse(file.content)
            }
            break

          default:
            if (this.isAssetFile(file.name)) {
              assets.push(file.name)
            }
        }
      }

      return {
        mainComponent,
        dependencies: [...new Set(dependencies)], // Remove duplicates
        assets,
        styles,
        config,
      }
    } catch (error) {
      console.error("Failed to process generated files:", error)
      throw new Error("Failed to process generated files")
    }
  }

  // Create deployment package for hosting
  async createDeploymentPackage(
    toolId: string,
    files: ChatFile[],
    toolName: string,
    organizationId: string,
  ): Promise<DeploymentPackage> {
    try {
      const processedCode = await this.processGeneratedFiles(files)

      // Create package.json
      const packageJson = {
        name: this.sanitizePackageName(toolName),
        version: "1.0.0",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          start: "next start",
          lint: "next lint",
        },
        dependencies: {
          next: "^14.0.0",
          react: "^18.0.0",
          "react-dom": "^18.0.0",
          "@types/node": "^20.0.0",
          "@types/react": "^18.0.0",
          "@types/react-dom": "^18.0.0",
          typescript: "^5.0.0",
          tailwindcss: "^3.0.0",
          autoprefixer: "^10.0.0",
          postcss: "^8.0.0",
          ...this.getRequiredDependencies(processedCode.dependencies),
        },
      }

      // Create file structure
      const deploymentFiles: Record<string, string> = {
        "package.json": JSON.stringify(packageJson, null, 2),
        "next.config.js": this.generateNextConfig(),
        "tailwind.config.js": this.generateTailwindConfig(),
        "postcss.config.js": this.generatePostCSSConfig(),
        "tsconfig.json": this.generateTSConfig(),
        "app/layout.tsx": this.generateLayout(toolName),
        "app/page.tsx": processedCode.mainComponent,
        "app/globals.css": this.generateGlobalCSS() + processedCode.styles,
      }

      // Add additional files
      for (const file of files) {
        if (!deploymentFiles[file.name] && !this.isConfigFile(file.name)) {
          deploymentFiles[`app/${file.name}`] = file.content
        }
      }

      // Build configuration
      const buildConfig = {
        framework: "nextjs",
        buildCommand: "npm run build",
        outputDirectory: ".next",
        installCommand: "npm install",
        devCommand: "npm run dev",
      }

      return {
        files: deploymentFiles,
        packageJson,
        buildConfig,
        entryPoint: "app/page.tsx",
      }
    } catch (error) {
      console.error("Failed to create deployment package:", error)
      throw new Error("Failed to create deployment package")
    }
  }

  // Sanitize code for security
  private sanitizeCode(code: string): string {
    // Remove potentially dangerous code patterns
    const dangerousPatterns = [
      /eval\s*\(/g,
      /Function\s*\(/g,
      /document\.write/g,
      /innerHTML\s*=/g,
      /dangerouslySetInnerHTML/g,
      /__dirname/g,
      /__filename/g,
      /process\.env/g,
      /require\s*\(/g,
      /import\s+.*\s+from\s+['"]fs['"]/g,
      /import\s+.*\s+from\s+['"]path['"]/g,
      /import\s+.*\s+from\s+['"]os['"]/g,
    ]

    let sanitizedCode = code
    for (const pattern of dangerousPatterns) {
      sanitizedCode = sanitizedCode.replace(pattern, "/* REMOVED FOR SECURITY */")
    }

    return sanitizedCode
  }

  // Sanitize CSS
  private sanitizeCSS(css: string): string {
    // Remove potentially dangerous CSS
    const dangerousPatterns = [/javascript:/g, /expression\s*\(/g, /behavior\s*:/g, /-moz-binding/g]

    let sanitizedCSS = css
    for (const pattern of dangerousPatterns) {
      sanitizedCSS = sanitizedCSS.replace(pattern, "/* REMOVED FOR SECURITY */")
    }

    return sanitizedCSS
  }

  // Extract dependencies from code
  private extractDependencies(code: string): string[] {
    const dependencies: string[] = []

    // Extract import statements
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g
    let match

    while ((match = importRegex.exec(code)) !== null) {
      const dep = match[1]
      if (!dep.startsWith(".") && !dep.startsWith("/")) {
        // Extract package name (handle scoped packages)
        const packageName = dep.startsWith("@") ? dep.split("/").slice(0, 2).join("/") : dep.split("/")[0]
        dependencies.push(packageName)
      }
    }

    return dependencies
  }

  // Get required dependencies with versions
  private getRequiredDependencies(deps: string[]): Record<string, string> {
    const dependencyVersions: Record<string, string> = {
      "lucide-react": "^0.300.0",
      "@radix-ui/react-dialog": "^1.0.5",
      "@radix-ui/react-dropdown-menu": "^2.0.6",
      "@radix-ui/react-tabs": "^1.0.4",
      "@radix-ui/react-progress": "^1.0.3",
      "@radix-ui/react-select": "^2.0.0",
      "@radix-ui/react-checkbox": "^1.0.4",
      "@radix-ui/react-switch": "^1.0.3",
      "class-variance-authority": "^0.7.0",
      clsx: "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "date-fns": "^2.30.0",
      recharts: "^2.8.0",
      "framer-motion": "^10.16.0",
    }

    const result: Record<string, string> = {}
    for (const dep of deps) {
      if (dependencyVersions[dep]) {
        result[dep] = dependencyVersions[dep]
      }
    }

    return result
  }

  // Check if file is an asset
  private isAssetFile(filename: string): boolean {
    const assetExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".webp", ".mp4", ".mp3", ".pdf"]
    return assetExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  }

  // Check if file is a config file
  private isConfigFile(filename: string): boolean {
    const configFiles = ["package.json", "next.config.js", "tailwind.config.js", "postcss.config.js", "tsconfig.json"]
    return configFiles.includes(filename)
  }

  // Sanitize package name
  private sanitizePackageName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  // Generate Next.js config
  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig`
  }

  // Generate Tailwind config
  private generateTailwindConfig(): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        card: 'hsl(0 0% 3.9%)',
        'card-foreground': 'hsl(0 0% 98%)',
        popover: 'hsl(0 0% 3.9%)',
        'popover-foreground': 'hsl(0 0% 98%)',
        primary: 'hsl(0 0% 98%)',
        'primary-foreground': 'hsl(0 0% 9%)',
        secondary: 'hsl(0 0% 14.9%)',
        'secondary-foreground': 'hsl(0 0% 98%)',
        muted: 'hsl(0 0% 14.9%)',
        'muted-foreground': 'hsl(0 0% 63.9%)',
        accent: 'hsl(0 0% 14.9%)',
        'accent-foreground': 'hsl(0 0% 98%)',
        destructive: 'hsl(0 62.8% 30.6%)',
        'destructive-foreground': 'hsl(0 0% 98%)',
        border: 'hsl(0 0% 14.9%)',
        input: 'hsl(0 0% 14.9%)',
        ring: 'hsl(0 0% 83.1%)',
      },
    },
  },
  plugins: [],
}`
  }

  // Generate PostCSS config
  private generatePostCSSConfig(): string {
    return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
  }

  // Generate TypeScript config
  private generateTSConfig(): string {
    return `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
  }

  // Generate layout component
  private generateLayout(toolName: string): string {
    return `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '${toolName}',
  description: 'Generated by ConfigCraft',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`
  }

  // Generate global CSS
  private generateGlobalCSS(): string {
    return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`
  }
}

// Export singleton instance
export const codeProcessor = new CodeProcessor()
