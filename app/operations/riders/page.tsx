'use client';

import { useState } from 'react';
import { useRiders, useTopPerformers, useSuspendRider, useActivateRider, useDeleteRider } from '@/hooks/useRiders';
import { TopPerformersSection } from '@/components/operations/riders/TopPerformerCard';
import { FiltersBar, type FilterValues } from '@/components/operations/riders/FiltersBar';
import { RidersTable } from '@/components/operations/riders/RidersTable';
import { TopPerformersSkeleton, RidersTableSkeleton } from '@/components/operations/riders/SkeletonLoaders';
import { ConfirmModal, SuccessModal } from '@/components/operations/riders/ActionModals';
import Pagination from '@/components/Pagination';
import type { RiderFilters } from '@/lib/api/services/rider.service';
import { riderService } from '@/lib/api/services/rider.service';
import { downloadCSV } from '@/lib/utils/exportCSV';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RidersPage() {
  const [filters, setFilters] = useState<RiderFilters>({ page: 1, limit: 8 });
  const [pageSize, setPageSize] = useState(8);
  const [exporting, setExporting] = useState(false);

  // Action modal state
  const [suspendModal, setSuspendModal] = useState<{ isOpen: boolean; riderId: string | null }>({ isOpen: false, riderId: null });
  const [activateModal, setActivateModal] = useState<{ isOpen: boolean; riderId: string | null }>({ isOpen: false, riderId: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; riderId: string | null }>({ isOpen: false, riderId: null });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: '' });

  // Data
  const { data: topPerformers, isLoading: topPerformersLoading } = useTopPerformers();
  const { data: ridersData, isLoading: ridersLoading } = useRiders(filters);

  // Mutations
  const suspendMutation = useSuspendRider();
  const activateMutation = useActivateRider();
  const deleteMutation = useDeleteRider();

  // ── Filter handlers ──────────────────────────────────────
  const handleSearch = (filterValues: FilterValues) => {
    setFilters({
      name: filterValues.name || undefined,
      status: (filterValues.status || undefined) as RiderFilters['status'],
      modeOfDelivery: (filterValues.modeOfDelivery || undefined) as RiderFilters['modeOfDelivery'],
      page: 1,
      limit: pageSize,
    });
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: pageSize });
  };

  // ── Pagination handlers ──────────────────────────────────
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setFilters((prev) => ({ ...prev, page: 1, limit: size }));
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data = await riderService.getRiders({ ...filters, page: 1, limit: 10000 });
      const rows = data.riders.map((r) => ({
        Name: r.name,
        Phone: r.phone,
        Zone: r.zone,
        'Account Status': r.accountStatus,
        'Rider Status': r.riderStatus,
        'Mode of Delivery': r.modeOfDelivery,
        'Successful Deliveries': r.successfulDeliveries,
        'Cancelled Deliveries': r.cancelledDeliveries,
        'Total Deliveries': r.totalDeliveries,
      }));
      downloadCSV(rows, `riders_${new Date().toISOString().slice(0, 10)}`);
      toast.success('Riders exported successfully');
    } catch (err: any) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  // ── Action handlers ──────────────────────────────────────
  const confirmSuspend = async () => {
    if (!suspendModal.riderId) return;
    await suspendMutation.mutateAsync(suspendModal.riderId);
    setSuspendModal({ isOpen: false, riderId: null });
    setSuccessModal({ isOpen: true, message: "You've successfully suspended a rider!" });
  };

  const confirmActivate = async () => {
    if (!activateModal.riderId) return;
    await activateMutation.mutateAsync(activateModal.riderId);
    setActivateModal({ isOpen: false, riderId: null });
    setSuccessModal({ isOpen: true, message: 'The account has been activated successfully!' });
  };

  const confirmDelete = async () => {
    if (!deleteModal.riderId) return;
    await deleteMutation.mutateAsync(deleteModal.riderId);
    setDeleteModal({ isOpen: false, riderId: null });
    setSuccessModal({ isOpen: true, message: 'The account has been successfully deleted!' });
  };

  const currentPage = filters.page ?? 1;
  const totalPages = ridersData?.totalPages ?? 1;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>Riders</h1>
            {ridersData?.total != null && (
              <span className="text-sm text-gray-500">{ridersData.total} total</span>
            )}
          </div>
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? 'Exporting...' : 'Download CSV'}
          </button>
        </div>

        {/* Top Performers */}
        {topPerformersLoading ? (
          <TopPerformersSkeleton />
        ) : topPerformers && topPerformers.length > 0 ? (
          <TopPerformersSection performers={topPerformers} />
        ) : null}

        {/* Filters */}
        <FiltersBar onSearch={handleSearch} onReset={handleReset} />

        {/* Table + Pagination */}
        {ridersLoading ? (
          <RidersTableSkeleton />
        ) : ridersData?.riders && ridersData.riders.length > 0 ? (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full">
            <RidersTable
              riders={ridersData.riders}
              currentPage={currentPage}
              pageLimit={pageSize}
              onSuspend={(id) => setSuspendModal({ isOpen: true, riderId: id })}
              onActivate={(id) => setActivateModal({ isOpen: true, riderId: id })}
              onDelete={(id) => setDeleteModal({ isOpen: true, riderId: id })}
            />

            {/* ── Reusable Pagination ── */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <p className="text-gray-500">No riders found</p>
          </div>
        )}

        {/* Modals */}
        <ConfirmModal
          isOpen={suspendModal.isOpen}
          onClose={() => setSuspendModal({ isOpen: false, riderId: null })}
          onConfirm={confirmSuspend}
          title="Are you sure, you want to suspend this rider?"
          loading={suspendMutation.isPending}
        />
        <ConfirmModal
          isOpen={activateModal.isOpen}
          onClose={() => setActivateModal({ isOpen: false, riderId: null })}
          onConfirm={confirmActivate}
          title="Are you sure, you want to activate this rider?"
          loading={activateMutation.isPending}
        />
        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, riderId: null })}
          onConfirm={confirmDelete}
          title="Are you sure, you want to delete this account?"
          loading={deleteMutation.isPending}
        />
        <SuccessModal
          isOpen={successModal.isOpen}
          title={successModal.message}
          onClose={() => setSuccessModal({ isOpen: false, message: '' })}
        />

      </div>
    </div>
  );
}