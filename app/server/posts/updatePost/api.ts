import type { UpdatePostInput } from './type';

type Post = {
  id: string;
  title: string;
  content?: string;
  publishDate: string;
  images: Array<{
    id: string;
    url: string;
    filename: string;
    order: number;
  }>;
};

type PostResponse = {
  success: boolean;
  data?: {
    post: Post;
  };
  error?: string;
};

export const updatePostApi = async (
  postData: UpdatePostInput
): Promise<PostResponse> => {
  const response = await fetch('/api/posts/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '更新文章失敗');
  }

  return response.json();
};

