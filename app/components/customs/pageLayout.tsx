import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

type PageLayoutProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  goBackString?: string;
  goBack?: () => void;
  customActions?: React.ReactNode;
};

export function PageLayout({
  title,
  children,
  className,
  goBackString,
  goBack,
  customActions,
}: PageLayoutProps) {
  return (
    <div className="container flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1
          className={cn(
            'lg:text-4xl md:text-2xl text-lg font-bold text-gray-900 dark:text-white',
            !goBack && !goBackString && 'w-full'
          )}
        >
          {title}
        </h1>

        {goBack && goBackString && (
          <Button
            variant="outline"
            className="items-center gap-2 hidden md:flex"
            onClick={goBack}
          >
            <ChevronLeft />
            {goBackString}
          </Button>
        )}
        {goBack && goBackString && (
          <Button
            variant="iconGhost"
            size="icon"
            className="flex items-center gap-2 md:hidden"
            onClick={goBack}
          >
            <ChevronLeft />
          </Button>
        )}
        {customActions}
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
