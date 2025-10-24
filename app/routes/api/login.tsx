import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import { ZodError } from 'zod';
import { login } from '@/lib/auth.server';
import { createSessionCookie } from '@/lib/session.server';
import { loginSchema } from '@/server/login/type';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const body = await request.json();

    // 使用 zod 驗證
    const validatedData = loginSchema.parse(body);

    // Try to login
    const result = await login(validatedData.email, validatedData.password);

    if (!result.success) {
      return data({ error: result.error }, { status: 401 });
    }

    // 設定 session cookie 並回傳成功結果
    return data(
      { success: true, redirectTo: '/admin/posts' },
      { 
        status: 200,
        headers: {
          'Set-Cookie': createSessionCookie(result.userId),
        },
      }
    );
  } catch (error) {
    // 處理 Zod 驗證錯誤
    if (error instanceof ZodError) {
      const firstError = error.issues[0];
      return data({ error: firstError.message }, { status: 400 });
    }

    console.error('Login API error:', error);
    return data({ error: '登入時發生錯誤，請稍後再試' }, { status: 500 });
  }
};

