import { Button, buttonVariants } from '@/components/ui/button';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Link } from 'react-router';
import { PaginationGroup } from '@/components/customs/paginationGroup';
import type { Post } from '@/server/posts/getPosts/type';

// ==================== 單個卡片元件 ====================
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
            {post.publishDate}
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

// ==================== 完整列表元件 ====================
type MobilePostListProps = {
  posts: Post[];
  total: number;
  isLoading: boolean;
  error: Error | null;
  currentPage: number;
  pageSize: number;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
};

export const MobilePostList = ({
  posts,
  total,
  isLoading,
  error,
  currentPage,
  pageSize,
  onDelete,
  onPageChange,
}: MobilePostListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <span className="text-lg">載入中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-red-500">
        <span className="text-lg">錯誤: {error.message}</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <span className="text-lg">無資料</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 顯示總資料筆數 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        總共 <span className="font-semibold">{total}</span> 篇文章
      </div>

      {/* 卡片列表 */}
      {posts.map((post) => (
        <MobilePostCard key={post.id} post={post} onDelete={onDelete} />
      ))}

      {/* 分頁 */}
      <PaginationGroup
        currentPage={currentPage}
        total={total}
        pageSize={pageSize}
        onPageChange={(page) => onPageChange(page)}
      />
    </div>
  );
};

