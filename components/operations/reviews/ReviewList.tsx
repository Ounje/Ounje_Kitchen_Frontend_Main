"use client";

import Image from "next/image";
import { ReviewItem } from "@/lib/api/services/operations.service";
import StarRating from "./StarRating";

interface ReviewListProps {
  reviews: ReviewItem[];
  loading?: boolean;
}

function SkeletonRow() {
  return (
    <div className="animate-pulse py-4 border-b border-gray-100">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-full bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ReviewList({ reviews, loading }: ReviewListProps) {
  if (loading) {
    return (
      <div className="divide-y divide-gray-100">
        {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400 text-sm">
        No reviews for this category.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {reviews.map((review) => (
        <div key={review.id} className="py-4">
          <div className="flex gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={review.reviewerPhoto}
                alt={review.reviewerName}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold text-gray-800">
                  {review.reviewerName}
                </span>
                <StarRating rating={review.starRating} size={14} />
                <span className="text-xs text-gray-500">{review.date}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                {review.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}