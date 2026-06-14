"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [7, 10, 20, 50],
}: PaginationProps) {
  const getPageNumbers = () => {
    const maxButtons = 5;
    const pages: number[] = [];
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      const end = Math.min(totalPages, start + maxButtons - 1);
      if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const btnBase =
    "inline-flex items-center justify-center h-8 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const btnIcon = `${btnBase} w-8 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-white">
      {/* Page size + count */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Show</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          title="Rows per page"
          aria-label="Rows per page"
          className="h-8 px-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1a3f1c]/30 cursor-pointer"
        >
          {pageSizeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span>per page</span>
        <span className="hidden sm:inline text-gray-300">·</span>
        <span className="hidden sm:inline">
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={btnIcon}
          title="First page"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={btnIcon}
          title="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {pageNumbers[0] > 1 && (
          <>
            <button
              type="button"
              onClick={() => onPageChange(1)}
              className={`${btnBase} w-8 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50`}
            >
              1
            </button>
            {pageNumbers[0] > 2 && <span className="text-gray-400 text-sm px-1">…</span>}
          </>
        )}

        {pageNumbers.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onPageChange(n)}
            className={`${btnBase} w-8 border ${
              currentPage === n
                ? "bg-[#1a3f1c] text-white border-[#1a3f1c] shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {n}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="text-gray-400 text-sm px-1">…</span>
            )}
            <button
              type="button"
              onClick={() => onPageChange(totalPages)}
              className={`${btnBase} w-8 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={btnIcon}
          title="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className={btnIcon}
          title="Last page"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
