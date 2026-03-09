'use client';

import { useState } from 'react';
import { Search, Download, Calendar } from 'lucide-react';

export interface FinanceFilterValues {
  name: string;
  role: string;
  startDate: string;
  endDate: string;
}

interface Props {
  onSearch: (v: FinanceFilterValues) => void;
  onExport: () => void;
}

export function FinanceFilters({ onSearch, onExport }: Props) {
  const [v, setV] = useState<FinanceFilterValues>({ name: '', role: '', startDate: '', endDate: '' });
  const set = (k: keyof FinanceFilterValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setV(prev => ({ ...prev, [k]: e.target.value }));

  const inputCls =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]';

  return (
    <div className="mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#1A3F1C' }}>Name</label>
          <input
            type="text"
            value={v.name}
            onChange={set('name')}
            onKeyDown={e => e.key === 'Enter' && onSearch(v)}
            className={inputCls}
            placeholder="Search name"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#1A3F1C' }}>Role</label>
          <div className="relative">
            <select value={v.role} onChange={set('role')} className={inputCls + ' appearance-none pr-8'}>
              <option value="">All Roles</option>
              <option value="Rider">Rider</option>
              <option value="Vendor">Vendor</option>
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▾</span>
          </div>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#1A3F1C' }}>Start Date</label>
          <div className="relative">
            <input type="date" value={v.startDate} onChange={set('startDate')} className={inputCls + ' pr-8'} />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block text-xs font-medium mb-1" style={{ color: '#1A3F1C' }}>End Date</label>
          <div className="relative">
            <input type="date" value={v.endDate} onChange={set('endDate')} className={inputCls + ' pr-8'} />
            <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => onSearch(v)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A3F1C' }}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1A3F1C' }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  );
}