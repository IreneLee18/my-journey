/**
 * 圖片壓縮配置
 */
type CompressionOptions = {
  /** 最大寬度（px） */
  maxWidth?: number;
  /** 最大高度（px） */
  maxHeight?: number;
  /** 壓縮品質 (0-1) */
  quality?: number;
  /** 目標格式 */
  mimeType?: string;
};

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  mimeType: 'image/jpeg',
};

/**
 * 壓縮單張圖片
 * @param file - 原始圖片檔案
 * @param options - 壓縮選項
 * @returns 壓縮後的檔案
 */
type CompressImageType = {
  file: File;
  options: CompressionOptions;
};
export const compressImage = async ({
  file,
  options,
}: CompressImageType): Promise<File> => {
  // 如果不是圖片檔案，直接回傳
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const config = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // 計算新的尺寸
        let { width, height } = img;
        const maxWidth = config.maxWidth || DEFAULT_OPTIONS.maxWidth!;
        const maxHeight = config.maxHeight || DEFAULT_OPTIONS.maxHeight!;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // 創建 canvas 並繪製壓縮後的圖片
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('無法取得 canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // 轉換為 Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('圖片壓縮失敗'));
              return;
            }

            // 檢查壓縮後的檔案大小，如果反而更大則使用原始檔案
            if (blob.size > file.size) {
              resolve(file);
              return;
            }

            // 創建新的 File 物件
            const compressedFile = new File([blob], file.name, {
              type: config.mimeType || file.type,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          config.mimeType,
          config.quality
        );
      };

      img.onerror = () => {
        reject(new Error('圖片載入失敗'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('檔案讀取失敗'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * 批次壓縮多張圖片
 * @param files - 原始圖片檔案陣列
 * @param options - 壓縮選項
 * @param onProgress - 進度回調函數
 * @returns 壓縮後的檔案陣列
 */
type CompressImagesOptions = {
  files: File[];
  options: CompressionOptions;
  onProgress?: (progress: number, current: number, total: number) => void;
};
export const compressImages = async ({
  files,
  options,
  onProgress,
}: CompressImagesOptions): Promise<File[]> => {
  const compressedFiles: File[] = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    try {
      const compressedFile = await compressImage({ file: files[i], options });
      compressedFiles.push(compressedFile);

      // 回報進度
      if (onProgress) {
        const progress = Math.round(((i + 1) / total) * 100);
        onProgress(progress, i + 1, total);
      }
    } catch (error) {
      console.error(`壓縮圖片失敗: ${files[i].name}`, error);
      // 如果壓縮失敗，使用原始檔案
      compressedFiles.push(files[i]);
    }
  }

  return compressedFiles;
};

/**
 * 格式化檔案大小
 * @param bytes - 位元組數
 * @returns 格式化後的字串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};
