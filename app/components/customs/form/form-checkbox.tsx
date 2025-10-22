import { type Control, type FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { FormErrorMessage, FormRequiredLabel } from './components';

interface FormCheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control?: Control<TFieldValues>;
  name: string;
  label: string;
  className?: string;
  labelClassName?: string;
  isRequired?: boolean;
}

export function FormCheckbox({
  name,
  label,
  className,
  labelClassName,
  isRequired = false,
  ...rest
}: FormCheckboxProps) {
  return (
    <FormField
      {...rest}
      name={name}
      render={({ field, fieldState: { error } }) => {
        return (
          <FormItem
            className={cn(
              'relative flex w-full flex-col items-start text-muted-foreground',
              className,
            )}
          >
            <div className="flex items-center gap-2">
              <FormControl>
                <Checkbox
                  {...field}
                  id={name}
                  aria-required={isRequired}
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  className={cn(className)}
                />
              </FormControl>
              <FormRequiredLabel
                label={label}
                htmlFor={name}
                isRequired={isRequired}
                labelClassName={cn(labelClassName)}
              />
            </div>
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormItem>
        );
      }}
    />
  );
}
