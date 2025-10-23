import type { ColumnDef } from '@tanstack/react-table';
import { Button, buttonVariants } from '@/components/ui/button';
import { formatDate } from 'date-fns';
import { Link } from 'react-router';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { PencilIcon, TrashIcon } from 'lucide-react';

type PostData = {
  id: string;
  title: string;
  publishDate: string;
  image: string;
};

export const POST_COLUMNS: ColumnDef<PostData>[] = [
  {
    size: 200,
    accessorKey: 'title',
    header: 'Title',
  },
  {
    size: 300,
    accessorKey: 'image',
    header: 'Image',
    cell: (row) => {
      const { image, title } = row.row.original;
      return <img src={image} alt={title} width={100} height={100} />;
    },
  },
  {
    accessorKey: 'publishDate',
    header: 'Publish Date',
    cell: (row) => {
      const { publishDate } = row.row.original;
      return <span>{formatDate(publishDate, 'yyyy/MM/dd')}</span>;
    },
  },
  {
    accessorKey: 'action',
    size: 100,
    meta: {
      className: 'text-right',
    },
    header: 'Action',
    cell: (row) => {
      return (
        <div className="flex gap-2">
          <Link
            to={adminPaths.postEdit.url}
            className={cn(buttonVariants({ variant: 'outline',className: 'w-1/2' }))}
          >
            <PencilIcon />
            編輯
          </Link>
          <Button variant="outline" className="w-1/2">
            <TrashIcon />
            刪除
          </Button>
        </div>
      );
    },
  },
];
