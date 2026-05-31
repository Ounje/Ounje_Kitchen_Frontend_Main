"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { NotificationBell } from "@/components/ui/notification-bell";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PAGE_TITLES: Record<string, string> = {
  "/finance/dashboard":    "Dashboard",
  "/finance/transactions": "Transactions",
  "/finance/withdrawals":  "Withdrawals",
  "/finance/revenue":      "Revenue",
  "/finance/settings":     "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = Object.keys(PAGE_TITLES).find(k => pathname.startsWith(k));
  return base ? PAGE_TITLES[base] : "Finance Portal";
}

interface Props {
  onMenuClick: () => void;
}

export default function FinanceHeader({ onMenuClick }: Props) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = getPageTitle(pathname);
  const initials  = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "FN";
  const fullName  = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "User";

  return (
    <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-100 shadow-sm flex items-center px-4 sm:px-6 gap-3">
      <button type="button" onClick={onMenuClick} aria-label="Open menu" title="Open menu"
        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors shrink-0">
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-gray-800 truncate">{pageTitle}</h2>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <NotificationBell portal="Finance" className="text-gray-600 hover:bg-gray-100" />
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
          <Avatar className="h-7 w-7 shrink-0">
            {user?.avatar && <AvatarImage src={user.avatar} alt={fullName} className="object-cover" />}
            <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-semibold text-gray-700 max-w-30 truncate">{fullName}</span>
        </div>
      </div>
    </header>
  );
}
