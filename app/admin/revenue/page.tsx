"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  superAdminApi,
  type RevenueAnalyticsData,
  type RevenueTrendPoint,
  type TopPerformer,
} from "@/lib/api/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Period = "daily" | "weekly" | "monthly" | "yearly";
type RevenueTab = "gross" | "expenses" | "net";

// Map UI period labels → controller's `period` param value
const PERIOD_MAP: Record<Period, string> = {
  daily: "today",
  weekly: "week",
  monthly: "month",
  yearly: "year",
};

// Map UI period → trends `groupBy` param
const GROUPBY_MAP: Record<Period, string> = {
  daily: "hour",
  weekly: "day",
  monthly: "day",
  yearly: "month",
};

// How many trend data points to request per period
const TREND_LIMIT: Record<Period, number> = {
  daily: 24, // 24 hours
  weekly: 7, // 7 days
  monthly: 30, // ~30 days
  yearly: 12, // 12 months
};

const TAB_CONFIG: { id: RevenueTab; label: string }[] = [
  { id: "gross", label: "Gross Revenue" },
  { id: "expenses", label: "Total Expenses" },
  { id: "net", label: "Net Revenue" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmtCurrency(n?: number): string {
  if (n == null) return "₦0";
  return `₦${Number(n).toLocaleString("en-NG")}`;
}

function getTabValue(data: RevenueAnalyticsData, tab: RevenueTab): number {
  switch (tab) {
    case "gross":
      return data.totalGrossRevenue;
    case "expenses":
      return data.totalExpenses;
    case "net":
      return data.totalNetRevenue;
  }
}

function getTrendValue(point: RevenueTrendPoint, tab: RevenueTab): number {
  switch (tab) {
    case "gross":
      return point.grossRevenue;
    case "expenses":
      return point.expenses; // controller field is `expenses`
    case "net":
      return point.netRevenue;
  }
}

/** Format the trend point's `_id` date label for display */
function formatTrendLabel(id: string, groupBy: string): string {
  try {
    if (groupBy === "month") {
      // _id = "2025-01"
      const [y, m] = id.split("-");
      return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });
    }
    if (groupBy === "hour") {
      // _id = "2025-01-15 14:00"
      return id.slice(11, 16); // "14:00"
    }
    // day: "2025-01-15"
    return new Date(id).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  } catch {
    return id;
  }
}

