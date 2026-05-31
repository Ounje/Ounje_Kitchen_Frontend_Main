'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User } from 'lucide-react';
import financeService, {
  type TopVendor,
  type RevenuePeriod,
} from '@/lib/api/services/finance.service';

const PERIODS: { label: string; value: RevenuePeriod }[] = [
  { label: 'Daily',   value: 'daily' },
  { label: 'Weekly',  value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

const thCls = 'px-4 py-3 text-left text-sm font-semibold whitespace-nowrap';

function unwrapVendors(res: any): TopVendor[] {
  if (Array.isArray(res))              return res as TopVendor[];
  if (Array.isArray(res?.data))        return res.data as TopVendor[];
  if (Array.isArray(res?.vendors))     return res.vendors as TopVendor[];
  return [];
}

export default function TopVendorsPage() {
  const router = useRouter();
  const [period, setPeriod]   = useState<RevenuePeriod>('daily');
  const [vendors, setVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (p: RevenuePeriod) => {
    setLoading(true);
    try {
      const res = await financeService.getTopVendors({ period: p });
      setVendors(unwrapVendors(res));
    } catch {
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(period); }, [period]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full">
      <p
        className="text-xs text-gray-400 mb-4 cursor-pointer hover:text-gray-600 transition-colors"
        onClick={() => router.back()}
      >
        ← Revenue / Vendors details
      </p>

      <div
        className="w-full rounded-2xl overflow-hidden shadow-lg bg-gray-50"
      >
        <div className="px-5 sm:px-7 pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 text-[#1a3f1c]">
                Top 5 Vendors
              </h1>
              <p className="text-sm text-gray-500">
                Vendors generating the highest orders and revenue on the platform.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <select
                  value={period}
                  onChange={e => setPeriod(e.target.value as RevenuePeriod)}
                  className="appearance-none pl-8 pr-6 py-1.5 rounded-lg text-white text-sm font-semibold cursor-pointer bg-[#1a3f1c]"
                >
                  {PERIODS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white pointer-events-none" />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white pointer-events-none text-xs">▾</span>
              </div>
              <button
                onClick={() => router.back()}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto px-4 pb-6">
          <table className="w-full min-w-[540px] rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Vendor Name', 'Orders', 'Revenue', 'Commission', 'AOV'].map(h => (
                  <th key={h} className={`${thCls} text-[#1a3f1c]`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    No vendor data available.
                  </td>
                </tr>
              ) : (
                vendors.map((v) => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                          {v.photo
                            ? <img src={v.photo} alt={v.name} className="w-full h-full object-cover" />
                            : v.name?.charAt(0).toUpperCase() ?? '?'}
                        </div>
                        <span className="text-sm font-medium text-[#1a3f1c]">
                          {v.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">{v.orders}</td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">₦{v.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">₦{v.commission.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-[#1a3f1c]">₦{v.aov.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}