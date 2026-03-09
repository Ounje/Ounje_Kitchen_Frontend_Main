'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorService, type VendorFilters as FilterParams, type TopVendor } from '@/lib/api/services/vendor.service';
import { VendorTopChart } from '@/components/operations/Vendors/VendorTopChart';
import { VendorFilters, type FilterValues } from '@/components/operations/Vendors/VendorFilters';
import { VendorTable } from '@/components/operations/Vendors/VendorTable';
import { VendorTableSkeleton } from '@/app/operations/vendors/loaders/VendorTableSkeleton';
import Pagination from '@/components/Pagination';
import { toast } from 'sonner';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [topVendorsLoading, setTopVendorsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterParams>({});
  const [pageSize, setPageSize] = useState(7);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 7,
  });

  // ── Fetch top vendors (once) ───────────────────────────
  useEffect(() => {
    const fetchTopVendors = async () => {
      try {
        setTopVendorsLoading(true);
        const data = await vendorService.getTopVendors();
        setTopVendors(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load top vendors');
      } finally {
        setTopVendorsLoading(false);
      }
    };
    fetchTopVendors();
  }, []);

  // ── Fetch paginated vendor list ────────────────────────
  const loadVendors = useCallback(
    async (page: number, activeFilters: FilterParams, limit = pageSize) => {
      try {
        setLoading(true);
        const data = await vendorService.getVendors({
          ...activeFilters,
          page,
          limit,
        });
        setVendors(data.vendors);
        setPagination({
          page: data.page ?? page,
          totalPages: data.totalPages,
          total: data.total ?? 0,
          limit,
        });
      } catch (error: any) {
        toast.error(error.message || 'Failed to load vendors');
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  );

  useEffect(() => {
    loadVendors(1, {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──────────────────────────────────────────
  const handleSearch = (filterValues: FilterValues) => {
    const newFilters: FilterParams = {
      name: filterValues.name || undefined,
      accountStatus: (filterValues.accountStatus || undefined) as 'active' | 'suspended' | undefined,
      businessStatus: (filterValues.businessStatus || undefined) as 'registered' | 'unregistered' | 'pending' | undefined,
    };
    setFilters(newFilters);
    loadVendors(1, newFilters);
  };

  const handleReset = () => {
    setFilters({});
    loadVendors(1, {});
  };

  const handlePageChange = (page: number) => {
    loadVendors(page, filters);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    loadVendors(1, filters, size);
  };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
            Vendors
          </h1>
          {pagination.total > 0 && (
            <span className="text-sm text-gray-500">{pagination.total} total</span>
          )}
        </div>

        {/* Top Chart */}
        <VendorTopChart topVendors={topVendors} loading={topVendorsLoading} />

        {/* Filters */}
        <VendorFilters onSearch={handleSearch} onReset={handleReset} />

        {/* Table */}
        {loading ? (
          <VendorTableSkeleton />
        ) : (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full">
            <VendorTable
              vendors={vendors}
              currentPage={pagination.page}
              pageLimit={pagination.limit}
            />

            {/* ── Reusable Pagination ── */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}

      </div>
    </div>
  );
}