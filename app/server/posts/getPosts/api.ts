import type { Post, PostsQuery } from './type';

type PostsResponse = {
  success: boolean;
  data?: {
    posts: Post[];
    total: number;
    page: number;
    pageSize: number;
  };
  error?: string;
};

export const getPostsApi = async (
  query?: PostsQuery
): Promise<PostsResponse> => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append('page', query.page.toString());
  }
  if (query?.pageSize) {
    params.append('pageSize', query.pageSize.toString());
  }

  const response = await fetch(`/api/posts?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '取得文章列表失敗');
  }

  return response.json();
};

