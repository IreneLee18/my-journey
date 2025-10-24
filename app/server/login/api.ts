import type { LoginFormValues } from '@/server/login/type';

type LoginResponse = {
  success: boolean;
  redirectTo?: string;
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
