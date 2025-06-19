import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
// 由于不清楚具体类型错误来源，假设 `credentials.email` 可能为非字符串类型，这里进行类型断言
          where: { email: credentials.email as string }
        });

        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(
// 由于类型错误，将 credentials.password 进行类型断言为 string
credentials.password as string,
          user.password
        );

        return isPasswordValid ? user : null;
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};

// 问题出在 session.strategy 的类型不兼容，将其显式声明为 "jwt" 类型
const fixedAuthOptions = {
  ...authOptions,
  session: {
    ...authOptions.session,
    strategy: "jwt" as const
  }
};
const handler = NextAuth(fixedAuthOptions);
export { handler as GET, handler as POST };