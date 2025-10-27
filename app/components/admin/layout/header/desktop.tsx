import { Home, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import { paths } from '@/constants/paths';
import { useTheme } from '@/hooks/useTheme';

export function DesktopHeader() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleBackToFrontend = () => {
    return navigate(paths.home.url);
  };

  return (
    <header className="hidden md:block bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 border-b sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          to="/admin/post"
          className="text-xl font-bold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
        >
          Irene's Lee Journey 後台
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="iconGhost"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            title="切換主題"
          >
            {theme === 'dark' ? <Moon /> : <Sun />}
          </Button>
          <Button
            variant="ghost"
            aria-label="回到前台"
            onClick={handleBackToFrontend}
            title="回到前台"
          >
            <Home className="w-5 h-5" />
            回到前台
          </Button>
        </div>
      </div>
    </header>
  );
}
