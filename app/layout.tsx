import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ConfigCraft - AI-Powered Business Tools",
  description: "Create custom business tools in minutes with AI",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#888888",
          colorBackground: "#121212",
          colorInputBackground: "#444444",
          colorInputText: "#E0E0E0",
          colorText: "#E0E0E0",
          colorTextSecondary: "#B0B0B0",
          colorNeutral: "#444444",
          colorDanger: "#dc2626",
          colorSuccess: "#888888",
          colorWarning: "#888888",
        },
        elements: {
          formButtonPrimary: {
            backgroundColor: "#888888",
            color: "#121212",
            "&:hover": {
              backgroundColor: "#666666",
            },
          },
          card: {
            backgroundColor: "#121212",
            borderColor: "#444444",
          },
          headerTitle: {
            color: "#E0E0E0",
          },
          headerSubtitle: {
            color: "#B0B0B0",
          },
          socialButtonsBlockButton: {
            backgroundColor: "#444444",
            borderColor: "#444444",
            color: "#E0E0E0",
            "&:hover": {
              backgroundColor: "#666666",
            },
          },
          formFieldInput: {
            backgroundColor: "#444444",
            borderColor: "#444444",
            color: "#E0E0E0",
          },
          footerActionLink: {
            color: "#888888",
          },
        },
      }}
    >
      <html lang="en" className="dark" style={{ backgroundColor: "#121212" }}>
        <body className={`${inter.className}`} style={{ backgroundColor: "#121212", color: "#E0E0E0" }}>
          <div style={{ backgroundColor: "#121212", minHeight: "100vh" }}>{children}</div>
        </body>
      </html>
    </ClerkProvider>
  )
}
