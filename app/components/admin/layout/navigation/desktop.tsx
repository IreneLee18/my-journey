import { useNavigate } from 'react-router';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { paths } from '@/constants/paths';
import { adminMenu } from '@/constants/menu';
import { NavItem } from './navItem';

export default function DesktopNavigation() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: 實作登出邏輯
    navigate(paths.home.url);
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
          title="登出"
          className="w-full justify-start gap-3 px-4 py-3 text-red-600 hover:text-red-700  hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          登出
        </Button>
      </nav>
    </aside>
  );
}
