'use client';

import { useState, useEffect, useCallback } from 'react';
import { vendorService, type VendorFilters as FilterParams, type TopVendor } from '@/lib/api/services/vendor.service';
import { TopChart, type TopChartEntry } from '@/components/operations/TopChart';
import { VendorFilters, type FilterValues } from '@/components/operations/Vendors/VendorFilters';
import { VendorTable } from '@/components/operations/Vendors/VendorTable';
import { VendorTableSkeleton } from '@/app/operations/vendors/loaders/VendorTableSkeleton';
import Pagination from '@/components/Pagination';
import { toast } from 'sonner';
import { downloadCSV } from '@/lib/utils/exportCSV';
import { Download, Loader2, Store } from 'lucide-react';
import { formatNigerianPhone } from '@/lib/utils/formatPhone';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [topVendors, setTopVendors] = useState<TopVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [topVendorsLoading, setTopVendorsLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data = await vendorService.getVendors({ ...filters, page: 1, limit: 10000 });
      const rows = data.vendors.map((v) => ({
        Name: v.name,
        Phone: formatNigerianPhone(v.phone),
        Address: v.address,
        'Account Status': v.accountStatus,
        'Business Status': v.businessStatus,
        Rating: v.rating,
        'Total Orders': v.totalOrders,
        'Successful Orders': v.successfulOrders,
        'Cancelled Orders': v.cancelledOrders,
      }));
      downloadCSV(rows, `vendors_${new Date().toISOString().slice(0, 10)}`);
      toast.success('Vendors exported successfully');
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1a3f1c]/10 flex items-center justify-center shrink-0">
              <Store className="h-5 w-5 text-[#1a3f1c]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900">Vendors</h1>
              {pagination.total > 0 && <p className="text-xs text-gray-400">{pagination.total.toLocaleString()} total vendors</p>}
            </div>
          </div>
          <button type="button"
            onClick={handleExportCSV} disabled={exporting || loading}
            className="inline-flex items-center gap-2 h-9 px-4 bg-[#1a3f1c] text-white text-sm font-semibold rounded-lg hover:bg-[#163318] active:scale-[0.98] transition-all disabled:opacity-50 shrink-0">
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
        </div>

        {/* Top Chart */}
        <TopChart
          title="Vendor"
          statLabel="Completed"
          loading={topVendorsLoading}
          items={topVendors.map((v): TopChartEntry => ({
            id: v.id, name: v.name, avatar: v.avatar, phone: v.phone,
            location: v.location, stat: v.completedOrders, rank: v.rank,
          }))}
        />

        {/* Filters */}
        <VendorFilters onSearch={handleSearch} onReset={handleReset} />

        {/* Table */}
        {loading ? (
          <VendorTableSkeleton />
        ) : (
          <div className="modern-table-container">
            <VendorTable
              vendors={vendors}
              currentPage={pagination.page}
              pageLimit={pagination.limit}
            />
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
  );
}