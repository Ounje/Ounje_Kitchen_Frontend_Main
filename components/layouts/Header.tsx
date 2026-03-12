"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Weekly");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodSelect = (period: string) => {
    setSelectedPeriod(period);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1A3F1C] border-b">
      <div className="px-4 md:px-6 py-3 flex items-center justify-end gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden absolute left-4"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6 text-white font-bold" />
        </Button>

        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative cursor-pointer"
        >
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>

        {/* Period dropdown */}
        {/* <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-[#98ef9b] hover:bg-[#88df8b] rounded-md transition-colors text-sm font-medium text-[#1a3f1c]"
          >
            <span>{selectedPeriod}</span>
            <ChevronDown 
              className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
            />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border py-1 z-50">
              {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodSelect(period)}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    selectedPeriod === period
                      ? 'bg-[#98ef9b] text-[#1a3f1c] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </header>
  );
}