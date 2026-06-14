"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Store,
  Users,
  Bike,
  DollarSign,
  CheckCircle,
  BarChart2,
  ChevronDown,
} from "lucide-react";
import investorService, {
  type InvestorDashboard,
  type InvestorRevenue,
  type InvestorPeriod,
} from "@/lib/api/services/investor.service";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return `₦${n.toLocaleString()}`;
}

// ── KPI card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        accent ? "bg-[#1a3f1c] border-[#1a3f1c] text-white" : "bg-white border-gray-100 shadow-sm"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
          accent ? "bg-white/20" : "bg-[#98ef9b]/30"
        }`}
      >
        <Icon className={`w-5 h-5 ${accent ? "text-white" : "text-[#1a3f1c]"}`} />
      </div>
      <p
        className={`text-2xl font-black leading-none mb-1 ${accent ? "text-white" : "text-gray-900"}`}
      >
        {value}
      </p>
      <p className={`text-xs font-semibold ${accent ? "text-white/70" : "text-gray-500"}`}>
        {label}
      </p>
      {sub && (
        <p className={`text-[11px] mt-1 ${accent ? "text-white/50" : "text-gray-400"}`}>{sub}</p>
      )}
    </div>
  );
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function TrendBar({ data, period }: { data: { label: string; gross: number }[]; period: string }) {
  const max = Math.max(...data.map((d) => d.gross), 1);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-bold text-gray-700 mb-4">Revenue Trend — {period}</p>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-md bg-[#1a3f1c]"
              style={{ height: `${Math.max((d.gross / max) * 100, 4)}%` }} // dynamic bar height — inline required
            />
            <span className="text-[10px] text-gray-400 truncate w-full text-center">{d.label}</span>
          </div>
        ))}
      </div>
      {data.every((d) => d.gross === 0) && (
        <p className="text-center text-xs text-gray-400 mt-2">No revenue data for this period</p>
      )}
    </div>
  );
}

// ── Top vendors table ─────────────────────────────────────────────────────────
function TopVendors({ vendors }: { vendors: { name: string; orders: number }[] }) {
  if (!vendors.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-bold text-gray-700 mb-4">Top Vendors by Completed Orders</p>
      <div className="space-y-2">
        {vendors.map((v, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#98ef9b]/40 flex items-center justify-center text-[10px] font-black text-[#1a3f1c]">
                {i + 1}
              </span>
              <span className="text-sm font-semibold text-gray-800">{v.name}</span>
            </div>
            <span className="text-xs font-bold text-[#1a3f1c] bg-[#98ef9b]/30 px-2 py-1 rounded-full">
              {v.orders} orders
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-200" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-48 rounded-2xl bg-gray-200" />
        <div className="h-48 rounded-2xl bg-gray-200" />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function InvestorPage() {
  const [stats, setStats] = useState<InvestorDashboard | null>(null);
  const [revenue, setRevenue] = useState<InvestorRevenue | null>(null);
  const [period, setPeriod] = useState<InvestorPeriod>("monthly");
  const [loading, setLoading] = useState(true);
  const [revLoading, setRevLoading] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);

  useEffect(() => {
    investorService
      .getDashboard()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setRevLoading(true);
    investorService
      .getRevenue(period)
      .then(setRevenue)
      .catch(() => {})
      .finally(() => setRevLoading(false));
  }, [period]);

  if (loading)
    return (
      <div className="p-6 lg:p-10">
        <div className="h-8 w-56 bg-gray-200 rounded mb-6 animate-pulse" />
        <Skeleton />
      </div>
    );

  const PERIODS: InvestorPeriod[] = ["daily", "weekly", "monthly", "yearly"];

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Investor Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Live business performance overview</p>
        </div>

        {/* Period selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPeriod((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showPeriod ? "rotate-180" : ""}`}
            />
          </button>
          {showPeriod && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriod(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    period === p
                      ? "bg-[#98ef9b]/30 text-[#1a3f1c] font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI grid */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={DollarSign}
            label="All-Time Revenue"
            value={fmt(stats.totalRevenue)}
            accent
          />
          <KpiCard
            icon={TrendingUp}
            label="This Month Revenue"
            value={fmt(stats.monthlyRevenue)}
            sub={
              stats.revenueGrowth >= 0
                ? `↑ +${stats.revenueGrowth}% vs last month`
                : `↓ ${stats.revenueGrowth}% vs last month`
            }
          />
          <KpiCard
            icon={ShoppingCart}
            label="Total Orders"
            value={stats.totalOrders.toLocaleString()}
          />
          <KpiCard
            icon={CheckCircle}
            label="Completion Rate"
            value={`${stats.completionRate}%`}
            sub={`${stats.deliveredOrders.toLocaleString()} delivered`}
          />
          <KpiCard
            icon={Store}
            label="Active Vendors"
            value={stats.activeVendors.toLocaleString()}
          />
          <KpiCard
            icon={Users}
            label="Total Customers"
            value={stats.totalCustomers.toLocaleString()}
          />
          <KpiCard icon={Bike} label="Active Riders" value={stats.activeRiders.toLocaleString()} />
          <KpiCard
            icon={BarChart2}
            label="Delivered Orders"
            value={stats.deliveredOrders.toLocaleString()}
          />
        </div>
      )}

      {/* Revenue chart + top vendors */}
      {revLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
          <div className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
        </div>
      ) : revenue ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TrendBar data={revenue.trend} period={period} />
          <TopVendors vendors={revenue.topVendors} />
        </div>
      ) : null}
    </div>
  );
}
