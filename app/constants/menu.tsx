import { FileText } from 'lucide-react';
import { adminPaths } from './paths';

export type NavItemProps = {
  name: string;
  path: string;
  icon: React.ReactNode;
}

export const adminMenu: NavItemProps[] = [
  {
    name: adminPaths.posts.name,
    path: adminPaths.posts.url,
    icon: <FileText className="w-5 h-5" />,
  },
];
