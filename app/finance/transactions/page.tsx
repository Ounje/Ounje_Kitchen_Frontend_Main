"use client";

import { useState, useCallback, useEffect } from "react";
import { FinanceFilters, type FinanceFilterValues } from "@/components/finance/FinanceFilters";
import { TransactionList } from "@/components/finance/TransactionList";
import { TransactionInfoModal } from "@/components/finance/TransactionInfoModal";
import Pagination from "@/components/Pagination";
import financeService, {
  type TransactionFilters,
  type TransactionGroup,
  type TransactionDetail,
} from "@/lib/api/services/finance.service";

export default function TransactionsPage() {
  const [groups, setGroups] = useState<TransactionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 20 });
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetail, setModalDetail] = useState<TransactionDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const load = useCallback(
    async (f: TransactionFilters, limit = pageSize) => {
      setLoading(true);
      try {
        const res: any = await financeService.getTransactions({ ...f, limit });

        const list: TransactionGroup[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.transactions)
              ? res.transactions
              : [];

        setGroups(list);
        setTotal(res?.total ?? list.flatMap((g: TransactionGroup) => g.transactions).length);

        const pages: number =
          res?.totalPages ?? res?.pagination?.pages ?? res?.pagination?.totalPages ?? 1;
        setTotalPages(pages);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // Load all transactions on mount (no date filter)
  useEffect(() => {
    load(filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (v: FinanceFilterValues) => {
    const f: TransactionFilters = {
      name: v.name || undefined,
      role: (v.role || undefined) as TransactionFilters["role"],
      startDate: v.startDate || undefined,
      endDate: v.endDate || undefined,
      page: 1,
      limit: pageSize,
    };
    setFilters(f);
    load(f);
  };

  const handleExport = async () => {
    try {
      const res = await financeService.exportTransactionsCSV({
        name: filters.name,
        role: filters.role,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      const blob: Blob =
        res instanceof Blob
          ? res
          : (res as any)?.data instanceof Blob
            ? (res as any).data
            : new Blob([JSON.stringify(res)], { type: "text/csv" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "transactions.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* silent */
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

  // ── Modal helpers — always catch so errors never crash the page ───────────────
  const openInfo = async (id: string) => {
    setModalOpen(true);
    setModalDetail(null);
    setModalLoading(true);
    try {
      const res = await financeService.getTransactionDetail(id);
      setModalDetail(res as TransactionDetail);
    } catch {
      setModalDetail(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handlePrint = async (id: string) => {
    try {
      await openInfo(id);
    } catch {
      /* silent */
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Transactions</h1>
        <p className="text-sm font-semibold text-muted-foreground mt-1">
          All paid orders — use filters to narrow down by name, date, or role.
          {total > 0 && <span className="ml-2 text-[#1a3f1c]">{total.toLocaleString()} total</span>}
        </p>
      </div>

      <FinanceFilters onSearch={handleSearch} onExport={handleExport} />

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-muted/50 animate-pulse border border-border"
            />
          ))}
        </div>
      ) : (
        <TransactionList groups={groups} onInfo={openInfo} onPrint={handlePrint} />
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page ?? 1}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
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
