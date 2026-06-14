"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, User, Star } from "lucide-react";
import financeService, {
  type TopRider,
  type RevenuePeriod,
} from "@/lib/api/services/finance.service";

const PERIODS: { label: string; value: RevenuePeriod }[] = [
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const thCls = "px-4 py-3 text-left text-sm font-semibold whitespace-nowrap";

function unwrapRiders(res: any): TopRider[] {
  if (Array.isArray(res)) return res as TopRider[];
  if (Array.isArray(res?.data)) return res.data as TopRider[];
  if (Array.isArray(res?.riders)) return res.riders as TopRider[];
  return [];
}

export default function TopRidersPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<RevenuePeriod>("daily");
  const [riders, setRiders] = useState<TopRider[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (p: RevenuePeriod) => {
    setLoading(true);
    try {
      const res = await financeService.getTopRiders({ period: p });
      setRiders(unwrapRiders(res));
    } catch {
      setRiders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(period);
  }, [period]);

  return (
    <div className="w-full">
      <p
        className="text-xs text-gray-400 mb-4 cursor-pointer hover:text-gray-600 transition-colors"
        onClick={() => router.back()}
      >
        ← Revenue / Riders details
      </p>

      <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-gray-50">
        <div className="px-5 sm:px-7 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 text-[#1a3f1c]">Top 5 Riders</h1>
              <p className="text-sm text-gray-500">
                Riders completing the most deliveries with strong performance.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as RevenuePeriod)}
                  className="appearance-none pl-8 pr-6 py-1.5 rounded-lg text-white text-sm font-semibold cursor-pointer bg-[#1a3f1c]"
                >
                  {PERIODS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none" />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white pointer-events-none text-xs">
                  ▾
                </span>
              </div>
              <button
                onClick={() => router.back()}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-6">
          <table className="w-full min-w-[520px] rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Rider Name", "Deliveries", "Earnings", "Completion", "Rating"].map((h) => (
                  <th key={h} className={`${thCls} text-[#1a3f1c]`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : riders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    No rider data available.
                  </td>
                </tr>
              ) : (
                riders.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                          {r.photo ? (
                            <img
                              src={r.photo}
                              alt={r.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            (r.name?.charAt(0).toUpperCase() ?? "?")
                          )}
                        </div>
                        <span className="text-sm font-medium text-[#1a3f1c]">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">{r.deliveries}</td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">
                      ₦{r.earnings.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">{r.completion}%</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1 text-sm text-[#1a3f1c]">
                        <Star className="w-4 h-4 fill-[#FFCA3A] stroke-[#FFCA3A] flex-shrink-0" />
                        {r.rating.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
