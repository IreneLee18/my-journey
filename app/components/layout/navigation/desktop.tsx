import { Link } from 'react-router';
import { useTranslation } from '@/i18n/useTranslation';

export default function DesktopNavigation() {
  const { t } = useTranslation();
  
  return (
    <nav className="hidden md:flex gap-8">
      <Link
        to="/posts"
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium transition-colors"
      >
        {t('nav.posts')}
      </Link>
      <Link
        to="/about"
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium transition-colors"
      >
        {t('nav.about')}
      </Link>
    </nav>
  );
}
