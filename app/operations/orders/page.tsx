"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { operationsService } from "@/lib/api/services/operations.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

function getDateRange(period: string): { startDate: string; endDate: string } | null {
  if (period === "all") return null;
  const now = new Date();
  let from: Date, to: Date;
  switch (period) {
    case "daily":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case "weekly": {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      from = new Date(now); from.setDate(now.getDate() + diff); from.setHours(0,0,0,0);
      to   = new Date(from); to.setDate(from.getDate() + 6);    to.setHours(23,59,59,999);
      break;
    }
    case "monthly":
      from = new Date(now.getFullYear(), now.getMonth(), 1);
      to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "yearly":
      from = new Date(now.getFullYear(), 0, 1);
      to   = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default: return null;
  }
  return { startDate: from.toISOString(), endDate: to.toISOString() };
}

function resolveName(obj: any, fallback = "Unknown"): string {
  if (!obj) return fallback;
  if (typeof obj === "string") return fallback;
  if (typeof obj.resolvedName === "string" && obj.resolvedName.trim()) return obj.resolvedName.trim();
  if (typeof obj.name === "string" && obj.name.trim()) return obj.name.trim();
  const first = (obj.firstName ?? "").trim();
  const last  = (obj.lastName  ?? "").trim();
  const full  = `${first} ${last}`.trim();
  if (full) return full;
  if (obj.user && typeof obj.user === "object") return resolveName(obj.user, fallback);
  return fallback;
}

function resolveOrderImage(order: any): string {
  const direct = order.image ?? order.foodImage ?? order.photo ?? order.thumbnail ?? order.coverImage ?? "";
  if (direct) return direct;
  const items = order.items ?? [];
  for (const item of items) {
    const img = item.displayImage ?? item.image ?? item.photo ?? item.item?.image ?? "";
    if (img) return img;
  }
  return order.vendor?.photo ?? "";
}

function statusBadgeColor(status: string): string {
  const s = (status ?? "").toLowerCase();
  if (["delivered","completed"].includes(s))           return "text-green-700 font-bold";
  if (["in_transit","picked_up","riding"].includes(s)) return "text-blue-700 font-bold";
  if (["cancelled","declined"].includes(s))            return "text-red-600 font-bold";
  if (["assigned","preparing"].includes(s))            return "text-purple-700 font-bold";
  if (["confirming"].includes(s))                      return "text-orange-600 font-bold";
  return "text-yellow-700 font-bold";
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    in_transit: "RIDING",     picked_up:  "RIDING",
    delivered:  "DELIVERED",  completed:  "DELIVERED",
    cancelled:  "CANCELLED",  declined:   "CANCELLED",
    confirming: "CONFIRMING", pending:    "PENDING",
    assigned:   "ASSIGNED",   preparing:  "PREPARING",
    riding:     "RIDING",
  };
  return map[(status ?? "").toLowerCase()] ?? (status ?? "PENDING").toUpperCase();
}

function paymentBadgeClass(status: string): string {
  const s = (status ?? "").toLowerCase();
  if (s === "paid")     return "bg-green-100 text-green-700 border border-green-300";
  if (s === "refunded") return "bg-blue-100 text-blue-700 border border-blue-300";
  return "bg-red-100 text-red-600 border border-red-300";
}

