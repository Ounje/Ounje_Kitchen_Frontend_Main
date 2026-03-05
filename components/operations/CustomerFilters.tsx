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
    accountStatus: ''
  });

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      email: '',
      accountStatus: ''
    });
    onReset();
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A3F1C' }}>
            Name
          </label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A449]"
            placeholder="Enter name"
          />
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A3F1C' }}>
            Email
          </label>
          <input
            type="email"
            value={filters.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A449]"
            placeholder="Enter email"
          />
        </div>

        {/* Account Status Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A3F1C' }}>
            Account Status
          </label>
          <select
            value={filters.accountStatus}
            onChange={(e) => handleInputChange('accountStatus', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A449]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-end">
          <button
            onClick={handleSearch}
            className="flex-1 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Search
          </button>
          <button
            onClick={handleReset}
            className="flex-1 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}