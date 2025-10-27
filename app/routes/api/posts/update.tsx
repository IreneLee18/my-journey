import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma.server';
import { updatePostSchema } from '@/server/posts/updatePost/type';
import { deleteImage } from '@/lib/storage.server';
import { format } from 'date-fns';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.json();

    // 使用 zod 驗證
    const validatedData = updatePostSchema.parse(body);

    // 檢查文章是否存在
    const existingPost = await prisma.post.findUnique({
      where: { id: validatedData.id },
      include: { images: true },
    });

    if (!existingPost) {
      return data({ success: false, error: '找不到此文章' }, { status: 404 });
    }

    // 找出要刪除的圖片（舊的圖片中不在新圖片列表的）
    const newImageIds = validatedData.images
      .filter((img) => {
        return img.id;
      })
      .map((img) => {
        return img.id;
      });

    const imagesToDelete = existingPost.images.filter((img) => {
      return !newImageIds.includes(img.id);
    });

    // 刪除圖片檔案
    await Promise.all(
      imagesToDelete.map((img) => {
        return deleteImage(img.path);
      })
    );

    // 更新文章
    const post = await prisma.post.update({
      where: { id: validatedData.id },
      data: {
        title: validatedData.title,
        content: validatedData.content,
        publishDate: validatedData.publishDate
          ? new Date(validatedData.publishDate)
          : undefined,
        images: {
          // 刪除不在列表中的圖片
          deleteMany: {
            id: {
              in: imagesToDelete.map((img) => {
                return img.id;
              }),
            },
          },
          // 更新現有圖片的排序
          updateMany: validatedData.images
            .filter((img) => {
              return img.id;
            })
            .map((img) => {
              return ({
                where: { id: img.id },
                data: { order: img.order },
              });
            }),
          // 新增新圖片
          create: validatedData.images
            .filter((img) => {
              return !img.id;
            })
            .map((img) => {
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
      { status: 200 }
    );
  } catch (error) {
    // 處理 Zod 驗證錯誤
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return data({ success: false, error: firstError.message }, { status: 400 });
    }

    console.error('Update post API error:', error);
    return data(
      { success: false, error: '更新文章時發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
};

