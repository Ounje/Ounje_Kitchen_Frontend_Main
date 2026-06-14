"use client";

import { useState } from "react";

interface CustomerFiltersProps {
  onSearch: (filters: FilterValues) => void;
  onReset: () => void;
}

export interface FilterValues {
  name: string;
  email: string;
  accountStatus: string;
}

const inputCls =
  "w-full px-3 py-2 h-10 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3f1c]/30 focus:border-[#1a3f1c] transition-colors placeholder:text-gray-400";

const labelCls = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

export function CustomerFilters({ onSearch, onReset }: CustomerFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({ name: "", email: "", accountStatus: "" });

  const set = (field: keyof FilterValues, value: string) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

  const handleReset = () => {
    const empty: FilterValues = { name: "", email: "", accountStatus: "" };
    setFilters(empty);
    onReset();
  };

  return (
    <div className="glass-card p-4 sm:p-5 mb-5 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className={labelCls}>Name</label>
          <input
            type="text"
            value={filters.name}
            placeholder="Search by name…"
            onChange={(e) => set("name", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(filters)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            value={filters.email}
            placeholder="Search by email…"
            onChange={(e) => set("email", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(filters)}
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Status</label>
          <select
            value={filters.accountStatus}
            onChange={(e) => set("accountStatus", e.target.value)}
            title="Filter by status"
            aria-label="Filter by account status"
            className={inputCls}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={() => onSearch(filters)}
            className="flex-1 h-[42px] px-4 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 bg-gradient-to-r from-[#1a3f1c] to-[#2a5c2d]"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 h-[42px] px-4 text-[#1a3f1c] rounded-xl text-sm font-bold border border-[#1a3f1c]/20 hover:bg-[#1a3f1c]/5 active:scale-95 transition-all duration-300 bg-white shadow-sm"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
