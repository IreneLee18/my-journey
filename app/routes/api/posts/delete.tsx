import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma.server';
import { deletePostSchema } from '@/server/posts/deletePost/type';
import { deleteImage } from '@/lib/file-upload.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.json();

    // 使用 zod 驗證
    const validatedData = deletePostSchema.parse(body);

    // 1. 先取得文章資料（包含圖片）
    const post = await prisma.post.findUnique({
      where: { id: validatedData.id },
      include: {
        images: true,
      },
    });

    if (!post) {
      return data({ success: false, error: '找不到此文章' }, { status: 404 });
    }

    console.log('準備刪除文章:', { 
      postId: post.id, 
      title: post.title, 
      imageCount: post.images.length 
    });

    // 2. 刪除所有圖片檔案
    if (post.images.length > 0) {
      console.log('開始刪除圖片檔案:', post.images.map((img) => { return img.path; }));
      await Promise.all(
        post.images.map((image) => {
          return deleteImage(image.path);
        })
      );
      console.log('所有圖片檔案刪除完成');
    }

    // 3. 刪除文章（Cascade 會自動刪除關聯的 PostImage 記錄）
    await prisma.post.delete({
      where: { id: validatedData.id },
    });
    
    console.log('文章刪除成功:', validatedData.id);

    return data(
      {
        success: true,
        message: '文章已成功刪除',
      },
      { status: 200 }
    );
  } catch (error) {
    // 處理 Zod 驗證錯誤
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return data({ success: false, error: firstError.message }, { status: 400 });
    }

    console.error('Delete post API error:', error);
    return data(
      { success: false, error: '刪除文章時發生錯誤，請稍後再試' },
      { status: 500 }
    );
  }
};

