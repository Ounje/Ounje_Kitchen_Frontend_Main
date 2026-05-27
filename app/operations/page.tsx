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
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/navigation";

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
  orderTrends:    any[];   // { date, successful, cancelled }
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
    <Card className="border border-border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 bg-surface relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-24 h-24" />
      </div>
      <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-full relative z-10 gap-4">
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl bg-surface-secondary">
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div>
          <p className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-none mb-1.5">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <p className="text-sm font-semibold text-foreground/80">{title}</p>
          <p className="text-xs text-muted-foreground mt-1">{sub}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AlertRow({
  label, count, color,
}: { label: string; count: number; color: string }) {
  return (
    <Card className="border border-border rounded-xl shadow-sm bg-surface">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-surface-secondary ${color}`}>
              <AlertCircle className="h-4 w-4 text-foreground/80" />
            </div>
            <p className="text-sm font-semibold text-foreground/90">{label}</p>
          </div>
          <span className="text-xs font-bold text-foreground bg-surface-secondary px-3 py-1.5 rounded-full border border-border">
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
  const router = useRouter();
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
        orderTrends:    d?.orderTrends    ?? [],
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
  const { overview, recentActivity, alerts, orderTrends } = data;

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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-8 mb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Dashboard Overview</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {overview.activeOrders ?? 0} active orders right now. Monitor operations live.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Orders Trend Chart */}
      <Card className="border border-border rounded-2xl shadow-sm bg-surface overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-[#1a3f1c]" />
                Order Trends
              </h2>
              <p className="text-xs text-muted-foreground">Successful vs Cancelled orders (last 7 days)</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a3f1c]" />
                <span>Successful</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Cancelled</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={orderTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSuc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a3f1c" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1a3f1c" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 600 }}
                  dy={10}
                  tickFormatter={(val) => new Date(val).toLocaleDateString("en-US", { weekday: "short" })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  labelStyle={{ fontWeight: "bold", fontSize: "12px", marginBottom: "4px" }}
                />
                <Area
                  type="monotone"
                  dataKey="successful"
                  stroke="#1a3f1c"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSuc)"
                />
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  stroke="#f87171"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCan)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activity + Alerts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity — takes 2 columns */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Recent Activity / Feed</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/operations/orders")}
              className="text-xs font-semibold text-foreground/80 border-border bg-transparent hover:bg-surface-secondary transition-all h-8"
            >
              View All
            </Button>
          </div>

          {recentActivity.length === 0 ? (
            <Card className="border border-border rounded-xl shadow-sm bg-surface">
              <CardContent className="p-8 text-center text-muted-foreground text-sm font-medium">
                No recent activity to display.
              </CardContent>
            </Card>
          ) : (
            recentActivity.map((order: any, i: number) => (
              <Card key={order._id ?? i}
                className="border border-border rounded-xl shadow-sm bg-surface hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">
                        {resolveCustomerName(order)} placed an order from {resolveVendorName(order)}
                      </p>
                      <div className="flex items-center gap-x-3 gap-y-2 mt-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground bg-surface-secondary px-2 py-1 rounded-md">
                          #{order.orderNumber ?? order._id?.slice(-8)?.toUpperCase() ?? "—"}
                        </span>
                        <span className={`text-[10px] uppercase px-2.5 py-1 rounded-full font-black tracking-wider ${statusBadge(order.status)}`}>
                          {(order.status ?? "pending")}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {timeAgo(order.createdAt)}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => router.push(`/operations/orders/${order._id ?? order.id}`)}
                      className="h-9 w-9 shrink-0 rounded-full border-border text-foreground/80 hover:bg-surface-secondary"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Alerts / Warnings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Alerts & Warnings</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/operations/vendors")} // or a general reports page if exists
              className="text-xs font-semibold text-foreground/80 border-border bg-transparent hover:bg-surface-secondary transition-all h-8"
            >
              View All
            </Button>
          </div>

          <AlertRow
            label={`${alerts.suspendedCustomers ?? 0} suspended customer${(alerts.suspendedCustomers ?? 0) !== 1 ? "s" : ""}`}
            count={alerts.suspendedCustomers ?? 0}
            color="text-red-500"
          />
          <AlertRow
            label={`${alerts.suspendedVendors ?? 0} suspended vendor${(alerts.suspendedVendors ?? 0) !== 1 ? "s" : ""}`}
            count={alerts.suspendedVendors ?? 0}
            color="text-orange-500"
          />
          <AlertRow
            label={`${alerts.suspendedRiders ?? 0} suspended rider${(alerts.suspendedRiders ?? 0) !== 1 ? "s" : ""}`}
            count={alerts.suspendedRiders ?? 0}
            color="text-yellow-500"
          />
          <AlertRow
            label={`${alerts.openQueries ?? 0} open quer${(alerts.openQueries ?? 0) !== 1 ? "ies" : "y"}`}
            count={alerts.openQueries ?? 0}
            color="text-blue-500"
          />

          {/* Ratings summary */}
          <Card className="border border-border rounded-2xl shadow-sm bg-surface mt-6 relative overflow-hidden group">
            <CardContent className="p-6 relative z-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                Platform Ratings
              </p>
              <p className="text-4xl font-black text-foreground tracking-tight mb-1">
                {(overview.ratings ?? 0).toLocaleString()}
              </p>
              <p className="text-xs font-medium text-muted-foreground">Total reviews submitted overall</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}