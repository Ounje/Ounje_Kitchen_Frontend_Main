"use client";

import { useEffect, useRef, useState } from "react";
import { dashboardService } from "@/lib/api/services/dashboard.service";
import type { DashboardData } from "@/types";
import StatsCard from "@/components/dashboard/StatsCard";
import NotificationsList from "@/components/dashboard/NotificationsList";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import {
  Users, ShoppingCart, Store, DollarSign,
  Bike, HelpCircle, Star, ChevronDown,
} from "lucide-react";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-10 pb-10 px-4 md:px-6 lg:px-10 animate-pulse">
      {/* Header */}
      <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
        <div className="h-8 w-40 rounded-md bg-gray-200" />
        <div className="h-10 w-32 rounded-md bg-gray-200" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-xl shadow-sm border space-y-4">
            <div className="h-6 w-6 rounded-full bg-gray-200" />
            <div className="h-6 w-24 rounded-md bg-gray-200" />
            <div className="h-4 w-32 rounded-md bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-md bg-gray-200" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 w-full rounded-lg bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown]     = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Weekly");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!shouldRender) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res: any = await dashboardService.getDashboard();
        // Backend wraps in { success, data: { users, orders, ... } }
        // apiClient unwraps one level, so res may be the DashboardData directly
        // or still have a nested .data — handle both shapes safely
        const data: DashboardData = res?.users ? res : res?.data ?? res;
        setDashboard(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [shouldRender]);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handlePeriodSelect = (period: typeof selectedPeriod) => {
    setSelectedPeriod(period);
    setShowDropdown(false);
    // TODO: pass period.toLowerCase() to dashboardService.getRevenue(period)
  };

  // ── Guards ─────────────────────────────────────────────────────────────────
  if (!shouldRender || Reloading || loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-xl mx-auto mt-10">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-sm underline text-red-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboard) {
    return <div className="text-gray-400 text-sm p-6">No data available.</div>;
  }

  const { users, orders, ratings, queries, revenue } = dashboard;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10 pb-10 px-4 md:px-6 lg:px-10 animate-fadeIn">

      {/* Header */}
      <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[#1a3f1c]">Dashboard</h1>

        {/* Period dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#88df8b] shadow-sm text-sm font-medium transition-colors"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1 z-50">
              {(["Daily", "Weekly", "Monthly", "Yearly"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodSelect(p)}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    selectedPeriod === p
                      ? "bg-[#98ef9b] text-[#1a3f1c] font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Users}        value={(users?.total       ?? 0).toLocaleString()} label="Total Users"    />
        <StatsCard icon={ShoppingCart} value={(orders?.total      ?? 0).toLocaleString()} label="Total Orders"   />
        <StatsCard icon={Store}        value={(users?.vendors     ?? 0).toLocaleString()} label="Total Vendors"  />
        <StatsCard icon={DollarSign}   value={`₦${(revenue?.gross ?? 0).toLocaleString()}`} label="Total Revenue" />
        <StatsCard icon={Bike}         value={(users?.riders      ?? 0).toLocaleString()} label="Total Riders"   />
        <StatsCard icon={HelpCircle}   value={(queries?.open      ?? 0).toLocaleString()} label="Total Queries"  />
        <StatsCard icon={Star}         value={(ratings?.total     ?? 0).toLocaleString()} label="Total Ratings"  />
      </div>

      {/* Notifications */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#1a3f1c]">Notifications / Alerts</h2>
        <NotificationsList />
      </section>
    </div>
  );
}