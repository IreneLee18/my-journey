import type { LoaderFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { prisma } from '@/lib/prisma.server';
import { format } from 'date-fns';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  try {
    const { id } = params;

    if (!id) {
      return data({ success: false, error: '缺少文章 ID' }, { status: 400 });
    }

    // 查詢單篇文章（只選擇必要欄位）
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        publishDate: true,
        images: {
          select: {
            id: true,
            url: true,
            filename: true,
            size: true,
            mimeType: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!post) {
      return data({ success: false, error: '找不到此文章' }, { status: 404 });
    }

    const formattedPost = {
      ...post,
      publishDate: format(post.publishDate, 'yyyy/MM/dd HH:mm'),
    };

    return data(
      {
        success: true,
        data: {
          post: formattedPost,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get post API error:', error);
    return data(
      { success: false, error: '取得文章時發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
};

