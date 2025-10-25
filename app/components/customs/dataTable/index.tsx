import { useState, useEffect, useMemo } from 'react';
import type {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ColumnDef,
  GroupingState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { PaginationGroup } from '@/components/customs/paginationGroup';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import type { DataTableProps } from './types';
import { createIndexColumn } from './helper';

export function DataTable<TData>({
  data,
  columns,
  pagination,
  isLoading = false,
  isError,
  meta,
  showPaginationSizeChanger = false,
}: DataTableProps<TData>) {
  const [grouping, setGrouping] = useState<GroupingState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // 產生 index 欄位
  const indexColumn = useMemo(() => {
    return createIndexColumn<TData>();
  }, []);

  const table = useReactTable({
    data,
    columns: [indexColumn, ...columns],
    onGroupingChange: setGrouping,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    meta,
    state: {
      grouping,
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder,
      pagination: {
        pageIndex: pagination?.currentPage ? pagination.currentPage - 1 : 0,
        pageSize: pagination?.pageSize ?? 10,
      },
    },
    pageCount: pagination?.totalElements
      ? Math.ceil(pagination.totalElements / pagination.pageSize)
      : undefined,
    manualPagination: Boolean(pagination), // 如果有 pagination 配置則使用手動分頁，否則使用前端分頁
  });

  return (
    <div className="w-full max-w-full space-y-4">
      <div className="max-w-full rounded-md border border-gray-200 dark:border-gray-800">
        <Table>
          <TableHeader> 
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const columnSize = Math.min(header.column.getSize(), 400);
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: columnSize,
                          minWidth: columnSize,
                          maxWidth: 400,
                        }}
                        className="p-4 border-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-destructive text-lg font-medium">
                      載入失敗
                    </span>
                    <span className="text-muted-foreground">
                      {isError.message}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="text-muted-foreground">載入中...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : null}
            {!isLoading &&
              !isError &&
              table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleLeafColumns().length}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-muted-foreground text-lg">
                        無資料
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            {!isLoading &&
              !isError &&
              table.getRowModel().rows.length > 0 &&
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const columnSize = Math.min(cell.column.getSize(), 400);
                      return (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: columnSize,
                            minWidth: columnSize,
                            maxWidth: 400,
                          }}
                          className="h-11 overflow-hidden whitespace-nowrap text-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <div className={cn('flex items-center justify-end space-x-2 py-4')}>
        <div className="text-gray-600 dark:text-gray-400 text-sm flex-1">
          共
          {pagination?.totalElements ?? table.getFilteredRowModel().rows.length}
          筆
        </div>
        <PaginationGroup
          currentPage={pagination?.currentPage ?? 1}
          pageSize={pagination?.pageSize ?? 10}
          total={
            pagination?.totalElements ?? table.getFilteredRowModel().rows.length
          }
          onPageChange={(page) => {
            pagination?.onPageChange?.(page);
          }}
          onPageSizeChange={(newPageSize) => {
            pagination?.onPageSizeChange?.(newPageSize);
          }}
          showSizeChanger={showPaginationSizeChanger}
        />
      </div>
    </div>
  );
}
