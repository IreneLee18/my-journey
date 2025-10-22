import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  goBack?: () => void;
}

export function PageLayout({ title, children, className, goBack }: PageLayoutProps) {
  return (
    <div className={cn('container flex-1 flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1 className={cn("text-4xl", !goBack && "w-full")}>{title}</h1>
        {goBack && (
          <Button variant="iconOutline" size="icon" onClick={goBack}>
            <ArrowLeft />
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
