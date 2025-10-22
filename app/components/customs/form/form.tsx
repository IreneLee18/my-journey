import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  createElement,
  isValidElement,
} from 'react';
import {
  type FieldValues,
  type UseFormReturn,
  type FieldErrors,
  FormProvider,
} from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends UseFormReturn<TFieldValues> {
  onSubmit?: (args: TFieldValues) => Promise<void> | void;
  onSubmitInvalid?: (
    errors: FieldErrors<TFieldValues>,
  ) => Promise<void> | Promise<boolean> | boolean;
  children: ReactNode;
  className?: HTMLAttributes<HTMLFormElement>['className'];
  allowEnterSubmit?: boolean;
}

interface ChildProps {
  name: string;
  [key: string]: unknown;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  onSubmit = () => {
    return void {};
  },
  onSubmitInvalid,
  children,
  className,
  allowEnterSubmit = false,
  ...form
}: FormProps<TFieldValues>) {
  const { handleSubmit, control } = form;
  const formClassName = cn('flex flex-col gap-2', className);

  const renderChild = (child: ReactElement<ChildProps>) => {
    return createElement(child.type, {
      ...{
        ...child.props,
        control,
        key: child.props.name,
      },
    });
  };

  const submitHandler = handleSubmit(
    onSubmit,
    onSubmitInvalid,
  ) as React.FormEventHandler<HTMLFormElement>;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    const { tagName } = event.target as HTMLFormElement;

    if (event.key === 'Enter' && tagName !== 'TEXTAREA' && !allowEnterSubmit) {
      event.preventDefault();
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className={formClassName}
        onSubmit={submitHandler}
        onKeyDown={handleKeyDown}
        noValidate
      >
        {Array.isArray(children)
          ? children.map((child: ReactElement) => {
              return isValidElement<ChildProps>(child) && child.props.name
                ? createElement(child.type, {
                    ...child.props,
                    control,
                    key: child.props.name,
                  })
                : child;
            })
          : renderChild(children as ReactElement<ChildProps>)}
      </form>
    </FormProvider>
  );
}
