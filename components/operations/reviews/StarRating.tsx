"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
}

export default function StarRating({ rating, count, size = 16 }: StarRatingProps) {
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300 fill-gray-200"
          }
        />
      ))}
      {count !== undefined && (
        <span className="ml-1 text-sm text-gray-600 font-medium">({count})</span>
      )}
    </span>
  );
}
