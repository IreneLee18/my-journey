import { useMutation } from '@tanstack/react-query';
import { loginApi, logoutApi } from './api';
import type { LoginFormValues } from './type';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router';

export const useLogin = () => {
  const { onLogin } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: Pick<LoginFormValues, 'email' | 'password'>) => {
      return loginApi(data);
    },
    onSuccess: () => {
      toast.success('登入成功');
      onLogin();
      navigate('/admin/posts');
    },
    onError: (error) => {
      console.error('登入失敗:', error);
      toast.error(error instanceof Error ? error.message : '登入失敗');
    },
  });
};

export const useLogout = () => {
  const { onLogout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      toast.success('登出成功');
      onLogout();
      navigate('/');
    },
    onError: (error) => {
      console.error('登出失敗:', error);
      toast.error(error instanceof Error ? error.message : '登出失敗');
    },
  });
};
