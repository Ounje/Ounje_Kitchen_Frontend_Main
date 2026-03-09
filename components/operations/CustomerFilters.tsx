'use client';

import { useState } from 'react';

interface CustomerFiltersProps {
  onSearch: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  name: string;
  email: string;
  accountStatus: string;
}

export function CustomerFilters({ onSearch, onReset }: CustomerFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    email: '',
    accountStatus: '',
  });

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => onSearch(filters);

  const handleReset = () => {
    setFilters({ name: '', email: '', accountStatus: '' });
    onReset();
  };

  const inputCls =
    'w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#37A449] bg-white';
  const labelCls = 'block text-sm font-medium mb-1.5';

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
      {/* Responsive grid: 1 col → 2 col → 4 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Name */}
        <div>
          <label className={labelCls} style={{ color: '#1A3F1C' }}>Name</label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={inputCls}
            placeholder="Enter name"
          />
        </div>

        {/* Email */}
        <div>
          <label className={labelCls} style={{ color: '#1A3F1C' }}>Email</label>
          <input
            type="email"
            value={filters.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={inputCls}
            placeholder="Enter email"
          />
        </div>

        {/* Account Status */}
        <div>
          <label className={labelCls} style={{ color: '#1A3F1C' }}>Account Status</label>
          <select
            value={filters.accountStatus}
            onChange={(e) => handleInputChange('accountStatus', e.target.value)}
            className={inputCls}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-end">
          <button
            onClick={handleSearch}
            className="flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2.5 text-white rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}