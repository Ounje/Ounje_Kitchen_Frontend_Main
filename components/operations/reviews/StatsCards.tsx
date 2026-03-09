"use client";

import { BarChart2, AlertCircle, Target, TrendingUp } from "lucide-react";

interface ReviewStats {
  totalReviews: number;
  goodRating: number;
  averageRating: number;
  badRating: number;
}

interface StatsCardsProps {
  stats: ReviewStats | null;
  loading?: boolean;
}

const cards = [
  {
    key: "totalReviews" as keyof ReviewStats,
    label: "Total Reviews",
    sub: null,
    icon: AlertCircle,
    iconBg: "bg-yellow-400",
  },
  {
    key: "goodRating" as keyof ReviewStats,
    label: "Good Rating",
    sub: "From 4.5 star rating to 5 star rating",
    icon: Target,
    iconBg: "bg-yellow-400",
  },
  {
    key: "averageRating" as keyof ReviewStats,
    label: "Average Rating",
    sub: "From 3 star rating to 4 star rating",
    icon: TrendingUp,
    iconBg: "bg-yellow-400",
  },
  {
    key: "badRating" as keyof ReviewStats,
    label: "Bad Rating",
    sub: "From 0 star rating to 2.5 star rating",
    icon: AlertCircle,
    iconBg: "bg-red-500",
  },
];

function SkeletonCard() {
  return (
    <div className="bg-[#e8f8e8] rounded-xl p-4 animate-pulse min-w-0">
      <div className="flex items-start justify-between mb-2">
        <div className="h-7 w-20 bg-green-200 rounded" />
        <div className="h-6 w-6 bg-green-200 rounded" />
      </div>
      <div className="h-4 w-24 bg-green-200 rounded mb-1" />
      <div className="h-3 w-32 bg-green-100 rounded" />
    </div>
  );
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats?.[card.key] ?? 0;
        const isLast = card.key === "badRating";

        return (
          <div
            key={card.key}
            className="bg-[#e8f8e8] rounded-xl px-4 py-4 flex flex-col min-w-0"
          >
            <div className="flex items-start justify-between mb-1">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                    isLast ? "bg-red-500" : "bg-yellow-400"
                  } flex-shrink-0`}
                >
                  <Icon size={14} className="text-white" />
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {value.toLocaleString()}
                </span>
              </div>
              <BarChart2 size={18} className="text-gray-500 mt-1 flex-shrink-0" />
            </div>
            <p className="text-sm font-semibold text-gray-700 mt-1">{card.label}</p>
            {card.sub && (
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{card.sub}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}