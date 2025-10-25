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
import { toast } from 'sonner';

export default function AdminPosts() {
  const { openStatusDialog } = useStatusDialogState();
  const { data, isLoading, error } = useGetPosts({ page: 1, pageSize: 10 });
  const { mutate: deletePost } = useDeletePost();

  const onDelete = (id: string) => {
    openStatusDialog({
      title: 'Delete Post',
      description: 'Are you sure you want to delete this post?',
      status: 'delete',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        deletePost({ id });
      },
    });
  };

  if (isLoading) {
    return (
      <PageLayout title="Posts">
        <div>Loading...</div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Posts">
        <div>Error: {error.message}</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Posts"
      customActions={
        <Link
          to={adminPaths.postCreate.url}
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          <Plus />
          New Post
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
