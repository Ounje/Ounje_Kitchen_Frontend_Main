// app/operations/customers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { customerService, type CustomerFilters as FilterParams } from '@/lib/api/services/customer.service';
import { CustomerFilters, type FilterValues } from '@/components/operations/CustomerFilters';
import { CustomerTable } from '@/components/operations/tabs/CustomerTable';
import { CustomerTableSkeleton } from './loaders/CustomerTableSkeleton';
import { toast } from 'sonner';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});

  const fetchCustomers = async (filterParams: FilterParams = {}) => {
    try {
      setLoading(true);
      const data = await customerService.getCustomers({
        ...filterParams,
        page: currentPage,
        limit: 8
      });
      setCustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(filters);
  }, [currentPage]);

  const handleSearch = (filterValues: FilterValues) => {
    const newFilters: FilterParams = {
      name: filterValues.name || undefined,
      email: filterValues.email || undefined,
      accountStatus: filterValues.accountStatus || undefined
    };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchCustomers(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
    fetchCustomers({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6" style={{ color: '#1A3F1C' }}>
          Customer
        </h1>

        {/* Filters */}
        <CustomerFilters onSearch={handleSearch} onReset={handleReset} />

        {/* Table or Skeleton */}
        {loading ? (
          <CustomerTableSkeleton />
        ) : (
          <>
            <CustomerTable customers={customers} currentPage={currentPage} />

            {/* Pagination */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: '#1A3F1C' }}>
                  Displays
                </span>
                <input
                  type="number"
                  value={8}
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