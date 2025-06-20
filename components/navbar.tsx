'use client'
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Avatar } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo和桌面导航 */}
        <div className="flex items-center">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">我的博客</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">首页</Link>
            <Link href="#articles" className="transition-colors hover:text-foreground/80">文章</Link>
            <Link href="#about" className="transition-colors hover:text-foreground/80">关于</Link>
          </nav>
        </div>

        {/* 移动端菜单按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>

        {/* 用户菜单 */}
        <div className="hidden md:flex items-center space-x-4">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <img src="/placeholder-user.jpg" alt="用户头像" />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">个人信息</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>退出登录</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button>登录</Button>
            </Link>
          )}
        </div>
      </div>

      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-4 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">首页</Link>
            <Link href="#articles" className="transition-colors hover:text-foreground/80">文章</Link>
            <Link href="#about" className="transition-colors hover:text-foreground/80">关于</Link>
            {session?.user ? (
              <Link href="/profile" className="transition-colors hover:text-foreground/80">个人信息</Link>
            ) : (
              <Link href="/login" className="transition-colors hover:text-foreground/80">登录</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}