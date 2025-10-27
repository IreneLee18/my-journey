import { DataTable } from '@/components/customs/dataTable';
import { PageLayout } from '@/components/customs/pageLayout';
import { getColumns } from './table.config';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useStatusDialogState } from '@/utils/statusDialogState';
import { useGetPosts } from '@/server/posts/getPosts/hook';
import { useDeletePost } from '@/server/posts/deletePost/hook';
import { MobilePostCard } from './mobileCard';

export default function AdminPosts() {
  const { openStatusDialog } = useStatusDialogState();
  const { data, isLoading, error } = useGetPosts({ page: 1, pageSize: 10 });
  const { mutate: deletePost } = useDeletePost();

  const onDelete = (id: string) => {
    openStatusDialog({
      title: '刪除文章',
      description: '確定要刪除此文章嗎？',
      status: 'delete',
      confirmText: '刪除',
      cancelText: '取消',
      onConfirm: () => {
        deletePost({ id });
      },
    });
  };

  if (isLoading) {
    return (
      <PageLayout title="文章管理">
        <div>載入中...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="文章管理">
        <div>錯誤: {error.message}</div>
      </PageLayout>
    );
  }

  const posts = data?.data?.posts || [];

  return (
    <PageLayout
      title="文章管理"
      customActions={
        <Link
          to={adminPaths.postCreate.url}
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <Plus />
          新增文章
        </Link>
      }
    >
      {/* 桌面版：顯示 DataTable */}
      <div className="hidden md:block">
        <DataTable data={posts} columns={getColumns({ onDelete })} />
      </div>

      {/* 手機版：顯示卡片列表 */}
      <div className="md:hidden space-y-4">
        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
            <span className="text-lg">無資料</span>
          </div>
        ) : (
          posts.map((post) => {
            return (
              <MobilePostCard key={post.id} post={post} onDelete={onDelete} />
            );
          })
        )}
      </div>
    </PageLayout>
  );
}
