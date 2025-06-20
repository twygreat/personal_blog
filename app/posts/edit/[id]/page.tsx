'use client'
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"

// 定义表单验证模式
const postSchema = z.object({
  title: z.string().min(3, "标题至少3个字符").max(100),
  content: z.string().min(10, "内容至少10个字符")
})

type PostFormValues = z.infer<typeof postSchema>

export default function EditPostPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初始化表单
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: ""
    }
  })

  // 获取文章数据
  useEffect(() => {
    if (!session?.user || !params.id) return

    const fetchPost = async () => {
      try {
        // 实际项目中替换为真实API调用
        const response = await fetch(`/api/posts/${params.id}`)
        if (!response.ok) throw new Error("获取文章失败")
        const post = await response.json()
        form.reset(post)
      } catch (err) {
        setError("无法加载文章，请重试")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [session, params.id, form])

  // 处理表单提交
  const onSubmit = async (data: PostFormValues) => {
    if (!params.id) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error("更新文章失败")

      toast({ title: "文章更新成功" })
      router.push("/profile")
    } catch (err) {
      toast({ title: "更新失败", description: "请稍后重试", variant: "destructive" })
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="container mx-auto py-8">加载中...</div>
  if (error) return <div className="container mx-auto py-8 text-red-500">{error}</div>
  if (!session?.user) return <div className="container mx-auto py-8">请先登录</div>

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">编辑文章</h1>
      <Form {...form}>        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input placeholder="输入文章标题" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>内容</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="输入文章内容"
                    className="min-h-[300px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存修改"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}