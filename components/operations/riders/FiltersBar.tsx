// app/operations/riders/components/FiltersBar.tsx
'use client';

import { useState } from 'react';

export interface FilterValues {
  name: string;
  status: string;
  modeOfDelivery: string;
}

interface FiltersBarProps {
  onSearch: (filters: FilterValues) => void;
  onReset: () => void;
}

export function FiltersBar({ onSearch, onReset }: FiltersBarProps) {
  const [filters, setFilters] = useState<FilterValues>({
    name: '',
    status: '',
    modeOfDelivery: ''
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
      status: '',
      modeOfDelivery: ''
    });
    onReset();
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 mb-6">
      {/* Desktop: All in one row, Tablet: 2 rows, Mobile: Stack */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Name Input */}
        <div className="lg:col-span-2">
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

        {/* Rider Status Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A3F1C' }}>
            Rider Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A449]"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Mode of Delivery Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: '#1A3F1C' }}>
            Mode of Delivery
          </label>
          <select
            value={filters.modeOfDelivery}
            onChange={(e) => handleInputChange('modeOfDelivery', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37A449]"
          >
            <option value="">All Modes</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="bicycle">Bicycle</option>
            <option value="car">Car</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 sm:col-span-2 lg:col-span-1 lg:items-end">
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