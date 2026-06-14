"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/ui/notification-bell";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PAGE_TITLES: Record<string, string> = {
  "/operations": "Dashboard",
  "/operations/orders": "Orders",
  "/operations/customers": "Customers",
  "/operations/vendors": "Vendors",
  "/operations/riders": "Riders",
  "/operations/reviews": "Reviews & Ratings",
  "/operations/promos": "Promo Codes",
  "/operations/transactions": "Transactions",
  "/operations/notifications": "Broadcasts",
  "/operations/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  const base = Object.keys(PAGE_TITLES)
    .filter((k) => k !== "/operations")
    .find((k) => pathname.startsWith(k));
  return base ? PAGE_TITLES[base] : "Operations";
}

interface OperationsHeaderProps {
  onMenuClick: () => void;
}

export default function OperationsHeader({ onMenuClick }: OperationsHeaderProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = getPageTitle(pathname);
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "OP";
  const fullName = user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : "User";

  return (
    <div className="sticky top-4 z-30 px-4 sm:px-6 lg:px-8 mb-4">
      <header className="h-16 glass-panel rounded-2xl flex items-center px-4 sm:px-6 gap-4 transition-all duration-300">
        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-gray-600 hover:bg-gray-100 shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-gray-800 truncate">{pageTitle}</h2>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <NotificationBell portal="Operations" className="text-gray-600 hover:bg-gray-100" />

          {/* User chip — desktop only */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-gray-200">
            <Avatar className="h-7 w-7 shrink-0">
              {user?.avatar && (
                <AvatarImage src={user.avatar} alt={fullName} className="object-cover" />
              )}
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold text-gray-700 max-w-30 truncate">
              {fullName}
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}
