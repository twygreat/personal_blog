"use server"

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function submitContactForm(formData: FormData) {
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const name = formData.get('name')
  const email = formData.get('email')
  const message = formData.get('message')

  console.log('Contact form submitted:', { name, email, message })

  return {
    success: true,
    message: 'Message sent successfully!'
  }
}

// 创建文章的服务器操作
interface CreatePostData {
  title: string;
  content: string;
}

export async function createPost(data: CreatePostData) {
  // 获取当前用户会话
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error('未授权访问');
  }

  // 查找当前用户
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error('用户不存在');
  }

  // 创建文章
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      author: { connect: { id: user.id } }
    }
  });

  return post;
}
