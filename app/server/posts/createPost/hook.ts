import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPostApi } from './api';
import type { CreatePostType } from './type';
import { toast } from 'sonner';

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostType) => {
      return createPostApi(postData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('文章已成功建立');
    },
    onError: (error) => {
      console.error('建立文章失敗:', error);
      toast.error('建立文章失敗，請稍後再試');
    },
  });
};

