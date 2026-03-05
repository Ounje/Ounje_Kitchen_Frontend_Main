"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import AdminSidebar from "@/components/layouts/AdminSidebar";
import Header from "@/components/layouts/Header";
import { useRouteGuard } from "@/hooks/useRouteGuard";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

    useRouteGuard();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    if (!user.isSuperAdmin) {
      const dept = user.department?.toLowerCase();
      const routes: Record<string, string> = {
        it: "/it",
        operations: "/operations",
        finance: "/finance",
        investors: "/investor",
      };
      router.push(routes[dept!] || "/");
    }
  }, [loading, isAuthenticated, user, router]);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !user.isSuperAdmin) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}