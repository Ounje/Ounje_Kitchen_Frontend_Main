'use client';

import { useState, useCallback, useEffect } from 'react';
import { FinanceFilters, type FinanceFilterValues } from '@/components/finance/FinanceFilters';
import { TransactionList } from '@/components/finance/TransactionList';
import { TransactionInfoModal } from '@/components/finance/TransactionInfoModal';
import Pagination from '@/components/Pagination';
import financeService, {
  type TransactionFilters,
  type TransactionGroup,
  type TransactionDetail,
} from '@/lib/api/services/finance.service';

const todayStr   = () => new Date().toISOString().split('T')[0];
const sevenDaysAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().split('T')[0];
};

export default function TransactionsPage() {
  const [groups, setGroups]         = useState<TransactionGroup[]>([]);
  const [loading, setLoading]       = useState(false);
  const [filters, setFilters]       = useState<TransactionFilters>({
    page: 1, limit: 10,
    startDate: sevenDaysAgo(),
    endDate:   todayStr(),
  });
  const [pageSize, setPageSize]     = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalDetail, setModalDetail]   = useState<TransactionDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Load on mount with last 7 days
  useEffect(() => { load(filters); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const load = useCallback(async (f: TransactionFilters, limit = pageSize) => {
    setLoading(true);
    try {
      const res: any = await financeService.getTransactions({ ...f, limit });

      // Unwrap whichever shape the backend returns
      const list: TransactionGroup[] =
        Array.isArray(res)              ? res            :
        Array.isArray(res?.data)        ? res.data       :
        Array.isArray(res?.transactions)? res.transactions :
        [];

      setGroups(list);

      // totalPages may be flat on the root or inside a pagination object
      const pages: number =
        res?.totalPages            ??
        res?.pagination?.pages     ??
        res?.pagination?.totalPages ??
        1;

      setTotalPages(pages);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const handleSearch = (v: FinanceFilterValues) => {
    const f: TransactionFilters = {
      name:      v.name      || undefined,
      role:      (v.role     || undefined) as TransactionFilters['role'],
      startDate: v.startDate || undefined,
      endDate:   v.endDate   || undefined,
      page: 1,
      limit: pageSize,
    };
    setFilters(f);
    load(f);
  };

  const handleExport = async () => {
    try {
      // exportTransactionsCSV returns unknown from apiClient — cast to Blob
      const res = await financeService.exportTransactionsCSV({
        name:      filters.name,
        role:      filters.role,
        startDate: filters.startDate,
        endDate:   filters.endDate,
      });

      // apiClient may return a Blob directly or wrap it; handle both
      const blob: Blob =
        res instanceof Blob   ? res              :
        (res as any)?.data instanceof Blob ? (res as any).data :
        new Blob([JSON.stringify(res)], { type: 'text/csv' });

      const url = URL.createObjectURL(blob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Export failed silently — optionally add a toast here
    }
  };

  const handlePageChange = (page: number) => {
    const f = { ...filters, page };
    setFilters(f);
    load(f);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    const f = { ...filters, page: 1, limit: size };
    setFilters(f);
    load(f, size);
  };

  const openInfo = async (id: string) => {
    setModalOpen(true);
    setModalDetail(null);
    setModalLoading(true);
    try {
      const res = await financeService.getTransactionDetail(id);
      setModalDetail(res as TransactionDetail);
    } finally {
      setModalLoading(false);
    }
  };

  const handlePrint = async (id: string) => {
    await openInfo(id);
    // User clicks Download Slip inside the modal to print
  };

  return (
    <div className="w-full space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Transactions</h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1">Review and manage financial records across portals.</p>
      </div>

      <FinanceFilters
        onSearch={handleSearch}
        onExport={handleExport}
        initialValues={{ startDate: sevenDaysAgo(), endDate: todayStr() }}
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/50 animate-pulse border border-border" />
          ))}
        </div>
      ) : (
        <TransactionList groups={groups} onInfo={openInfo} onPrint={handlePrint} />
      )}

      {/* Pagination — only shown when there is more than one page */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={filters.page ?? 1}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      <TransactionInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        detail={modalDetail}
        loading={modalLoading}
      />
    </div>
  );
}