import type { NextAuthOptions } from 'next-auth'
import type { DefaultSession } from 'next-auth'
import type { JWT } from 'next-auth/jwt'
import type { Session } from "next-auth"
import { type CredentialInput } from "next-auth/providers"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from 'next-auth/core/types'
import { NextAuth } from 'next-auth'
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
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
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)