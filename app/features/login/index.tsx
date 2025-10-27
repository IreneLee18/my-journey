import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Sun, Moon, Home, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormInput, FormCheckbox } from '@/components/customs/form';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/i18n/useTranslation';
import { useLogin } from '@/server/auth/hook';
import { loginSchema, type LoginFormValues } from '@/server/auth/type';

export default function LoginPage() {
  const { t } = useTranslation();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending, error: loginError } = useLogin();

  const handleSubmit = (data: LoginFormValues) => {
    loginMutation({
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
              {t('header.title')}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button
                size="icon"
                variant="iconGhost"
                aria-label={t('header.toggleLanguage')}
                onClick={toggleLanguage}
                title={t('header.toggleLanguage')}
              >
                <Languages />
                <span className="ml-1 text-sm font-medium">{language.toUpperCase()}</span>
              </Button>
              <Button
                size="icon"
                variant="iconGhost"
                aria-label={t('header.toggleTheme')}
                onClick={toggleTheme}
                title={t('header.toggleTheme')}
              >
                {theme === 'dark' ? <Moon /> : <Sun />}
              </Button>
              <Button
                size="icon"
                variant="iconGhost"
                aria-label={t('login.backToHome')}
                onClick={() => {
                  return navigate('/');
                }}
                title={t('login.backToHome')}
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
              {t('login.welcome')}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              {t('login.subtitle')}
            </p>
          </div>

          {/* Login Form */}
          <Form
            {...form}
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            allowEnterSubmit
          >
            {loginError && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {loginError.message}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <FormInput
                name="email"
                label={t('login.email')}
                type="email"
                autoComplete="email"
                placeholder={t('login.emailPlaceholder')}
              />

              <FormInput
                name="password"
                label={t('login.password')}
                type="password"
                autoComplete="current-password"
                placeholder={t('login.passwordPlaceholder')}
              />
            </div>
            <div className="flex items-center justify-between">
              <FormCheckbox name="rememberMe" label={t('login.rememberMe')} />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('login.loggingIn') : t('login.submit')}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
