import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma.server';
import { createPostSchema } from '@/server/posts/createPost/type';
import { format } from 'date-fns';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.json();

    // 使用 zod 驗證
    const validatedData = createPostSchema.parse(body);

    // 建立文章並關聯圖片
    const post = await prisma.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        publishDate: validatedData.publishDate
          ? new Date(validatedData.publishDate)
          : new Date(),
        images: {
          create: validatedData.images.map((img) => {
            return ({
              filename: img.filename,
              path: img.path,
              url: img.url,
              size: img.size,
              mimeType: img.mimeType,
              order: img.order,
            });
          }),
        },
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

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
      { status: 201 }
    );
  } catch (error) {
    // 處理 Zod 驗證錯誤
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return data({ success: false, error: firstError.message }, { status: 400 });
    }

    console.error('Create post API error:', error);
    return data(
      { success: false, error: '建立文章時發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
};

