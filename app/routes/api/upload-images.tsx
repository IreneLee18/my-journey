import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { uploadImages } from '@/lib/file-upload.server';
import { z } from 'zod';

const MAX_FILES = 10;

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const formData = await request.formData();
    const files: File[] = [];

    // 收集所有上傳的檔案
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('images') && value instanceof File) {
        files.push(value);
      }
    }

    // 驗證檔案數量
    if (files.length === 0) {
      return data({ success: false, error: '請選擇至少一個圖片檔案' }, { status: 400 });
    }

    if (files.length > MAX_FILES) {
      return data(
        { success: false, error: `一次最多只能上傳 ${MAX_FILES} 個檔案` },
        { status: 400 }
      );
    }

    // 上傳所有檔案
    const results = await uploadImages(files);

    return data(
      {
        success: true,
        data: {
          images: results,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Upload images API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : '上傳圖片時發生錯誤，請稍後再試';
    return data({ success: false, error: errorMessage }, { status: 500 });
  }
};

