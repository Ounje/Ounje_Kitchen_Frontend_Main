'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Search, RefreshCw, CheckCircle, Clock, XCircle, Loader, Ban } from 'lucide-react';
import financeService, { type PayoutItem, type PayoutStats, type PayoutFilters } from '@/lib/api/services/finance.service';
import Pagination from '@/components/Pagination';

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:    { label: 'Pending',    icon: Clock,         bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200'  },
  processing: { label: 'Processing', icon: Loader,        bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  success:    { label: 'Success',    icon: CheckCircle,   bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  failed:     { label: 'Failed',     icon: XCircle,       bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
  cancelled:  { label: 'Cancelled',  icon: Ban,           bg: 'bg-gray-50',   text: 'text-gray-500',   border: 'border-gray-200'   },
};

function StatusBadge({ status }: { status: PayoutItem['status'] }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, count, amount, accent = false }: { label: string; count: number; amount: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 shadow-sm'}`}>
      <p className={`text-xs font-semibold mb-1 ${accent ? 'text-amber-700' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-2xl font-black ${accent ? 'text-amber-800' : 'text-gray-900'}`}>{count.toLocaleString()}</p>
      <p className={`text-xs mt-1 ${accent ? 'text-amber-600' : 'text-gray-400'}`}>₦{amount.toLocaleString()}</p>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PayoutsPage() {
  const [payouts,    setPayouts]    = useState<PayoutItem[]>([]);
  const [stats,      setStats]      = useState<PayoutStats | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pageSize,   setPageSize]   = useState(20);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [filters, setFilters] = useState<PayoutFilters>({ status: '', recipientType: '', startDate: '', endDate: '' });
  const [activeFilters, setActiveFilters] = useState<PayoutFilters>({});

  const loadPayouts = useCallback(async (page: number, f: PayoutFilters, limit = pageSize) => {
    setLoading(true);
    try {
      const params: PayoutFilters = { page, limit };
      if (f.status)        params.status        = f.status;
      if (f.recipientType) params.recipientType = f.recipientType;
      if (f.startDate)     params.startDate     = f.startDate;
      if (f.endDate)       params.endDate       = f.endDate;

      const res: any = await financeService.getPayouts(params);
      const data     = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setPayouts(data);
      setPagination({
        page:       res?.page       ?? page,
        totalPages: res?.totalPages ?? 1,
        total:      res?.total      ?? data.length,
      });
    } catch {
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const s = await financeService.getPayoutStats();
      setStats(s);
    } catch {
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayouts(1, {});
    loadStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setActiveFilters(filters);
    loadPayouts(1, filters);
  };

  const handleReset = () => {
    const empty: PayoutFilters = { status: '', recipientType: '', startDate: '', endDate: '' };
    setFilters(empty);
    setActiveFilters({});
    loadPayouts(1, {});
  };

  const fmt = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Payouts</h1>
        <p className="text-sm text-gray-400 mt-1">
          Tracks the actual bank transfers sent to vendors and riders via Paystack. This runs automatically — no approval needed. Use this page to monitor what's pending, in progress, or failed.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {statsLoading ? (
          [...Array(5)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-gray-100 animate-pulse" />)
        ) : stats ? (
          <>
            <StatCard label="Pending"    count={stats.pending.count}    amount={stats.pending.totalNaira}    accent />
            <StatCard label="Processing" count={stats.processing.count} amount={stats.processing.totalNaira} />
            <StatCard label="Success"    count={stats.success.count}    amount={stats.success.totalNaira}    />
            <StatCard label="Failed"     count={stats.failed.count}     amount={stats.failed.totalNaira}     />
            <StatCard label="Cancelled"  count={stats.cancelled.count}  amount={stats.cancelled.totalNaira}  />
          </>
        ) : null}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">

        {/* Status */}
        <div>
          <label htmlFor="pay-status" className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select id="pay-status" title="Filter by status"
            value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Recipient type */}
        <div>
          <label htmlFor="pay-type" className="block text-xs font-medium text-gray-500 mb-1">Type</label>
          <select id="pay-type" title="Filter by recipient type"
            value={filters.recipientType} onChange={e => setFilters(f => ({ ...f, recipientType: e.target.value }))}
            className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]">
            <option value="">All</option>
            <option value="VendorProfile">Vendors</option>
            <option value="RiderProfile">Riders</option>
          </select>
        </div>

        {/* Date range */}
        <div>
          <label htmlFor="pay-start" className="block text-xs font-medium text-gray-500 mb-1">From</label>
          <input id="pay-start" type="date" title="Start date"
            value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
            className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]" />
        </div>
        <div>
          <label htmlFor="pay-end" className="block text-xs font-medium text-gray-500 mb-1">To</label>
          <input id="pay-end" type="date" title="End date"
            value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
            className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]" />
        </div>

        <button type="button" onClick={handleSearch}
          className="h-9 px-4 rounded-lg bg-[#1a3f1c] text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Search className="w-3.5 h-3.5" /> Search
        </button>
        <button type="button" onClick={handleReset}
          className="h-9 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Table */}
      <div className="modern-table-container">
        <div className="overflow-x-auto">
          <table className="modern-table min-w-200">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Net (after fee)</th>
                <th>Bank</th>
                <th>Account No.</th>
                <th>Status</th>
                <th>Process At</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(9)].map((_, j) => (
                      <td key={j}><div className="h-4 bg-gray-100 rounded-full w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16 text-center">
                    <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No payouts found</p>
                  </td>
                </tr>
              ) : payouts.map(p => (
                <tr key={p._id}>
                  <td className="font-semibold text-gray-900">{p.recipientName}</td>
                  <td>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      p.recipientType === 'VendorProfile'
                        ? 'bg-[#98ef9b]/30 text-[#1a3f1c]'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {p.recipientType === 'VendorProfile' ? 'Vendor' : 'Rider'}
                    </span>
                  </td>
                  <td className="font-medium tabular-nums">{fmt(p.amountNaira)}</td>
                  <td className="text-gray-700 tabular-nums">{fmt(p.netAmountNaira)}</td>
                  <td className="text-gray-500 max-w-32 truncate">{p.bankDetails?.bankName || '—'}</td>
                  <td className="text-gray-500 tabular-nums">{p.bankDetails?.accountNumber || '—'}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="text-gray-500 whitespace-nowrap text-xs">
                    {p.processAt ? new Date(p.processAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="text-gray-500 whitespace-nowrap text-xs">
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pageSize}
          onPageChange={p => loadPayouts(p, activeFilters)}
          onPageSizeChange={s => { setPageSize(s); loadPayouts(1, activeFilters, s); }}
        />
      </div>
    </div>
  );
}
