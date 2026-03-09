'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { useRider, useSuspendRider, useActivateRider, useDeleteRider } from '@/hooks/useRiders';
import { RiderStatusBadge } from '@/components/operations/riders/StatusBadge';
import { RiderDetailsSkeleton } from '@/components/operations/riders/SkeletonLoaders';
import { ConfirmModal, SuccessModal } from '@/components/operations/riders/ActionModals';

export default function RiderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const riderId = params.id as string;

  const [suspendModal, setSuspendModal] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: '',
  });

  const { data: rider, isLoading } = useRider(riderId);
  const suspendMutation = useSuspendRider();
  const activateMutation = useActivateRider();
  const deleteMutation = useDeleteRider();

  const confirmSuspend = async () => {
    await suspendMutation.mutateAsync(riderId);
    setSuspendModal(false);
    setSuccessModal({ isOpen: true, message: "You've successfully suspended a rider!" });
  };

  const confirmActivate = async () => {
    await activateMutation.mutateAsync(riderId);
    setActivateModal(false);
    setSuccessModal({ isOpen: true, message: 'The account has been activated successfully!' });
  };

  const confirmDelete = async () => {
    await deleteMutation.mutateAsync(riderId);
    setDeleteModal(false);
    router.push('/operations/riders');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
        <RiderDetailsSkeleton />
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ backgroundColor: '#E8F7E8' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
            Rider not found
          </h2>
          <button
            onClick={() => router.push('/operations/riders')}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Back to Riders
          </button>
        </div>
      </div>
    );
  }

  const metrics = [
    { value: rider.successfulDeliveries,  label: 'successful Deliveries',  bgColor: '#1A3F1C', textColor: 'white' },
    { value: rider.cancelledDeliveries,   label: 'cancelled Deliveries',   bgColor: '#D00000', textColor: 'white' },
    { value: rider.processingDeliveries,  label: 'Processing Deliveries',  bgColor: '#FFCA3A', textColor: '#1A3F1C' },
    { value: rider.totalDeliveries,       label: 'Total',                  bgColor: '#98EF9B', textColor: '#1A3F1C' },
  ];

  const legend = [
    { color: '#1A3F1C', label: 'successful Deliveries' },
    { color: '#D00000', label: 'cancelled Deliveries' },
    { color: '#FFCA3A', label: 'Processing Deliveries' },
  ];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
            Rider's Details
          </h1>
          <button
            onClick={() => router.push('/operations/riders')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        {/* Rider Info Card */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

            {/* Photo */}
            <div className="flex-shrink-0 flex sm:block justify-center">
              <img
                src={rider.photo}
                alt={rider.name}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 space-y-2 text-sm">
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold" style={{ color: '#1A3F1C' }}>Name:</span>
                <span className="break-words" style={{ color: '#1A3F1C' }}>{rider.name}</span>
              </div>
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold" style={{ color: '#1A3F1C' }}>Phone number:</span>
                <span style={{ color: '#1A3F1C' }}>{rider.phone}</span>
              </div>
              {rider.serviceMode && (
                <div className="flex flex-wrap gap-x-1">
                  <span className="font-semibold" style={{ color: '#1A3F1C' }}>Service Mode:</span>
                  <span style={{ color: '#1A3F1C' }}>{rider.serviceMode}</span>
                </div>
              )}
              <div className="flex flex-wrap gap-x-1">
                <span className="font-semibold" style={{ color: '#1A3F1C' }}>Zone:</span>
                <span style={{ color: '#1A3F1C' }}>{rider.zone}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold" style={{ color: '#1A3F1C' }}>Document:</span>
                <Link
                  href={`/operations/riders/${riderId}/document`}
                  className="inline-block px-4 py-1.5 rounded text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#1A3F1C' }}
                >
                  View Document
                </Link>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex sm:items-start justify-center sm:justify-end flex-shrink-0">
              <RiderStatusBadge status={rider.riderStatus} size="lg" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-6 w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((m, i) => (
              <div
                key={i}
                className="rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[100px]"
                style={{ backgroundColor: m.bgColor }}
              >
                <div className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2" style={{ color: m.textColor }}>
                  {m.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-center leading-tight" style={{ color: m.textColor }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
            {legend.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs sm:text-sm" style={{ color: '#1A3F1C' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Frequent Zone */}
        <div className="rounded-xl p-4 sm:p-6 mb-6 w-full" style={{ backgroundColor: '#1A3F1C' }}>
          <h3 className="text-base sm:text-xl font-bold text-white mb-4">
            Most Frequent Zone: {rider.mostFrequentZone || rider.zone}
          </h3>
          <div className="bg-white rounded-lg h-40 sm:h-56 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Map placeholder</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {rider.accountStatus === 'active' ? (
            <button
              onClick={() => setSuspendModal(true)}
              className="py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#FFCA3A', color: '#1A3F1C' }}
            >
              Suspend Account
            </button>
          ) : (
            <button
              onClick={() => setActivateModal(true)}
              className="py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
              style={{ backgroundColor: '#1A3F1C' }}
            >
              Activate Account
            </button>
          )}
          <button
            onClick={() => setDeleteModal(true)}
            className="py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
            style={{ backgroundColor: '#D00000' }}
          >
            Delete Account
          </button>
        </div>

        {/* Modals */}
        <ConfirmModal isOpen={suspendModal} onClose={() => setSuspendModal(false)} onConfirm={confirmSuspend} title="Are you sure, you want to suspend this rider?" loading={suspendMutation.isPending} />
        <ConfirmModal isOpen={activateModal} onClose={() => setActivateModal(false)} onConfirm={confirmActivate} title="Are you sure, you want to activate this rider?" loading={activateMutation.isPending} />
        <ConfirmModal isOpen={deleteModal} onClose={() => setDeleteModal(false)} onConfirm={confirmDelete} title="Are you sure, you want to delete this account?" loading={deleteMutation.isPending} />
        <SuccessModal isOpen={successModal.isOpen} title={successModal.message} onClose={() => { setSuccessModal({ isOpen: false, message: '' }); router.push('/operations/riders'); }} />

      </div>
    </div>
  );
}