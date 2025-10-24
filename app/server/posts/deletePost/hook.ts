import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePostApi } from './api';
import type { DeletePostInput } from './type';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: DeletePostInput) => {
      return deletePostApi(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

