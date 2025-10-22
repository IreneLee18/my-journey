import { cn } from "@/lib/utils";

interface FormErrorMessageProps {
  children: React.ReactNode | string 
  className?: string;
}

export const FormErrorMessage = ({ children, className }: FormErrorMessageProps) => {
  return <div className={cn("text-destructive text-sm", className)}>{children}</div>;
};
