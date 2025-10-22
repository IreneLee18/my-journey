import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  goBackString?: string;
  goBack?: () => void;
}

export function PageLayout({
  title,
  children,
  className,
  goBackString,
  goBack,
}: PageLayoutProps) {
  return (
    <div className={cn('container flex-1 flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1
          className={cn(
            'text-4xl font-bold',
            !goBack && !goBackString && 'w-full'
          )}
        >
          {title}
        </h1>
        {goBack && goBackString && (
          <Button variant="outline" className="flex items-center gap-2" onClick={goBack}>
            <ChevronLeft />
            {goBackString}
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}
