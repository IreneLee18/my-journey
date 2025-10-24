import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Sun, User, Moon, Settings } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/stores/authStore';

type MobileNavigationProps = {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export default function MobileNavigation({
  isMobileMenuOpen,
  closeMobileMenu,
}: MobileNavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const mobileLinkVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };
  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.nav
          className="md:hidden flex flex-col gap-4 overflow-hidden absolute w-full left-0 px-4 border-t top-[68px] h-screen bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 border-b"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={mobileMenuVariants}
        >
          <motion.div variants={mobileLinkVariants} className="pt-4">
            <Link
              to="/posts"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium transition-colors py-2 block"
              onClick={closeMobileMenu}
            >
              Posts
            </Link>
          </motion.div>
          <motion.div variants={mobileLinkVariants}>
            <Link
              to="/about"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium transition-colors py-2 block"
              onClick={closeMobileMenu}
            >
              About
            </Link>
          </motion.div>
          <motion.div
            variants={mobileLinkVariants}
            className="flex items-center gap-4 pt-2 border-t border-gray-200 pb-4"
          >
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
              aria-label={isAuthenticated ? 'Admin' : 'Login'}
              onClick={() => {
                return navigate(isAuthenticated ? '/admin/posts' : '/login');
              }}
            >
              {isAuthenticated ? <Settings /> : <User />}
            </Button>
          </motion.div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
