import type { LoaderFunctionArgs } from 'react-router';
import { DesktopHeader, MobileHeader } from '@/components/admin/layout/header';
import DesktopNavigation from '@/components/admin/layout/navigation/desktop';
import { Outlet } from 'react-router';
import { requireUserId } from '@/lib/session.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // 檢查是否已登入，如果沒有登入會自動 redirect 到 /login
  await requireUserId(request);
  return null;
};

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="flex-1 flex flex-col">
        <DesktopHeader />
        <MobileHeader />
        <div className="flex">
          <DesktopNavigation />
          <main className="flex-1 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
