"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { operationsService } from "@/lib/api/services/operations.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

// ── Period → date range ───────────────────────────────────────────────────────
// Operations order controller reads: startDate / endDate (not dateFrom/dateTo)
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
      from = new Date(now); from.setDate(now.getDate() + diff); from.setHours(0, 0, 0, 0);
      to   = new Date(from); to.setDate(from.getDate() + 6);    to.setHours(23, 59, 59, 999);
      break;
    }
    case "monthly":
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "yearly":
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default:
      return null;
  }
  return { startDate: from.toISOString(), endDate: to.toISOString() };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function resolveCustomerName(order: any): string {
  // customer is populated: { name, email, phone } directly (operations controller
  // does .populate("customer", "name email phone") — no user ref here)
  return order.customer?.name ?? order.customer?.user?.name ?? "Unknown";
}

function resolveVendorName(order: any): string {
  // vendor is formatted by controller: { _id, name, storeName }
  return order.vendor?.storeName ?? order.vendor?.name ?? "—";
}

function resolveRiderName(order: any): string {
  // rider is populated: { phone } only in list; user.name in detail
  return order.rider?.user?.name ?? order.rider?.name ?? "Not Assigned";
}

function resolveImage(order: any): string {
  return order.image ?? order.foodImage ?? order.photo ?? "";
}

function statusColor(status: string) {
  const s = (status ?? "").toLowerCase();
  if (["delivered", "completed"].includes(s))  return "bg-green-100 text-green-800";
  if (["pending","preparing","in_transit","assigned"].includes(s)) return "bg-yellow-100 text-yellow-800";
  if (["cancelled","declined"].includes(s))     return "bg-red-100 text-red-800";
  return "bg-blue-100 text-blue-800";
}

