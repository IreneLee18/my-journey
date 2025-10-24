import type { ActionFunctionArgs } from 'react-router';
import { data } from 'react-router';
import LoginPage from '@/features/login';
import { login } from '@/lib/auth.server';
import { createUserSession } from '@/lib/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  // Validation
  if (typeof email !== 'string' || !email) {
    return data({ error: '請輸入電子郵件' }, { status: 400 });
  }

  if (typeof password !== 'string' || !password) {
    return data({ error: '請輸入密碼' }, { status: 400 });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return data({ error: '請輸入有效的電子郵件格式' }, { status: 400 });
  }

  // Try to login
  const result = await login(email, password);

  if (!result.success) {
    return data({ error: result.error }, { status: 401 });
  }

  // Create session and redirect to admin
  return createUserSession(result.userId, '/admin/posts');
};

export default function Login() {
  return <LoginPage />;
}
