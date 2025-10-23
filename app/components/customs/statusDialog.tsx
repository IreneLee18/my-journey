import { cn } from '@/lib/utils';
import { useStatusDialogState, type StatusProps } from '@/utils/statusDialogState';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect } from 'react';
import * as Icons from 'lucide-react';

const STATUS_STYLES: Record<
  StatusProps,
  { titleColor: string; icon?: React.ReactNode }
> = {
  info: { titleColor: 'text-info', icon: <Icons.MessageCircleQuestion /> },
  error: { titleColor: 'text-destructive', icon: <Icons.CircleX /> },
  success: { titleColor: 'text-success', icon: <Icons.CircleCheck /> },
  warning: { titleColor: 'text-warning', icon: <Icons.CircleAlert /> },
  delete: { titleColor: 'text-destructive', icon: <Icons.CircleX /> },
  save: { titleColor: 'text-primary' },
  dev: { titleColor: 'text-warning' },
};

export function GlobalStatusDialog() {
  const { isOpen, dialog, closeStatusDialog } = useStatusDialogState();

  const handleConfirm = async () => {
    if (dialog.onConfirm) {
      await dialog.onConfirm();
    }
    closeStatusDialog();
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    closeStatusDialog();
  };

  useEffect(() => {
    if (dialog.autoComplete && isOpen) {
      const timer = setTimeout(() => {
        dialog.autoComplete?.onAutoComplete?.();
        closeStatusDialog();
      }, dialog.autoComplete.millisecond);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [dialog.autoComplete, isOpen]);

  const statusStyle = STATUS_STYLES[dialog.status];
  const showCancelButton = !dialog.isSingleButton;

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeStatusDialog();
      }}
    >
      <AlertDialogContent
        className={cn(
          'rounded-lg',
          'max-w-[80%] md:w-120',
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div
              className={cn(statusStyle.titleColor, 'flex items-center gap-2')}
            >
              {statusStyle.icon}
              {dialog.title}
            </div>
          </AlertDialogTitle>
          {dialog.description ? (
            <AlertDialogDescription>
              {dialog.description}
            </AlertDialogDescription>
          ) : null}
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center gap-2 md:justify-end">
          {showCancelButton ? (
            <AlertDialogCancel
              onClick={handleCancel}
              disabled={dialog.disableActions}
            >
              {dialog.cancelText ?? '取消'}
            </AlertDialogCancel>
          ) : null}
          <AlertDialogAction
            className={dialog.isSingleButton ? 'w-full' : ''}
            onClick={() => {
              void handleConfirm();
            }}
            disabled={dialog.disableActions}
          >
            {dialog.confirmText ?? '確認'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
