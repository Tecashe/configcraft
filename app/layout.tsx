import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ConfigCraft - Custom Business Tools in 24 Hours",
  description:
    "AI-powered SaaS platform that generates custom internal business tools for mid-market companies. Custom business tools in 24 hours, not 6 months.",
  generator: "ConfigCraft",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} antialiased`}>
        <body className="font-sans">{children}</body>
      </html>
    </ClerkProvider>
  )
}
