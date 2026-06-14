"use client";

import { Medal } from "lucide-react";

export interface TopChartEntry {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  location?: string;
  stat: number;
  rank: 1 | 2 | 3;
}

interface TopChartProps {
  title: string; // "Customer" | "Vendor" | "Rider"
  statLabel: string; // "Orders" | "Completed" | "Deliveries"
  items: TopChartEntry[];
  loading?: boolean;
}

const RANK = {
  1: { gradient: "linear-gradient(135deg,#D97523 0%,#F4A460 100%)", label: "1st" },
  2: { gradient: "linear-gradient(135deg,#8B8B8B 0%,#C0C0C0 100%)", label: "2nd" },
  3: { gradient: "linear-gradient(135deg,#8B4513 0%,#CD7F32 100%)", label: "3rd" },
};

function initials(name: string) {
  return (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TopChart({ title, statLabel, items, loading = false }: TopChartProps) {
  if (loading) {
    return (
      <div className="w-full">
        <div className="h-5 w-44 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl h-28 bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-sm font-bold text-[#1a3f1c] mb-3">
        {title} <span className="text-gray-400 font-normal">| Top Chart</span>
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => {
          const cfg = RANK[item.rank];
          return (
            <div
              key={item.id}
              className="rounded-xl p-4 relative overflow-hidden"
              style={{ background: cfg.gradient }}
            >
              {/* Rank badge */}
              <div className="absolute top-3 right-3">
                <div className="w-9 h-9 rounded-full bg-white/30 flex items-center justify-center text-sm font-black text-white">
                  {cfg.label}
                </div>
              </div>

              {/* Content */}
              <div className="flex items-center gap-3 pr-10">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full border-2 border-white shrink-0 bg-white/25 flex items-center justify-center overflow-hidden">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-black text-white select-none">
                      {initials(item.name)}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-sm text-white truncate leading-tight">{item.name}</p>
                  {item.phone && <p className="text-[11px] text-white/80 truncate">{item.phone}</p>}
                  {item.location && (
                    <p className="text-[11px] text-white/70 truncate">{item.location}</p>
                  )}
                  <p className="text-xs font-semibold text-white mt-1">
                    {item.stat.toLocaleString()} {statLabel}
                  </p>
                </div>
              </div>

              {/* Decorative */}
              <div className="absolute bottom-2 right-2 opacity-10 pointer-events-none">
                <Medal className="w-14 h-14 text-white" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
