// app/operations/riders/page.tsx
'use client';

import { useState } from 'react';
import { useRiders, useTopPerformers, useSuspendRider, useActivateRider, useDeleteRider } from '@/hooks/useRiders';
import { TopPerformersSection } from '@/components/operations/riders/TopPerformerCard';
import { FiltersBar, type FilterValues } from '@/components/operations/riders/FiltersBar';
import { RidersTable } from '@/components/operations/riders/RidersTable';
import { TopPerformersSkeleton, RidersTableSkeleton } from '@/components/operations/riders/SkeletonLoaders';
import { ConfirmModal, SuccessModal } from '@/components/operations/riders/ActionModals';
import type { RiderFilters } from '@/lib/api/services/rider.service';

export default function RidersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<RiderFilters>({
    page: 1,
    limit: 8
  });

  // Action modals state
  const [suspendModal, setSuspendModal] = useState<{ isOpen: boolean; riderId: string | null }>({
    isOpen: false,
    riderId: null
  });
  const [activateModal, setActivateModal] = useState<{ isOpen: boolean; riderId: string | null }>({
    isOpen: false,
    riderId: null
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; riderId: string | null }>({
    isOpen: false,
    riderId: null
  });
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ''
  });

  // Fetch data from backend
  const { data: topPerformers, isLoading: topPerformersLoading } = useTopPerformers();
  const { data: ridersData, isLoading: ridersLoading } = useRiders(filters);

  // Mutations
  const suspendMutation = useSuspendRider();
  const activateMutation = useActivateRider();
  const deleteMutation = useDeleteRider();

  const handleSearch = (filterValues: FilterValues) => {
    const newFilters: RiderFilters = {
      name: filterValues.name || undefined,
      status: filterValues.status as any || undefined,
      modeOfDelivery: filterValues.modeOfDelivery as any || undefined,
      page: 1,
      limit: 8
    };
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ page: 1, limit: 8 });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, page }));
  };

  // Action handlers
  const handleSuspend = (riderId: string) => {
    setSuspendModal({ isOpen: true, riderId });
  };

  const handleActivate = (riderId: string) => {
    setActivateModal({ isOpen: true, riderId });
  };

  const handleDelete = (riderId: string) => {
    setDeleteModal({ isOpen: true, riderId });
  };

  const confirmSuspend = async () => {
    if (suspendModal.riderId) {
      await suspendMutation.mutateAsync(suspendModal.riderId);
      setSuspendModal({ isOpen: false, riderId: null });
      setSuccessModal({ isOpen: true, message: "You've successfully suspended a rider!" });
    }
  };

  const confirmActivate = async () => {
    if (activateModal.riderId) {
      await activateMutation.mutateAsync(activateModal.riderId);
      setActivateModal({ isOpen: false, riderId: null });
      setSuccessModal({ isOpen: true, message: 'The account has been activated successfully!' });
    }
  };

  const confirmDelete = async () => {
    if (deleteModal.riderId) {
      await deleteMutation.mutateAsync(deleteModal.riderId);
      setDeleteModal({ isOpen: false, riderId: null });
      setSuccessModal({ isOpen: true, message: 'The account has been successfully deleted!' });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="max-w-7xl mx-auto">
        {/* Top Performers Section */}
        {topPerformersLoading ? (
          <TopPerformersSkeleton />
        ) : topPerformers && topPerformers.length > 0 ? (
          <TopPerformersSection performers={topPerformers} />
        ) : null}

        {/* Filters */}
        <FiltersBar onSearch={handleSearch} onReset={handleReset} />

        {/* Table */}
        {ridersLoading ? (
          <RidersTableSkeleton />
        ) : ridersData?.riders && ridersData.riders.length > 0 ? (
          <>
            <RidersTable
              riders={ridersData.riders}
              currentPage={currentPage}
              onSuspend={handleSuspend}
              onActivate={handleActivate}
              onDelete={handleDelete}
            />

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
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                  style={{ color: '#1A3F1C' }}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-sm"
                  style={{ color: '#1A3F1C' }}
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-sm"
                  style={{ color: '#1A3F1C' }}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {ridersData && [...Array(Math.min(7, ridersData.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === pageNum ? 'text-white' : 'border border-gray-300'
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
                  disabled={ridersData && currentPage === ridersData.totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-sm"
                  style={{ color: '#1A3F1C' }}
                >
                  Next
                </button>
                <button
                  onClick={() => ridersData && handlePageChange(ridersData.totalPages)}
                  disabled={ridersData && currentPage === ridersData.totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 text-sm"
                  style={{ color: '#1A3F1C' }}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
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