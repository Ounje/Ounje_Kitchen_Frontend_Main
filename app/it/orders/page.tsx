"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = "Daily" | "Weekly" | "Monthly" | "Yearly";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatGroupDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const nth = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
  };
  return `${days[d.getDay()]} ${d.getDate()}${nth(d.getDate())}, ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function groupByDate(orders: any[]): Record<string, any[]> {
  return orders.reduce((acc, order) => {
    const raw = order.createdAt ?? order.date ?? "";
    const key = raw ? raw.slice(0, 10) : "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(order);
    return acc;
  }, {} as Record<string, any[]>);
}

function fmt(n: number | undefined) {
  return `₦${(n ?? 0).toLocaleString()}`;
}

// Safely extract a string — vendor.location is { type, coordinates, address }
function safeStr(val: any, fallback = "—"): string {
  if (!val) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.address ?? val.name ?? val.label ?? fallback;
  return fallback;
}

function resolveOrderName(order: any): string {
  return order.customer?.user?.name ?? order.customer?.name ?? order.customerName ?? order.orderName ?? "Order";
}

function resolveVendorName(order: any): string {
  return safeStr(order.vendor?.name ?? order.vendor?.businessName ?? order.vendorName);
}

function resolveRiderName(order: any): string {
  if (!order.rider) return safeStr(order.riderName);
  const r = order.rider;
  return safeStr(
    r.user?.name ??
    (`${r.firstName ?? ""} ${r.lastName ?? ""}`.trim() || undefined) ??
    order.riderName
  );
}

function resolveImage(order: any): string {
  return order.image ?? order.foodImage ?? order.photo ?? "";
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse flex items-center gap-3 bg-[#98ef9b] rounded-lg p-3 mb-2">
      <div className="w-16 h-16 bg-gray-300 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-1/3" />
        <div className="h-3 bg-gray-300 rounded w-1/4" />
      </div>
      <div className="space-y-2 text-right">
        <div className="h-3 bg-gray-300 rounded w-20" />
        <div className="h-3 bg-gray-300 rounded w-24" />
      </div>
      <div className="flex gap-1 ml-2">
        <div className="w-7 h-7 bg-gray-400 rounded-full" />
        <div className="w-7 h-7 bg-gray-400 rounded-full" />
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────
function DeleteModal({ orderId, onConfirm, onCancel, deleting }: {
  orderId: string; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#4B8A4E] text-white rounded-2xl w-full max-w-sm p-8 shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Delete Order</h2>
        <p className="text-base mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={deleting} className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20">Cancel</Button>
          <Button onClick={onConfirm} disabled={deleting} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ITOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 7, total: 0, pages: 1 });

  const [filters, setFilters] = useState({ name: "", vendor: "", rider: "", zone: "" });
  const [period, setPeriod] = useState<Period>("Daily");
  const [showPeriodDrop, setShowPeriodDrop] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);

  const [deleteId, setDeleteId]   = useState<string | null>(null);
  const [deleting, setDeleting]   = useState(false);

  // Close period dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setShowPeriodDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const extractRows = (res: any): any[] => {
    const d = res?.data ?? res;
    if (Array.isArray(d?.orders)) return d.orders;
    if (Array.isArray(d?.data))   return d.data;
    if (Array.isArray(d))         return d;
    return [];
  };

  const extractPagination = (res: any, currentLimit: number) => {
    const d = res?.data ?? res;
    return {
      page:  d?.page  ?? d?.pagination?.page  ?? 1,
      pages: d?.pages ?? d?.pagination?.pages ?? 1,
      total: d?.total ?? d?.pagination?.total ?? 0,
      limit: currentLimit,
    };
  };

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = { page, limit: pagination.limit, period: period.toLowerCase() };
      if (filters.name)   params.name   = filters.name;
      if (filters.vendor) params.vendor = filters.vendor;
      if (filters.rider)  params.rider  = filters.rider;
      if (filters.zone)   params.zone   = filters.zone;

      const res: any = await itService.getOrders(params);
      setOrders(extractRows(res));
      setPagination(extractPagination(res, pagination.limit));
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(1); }, [period]);

  const handleSearch = () => fetchOrders(1);
  const handleReset = () => {
    setFilters({ name: "", vendor: "", rider: "", zone: "" });
    setTimeout(() => fetchOrders(1), 0);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await itService.deleteOrder(deleteId);
      toast.success("Order deleted");
      setOrders(prev => prev.filter(o => (o._id ?? o.id) !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  const grouped = groupByDate(orders);
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a)); // newest first

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        {/* Period dropdown */}
        <div className="relative" ref={periodRef}>
          <button
            onClick={() => setShowPeriodDrop(p => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-[#98ef9b] text-[#1a3f1c] rounded-lg text-sm font-medium hover:bg-[#7de07f] transition-colors shadow-sm"
          >
            <span>👤</span>
            <span>{period}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showPeriodDrop ? "rotate-180" : ""}`} />
          </button>
          {showPeriodDrop && (
            <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg py-1 z-10">
              {(["Daily","Weekly","Monthly","Yearly"] as Period[]).map(p => (
                <button key={p} onClick={() => { setPeriod(p); setShowPeriodDrop(false); }}
                  className={`w-full px-4 py-2 text-left text-sm ${period === p ? "bg-[#98ef9b] text-[#1a3f1c] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Name</label>
            <Input value={filters.name}   onChange={e => setFilters(f => ({...f, name: e.target.value}))}   placeholder="Search by name"   className="h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Vendor</label>
            <Input value={filters.vendor} onChange={e => setFilters(f => ({...f, vendor: e.target.value}))} placeholder="Search by vendor" className="h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Rider</label>
            <Input value={filters.rider}  onChange={e => setFilters(f => ({...f, rider: e.target.value}))}  placeholder="Search by rider"  className="h-9" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Zone</label>
            <Input value={filters.zone}   onChange={e => setFilters(f => ({...f, zone: e.target.value}))}   placeholder="Search by zone"   className="h-9" />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch} style={{ backgroundColor: "#1a3f1c" }} className="text-white hover:opacity-90 h-9 px-5">Search</Button>
          <Button onClick={handleReset} variant="outline" className="h-9 px-5">Reset</Button>
          <Button onClick={() => window.location.href = "/it/orders/create"} style={{ backgroundColor: "#4a7c4e" }} className="text-white hover:opacity-90 h-9 px-5 ml-auto">
            Create Order
          </Button>
        </div>
      </div>

      {/* Orders list — grouped by date */}
      <div className="space-y-4">
        {loading ? (
          <>
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No orders found</p>
            <p className="text-sm mt-1">Try adjusting the filters or period</p>
          </div>
        ) : (
          dateKeys.map(dateKey => (
            <div key={dateKey}>
              {/* Date group header */}
              <p className="text-sm font-semibold text-gray-700 mb-2">{formatGroupDate(dateKey)}</p>

              {grouped[dateKey].map((order: any) => {
                const id         = order._id ?? order.id;
                const name       = resolveOrderName(order);
                const vendorName = resolveVendorName(order);
                const riderName  = resolveRiderName(order);
                const total      = order.totalFee ?? order.total ?? order.totalAmount ?? 0;
                const image      = resolveImage(order);

                return (
                  <div key={id}
                    className="flex items-center gap-3 bg-[#98ef9b] rounded-xl p-3 mb-2 hover:bg-[#8de08f] transition-colors"
                  >
                    {/* Food image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {image
                        ? <img src={image} alt={name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-green-300 to-green-500 flex items-center justify-center text-white text-xs font-bold">IMG</div>
                      }
                    </div>

                    {/* Order info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1a3f1c] text-sm truncate">{name}</p>
                      <p className="text-xs text-[#1a3f1c]/80 font-medium">Total Amount: {fmt(total)}</p>
                    </div>

                    {/* Vendor & Rider */}
                    <div className="hidden sm:block text-right text-xs text-[#1a3f1c]/80 space-y-0.5 mr-2">
                      <p><span className="font-medium">Vendor:</span> {vendorName}</p>
                      <p><span className="font-medium">Rider:</span> {riderName}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => router.push(`/it/orders/${id}`)}
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "#1a3f1c" }}
                        title="View order"
                      >
                        <Eye className="h-4 w-4 text-white" />
                      </button>
                      <button
                        onClick={() => setDeleteId(id)}
                        className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600"
                        title="Delete order"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          pageSize={pagination.limit}
          onPageChange={fetchOrders}
          onPageSizeChange={size => {
            setPagination(p => ({ ...p, limit: size, page: 1 }));
            setTimeout(() => fetchOrders(1), 0);
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <DeleteModal
          orderId={deleteId}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}