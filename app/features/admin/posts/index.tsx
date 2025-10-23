import React from 'react';
import { DataTable } from '@/components/customs/dataTable';
import { PageLayout } from '@/components/customs/pageLayout';
import { POST_COLUMNS } from './table.config';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';

export default function AdminPosts() {
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
        columns={POST_COLUMNS}
      />
    </PageLayout>
  );
}
