import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Sun, Moon, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormInput, FormCheckbox } from '@/components/customs/form';
import { useTheme } from '@/hooks/useTheme';

type LoginFormValues = {
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
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = (data: LoginFormValues) => {
    console.log('Login:', data);
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
            <Button type="submit">登入</Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
