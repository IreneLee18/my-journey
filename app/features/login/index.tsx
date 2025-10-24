import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sun, Moon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormInput, FormCheckbox } from '@/components/customs/form';
import { useTheme } from '@/hooks/useTheme';
import { loginApi } from '@/server/login/api';
import { loginSchema, type LoginFormValues } from '@/server/login/type';

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 使用 TanStack Query 的 useMutation
  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      console.log('登入成功，準備導頁到:', data.redirectTo);
      if (data.redirectTo) {
        navigate(data.redirectTo);
      }
    },
    onError: (error) => {
      console.error('登入失敗:', error);
    },
  });

  const handleSubmit = (data: LoginFormValues) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="container bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 border-b sticky top-0 z-50 transition-colors duration-300">
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-xl md:text-2xl font-bold">
              Irene Lee's Journey
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                size="icon"
                variant="iconGhost"
                aria-label="Toggle theme"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <Moon /> : <Sun />}
              </Button>
              <Button
                size="icon"
                variant="iconGhost"
                aria-label="Back to home"
                onClick={() => {
                  return navigate('/');
                }}
              >
                <Home />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
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
            {loginMutation.error && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {loginMutation.error.message}
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <FormInput
                name="email"
                label="帳號"
                type="email"
                autoComplete="email"
                placeholder="請輸入您的電子郵件"
              />

              <FormInput
                name="password"
                label="密碼"
                type="password"
                autoComplete="current-password"
                placeholder="請輸入您的密碼"
              />
            </div>
            <div className="flex items-center justify-between">
              <FormCheckbox name="rememberMe" label="記住我" />
            </div>
            <Button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? '登入中...' : '登入'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
