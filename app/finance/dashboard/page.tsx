'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatsCard } from '@/components/finance/StatsCard';
import { DashboardWithdrawalTable } from '@/components/finance/DashboardWithdrawalTable';
import { WithdrawalInfoModal } from '@/components/finance/WithdrawalInfoModal';
import { toast } from 'sonner';
import { PasswordChangeRequiredError } from '@/lib/client';
import financeService, {
  type DashboardStats,
  type DashboardWithdrawalRow,
  type WithdrawalDetail,
} from '@/lib/api/services/finance.service';

export default function FinanceDashboardPage() {
  const queryClient = useQueryClient();

  // Modal State
  const [modalOpen, setModalOpen]       = useState(false);
  const [modalDetail, setModalDetail]   = useState<WithdrawalDetail | null>(null);
  // Modal Loading is internal to handleInfo now, but we'll use a local state or useMutation

  // 1. Fetch Stats
  const { 
    data: stats, 
    isLoading: loadingStats, 
    error: statsError 
  } = useQuery<DashboardStats>({
    queryKey: ['financeDashboardStats'],
    queryFn: async () => {
      const res: any = await financeService.getDashboardStats();
      return (res?.data ?? res) as DashboardStats;
    },
  });

  // 2. Fetch Withdrawals
  const { 
    data: rows = [], 
    isLoading: loadingRows, 
    error: rowsError 
  } = useQuery<DashboardWithdrawalRow[]>({
    queryKey: ['financeDashboardWithdrawals'],
    queryFn: async () => {
      const res: any = await financeService.getDashboardWithdrawals();
      return (
          Array.isArray(res)           ? res        :
          Array.isArray(res?.data)     ? res.data   :
          Array.isArray(res?.withdrawals) ? res.withdrawals :
          []
      ) as DashboardWithdrawalRow[];
    },
  });

  // 3. Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => financeService.deleteDashboardWithdrawal(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData(['financeDashboardWithdrawals'], (old: DashboardWithdrawalRow[] | undefined) => 
        old ? old.filter(r => r.id !== id) : []
      );
      toast.success('Withdrawal record deleted');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete withdrawal');
    }
  });

  // 4. Modal Detail Mutation / Fetch
  const [modalLoading, setModalLoading] = useState(false);
  const handleInfo = async (row: DashboardWithdrawalRow) => {
    setModalOpen(true);
    setModalDetail(null);
    setModalLoading(true);
    try {
      const res = await financeService.getWithdrawalDetail(row.id);
      const detail = (res as any)?.data ?? res;
      setModalDetail(detail as WithdrawalDetail);
    } catch(err: any) {
      toast.error(err.message || 'Failed to fetch details');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this withdrawal record?')) return;
    deleteMutation.mutate(id);
  };

  // ✅ Graceful error views
  if (statsError instanceof PasswordChangeRequiredError || rowsError instanceof PasswordChangeRequiredError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-xl border border-red-100 mt-10 text-center">
         <h2 className="text-xl font-bold text-red-600 mb-2">Security Action Required</h2>
         <p className="text-gray-700">You must change your password before accessing the finance portal.</p>
         <p className="text-sm text-gray-500 mt-2">Redirecting to account settings...</p>
      </div>
    );
  }

  if (statsError || rowsError) {
      const errMessage = (statsError as Error)?.message || (rowsError as Error)?.message || 'Something went wrong.';
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-gray-100 mt-10 text-center">
           <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
           <p className="text-gray-600 mb-4">{errMessage}</p>
           <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-[#1A3F1C] text-white font-medium rounded-lg hover:bg-opacity-90 transition">
             Reload Dashboard
           </button>
        </div>
      );
  }

  const STAT_CARDS = stats
    ? [
        { icon: '🏧', value: stats.withdrawals?.count  ?? 0, label: 'Withdrawals',  subtitle: stats.withdrawals?.subtitle  ?? '' },
        { icon: '🔄', value: stats.transactions?.count ?? 0, label: 'Transactions', subtitle: stats.transactions?.subtitle ?? '' },
        { icon: '💼', value: stats.payroll?.count      ?? 0, label: 'Payroll',      subtitle: stats.payroll?.subtitle      ?? '' },
      ]
    : [];

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: '#1A3F1C' }}>
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loadingStats ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse" />
          ))
        ) : stats ? (
          STAT_CARDS.map((c) => (
            <StatsCard
              key={c.label}
              icon={c.icon}
              value={c.value}
              label={c.label}
              subtitle={c.subtitle}
            />
          ))
        ) : null}
      </div>

      {/* Withdrawal table */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold" style={{ color: '#1A3F1C' }}>Withdrawal</h2>
          <Link
            href="/finance/withdrawals"
            className="px-4 py-1.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            View All
          </Link>
        </div>

        {loadingRows ? (
          <div className="bg-white rounded-xl p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <DashboardWithdrawalTable
            rows={rows}
            onInfo={handleInfo}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Withdrawal detail modal */}
      <WithdrawalInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        detail={modalDetail}
        loading={modalLoading}
      />
    </div>
  );
}