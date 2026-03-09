'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  LogOut, Home, ArrowLeftRight, ArrowDownToLine, TrendingUp, Settings,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

const NAV = [
  { href: '/finance/dashboard',    name: 'Home',         icon: Home },
  { href: '/finance/transactions', name: 'Transactions', icon: ArrowLeftRight },
  { href: '/finance/withdrawals',  name: 'Withdrawal',   icon: ArrowDownToLine },
  { href: '/finance/revenue',      name: 'Revenue',      icon: TrendingUp },
  { href: '/finance/settings',     name: 'Settings',     icon: Settings },
];



interface FinanceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FinanceSidebar({ isOpen, onClose }: FinanceSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

   const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "Finance";

  const firstName = user?.firstName || "User";
  const avatarUrl = user?.avatar; // Base64 data URL from Settings

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-[260px]
          flex flex-col
          bg-[#1a3f1c]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <h1 className="text-white text-lg font-bold tracking-wide">
            Ounjefood
          </h1>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="p-5 pb-6 border-b border-white/10">
          <div className="flex flex-col items-center gap-3 p-3 rounded-xl shadow-sm">
            <Avatar className="h-12 w-12 bg-[#98ef9b] border-2 border-white/20">
              {/* ✅ Show actual avatar image if available */}
              {avatarUrl && (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={`${firstName}'s avatar`}
                  className="object-cover"
                />
              )}
              {/* ✅ Fallback to initials if no avatar */}
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex items-center text-center">
              <p className="text-white text-sm">Welcome Back {firstName}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 pb-6">
          <nav className="flex flex-col gap-4 mt-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/it" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`
                    flex items-center gap-3
                    px-4 py-3
                    rounded-lg
                    h-12 w-[92%] mx-auto
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#ffca3a] text-[#1a3f1c] shadow-sm"
                        : "bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#88df8b]"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-[92%] mx-auto flex items-center justify-start gap-3 
              text-white hover:bg-white/10 rounded-lg h-12 px-4"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-medium">Log Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}