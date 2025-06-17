import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "John.dev - Full Stack Developer",
  description: "Full stack developer portfolio showcasing projects and skills",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* 添加居中容器，max-w-6xl 限制最大宽度，mx-auto 水平居中，px-4 添加内边距 */}
          <div className="max-w-6xl mx-auto px-4 w-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
