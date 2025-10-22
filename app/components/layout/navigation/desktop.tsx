import { Link } from 'react-router';

export default function DesktopNavigation() {
  return (
    <nav className="hidden md:flex gap-8">
      <Link
        to="/posts"
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium transition-colors"
      >
        Posts
      </Link>
      <Link
        to="/about"
        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 font-medium transition-colors"
      >
        About
      </Link>
    </nav>
  );
}
