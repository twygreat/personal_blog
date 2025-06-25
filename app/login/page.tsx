'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/"
    });

    if (result?.error) {
      setError("邮箱或密码不正确");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">登录</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-red-700 bg-red-100 rounded-md">{error}</div>
          )}
          <div className="space-y-1">
            <Label htmlFor="email">邮箱</Label>
            <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-2 border-gray-500 mt-[-8px]"
          />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">密码</Label>
            <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-2 border-gray-500 mt-[-8px]"
          />
          </div>
          <Button type="submit" className="w-full">登录</Button>
          <div className="text-center">
            <Link href="/register" className="text-blue-600 hover:underline">没有账号？注册</Link>
          </div>
        </form>
      </div>
    </div>
  );
}