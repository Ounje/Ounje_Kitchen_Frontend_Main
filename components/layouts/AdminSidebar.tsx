"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Users, DollarSign, ShoppingCart, Bell, Shield, Settings, LogOut, X } from "lucide-react";

const navigation = [
  { name: "Home",          href: "/admin",               icon: Home         },
  { name: "User & Staff",  href: "/admin/users",         icon: Users        },
  { name: "Revenue",       href: "/admin/revenue",       icon: DollarSign   },
  { name: "Orders",        href: "/admin/orders",        icon: ShoppingCart },
  { name: "Notifications", href: "/admin/notifications", icon: Bell         },
  { name: "Permissions",   href: "/admin/permissions",   icon: Shield       },
  { name: "Settings",      href: "/admin/settings",      icon: Settings     },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials  = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "AD";
  const fullName  = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Admin";
  const avatarUrl = user?.avatar;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-64 flex flex-col sidebar-gradient shadow-2xl
          transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffca3a] flex items-center justify-center shrink-0">
              <span className="text-[#1a3f1c] font-black text-sm">O</span>
            </div>
            <span className="text-white font-black text-lg tracking-tight">Ounjefood</span>
          </div>
          <button type="button" onClick={onClose} title="Close menu" aria-label="Close menu"
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Profile */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 shrink-0 ring-2 ring-white/20">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />}
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{fullName}</p>
              <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#ffca3a]/20 text-[#ffca3a] px-2 py-0.5 rounded-full">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 sidebar-scroll">
          <div className="px-3 py-3">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Menu</p>
            <nav className="flex flex-col gap-0.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <Link key={item.name} href={item.href}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                      ${isActive ? "bg-[#ffca3a] text-[#1a3f1c] font-bold shadow-sm" : "text-white/65 hover:text-white hover:bg-white/8"}`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#1a3f1c]" : "text-white/50 group-hover:text-white/80"}`} />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </ScrollArea>

        {/* Logout */}
        <div className="px-3 py-3 border-t border-white/10">
          <button type="button" onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150 group">
            <LogOut className="h-4 w-4 shrink-0 group-hover:text-red-400 transition-colors" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
