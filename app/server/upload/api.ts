type UploadImageResult = {
  filename: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
};

type UploadImagesResponse = {
  success: boolean;
  data?: {
    images: UploadImageResult[];
  };
  error?: string;
};

/**
 * 上傳圖片 API
 * @param files - File 物件陣列
 * @returns 上傳結果
 */
export const uploadImagesApi = async (
  files: File[]
): Promise<UploadImagesResponse> => {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append(`images[${index}]`, file);
  });

  const response = await fetch('/api/upload-images', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '上傳圖片失敗');
  }

  return response.json();
};

