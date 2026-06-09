'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, RefreshCw, Users, Store, Bike, Wallet, X, ArrowUpCircle, ArrowDownCircle, CreditCard } from 'lucide-react';
import financeService, {
  type WalletBalanceItem,
  type WalletBalanceFilters,
  type WalletAccountType,
  type WalletOverview,
  type WalletHistoryResponse,
  type WalletLedgerEntry,
} from '@/lib/api/services/finance.service';
import Pagination from '@/components/Pagination';

const fmt = (n: number) => `₦${(n ?? 0).toLocaleString()}`;

// ── Reason label map ──────────────────────────────────────────────────────────
const REASON_LABEL: Record<string, string> = {
  ORDER_EARNING:         'Order Earning',
  COMMISSION:            'Commission',
  PAYOUT:                'Withdrawal',
  PAYOUT_PENDING:        'Withdrawal (Pending)',
  ADJUSTMENT:            'Adjustment',
  REFUND:                'Refund',
  REVERSAL:              'Reversal',
  DELIVERY_FEE_HOLD:     'Delivery Fee Hold',
  VENDOR_EARNING_HOLD:   'Vendor Earning Hold',
  WALLET_PAYMENT:        'Wallet Payment',
  WALLET_TOPUP:          'Wallet Top-up',
  DVA_TRANSFER:          'Bank Transfer (DVA)',
  VENDOR_ORDER_PENDING:  'Order Earning (Pending)',
  BANK_PAYMENT:          'Bank / Card Payment',
};

