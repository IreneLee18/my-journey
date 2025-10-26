import { supabase } from './supabase.server';
import { randomUUID } from 'crypto';

const BUCKET_NAME = 'post-images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

type UploadResult = {
  filename: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
};

/**
 * 上傳圖片到 Supabase Storage
 */
export const uploadImage = async (file: File): Promise<UploadResult> => {
  // 驗證檔案類型
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `不支援的檔案類型：${file.type}。僅支援 JPEG、PNG、WebP 和 GIF`
    );
  }

  // 驗證檔案大小
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `檔案過大：${(file.size / 1024 / 1024).toFixed(2)}MB。最大限制為 ${MAX_FILE_SIZE / 1024 / 1024}MB`
    );
  }

  // 生成安全的檔名
  const ext = file.name.split('.').pop() || 'jpg';
  const safeFilename = `${randomUUID()}.${ext}`;

  // 按日期組織目錄結構
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const storagePath = `${year}/${month}/${safeFilename}`;

  // 上傳到 Supabase Storage
  const buffer = Buffer.from(await file.arrayBuffer());
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    throw new Error(`上傳失敗：${error.message}`);
  }

  // 獲取公開 URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(storagePath);

  return {
    filename: file.name,
    path: storagePath,
    url: urlData.publicUrl,
    size: file.size,
    mimeType: file.type,
  };
};

/**
 * 批次上傳多個圖片
 */
export const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
  return Promise.all(
    files.map((file) => {
      return uploadImage(file);
    })
  );
};

/**
 * 刪除圖片
 */
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`刪除失敗：${error.message}`);
    }

    console.log('圖片刪除成功:', path);
  } catch (error) {
    console.error('刪除圖片失敗:', { path, error });
    // 不拋出錯誤，避免因檔案已被刪除而導致整個操作失敗
  }
};

