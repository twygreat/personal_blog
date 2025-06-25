import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { Post } from '@prisma/client'
import { redirect } from 'next/navigation'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  // 未登录用户重定向到登录页
  if (!session?.user || !session.user.email) {
    redirect('/login')
  }

  try {
    // 从数据库获取用户信息
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { name: true, email: true }
    });

    if (!user) {
      // 用户不存在时显示404页面
      return <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">用户不存在</h1>
        <p>请检查您的登录信息或联系管理员</p>
      </div>;
    }

    // 从数据库获取用户文章
    const posts: Post[] = await prisma.post.findMany({
      where: { author: { email: session.user.email } },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">个人信息</h1>
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="space-y-2">
            <p>姓名: {user.name || '未设置'}</p>
            <p>邮箱: {user.email}</p>
            {/* 联系方式和爱好字段将在后续添加 */}
          </div>
          <Button className="mt-4">编辑个人信息</Button>
        </Card>

        <h2 className="text-2xl font-semibold mb-4">我的文章</h2>
        {posts.length === 0 ? (
          <div className="text-center py-8 bg-muted rounded-lg">
            <p className="text-muted-foreground">您还没有发布任何文章</p>
            <Button className="mt-4">
              <Link href="/posts/edit">创建新文章</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <Card key={post.id} className="p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{post.title}</h3>
                  <div className="text-sm text-muted-foreground">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : '日期未知'}
                  </div>
                </div>
                <div className="mt-2">
                  <Link href={`/posts/edit/${post.id}`} className="text-primary hover:underline">
                    编辑文章
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('获取用户数据失败:', error)
    return <div className="container mx-auto py-8 text-center">
      <h1 className="text-2xl font-bold mb-4">加载失败</h1>
      <p>无法加载您的个人资料，请稍后重试</p>
    </div>;
  }
}