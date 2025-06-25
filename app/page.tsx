import { Button } from "@/components/ui/button"
import { Github, Mail, Rss, Twitter } from "lucide-react"
import Link from "next/link"
import { format } from 'date-fns'
import { prisma } from '@/lib/prisma'
import { Card } from '@/components/ui/card'
import { truncateMarkdown } from '@/lib/utils'

export default async function BlogPage() {
  // 获取最新文章
  const latestPosts = await prisma.post.findMany({
  orderBy: { createdAt: 'desc' },
  take: 5,
  include: { author: { select: { name: true } } }
});
  return (
    <div className="min-h-screen bg-background">
      <main className="container px-4 md:px-6 py-12">
        <section id="home" className="py-8 md:py-16">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Siri的技术博客
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                记录日常想法、技术学习和编程心得
              </p>
            </div>
            <div className="space-x-4 pt-4">
              <Link href="#articles" className="transition-colors hover:text-foreground/80">
                <Button>浏览文章</Button>
              </Link>
              <Link href="https://rss.example.com" target="_blank">
                <Button variant="outline" size="icon">
                  <Rss className="h-4 w-4" />
                  <span className="sr-only">RSS</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="articles" className="py-12 md:py-20">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-8 flex items-center">
              最新文章
            </h2>
            <div className="mb-8">
            {latestPosts.length === 0 ? (
              <div className="text-center py-12 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-4">暂无文章发布</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {latestPosts.map((post) => (
                  <Card key={post.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full">
                        {post.author?.name || '未知作者'}
                      </span>
                      <time className="text-xs text-muted-foreground">
                        {post.createdAt ? format(new Date(post.createdAt), 'yyyy-MM-dd') : '日期未知'}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold mb-2 hover:text-primary/80 transition-colors">
                      <Link href={`/posts/edit/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-muted-foreground mb-4">{truncateMarkdown(post.content)}</p>
                    <Link
                      href={`/posts/edit/${post.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      编辑文章 →
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
          <div className="text-center">
            <Button size="lg">
              <Link href="/posts/edit">创建新文章</Link>
            </Button>
          </div>
          </div>
        </section>

        <section id="about" className="py-12 md:py-20 bg-muted/50 rounded-xl p-8 mt-12">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl mb-4">关于我</h2>
            <p className="text-muted-foreground max-w-2xl">
              我是一名热爱技术的开发者，喜欢分享我的学习经验和日常思考。这个博客使用Next.js和Tailwind CSS构建，
              旨在记录我的成长历程和技术探索。
            </p>
            <div className="space-x-4 mt-6">
              <Link href="https://github.com" target="_blank">
                <Button variant="outline" size="icon">
                  <Github className="h-4 w-4" />
                  <span className="sr-only">GitHub</span>
                </Button>
              </Link>
              <Link href="https://twitter.com" target="_blank">
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </Link>
              <Link href="mailto:hello@example.com">
                <Button variant="outline" size="icon">
                  <Mail className="h-4 w-4" />
                  <span className="sr-only">Email</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t mt-16">
        <div className="container flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} 我的博客. 保留所有权利.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#about">
              关于
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="mailto:contact@example.com">
              联系我
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
