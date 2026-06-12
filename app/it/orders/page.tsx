"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Trash2, ChevronDown, Download, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = "Daily" | "Weekly" | "Monthly" | "Yearly" | "All";

function getDateRange(period: Period): { dateFrom?: string; dateTo?: string } {
  if (period === "All") return {};
  const now = new Date();
  let from: Date, to: Date;
  switch (period) {
    case "Daily":
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    case "Weekly": {
      const day = now.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      from = new Date(now); from.setDate(now.getDate() + diff); from.setHours(0,0,0,0);
      to   = new Date(from); to.setDate(from.getDate() + 6);    to.setHours(23,59,59,999);
      break;
    }
    case "Monthly":
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    case "Yearly":
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    default: return {};
  }
  return { dateFrom: from?.toISOString(), dateTo: to?.toISOString() };
}

function periodLabel(period: Period): string {
  const now = new Date();
  switch (period) {
    case "Daily":
      return now.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    case "Weekly": {
      const { dateFrom, dateTo } = getDateRange("Weekly");
      const f = new Date(dateFrom || "");
      const t = new Date(dateTo  || "");
      return `${f.toLocaleDateString("en-NG", { day: "numeric", month: "short" })} – ${t.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    case "Monthly":
      return now.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
    case "Yearly":
      return String(now.getFullYear());
    default:
      return "All Records";
  }
}

function fmt(n: number | undefined) {
  return `₦${(n ?? 0).toLocaleString()}`;
}

function safeStr(val: any, fallback = "—"): string {
  if (!val) return fallback;
  if (typeof val === "string") return val.trim() || fallback;
  if (typeof val === "number") return String(val);
  if (typeof val === "object") return val.address ?? val.name ?? val.label ?? fallback;
  return fallback;
}

function resolveOrderName(order: any): string {
  return order.customer?.user?.name ?? order.customer?.name ?? order.customerName ?? order.orderName ?? "—";
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

function statusColor(status: string): string {
  const s = (status ?? "").toLowerCase();
  if (["delivered","successful","completed"].includes(s))
    return "bg-green-100 text-green-700 border-green-200";
  if (["cancelled","failed"].includes(s))
    return "bg-red-100 text-red-700 border-red-200";
  if (["pending"].includes(s))
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function formatDate(d: string) {
  return new Date(d).toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

// ── Export helpers ────────────────────────────────────────────────────────────
function exportCSV(orders: any[], period: Period) {
  const headers = ["Order ID","Customer","Vendor","Rider","Zone","Status","Total (NGN)","Date"];
  const rows = orders.map(o => [
    o.orderNumber ?? o._id ?? "",
    resolveOrderName(o),
    resolveVendorName(o),
    resolveRiderName(o),
    safeStr(o.zone),
    o.status ?? "",
    (o.totalFee ?? o.total ?? o.totalPrice ?? 0),
    o.createdAt ? new Date(o.createdAt).toLocaleString("en-NG") : "",
  ]);

  const csvContent = [
    [`Ounjefood IT Orders — ${period} (${periodLabel(period)})`],
    [],
    headers,
    ...rows,
  ]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `orders_${period.toLowerCase()}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(orders: any[], period: Period) {
  const rows = orders.map((o, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${o.orderNumber ?? o._id ?? "—"}</td>
      <td>${resolveOrderName(o)}</td>
      <td>${resolveVendorName(o)}</td>
      <td>${resolveRiderName(o)}</td>
      <td>${safeStr(o.zone)}</td>
      <td style="text-align:center">
        <span style="padding:2px 8px;border-radius:4px;font-size:11px;background:${
          ["delivered","successful","completed"].includes((o.status ?? "").toLowerCase())
            ? "#d1fae5;color:#065f46"
            : ["cancelled","failed"].includes((o.status ?? "").toLowerCase())
            ? "#fee2e2;color:#991b1b"
            : "#fef9c3;color:#713f12"
        }">${o.status ?? "—"}</span>
      </td>
      <td style="text-align:right">${fmt(o.totalFee ?? o.total ?? o.totalPrice)}</td>
      <td>${o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-NG") : "—"}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Orders — ${period} — ${periodLabel(period)}</title>
  <style>
    @media print { body { margin: 0; } button { display:none; } }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111; padding: 24px; }
    h1 { color: #1a3f1c; font-size: 18px; margin-bottom: 4px; }
    p.sub { color: #555; font-size: 12px; margin: 0 0 16px; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #1a3f1c; color: #fff; padding: 8px 6px; text-align: left; font-size: 11px; }
    td { padding: 7px 6px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
    tr:nth-child(even) td { background: #f0fdf4; }
    .footer { margin-top: 24px; color: #888; font-size: 10px; text-align: center; }
    button { margin-bottom: 16px; padding: 8px 20px; background: #1a3f1c; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
  </style>
</head>
<body>
  <button onclick="window.print()">🖨 Print / Save as PDF</button>
  <h1>Ounjefood — Orders Report</h1>
  <p class="sub">Period: <strong>${period}</strong> &nbsp;|&nbsp; ${periodLabel(period)} &nbsp;|&nbsp; ${orders.length} orders</p>
  <table>
    <thead>
      <tr>
        <th>#</th><th>Order ID</th><th>Customer</th><th>Vendor</th><th>Rider</th>
        <th>Zone</th><th>Status</th><th>Total</th><th>Date</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p class="footer">Generated ${new Date().toLocaleString("en-NG")} — Ounjefood IT Portal</p>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      {[1,2,3,4,5,6,7,8].map(i => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-3.5 bg-gray-100 rounded-full w-3/4" />
        </td>
      ))}
    </tr>
  );
}

// ── Delete Modal ──────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel, deleting }: {
  onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[#4B8A4E] text-white rounded-2xl w-full max-w-sm p-8 shadow-2xl">
        <h2 className="text-xl font-bold mb-2">Delete Order</h2>
        <p className="text-base mb-6">Are you sure you want to delete this order? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} disabled={deleting}
            className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={deleting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            {deleting
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : "Yes, Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ITOrdersPage() {
  const router = useRouter();

  const [orders,     setOrders]     = useState<any[]>([]);
  const [allOrders,  setAllOrders]  = useState<any[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 1 });

  const [filters,        setFilters]        = useState({ name: "", vendor: "", rider: "", zone: "" });
  const [period,         setPeriod]         = useState<Period>("All");
  const [showPeriodDrop, setShowPeriodDrop] = useState(false);
  const [showExportDrop, setShowExportDrop] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node))  setShowPeriodDrop(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node))  setShowExportDrop(false);
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

  const fetchOrders = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const { dateFrom, dateTo } = getDateRange(period);
      const params: any = { page, limit: pagination.limit, dateFrom, dateTo };
      if (currentFilters.name)   params.name   = currentFilters.name;
      if (currentFilters.vendor) params.vendor = currentFilters.vendor;
      if (currentFilters.rider)  params.rider  = currentFilters.rider;
      if (currentFilters.zone)   params.zone   = currentFilters.zone;

      const res: any = await itService.getOrders(params);
      const rows = extractRows(res);
      setOrders(rows);
      setPagination(extractPagination(res, pagination.limit));

      const pag = extractPagination(res, pagination.limit);
      if (pag.total <= pagination.limit) {
        setAllOrders(rows);
      } else if (pag.total <= 500) {
        const allRes: any = await itService.getOrders({ ...params, page: 1, limit: pag.total });
        setAllOrders(extractRows(allRes));
      } else {
        setAllOrders(rows);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch orders");
      setOrders([]);
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  }, [period, pagination.limit, filters]);

  useEffect(() => { fetchOrders(1); }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => fetchOrders(1, filters);
  const handleReset  = () => {
    const cleared = { name: "", vendor: "", rider: "", zone: "" };
    setFilters(cleared);
    fetchOrders(1, cleared);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await itService.deleteOrder(deleteId);
      toast.success("Order deleted");
      setOrders(prev => prev.filter(o => (o._id ?? o.id) !== deleteId));
      setAllOrders(prev => prev.filter(o => (o._id ?? o.id) !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete order");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1a3f1c] flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-[#ffca3a]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#1a3f1c]">Orders</h1>
            <p className="text-xs text-gray-500">{periodLabel(period)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExportDrop(p => !p)}
              disabled={allOrders.length === 0}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExportDrop ? "rotate-180" : ""}`} />
            </button>
            {showExportDrop && (
              <div className="absolute right-0 mt-1 w-44 bg-white border rounded-lg shadow-lg py-1 z-20">
                <button onClick={() => { exportCSV(allOrders, period); setShowExportDrop(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  📄 Download CSV
                </button>
                <button onClick={() => { exportPDF(allOrders, period); setShowExportDrop(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                  🖨 Print / Save PDF
                </button>
              </div>
            )}
          </div>

          {/* Period dropdown */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => setShowPeriodDrop(p => !p)}
              className="flex items-center gap-2 px-3 py-2 bg-secondary text-primary rounded-lg text-sm font-black hover:brightness-95 transition-all shadow-sm border border-primary/5 uppercase tracking-wider"
            >
              <span>{period}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showPeriodDrop ? "rotate-180" : ""}`} />
            </button>
            {showPeriodDrop && (
              <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg py-1 z-10">
                {(["Daily","Weekly","Monthly","Yearly","All"] as Period[]).map(p => (
                  <button key={p}
                    onClick={() => { setPeriod(p); setShowPeriodDrop(false); }}
                    className={`w-full px-4 py-2 text-left text-sm ${period === p ? "bg-[#98ef9b] text-[#1a3f1c] font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Search Filters ── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          {[
            { key: "name",   label: "Customer",  placeholder: "Search by name"   },
            { key: "vendor", label: "Vendor",    placeholder: "Search by vendor" },
            { key: "rider",  label: "Rider",     placeholder: "Search by rider"  },
            { key: "zone",   label: "Zone",      placeholder: "Search by zone"   },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
              <Input
                value={filters[key as keyof typeof filters]}
                onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="h-9 rounded-xl"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSearch} className="bg-[#1a3f1c] text-white hover:bg-[#1a3f1c]/90 h-9 px-6 font-bold text-sm">
            Search
          </Button>
          <Button onClick={handleReset} variant="outline" className="h-9 px-6 font-bold text-sm">
            Reset
          </Button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {!loading && orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShoppingCart className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No orders found</p>
            <p className="text-xs mt-1">Try adjusting your filters or changing the time period.</p>
            <Button onClick={handleReset} variant="outline" size="sm" className="mt-4">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">#</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Vendor</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Rider</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Zone</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => <SkeletonRow key={i} />)
                  : orders.map((order, idx) => {
                    const id         = order._id ?? order.id;
                    const orderNum   = order.orderNumber ?? String(id).slice(-6).toUpperCase();
                    const customer   = resolveOrderName(order);
                    const vendor     = resolveVendorName(order);
                    const rider      = resolveRiderName(order);
                    const zone       = safeStr(order.zone);
                    const status     = order.status ?? "—";
                    const total      = order.totalFee ?? order.total ?? order.totalPrice ?? 0;
                    const date       = order.createdAt ? formatDate(order.createdAt) : "—";
                    const rowNum     = (pagination.page - 1) * pagination.limit + idx + 1;

                    return (
                      <tr key={id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-gray-400 text-xs">{rowNum}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-500">{orderNum}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium text-xs">{customer}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{vendor}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs">{rider}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{zone}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider border ${statusColor(status)}`}
                          >
                            {status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-800 font-semibold text-xs">
                          {fmt(total)}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{date}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => router.push(`/it/orders/${id}`)}
                              className="w-7 h-7 rounded-full flex items-center justify-center bg-[#1a3f1c] hover:scale-105 transition-transform shadow-sm"
                              title="View order"
                            >
                              <Eye className="h-3.5 w-3.5 text-white" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteId(id)}
                              className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                              title="Delete order"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Record count ── */}
      {!loading && pagination.total > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Showing {orders.length} of {pagination.total} order{pagination.total !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Pagination ── */}
      {!loading && pagination.pages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          pageSize={pagination.limit}
          onPageChange={(p) => fetchOrders(p)}
          onPageSizeChange={size => {
            setPagination(prev => ({ ...prev, limit: size, page: 1 }));
            fetchOrders(1);
          }}
        />
      )}

      {/* ── Delete Modal ── */}
      {deleteId && (
        <DeleteModal
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
          deleting={deleting}
        />
      )}
    </div>
  );
}
