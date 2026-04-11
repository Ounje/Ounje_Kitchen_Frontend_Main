"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  ShoppingCart,
  Users,
  Store,
  Bike,
  Star,
  UserCircle,
  LogOut,
  X,
  Tag,
  Radio,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/operations", icon: Home },
  { name: "Orders", href: "/operations/orders", icon: ShoppingCart },
  { name: "Customers", href: "/operations/customers", icon: Users },
  { name: "Vendors", href: "/operations/vendors", icon: Store },
  { name: "Riders", href: "/operations/riders", icon: Bike },
  { name: "Review & Rating", href: "/operations/reviews", icon: Star },
  { name: "Promos", href: "/operations/promos", icon: Tag },
  { name: "Broadcasts", href: "/operations/notifications", icon: Radio },
  { name: "Settings", href: "/operations/settings", icon: UserCircle },
];

interface OperationsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OperationsSidebar({ isOpen, onClose }: OperationsSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "OP";

  const firstName = user?.firstName || "User";
  const avatarUrl = user?.avatar;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen
          w-[280px] sm:w-64
          flex flex-col
          shadow-xl border-r border-transparent
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 bg-[#1a3f1c]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 flex items-center justify-between border-b border-white/10 min-h-[64px] bg-[#1a3f1c]">
          <h1 className="text-white text-xl font-black tracking-tight">
            Ounjefood
          </h1>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/10 h-9 w-9"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="p-4 sm:p-5 pb-4 sm:pb-6 border-b border-white/10 bg-[#1a3f1c]">
          <div className="flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl shadow-sm bg-[#1a3f1c]">
            <Avatar className="h-14 w-14 sm:h-12 sm:w-12 bg-[#98ef9b] border-2 border-white/20">
              {avatarUrl && (
                <AvatarImage 
                  src={avatarUrl} 
                  alt={`${firstName}'s avatar`}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex items-center text-center">
              <p className="text-white text-xs sm:text-sm font-semibold">
                welcome Back {firstName}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 sm:px-4 pb-6 bg-[#1a3f1c]">
          <nav className="flex flex-col gap-3 sm:gap-4 mt-2 sm:mt-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/operations" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={`
                    flex items-center gap-3
                    px-3 sm:px-4 py-3 sm:py-3
                    rounded-lg
                    min-h-[48px] sm:h-12
                    w-full sm:w-[92%] mx-auto
                    text-xs sm:text-sm font-medium
                    transition-all duration-200
                    touch-manipulation
                    ${
                      isActive
                        ? "bg-[#ffca3a] text-[#1a3f1c] font-black shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10"
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
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#1a3f1c]">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full flex items-center justify-start gap-3 text-white hover:bg-white/10 active:bg-white/20 rounded-lg min-h-[48px] sm:h-12 px-3 sm:px-4 touch-manipulation"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs sm:text-sm font-medium">Log Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}