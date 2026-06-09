'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Users, Store, Bike, Wallet } from 'lucide-react';
import financeService, {
  type WalletBalanceItem,
  type WalletBalanceFilters,
  type WalletAccountType,
  type WalletOverview,
} from '@/lib/api/services/finance.service';
import Pagination from '@/components/Pagination';

const fmt = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard({ label, available, pending, hold, accent = false }: {
  label: string; available: number; pending: number; hold?: number; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? 'bg-[#98ef9b]/20 border-[#1a3f1c]/20' : 'bg-white border-gray-100 shadow-sm'}`}>
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      <p className={`text-xl font-black ${accent ? 'text-[#1a3f1c]' : 'text-gray-900'}`}>{fmt(available)}</p>
      <p className="text-xs text-gray-400 mt-1">Available</p>
      <div className="mt-2 flex gap-3 text-xs text-gray-500">
        <span>Pending: <span className="font-semibold text-amber-600">{fmt(pending)}</span></span>
        {hold !== undefined && <span>Hold: <span className="font-semibold text-blue-600">{fmt(hold)}</span></span>}
      </div>
    </div>
  );
}

// ── Tab content ───────────────────────────────────────────────────────────────
function BalancesTable({ accountType }: { accountType: WalletAccountType }) {
  const [rows,      setRows]      = useState<WalletBalanceItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [pageSize,  setPageSize]  = useState(20);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search,    setSearch]    = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const load = useCallback(async (page: number, searchVal: string, limit = pageSize) => {
    setLoading(true);
    try {
      const filters: WalletBalanceFilters = { type: accountType, page, limit };
      if (searchVal) filters.search = searchVal;
      const res: any = await financeService.getWalletBalances(filters);
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setRows(data);
      setPagination({ page: res?.page ?? page, totalPages: res?.totalPages ?? 1, total: res?.total ?? data.length });
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [accountType, pageSize]);

  useEffect(() => {
    setSearch('');
    setActiveSearch('');
    load(1, '');
  }, [accountType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setActiveSearch(search);
    load(1, search);
  };

  const handleReset = () => {
    setSearch('');
    setActiveSearch('');
    load(1, '');
  };

  const showHold = accountType !== 'CUSTOMER';
  const placeholder = accountType === 'CUSTOMER' ? 'Search customer...'
    : accountType === 'VENDOR' ? 'Search vendor...' : 'Search rider...';

  return (
    <div className="space-y-4">

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
          <input
            type="text"
            placeholder={placeholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449] w-56"
          />
        </div>
        <button type="button" onClick={handleSearch}
          className="h-9 px-4 rounded-lg bg-[#1a3f1c] text-white text-sm font-semibold flex items-center gap-2 hover:opacity-90">
          <Search className="w-3.5 h-3.5" /> Search
        </button>
        <button type="button" onClick={handleReset}
          className="h-9 px-4 rounded-lg border border-gray-200 text-gray-600 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </button>
        {pagination.total > 0 && (
          <span className="text-xs text-gray-400 ml-auto self-center">
            {pagination.total.toLocaleString()} {accountType.toLowerCase()}s
          </span>
        )}
      </div>

      {/* Table */}
      <div className="modern-table-container">
        <div className="overflow-x-auto">
          <table className="modern-table min-w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Available Balance</th>
                <th>Pending Balance</th>
                {showHold && <th>Hold Balance</th>}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(showHold ? 5 : 4)].map((_, j) => (
                      <td key={j}><div className="h-4 bg-gray-100 rounded-full w-3/4" /></td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={showHold ? 5 : 4} className="py-16 text-center">
                    <Wallet className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">
                      {activeSearch ? `No results for "${activeSearch}"` : 'No wallet accounts found'}
                    </p>
                  </td>
                </tr>
              ) : rows.map(r => {
                const total = (r.availableBalance ?? 0) + (r.pendingBalance ?? 0) + (r.holdBalance ?? 0);
                return (
                  <tr key={r._id}>
                    <td className="font-semibold text-gray-900">{r.name}</td>
                    <td className="tabular-nums font-medium text-[#1a3f1c]">{fmt(r.availableBalance)}</td>
                    <td className="tabular-nums text-amber-600">{fmt(r.pendingBalance)}</td>
                    {showHold && <td className="tabular-nums text-blue-600">{fmt(r.holdBalance)}</td>}
                    <td className="tabular-nums font-bold text-gray-800">{fmt(total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pageSize}
          onPageChange={p => load(p, activeSearch)}
          onPageSizeChange={s => { setPageSize(s); load(1, activeSearch, s); }}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WalletBalancesPage() {
  const [overview,        setOverview]        = useState<WalletOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<WalletAccountType>('CUSTOMER');

  useEffect(() => {
    financeService.getWalletOverview()
      .then(setOverview)
      .catch(() => setOverview(null))
      .finally(() => setOverviewLoading(false));
  }, []);

  const tabs: { key: WalletAccountType; label: string; icon: any }[] = [
    { key: 'CUSTOMER', label: 'Customers', icon: Users  },
    { key: 'VENDOR',   label: 'Vendors',   icon: Store  },
    { key: 'RIDER',    label: 'Riders',    icon: Bike   },
  ];

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Wallet Balances</h1>
        <p className="text-sm text-gray-400 mt-1">
          Current wallet balances for every customer, vendor, and rider on the platform.
        </p>
      </div>

      {/* Overview summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {overviewLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />)
        ) : overview ? (
          <>
            <SummaryCard
              label="All Customer Wallets"
              available={overview.platform?.availableBalance ?? 0}
              pending={overview.platform?.pendingBalance ?? 0}
            />
            <SummaryCard
              label="All Vendor Wallets"
              available={overview.vendors?.availableBalance ?? 0}
              pending={overview.vendors?.pendingBalance ?? 0}
              hold={overview.vendors?.holdBalance ?? 0}
              accent
            />
            <SummaryCard
              label="All Rider Wallets"
              available={overview.riders?.availableBalance ?? 0}
              pending={overview.riders?.pendingBalance ?? 0}
              hold={overview.riders?.holdBalance ?? 0}
            />
          </>
        ) : null}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                activeTab === t.key
                  ? 'border-[#1a3f1c] text-[#1a3f1c]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <BalancesTable accountType={activeTab} />
    </div>
  );
}
