"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Smile, ThumbsDown, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import {
  operationsService,
  ReviewType,
  ReviewFilter,
  VendorReviewDetail as VendorDetail,
  RiderReviewDetail as RiderDetail,
  ReviewItem,
} from "@/lib/api/services/operations.service";
import StarRating from "./StarRating";
import ReviewList from "./ReviewList";

// ── Star Tabs ──────────────────────────────────────────────

function StarTabs({
  active,
  onChange,
}: {
  active: number;
  onChange: (star: number) => void;
}) {
  const stars = [5, 4, 3, 2, 1];
  return (
    <div className="flex gap-2 flex-wrap">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
            active === s
              ? "bg-[#1A3F1C] text-white border-[#1A3F1C]"
              : "bg-white text-gray-700 border-gray-300 hover:border-[#1A3F1C] hover:text-[#1A3F1C]"
          }`}
        >
          {s} Star
          <span className={active === s ? "text-yellow-300" : "text-yellow-500"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// ── Bottom Actions ─────────────────────────────────────────

function ActionButtons({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={() => onAction("warn")}
        className="py-3 rounded-xl bg-[#D0021B] text-white font-bold text-sm hover:bg-red-700 transition-colors"
      >
        Warn Account
      </button>
      <button
        type="button"
        onClick={() => onAction("suspend")}
        className="py-3 rounded-xl bg-[#FFCA3A] text-gray-900 font-bold text-sm hover:bg-yellow-400 transition-colors"
      >
        Suspend Account
      </button>
      <button
        type="button"
        onClick={() => onAction("commend")}
        className="py-3 rounded-xl bg-[#1A3F1C] text-white font-bold text-sm hover:bg-[#16341a] transition-colors"
      >
        Commend Account
      </button>
    </div>
  );
}

// ── Vendor Info Header ─────────────────────────────────────

function VendorInfoHeader({
  detail,
  filter,
  onFilterChange,
}: {
  detail: VendorDetail;
  filter: string;
  onFilterChange: (f: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex gap-4 flex-1">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {detail.photo ? (
            <Image
              src={detail.photo}
              alt={detail.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
              {detail.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-semibold">Name:</span> {detail.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone number:</span> {detail.phoneNumber}
          </p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="font-semibold">Rating:</span>
            <StarRating rating={detail.rating} count={detail.ratingCount} size={14} />
          </div>
          <p className="text-sm">
            <span className="font-semibold">Zone:</span> {detail.address}
          </p>
        </div>
      </div>

      {/* Vendors only have the "mixed" filter */}
      <div className="flex sm:flex-col gap-2 items-start">
        <button
          onClick={() => onFilterChange(filter === "mixed" ? "" : "mixed")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            filter === "mixed"
              ? "bg-yellow-400 border-yellow-400 text-gray-900"
              : "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          Mixed review <Smile size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Rider Info Header ──────────────────────────────────────

function RiderInfoHeader({
  detail,
  filter,
  onFilterChange,
}: {
  detail: RiderDetail;
  filter: string;
  onFilterChange: (f: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <div className="flex gap-4 flex-1">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {detail.photo ? (
            <Image
              src={detail.photo}
              alt={detail.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl font-bold">
              {detail.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="font-semibold">Name:</span> {detail.name}
          </p>
          <p className="text-sm">
            <span className="font-semibold">Phone number:</span> {detail.phoneNumber}
          </p>
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <span className="font-semibold">Rating:</span>
            <StarRating rating={detail.rating} count={detail.ratingCount} size={14} />
          </div>
          <p className="text-sm">
            <span className="font-semibold">Zone:</span> {detail.zone}
          </p>
        </div>
      </div>

      {/* Riders get mixed + bad + good filters */}
      <div className="flex sm:flex-col gap-2 items-start">
        <button
          onClick={() => onFilterChange(filter === "mixed" ? "" : "mixed")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            filter === "mixed"
              ? "bg-yellow-400 border-yellow-400 text-gray-900"
              : "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          Mixed review <Smile size={14} />
        </button>
        <button
          onClick={() => onFilterChange(filter === "bad" ? "" : "bad")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            filter === "bad"
              ? "bg-[#D0021B] border-[#D0021B] text-white"
              : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
          }`}
        >
          Bad Review <ThumbsDown size={14} />
        </button>
        <button
          onClick={() => onFilterChange(filter === "good" ? "" : "good")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            filter === "good"
              ? "bg-[#1A3F1C] border-[#1A3F1C] text-white"
              : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
          }`}
        >
          Good Review <ThumbsUp size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────

interface ReviewDetailsModalProps {
  type: ReviewType;
  id: string;
  initialFilter?: string | null;
  onClose: () => void;
}

export default function ReviewDetailsModal({
  type,
  id,
  initialFilter,
  onClose,
}: ReviewDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [vendorDetail, setVendorDetail] = useState<VendorDetail | null>(null);
  const [riderDetail, setRiderDetail] = useState<RiderDetail | null>(null);
  const [activeStar, setActiveStar] = useState<number>(5);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter ?? "");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Build consistent params for every API call
  const buildParams = (star: number, filter: string) => ({
    starFilter: star,
    ...(filter ? { filter: filter as ReviewFilter } : {}),
  });

  // ── Initial load ────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    const params = buildParams(activeStar, activeFilter);

    const request =
      type === "vendor"
        ? operationsService.getVendorReviewDetail(id, params)
        : operationsService.getRiderReviewDetail(id, params);

    request
      .then((d: any) => {
        // Backend wraps payload in { success, message, data: {...} }
        const detail = d?.data ?? d;
        if (type === "vendor") setVendorDetail(detail as VendorDetail);
        else setRiderDetail(detail as RiderDetail);
        setReviews(detail.reviews ?? []);
        setLoading(false);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load review details");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  // ── Refetch when star tab or filter pill changes ─────────
  useEffect(() => {
    if (loading) return;
    setReviewsLoading(true);
    const params = buildParams(activeStar, activeFilter);

    const request =
      type === "vendor"
        ? operationsService.getVendorReviewDetail(id, params)
        : operationsService.getRiderReviewDetail(id, params);

    request
      .then((d: any) => {
        const detail = d?.data ?? d;
        setReviews(detail.reviews ?? []);
        setReviewsLoading(false);
      })
      .catch((err: any) => {
        toast.error(err?.message || "Failed to load reviews");
        setReviewsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStar, activeFilter]);

  const handleAction = async (action: string) => {
    try {
      if (action === "warn") await operationsService.warnReviewAccount(type, id);
      else if (action === "suspend") await operationsService.suspendReviewAccount(type, id);
      else if (action === "commend") await operationsService.commendReviewAccount(type, id);
      const label = action === "warn" ? "warned" : action === "suspend" ? "suspended" : "commended";
      toast.success(`Account ${label} successfully`);
    } catch (err: any) {
      toast.error(err?.message || `Failed to ${action} account`);
    }
  };

  const title = type === "vendor" ? "Vendor's Review" : "Rider's Review";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#f0faf0] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-200 bg-[#f0faf0]">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
                  ))}
                </div>
              </div>
              <div className="h-px bg-gray-200 my-3" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-8 w-20 bg-gray-200 rounded-full" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {type === "vendor" && vendorDetail && (
                <VendorInfoHeader
                  detail={vendorDetail}
                  filter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              )}
              {type === "rider" && riderDetail && (
                <RiderInfoHeader
                  detail={riderDetail}
                  filter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              )}

              <hr className="border-gray-200 my-3" />

              <div className="mb-4">
                <StarTabs active={activeStar} onChange={setActiveStar} />
              </div>

              <ReviewList reviews={reviews} loading={reviewsLoading} />
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="px-6 pb-5 bg-[#f0faf0]">
          <ActionButtons onAction={handleAction} />
        </div>
      </div>
    </div>
  );
}