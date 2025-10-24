import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

const UPLOAD_DIR = 'public/uploads';
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
 * 上傳圖片檔案到伺服器
 * @param file - File 物件或 FormData 中的檔案
 * @returns 上傳結果（包含檔名、路徑、URL 等）
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

  // 生成安全的檔名（UUID + 原始副檔名）
  const ext = file.name.split('.').pop() || 'jpg';
  const safeFilename = `${randomUUID()}.${ext}`;

  // 按日期組織目錄結構（便於管理）
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const subDir = `${year}/${month}`;

  // 完整的存儲路徑
  const uploadPath = join(process.cwd(), UPLOAD_DIR, subDir);

  // 確保目錄存在
  if (!existsSync(uploadPath)) {
    await mkdir(uploadPath, { recursive: true });
  }

  // 寫入檔案
  const filePath = join(uploadPath, safeFilename);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  // 返回結果
  return {
    filename: file.name, // 保留原始檔名供顯示用
    path: `uploads/${subDir}/${safeFilename}`, // 相對於 public 的路徑
    url: `/uploads/${subDir}/${safeFilename}`, // 前端訪問 URL
    size: file.size,
    mimeType: file.type,
  };
};

/**
 * 批次上傳多個圖片
 * @param files - 檔案陣列
 * @returns 上傳結果陣列
 */
export const uploadImages = async (files: File[]): Promise<UploadResult[]> => {
  return Promise.all(files.map((file) => {
    return uploadImage(file);
  }));
};

/**
 * 刪除圖片檔案
 * @param path - 檔案路徑（相對於 public/）
 */
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const filePath = join(process.cwd(), 'public', path);
    console.log('嘗試刪除圖片:', { path, filePath });
    
    const { unlink } = await import('fs/promises');
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log('圖片刪除成功:', filePath);
    } else {
      console.warn('圖片檔案不存在，無法刪除:', filePath);
    }
  } catch (error) {
    console.error('刪除圖片失敗:', { path, error });
    // 不拋出錯誤，避免因檔案已被刪除而導致整個操作失敗
  }
};

