import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 移除Markdown格式并截断文本
 * @param markdown 原始Markdown文本
 * @param length 截断长度
 * @returns 处理后的纯文本摘要
 */
export function truncateMarkdown(markdown: string, length: number = 150): string {
  // 移除Markdown格式
  let plainText = markdown
    .replace(/\#+/g, '') // 移除标题
    .replace(/\*\*|\*/g, '') // 移除粗体/斜体
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接保留文本
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // 移除图片保留alt文本
    .replace(/`{1,3}[^`]+`{1,3}/g, '') // 移除代码块
    .replace(/^> .+/gm, '') // 移除引用
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim();

  // 截断文本
  if (plainText.length <= length) return plainText;
  return plainText.slice(0, length) + '...';
}
