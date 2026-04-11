"use client";

import { useEffect, useState } from "react";
import { itService } from "@/lib/api/services/it.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, Store, Bike, UserCog, ShoppingCart,
  AlertCircle, TrendingUp, Bell, CheckCircle,
  XCircle, AlertTriangle, Clock,
} from "lucide-react";
import { useRouteGuard } from "@/hooks/useRouteGuard";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardData {
  customers: { total: number; active: number };
  vendors:   { total: number; active: number };
  riders:    { total: number; active: number };
  staff:     { total: number; active: number };
  orders:    { total: number; pending: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function suspended(total: number, active: number) {
  return Math.max(0, total - active);
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  title, value, sub, icon: Icon, iconBg,
}: {
  title: string; value: number; sub: string;
  icon: any; iconBg: string;
}) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: iconBg }}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-3xl font-extrabold text-gray-900 my-0.5">{value.toLocaleString()}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </CardContent>
    </Card>
  );
}

function StatusCard({
  title, active, suspendedCount, total,
}: {
  title: string; active: number; suspendedCount: number; total: number;
}) {
  const pct = total > 0 ? Math.round((active / total) * 100) : 0;
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-gray-700 mb-4">{title}</h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-gray-600">Active</span>
            </span>
            <span className="font-bold text-gray-900">{active.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-gray-600">Suspended</span>
            </span>
            <span className="font-bold text-gray-900">{suspendedCount.toLocaleString()}</span>
          </div>
          {/* Progress bar */}
          <div className="pt-1">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#1a3f1c] rounded-full transition-all"
                style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{pct}% active</p>
          </div>
          <div className="pt-2 border-t flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-sm font-extrabold text-[#1a3f1c]">{total.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderSummaryCard({ orders }: { orders: DashboardData["orders"] }) {
  const completed = Math.max(0, orders.total - orders.pending);
  const completedPct = orders.total > 0 ? Math.round((completed / orders.total) * 100) : 0;
  return (
    <Card className="border shadow-sm" style={{ backgroundColor: "#e8f7e8" }}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#1a3f1c] flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Order Summary</h3>
              <p className="text-xs text-gray-600">{completedPct}% completion rate</p>
            </div>
          </div>

          <div className="flex gap-6 w-full sm:w-auto">
            <div className="text-center">
              <p className="text-2xl font-extrabold text-[#1a3f1c]">{orders.total.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-0.5">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-yellow-600">{orders.pending.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-0.5">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-extrabold text-green-600">{completed.toLocaleString()}</p>
              <p className="text-xs text-gray-600 mt-0.5">Completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <div className="h-32 rounded-lg bg-gray-200 animate-pulse" />
  );
}

function Skeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-lg bg-gray-200" />)}
      </div>
      <div className="h-28 rounded-lg bg-gray-200" />
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function ITDashboard() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });
  const [dashboard, setDashboard]   = useState<DashboardData | null>(null);
  const [adminsTotal, setAdminsTotal] = useState(0);
  const [adminsActive, setAdminsActive] = useState(0);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  useEffect(() => {
    if (!shouldRender) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // Both calls in parallel
        const [dashRes, adminsRes] = await Promise.all([
          itService.getDashboard(),
          itService.getAdmins({ page: 1, limit: 100 }),
        ]);

        // getDashboard returns { customers, vendors, riders, staff, orders }
        setDashboard(dashRes as DashboardData);

        // Staff controller returns { count, total, page, pages, data: [...] }
        // apiClient unwraps once → adminsRes = { count, total, page, pages, data: [...] }
        const adminsArr: any[] = adminsRes?.data ?? adminsRes?.admins ?? adminsRes?.staff ?? [];
        const totalAdmins = adminsRes?.total ?? adminsRes?.pagination?.total ?? adminsArr.length;
        const activeAdmins = adminsArr.filter(
          (a: any) => a.isActive !== false && a.isSuspended !== true
        ).length;

        setAdminsTotal(totalAdmins);
        setAdminsActive(activeAdmins);
      } catch (err: any) {
        setError(err?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [shouldRender]);

  // Guard: route not ready
  if (!shouldRender || Reloading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (loading) return <Skeleton />;

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-900">Error loading dashboard</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  // ── Stat cards config (all real data) ─────────────────────────────────────
  const stats = [
    {
      title: "Total Admins",
      value: adminsTotal,
      sub:   `${adminsActive} active dept heads`,
      icon:  UserCog,
      iconBg: "#1a3f1c",
    },
    {
      title: "Total Staff",
      value: dashboard.staff?.total ?? 0,
      sub:   `${dashboard.staff?.active ?? 0} active`,
      icon:  Users,
      iconBg: "#98ef9b",
    },
    {
      title: "Total Customers",
      value: dashboard.customers?.total ?? 0,
      sub:   `${dashboard.customers?.active ?? 0} active`,
      icon:  Users,
      iconBg: "#FFCA3A",
    },
    {
      title: "Total Vendors",
      value: dashboard.vendors?.total ?? 0,
      sub:   `${dashboard.vendors?.active ?? 0} active`,
      icon:  Store,
      iconBg: "#1a3f1c",
    },
    {
      title: "Total Riders",
      value: dashboard.riders?.total ?? 0,
      sub:   `${dashboard.riders?.active ?? 0} active`,
      icon:  Bike,
      iconBg: "#98ef9b",
    },
    {
      title: "Total Orders",
      value: dashboard.orders?.total ?? 0,
      sub:   `${dashboard.orders?.pending ?? 0} pending`,
      icon:  ShoppingCart,
      iconBg: "#FFCA3A",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">IT Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview &amp; account management</p>
      </div>

      {/* 6 stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Account status summary */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-[#1a3f1c]" />
          <h2 className="text-lg font-bold text-gray-900">Account Status Summary</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusCard
            title="Customers"
            active={dashboard.customers?.active ?? 0}
            suspendedCount={suspended(dashboard.customers?.total ?? 0, dashboard.customers?.active ?? 0)}
            total={dashboard.customers?.total ?? 0}
          />
          <StatusCard
            title="Vendors"
            active={dashboard.vendors?.active ?? 0}
            suspendedCount={suspended(dashboard.vendors?.total ?? 0, dashboard.vendors?.active ?? 0)}
            total={dashboard.vendors?.total ?? 0}
          />
          <StatusCard
            title="Riders"
            active={dashboard.riders?.active ?? 0}
            suspendedCount={suspended(dashboard.riders?.total ?? 0, dashboard.riders?.active ?? 0)}
            total={dashboard.riders?.total ?? 0}
          />
          <StatusCard
            title="Staff"
            active={dashboard.staff?.active ?? 0}
            suspendedCount={suspended(dashboard.staff?.total ?? 0, dashboard.staff?.active ?? 0)}
            total={dashboard.staff?.total ?? 0}
          />
        </div>
      </div>

      {/* Order summary */}
      <OrderSummaryCard orders={dashboard.orders ?? { total: 0, pending: 0 }} />

      {/* Notifications placeholder — real endpoint not available yet */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-[#1a3f1c]" />
          <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
            Awaiting backend endpoint
          </span>
        </div>
        <Card className="border shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-gray-400">
              <Bell className="h-10 w-10" />
              <p className="text-sm font-medium">No notifications endpoint available yet</p>
              <p className="text-xs text-gray-400">
                Connect <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">/api/it/notifications</code> to display real alerts here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}