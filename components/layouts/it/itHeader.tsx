"use client";

import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </Button>
      </div>
    </header>
  );
}