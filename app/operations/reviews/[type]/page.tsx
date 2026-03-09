"use client";

/**
 * /reviews/[type]/page.tsx
 *
 * This page shows a filtered view for a specific type (vendor | rider).
 * It reuses the same layout as the main reviews page but pre-selects
 * the type from the URL param.
 */

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  operationsService,
  ReviewType,
  ReviewStats,
  VendorReviewRow as VendorRow,
  RiderReviewRow as RiderRow,
} from "@/lib/api/services/operations.service";
import type { PaginatedResponse } from "@/types";
import StatsCards from "@/components/operations/reviews/StatsCards";
import ReviewFilters from "@/components/operations/reviews/ReviewFilters";
import ReviewsTable from "@/components/operations/reviews/ReviewsTable";
import ReviewDetailsModal from "@/components/operations/reviews/ReviewDetailsModal";

export default function ReviewTypePage() {
  const params = useParams();
  const router = useRouter();
  const rawType = params?.type as string;

  // Validate type
  const type: ReviewType =
    rawType === "vendor" || rawType === "rider" ? rawType : "rider";

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

  useEffect(() => {
    setStatsLoading(true);
    operationsService.getReviewStats(type).then((s) => {
      setStats(s);
      setStatsLoading(false);
    });
  }, [type]);

  const loadTable = useCallback(
    async (page: number, category: string, limit = pageSize) => {
      setTableLoading(true);
      try {
        let res: PaginatedResponse<VendorRow | RiderRow>;
        const params = { page, limit, ...(category ? { ratingCategory: category as any } : {}) };
        if (type === "vendor") {
          res = await operationsService.getVendorReviews(params);
        } else {
          res = await operationsService.getRiderReviews(params);
        }
        setRows(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          limit: res.limit,
        });
      } finally {
        setTableLoading(false);
      }
    },
    [type, pageSize]
  );

  useEffect(() => {
    loadTable(1, "");
  }, [loadTable]);

  const handleSearch = (cat: string) => {
    setRatingCategory(cat);
    loadTable(1, cat);
  };

  const handleReset = () => {
    setRatingCategory("");
    loadTable(1, "");
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    loadTable(1, ratingCategory, size);
  };

  const handleOpenDetail = (id: string, filter?: string) => {
    router.push(`/reviews/${type}/${id}${filter ? `?filter=${filter}` : ""}`);
  };

  const capitalised = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="px-4 sm:px-8 xl:px-14 py-6 min-h-screen bg-white">
      {/* Back link */}
      <Link
        href="/reviews"
        className="inline-flex items-center gap-1.5 text-sm text-[#1A3F1C] font-semibold hover:underline mb-4"
      >
        <ChevronLeft size={16} />
        Back to Reviews
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {capitalised} Reviews &amp; Rating
        </h1>
        <span className="px-4 py-1.5 bg-[#e8f8e8] text-[#1A3F1C] text-sm font-bold rounded-full border border-[#98EF9B]">
          {capitalised}
        </span>
      </div>

      <StatsCards stats={stats} loading={statsLoading} />
      <ReviewFilters onSearch={handleSearch} onReset={handleReset} />

      <ReviewsTable
        type={type}
        rows={rows}
        loading={tableLoading}
        pagination={pagination}
        onPageChange={(p) => loadTable(p, ratingCategory)}
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
          }}
        />
      )}
    </div>
  );
}