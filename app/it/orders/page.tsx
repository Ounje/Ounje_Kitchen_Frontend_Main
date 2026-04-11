"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { itService } from "@/lib/api/services/it.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

// ── Types ─────────────────────────────────────────────────────────────────────
type Period = "Daily" | "Weekly" | "Monthly" | "Yearly";

// ── Date range helpers ────────────────────────────────────────────────────────
// Returns { dateFrom, dateTo } ISO strings for the selected period window.
// These are passed to the backend as query params so MongoDB filters by createdAt.
function getDateRange(period: Period): { dateFrom: string; dateTo: string } {
  const now = new Date();

  let from: Date;
  let to:   Date;

  switch (period) {
    case "Daily": {
      // Today: 00:00:00 → 23:59:59
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      break;
    }
    case "Weekly": {
      // Current week: Monday 00:00 → Sunday 23:59
      const dayOfWeek = now.getDay();                          // 0=Sun … 6=Sat
      const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // days back to Monday
      from = new Date(now);
      from.setDate(now.getDate() + diffToMon);
      from.setHours(0, 0, 0, 0);
      to = new Date(from);
      to.setDate(from.getDate() + 6);
      to.setHours(23, 59, 59, 999);
      break;
    }
    case "Monthly": {
      // 1st of current month → last day of current month
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      break;
    }
    case "Yearly": {
      // Jan 1 → Dec 31 of current year
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      to   = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      break;
    }
  }

  return {
    dateFrom: from.toISOString(),
    dateTo:   to.toISOString(),
  };
}

function periodLabel(period: Period): string {
  const now = new Date();
  switch (period) {
    case "Daily":
      return now.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    case "Weekly": {
      const { dateFrom, dateTo } = getDateRange("Weekly");
      const f = new Date(dateFrom);
      const t = new Date(dateTo);
      return `${f.toLocaleDateString("en-NG", { day: "numeric", month: "short" })} – ${t.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}`;
    }
    case "Monthly":
      return now.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
    case "Yearly":
      return String(now.getFullYear());
  }
}

