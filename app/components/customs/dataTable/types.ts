import type { Column, ColumnDef, Row, TableMeta } from '@tanstack/react-table';

export type PaginationConfig = {
  currentPage: number;
  pageSize: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  pagination?: PaginationConfig;
  showPaginationSizeChanger?: boolean;
  isLoading?: boolean;
  isError?: Error | null;
  meta?: TableMeta<TData>;
}

export type SortableHeaderProps<TData> = {
  column: Column<TData>;
};

export type IndexColumnCellProps<TData> = {
  row: Row<TData>;
};
