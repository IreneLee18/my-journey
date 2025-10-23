import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';
import { adminMenu } from '@/constants/menu';
import { adminPaths, paths } from '@/constants/paths';
import { NavItem } from './navItem';

type MobileNavigationProps = {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export default function MobileNavigation({
  isMobileMenuOpen,
  closeMobileMenu,
}: MobileNavigationProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: 實作登出邏輯
    closeMobileMenu();
    navigate(paths.home.url);
  };

  const handleBackToFrontend = () => {
    closeMobileMenu();
    return (window.location.href = '/');
  };

  const mobileMenuVariants = {
    hidden: {
      x: '-100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    visible: {
      x: 0,
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
        <>
          {/* Backdrop */}
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
          />

          {/* Sidebar */}
          <motion.aside
            className="md:hidden fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-200 z-50 flex flex-col"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
          >
            {/* Header */}
            <motion.div
              variants={mobileLinkVariants}
              className="p-4 border-b border-gray-200"
            >
              <Link
                to={adminPaths.posts.url}
                className="text-lg font-bold text-gray-900 hover:opacity-80 transition-opacity"
                onClick={closeMobileMenu}
              >
                Irene's Lee Journey 後台
              </Link>
            </motion.div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
              {adminMenu.map((item) => {
                return (
                  <motion.div key={item.path} variants={mobileLinkVariants}>
                    <NavItem navItem={item} onClick={closeMobileMenu} />
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer Actions */}
            <motion.div
              variants={mobileLinkVariants}
              className="p-4 border-t border-gray-200 space-y-2"
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={handleBackToFrontend}
              >
                <Home className="w-5 h-5" />
                回到前台
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                登出
              </Button>
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
