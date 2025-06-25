import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"
import { ClientProviders } from "@/components/providers"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ksr-web",
  description: "Full stack developer portfolio showcasing projects and skills",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ClientProviders>
          <Navbar />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
            {children}
          </div>
          <div className="fixed bottom-4 right-4 z-50">
            <ThemeToggle />
          </div>
        </ClientProviders>
      </body>
    </html>
  )
}
