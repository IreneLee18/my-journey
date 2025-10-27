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
  /** 目標檔案大小上限（KB），如果設定會嘗試多次壓縮直到符合 */
  targetSizeKB?: number;
};

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.65,
  mimeType: 'image/jpeg',
  targetSizeKB: 500, // 目標壓縮到 500KB 以下
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

      img.onload = async () => {
        // 根據原始檔案大小動態調整壓縮策略
        const fileSizeMB = file.size / (1024 * 1024);
        let currentQuality = config.quality || DEFAULT_OPTIONS.quality!;
        let maxWidth = config.maxWidth || DEFAULT_OPTIONS.maxWidth!;
        let maxHeight = config.maxHeight || DEFAULT_OPTIONS.maxHeight!;

        // iPhone 高解析度照片（> 2MB）使用更激進的壓縮
        if (fileSizeMB > 2) {
          maxWidth = Math.min(maxWidth, 1200);
          maxHeight = Math.min(maxHeight, 1200);
          currentQuality = Math.min(currentQuality, 0.6);
        }

        // 計算新的尺寸
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // 嘗試壓縮函數
        const tryCompress = (quality: number): Promise<Blob | null> => {
          return new Promise((resolveBlob) => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolveBlob(null);
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                return resolveBlob(blob);
              },
              config.mimeType,
              quality
            );
          });
        };

        // 如果設定了目標大小，嘗試多次壓縮
        let finalBlob: Blob | null = null;
        const targetSizeBytes = config.targetSizeKB
          ? config.targetSizeKB * 1024
          : null;

        if (targetSizeBytes && fileSizeMB > 0.5) {
          // 只對大於 500KB 的檔案進行多次嘗試
          const qualities = [currentQuality, 0.55, 0.5, 0.45, 0.4];

          for (const quality of qualities) {
            const blob = await tryCompress(quality);
            if (!blob) continue;

            finalBlob = blob;

            // 如果達到目標大小，就停止
            if (blob.size <= targetSizeBytes) {
              break;
            }

            // 如果檔案還是太大，嘗試進一步縮小尺寸
            if (blob.size > targetSizeBytes && width > 800) {
              width = Math.round(width * 0.8);
              height = Math.round(height * 0.8);
            }
          }
        } else {
          // 一般情況直接壓縮一次
          finalBlob = await tryCompress(currentQuality);
        }

        if (!finalBlob) {
          reject(new Error('圖片壓縮失敗'));
          return;
        }

        // 檢查壓縮後的檔案大小，如果反而更大則使用原始檔案
        if (finalBlob.size > file.size) {
          resolve(file);
          return;
        }

        // 創建新的 File 物件
        const compressedFile = new File([finalBlob], file.name, {
          type: config.mimeType || file.type,
          lastModified: Date.now(),
        });

        resolve(compressedFile);
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
