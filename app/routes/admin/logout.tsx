import type { ActionFunctionArgs } from 'react-router';
import { logout } from '@/lib/session.server';

export const action = async ({ request }: ActionFunctionArgs) => {
  // 清除 session cookie 並導向首頁
  return logout();
};

