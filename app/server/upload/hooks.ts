import { useMutation } from '@tanstack/react-query';
import { uploadImagesApi } from './api';

export const useUploadImages = () => {
  return useMutation({
    mutationFn: (files: File[]) => {
      return uploadImagesApi(files);
    },
  });
};

