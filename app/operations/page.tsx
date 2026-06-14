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
  customers: number;
  vendors: number;
  riders: number;
  orders: number;
  activeOrders: number;
  deliveredOrders: number;
  ratings: number;
  queries: number;
}

interface DashboardAlerts {
  suspendedCustomers: number;
  suspendedVendors: number;
  suspendedRiders: number;
  openQueries: number;
}

interface DashboardData {
  overview: DashboardOverview;
  recentActivity: any[]; // populated Order documents
  alerts: DashboardAlerts;
  orderTrends: any[]; // { date, successful, cancelled }
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
  if (["delivered", "completed"].includes(s)) return "bg-green-100 text-green-800";
  if (["pending", "preparing", "in_transit", "assigned"].includes(s))
    return "bg-yellow-100 text-yellow-800";
  if (["cancelled", "declined"].includes(s)) return "bg-red-100 text-red-800";
  return "bg-blue-100 text-blue-800";
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────
function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  bg,
}: {
  title: string;
  value: number | string;
  sub: string;
  icon: any;
  bg: string;
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

function ActivityTable({ orders, onView }: { orders: any[]; onView: (id: string) => void }) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
        <ShoppingCart className="w-8 h-8 opacity-20" />
        <p className="text-sm font-medium">No recent activity</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            {["Order", "Customer", "Vendor", "Status", "Time", ""].map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any, i: number) => (
            <tr
              key={order._id ?? i}
              className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
            >
              <td className="px-4 py-3.5">
                <span className="font-mono text-[11px] text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  #{order.orderNumber ?? order._id?.slice(-6)?.toUpperCase() ?? "—"}
                </span>
              </td>
              <td className="px-4 py-3.5 font-semibold text-gray-800 text-xs max-w-[130px] truncate">
                {resolveCustomerName(order)}
              </td>
              <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[120px] truncate">
                {resolveVendorName(order)}
              </td>
              <td className="px-4 py-3.5">
                <span
                  className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-black tracking-wider ${statusBadge(order.status)}`}
                >
                  {order.status ?? "pending"}
                </span>
              </td>
              <td className="px-4 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                {timeAgo(order.createdAt)}
              </td>
              <td className="px-4 py-3.5">
                <button
                  type="button"
                  aria-label="View order"
                  onClick={() => onView(order._id ?? order.id)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#1a3f1c] transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        overview: d?.overview ?? {},
        recentActivity: d?.recentActivity ?? [],
        alerts: d?.alerts ?? {},
        orderTrends: d?.orderTrends ?? [],
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
            <button
              type="button"
              onClick={fetchDashboard}
              className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900"
            >
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
      value: overview.orders ?? 0,
      sub: `${overview.activeOrders ?? 0} active · ${overview.deliveredOrders ?? 0} delivered`,
      icon: ShoppingCart,
      bg: "#98ef9b",
    },
    {
      title: "Total Vendors",
      value: overview.vendors ?? 0,
      sub: `${alerts.suspendedVendors ?? 0} suspended`,
      icon: Store,
      bg: "#98ef9b",
    },
    {
      title: "Total Riders",
      value: overview.riders ?? 0,
      sub: `${alerts.suspendedRiders ?? 0} suspended`,
      icon: Bike,
      bg: "#98ef9b",
    },
    {
      title: "Total Customers",
      value: overview.customers ?? 0,
      sub: `${alerts.suspendedCustomers ?? 0} suspended`,
      icon: Users,
      bg: "#98ef9b",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-8 mb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {overview.activeOrders ?? 0} active orders right now. Monitor operations live.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
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
              <p className="text-xs text-muted-foreground">
                Successful vs Cancelled orders (last 7 days)
              </p>
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
            {orderTrends.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                <LineChartIcon className="w-10 h-10 opacity-20" />
                <p className="text-sm font-medium">No order data for the last 7 days</p>
              </div>
            ) : (
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
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString("en-US", { weekday: "short" })
                    }
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
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
            )}
          </div>
        </CardContent>
      </Card>

      {/* Activity + Alerts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity — table, takes 2 columns */}
        <Card className="lg:col-span-2 border border-border rounded-2xl shadow-sm bg-surface overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1a3f1c]" />
                <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
                <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                  {recentActivity.length} orders
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/operations/orders")}
                className="text-xs font-semibold h-8"
              >
                View All
              </Button>
            </div>
            <ActivityTable
              orders={recentActivity}
              onView={(id) => router.push(`/operations/orders/${id}`)}
            />
          </CardContent>
        </Card>

        {/* Alerts & Ratings — right column */}
        <div className="space-y-4">
          {/* Alerts panel */}
          <Card className="border border-border rounded-2xl shadow-sm bg-surface overflow-hidden">
            <CardContent className="p-0">
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 bg-amber-50 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <h2 className="text-sm font-bold text-amber-800">Alerts & Warnings</h2>
                </div>
                <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                  {(alerts.suspendedCustomers ?? 0) +
                    (alerts.suspendedVendors ?? 0) +
                    (alerts.suspendedRiders ?? 0) +
                    (alerts.openQueries ?? 0)}{" "}
                  total
                </span>
              </div>

              {/* Alert rows */}
              {[
                {
                  label: "Suspended Customers",
                  count: alerts.suspendedCustomers ?? 0,
                  bar: "bg-red-500",
                  path: "/operations/customers",
                },
                {
                  label: "Suspended Vendors",
                  count: alerts.suspendedVendors ?? 0,
                  bar: "bg-orange-500",
                  path: "/operations/vendors",
                },
                {
                  label: "Suspended Riders",
                  count: alerts.suspendedRiders ?? 0,
                  bar: "bg-yellow-500",
                  path: "/operations/riders",
                },
                {
                  label: "Open Queries",
                  count: alerts.openQueries ?? 0,
                  bar: "bg-blue-500",
                  path: "/operations/orders",
                },
              ].map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => router.push(item.path)}
                  className="w-full flex items-center justify-between px-5 py-3.5 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left last:border-0 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-7 rounded-full ${item.bar}`} />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {item.label}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full text-white ${item.count > 0 ? item.bar : "bg-gray-300"}`}
                  >
                    {item.count}
                  </span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Platform Ratings */}
          <Card className="border border-border rounded-2xl shadow-sm overflow-hidden bg-[#1a3f1c]">
            <CardContent className="p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                Platform Ratings
              </p>
              <p className="text-4xl font-black text-white tracking-tight">
                {(overview.ratings ?? 0).toLocaleString()}
              </p>
              <p className="text-xs text-white/50 mt-1">Total reviews submitted</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
