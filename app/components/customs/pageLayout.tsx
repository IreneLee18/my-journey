import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ChevronLeft } from 'lucide-react';

type PageLayoutProps = {
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
    <div className="container flex-1 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h1
          className={cn(
            'lg:text-4xl md:text-2xl text-lg font-bold',
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
      </div>
      <div className={className}>{children}</div>
    </div>
  );
}
