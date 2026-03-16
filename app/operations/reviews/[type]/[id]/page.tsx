"use client";

/**
 * /reviews/[type]/[id]/page.tsx
 *
 * Full detail page for a vendor or rider review.
 */

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Smile, ThumbsDown, ThumbsUp, X } from "lucide-react";
import {
  operationsService,
  ReviewType,
  ReviewFilter,
  VendorReviewDetail as VendorDetail,
  RiderReviewDetail as RiderDetail,
  ReviewItem,
} from "@/lib/api/services/operations.service";
import StarRating from "@/components/operations/reviews/StarRating";
import ReviewList from "@/components/operations/reviews/ReviewList";

// ── Star Tabs ──────────────────────────────────────────────

function StarTabs({
  active,
  onChange,
}: {
  active: number;
  onChange: (s: number) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {[5, 4, 3, 2, 1].map((s) => (
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
          <span className={active === s ? "text-yellow-300" : "text-yellow-500"}>★</span>
        </button>
      ))}
    </div>
  );
}

// ── Action Buttons ─────────────────────────────────────────

function ActionButtons({ onAction }: { onAction: (a: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <button
        onClick={() => onAction("warn")}
        className="py-3.5 rounded-xl bg-[#D0021B] text-white font-bold text-sm hover:bg-red-700 transition-colors"
      >
        Warn Account
      </button>
      <button
        onClick={() => onAction("suspend")}
        className="py-3.5 rounded-xl bg-[#FFCA3A] text-gray-900 font-bold text-sm hover:bg-yellow-400 transition-colors"
      >
        Suspend Account
      </button>
      <button
        onClick={() => onAction("commend")}
        className="py-3.5 rounded-xl bg-[#1A3F1C] text-white font-bold text-sm hover:bg-[#16341a] transition-colors"
      >
        Commend Account
      </button>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex gap-4 mb-6">
        <div className="w-28 h-28 bg-gray-200 rounded-xl" />
        <div className="flex-1 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-3/4" />
          ))}
        </div>
      </div>
      <div className="h-px bg-gray-200 mb-4" />
      <div className="flex gap-2 mb-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────

export default function ReviewDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawType = params?.type as string;
  const id = params?.id as string;
  const initialFilter = searchParams?.get("filter") ?? "";

  const type: ReviewType =
    rawType === "vendor" || rawType === "rider" ? rawType : "rider";

  const [loading, setLoading] = useState(true);
  const [vendorDetail, setVendorDetail] = useState<VendorDetail | null>(null);
  const [riderDetail, setRiderDetail] = useState<RiderDetail | null>(null);
  const [activeStar, setActiveStar] = useState(5);
  const [activeFilter, setActiveFilter] = useState<string>(initialFilter);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build consistent params for every API call
  const buildParams = (star: number, filter: string) => ({
    starFilter: star,
    ...(filter ? { filter: filter as ReviewFilter } : {}),
  });

  // ── Initial load ─────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = buildParams(activeStar, activeFilter);

    const request =
      type === "vendor"
        ? operationsService.getVendorReviewDetail(id, params)
        : operationsService.getRiderReviewDetail(id, params);

    request
      .then((d) => {
        if (type === "vendor") setVendorDetail(d as VendorDetail);
        else setRiderDetail(d as RiderDetail);
        setReviews(d.reviews);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load review details. Please try again.");
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, type]);

  // ── Refetch when star tab or filter pill changes ──────────
  useEffect(() => {
    if (loading) return;
    setReviewsLoading(true);
    const params = buildParams(activeStar, activeFilter);

    const request =
      type === "vendor"
        ? operationsService.getVendorReviewDetail(id, params)
        : operationsService.getRiderReviewDetail(id, params);

    request.then((d) => {
      setReviews(d.reviews);
      setReviewsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStar, activeFilter]);

  const handleAction = async (action: string) => {
    if (action === "warn") await operationsService.warnReviewAccount(type, id);
    else if (action === "suspend")
      await operationsService.suspendReviewAccount(type, id);
    else if (action === "commend")
      await operationsService.commendReviewAccount(type, id);
    alert(`Action "${action}" completed.`);
  };

  const capitalised = type.charAt(0).toUpperCase() + type.slice(1);
  const detail = type === "vendor" ? vendorDetail : riderDetail;

  return (
    <div className="px-4 sm:px-8 xl:px-14 py-6 min-h-screen bg-white">
      {/* Breadcrumb */}
      <Link
        href={`/reviews/${type}`}
        className="inline-flex items-center gap-1.5 text-sm text-[#1A3F1C] font-semibold hover:underline mb-5"
      >
        <ChevronLeft size={16} />
        Back to {capitalised} Reviews
      </Link>

      {/* Card */}
      <div className="bg-[#f0faf0] rounded-2xl shadow p-6 max-w-3xl mx-auto">
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold text-gray-900">
            {capitalised}&apos;s Review
          </h1>
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <DetailSkeleton />
        ) : error ? (
          <div className="py-12 text-center text-red-600">
            <p>{error}</p>
            <button
              onClick={() => router.refresh()}
              className="mt-3 text-sm text-[#1A3F1C] underline"
            >
              Retry
            </button>
          </div>
        ) : detail ? (
          <>
            {/* Info Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex gap-4 flex-1">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <Image
                    src={detail.photo}
                    alt={detail.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-semibold">Name:</span> {detail.name}
                  </p>
                  <p>
                    <span className="font-semibold">Phone number:</span>{" "}
                    {detail.phoneNumber}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">Rating:</span>
                    <StarRating
                      rating={detail.rating}
                      count={detail.ratingCount}
                      size={14}
                    />
                  </div>
                  <p>
                    <span className="font-semibold">Zone:</span>{" "}
                    {type === "vendor"
                      ? (detail as VendorDetail).address
                      : (detail as RiderDetail).zone}
                  </p>
                </div>
              </div>

              {/* Filter pills */}
              <div className="flex sm:flex-col gap-2 flex-wrap sm:items-end">
                {/* Mixed — shown for both vendor and rider */}
                <button
                  onClick={() =>
                    setActiveFilter(activeFilter === "mixed" ? "" : "mixed")
                  }
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                    activeFilter === "mixed"
                      ? "bg-yellow-400 border-yellow-400 text-gray-900"
                      : "bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  }`}
                >
                  Mixed review <Smile size={14} />
                </button>

                {/* Bad + Good — riders only */}
                {type === "rider" && (
                  <>
                    <button
                      onClick={() =>
                        setActiveFilter(activeFilter === "bad" ? "" : "bad")
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                        activeFilter === "bad"
                          ? "bg-[#D0021B] border-[#D0021B] text-white"
                          : "bg-red-50 border-red-300 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      Bad Review <ThumbsDown size={14} />
                    </button>
                    <button
                      onClick={() =>
                        setActiveFilter(activeFilter === "good" ? "" : "good")
                      }
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                        activeFilter === "good"
                          ? "bg-[#1A3F1C] border-[#1A3F1C] text-white"
                          : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      Good Review <ThumbsUp size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            <hr className="border-gray-200 my-4" />

            {/* Star Tabs */}
            <div className="mb-4">
              <StarTabs active={activeStar} onChange={setActiveStar} />
            </div>

            {/* Review List */}
            <ReviewList reviews={reviews} loading={reviewsLoading} />

            <hr className="border-gray-200 mt-4 mb-4" />

            {/* Action buttons */}
            <ActionButtons onAction={handleAction} />
          </>
        ) : null}
      </div>
    </div>
  );
}