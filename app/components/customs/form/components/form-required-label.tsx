import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormRequiredLabelProps {
  label: ReactNode;
  isRequired?: boolean;
  htmlFor?: string;
  labelClassName?: string;
}

export const FormRequiredLabel = ({
  label,
  isRequired = false,
  htmlFor,
  labelClassName,
}: FormRequiredLabelProps) => {
  return (
    <Label
      className={cn('text-muted-foreground', isRequired && 'text-primary-500', labelClassName)}
      htmlFor={htmlFor}
    >
      {isRequired && <span className="text-primary-500">*</span>}
      {label}
    </Label>
  );
};
