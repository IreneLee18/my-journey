import type { LoginFormValues } from '@/server/auth/type';

type LoginResponse = {
  success: boolean;
  redirectTo?: string;
  error?: string;
};

type LogoutResponse = {
  success: boolean;
  error?: string;
};

export const loginApi = async (
  data: Pick<LoginFormValues, 'email' | 'password'>
): Promise<LoginResponse> => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // 確保 cookie 會被儲存
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '登入失敗');
  }

  return response.json();
};

export const logoutApi = async (): Promise<LogoutResponse> => {
  const response = await fetch('/api/logout', {
    method: 'POST',
    credentials: 'include', // 確保 cookie 會被清除
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '登出失敗');
  }

  return response.json();
};
