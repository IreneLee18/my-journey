import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormInput, FormCheckbox } from '@/components/customs/form';

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSubmit = (data: LoginFormValues) => {
    console.log('Login:', data);
    // TODO: Implement login logic
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            歡迎回來
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            請輸入您的帳號資訊以登入
          </p>
        </div>

        {/* Login Form */}
        <Form
          {...form}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
          allowEnterSubmit
        >
          <div className="space-y-4">
            {/* Email Field */}
            <FormInput
              name="email"
              label="帳號"
              type="email"
              autoComplete="email"
              placeholder="請輸入您的電子郵件"
            />

            {/* Password Field */}
            <FormInput
              name="password"
              label="密碼"
              type="password"
              autoComplete="current-password"
              placeholder="請輸入您的密碼"
            />
          </div>

          {/* Additional Options */}
          <div className="flex items-center justify-between">
            <FormCheckbox
              name="rememberMe"
              label="記住我"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
          >
            登入
          </Button>
        </Form>
      </div>
    </div>
  );
}
