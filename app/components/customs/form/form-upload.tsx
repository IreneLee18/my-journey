import { type Control, type FieldValues } from 'react-hook-form';
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { FileUpload } from "./components/file-upload";
import { FormErrorMessage } from "./components";

interface FormUploadProps<TFieldValues extends FieldValues = FieldValues>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control?: Control<TFieldValues>;
  name: string;
  label?: string;
  className?: string;
  imageSrc?: string;
}

export const FormUpload = (props: FormUploadProps) => {
  const { control, name, className, ...inputProps } = props;
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const file = event.target.files?.[0];
          if (file) {
            // 直接使用從 FileUpload 傳來的檔案（已經過浮水印處理）
            field.onChange(file);
          } else {
            field.onChange(null);
          }
        };

        return (
          <FormItem className={className}>
            <FormControl>
              <FileUpload
                {...field}
                {...inputProps}
                onChange={handleFileChange}
              />
            </FormControl>
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormItem>
        );
      }}
    />
  );
};

FormUpload.displayName = 'FormUpload';