import { Loader2 } from 'lucide-react';
import { type FieldValues, type Path, Controller } from 'react-hook-form';
import { FormField, FormItem } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { FormErrorMessage, FormRequiredLabel } from './components';

type SelectOption = {
  label: string;
  value: string;
}

type FormSelectProps<T extends FieldValues> = {
  options: SelectOption[];
  name: Path<T>;
  label: string;
  className?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  className,
  isRequired = false,
  isLoading = false,
  isDisabled = false,
  placeholder,
  ...rest
}: FormSelectProps<T>) {
  return (
    <FormField
      name={name}
      render={({ fieldState: { error } }) => {
        return (
          <FormItem
            className={cn(
              'relative flex w-full flex-col items-start',
              className,
            )}
          >
            <FormRequiredLabel label={label} isRequired={isRequired} />
            <Controller
              name={name}
              {...rest}
              render={({ field: controllerField }) => {
                const currentValue = String(controllerField.value ?? '');
                const selectedOption = options.find((option) => {
                  return option.value === currentValue;
                });
                return (
                  <Select
                    onValueChange={(selectedValue: string) => {
                      controllerField.onChange(selectedValue);
                    }}
                    value={currentValue}
                  >
                    <SelectTrigger
                      className={cn(
                        ' relative w-full',
                        isDisabled && 'bg-slate-50',
                      )}
                      aria-required={isRequired}
                      disabled={isLoading || isDisabled}
                    >
                      <SelectValue placeholder={placeholder ?? `請選擇${label}`}>
                        {selectedOption?.label}
                      </SelectValue>
                      {isLoading && (
                        <span className="absolute right-8 top-1/2 flex -translate-y-1/2 items-center">
                          <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                        </span>
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {options.length === 0 && (
                        <SelectItem value="no-data" disabled>
                          <span className="text-muted-foreground text-center">
                            查無資料
                          </span>
                        </SelectItem>
                      )}
                      {options.length > 0 &&
                        options.map((option) => {
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormItem>
        );
      }}
    />
  );
}
