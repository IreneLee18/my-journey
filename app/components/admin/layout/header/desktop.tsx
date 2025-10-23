import { Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

export function DesktopHeader() {
  const handleBackToFrontend = () => {
    return (window.location.href = '/');
  };

  return (
    <header className="hidden md:block bg-white border-gray-200 border-b sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        <Link
          to="/admin/post"
          className="text-xl font-bold text-gray-900 hover:opacity-80 transition-opacity"
        >
          Irene's Lee Journey 後台
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            aria-label="回到前台"
            onClick={handleBackToFrontend}
            title="回到前台"
          >
            <Home className="w-5 h-5" />
            Back to Frontend
          </Button>
        </div>
      </div>
    </header>
  );
}
