import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, User, Menu, X, Moon, Settings, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router';
import DesktopNavigation from './navigation/desktop';
import MobileNavigation from './navigation/mobile';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/hooks/useLanguage';
import { useTranslation } from '@/i18n/useTranslation';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const toggleMobileMenu = () => {
    return setIsMobileMenuOpen((prev) => {
      return !prev;
    });
  };

  const closeMobileMenu = () => {
    return setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 border-b sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold">
            <Link
              to="/"
              className="hover:opacity-80 transition-opacity"
              onClick={closeMobileMenu}
            >
              {t('header.title')}
            </Link>
          </div>

          <DesktopNavigation />

          <div className="flex items-center gap-2 md:gap-4">
            <Button
              size="icon"
              variant="iconGhost"
              aria-label={t('header.toggleLanguage')}
              className="hidden md:flex"
              onClick={toggleLanguage}
              title={t('header.toggleLanguage')}
            >
              <span className="text-sm font-medium">
                {language.toUpperCase()}
              </span>
            </Button>
            <Button
              size="icon"
              variant="iconGhost"
              aria-label={t('header.toggleTheme')}
              className="hidden md:flex"
              onClick={toggleTheme}
              title={t('header.toggleTheme')}
            >
              {theme === 'dark' ? <Moon /> : <Sun />}
            </Button>
            <Button
              size="icon"
              variant="iconGhost"
              aria-label={isAuthenticated ? 'Admin' : 'Login'}
              className="hidden md:flex"
              onClick={() => {
                return navigate(isAuthenticated ? '/admin/posts' : '/login');
              }}
            >
              {isAuthenticated ? <Settings /> : <User />}
            </Button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                size="icon"
                variant="iconGhost"
                aria-label={t('admin.header.toggleMenu')}
                onClick={toggleMobileMenu}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        <MobileNavigation
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={closeMobileMenu}
          toggleTheme={toggleTheme}
          toggleLanguage={toggleLanguage}
        />
      </div>
    </header>
  );
}
