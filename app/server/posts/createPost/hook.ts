import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostApi } from './api';
import type { CreatePostInput } from './type';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostInput) => {
      return createPostApi(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

