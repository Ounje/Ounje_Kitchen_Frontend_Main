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
  type WalletOverview,
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

  // 2. Wallet Overview
  const {
    data: wallets,
    isLoading: loadingWallets,
  } = useQuery<WalletOverview>({
    queryKey: ['financeWalletOverview'],
    queryFn: async () => {
      try { return await financeService.getWalletOverview(); }
      catch { return null as any; }
    },
  });

  // 3. Fetch Withdrawals
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
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 mt-10 text-center">
         <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Security Action Required</h2>
         <p className="text-foreground/80">You must change your password before accessing the finance portal.</p>
         <p className="text-sm text-muted-foreground mt-2">Redirecting to account settings...</p>
      </div>
    );
  }

  if (statsError || rowsError) {
      const errMessage = (statsError as Error)?.message || (rowsError as Error)?.message || 'Something went wrong.';
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-xl shadow-sm border border-border mt-10 text-center">
           <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Dashboard</h2>
           <p className="text-muted-foreground mb-4">{errMessage}</p>
           <button type="button" onClick={() => window.location.reload()} className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-opacity-90 transition">
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-primary">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loadingStats ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-surface-secondary animate-pulse" />
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

      {/* Wallet Overview */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-primary mb-3">Wallet Balances</h2>
        {loadingWallets ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-surface-secondary animate-pulse" />)}
          </div>
        ) : wallets ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl p-4 bg-[#1a3f1c] text-white">
              <p className="text-xs font-semibold text-white/60 mb-1">Platform Balance</p>
              <p className="text-2xl font-black">₦{wallets.platform.availableBalance.toLocaleString()}</p>
              <p className="text-xs text-white/50 mt-1">₦{wallets.platform.pendingBalance.toLocaleString()} pending</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 mb-1">Vendor Wallets</p>
              <p className="text-2xl font-black text-gray-900">₦{wallets.vendors.availableBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">₦{wallets.vendors.holdBalance.toLocaleString()} on hold</p>
            </div>
            <div className="rounded-xl p-4 bg-white border border-gray-100 shadow-sm">
              <p className="text-xs font-semibold text-gray-500 mb-1">Rider Wallets</p>
              <p className="text-2xl font-black text-gray-900">₦{wallets.riders.availableBalance.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">₦{wallets.riders.holdBalance.toLocaleString()} on hold</p>
            </div>
            <div className="rounded-xl p-4 bg-amber-50 border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1">Pending Payouts</p>
              <p className="text-2xl font-black text-amber-800">{wallets.pendingPayouts.count}</p>
              <p className="text-xs text-amber-600 mt-1">₦{wallets.pendingPayouts.totalNaira.toLocaleString()} queued</p>
            </div>
          </div>
        ) : null}
      </div>

      {/* Withdrawal table */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-primary">Withdrawal</h2>
          <Link
            href="/finance/withdrawals"
            className="px-4 py-1.5 rounded-lg text-primary-foreground text-sm font-semibold bg-primary hover:opacity-90 transition-opacity"
          >
            View All
          </Link>
        </div>

        {loadingRows ? (
          <div className="bg-surface rounded-xl p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-surface-secondary rounded animate-pulse" />
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