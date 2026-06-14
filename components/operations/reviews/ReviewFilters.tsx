"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ReviewFiltersProps {
  onSearch: (ratingCategory: string) => void;
  onReset: () => void;
}

const ratingOptions = [
  { value: "", label: "All" },
  { value: "5", label: "5 Star" },
  { value: "4", label: "4 Star" },
  { value: "3", label: "3 Star" },
  { value: "2", label: "2 Star" },
  { value: "1", label: "1 Star" },
];

export default function ReviewFilters({ onSearch, onReset }: ReviewFiltersProps) {
  const [ratingCategory, setRatingCategory] = useState("");
  const [open, setOpen] = useState(false);

  const selectedLabel = ratingOptions.find((o) => o.value === ratingCategory)?.label ?? "";

  const handleSearch = () => {
    onSearch(ratingCategory);
  };

  const handleReset = () => {
    setRatingCategory("");
    onReset();
  };

  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 mb-1">Rating Category</p>
      <div className="flex flex-wrap gap-3 items-center">
        {/* Dropdown */}
        <div className="relative w-full sm:w-64">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A3F1C]"
          >
            <span className={selectedLabel ? "text-gray-800" : "text-gray-400"}>
              {selectedLabel || ""}
            </span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {open && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {ratingOptions.map((opt) => (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      setRatingCategory(opt.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-[#e8f8e8] transition-colors ${
                      ratingCategory === opt.value
                        ? "bg-[#e8f8e8] font-semibold text-[#1A3F1C]"
                        : "text-gray-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search button */}
        <button
          type="button"
          onClick={handleSearch}
          className="bg-[#1A3F1C] hover:bg-[#16341a] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Search
        </button>

        {/* Reset button */}
        <button
          type="button"
          onClick={handleReset}
          className="bg-[#1A3F1C] hover:bg-[#16341a] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
