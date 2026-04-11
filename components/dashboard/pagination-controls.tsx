'use client';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalItems: number;
}

export function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  totalItems,
}: PaginationControlsProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground">Displays</span>
        <input
          type="text"
          value={itemsPerPage}
          readOnly
          className="w-12 px-2 py-1 text-center border border-border rounded bg-background text-foreground"
        />
      </div>

      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-border rounded text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
      >
        First
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-border rounded text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
      >
        Previous
      </button>

      <div className="flex gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-2 py-1 rounded text-sm transition-colors ${
              currentPage === page
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-foreground hover:bg-secondary'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-border rounded text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
      >
        Next
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-border rounded text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
      >
        Last
      </button>
    </div>
  );
}
