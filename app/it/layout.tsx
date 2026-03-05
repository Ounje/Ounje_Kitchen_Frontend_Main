"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import ITSidebar from "@/components/layouts/it/Itsidebar";
import ITHeader from "@/components/layouts/it/itHeader";
import { useRouteGuard } from "@/hooks/useRouteGuard";

export default function ITLayout({ children }: { children: React.ReactNode }) {
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

    // Check if user is IT department or Super Admin
    if (user.department?.toLowerCase() !== 'it' && !user.isSuperAdmin) {
      router.push("/");
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

  if (!user || (user.department?.toLowerCase() !== 'it' && !user.isSuperAdmin)) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <ITSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col">
        <ITHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}