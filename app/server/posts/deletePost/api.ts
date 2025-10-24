import type { DeletePostInput } from './type';

type DeleteResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export const deletePostApi = async (
  postData: DeletePostInput
): Promise<DeleteResponse> => {
  const response = await fetch('/api/posts/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '刪除文章失敗');
  }

  return response.json();
};

