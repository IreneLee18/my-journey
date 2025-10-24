import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminMenu } from '@/constants/menu';
import { NavItem } from './navItem';
import { useFetcher } from 'react-router';

export default function DesktopNavigation() {
  const fetcher = useFetcher();

  const handleLogout = () => {
    // 提交到專門的 logout action 路由
    fetcher.submit(null, { method: 'post', action: '/admin/logout' });
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] transition-colors duration-300">
      <nav className="p-4 flex flex-col justify-between h-full">
        <div className="space-y-2">
          {adminMenu.map((item) => {
            return <NavItem key={item.path} navItem={item} />;
          })}
        </div>
        <Button
          variant="ghost"
          aria-label="登出"
          onClick={handleLogout}
          disabled={fetcher.state !== 'idle'}
          title="登出"
          className="w-full justify-start gap-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          {fetcher.state !== 'idle' ? '登出中...' : '登出'}
        </Button>
      </nav>
    </aside>
  );
}
