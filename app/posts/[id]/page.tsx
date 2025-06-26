import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { marked } from 'marked';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    // 获取文章数据
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { author: { select: { name: true } } }
    });

    // 如果文章不存在，返回404
    if (!post) {
      notFound();
    }

    // 将Markdown转换为HTML
    const content = marked.parse(post.content);

    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <article className="space-y-6">
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>{post.author?.name || '未知作者'}</span>
              <span className="mx-2">•</span>
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'yyyy-MM-dd HH:mm')}
              </time>
            </div>
          </header>
          <div
            className="prose prose-blue max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>
      </main>
    );
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }
}