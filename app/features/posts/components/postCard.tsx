import { Link } from 'react-router';
import { useState } from 'react';

export type Post = {
  id: string;
  title: string;
  publishDate: string;
  image: string;
}

type PostCardProps = {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block bg-white dark:bg-gray-950/60 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
    >
      <div className="aspect-4/3 overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <span className="text-sm">載入失敗</span>
          </div>
        )}
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            return setImageLoaded(true);
          }}
          onError={() => {
            return setImageError(true);
          }}
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500">{post.publishDate}</p>
      </div>
    </Link>
  );
};
