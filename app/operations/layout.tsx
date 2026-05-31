"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import OperationsSidebar from "@/components/layouts/Operations/OptSidebar";
import OperationsHeader from "@/components/layouts/Operations/OptHeader";

export default function OperationsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Apply route guard for password change enforcement
  useRouteGuard();

  // Authorization check
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.push("/");
      return;
    }

    // Only Operations department or Super Admin can access
    if (user.department?.toLowerCase() !== 'operations' && !user.isSuperAdmin) {
      router.push("/");
    }
  }, [loading, isAuthenticated, user, router]);

  // Auto-open sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Unauthorized - don't render
  if (!user || (user.department?.toLowerCase() !== 'operations' && !user.isSuperAdmin)) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <OperationsSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <OperationsHeader 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
        />
        
        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto bg-gray-50 page-transition">
          {children}
        </main>
      </div>
    </div>
  );
}