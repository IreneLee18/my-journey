import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePostApi } from './api';
import type { UpdatePostInput } from './type';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: UpdatePostInput) => {
      return updatePostApi(postData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (data.data?.post) {
        queryClient.invalidateQueries({
          queryKey: ['post', data.data.post.id],
        });
      }
    },
  });
};

