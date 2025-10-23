import type { Route } from './+types/home';
import Homepage from '@/features/home';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Irene Lee's Journey" },
    { name: 'description', content: "Welcome to Irene Lee's journey." },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Homepage />
      <Footer />
    </div>
  );
}
