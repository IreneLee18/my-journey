import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../ui/pagination';

interface PaginationGroupProps {
  /** 當前頁碼 */
  currentPage?: number;
  /** 每頁顯示數量 */
  pageSize?: number;
  /** 總數據條數 */
  total?: number;
  /** 頁碼改變時的回調函數 */
  onPageChange?: (page: number, pageSize: number) => Promise<void> | void;
  /** 每頁條數改變的回調函數 */
  onPageSizeChange?: (pageSize: number) => Promise<void> | void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否顯示加載狀態 */
  loading?: boolean;
  /** 每頁顯示條數選項 */
  pageSizeOptions?: number[];
  /** 是否顯示每頁條數選擇器 */
  showSizeChanger?: boolean;
  /** 用於記錄分頁狀態的 key */
  stateKey?: string;
}

export function PaginationGroup({
  currentPage = 1,
  pageSize = 12,
  total = 0,
  onPageChange,
  onPageSizeChange,
  disabled = false,
  loading = false,
  pageSizeOptions = [12, 24, 48, 96],
  showSizeChanger = false,
}: PaginationGroupProps) {
  // 計算總頁數
  const totalPages = Math.ceil(total / pageSize);
  // 是否顯示省略號
  // 是否顯示加載中或禁用狀態
  const isDisabled = disabled || loading;

  // 處理頁碼變更
  const handlePageChange = async (page: number) => {
    if (isDisabled || page === currentPage) return;

    try {
      if (onPageChange) {
        await onPageChange(page, pageSize);
      }
    } catch (error) {
      // console.error('Failed to change page:', error);
    }
  };

  // 處理每頁條數變更
  const handlePageSizeChange = async (newPageSize: number) => {
    if (isDisabled || newPageSize === pageSize) return;

    try {
      if (onPageSizeChange) {
        await onPageSizeChange(newPageSize);
      }
    } catch (error) {
      // console.error('Failed to change page size:', error);
    }
  };

  // 計算要顯示的頁碼
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // 如果總頁數小於等於最大可見頁數，顯示所有頁碼
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 總是顯示第一頁
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(currentPage + 1, totalPages - 1);

      // 調整 start 和 end，確保顯示足夠的頁碼
      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      // 添加省略號
      if (start > 2) {
        pages.push(-1); // -1 表示省略號
      }

      // 添加中間的頁碼
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // 添加省略號
      if (end < totalPages - 1) {
        pages.push(-1); // -1 表示省略號
      }

      // 總是顯示最後一頁
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const disabledStyles = isDisabled ? 'pointer-events-none opacity-50' : '';
  const loadingStyles = loading ? 'animate-pulse' : '';

  return (
    <div className="flex md:items-center items-end md:flex-row flex-col gap-4">
      <Pagination className={loadingStyles}>
        <PaginationContent>
          {/* <PaginationItem> */}
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              void handlePageChange(Math.max(1, currentPage - 1));
            }}
            aria-disabled={isDisabled || currentPage === 1}
            className={disabledStyles}
          />
          {/* </PaginationItem> */}

          {getPageNumbers().map((pageNumber, index) => {
            return pageNumber === -1 ? (
              <PaginationItem key={`ellipsis-${index.toString()}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber.toString()}>
                <PaginationLink
                  key={pageNumber.toString()}
                  onClick={(e) => {
                    e.preventDefault();
                    void handlePageChange(pageNumber);
                  }}
                  isActive={currentPage === pageNumber}
                  className={disabledStyles}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                void handlePageChange(Math.min(totalPages, currentPage + 1));
              }}
              aria-disabled={isDisabled || currentPage === totalPages}
              className={disabledStyles}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showSizeChanger && (
        <select
          className="border-input bg-background h-9 rounded-md border px-3"
          value={pageSize}
          onChange={(e) => {
            return void handlePageSizeChange(Number(e.target.value));
          }}
          disabled={isDisabled}
        >
          {pageSizeOptions.map((size) => {
            return (
              <option key={size} value={size}>
                {size} / 頁
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
}
