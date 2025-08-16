// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Toaster } from "@/components/ui/toaster"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ConfigCraft - AI-Powered Business Tools",
//   description: "Build custom business tools with AI-powered generation. No coding required.",
//   keywords: ["business tools", "AI", "no-code", "automation", "SaaS"],
//   authors: [{ name: "ConfigCraft Team" }],
//   openGraph: {
//     title: "ConfigCraft - AI-Powered Business Tools",
//     description: "Build custom business tools with AI-powered generation. No coding required.",
//     type: "website",
//     url: "https://configcraft.com",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "ConfigCraft - AI-Powered Business Tools",
//     description: "Build custom business tools with AI-powered generation. No coding required.",
//   },
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ClerkProvider
//       appearance={{
//         variables: {
//           colorPrimary: "hsl(var(--primary))",
//           colorBackground: "hsl(var(--background))",
//           colorInputBackground: "hsl(var(--background))",
//           colorInputText: "hsl(var(--foreground))",
//         },
//         elements: {
//           formButtonPrimary: "config-button-primary",
//           card: "config-card",
//         },
//       }}
//     >
//       <html lang="en" suppressHydrationWarning>
//         <body className={inter.className}>
//           <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
//             {children}
//             <Toaster />
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }
import type React from "react"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ConfigCraft - Build Custom Business Tools with AI",
  description: "Create custom business tools without code using AI. Perfect for teams, startups, and enterprises.",
  keywords: "business tools, no-code, AI, automation, workflow",
  authors: [{ name: "ConfigCraft Team" }],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        </head>
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <div className="min-h-screen bg-background">{children}</div>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
