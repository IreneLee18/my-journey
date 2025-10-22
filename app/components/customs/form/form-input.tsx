import { type Control, type FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { FormErrorMessage, FormRequiredLabel } from './components';

// Helper to format timestamp to YYYY-MM-DD string
const formatTimestampToDateString = (timestamp: unknown): string => {
  if (typeof timestamp === 'number') {
    const date = new Date(timestamp);
    if (!Number.isNaN(date.getTime())) {
      const datePart = date.toISOString().split('T')[0];
      return datePart ?? ''; // Ensure string return
    }
  }
  return ''; // Return empty string for invalid or no timestamp
};

// Helper to parse YYYY-MM-DD string to timestamp
const parseDateStringToTimestamp = (dateString: string | undefined | null): number => {
  if (dateString && typeof dateString === 'string') {
    const date = new Date(dateString);
    if (!Number.isNaN(date.getTime())) {
      return date.getTime(); // Returns 13-digit millisecond timestamp
    }
  }
  return 0; // Return 0 for invalid or empty string
};

interface FormInputProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control?: Control<TFieldValues>;
  name: string;
  label: string;
  className?: string;
  isRequired?: boolean;
}

export function FormInput({
  name,
  label,
  className,
  isRequired = false,
  disabled,
  ...rest
}: FormInputProps) {
  return (
    <FormField
      {...rest}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const isDateInput = rest.type === 'date';

        // Ensure value passed to Input is always a string for date, or original for others.
        const inputValue = (() => {
          if (isDateInput) {
            return formatTimestampToDateString(field.value);
          }
          if (field.value !== null && (typeof field.value === 'number' || typeof field.value === 'string')) {
            return String(field.value);
          }
          return '';
        })();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (isDateInput) {
            // For date inputs, convert directly to timestamp
            field.onChange(parseDateStringToTimestamp(e.target.value));
          } else {
            // For non-date inputs, handle as before
            let processedValue: string | number | null = e.target.value;
            if (rest.type === 'number') {
              processedValue = e.target.valueAsNumber;
              if (Number.isNaN(processedValue)) processedValue = null;
            }
            field.onChange(processedValue);
          }
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          // Trim string values only on blur
          if (!isDateInput && rest.type !== 'number') {
            field.onChange(e.target.value.trim());
          }
          field.onBlur();
        };

        return (
          <FormItem
            className={cn('relative w-full items-start flex flex-col', className)}
          >
            <FormRequiredLabel label={label} isRequired={isRequired} />
            <FormControl>
              <Input
                {...field}
                {...rest}
                disabled={disabled}
                id={name}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-required={isRequired}
                aria-invalid={Boolean(error)}
                placeholder={rest.placeholder ?? `請輸入${label}`}
                // 移除 required 屬性以避免瀏覽器 HTML5 驗證
                required={false}
                className={cn(
                  'w-full',
                  // Hide spinner buttons for number inputs
                  rest.type === 'number' && '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-number-spin-button]:appearance-none',
                  error && 'border-destructive focus-visible:ring-destructive',
                  className
                )}
              />
            </FormControl>
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormItem>
        );
      }}
    />
  );
}
