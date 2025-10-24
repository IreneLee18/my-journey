import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    // 清除 session cookie
    return data(
      { success: true },
      {
        status: 200,
        headers: {
          'Set-Cookie':
            'user_id=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
        },
      }
    );
  } catch (error) {
    console.error('Logout API error:', error);
    return data({ error: '登出時發生錯誤，請稍後再試' }, { status: 500 });
  }
};

