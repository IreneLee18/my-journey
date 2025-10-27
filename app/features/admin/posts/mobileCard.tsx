import { Button, buttonVariants } from '@/components/ui/button';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { formatDate } from 'date-fns';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import type { Post } from '@/server/posts/getPosts/type';

type MobilePostCardProps = {
  post: Post;
  onDelete: (id: string) => void;
};

export const MobilePostCard = ({ post, onDelete }: MobilePostCardProps) => {
  const firstImage = post.images[0];

  return (
    <div className="bg-white dark:bg-gray-950/60 rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-800">
      {/* 圖片區域 */}
      <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            無圖片
          </div>
        )}
      </div>

      {/* 內容區域 */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(post.publishDate, 'yyyy/MM/dd')}
          </p>
        </div>

        {/* 操作按鈕 */}
        <div className="flex gap-2 pt-2">
          <Link
            to={`${adminPaths.postEdit.url}/${post.id}`}
            className={cn(
              buttonVariants({ variant: 'outline', className: 'flex-1' })
            )}
          >
            <PencilIcon className="w-4 h-4" />
            編輯
          </Link>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              return onDelete(post.id);
            }}
          >
            <TrashIcon className="w-4 h-4" />
            刪除
          </Button>
        </div>
      </div>
    </div>
  );
};

