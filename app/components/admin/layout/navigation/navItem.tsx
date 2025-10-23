import type { NavItemProps } from '@/constants/menu';
import { Link, useLocation } from 'react-router';

interface NavItemComponentProps {
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
          ? 'bg-gray-100 text-gray-900 font-semibold'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      onClick={onClick}
    >
      {navItem.icon}
      <span>{navItem.name}</span>
    </Link>
  );
}