// ── Formatting helpers ────────────────────────────────────────────────────────
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
  // Build a self-contained printable HTML document and open it in a new tab.
  // The user hits Ctrl+P / Cmd+P → Save as PDF. No third-party library needed.
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
  if (win) {
    win.document.write(html);
    win.document.close();
  }
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
  const [allOrders,  setAllOrders]  = useState<any[]>([]);   // unfiltered copy for export
  const [loading,    setLoading]    = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 7, total: 0, pages: 1 });

  const [filters,         setFilters]         = useState({ name: "", vendor: "", rider: "", zone: "" });
  const [period,          setPeriod]          = useState<Period>("Daily");
  const [showPeriodDrop,  setShowPeriodDrop]  = useState(false);
  const [showExportDrop,  setShowExportDrop]  = useState(false);

  const periodRef  = useRef<HTMLDivElement>(null);
  const exportRef  = useRef<HTMLDivElement>(null);

  const [deleteId,  setDeleteId]  = useState<string | null>(null);
  const [deleting,  setDeleting]  = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node))  setShowPeriodDrop(false);
      if (exportRef.current && !exportRef.current.contains(e.target as Node))  setShowExportDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Response shape extractors ──────────────────────────────────────────────
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

  // ── Fetch — sends dateFrom/dateTo computed from the selected period ─────────
  const fetchOrders = useCallback(async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const { dateFrom, dateTo } = getDateRange(period);

      const params: any = {
        page,
        limit:    pagination.limit,
        dateFrom,
        dateTo,
      };
      if (currentFilters.name)   params.name   = currentFilters.name;
      if (currentFilters.vendor) params.vendor  = currentFilters.vendor;
      if (currentFilters.rider)  params.rider   = currentFilters.rider;
      if (currentFilters.zone)   params.zone    = currentFilters.zone;

      const res: any = await itService.getOrders(params);
      const rows = extractRows(res);
      setOrders(rows);
      setPagination(extractPagination(res, pagination.limit));

      // For export: fetch all pages if total > limit, but cap at 500 to avoid abuse
      const pag = extractPagination(res, pagination.limit);
      if (pag.total <= pagination.limit) {
        setAllOrders(rows);
      } else if (pag.total <= 500) {
        const allRes: any = await itService.getOrders({ ...params, page: 1, limit: pag.total });
        setAllOrders(extractRows(allRes));
      } else {
        // Too many — export only current page
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

  // Re-fetch whenever period changes — date range recalculates automatically
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

  const grouped  = groupByDate(orders);
  const dateKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{periodLabel(period)}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExportDrop(p => !p)}
              disabled={allOrders.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-40"
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showExportDrop ? "rotate-180" : ""}`} />
            </button>
            {showExportDrop && (
              <div className="absolute right-0 mt-1 w-44 bg-white border rounded-lg shadow-lg py-1 z-20">
                <button
                  onClick={() => { exportCSV(allOrders, period); setShowExportDrop(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  📄 Download CSV
                </button>
                <button
                  onClick={() => { exportPDF(allOrders, period); setShowExportDrop(false); }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  🖨 Print / Save PDF
                </button>
              </div>
            )}
          </div>

          {/* Period dropdown */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => setShowPeriodDrop(p => !p)}
              className="flex items-center gap-2 px-4 py-2 bg-[#98ef9b] text-[#1a3f1c] rounded-lg text-sm font-semibold hover:bg-[#7de07f] transition-colors shadow-sm"
            >
              <span>{period}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showPeriodDrop ? "rotate-180" : ""}`} />
            </button>
            {showPeriodDrop && (
              <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg py-1 z-10">
                {(["Daily","Weekly","Monthly","Yearly"] as Period[]).map(p => (
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
      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {[
            { key: "name",   label: "Name",   placeholder: "Search by name"   },
            { key: "vendor", label: "Vendor", placeholder: "Search by vendor" },
            { key: "rider",  label: "Rider",  placeholder: "Search by rider"  },
            { key: "zone",   label: "Zone",   placeholder: "Search by zone"   },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>
              <Input
                value={filters[key as keyof typeof filters]}
                onChange={e => setFilters(f => ({ ...f, [key]: e.target.value }))}
                placeholder={placeholder}
                className="h-9"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={handleSearch} style={{ backgroundColor: "#1a3f1c" }}
            className="text-white hover:opacity-90 h-9 px-5">
            Search
          </Button>
          <Button onClick={handleReset} variant="outline" className="h-9 px-5">
            Reset
          </Button>
          <Button
            onClick={() => router.push("/it/orders/create")}
            style={{ backgroundColor: "#4a7c4e" }}
            className="text-white hover:opacity-90 h-9 px-5 ml-auto"
          >
            Create Order
          </Button>
        </div>
      </div>

      {/* ── Order count badge ── */}
      {!loading && (
        <p className="text-sm text-gray-500">
          {pagination.total > 0
            ? `Showing ${orders.length} of ${pagination.total} order${pagination.total !== 1 ? "s" : ""} for ${period.toLowerCase()} period`
            : `No orders found for this ${period.toLowerCase()} period`
          }
        </p>
      )}

      {/* ── Orders grouped by date ── */}
      <div className="space-y-4">
        {loading ? (
          <>
            <div className="h-4 bg-gray-200 rounded w-40 animate-pulse" />
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400 bg-white rounded-xl border">
            <p className="text-lg font-medium">No orders this {period.toLowerCase()}</p>
            <p className="text-sm mt-1">{periodLabel(period)}</p>
          </div>
        ) : (
          dateKeys.map(dateKey => (
            <div key={dateKey}>
              <p className="text-sm font-bold text-gray-700 mb-2 mt-2">{formatGroupDate(dateKey)}</p>
              {grouped[dateKey].map((order: any) => {
                const id         = order._id ?? order.id;
                const name       = resolveOrderName(order);
                const vendorName = resolveVendorName(order);
                const riderName  = resolveRiderName(order);
                const total      = order.totalFee ?? order.total ?? order.totalPrice ?? 0;
                const image      = resolveImage(order);

                return (
                  <div key={id}
                    className="flex items-center gap-3 bg-[#98ef9b] rounded-xl p-3 mb-2 hover:bg-[#8de08f] transition-colors">
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

                    {/* Vendor & Rider — hidden on mobile */}
                    <div className="hidden sm:block text-right text-xs text-[#1a3f1c]/80 space-y-0.5 mr-2">
                      <p><span className="font-medium">Vendor:</span> {vendorName}</p>
                      <p><span className="font-medium">Rider:</span> {riderName}</p>
                    </div>

                    {/* Actions */}
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