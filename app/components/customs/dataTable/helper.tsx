import type { ColumnDef } from '@tanstack/react-table';
import type { IndexColumnCellProps } from './types';

export const createIndexColumn = <TData,>(): ColumnDef<TData> => {
  return {
    id: '__row_index__',
    header: '#',
    cell: ({ row }: IndexColumnCellProps<TData>) => {
      return row.index + 1;
    },
    size: 48,
    enableSorting: false,
    enableHiding: true,
  };
};

export const formatQueryTime = (date: Date) => {
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};
