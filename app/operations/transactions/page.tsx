"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  CalendarIcon, Download, Loader2, RefreshCw,
  CheckCircle2, XCircle, Clock, TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/utils/exportCSV";

// ── helpers ───────────────────────────────────────────────────────────────────

function fmt(n: any): string {
  return `₦${Number(n ?? 0).toLocaleString()}`;
}

function formatTime(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-NG", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "").toLowerCase();
  const cfg =
    s === "success"  ? { cls: "bg-green-100 text-green-700 border-green-300",  label: "Successful" } :
    s === "failed"   ? { cls: "bg-red-100 text-red-600 border-red-300",         label: "Failed"     } :
    s === "pending"  ? { cls: "bg-yellow-100 text-yellow-700 border-yellow-300",label: "Pending"    } :
                       { cls: "bg-gray-100 text-gray-600 border-gray-300",       label: status       };
  return (
    <span className={`inline-block text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function StatCard({
  icon, label, value, sub, color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <Card className="glass-card hover-lift border border-border/50 shadow-sm rounded-2xl">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-tight break-all">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-border/30">
      {[1,2,3,4,5,6,7].map(i => (
        <td key={i} className="px-4 py-3">
          <div className="h-3 bg-muted/50 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

const STATUS_TABS = [
  { label: "All",         value: "all"     },
  { label: "Successful",  value: "success" },
  { label: "Pending",     value: "pending" },
  { label: "Failed",      value: "failed"  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OperationsTransactionsPage() {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });

  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats,        setStats]        = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [exporting,    setExporting]    = useState(false);
  const [activeTab,    setActiveTab]    = useState("all");
  const [pagination,   setPagination]   = useState({ page: 1, total: 0, pages: 1, limit: 15 });

  const [filters, setFilters] = useState({
    search:   "",
    dateFrom: undefined as Date | undefined,
    dateTo:   undefined as Date | undefined,
  });

  const fetchStats = useCallback(async (f = filters) => {
    setStatsLoading(true);
    try {
      const params: any = {};
      if (f.dateFrom) params.startDate = f.dateFrom.toISOString();
      if (f.dateTo)   params.endDate   = f.dateTo.toISOString();
      const res: any = await operationsService.getTransactionStats(params);
      setStats(res?.data ?? res);
    } catch {
      // stats are non-critical, fail silently
    } finally {
      setStatsLoading(false);
    }
  }, [filters]);

  const fetchTransactions = useCallback(async (page = 1, tab = activeTab, f = filters, limit = pagination.limit) => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page, limit };
      if (tab !== "all") params.status    = tab;
      if (f.search)      params.search    = f.search;
      if (f.dateFrom)    params.startDate = f.dateFrom.toISOString();
      if (f.dateTo)      params.endDate   = f.dateTo.toISOString();

      const res: any = await operationsService.getTransactions(params);
      setTransactions(Array.isArray(res?.data) ? res.data : []);
      setPagination({
        page:  res?.page  ?? 1,
        pages: res?.pages ?? res?.totalPages ?? 1,
        total: res?.total ?? 0,
        limit,
      });
    } catch (err: any) {
      const msg = err?.message || "Failed to load transactions";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [activeTab, filters, pagination.limit]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const params: any = { limit: 10000 };
      if (activeTab !== "all") params.status    = activeTab;
      if (filters.search)      params.search    = filters.search;
      if (filters.dateFrom)    params.startDate = filters.dateFrom.toISOString();
      if (filters.dateTo)      params.endDate   = filters.dateTo.toISOString();

      const res: any = await operationsService.getTransactions(params);
      const data = Array.isArray(res?.data) ? res.data : [];

      downloadCSV(
        data.map((t: any) => ({
          "Reference":        t.reference   ?? "—",
          "Order ID":         t.orderId     ?? "—",
          "Customer":         t.customerName ?? "Unknown",
          "Vendor":           t.vendorName  ?? "—",
          "Amount (NGN)":     t.amount      ?? 0,
          "Delivery Fee":     t.deliveryFee ?? 0,
          "Total (NGN)":      t.total       ?? 0,
          "Payment Method":   t.paymentMethod ?? "—",
          "Status":           t.status      ?? "—",
          "Date":             t.createdAt ? new Date(t.createdAt).toLocaleString("en-NG") : "—",
        })),
        `transactions_${new Date().toISOString().slice(0, 10)}`,
      );
      toast.success("CSV exported");
    } catch {
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (!shouldRender) return;
    fetchStats();
    fetchTransactions(1, activeTab, filters);
  }, [shouldRender]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    fetchTransactions(1, tab, filters);
  };

  const handleSearch = () => {
    fetchStats(filters);
    fetchTransactions(1, activeTab, filters);
  };

  const handleReset = () => {
    const cleared = { search: "", dateFrom: undefined, dateTo: undefined };
    setFilters(cleared);
    setActiveTab("all");
    fetchStats(cleared);
    fetchTransactions(1, "all", cleared);
  };

  if (!shouldRender || Reloading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#1a3f1c]" />
        <p className="text-sm text-gray-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Transactions</h1>
          <p className="text-xs text-gray-400 mt-0.5">All payment activity across the platform</p>
        </div>
        <Button
          onClick={handleExport}
          disabled={exporting || loading || transactions.length === 0}
          className="bg-[#1a3f1c] text-white hover:bg-[#1a3f1c]/90 h-10 px-6 font-bold rounded-xl flex items-center gap-2"
        >
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export CSV
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          label="Total Revenue"
          value={statsLoading ? "—" : fmt(stats?.totalRevenue)}
          sub={statsLoading ? "" : `${stats?.successful ?? 0} successful`}
          color="bg-[#1a3f1c]"
        />
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-white" />}
          label="Successful"
          value={statsLoading ? "—" : (stats?.successful ?? 0).toLocaleString()}
          color="bg-green-600"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-white" />}
          label="Pending"
          value={statsLoading ? "—" : (stats?.pending ?? 0).toLocaleString()}
          color="bg-yellow-500"
        />
        <StatCard
          icon={<XCircle className="h-5 w-5 text-white" />}
          label="Failed"
          value={statsLoading ? "—" : (stats?.failed ?? 0).toLocaleString()}
          color="bg-red-500"
        />
      </div>

      {/* Filters */}
      <Card className="border border-border/50 shadow-sm rounded-2xl bg-surface">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]/50 mb-1.5 block">Search</Label>
              <Input
                value={filters.search}
                onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                placeholder="Reference, customer name…"
                className="h-10 rounded-xl"
                onKeyDown={e => e.key === "Enter" && handleSearch()}
              />
            </div>

            {(["From", "To"] as const).map(lbl => {
              const key = lbl === "From" ? "dateFrom" : "dateTo";
              return (
                <div key={lbl}>
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]/50 mb-1.5 block">{lbl}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full h-10 rounded-xl justify-start font-normal">
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

          <div className="flex gap-3 justify-end border-t border-border/50 pt-4">
            <Button onClick={handleSearch} className="bg-primary hover:opacity-90 text-white h-10 px-8 font-black rounded-xl">Search</Button>
            <Button onClick={handleReset} variant="outline" className="border-border text-[#1a3f1c] h-10 px-8 font-black rounded-xl">Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            type="button"
            key={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === tab.value
                ? "bg-[#1a3f1c] text-white"
                : "bg-[#98ef9b]/40 text-[#1a3f1c] hover:bg-[#98ef9b]/70"
            }`}
          >
            {tab.label}
            {tab.value !== "all" && stats && !statsLoading && (
              <span className="ml-1.5 text-[10px] opacity-80">
                ({tab.value === "success" ? stats.successful : tab.value === "failed" ? stats.failed : stats.pending})
              </span>
            )}
          </button>
        ))}
        {!loading && !error && (
          <span className="ml-auto text-sm text-gray-400 self-center">
            {pagination.total > 0 ? `${pagination.total} record${pagination.total !== 1 ? "s" : ""}` : "No records"}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="modern-table-container">
        <div className="overflow-x-auto">
          <table className="modern-table min-w-[800px]">
            <thead>
              <tr>
                {["Reference", "Order ID", "Customer", "Vendor", "Amount", "Method", "Status", "Date"].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>{[0,1,2,3,4].map(i => <SkeletonRow key={i} />)}</>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <p className="text-red-500 font-medium mb-3">{error}</p>
                    <Button onClick={() => fetchTransactions(1)} className="bg-[#1a3f1c] text-white gap-2">
                      <RefreshCw className="h-4 w-4" /> Retry
                    </Button>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400">
                    <p className="text-base font-medium">No transactions found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or date range</p>
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any, i: number) => (
                  <tr key={tx.id ?? tx.reference ?? i}>
                    <td className="font-mono text-[11px] text-gray-600 whitespace-nowrap max-w-[160px] truncate" title={tx.reference}>
                      {tx.reference ?? "—"}
                    </td>
                    <td className="text-xs text-gray-700 font-medium">
                      {tx.orderId ?? "—"}
                    </td>
                    <td className="text-xs text-gray-800 font-bold max-w-[140px] truncate">
                      <div>{tx.customerName ?? "Unknown"}</div>
                      {tx.customerPhone && tx.customerPhone !== "—" && (
                        <div className="text-[10px] text-gray-400 font-normal mt-0.5">{tx.customerPhone}</div>
                      )}
                    </td>
                    <td className="text-xs text-gray-700 max-w-[130px] truncate">
                      {tx.vendorName ?? "—"}
                    </td>
                    <td className="whitespace-nowrap">
                      <div className="text-xs font-black text-[#1a3f1c]">{fmt(tx.amount)}</div>
                      {tx.deliveryFee > 0 && (
                        <div className="text-[10px] text-gray-400 font-semibold">+{fmt(tx.deliveryFee)} delivery</div>
                      )}
                    </td>
                    <td className="text-xs text-gray-600 whitespace-nowrap font-medium">
                      {tx.paymentMethod ?? "Card"}
                    </td>
                    <td className="whitespace-nowrap">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="text-[11px] text-gray-500 whitespace-nowrap font-medium">
                      {formatTime(tx.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !error && pagination.total > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          pageSize={pagination.limit}
          onPageChange={p => fetchTransactions(p, activeTab, filters, pagination.limit)}
          onPageSizeChange={size => {
            setPagination(prev => ({ ...prev, limit: size, page: 1 }));
            fetchTransactions(1, activeTab, filters, size);
          }}
        />
      )}
    </div>
  );
}
