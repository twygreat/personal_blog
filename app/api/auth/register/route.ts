import { prisma } from '@/lib/prisma';
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "用户已存在" },
        { status: 400 }
      );
    }

    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
      console.error('注册错误详情:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        { error: `注册失败: ${errorMessage}` },
        { status: 500 }
      );
    }
}