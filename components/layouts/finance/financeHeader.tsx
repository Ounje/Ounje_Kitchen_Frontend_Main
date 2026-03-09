'use client';

import { Bell, Menu } from 'lucide-react';

interface Props {
  onMenuClick: () => void;
}

export default function FinanceHeader({ onMenuClick }: Props) {
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30"
      style={{ backgroundColor: '#1A3F1C' }}
    >
      {/* Hamburger (mobile only) */}
      <button
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      <span className="text-white font-bold text-lg lg:ml-0">Ounjefood</span>

      <button
        className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-white" />
      </button>
    </header>
  );
}