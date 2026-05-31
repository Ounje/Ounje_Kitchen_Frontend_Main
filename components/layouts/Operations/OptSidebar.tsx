"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home, ShoppingCart, Users, Store, Bike,
  Star, UserCircle, LogOut, X, Tag, Radio, CreditCard,
} from "lucide-react";

const navigation = [
  { name: "Home",           href: "/operations",               icon: Home        },
  { name: "Orders",         href: "/operations/orders",        icon: ShoppingCart },
  { name: "Customers",      href: "/operations/customers",     icon: Users        },
  { name: "Vendors",        href: "/operations/vendors",       icon: Store        },
  { name: "Riders",         href: "/operations/riders",        icon: Bike         },
  { name: "Review & Rating",href: "/operations/reviews",       icon: Star         },
  { name: "Promo Codes",    href: "/operations/promos",        icon: Tag          },
  { name: "Transactions",   href: "/operations/transactions",  icon: CreditCard   },
  { name: "Broadcasts",     href: "/operations/notifications", icon: Radio        },
  { name: "Settings",       href: "/operations/settings",      icon: UserCircle   },
];

interface OperationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OperationsSidebar({ isOpen, onClose }: OperationsSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "OP";
  const fullName  = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Operations";
  const avatarUrl = user?.avatar;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-64 flex flex-col
          bg-[#1a3f1c]/95 backdrop-blur-xl border-r border-white/10
          shadow-[0_0_40px_rgba(26,63,28,0.2)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffca3a] flex items-center justify-center flex-shrink-0">
              <span className="text-[#1a3f1c] font-black text-sm">O</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">Ounjefood</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            title="Close menu"
            aria-label="Close menu"
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Profile ───────────────────────────────────────────────────── */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-white/20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />}
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{fullName}</p>
              <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#ffca3a]/20 text-[#ffca3a] px-2 py-0.5 rounded-full">
                Operations
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────────────────── */}
        <ScrollArea className="flex-1 sidebar-scroll">
          <div className="px-3 py-3">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
            <nav className="flex flex-col gap-0.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/operations" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={`
                      relative flex items-center gap-3 px-3 py-3 rounded-xl
                      text-sm font-semibold transition-all duration-300 group overflow-hidden
                      ${isActive
                        ? "bg-gradient-to-r from-[#ffca3a]/90 to-[#ffca3a] text-[#1a3f1c] shadow-[0_4px_12px_rgba(255,202,58,0.3)] hover-lift"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#1a3f1c]/30" />
                    )}
                    <Icon className={`h-[18px] w-[18px] flex-shrink-0 transition-transform duration-300 ${isActive ? "text-[#1a3f1c] scale-110" : "text-white/50 group-hover:text-white/80 group-hover:scale-110"}`} />
                    <span className="truncate tracking-wide">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>

        {/* ── Logout ────────────────────────────────────────────────────── */}
        <div className="px-3 py-3 border-t border-white/10">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150 group"
          >
            <LogOut className="h-4 w-4 flex-shrink-0 group-hover:text-red-400 transition-colors" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