function periodDurationLabel(period: Period): string {
  const now = new Date();
  switch (period) {
    case "daily":
      return now.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    case "weekly": {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      return `${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    case "monthly":
      return now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    case "yearly":
      return String(now.getFullYear());
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton components
// ─────────────────────────────────────────────────────────────────────────────

function ValueCardSkeleton() {
  return (
    <div className="bg-card rounded-xl p-8 border border-border">
      <div className="text-center space-y-4">
        <Skeleton className="h-5 w-32 mx-auto" />
        <Skeleton className="h-16 w-56 mx-auto" />
      </div>
    </div>
  );
}

function InfoCardSkeleton() {
  return (
    <div className="bg-secondary rounded-xl p-6 border border-border space-y-3">
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-4 w-36" />
    </div>
  );
}

const SKELETON_BAR_HEIGHTS = [55, 72, 41, 88, 63, 77, 35, 91, 48, 66];

function TrendBarSkeleton() {
  return (
    <div className="bg-secondary rounded-xl p-6 border border-border space-y-4">
      <Skeleton className="h-5 w-32" />
      <div className="flex items-end gap-2 h-32">
        {SKELETON_BAR_HEIGHTS.map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function PerformerCardSkeleton() {
  return (
    <div className="bg-secondary rounded-xl p-6 border border-border space-y-4">
      <Skeleton className="h-5 w-24" />
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini bar chart
// ─────────────────────────────────────────────────────────────────────────────

function TrendChart({
  points,
  tab,
  groupBy,
}: {
  points: RevenueTrendPoint[];
  tab: RevenueTab;
  groupBy: string;
}) {
  if (points.length === 0) return null;

  const values = points.map((p) => getTrendValue(p, tab));
  const max = Math.max(...values, 1);

  return (
    <div className="bg-secondary rounded-xl p-6 border border-border space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        {tab === "gross" ? "Gross Revenue" : tab === "expenses" ? "Total Expenses" : "Net Revenue"}{" "}
        Trend
      </h3>
      <div className="flex items-end gap-1 h-28">
        {points.map((p, i) => {
          const pct = Math.max(4, (getTrendValue(p, tab) / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {formatTrendLabel(p._id, groupBy)}: {fmtCurrency(getTrendValue(p, tab))}
              </div>
              <div
                className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                style={{ height: `${pct}%` }}
              />
            </div>
          );
        })}
      </div>
      {/* X-axis labels — show first, middle, last only to avoid crowding */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTrendLabel(points[0]._id, groupBy)}</span>
        {points.length > 2 && (
          <span>{formatTrendLabel(points[Math.floor(points.length / 2)]._id, groupBy)}</span>
        )}
        <span>{formatTrendLabel(points[points.length - 1]._id, groupBy)}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Performer card
// ─────────────────────────────────────────────────────────────────────────────

function PerformerCard({
  title,
  performer,
  subtitle,
}: {
  title: string;
  performer: TopPerformer;
  subtitle?: string;
}) {
  return (
    <div className="bg-secondary rounded-xl p-6 border border-border space-y-4">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      <div className="flex items-center gap-4">
        {performer.avatar ? (
          <img
            src={performer.avatar}
            alt={performer.name}
            className="w-16 h-16 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center shrink-0">
            {performer.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{performer.name}</p>
          {(performer.location ?? performer.type ?? subtitle) && (
            <p className="text-sm text-muted-foreground truncate">
              {performer.location ?? performer.type ?? subtitle}
            </p>
          )}
          {performer.orders != null && (
            <p className="text-xs text-muted-foreground">{performer.orders} orders</p>
          )}
        </div>
      </div>
      <div className="bg-primary text-primary-foreground rounded-xl p-4 text-center">
        <p className="text-sm font-medium mb-1">Total Revenue</p>
        <p className="text-xl font-bold">{fmtCurrency(performer.revenue)}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [activeTab, setActiveTab] = useState<RevenueTab>("gross");

  // Analytics state
  const [analytics, setAnalytics] = useState<RevenueAnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  // Trend state
  const [trends, setTrends] = useState<RevenueTrendPoint[]>([]);
  const [groupBy, setGroupBy] = useState<string>("day");
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState<string | null>(null);

  // Top performers state (only loaded for monthly/yearly)
  const [topVendors, setTopVendors] = useState<TopPerformer[]>([]);
  const [topRiders, setTopRiders] = useState<TopPerformer[]>([]);
  const [performersLoading, setPerformersLoading] = useState(false);
  const [performersError, setPerformersError] = useState<string | null>(null);

  // ── Fetch analytics ──────────────────────────────────────────────────────

  const fetchAnalytics = useCallback(async (p: Period) => {
    setAnalyticsLoading(true);
    setAnalyticsError(null);
    try {
      const res = await superAdminApi.dashboard.getRevenue({ period: PERIOD_MAP[p] });
      setAnalytics(res.data);
    } catch (err: any) {
      const msg = err?.message || "Failed to load revenue data";
      setAnalyticsError(msg);
      toast.error(msg);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  // ── Fetch trends ─────────────────────────────────────────────────────────

  const fetchTrends = useCallback(async (p: Period) => {
    const gb = GROUPBY_MAP[p];
    setTrendsLoading(true);
    setTrendsError(null);
    setGroupBy(gb);
    try {
      const res = await superAdminApi.dashboard.getRevenueTrends({
        groupBy: gb,
        limit: TREND_LIMIT[p],
      });
      setTrends(res.data ?? []);
    } catch (err: any) {
      const msg = err?.message || "Failed to load trend data";
      setTrendsError(msg);
      // Non-critical — don't toast, just show inline error
    } finally {
      setTrendsLoading(false);
    }
  }, []);

  // ── Fetch top performers ─────────────────────────────────────────────────

  const fetchTopPerformers = useCallback(async (p: Period) => {
    setPerformersLoading(true);
    setPerformersError(null);
    try {
      const [vendorsRes, ridersRes] = await Promise.all([
        superAdminApi.dashboard.getTopVendors({ period: PERIOD_MAP[p] }),
        superAdminApi.dashboard.getTopRiders({ period: PERIOD_MAP[p] }),
      ]);
      setTopVendors(vendorsRes.data?.slice(0, 1) ?? []);
      setTopRiders(ridersRes.data?.slice(0, 1) ?? []);
    } catch {
      // Top performers are supplementary — fail silently, show note in UI
      setPerformersError("Top performer data unavailable");
      setTopVendors([]);
      setTopRiders([]);
    } finally {
      setPerformersLoading(false);
    }
  }, []);

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchAnalytics(period);
    fetchTrends(period);
    if (period === "monthly" || period === "yearly") {
      fetchTopPerformers(period);
    } else {
      setTopVendors([]);
      setTopRiders([]);
    }
  }, [period, fetchAnalytics, fetchTrends, fetchTopPerformers]);

  // ── Derived values ───────────────────────────────────────────────────────

  const tabValue = analytics ? getTabValue(analytics, activeTab) : null;
  const duration = periodDurationLabel(period);
  const showTopPerformers = period === "monthly" || period === "yearly";

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Finance</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as Period)}
          className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-semibold border border-border cursor-pointer outline-none"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:opacity-90"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error banner — analytics only (critical) */}
      {analyticsError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 flex items-center justify-between gap-4">
          <p className="text-destructive text-sm font-medium">{analyticsError}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalytics(period)}
            className="border-destructive text-destructive hover:bg-destructive/10 shrink-0"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Main value card */}
      {analyticsLoading ? (
        <ValueCardSkeleton />
      ) : analytics ? (
        <div className="bg-card rounded-xl p-8 border border-border">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-lg">
              {activeTab === "gross"
                ? "Gross Revenue"
                : activeTab === "expenses"
                  ? "Total Expenses"
                  : "Net Revenue"}
            </p>
            <p className="text-5xl md:text-6xl font-bold text-primary">
              {fmtCurrency(tabValue ?? 0)}
            </p>
          </div>
        </div>
      ) : null}

      {/* Info card — breaks down what's inside the current tab value */}
      {analyticsLoading ? (
        <InfoCardSkeleton />
      ) : analytics ? (
        <div className="bg-secondary rounded-xl p-6 border border-border space-y-3">
          <p className="text-foreground font-medium">Duration: {duration}</p>

          {activeTab === "gross" && (
            <>
              <p className="text-foreground font-medium">
                Revenue Generated: {fmtCurrency(analytics.totalGrossRevenue)}
              </p>
              {analytics.count > 0 && (
                <p className="text-foreground font-medium">
                  Total Records: {analytics.count.toLocaleString()}
                </p>
              )}
            </>
          )}

          {activeTab === "expenses" && (
            <>
              <p className="text-foreground font-medium">
                Expenses Paid: {fmtCurrency(analytics.totalExpenses)}
              </p>
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <ExpenseBreakdown label="Vendor Payouts" value={analytics.totalVendorPayouts} />
                <ExpenseBreakdown label="Rider Payouts" value={analytics.totalRiderPayouts} />
                <ExpenseBreakdown label="Platform Fees" value={analytics.totalPlatformFees} />
              </div>
            </>
          )}

          {activeTab === "net" && (
            <>
              <p className="text-foreground font-medium">
                Net Revenue: {fmtCurrency(analytics.totalNetRevenue)}
              </p>
              <p className="text-sm text-muted-foreground">
                Gross {fmtCurrency(analytics.totalGrossRevenue)} − Expenses{" "}
                {fmtCurrency(analytics.totalExpenses)}
              </p>
            </>
          )}
        </div>
      ) : null}

      {/* Trend chart */}
      {trendsLoading ? (
        <TrendBarSkeleton />
      ) : trendsError ? (
        <div className="bg-secondary rounded-xl p-4 border border-border text-sm text-muted-foreground flex items-center justify-between gap-4">
          <span>Trend data unavailable</span>
          <button
            onClick={() => fetchTrends(period)}
            className="text-primary underline underline-offset-2 text-xs shrink-0"
          >
            Retry
          </button>
        </div>
      ) : trends.length > 0 ? (
        <TrendChart points={trends} tab={activeTab} groupBy={groupBy} />
      ) : null}

      {/* Top performers */}
      {showTopPerformers && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performersLoading ? (
            <>
              <PerformerCardSkeleton />
              <PerformerCardSkeleton />
            </>
          ) : performersError ? (
            <div className="col-span-full bg-secondary rounded-xl p-4 border border-border text-sm text-muted-foreground text-center">
              {/* ⚠️ BACKEND REQUIREMENT: Add GET /api/superadmin/revenue/top-vendors
                  and GET /api/superadmin/revenue/top-riders endpoints.
                  These currently exist only in the Finance portal (/api/finance/...).
                  Until they are added to the superadmin portal, this section stays empty. */}
              Top performer data unavailable
            </div>
          ) : (
            <>
              {topVendors[0] && <PerformerCard title="Top Vendor" performer={topVendors[0]} />}
              {topRiders[0] && <PerformerCard title="Top Rider" performer={topRiders[0]} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Micro-components ────────────────────────────────────────────────────────

function ExpenseBreakdown({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-background rounded-lg px-3 py-2">
      <p className="text-muted-foreground text-xs mb-0.5">{label}</p>
      <p className="font-semibold text-foreground text-sm">{fmtCurrency(value)}</p>
    </div>
  );
}
