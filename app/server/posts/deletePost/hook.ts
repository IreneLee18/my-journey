import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deletePostApi } from './api';
import type { DeletePostInput } from './type';
import { toast } from 'sonner';

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: DeletePostInput) => {
      return deletePostApi(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('文章已成功刪除');
    },
    onError: (error) => {
      console.error('刪除文章失敗:', error);
      toast.error('刪除文章失敗，請稍後再試');
    },
  });
};

