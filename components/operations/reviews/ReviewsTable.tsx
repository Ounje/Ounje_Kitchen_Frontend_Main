"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import {
  VendorReviewRow as VendorRow,
  RiderReviewRow as RiderRow,
  AllReviewRow,
  ReviewType,
} from "@/lib/api/services/operations.service";
import Pagination from "@/components/Pagination";

// ── Types ──────────────────────────────────────────────────

interface ReviewsTableProps {
  type: ReviewType;
  rows: (VendorRow | RiderRow | AllReviewRow)[];
  loading?: boolean;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onOpenDetail: (id: string, entityType: ReviewType, filter?: string) => void;
}

// ── Skeleton ───────────────────────────────────────────────

function TableSkeleton({ cols }: { cols: number }) {
  return (
    <>
      {[...Array(7)].map((_, i) => (
        <tr key={i} className="border-b border-gray-100 animate-pulse">
          {[...Array(cols)].map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Action Buttons ─────────────────────────────────────────

function ActionButtons({
  id,
  entityType,
  starRating,
  onOpen,
}: {
  id: string;
  entityType: ReviewType;
  starRating: number;
  onOpen: (id: string, entityType: ReviewType, filter?: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={() => onOpen(id, entityType)}
        className="flex items-center gap-1 text-[#1A3F1C] text-sm font-semibold hover:underline"
      >
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400">
          <Star size={12} fill="white" className="text-white" />
        </span>
        <span>{starRating} Star rating</span>
      </button>
      <button
        type="button"
        onClick={() => onOpen(id, entityType, "mixed")}
        className="text-[#1A3F1C] text-sm font-semibold hover:underline"
      >
        Mixed Rating
      </button>
    </div>
  );
}

// ── Main Table ─────────────────────────────────────────────

export default function ReviewsTable({
  type,
  rows,
  loading,
  pagination,
  onPageChange,
  onPageSizeChange,
  onOpenDetail,
}: ReviewsTableProps) {
  const thCls =
    "px-4 py-3 text-left text-sm font-semibold text-[#1A3F1C] bg-[#c8f0c8] first:rounded-tl-lg last:rounded-tr-lg";

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className={thCls} style={{ width: 50 }}>
                S/N
              </th>
              <th className={thCls} style={{ width: 180 }}>
                Name
              </th>
              {type === "all" && (
                <th className={thCls} style={{ width: 90 }}>
                  Type
                </th>
              )}
              <th className={thCls}>
                {type === "vendor" ? "Address" : type === "rider" ? "Zone" : "Location"}
              </th>
              <th className={thCls} style={{ width: 130 }}>
                Total Ratings
              </th>
              <th className={thCls} style={{ width: 260 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton cols={type === "all" ? 6 : 5} />
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={type === "all" ? 6 : 5}
                  className="text-center py-12 text-gray-400 text-sm"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => {
                const sn = (pagination.page - 1) * pagination.limit + idx + 1;
                const vendorRow = row as VendorRow;
                const riderRow = row as RiderRow;
                const allRow = row as AllReviewRow;

                const location =
                  type === "vendor"
                    ? vendorRow.address
                    : type === "rider"
                      ? riderRow.zone
                      : allRow.location;

                const entityType: ReviewType = type === "all" ? allRow.entityType : type;

                return (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-[#f7fdf7] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-gray-700">{sn}</td>

                    {/* Name + photo */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {row.photo ? (
                            <Image
                              src={row.photo}
                              alt={row.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold">
                              {row.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{row.name}</span>
                      </div>
                    </td>

                    {/* Type badge — only in "all" mode */}
                    {type === "all" && (
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            allRow.entityType === "vendor"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {allRow.entityType === "vendor" ? "Vendor" : "Rider"}
                        </span>
                      </td>
                    )}

                    {/* Location */}
                    <td className="px-4 py-3 text-sm text-gray-600">{location}</td>

                    {/* Total Ratings */}
                    <td className="px-4 py-3 text-sm text-gray-700">{row.totalRatings}</td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <ActionButtons
                        id={row.id}
                        entityType={entityType}
                        starRating={row.starRating}
                        onOpen={onOpenDetail}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={pagination.limit}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
