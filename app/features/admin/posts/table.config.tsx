import type { ColumnDef } from '@tanstack/react-table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Link } from 'react-router';
import { adminPaths } from '@/constants/paths';
import { cn } from '@/lib/utils';
import { PencilIcon, TrashIcon } from 'lucide-react';
import type { Post } from '@/server/posts/getPosts/type';


type ColumnProps = {
  onDelete: (id: string) => void;
};

export const getColumns = ({
  onDelete,
}: ColumnProps): ColumnDef<Post>[] => {
  return [
    {
      accessorKey: 'title',
      header: '標題',
      cell: (row) => {
        const { title } = row.row.original;
        return <span>{title}</span>;
      },
    },
    {
      accessorKey: 'images',
      header: '圖片',
      cell: (row) => {
        const { images, title } = row.row.original;
        // 顯示第一張圖片（如果有的話）
        const firstImage = images[0];
        return firstImage ? (
          <img
            src={firstImage.url}
            alt={title}
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
            無圖片
          </div>
        );
      },
    },
    {
      accessorKey: 'publishDate',
      header: '發佈日期',
      cell: (row) => {
        const { publishDate } = row.row.original;
        return <span>{publishDate}</span>;
      },
    },
    {
      accessorKey: 'action',
      size: 100,
      meta: {
        className: 'text-right',
      },
      header: '操作',
      cell: (row) => {
        const { id } = row.row.original;
        return (
          <div className="flex gap-2">
            <Link
              to={`${adminPaths.postEdit.url}/${id}`}
              className={cn(
                buttonVariants({ variant: 'outline', className: 'w-1/2' })
              )}
            >
              <PencilIcon />
              編輯
            </Link>
            <Button
              variant="outline"
              className="w-1/2"
              onClick={() => {
                return onDelete(id);
              }}
            >
              <TrashIcon />
              刪除
            </Button>
          </div>
        );
      },
    },
  ];
};
