'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouteGuard } from '@/hooks/useRouteGuard';
import FinanceSidebar from '@/components/layouts/finance/financeSidebar';
import FinanceHeader from '@/components/layouts/finance/financeHeader';

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useRouteGuard();

  // Auth + department guard
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user) {
      router.push('/');
      return;
    }
    if (user.department?.toLowerCase() !== 'finance' && !user.isSuperAdmin) {
      router.push('/');
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
        <div className="w-12 h-12 border-4 border-[#1A3F1C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || (user.department?.toLowerCase() !== 'finance' && !user.isSuperAdmin)) {
    return null;
  }

  return (
    <div className="flex min-h-screen" className="bg-gray-50">
      <FinanceSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <FinanceHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}