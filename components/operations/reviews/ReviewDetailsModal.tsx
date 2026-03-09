"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Smile, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  operationsService,
  ReviewType,
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
  active: number | null;
  onChange: (star: number) => void;
}) {
  const stars = [5, 4, 3, 2, 1];
  return (
    <div className="flex gap-2 flex-wrap">
      {stars.map((s) => (
        <button
          key={s}
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
        onClick={() => onAction("warn")}
        className="py-3 rounded-xl bg-[#D0021B] text-white font-bold text-sm hover:bg-red-700 transition-colors"
      >
        Warn Account
      </button>
      <button
        onClick={() => onAction("suspend")}
        className="py-3 rounded-xl bg-[#FFCA3A] text-gray-900 font-bold text-sm hover:bg-yellow-400 transition-colors"
      >
        Suspened Account
      </button>
      <button
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
  filter: string | null;
  onFilterChange: (f: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      {/* Left: info */}
      <div className="flex gap-4 flex-1">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <Image src={detail.photo} alt={detail.name} fill className="object-cover" unoptimized />
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

      {/* Right: filter button */}
      <div className="flex sm:flex-col gap-2 items-start">
        <button
          onClick={() => onFilterChange("mixed")}
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
  filter: string | null;
  onFilterChange: (f: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      {/* Left: info */}
      <div className="flex gap-4 flex-1">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <Image src={detail.photo} alt={detail.name} fill className="object-cover" unoptimized />
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

      {/* Right: filter buttons */}
      <div className="flex sm:flex-col gap-2 items-start">
        <button
          onClick={() => onFilterChange("mixed")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            filter === "mixed"
              ? "bg-yellow-400 border-yellow-400 text-gray-900"
              : "bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
          }`}
        >
          Mixed review <Smile size={14} />
        </button>
        <button
          onClick={() => onFilterChange("bad")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            filter === "bad"
              ? "bg-[#D0021B] border-[#D0021B] text-white"
              : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
          }`}
        >
          Bad Review <ThumbsDown size={14} />
        </button>
        <button
          onClick={() => onFilterChange("good")}
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
  const [activeFilter, setActiveFilter] = useState<string | null>(
    initialFilter ?? null
  );
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch detail on mount
  useEffect(() => {
    setLoading(true);
    if (type === "vendor") {
      operationsService.getVendorReviewDetail(id).then((d) => {
        setVendorDetail(d);
        setReviews(d.reviews);
        setLoading(false);
      });
    } else {
      operationsService.getRiderReviewDetail(id).then((d) => {
        setRiderDetail(d);
        setReviews(d.reviews);
        setLoading(false);
      });
    }
  }, [id, type]);

  // Refetch reviews on star or filter change
  useEffect(() => {
    if (loading) return;
    setReviewsLoading(true);
    const fetch =
      type === "vendor"
        ? operationsService.getVendorReviewDetail(id, { starFilter: activeStar })
        : operationsService.getRiderReviewDetail(id, { starFilter: activeStar });
    fetch.then((d) => {
      setReviews(d.reviews);
      setReviewsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStar, activeFilter]);

  const handleAction = async (action: string) => {
    if (action === "warn") await operationsService.warnReviewAccount(type, id);
    else if (action === "suspend") await operationsService.suspendReviewAccount(type, id);
    else if (action === "commend") await operationsService.commendReviewAccount(type, id);
    alert(`Action "${action}" completed.`);
  };

  const title = type === "vendor" ? "Vendor's Review" : "Rider's Review";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div className="bg-[#f0faf0] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-gray-200 bg-[#f0faf0]">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
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
              {/* Info Header */}
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

              {/* Star Tabs */}
              <div className="mb-4">
                <StarTabs
                  active={activeStar}
                  onChange={(s) => setActiveStar(s)}
                />
              </div>

              {/* Review List */}
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