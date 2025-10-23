import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { Outlet } from 'react-router';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
