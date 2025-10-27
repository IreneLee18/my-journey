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
      <DataTable
        data={data?.data?.posts || []}
        columns={getColumns({ onDelete })}
      />
    </PageLayout>
  );
}
