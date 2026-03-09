'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { customerService, type Customer } from '@/lib/api/services/customer.service';
import { CustomerFilters, type FilterValues } from '@/components/operations/CustomerFilters';
import { StatusBadge } from '@/components/operations/StatusBadge';
import Pagination from '@/components/Pagination';
import { toast } from 'sonner';

// ── Table Skeleton ─────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {[...Array(7)].map((_, i) => (
        <tr key={i} className="border-b border-gray-100 animate-pulse">
          {[...Array(6)].map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues>({ name: '', email: '', accountStatus: '' });
  const [pageSize, setPageSize] = useState(7);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 7,
  });

  // ── Fetch ────────────────────────────────────────────────
  const loadCustomers = useCallback(
    async (page: number, activeFilters: FilterValues, limit = pageSize) => {
      setLoading(true);
      try {
        const res = await customerService.getCustomers({
          page,
          limit,
          ...(activeFilters.name ? { name: activeFilters.name } : {}),
          ...(activeFilters.email ? { email: activeFilters.email } : {}),
          ...(activeFilters.accountStatus
            ? { accountStatus: activeFilters.accountStatus as 'active' | 'suspended' | 'unverified' }
            : {}),
        });
        setCustomers(res.data);
        setPagination({
          page: res.page,
          totalPages: res.totalPages,
          total: res.total,
          limit: res.limit,
        });
      } catch (error: any) {
        toast.error(error.message || 'Failed to load customers');
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    loadCustomers(1, filters);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ─────────────────────────────────────────────
  const handleSearch = (newFilters: FilterValues) => {
    setFilters(newFilters);
    loadCustomers(1, newFilters);
  };

  const handleReset = () => {
    const empty: FilterValues = { name: '', email: '', accountStatus: '' };
    setFilters(empty);
    loadCustomers(1, empty);
  };

  const handlePageChange = (page: number) => {
    loadCustomers(page, filters);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    loadCustomers(1, filters, size);
  };

  // ── Table header classes ──────────────────────────────────
  const thCls =
    'px-4 py-3 text-left text-sm font-semibold text-[#1A3F1C] bg-[#c8f0c8] whitespace-nowrap';

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
            Customers
          </h1>
          <span className="text-sm text-gray-500">
            {pagination.total} total
          </span>
        </div>

        {/* Filters */}
        <CustomerFilters onSearch={handleSearch} onReset={handleReset} />

        {/* Table Card */}
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className={`${thCls} rounded-tl-xl`} style={{ width: 48 }}>S/N</th>
                  <th className={thCls} style={{ width: 200 }}>Name</th>
                  <th className={thCls}>Email</th>
                  <th className={thCls} style={{ width: 140 }}>Phone</th>
                  <th className={thCls} style={{ width: 120 }}>Status</th>
                  <th className={`${thCls} rounded-tr-xl`} style={{ width: 100 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400 text-sm">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  customers.map((customer, idx) => {
                    const sn = (pagination.page - 1) * pagination.limit + idx + 1;
                    return (
                      <tr
                        key={customer.id}
                        className="border-b border-gray-100 hover:bg-[#f7fdf7] transition-colors"
                      >
                        {/* S/N */}
                        <td className="px-4 py-3 text-sm text-gray-600">{sn}</td>

                        {/* Name + Avatar */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={customer.avatar || '/placeholder-avatar.png'}
                                alt={customer.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-800 truncate">
                              {customer.name}
                            </span>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">
                          {customer.email}
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {customer.phone}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={customer.accountStatus} size="sm" />
                        </td>

                        {/* View Details */}
                        <td className="px-4 py-3">
                          <button
                            onClick={() => router.push(`/operations/customers/${customer.id}`)}
                            className="text-sm font-semibold hover:underline whitespace-nowrap"
                            style={{ color: '#1A3F1C' }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Reusable Pagination ── */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>

      </div>
    </div>
  );
}