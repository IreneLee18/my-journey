import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ title, children, className }: PageLayoutProps) {
  return (
    <div className={cn('container flex-1 flex flex-col gap-4', className)}>
      <h1 className="text-4xl border-b border-gray-200 pb-4">{title}</h1>
      {children}
    </div>
  );
}
