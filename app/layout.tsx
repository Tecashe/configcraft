// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import { ClerkProvider } from "@clerk/nextjs"
// import { Toaster } from "@/components/ui/toaster"
// import { ThemeProvider } from "@/components/theme-provider"
// import "./globals.css"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "ConfigCraft - Custom Business Tools",
//   description: "Create custom business tools with AI-powered generation",
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <ClerkProvider
//       appearance={{
//         baseTheme: undefined,
//         variables: {
//           colorPrimary: "#888888",
//           colorBackground: "#121212",
//           colorInputBackground: "#1e1e1e",
//           colorInputText: "#e0e0e0",
//           colorText: "#e0e0e0",
//           colorTextSecondary: "#b0b0b0",
//         },
//         elements: {
//           formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
//           card: "bg-card border-border",
//           headerTitle: "text-foreground",
//           headerSubtitle: "text-muted-foreground",
//         },
//       }}
//     >
//       <html lang="en" suppressHydrationWarning>
//         <body className={inter.className}>
//           <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
//             {children}
//             <Toaster />
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   )
// }

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ConfigCraft - AI-Powered Business Tools",
  description: "Build custom business tools with AI-powered generation. No coding required.",
  keywords: ["business tools", "AI", "no-code", "automation", "SaaS"],
  authors: [{ name: "ConfigCraft Team" }],
  openGraph: {
    title: "ConfigCraft - AI-Powered Business Tools",
    description: "Build custom business tools with AI-powered generation. No coding required.",
    type: "website",
    url: "https://configcraft.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConfigCraft - AI-Powered Business Tools",
    description: "Build custom business tools with AI-powered generation. No coding required.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "hsl(var(--primary))",
          colorBackground: "hsl(var(--background))",
          colorInputBackground: "hsl(var(--background))",
          colorInputText: "hsl(var(--foreground))",
        },
        elements: {
          formButtonPrimary: "config-button-primary",
          card: "config-card",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
