"use client";

import { useEffect, useRef, useState } from "react";
import { dashboardService } from "@/lib/api/services/dashboard.service";
import type { DashboardData } from "@/types";
import StatsCard from "@/components/dashboard/StatsCard";
import NotificationsList from "@/components/dashboard/NotificationsList";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Users,
  ShoppingCart,
  Store,
  DollarSign,
  Bike,
  HelpCircle,
  Star,
  ChevronDown,
} from "lucide-react";

import { useRouteGuard } from "@/hooks/useRouteGuard";

export default function AdminDashboard() {
  const { shouldRender, Reloading } = useRouteGuard({
    returnRenderFlag: true,
  });

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Weekly");

  /**
   * Fetch Dashboard Data
   */
  useEffect(() => {
    if (!shouldRender) return;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await dashboardService.getDashboard();
        setDashboard(data);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [shouldRender]);

  /**
   * Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodSelect = (period: typeof selectedPeriod) => {
    setSelectedPeriod(period);
    setShowDropdown(false);

    // Future extension:
    // dashboardService.getRevenue(period.toLowerCase())
  };

  /**
   * Skeleton Loader UI
   */
  if (!shouldRender || Reloading || loading) {
    return (
      <div className="space-y-10 pb-10 px-4 md:px-6 lg:px-10 animate-pulse">

        {/* Header Skeleton */}
        <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
          <Skeleton className="h-8 w-40 rounded-md bg-[#f3f4f6]" />
          <Skeleton className="h-10 w-32 rounded-md bg-[#f3f4f6]" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 7 }).map((_, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-sm border space-y-4"
            >
              <Skeleton className="h-6 w-6 rounded-full bg-[#f3f4f6]" />
              <Skeleton className="h-6 w-24 rounded-md bg-[#f3f4f6]" />
              <Skeleton className="h-4 w-32 rounded-md bg-[#f3f4f6]" />
            </div>
          ))}
        </div>

        {/* Notifications Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-48 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-16 w-full rounded-lg bg-[#f3f4f6]"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Error UI
   */
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg max-w-xl mx-auto mt-10">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  /**
   * No Data
   */
  if (!dashboard) {
    return (
      <div className="text-muted-foreground text-sm p-6">
        No data available
      </div>
    );
  }

  const { users, orders, ratings, queries, revenue } = dashboard;

  return (
    <div className="space-y-10 pb-10 px-4 md:px-6 lg:px-10 animate-fadeIn">

      {/* HEADER */}
      <div className="mt-10 flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-[#1a3f1c]">Dashboard</h1>

        {/* Period Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="
              flex items-center gap-2 px-4 py-2 rounded-md
              bg-[#98ef9b] text-[#1a3f1c]
              hover:bg-[#88df8b]
              shadow-sm text-sm font-medium
              transition-colors
            "
          >
            <span>{selectedPeriod}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showDropdown ? "rotate-180" : ""
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-1 z-50">
              {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
                <button
                  key={period}
                  onClick={() =>
                    handlePeriodSelect(
                      period as "Daily" | "Weekly" | "Monthly" | "Yearly"
                    )
                  }
                  className={`
                    w-full px-4 py-2 text-left text-sm
                    ${
                      selectedPeriod === period
                        ? "bg-[#98ef9b] text-[#1a3f1c] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Users} value={users.total.toLocaleString()} label="Total Users" />
        <StatsCard icon={ShoppingCart} value={orders.total.toLocaleString()} label="Total Orders" />
        <StatsCard icon={Store} value={users.vendors.toLocaleString()} label="Total Vendors" />
        <StatsCard icon={DollarSign} value={`₦${revenue.gross.toLocaleString()}`} label="Total Revenue" />
        <StatsCard icon={Bike} value={users.riders.toLocaleString()} label="Total Riders" />
        <StatsCard icon={HelpCircle} value={queries.open.toLocaleString()} label="Total Queries" />
        <StatsCard icon={Star} value={ratings.total.toLocaleString()} label="Total Ratings" />
      </div>

      {/* NOTIFICATIONS */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-[#1a3f1c]">
          Notifications / Alerts
        </h2>
        <NotificationsList />
      </section>
    </div>
  );
}
