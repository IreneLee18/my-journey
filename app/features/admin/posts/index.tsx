import { useState } from 'react';
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
import { MobilePostList } from './mobileCard';

export default function AdminPosts() {
  const { openStatusDialog } = useStatusDialogState();
  const [searchParams, setSearchParams] = useState({ page: 1, size: 10 });

  const { data, isLoading, error } = useGetPosts({
    page: searchParams.page,
    pageSize: searchParams.size,
  });
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

  const handlePageChange = (page: number) => {
    setSearchParams({ ...searchParams, page });
  };

  const posts = data?.data?.posts || [];
  const total = data?.data?.total || 0;

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
      <div className="hidden md:block">
        <DataTable
          data={posts}
          columns={getColumns({ onDelete })}
          isLoading={isLoading}
          isError={error}
          pagination={{
            currentPage: searchParams.page,
            pageSize: searchParams.size,
            totalElements: total,
            onPageChange: handlePageChange,
          }}
        />
      </div>

      <div className="md:hidden">
        <MobilePostList
          posts={posts}
          total={total}
          isLoading={isLoading}
          error={error}
          currentPage={searchParams.page}
          pageSize={searchParams.size}
          onDelete={onDelete}
          onPageChange={handlePageChange}
        />
      </div>
    </PageLayout>
  );
}
