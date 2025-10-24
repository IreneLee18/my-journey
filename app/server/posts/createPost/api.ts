import type { CreatePostInput } from './type';

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

export const createPostApi = async (
  postData: CreatePostInput
): Promise<PostResponse> => {
  const response = await fetch('/api/posts/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '建立文章失敗');
  }

  return response.json();
};