// Group orders by date string (YYYY-MM-DD)
function groupByDate(orders: any[]): Record<string, any[]> {
  return orders.reduce((acc, order) => {
    const raw = order.createdAt ?? "";
    const key = raw ? raw.slice(0, 10) : "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
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

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl p-4 mb-3" style={{ backgroundColor: "#98ef9b" }}>
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-gray-300 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-gray-300 rounded w-2/3" />
          <div className="h-3 bg-gray-300 rounded w-1/2" />
          <div className="h-3 bg-gray-300 rounded w-1/3" />
        </div>
        <div className="w-24 h-9 bg-gray-300 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OperationsOrdersPage() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });
  const router = useRouter();

  const [orders,     setOrders]     = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1, limit: 10 });

  const [period,  setPeriod]  = useState("daily");
  const [filters, setFilters] = useState({
    name:     "",
    vendor:   "",
    zone:     "",
    orderId:  "",
    status:   "all",
    dateFrom: undefined as Date | undefined,
    dateTo:   undefined as Date | undefined,
  });

  // ── Response shape from orderController: { success, count, total, page, pages, data: [...] }
  const extractOrders = (res: any): any[] => {
    // apiClient returns raw body → res has { success, count, total, page, pages, data }
    if (Array.isArray(res?.data))  return res.data;
    if (Array.isArray(res))        return res;
    return [];
  };

  const extractPagination = (res: any, currentLimit: number) => ({
    page:  res?.page  ?? 1,
    pages: res?.pages ?? 1,
    total: res?.total ?? 0,
    limit: currentLimit,
  });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (page = 1, activeFilters = filters) => {
    setLoading(true);
    try {
      // Operations controller uses startDate/endDate (not dateFrom/dateTo)
      const dateRange = activeFilters.dateFrom && activeFilters.dateTo
        ? {
            startDate: activeFilters.dateFrom.toISOString(),
            endDate:   activeFilters.dateTo.toISOString(),
          }
        : getDateRange(period) ?? {};

      const params: any = {
        page,
        limit:  pagination.limit,
        ...dateRange,
      };

      // Operations order controller reads: status, search (for orderNumber), customer/vendor filters
      if (activeFilters.status !== "all") params.status  = activeFilters.status;
      if (activeFilters.orderId)          params.search  = activeFilters.orderId;
      if (activeFilters.name)             params.search  = activeFilters.name;
      if (activeFilters.vendor)           params.vendor  = activeFilters.vendor;
      if (activeFilters.zone)             params.zone    = activeFilters.zone;

      const res: any = await operationsService.getOrders(params);
      setOrders(extractOrders(res));
      setPagination(extractPagination(res, pagination.limit));
    } catch (err: any) {
      toast.error(err?.message || "Failed to load orders");
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
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" />
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
        <Select value={period} onValueChange={(v) => { setPeriod(v); }}>
          <SelectTrigger className="w-full sm:w-36 h-10 bg-[#98ef9b] border-none text-[#1a3f1c] font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <Label className="text-sm font-medium text-gray-700">Customer Name</Label>
              <Input value={filters.name}
                onChange={e => setFilters(f => ({ ...f, name: e.target.value }))}
                className="mt-1" placeholder="Customer name"
                onKeyDown={e => e.key === "Enter" && handleSearch()} />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Vendor</Label>
              <Input value={filters.vendor}
                onChange={e => setFilters(f => ({ ...f, vendor: e.target.value }))}
                className="mt-1" placeholder="Vendor name"
                onKeyDown={e => e.key === "Enter" && handleSearch()} />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Zone</Label>
              <Input value={filters.zone}
                onChange={e => setFilters(f => ({ ...f, zone: e.target.value }))}
                className="mt-1" placeholder="Zone" />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Order ID / Number</Label>
              <Input value={filters.orderId}
                onChange={e => setFilters(f => ({ ...f, orderId: e.target.value }))}
                className="mt-1" placeholder="OUN-XXX-XXXX" />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">Order Status</Label>
              <Select value={filters.status}
                onValueChange={v => setFilters(f => ({ ...f, status: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="preparing">Preparing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div>
              <Label className="text-sm font-medium text-gray-700">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy") : <span className="text-gray-400">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={filters.dateFrom}
                    onSelect={d => setFilters(f => ({ ...f, dateFrom: d }))} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div>
              <Label className="text-sm font-medium text-gray-700">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy") : <span className="text-gray-400">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={filters.dateTo}
                    onSelect={d => setFilters(f => ({ ...f, dateTo: d }))} />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <Button onClick={handleSearch}
              className="bg-[#1a3f1c] hover:bg-[#164016] text-white h-10 px-8">
              Search
            </Button>
            <Button onClick={handleReset}
              className="bg-[#1a3f1c] hover:bg-[#164016] text-white h-10 px-8">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Count badge */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {pagination.total > 0
            ? `${pagination.total} order${pagination.total !== 1 ? "s" : ""} found`
            : "No orders found for this period"}
        </p>
      )}

      {/* Orders list grouped by date */}
      <div className="space-y-6">
        {loading ? (
          <>
            <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </>
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
              <h2 className="text-lg font-bold text-gray-900">
                {formatGroupDate(dateKey)}
              </h2>

              {grouped[dateKey].map((order: any) => {
                const id = order._id ?? order.id;
                const image = resolveImage(order);

                return (
                  <Card key={id}
                    className="border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    style={{ backgroundColor: "#98ef9b" }}
                    onClick={() => router.push(`/operations/orders/${id}`)}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex gap-3 sm:gap-4">

                        {/* Food image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                          {image
                            ? <img src={image} alt="Food" className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white text-xs font-bold">IMG</div>
                          }
                        </div>

                        {/* Order info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <p className="text-sm sm:text-base font-semibold text-[#1a3f1c]">
                            Customer: <span className="font-normal">{resolveCustomerName(order)}</span>
                          </p>
                          <p className="text-sm font-semibold text-[#1a3f1c]">
                            Vendor: <span className="font-normal">{resolveVendorName(order)}</span>
                          </p>
                          <p className="text-xs text-[#1a3f1c]/70">
                            Order: {order.orderNumber ?? id?.slice(-8)?.toUpperCase() ?? "—"}
                          </p>
                          <p className="text-sm font-semibold text-[#1a3f1c]">
                            Rider: <span className="font-normal">{resolveRiderName(order)}</span>
                          </p>
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColor(order.status)}`}>
                            {(order.status ?? "pending").toUpperCase()}
                          </span>
                        </div>

                        {/* Details button */}
                        <Button
                          className="bg-[#1a3f1c] hover:bg-[#164016] text-white h-9 sm:h-10 px-4 sm:px-6 flex-shrink-0 self-center cursor-pointer"
                          onClick={e => { e.stopPropagation(); router.push(`/operations/orders/${id}`); }}>
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && pagination.pages > 1 && (
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