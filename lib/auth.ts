import type { DefaultSession } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { Session } from "next-auth"
// 由于找不到 'next-auth/providers' 模块，尝试从 'next-auth/providers/credentials' 导入 CredentialInput
import { type CredentialInput } from "next-auth/providers/credentials"
import CredentialsProvider from "next-auth/providers/credentials"
// 尝试从 'next-auth' 导入 NextAuthOptions，因为可能 'next-auth/server' 路径有误
import type { NextAuthOptions } from 'next-auth'
// 尝试从 'next-auth' 导入 NextAuth，因为 'next-auth/server' 找不到
import NextAuth from 'next-auth'
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { User } from '@prisma/client';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user']
  }
}

export const authOptions: NextAuthOptions = {

  callbacks: {
    session({ session, token }: { session: Session; token: JWT & { sub?: string } }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" } as CredentialInput,
        password: { label: "Password", type: "password" } as CredentialInput
      },
      async authorize(credentials: Partial<Record<"email" | "password", unknown>> | undefined) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const email = credentials?.email as string;    const password = credentials?.password as string;    if (typeof email !== 'string' || typeof password !== 'string') {      return null;    }
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(
            password,
            user.password
          );

          return passwordMatch ? {
            id: user.id,
            email: user.email,
            name: user.name
          } : null;
        } catch (error) {
          console.error('Authentication error details:', error);
          if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
          }
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
// 尝试从 'next-auth' 导入 auth，因为 'next-auth/server' 找不到
export { signIn, signOut } from 'next-auth/react'