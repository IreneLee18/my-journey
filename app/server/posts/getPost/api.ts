import type { Post } from './type';

type PostResponse = {
  success: boolean;
  data?: {
    post: Post;
  };
  error?: string;
};

export const getPostApi = async (id: string): Promise<PostResponse> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '取得文章失敗');
  }

  return response.json();
};

