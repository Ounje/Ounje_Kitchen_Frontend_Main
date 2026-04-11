"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users, Store, Bike, UserCog, ShoppingCart,
  AlertCircle, TrendingUp, Bell, CheckCircle,
  XCircle, AlertTriangle, Clock, Info, ArrowUpRight,
} from "lucide-react";
import { useRouteGuard } from "@/hooks/useRouteGuard";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DashboardData {
  customers: { total: number; active: number };
  vendors:   { total: number; active: number };
  riders:    { total: number; active: number };
  staff:     { total: number; active: number };
  orders:    { total: number; pending: number };
  recentOrders: any[]; // New field
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
    <Card className="border border-border shadow-sm hover:shadow-lg transition-all duration-300 bg-surface">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
            style={{ backgroundColor: iconBg }}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-semibold">{title}</p>
        <p className="text-3xl font-black text-foreground my-1">{value.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground font-medium">{sub}</p>
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
    <Card className="border border-border shadow-sm bg-surface">
      <CardContent className="p-5">
        <h3 className="text-sm font-bold text-foreground/90 mb-4">{title}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-sm" />
              <span className="text-foreground/80 font-medium">Active</span>
            </span>
            <span className="font-bold text-foreground">{active.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
              <span className="text-foreground/80 font-medium">Suspended</span>
            </span>
            <span className="font-bold text-foreground">{suspendedCount.toLocaleString()}</span>
          </div>
          {/* Progress bar */}
          <div className="pt-2">
            <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5 font-medium">{pct}% active</p>
          </div>
          <div className="pt-3 border-t border-border flex items-center justify-between mt-1">
            <span className="text-sm font-bold text-foreground/90">Total</span>
            <span className="text-base font-black text-primary">{total.toLocaleString()}</span>
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
    <Card className="border border-border shadow-sm bg-surface-secondary">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary shadow-lg flex items-center justify-center flex-shrink-0">
               <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground tracking-tight">Order Summary</h3>
              <p className="text-sm font-semibold text-muted-foreground mt-0.5">{completedPct}% completion rate</p>
            </div>
          </div>

          <div className="flex gap-8 w-full md:w-auto mt-4 md:mt-0 bg-surface p-4 rounded-xl border border-border shadow-sm">
            <div className="text-center">
              <p className="text-3xl font-black text-primary">{orders.total.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Total</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-yellow-500">{orders.pending.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-green-600">{completed.toLocaleString()}</p>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">Completed</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentOrdersTable({ orders }: { orders: any[] }) {
  const router = useRouter();
  
  if (!orders || orders.length === 0) return null;

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === "delivered" || s === "completed") return "bg-green-100 text-green-700 border-green-200";
    if (s === "pending" || s === "confirming") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "cancelled" || s === "declined") return "bg-red-100 text-red-700 border-red-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary rounded-lg font-bold">
            <ShoppingCart className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-black text-foreground tracking-tight">Recent Orders</h2>
        </div>
        <button 
          onClick={() => router.push("/it/orders")}
          className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
        >
          View All <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      <Card className="border border-border overflow-hidden rounded-2xl bg-surface shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Order ID</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Customer</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Vendor</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                <th className="p-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => {
                const id = order._id ?? order.id;
                const customer = order.customer?.user?.name ?? "Guest";
                const vendor = order.vendor?.name ?? "Unknown";
                return (
                  <tr 
                    key={id} 
                    className="hover:bg-muted/10 cursor-pointer transition-colors"
                    onClick={() => router.push(`/it/orders/${id}`)}
                  >
                    <td className="p-4 text-sm font-bold text-foreground">
                      {order.orderNumber ?? `#${id.slice(-6).toUpperCase()}`}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{customer}</td>
                    <td className="p-4 text-sm text-muted-foreground font-medium">{vendor}</td>
                    <td className="p-4 text-sm font-black text-foreground">
                      ₦{(order.totalPrice || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-right text-muted-foreground font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
  );
}

function Skeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 bg-muted rounded w-48" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-52 rounded-xl bg-muted/50" />)}
      </div>
      <div className="h-28 rounded-xl bg-muted/50" />
      <div className="h-80 rounded-xl bg-muted/50" />
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
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!shouldRender) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        // High priority dashboard data
        const [dashRes, adminsRes] = await Promise.all([
          itService.getDashboard(),
          itService.getAdmins({ page: 1, limit: 100 }),
        ]);

        setDashboard(dashRes as DashboardData);
        
        const adminsResult: any = adminsRes;
        const adminsArr: any[] = adminsResult?.data ?? adminsResult?.admins ?? adminsResult?.staff ?? [];
        const totalAdmins = adminsResult?.total ?? adminsResult?.pagination?.total ?? adminsArr.length;
        const activeAdmins = adminsArr.filter(
          (a: any) => a.isActive !== false && a.isSuspended !== true
        ).length;

        setAdminsTotal(totalAdmins);
        setAdminsActive(activeAdmins);

        // Fetch notifications separately to avoid blocking the whole dashboard
        try {
          const notifRes = await itService.getNotifications();
          const notifData = Array.isArray((notifRes as any)?.notifications) 
            ? (notifRes as any).notifications 
            : (Array.isArray(notifRes) ? notifRes : []);
          setNotifications(notifData);
        } catch (nErr) {
          console.warn("Notifications endpoint not reachable:", nErr);
          setNotifications([]); // Fallback to empty
        }

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
    <div className="space-y-8 animate-fadeIn pb-10">
      {/* Header */}
      <div className="mt-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">IT Dashboard</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">Platform overview &amp; overall account management</p>
      </div>

      {/* 6 stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Account status summary */}
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-surface-secondary rounded-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">Account Status Summary</h2>
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

      {/* Recent Orders — New Section */}
      <RecentOrdersTable orders={dashboard.recentOrders || []} />

      {/* Notifications — Real data from /api/it/notifications */}
      <div className="pt-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary rounded-lg font-bold">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-black text-foreground tracking-tight">System Notifications</h2>
          {notifications.length > 0 && (
            <span className="text-[10px] font-black uppercase tracking-widest bg-primary text-white px-2 py-1 rounded-md ml-2 border border-primary/10">
              {notifications.length} Active
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card className="border border-dashed border-border bg-muted/20 shadow-none rounded-2xl">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground/50 text-center">
                <div className="w-20 h-20 rounded-full bg-surface shadow-md border border-border flex items-center justify-center mb-2">
                  <Bell className="h-10 w-10 text-primary/30" />
                </div>
                <p className="text-lg font-black text-foreground tracking-tight">No notifications at the moment</p>
                <p className="text-sm text-muted-foreground font-medium max-w-sm">
                  Critical system alerts and broadcast logs will appear here when they are generated.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.slice(0, 5).map((n) => (
              <Card key={n._id} className="border border-border bg-surface hover:shadow-md transition-all rounded-xl">
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${
                    n.type === 'error' ? 'bg-red-50 text-red-600' : 
                    n.type === 'warning' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {n.type === 'error' ? <AlertCircle className="h-5 w-5" /> : 
                     n.type === 'warning' ? <AlertTriangle className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-foreground truncate">{n.title}</p>
                      <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{n.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
            {notifications.length > 5 && (
              <p className="text-center text-xs text-muted-foreground font-medium mt-2">
                Showing latest 5 of {notifications.length} notifications
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}