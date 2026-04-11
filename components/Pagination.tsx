"use client";

import { Button } from "@/components/ui/button";

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
  // Calculate which page numbers to show (max 7 buttons)
  const getPageNumbers = () => {
    const maxButtons = 7;
    const pages: number[] = [];

    if (totalPages <= maxButtons) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages with current page in middle when possible
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);

      // Adjust start if we're near the end
      if (endPage - startPage < maxButtons - 1) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between p-4 border-t border-border bg-surface">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground font-medium">Displays</span>
        <select
          className="border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-secondary text-primary font-bold"
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        {/* First Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="text-sm bg-secondary border-none text-primary hover:bg-secondary/80 font-bold px-4"
        >
          First
        </Button>

        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-sm bg-secondary border-none text-primary hover:bg-secondary/80 font-bold px-4"
        >
          Previous
        </Button>

        {/* Page Number Buttons */}
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className={`min-w-[2.5rem] font-bold border-none ${
              currentPage === pageNum 
                ? "bg-primary text-white hover:bg-primary/90" 
                : "bg-secondary text-primary hover:bg-secondary/80"
            }`}
          >
            {pageNum}
          </Button>
        ))}

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="text-sm bg-secondary border-none text-primary hover:bg-secondary/80 font-bold px-4"
        >
          Next
        </Button>

        {/* Last Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="text-sm bg-secondary border-none text-primary hover:bg-secondary/80 font-bold px-4"
        >
          Last
        </Button>
      </div>
    </div>
  );
}