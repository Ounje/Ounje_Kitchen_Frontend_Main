"use client";

import { useEffect, useState } from "react";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { operationsService } from "@/lib/api/services/operations.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Store,
  Bike,
  Users,
  TrendingUp,
  AlertCircle,
  Eye,
  Loader2,
} from "lucide-react";

// ── Types matching dashboardController response exactly ───────────────────────
interface DashboardOverview {
  customers:       number;
  vendors:         number;
  riders:          number;
  orders:          number;
  activeOrders:    number;
  deliveredOrders: number;
  ratings:         number;
  queries:         number;
}

interface DashboardAlerts {
  suspendedCustomers: number;
  suspendedVendors:   number;
  suspendedRiders:    number;
  openQueries:        number;
}

interface DashboardData {
  overview:       DashboardOverview;
  recentActivity: any[];   // populated Order documents
  alerts:         DashboardAlerts;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function safeStr(val: any): string {
  if (!val) return "—";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.address ?? val.name ?? val.label ?? "—";
  return String(val);
}

function resolveCustomerName(order: any): string {
  return order.customer?.user?.name ?? order.customer?.name ?? "Unknown customer";
}

function resolveVendorName(order: any): string {
  return order.vendor?.storeName ?? order.vendor?.name ?? "Unknown vendor";
}

function statusBadge(status: string) {
  const s = (status ?? "").toLowerCase();
  if (["delivered", "completed"].includes(s))
    return "bg-green-100 text-green-800";
  if (["pending", "preparing", "in_transit", "assigned"].includes(s))
    return "bg-yellow-100 text-yellow-800";
  if (["cancelled", "declined"].includes(s))
    return "bg-red-100 text-red-800";
  return "bg-blue-100 text-blue-800";
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  title, value, sub, icon: Icon, bg,
}: {
  title: string; value: number | string; sub: string; icon: any; bg: string;
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow"
      style={{ backgroundColor: bg }}>
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 rounded-lg bg-white/70">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#1a3f1c]" />
          </div>
          <TrendingUp className="h-4 w-4 text-[#1a3f1c]/60" />
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold text-[#1a3f1c]">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
        <p className="text-sm font-semibold text-[#1a3f1c]/80 mt-0.5">{title}</p>
        <p className="text-xs text-[#1a3f1c]/60 mt-0.5">{sub}</p>
      </CardContent>
    </Card>
  );
}

function AlertRow({
  label, count, color,
}: { label: string; count: number; color: string }) {
  return (
    <Card className="border-none shadow-sm" style={{ backgroundColor: "#98ef9b" }}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${color}`}>
              <AlertCircle className="h-4 w-4 text-[#1a3f1c]" />
            </div>
            <p className="text-sm font-medium text-[#1a3f1c]">{label}</p>
          </div>
          <span className="text-sm font-bold text-[#1a3f1c] bg-white/60 px-3 py-1 rounded-full">
            {count}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 rounded-xl" />
        <div className="h-80 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function OperationsDashboardPage() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });

  const [data,    setData]    = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!shouldRender) return;
    fetchDashboard();
  }, [shouldRender]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      // operationsService.getDashboard() → hits GET /api/operations/dashboard
      // Returns { success, data: { overview, recentActivity, alerts } }
      // apiClient unwraps once → res = { success, data: {...} }
      const res: any = await operationsService.getDashboard();
      const d = res?.data ?? res;
      setData({
        overview:       d?.overview       ?? {},
        recentActivity: d?.recentActivity ?? [],
        alerts:         d?.alerts         ?? {},
      });
    } catch (err: any) {
      setError(err?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (!shouldRender || Reloading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" />
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
            <button onClick={fetchDashboard}
              className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overview, recentActivity, alerts } = data;

  const stats = [
    {
      title: "Today's Orders",
      value: overview.orders        ?? 0,
      sub:   `${overview.activeOrders ?? 0} active · ${overview.deliveredOrders ?? 0} delivered`,
      icon:  ShoppingCart,
      bg:    "#98ef9b",
    },
    {
      title: "Total Vendors",
      value: overview.vendors       ?? 0,
      sub:   `${alerts.suspendedVendors ?? 0} suspended`,
      icon:  Store,
      bg:    "#98ef9b",
    },
    {
      title: "Total Riders",
      value: overview.riders        ?? 0,
      sub:   `${alerts.suspendedRiders ?? 0} suspended`,
      icon:  Bike,
      bg:    "#98ef9b",
    },
    {
      title: "Total Customers",
      value: overview.customers     ?? 0,
      sub:   `${alerts.suspendedCustomers ?? 0} suspended`,
      icon:  Users,
      bg:    "#98ef9b",
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {overview.activeOrders ?? 0} active orders right now
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Activity + Alerts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity — takes 2 columns */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Recent Activity / Feed</h2>
            <Button variant="ghost" size="sm"
              className="text-sm text-[#1a3f1c] hover:bg-[#98ef9b] h-9">
              Show all
            </Button>
          </div>

          {recentActivity.length === 0 ? (
            <Card className="border-none shadow-sm" style={{ backgroundColor: "#98ef9b" }}>
              <CardContent className="p-6 text-center text-[#1a3f1c]/60 text-sm">
                No recent activity
              </CardContent>
            </Card>
          ) : (
            recentActivity.map((order: any, i: number) => (
              <Card key={order._id ?? i}
                className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                style={{ backgroundColor: "#98ef9b" }}>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1a3f1c] truncate">
                        {resolveCustomerName(order)} placed an order from {resolveVendorName(order)}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#1a3f1c]/70">
                          Order: {order.orderNumber ?? order._id?.slice(-8)?.toUpperCase() ?? "—"}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusBadge(order.status)}`}>
                          {(order.status ?? "pending").toUpperCase()}
                        </span>
                        <span className="text-xs text-[#1a3f1c]/50">
                          {timeAgo(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost"
                      className="h-8 w-8 shrink-0 rounded-full bg-[#1a3f1c] text-white hover:bg-[#164016]">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Alerts / Warnings */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Alert / Warning</h2>
            <Button variant="ghost" size="sm"
              className="text-sm text-[#1a3f1c] hover:bg-[#98ef9b] h-9">
              Show all
            </Button>
          </div>

          <AlertRow
            label={`${alerts.suspendedCustomers ?? 0} suspended customer${(alerts.suspendedCustomers ?? 0) !== 1 ? "s" : ""}`}
            count={alerts.suspendedCustomers ?? 0}
            color="bg-red-100"
          />
          <AlertRow
            label={`${alerts.suspendedVendors ?? 0} suspended vendor${(alerts.suspendedVendors ?? 0) !== 1 ? "s" : ""}`}
            count={alerts.suspendedVendors ?? 0}
            color="bg-orange-100"
          />
          <AlertRow
            label={`${alerts.suspendedRiders ?? 0} suspended rider${(alerts.suspendedRiders ?? 0) !== 1 ? "s" : ""}`}
            count={alerts.suspendedRiders ?? 0}
            color="bg-yellow-100"
          />
          <AlertRow
            label={`${alerts.openQueries ?? 0} open quer${(alerts.openQueries ?? 0) !== 1 ? "ies" : "y"}`}
            count={alerts.openQueries ?? 0}
            color="bg-blue-100"
          />

          {/* Ratings summary */}
          <Card className="border-none shadow-sm" style={{ backgroundColor: "#98ef9b" }}>
            <CardContent className="p-4">
              <p className="text-xs font-bold text-[#1a3f1c]/70 uppercase tracking-wide mb-2">
                Platform Ratings
              </p>
              <p className="text-3xl font-extrabold text-[#1a3f1c]">
                {(overview.ratings ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-[#1a3f1c]/60 mt-0.5">Total reviews submitted</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}