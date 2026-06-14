"use client";

import { useState } from "react";

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
    name: "",
    status: "",
    modeOfDelivery: "",
  });

  const handleInputChange = (field: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => onSearch(filters);

  const handleReset = () => {
    setFilters({ name: "", status: "", modeOfDelivery: "" });
    onReset();
  };

  const inputCls =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#37A449]";
  const labelCls = "block text-sm font-medium mb-1.5";

  return (
    <div className="glass-card p-4 sm:p-6 mb-6 w-full">
      {/* 1 col → 2 col → 5 col (name spans 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Name — wider on large screens */}
        <div className="lg:col-span-2">
          <label className={"labelCls text-[#1a3f1c]"}>Name</label>
          <input
            type="text"
            value={filters.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className={inputCls}
            placeholder="Enter name"
          />
        </div>

        {/* Rider Status */}
        <div>
          <label className={"labelCls text-[#1a3f1c]"}>Rider Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className={inputCls}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Mode of Delivery */}
        <div>
          <label className={"labelCls text-[#1a3f1c]"}>Mode of Delivery</label>
          <select
            value={filters.modeOfDelivery}
            onChange={(e) => handleInputChange("modeOfDelivery", e.target.value)}
            className={inputCls}
          >
            <option value="">All Modes</option>
            <option value="motorcycle">Motorcycle</option>
            <option value="bicycle">Bicycle</option>
            <option value="car">Car</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 items-end sm:col-span-2 lg:col-span-1">
          <button
            onClick={handleSearch}
            className="flex-1 h-[42px] px-4 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 bg-gradient-to-r from-[#1a3f1c] to-[#2a5c2d]"
          >
            Search
          </button>
          <button
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
