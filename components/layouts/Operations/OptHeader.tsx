"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OperationsHeaderProps {
  onMenuClick: () => void;
}

export default function OperationsHeader({ onMenuClick }: OperationsHeaderProps) {
  return (
    <header className="h-14 sm:h-16 bg-[#1a3f1c] flex items-center justify-between px-3 sm:px-4 md:px-6 shadow-md sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-white hover:bg-white/10 active:bg-white/20 h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      {/* Logo (visible on mobile when sidebar is closed) */}
      <h1 className="text-white text-base sm:text-lg font-bold lg:hidden">
        Ounjefood
      </h1>

      {/* Spacer for desktop */}
      <div className="hidden lg:block" />

      {/* Notification Icon */}
      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 active:bg-white/20 relative h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        {/* Notification badge */}
        <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
      </Button>
    </header>
  );
}