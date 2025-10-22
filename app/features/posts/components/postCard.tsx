import { Link } from 'react-router';

export interface Post {
  id: string;
  title: string;
  publishDate: string;
  image: string;
}

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link
      to={`/posts/${post.id}`}
      className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
    >
      <div className="aspect-4/3 overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500">{post.publishDate}</p>
      </div>
    </Link>
  );
};
