import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updatePostApi } from './api';
import type { UpdatePostType } from './type';
import { toast } from 'sonner';

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: UpdatePostType) => {
      return updatePostApi(postData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (data.data?.post) {
        queryClient.invalidateQueries({
          queryKey: ['post', data.data.post.id],
        });
      }
      toast.success('文章已成功更新');
    },
    onError: (error) => {
      console.error('更新文章失敗:', error);
      toast.error('更新文章失敗，請稍後再試');
    },
  });
};

