import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma.server';
import { postsQuerySchema } from '@/server/posts/getPosts/type';
import { format } from 'date-fns';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const page = url.searchParams.get('page');
    const pageSize = url.searchParams.get('pageSize');

    // 使用 zod 驗證
    const validatedQuery = postsQuerySchema.parse({
      page: page ? parseInt(page) : undefined,
      pageSize: pageSize ? parseInt(pageSize) : undefined,
    });

    const skip = (validatedQuery.page - 1) * validatedQuery.pageSize;

    // 使用 Prisma 取得文章列表
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: validatedQuery.pageSize,
        orderBy: {
          publishDate: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          publishDate: true,
          images: {
            orderBy: {
              order: 'asc',
            },
            select: {
              id: true,
              url: true,
              filename: true,
              order: true,
            },
          },
        },
      }),
      prisma.post.count(),
    ]);

    // 將 DateTime 轉換為 string
    const formattedPosts = posts.map((post) => {
      return {
        ...post,
        publishDate: format(post.publishDate, 'yyyy/MM/dd'),
      };
    });

    return data(
      {
        success: true,
        data: {
          posts: formattedPosts,
          total,
          page: validatedQuery.page,
          pageSize: validatedQuery.pageSize,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // 處理 Zod 驗證錯誤
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return data({ success: false, error: firstError.message }, { status: 400 });
    }

    console.error('Get posts API error:', error);
    return data(
      { success: false, error: '取得文章列表時發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
};

