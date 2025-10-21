import type { Route } from './+types/home';
import Homepage from '@/features/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Irene Lee\'s Journey' },
    { name: 'description', content: 'Welcome to Irene Lee\'s journey.' },
  ];
}

export default function Home() {
  return <Homepage />;
}
