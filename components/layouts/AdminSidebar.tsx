"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  Home,
  Users,
  DollarSign,
  ShoppingCart,
  Bell,
  Shield,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "User & Staff", href: "/admin/users", icon: Users },
  { name: "Revenue", href: "/admin/revenue", icon: DollarSign },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Notifications/Alerts", href: "/admin/notifications", icon: Bell },
  { name: "Permissions", href: "/admin/permissions", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "AD";

  const firstName = user?.firstName || "Admin";
  const avatarUrl = user?.avatar; // ✅ Get avatar from user

  return (
    <>
      {/* Overlay for Mobile */}
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
          w-64 h-screen flex flex-col
          shadow-xl
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: "#1a3f1c" }}
      >
        {/* Top bar */}
        <div className="p-4 flex items-center justify-between">
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

        {/* Profile */}
        <div className="p-5 pb-6">
          <div className="flex flex-col items-center gap-3 p-3 rounded-xl shadow-sm">
            <Avatar className="h-12 w-12 bg-[#98ef9b] border-2 border-white/20">
              {/* ✅ Show actual avatar image if available */}
              {avatarUrl && (
                <AvatarImage 
                  src="../"
                  alt={`${firstName}'s avatar`}
                  className="object-cover"
                />
              )}
              {/* ✅ Fallback to initials if no avatar */}
              <AvatarFallback className=" text-[#1a3f1c] font-bold text-sm">
                {/* {initials} */}
                <Image
                    src="/images/south.svg"
                    alt="South"
                    fill
                    sizes="200px"
                    className="object-cover"
                    priority
                  />
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex items-center text-center">
              <p className="text-white text-sm">Welcome Back {firstName}</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <ScrollArea className="flex-1 px-4 pb-6">
          <nav className="flex flex-col gap-4 mt-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

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
                        ? "bg-[#ffca3a] text-[#1a3f1c]"
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
        <div className="p-2 bg-[#FFFFFF] border-t border-white/10 mb-4 mx-5 rounded-lg">
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full flex items-center gap-3 hover:bg-white/10 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-lg text-[#000000] font-medium">Log Out</span>
          </Button>
        </div>
      </aside>
    </>
  );
}