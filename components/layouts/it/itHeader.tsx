"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-bell";

interface ITHeaderProps {
  onMenuClick: () => void;
}

export default function ITHeader({ onMenuClick }: ITHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Notification bell */}
        <NotificationBell portal="IT" className="text-gray-700 hover:bg-gray-100 relative h-9 w-9 sm:h-10 sm:w-10 touch-manipulation" />
      </div>
    </header>
  );
}