// ── Summary card ──────────────────────────────────────────────────────────────
function SummaryCard({ label, available, pending, hold, accent = false }: {
  label: string; available: number; pending: number; hold?: number; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border ${accent ? 'bg-[#98ef9b]/20 border-[#1a3f1c]/20' : 'bg-white border-gray-100 shadow-sm'}`}>
      <p className="text-xs font-semibold text-gray-500 mb-2">{label}</p>
      <p className={`text-xl font-black ${accent ? 'text-[#1a3f1c]' : 'text-gray-900'}`}>{fmt(available)}</p>
      <p className="text-xs text-gray-400 mt-1">Available</p>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
        <span>Pending: <span className="font-semibold text-amber-600">{fmt(pending)}</span></span>
        {hold !== undefined && <span>Hold: <span className="font-semibold text-blue-600">{fmt(hold)}</span></span>}
      </div>
    </div>
  );
}

function BankCard({ total, count }: { total: number; count: number }) {
  return (
    <div className="rounded-xl p-4 border bg-blue-50 border-blue-200">
      <p className="text-xs font-semibold text-blue-700 mb-2">Total Bank / Card Payments</p>
      <p className="text-xl font-black text-blue-900">{fmt(total)}</p>
      <p className="text-xs text-blue-500 mt-1">Customers paying via Paystack</p>
      <p className="text-xs text-blue-400 mt-2">{count.toLocaleString()} transactions</p>
    </div>
  );
}

// ── Transaction history modal ─────────────────────────────────────────────────
function HistoryModal({
  item, accountType, onClose,
}: { item: WalletBalanceItem; accountType: WalletAccountType; onClose: () => void }) {
  const [history,  setHistory]  = useState<WalletHistoryResponse | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [bankTab,  setBankTab]  = useState(false);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await financeService.getWalletHistory(item._id, accountType, p, 15);
      setHistory(res);
    } catch {
      setHistory(null);
    } finally {
      setLoading(false);
    }
  }, [item._id, accountType]);

  useEffect(() => { load(1); }, [load]);

  const rows: WalletLedgerEntry[] = bankTab
    ? (history?.bank ?? [])
    : (history?.ledger ?? []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Available: <span className="font-semibold text-[#1a3f1c]">{fmt(item.availableBalance)}</span>
              {item.pendingBalance > 0 && <> · Pending: <span className="font-semibold text-amber-600">{fmt(item.pendingBalance)}</span></>}
              {item.holdBalance > 0 && <> · Hold: <span className="font-semibold text-blue-600">{fmt(item.holdBalance)}</span></>}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs — only for customers */}
        {accountType === 'CUSTOMER' && (
          <div className="flex gap-1 px-6 pt-3">
            <button type="button" onClick={() => setBankTab(false)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${!bankTab ? 'bg-[#1a3f1c] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              <Wallet className="w-3.5 h-3.5 inline mr-1.5" />Wallet Activity
            </button>
            <button type="button" onClick={() => setBankTab(true)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${bankTab ? 'bg-[#1a3f1c] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              <CreditCard className="w-3.5 h-3.5 inline mr-1.5" />Bank / Card
            </button>
          </div>
        )}

        {/* Entries */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {loading ? (
            [...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />)
          ) : rows.length === 0 ? (
            <div className="py-16 text-center">
              <Wallet className="h-8 w-8 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No transactions found</p>
            </div>
          ) : rows.map(e => {
            const isCredit = e.entryType === 'CREDIT';
            return (
              <div key={e._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors">
                <div className="flex items-center gap-3">
                  {isCredit
                    ? <ArrowUpCircle className="w-5 h-5 text-green-500 shrink-0" />
                    : <ArrowDownCircle className="w-5 h-5 text-red-400 shrink-0" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {REASON_LABEL[e.reason] ?? e.reason}
                    </p>
                    <p className="text-xs text-gray-400">
                      {e.createdAt ? new Date(e.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                      {e.reference && <> · <span className="font-mono">{e.reference}</span></>}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold tabular-nums ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
                    {isCredit ? '+' : '-'}{fmt(e.amount)}
                  </p>
                  {e.balanceAfter != null && (
                    <p className="text-xs text-gray-400">Bal: {fmt(e.balanceAfter)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination — wallet tab only */}
        {!bankTab && history && history.totalPages > 1 && (
          <div className="px-6 pb-4">
            <Pagination
              currentPage={page}
              totalPages={history.totalPages}
              pageSize={15}
              onPageChange={p => { setPage(p); load(p); }}
              onPageSizeChange={() => {}}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Balances table ────────────────────────────────────────────────────────────
function BalancesTable({ accountType }: { accountType: WalletAccountType }) {
  const [rows,       setRows]       = useState<WalletBalanceItem[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [pageSize,   setPageSize]   = useState(20);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [search,     setSearch]     = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selected,   setSelected]   = useState<WalletBalanceItem | null>(null);

  const load = useCallback(async (page: number, searchVal: string, limit = pageSize) => {
    setLoading(true);
    try {
      const filters: WalletBalanceFilters = { type: accountType, page, limit };
      if (searchVal) filters.search = searchVal;
      const res: any = await financeService.getWalletBalances(filters);
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setRows(data);
      setPagination({ page: res?.page ?? page, totalPages: res?.totalPages ?? 1, total: res?.total ?? data.length });
    } catch { setRows([]); }
    finally { setLoading(false); }
  }, [accountType, pageSize]);

  useEffect(() => {
    setSearch(''); setActiveSearch(''); load(1, '');
  }, [accountType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => { setActiveSearch(search); load(1, search); };
  const handleReset  = () => { setSearch(''); setActiveSearch(''); load(1, ''); };

  const showHold  = accountType !== 'CUSTOMER';
  const colCount  = showHold ? 5 : 4;
  const placeholder = accountType === 'CUSTOMER' ? 'Search customer...'
    : accountType === 'VENDOR' ? 'Search vendor...' : 'Search rider...';

  return (
    <>
      <div className="space-y-4">
        {/* Search */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
            <input type="text" placeholder={placeholder} value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="h-9 px-3 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449] w-56" />
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
                      {[...Array(colCount)].map((_, j) => (
                        <td key={j}><div className="h-4 bg-gray-100 rounded-full w-3/4" /></td>
                      ))}
                    </tr>
                  ))
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={colCount} className="py-16 text-center">
                      <Wallet className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">
                        {activeSearch ? `No results for "${activeSearch}"` : 'No wallet accounts found'}
                      </p>
                    </td>
                  </tr>
                ) : rows.map(r => {
                  const total = (r.availableBalance ?? 0) + (r.pendingBalance ?? 0) + (r.holdBalance ?? 0);
                  return (
                    <tr key={r._id} onClick={() => setSelected(r)}
                      className="cursor-pointer hover:bg-[#98ef9b]/10 transition-colors">
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

      {/* History modal */}
      {selected && (
        <HistoryModal
          item={selected}
          accountType={accountType}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WalletBalancesPage() {
  const [overview,        setOverview]        = useState<WalletOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [bankTotal,       setBankTotal]       = useState<{ totalNaira: number; count: number } | null>(null);
  const [activeTab,       setActiveTab]       = useState<WalletAccountType>('CUSTOMER');

  useEffect(() => {
    Promise.all([
      financeService.getWalletOverview().catch(() => null),
      financeService.getBankPaymentsTotal().catch(() => null),
    ]).then(([ov, bt]) => {
      setOverview(ov);
      setBankTotal(bt);
      setOverviewLoading(false);
    });
  }, []);

  const tabs: { key: WalletAccountType; label: string; icon: any }[] = [
    { key: 'CUSTOMER', label: 'Customers', icon: Users },
    { key: 'VENDOR',   label: 'Vendors',   icon: Store },
    { key: 'RIDER',    label: 'Riders',    icon: Bike  },
  ];

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Wallet Balances</h1>
        <p className="text-sm text-gray-400 mt-1">
          Live wallet balances for every customer, vendor, and rider. Click any row to see their transaction history.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewLoading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-xl bg-gray-100 animate-pulse" />)
        ) : (
          <>
            <SummaryCard
              label="All Customer Wallets"
              available={overview?.customers?.availableBalance ?? 0}
              pending={overview?.customers?.pendingBalance ?? 0}
              accent
            />
            <SummaryCard
              label="All Vendor Wallets"
              available={overview?.vendors?.availableBalance ?? 0}
              pending={overview?.vendors?.pendingBalance ?? 0}
              hold={overview?.vendors?.holdBalance ?? 0}
            />
            <SummaryCard
              label="All Rider Wallets"
              available={overview?.riders?.availableBalance ?? 0}
              pending={overview?.riders?.pendingBalance ?? 0}
              hold={overview?.riders?.holdBalance ?? 0}
            />
            <BankCard
              total={bankTotal?.totalNaira ?? 0}
              count={bankTotal?.count ?? 0}
            />
          </>
        )}
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
