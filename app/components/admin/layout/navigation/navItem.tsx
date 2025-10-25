import type { NavItemProps } from '@/constants/menu';
import { Link, useLocation } from 'react-router';

type NavItemComponentProps = {
  navItem: NavItemProps;
  onClick?: () => void;
}

export function NavItem({ navItem, onClick }: NavItemComponentProps) {
  const location = useLocation();
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Link
      to={navItem.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive(navItem.path)
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      }`}
      onClick={onClick}
    >
      {navItem.icon}
      <span>{navItem.name}</span>
    </Link>
  );
}
