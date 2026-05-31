"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import {
  operationsService,
  ReviewType,
  ReviewStats,
  VendorReviewRow as VendorRow,
  RiderReviewRow as RiderRow,
} from "@/lib/api/services/operations.service";
import StatsCards from "@/components/operations/reviews/StatsCards";
import ReviewFilters from "@/components/operations/reviews/ReviewFilters";
import ReviewsTable from "@/components/operations/reviews/ReviewsTable";
import ReviewDetailsModal from "@/components/operations/reviews/ReviewDetailsModal";

// The backend returns pagination fields flat at the root, not nested.
// This matches the actual API response shape.
interface ReviewsApiResponse<T> {
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export default function ReviewsPage() {
  // ── State ────────────────────────────────────────────────
  const [type, setType] = useState<ReviewType>("rider");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [rows, setRows] = useState<(VendorRow | RiderRow)[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 7,
  });
  const [ratingCategory, setRatingCategory] = useState("");
  const [pageSize, setPageSize] = useState(7);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalId, setModalId] = useState<string | null>(null);
  const [modalFilter, setModalFilter] = useState<string | null>(null);

  // ── Fetch Stats ──────────────────────────────────────────
  useEffect(() => {
    setStatsLoading(true);
    operationsService.getReviewStats(type).then((s) => {
      setStats(s);
      setStatsLoading(false);
    });
  }, [type]);

  // ── Fetch Table ──────────────────────────────────────────
  const loadTable = useCallback(
    async (page: number, category: string, limit = pageSize) => {
      setTableLoading(true);
      try {
        const queryParams = {
          page,
          limit,
          ...(category ? { ratingCategory: category as any } : {}),
        };

        const res = (
          type === "vendor"
            ? await operationsService.getVendorReviews(queryParams)
            : await operationsService.getRiderReviews(queryParams)
        ) as ReviewsApiResponse<VendorRow | RiderRow>;

        setRows(Array.isArray(res.data) ? res.data : []);
        setPagination({
          page: res.page ?? 1,
          totalPages: res.totalPages ?? 1,
          total: res.total ?? 0,
          limit: res.limit ?? limit,
        });
      } catch (err: any) {
        toast.error(err?.message || "Failed to load reviews");
        setRows([]);
      } finally {
        setTableLoading(false);
      }
    },
    [type, pageSize]
  );

  useEffect(() => {
    loadTable(1, ratingCategory);
  }, [type, loadTable]);

  // ── Handlers ─────────────────────────────────────────────
  const handleTypeChange = (t: ReviewType) => {
    setType(t);
    setTypeDropdownOpen(false);
    setRatingCategory("");
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleSearch = (cat: string) => {
    setRatingCategory(cat);
    loadTable(1, cat);
  };

  const handleReset = () => {
    setRatingCategory("");
    loadTable(1, "");
  };

  const handlePageChange = (page: number) => {
    loadTable(page, ratingCategory);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    loadTable(1, ratingCategory, size);
  };

  const handleOpenDetail = (id: string, filter?: string) => {
    setModalId(id);
    setModalFilter(filter ?? null);
    setModalOpen(true);
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="px-4 sm:px-6 py-6 min-h-screen bg-white">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-black text-[#1a3f1c]">Reviews &amp; Ratings</h1>

        {/* Type Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTypeDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            {type === "vendor" ? "Vendor" : "Rider"}
            <ChevronDown size={14} className="text-gray-400" />
          </button>
          {typeDropdownOpen && (
            <ul className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-md z-10 overflow-hidden">
              {(["vendor", "rider"] as ReviewType[]).map((t) => (
                <li key={t}>
                  <button
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={`w-full text-left px-3 py-2 text-sm capitalize hover:bg-[#e8f8e8] transition-colors ${
                      type === t ? "bg-[#e8f8e8] font-semibold text-[#1A3F1C]" : "text-gray-700"
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <StatsCards stats={stats} loading={statsLoading} />
      <ReviewFilters onSearch={handleSearch} onReset={handleReset} />

      <ReviewsTable
        type={type}
        rows={rows}
        loading={tableLoading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onOpenDetail={handleOpenDetail}
      />

      {modalOpen && modalId && (
        <ReviewDetailsModal
          type={type}
          id={modalId}
          initialFilter={modalFilter}
          onClose={() => {
            setModalOpen(false);
            setModalId(null);
            setModalFilter(null);
          }}
        />
      )}
    </div>
  );
}