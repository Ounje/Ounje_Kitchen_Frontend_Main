'use client';

import { Menu } from 'lucide-react';
import { NotificationBell } from "@/components/ui/notification-bell";

interface Props {
  onMenuClick: () => void;
}

export default function FinanceHeader({ onMenuClick }: Props) {
  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30 bg-[#1a3f1c] border-b border-transparent"
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

      <div className="flex items-center gap-2">
        <NotificationBell portal="Finance" className="text-white hover:bg-white/10" />
      </div>
    </header>
  );
}