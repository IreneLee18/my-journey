import { useQuery } from '@tanstack/react-query';
import { getPostApi } from './api';

export const useGetPost = (id: string | undefined) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => {
      if (!id) {
        throw new Error('缺少文章 ID');
      }
      return getPostApi(id);
    },
    enabled: !!id,
  });
};

