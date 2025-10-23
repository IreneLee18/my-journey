import {
  DesktopHeader,
  MobileHeader,
} from '@/components/admin/layout/header';
import DesktopNavigation from '@/components/admin/layout/navigation/desktop';
import { Outlet } from 'react-router';

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col">
        <DesktopHeader />
        <MobileHeader />
        <div className="flex">
          <DesktopNavigation />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