function formatSubStatus(sub: string): string {
  if (!sub) return "—";
  return sub.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatOrderTime(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function groupByDate(orders: any[]): Record<string, any[]> {
  return orders.reduce((acc, o) => {
    const key = (o.createdAt ?? "").slice(0, 10) || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(o);
    return acc;
  }, {} as Record<string, any[]>);
}

function formatGroupDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const nth = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
  };
  return `${days[d.getDay()]} ${d.getDate()}${nth(d.getDate())}, ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl p-4 mb-3 bg-muted/30 border border-border/50">
      <div className="flex gap-3">
        <div className="w-24 h-24 bg-muted/50 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 content-center">
          {[0,1,2,3,4,5].map(j => <div key={j} className="h-3 bg-muted/50 rounded w-3/4" />)}
        </div>
        <div className="w-20 h-9 bg-muted/50 rounded-xl flex-shrink-0 self-center" />
      </div>
    </div>
  );
}

// ── Labelled row component ────────────────────────────────────────────────────
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="text-xs text-[#1a3f1c] flex items-center gap-1 flex-wrap">
      <span className="font-bold shrink-0">{label}:</span>
      {children}
    </p>
  );
}

export default function OperationsOrdersPage() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });
  const router = useRouter();

  const [orders,     setOrders]     = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });
  const [period,     setPeriod]     = useState("all");
  const [filters,    setFilters]    = useState({
    name: "", vendor: "", zone: "", orderId: "", status: "all",
    dateFrom: undefined as Date | undefined,
    dateTo:   undefined as Date | undefined,
  });

  const fetchOrders = useCallback(async (page = 1, activeFilters = filters) => {
    setLoading(true);
    setError(null);
    try {
      const dateRange = (activeFilters.dateFrom && activeFilters.dateTo)
        ? { startDate: activeFilters.dateFrom.toISOString(), endDate: activeFilters.dateTo.toISOString() }
        : (getDateRange(period) ?? {});

      const params: any = { page, limit: pagination.limit, ...dateRange };
      if (activeFilters.status !== "all") params.status = activeFilters.status;
      if (activeFilters.orderId)          params.search = activeFilters.orderId;
      if (activeFilters.name)             params.search = activeFilters.name;
      if (activeFilters.vendor)           params.vendor = activeFilters.vendor;
      if (activeFilters.zone)             params.zone   = activeFilters.zone;

      const res: any = await operationsService.getOrders(params);
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setOrders(data);
      setPagination({
        page:  res?.page  ?? 1,
        pages: res?.pages ?? res?.totalPages ?? 1,
        total: res?.total ?? 0,
        limit: pagination.limit,
      });
    } catch (err: any) {
      const msg = err?.message || "Failed to load orders. Check if the server is running.";
      setError(msg);
      toast.error(msg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [period, pagination.limit, filters]);

  useEffect(() => {
    if (shouldRender) fetchOrders(1);
  }, [shouldRender, period]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => fetchOrders(1, filters);
  const handleReset  = () => {
    const cleared = { name: "", vendor: "", zone: "", orderId: "", status: "all", dateFrom: undefined, dateTo: undefined };
    setFilters(cleared);
    fetchOrders(1, cleared);
  };

  if (!shouldRender || Reloading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" />
        <p className="text-sm text-gray-400">Verifying session...</p>
      </div>
    );
  }

  const grouped  = groupByDate(orders);
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Orders</h1>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-full sm:w-40 h-10 bg-secondary border-primary/5 text-primary font-black uppercase tracking-wider shadow-sm rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["daily","weekly","monthly","yearly","all"].map(v => (
              <SelectItem key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      <Card className="border border-border/50 shadow-sm rounded-2xl bg-surface">
        <CardContent className="p-4 sm:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: "Customer Name",     key: "name",    placeholder: "Search by customer..." },
              { label: "Vendor Store",   key: "vendor",  placeholder: "Search by vendor..."   },
              { label: "Zone / Area",     key: "zone",    placeholder: "Search by zone..."           },
              { label: "Order Reference", key: "orderId", placeholder: "OUN-XXX-XXXX"  },
            ].map(f => (
              <div key={f.key}>
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]/50 mb-1.5 block">{f.label}</Label>
                <Input
                  value={(filters as any)[f.key]}
                  onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="h-10 rounded-xl" placeholder={f.placeholder}
                  onKeyDown={e => e.key === "Enter" && handleSearch()} />
              </div>
            ))}

            <div>
              <Label className="text-sm font-medium text-gray-700">Order Status</Label>
              <Select value={filters.status} onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["all","pending","confirming","assigned","preparing","riding","in_transit","delivered","cancelled"].map(v => (
                    <SelectItem key={v} value={v}>
                      {v === "in_transit" ? "In Transit" : v.charAt(0).toUpperCase() + v.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(["From","To"] as const).map(lbl => {
              const key = lbl === "From" ? "dateFrom" : "dateTo";
              return (
                <div key={lbl}>
                  <Label className="text-sm font-medium text-gray-700">{lbl}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full mt-1 justify-start font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {(filters as any)[key] ? format((filters as any)[key], "dd/MM/yyyy") : <span className="text-gray-400">DD/MM/YYYY</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={(filters as any)[key]}
                        onSelect={d => setFilters(f => ({ ...f, [key]: d }))} />
                    </PopoverContent>
                  </Popover>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-border/50 pt-5">
            <Button onClick={handleSearch} className="bg-primary hover:opacity-90 text-white h-11 px-10 font-black rounded-xl shadow-md transition-all active:scale-95">Search</Button>
            <Button onClick={handleReset} variant="outline" className="border-border text-[#1a3f1c] h-11 px-10 font-black rounded-xl hover:bg-muted/50 transition-all">Reset</Button>
          </div>
        </CardContent>
      </Card>

      {!loading && !error && (
        <p className="text-sm text-gray-500">
          {pagination.total > 0
            ? `${pagination.total} order${pagination.total !== 1 ? "s" : ""} found`
            : "No orders found for this period"}
        </p>
      )}

      {/* Order list */}
      <div className="space-y-6">
        {loading ? (
          <>{[0,1,2].map(i => <SkeletonCard key={i} />)}</>
        ) : error ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-lg font-medium text-red-500">Failed to load orders</p>
              <p className="text-sm text-gray-400">{error}</p>
              <Button onClick={() => fetchOrders(1)} className="bg-[#1a3f1c] hover:bg-[#164016] text-white gap-2">
                <RefreshCw className="h-4 w-4" /> Retry
              </Button>
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="border-none shadow-sm">
            <CardContent className="p-12 text-center text-gray-400">
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm mt-1">Try adjusting the filters or period</p>
            </CardContent>
          </Card>
        ) : (
          dateKeys.map(dateKey => (
            <div key={dateKey} className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">{formatGroupDate(dateKey)}</h2>

              {grouped[dateKey].map((order: any) => {
                const id            = order._id ?? order.id ?? "";
                const image         = resolveOrderImage(order);
                const status        = order.status        ?? "pending";
                const subStatus     = order.subStatus     ?? "";
                const paymentStatus = order.paymentStatus ?? "unpaid";
                const orderTime     = order.createdAt     ?? order.placedAt ?? "";
                const customer      = order.customer      ?? {};
                const vendor        = order.vendor        ?? {};
                const vendorName    = vendor.storeName ?? vendor.businessName ?? vendor.name ?? "—";
                const rider         = order.rider;
                const riderLabel    = rider ? resolveName(rider.user ?? rider, "Assigned") : "Not Assigned";

                return (
                  <div
                    key={id || Math.random()}
                    className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer bg-secondary border border-primary/5 hover:border-primary/20 group"
                    onClick={() => router.push(`/operations/orders/${id}`)}
                  >
                    <div className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4">

                      {/* Food image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 mt-0.5">
                        {image ? (
                          <img src={image} alt="food" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white text-xs font-bold">IMG</div>
                        )}
                      </div>

                      {/* Info — all fields labelled */}
                      <div className="flex-1 min-w-0 space-y-1">

                        {/* Row 1: Customer + Vendor */}
                        <div className="grid grid-cols-2 gap-x-4">
                          <InfoRow label="Customer">{resolveName(customer)}</InfoRow>
                          <InfoRow label="Vendor">{vendorName}</InfoRow>
                        </div>

                        {/* Row 2: Order ID + Rider */}
                        <div className="grid grid-cols-2 gap-x-4">
                          <InfoRow label="Order ID">{order.orderNumber ?? id?.toString().slice(-8).toUpperCase() ?? "—"}</InfoRow>
                          <InfoRow label="Rider">{riderLabel}</InfoRow>
                        </div>

                        {/* Row 3: Status + Sub-status */}
                        <div className="grid grid-cols-2 gap-x-4">
                          <InfoRow label="Status">
                            <span className={`uppercase text-[10px] ${statusBadgeColor(status)}`}>
                              {statusLabel(status)}
                            </span>
                          </InfoRow>
                          <InfoRow label="Sub-status">
                            <span className="text-[10px] text-gray-700">{formatSubStatus(subStatus)}</span>
                          </InfoRow>
                        </div>

                        {/* Row 4: Payment + Time */}
                        <div className="grid grid-cols-2 gap-x-4">
                          <InfoRow label="Payment">
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full ${paymentBadgeClass(paymentStatus)}`}>
                              {paymentStatus}
                            </span>
                          </InfoRow>
                          <InfoRow label="Placed">
                            <span className="text-[10px] text-gray-600">{formatOrderTime(orderTime)}</span>
                          </InfoRow>
                        </div>

                      </div>

                      {/* Details button */}
                      <Button
                        className="bg-primary hover:scale-105 text-white h-10 px-6 flex-shrink-0 text-sm font-black rounded-xl shadow-md transition-all self-center"
                        onClick={e => { e.stopPropagation(); router.push(`/operations/orders/${id}`); }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {!loading && !error && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          pageSize={pagination.limit}
          onPageChange={p => fetchOrders(p)}
          onPageSizeChange={size => {
            setPagination(prev => ({ ...prev, limit: size, page: 1 }));
            fetchOrders(1);
          }}
        />
      )}
    </div>
  );
}