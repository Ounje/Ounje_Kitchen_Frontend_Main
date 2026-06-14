"use client";

import { useState, useCallback, useEffect } from "react";
import { FinanceFilters, type FinanceFilterValues } from "@/components/finance/FinanceFilters";
import { WithdrawalList } from "@/components/finance/WithdrawalList";
import { WithdrawalInfoModal } from "@/components/finance/WithdrawalInfoModal";
import Pagination from "@/components/Pagination";
import financeService, {
  type WithdrawalFilters,
  type WithdrawalGroup,
  type WithdrawalDetail,
} from "@/lib/api/services/finance.service";

export default function WithdrawalsPage() {
  const [groups, setGroups] = useState<WithdrawalGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WithdrawalFilters>({ page: 1, limit: 10 });
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDetail, setModalDetail] = useState<WithdrawalDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const load = useCallback(
    async (f: WithdrawalFilters, limit = pageSize) => {
      setLoading(true);
      try {
        const res: any = await financeService.getWithdrawals({ ...f, limit });

        // Backend shape: { success, message, data: [], page, limit, total, totalPages }
        const list: WithdrawalGroup[] = Array.isArray(res?.data) ? res.data : [];

        setGroups(list);
        setTotalPages(res?.totalPages ?? 1);
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  // ── Load on mount ─────────────────────────────────────────
  useEffect(() => {
    load({ page: 1, limit: pageSize });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (v: FinanceFilterValues) => {
    const f: WithdrawalFilters = {
      name: v.name || undefined,
      role: (v.role || undefined) as WithdrawalFilters["role"],
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
      const res = await financeService.exportWithdrawalsCSV({
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
      a.download = "withdrawals.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Export failed silently
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
      const res: any = await financeService.getWithdrawalDetail(id);
      // Backend wraps single objects in { success, data: { ... } }
      const detail = res?.data ?? res;
      setModalDetail(detail as WithdrawalDetail);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3f1c]">Withdrawals</h1>
        <p className="text-sm text-gray-400 mt-1">
          Internal withdrawal records — for reference only. Approving or rejecting here does{" "}
          <strong>not</strong> affect actual bank transfers, which are handled automatically by the
          Payouts system.
        </p>
      </div>

      <FinanceFilters onSearch={handleSearch} onExport={handleExport} />

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : (
        <WithdrawalList groups={groups} onInfo={openInfo} onPrint={openInfo} />
      )}

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

      <WithdrawalInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        detail={modalDetail}
        loading={modalLoading}
      />
    </div>
  );
}
