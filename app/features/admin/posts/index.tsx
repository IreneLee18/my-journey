import { DataTable } from '@/components/customs/dataTable';
import { PageLayout } from '@/components/customs/pageLayout';
import { getColumns } from './table.config';
import { buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useStatusDialogState } from '@/utils/statusDialogState';

export default function AdminPosts() {
  const { openStatusDialog } = useStatusDialogState();
  const onDelete = (id: string) => {
    openStatusDialog({
      title: 'Delete Post',
      description: 'Are you sure you want to delete this post?',
      status: 'delete',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('delete', id);
      },
    });
  };

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
        data={[
          {
            id: '1',
            title: 'Post 1',
            publishDate: '2021-01-01',
            image:
              'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
          },
          {
            id: '2',
            title: 'Post 2',
            publishDate: '2021-01-02',
            image:
              'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80',
          },
        ]}
        columns={getColumns({ onDelete })}
      />
    </PageLayout>
  );
}
