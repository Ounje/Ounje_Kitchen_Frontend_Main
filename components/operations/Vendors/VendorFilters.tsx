// app/operations/vendors/components/VendorFilters.tsx
'use client';

import { useState } from 'react';

interface VendorFiltersProps {
  onSearch: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  name: string;
  accountStatus: string;
  businessStatus: string;
}

export function VendorFilters({ onSearch, onReset }: VendorFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    accountStatus: '',
    businessStatus: ''
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
      accountStatus: '',
      businessStatus: ''
    });
    onReset();
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="">Select Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Business Status Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A3F1C' }}>
            Business Status
          </label>
          <select
            value={filters.businessStatus}
            onChange={(e) => handleInputChange('businessStatus', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A449]"
          >
            <option value="">Select Status</option>
            <option value="registered">Registered</option>
            <option value="unregistered">Unregistered</option>
            <option value="pending">Pending</option>
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