'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/finance/StatsCard';
import { DashboardWithdrawalTable } from '@/components/finance/DashboardWithdrawalTable';
import { WithdrawalInfoModal } from '@/components/finance/WithdrawalInfoModal';
import financeService, {
  type DashboardStats,
  type DashboardWithdrawalRow,
  type WithdrawalDetail,
} from '@/lib/api/services/finance.service';

export default function FinanceDashboardPage() {
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [rows, setRows]         = useState<DashboardWithdrawalRow[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRows, setLoadingRows]   = useState(true);

  // Modal
  const [modalOpen, setModalOpen]     = useState(false);
  const [modalDetail, setModalDetail] = useState<WithdrawalDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    financeService.getDashboardStats()
      .then(setStats)
      .finally(() => setLoadingStats(false));

    financeService.getDashboardWithdrawals()
      .then(setRows)
      .finally(() => setLoadingRows(false));
  }, []);

  const handleInfo = async (row: DashboardWithdrawalRow) => {
    setModalOpen(true);
    setModalDetail(null);
    setModalLoading(true);
    try {
      const detail = await financeService.getWithdrawalDetail(row.id);
      setModalDetail(detail);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this withdrawal record?')) return;
    await financeService.deleteDashboardWithdrawal(id);
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const STAT_CARDS = stats
    ? [
        { icon: '🏧', value: stats.withdrawals.count,  label: 'Withdrawals',  subtitle: stats.withdrawals.subtitle },
        { icon: '🔄', value: stats.transactions.count, label: 'Transactions', subtitle: stats.transactions.subtitle },
        { icon: '💼', value: stats.payroll.count,      label: 'Payroll',      subtitle: stats.payroll.subtitle },
      ]
    : [];

  return (
    <div className="w-full">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: '#1A3F1C' }}>Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {loadingStats
          ? [...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse" />
            ))
          : STAT_CARDS.map(c => (
              <StatsCard key={c.label} icon={c.icon} value={c.value} label={c.label} subtitle={c.subtitle} />
            ))}
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
          <DashboardWithdrawalTable rows={rows} onInfo={handleInfo} onDelete={handleDelete} />
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