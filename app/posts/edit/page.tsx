"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { createPost } from '@/app/actions';

// 动态导入Markdown编辑器组件
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => <div className="min-h-[400px] flex items-center justify-center">加载编辑器中...</div>
});

export default function EditPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: '错误', description: '标题和内容不能为空', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({ title, content });
      toast({ title: '成功', description: '文章创建成功！' });
      router.push('/profile');
    } catch (error) {
      console.error('创建文章失败:', error);
      toast({ title: '错误', description: '创建文章失败，请稍后重试', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">创建新文章</h1>
      <Card>
        <CardHeader>
          <CardTitle>文章编辑器</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">标题</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="输入文章标题"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium mb-2">内容 (Markdown格式)</label>
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || '')}
                height={400}
                textareaProps={{ placeholder: "在此输入文章内容..." }}
                className="min-h-[400px]"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? '保存中...' : '保存文章'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}