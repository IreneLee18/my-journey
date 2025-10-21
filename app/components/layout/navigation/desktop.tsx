import { Link } from 'react-router';

export default function DesktopNavigation() {
  return (
    <nav className="hidden md:flex gap-8">
      <Link
        to="/post"
        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        Post
      </Link>
      <Link
        to="/about"
        className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
      >
        About
      </Link>
    </nav>
  );
}
