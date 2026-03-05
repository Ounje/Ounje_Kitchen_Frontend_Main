// app/operations/vendors/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { vendorService, type VendorFilters as FilterParams, type TopVendor } from '@/lib/api/services/vendor.service';
import { VendorTopChart } from '@/components/operations/Vendors/VendorTopChart';
import { VendorFilters, type FilterValues } from '@/components/operations/Vendors/VendorFilters';
import { VendorTable } from '@/components/operations/Vendors/VendorTable';
import { VendorTableSkeleton } from '@/app/operations/vendors/loaders/VendorTableSkeleton';
import { toast } from 'sonner';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [topVendorsLoading, setTopVendorsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});

  const fetchVendors = async (filterParams: FilterParams = {}) => {
    try {
      setLoading(true);
      const data = await vendorService.getVendors({
        ...filterParams,
        page: currentPage,
        limit: 7
      });
      setVendors(data.vendors);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchTopVendors();
  }, []);

  useEffect(() => {
    fetchVendors(filters);
  }, [currentPage]);

  const handleSearch = (filterValues: FilterValues) => {
    const newFilters: FilterParams = {
      name: filterValues.name || undefined,
      accountStatus: filterValues.accountStatus || undefined,
      businessStatus: filterValues.businessStatus || undefined
    };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchVendors(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
    fetchVendors({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Top Chart Section */}
        <VendorTopChart topVendors={topVendors} loading={topVendorsLoading} />

        {/* Filters */}
        <VendorFilters onSearch={handleSearch} onReset={handleReset} />

        {/* Table or Skeleton */}
        {loading ? (
          <VendorTableSkeleton />
        ) : (
          <>
            <VendorTable vendors={vendors} currentPage={currentPage} />

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#1A3F1C' }}>
                  Displays
                </span>
                <input
                  type="number"
                  value={7}
                  readOnly
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                  style={{ color: '#1A3F1C' }}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  style={{ color: '#1A3F1C' }}
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  style={{ color: '#1A3F1C' }}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {[...Array(Math.min(7, totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNum
                          ? 'text-white'
                          : 'border border-gray-300'
                      }`}
                      style={{
                        backgroundColor: currentPage === pageNum ? '#1A3F1C' : 'white',
                        color: currentPage === pageNum ? 'white' : '#1A3F1C'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  style={{ color: '#1A3F1C' }}
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                  style={{ color: '#1A3F1C' }}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}