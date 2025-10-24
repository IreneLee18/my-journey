import { useQuery } from '@tanstack/react-query';
import { getPostsApi } from './api';
import type { PostsQuery } from './type';

export const useGetPosts = (query?: PostsQuery) => {
  return useQuery({
    queryKey: ['posts', query],
    queryFn: () => {
      return getPostsApi(query);
    },
  });
};

