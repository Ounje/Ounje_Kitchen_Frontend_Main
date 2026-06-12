'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Search, Download, User, Loader2 } from 'lucide-react';
import { downloadCSV } from '@/lib/utils/exportCSV';
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
    <div className="rounded-xl p-4 relative bg-[#98ef9b]/60 border border-[#98ef9b]">
      <div className="absolute top-3 right-3 opacity-40">
        <TrendingUp className="w-5 h-5 text-[#1a3f1c]" />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-2xl sm:text-3xl font-bold text-[#1a3f1c]">
          {value >= 1000 ? value.toLocaleString() : value}
        </span>
      </div>
      <p className="text-sm font-semibold mb-1 text-[#1a3f1c]">{label}</p>
      {(detail1 || detail2) && (
        <p className="text-xs text-[#1a3f1c]/80">{detail1} {detail2}</p>
      )}
      {change !== undefined && (
        <p className="text-xs font-semibold mt-1 text-[#1a3f1c]">↑ +{change}%</p>
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
      <p className="text-sm font-bold mb-3 text-[#1a3f1c]">{title}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {names.map((n, i) => (
          <span key={i} className="px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium text-[#1a3f1c]">
            {n}
          </span>
        ))}
      </div>
      <button type="button" onClick={onViewDetails}
        className="w-full h-9 rounded-lg bg-[#1a3f1c] text-white text-sm font-semibold hover:bg-[#163318] transition-colors">
        View Details
      </button>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function RevenuePage() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading]         = useState(true);
  const [exporting, setExporting]     = useState(false);
  const [period, setPeriod]           = useState<RevenuePeriod>('daily');
  const [startDate, setStartDate]     = useState('');
  const [endDate, setEndDate]         = useState('');

  // Top performers modals
  const [vendorsModal, setVendorsModal]     = useState(false);
  const [ridersModal, setRidersModal]       = useState(false);
  const [vendorsPeriod, setVendorsPeriod]   = useState<RevenuePeriod>('daily');
  const [ridersPeriod, setRidersPeriod]     = useState<RevenuePeriod>('daily');
  const [topVendors, setTopVendors]         = useState<TopVendor[]>([]);
  const [topRiders, setTopRiders]           = useState<TopRider[]>([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [ridersLoading, setRidersLoading]   = useState(false);

  const loadRevenue = useCallback(async () => {
    setLoading(true);
    try {
      const res: any = await financeService.getRevenueData({ startDate, endDate, period });
      // Backend wraps in { success, data: { stats, trend, distribution, ... } }
      const payload: RevenueData = res?.data ?? res;
      setRevenueData(payload);
    } catch {
      setRevenueData(null);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, period]);

  // Load on mount and when period changes
  useEffect(() => { loadRevenue(); }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportCSV = () => {
    if (!revenueData) return;
    setExporting(true);
    try {
      const rows = (revenueData.trend ?? []).map(t => ({
        Period:         t.label,
        'Gross Revenue':  t.gross,
        'Vendor Revenue': t.vendor,
        'Rider Revenue':  t.rider,
        'Net Revenue':    t.net,
      }));
      if (revenueData.stats) {
        const s = revenueData.stats;
        rows.push(
          { Period: 'TOTAL — Gross',          'Gross Revenue': s.gross.amount,  'Vendor Revenue': 0, 'Rider Revenue': 0, 'Net Revenue': 0 },
          { Period: 'TOTAL — Vendor',         'Gross Revenue': 0, 'Vendor Revenue': s.vendor.amount, 'Rider Revenue': 0, 'Net Revenue': 0 },
          { Period: 'TOTAL — Rider',          'Gross Revenue': 0, 'Vendor Revenue': 0, 'Rider Revenue': s.rider.amount, 'Net Revenue': 0 },
          { Period: 'TOTAL — Net',            'Gross Revenue': 0, 'Vendor Revenue': 0, 'Rider Revenue': 0, 'Net Revenue': s.net.amount },
        );
      }
      downloadCSV(rows, `revenue_${period}_${new Date().toISOString().slice(0, 10)}`);
    } finally {
      setExporting(false);
    }
  };

  const loadTopVendors = async (p: RevenuePeriod) => {
    setVendorsLoading(true);
    try {
      const res: any = await financeService.getTopVendors({ period: p });
      const list: TopVendor[] =
        Array.isArray(res?.data)    ? res.data    :
        Array.isArray(res?.vendors) ? res.vendors :
        Array.isArray(res)          ? res          :
        [];
      setTopVendors(list);
    } catch {
      setTopVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  const loadTopRiders = async (p: RevenuePeriod) => {
    setRidersLoading(true);
    try {
      const res: any = await financeService.getTopRiders({ period: p });
      const list: TopRider[] =
        Array.isArray(res?.data)   ? res.data   :
        Array.isArray(res?.riders) ? res.riders :
        Array.isArray(res)         ? res         :
        [];
      setTopRiders(list);
    } catch {
      setTopRiders([]);
    } finally {
      setRidersLoading(false);
    }
  };

  const openVendors = () => { setVendorsModal(true); loadTopVendors(vendorsPeriod); };
  const openRiders  = () => { setRidersModal(true);  loadTopRiders(ridersPeriod); };

  const { stats } = revenueData ?? {};

  const statCards = stats
    ? [
        { icon: '💰', value: stats.gross.amount,                    label: 'Gross Revenue',    detail1: stats.gross.detail1,          change: stats.gross.change },
        { icon: '🏪', value: stats.vendor.amount,                   label: 'Vendors Revenue',  detail1: stats.vendor.detail1,         change: stats.vendor.change },
        { icon: '🛵', value: stats.rider.amount,                    label: 'Riders Revenue',   detail1: stats.rider.detail1,          change: stats.rider.change },
        { icon: '💹', value: stats.net.amount,                      label: 'Net Revenue',                                             change: stats.net.change },
        ...(stats.platformMarkup ? [{ icon: '📈', value: stats.platformMarkup.amount, label: 'Platform Markup (10%)', change: stats.platformMarkup.change }] : []),
        ...(stats.comboMarkup    ? [{ icon: '🍱', value: stats.comboMarkup.amount,    label: 'Combo Markup (20%)',    change: stats.comboMarkup.change    }] : []),
        ...(stats.serviceFee     ? [{ icon: '🧾', value: stats.serviceFee.amount,     label: 'Service Fee (10%)',     change: stats.serviceFee.change     }] : []),
      ]
    : [];

  // Safe arrays — always defined even if backend omits the key
  const trendData        = revenueData?.trend        ?? [];
  const distributionData = revenueData?.distribution ?? [];
  const topVendorNames   = (revenueData?.topVendors  ?? []).map(v => v.name);
  const topRiderNames    = (revenueData?.topRiders   ?? []).map(r => r.name);

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-black text-gray-900">Revenue</h1>
        <div className="relative">
          <select
            value={period}
            title="Revenue period"
            aria-label="Revenue period"
            onChange={e => setPeriod(e.target.value as RevenuePeriod)}
            className="appearance-none bg-[#1a3f1c] pl-9 pr-8 py-2 rounded-lg text-white text-sm font-semibold cursor-pointer"
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
          : statCards.length > 0
            ? statCards.map(c => <RevenueStatCard key={c.label} {...c} />)
            : [...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-xl bg-gray-100 border border-gray-200" />
              ))}
      </div>

      {/* Date filter row */}
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div>
          <label htmlFor="rev-start" className="block text-xs font-medium mb-1 text-[#1a3f1c]">Start Date</label>
          <div className="relative">
            <input
              id="rev-start"
              type="date"
              title="Start date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]"
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label htmlFor="rev-end" className="block text-xs font-medium mb-1 text-[#1a3f1c]">End Date</label>
          <div className="relative">
            <input
              id="rev-end"
              type="date"
              title="End date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]"
            />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button
          type="button"
          onClick={loadRevenue}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity bg-[#1a3f1c]"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={exporting || !revenueData}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity bg-[#1a3f1c] disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </div>

      {/* Charts row */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="h-72 rounded-xl bg-gray-200 animate-pulse" />
          <div className="h-72 rounded-xl bg-gray-200 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {trendData.length > 0
            ? <RevenueTrendChart data={trendData} />
            : <div className="h-72 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">No trend data for this period</div>}
          {distributionData.length > 0
            ? <RevenueDistributionChart data={distributionData} />
            : <div className="h-72 rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-sm text-gray-400">No distribution data for this period</div>}
        </div>
      )}

      {/* Top performers row */}
      {revenueData && (topVendorNames.length > 0 || topRiderNames.length > 0) && (
        <div className="flex flex-col sm:flex-row gap-4">
          <TopSection
            title="Top 5 Vendors"
            names={topVendorNames}
            onViewDetails={openVendors}
          />
          <TopSection
            title="Top 5 Riders"
            names={topRiderNames}
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