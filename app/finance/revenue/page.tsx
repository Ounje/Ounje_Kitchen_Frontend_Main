'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Search, Download, User } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { RevenueTrendChart } from '@/components/finance/RevenueTrendChart';
import { RevenueDistributionChart } from '@/components/finance/RevenueDistributionChart';
import { TopVendorsModal, TopRidersModal } from '@/components/finance/TopPerformersModal';
import financeService, {
  type RevenueData,
  type RevenuePeriod,
  type TopVendor,
  type TopRider,
} from '@/lib/api/services/finance.service';

// ── Revenue stat card ─────────────────────────────────────────────────────────
function RevenueStatCard({
  icon, value, label, detail1, detail2, change,
}: {
  icon: string; value: number; label: string;
  detail1?: string; detail2?: string; change?: number;
}) {
  return (
    <div className="rounded-xl p-4 relative" style={{ backgroundColor: '#98EF9B' }}>
      <div className="absolute top-3 right-3 opacity-50">
        <TrendingUp className="w-5 h-5" style={{ color: '#1A3F1C' }} />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
          {value >= 1000 ? value.toLocaleString() : value}
        </span>
      </div>
      <p className="text-sm font-semibold mb-1" style={{ color: '#1A3F1C' }}>{label}</p>
      {(detail1 || detail2) && (
        <p className="text-xs" style={{ color: '#1A3F1C' }}>
          {detail1} {detail2}
        </p>
      )}
      {change !== undefined && (
        <p className="text-xs font-semibold mt-1" style={{ color: '#1A3F1C' }}>
          ↑ +{change}%
        </p>
      )}
    </div>
  );
}

// ── Top performers mini section ───────────────────────────────────────────────
function TopSection({
  title, names, onViewDetails,
}: { title: string; names: string[]; onViewDetails: () => void }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 flex-1">
      <p className="text-sm font-bold mb-3" style={{ color: '#1A3F1C' }}>{title}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {names.map((n, i) => (
          <span
            key={i}
            className="px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium"
            style={{ color: '#1A3F1C' }}
          >
            {n}
          </span>
        ))}
      </div>
      <button
        onClick={onViewDetails}
        className="w-full py-2.5 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#1A3F1C' }}
      >
        View Details
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [period, setPeriod]           = useState<RevenuePeriod>('daily');
  const [startDate, setStartDate]     = useState('');
  const [endDate, setEndDate]         = useState('');

  // Top performers modals
  const [vendorsModal, setVendorsModal] = useState(false);
  const [ridersModal, setRidersModal]   = useState(false);
  const [vendorsPeriod, setVendorsPeriod] = useState<RevenuePeriod>('daily');
  const [ridersPeriod, setRidersPeriod]   = useState<RevenuePeriod>('daily');
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [topRiders, setTopRiders]   = useState<TopRider[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [ridersLoading, setRidersLoading]   = useState(false);

  const loadRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const data = await financeService.getRevenueData({ startDate, endDate, period });
      setRevenueData(data);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, period]);

  useEffect(() => { loadRevenue(); }, [period]);

  const loadTopVendors = async (p: RevenuePeriod) => {
    setVendorsLoading(true);
    try {
      const data = await financeService.getTopVendors({ period: p });
      setTopVendors(data);
    } finally {
      setVendorsLoading(false);
    }
  };

  const loadTopRiders = async (p: RevenuePeriod) => {
    setRidersLoading(true);
    try {
      const data = await financeService.getTopRiders({ period: p });
      setTopRiders(data);
    } finally {
      setRidersLoading(false);
    }
  };

  const openVendors = () => { setVendorsModal(true); loadTopVendors(vendorsPeriod); };
  const openRiders  = () => { setRidersModal(true);  loadTopRiders(ridersPeriod); };

  const { stats } = revenueData ?? {};

  const statCards = stats
    ? [
        { icon: '💰', value: stats.gross.amount,  label: 'Gross Revenue',    detail1: `${stats.gross.detail1}`, change: stats.gross.change },
        { icon: '🏪', value: stats.vendor.amount, label: 'vendors Revenue',  detail1: `${stats.vendor.detail1}`, change: stats.vendor.change },
        { icon: '🛵', value: stats.rider.amount,  label: 'Riders Revenue',   detail1: `${stats.rider.detail1}`, change: stats.rider.change },
        { icon: '💹', value: stats.net.amount,    label: 'Net Revenue',       change: stats.net.change },
      ]
    : [];

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>Revenue</h1>
        {/* Period selector */}
        <div className="relative">
          <select
            value={period}
            onChange={e => setPeriod(e.target.value as RevenuePeriod)}
            className="appearance-none flex items-center gap-2 pl-9 pr-8 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white pointer-events-none text-xs">▾</span>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {loading
          ? [...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-xl bg-gray-200 animate-pulse" />
            ))
          : statCards.map(c => (
              <RevenueStatCard key={c.label} {...c} />
            ))}
      </div>

      {/* Date filter row */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        {/* Start date */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#1A3F1C' }}>Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]"
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        {/* End date */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#1A3F1C' }}>End Date</label>
          <div className="relative">
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]"
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={loadRevenue}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A3F1C' }}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A3F1C' }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Charts row */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="h-72 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-72 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      ) : revenueData ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <RevenueTrendChart data={revenueData.trend} />
          <RevenueDistributionChart data={revenueData.distribution} />
        </div>
      ) : null}

      {/* Top performers row */}
      {revenueData && (
        <div className="flex flex-col sm:flex-row gap-4">
          <TopSection
            title="Top 5 Vendors"
            names={revenueData.topVendors.map(v => v.name)}
            onViewDetails={openVendors}
          />
          <TopSection
            title="Top 5 Riders"
            names={revenueData.topRiders.map(r => r.name)}
            onViewDetails={openRiders}
          />
        </div>
      )}

      {/* Modals */}
      <TopVendorsModal
        isOpen={vendorsModal}
        onClose={() => setVendorsModal(false)}
        vendors={topVendors}
        period={vendorsPeriod}
        onPeriodChange={p => { setVendorsPeriod(p); loadTopVendors(p); }}
        loading={vendorsLoading}
      />
      <TopRidersModal
        isOpen={ridersModal}
        onClose={() => setRidersModal(false)}
        riders={topRiders}
        period={ridersPeriod}
        onPeriodChange={p => { setRidersPeriod(p); loadTopRiders(p); }}
        loading={ridersLoading}
      />
    </div>
  );
}