// app/operations/riders/[id]/page.tsx
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
    message: ''
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
      <div className="min-h-screen" style={{ backgroundColor: '#E8F7E8' }}>
        <RiderDetailsSkeleton />
      </div>
    );
  }

  if (!rider) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8F7E8' }}>
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
    {
      value: rider.successfulDeliveries,
      label: 'successful Deliveries',
      bgColor: '#1A3F1C',
      textColor: 'white'
    },
    {
      value: rider.cancelledDeliveries,
      label: 'cancelled Deliveries',
      bgColor: '#D00000',
      textColor: 'white'
    },
    {
      value: rider.processingDeliveries,
      label: 'Processing Deliveries',
      bgColor: '#FFCA3A',
      textColor: '#1A3F1C'
    },
    {
      value: rider.totalDeliveries,
      label: 'Total',
      bgColor: '#98EF9B',
      textColor: '#1A3F1C'
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
            Rider's Details
          </h1>
          <button
            onClick={() => router.push('/operations/riders')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        {/* Rider Info Card */}
        <div className="bg-white rounded-xl p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Rider Photo */}
            <div className="flex-shrink-0">
              <img
                src={rider.photo}
                alt={rider.name}
                className="w-full md:w-48 h-48 rounded-xl object-cover"
              />
            </div>

            {/* Rider Details */}
            <div className="flex-1">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                    Name:{' '}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>{rider.name}</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                    Phone number:{' '}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>{rider.phone}</span>
                </div>
                {rider.serviceMode && (
                  <div>
                    <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                      Service Mode:{' '}
                    </span>
                    <span style={{ color: '#1A3F1C' }}>{rider.serviceMode}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                    Zone:{' '}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>{rider.zone}</span>
                </div>
                <div>
                  <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                    Document:{' '}
                  </span>
                  <Link
                    href={`/operations/riders/${riderId}/document`}
                    className="inline-block px-4 py-1.5 rounded text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#1A3F1C' }}
                  >
                    View Document
                  </Link>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex md:items-start justify-end">
              <RiderStatusBadge status={rider.riderStatus} size="lg" />
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="rounded-xl p-4 md:p-6 flex flex-col items-center justify-center min-h-[100px] md:min-h-[120px]"
                style={{ backgroundColor: metric.bgColor }}
              >
                <div
                  className="text-4xl md:text-5xl font-bold mb-2"
                  style={{ color: metric.textColor }}
                >
                  {metric.value}
                </div>
                <div
                  className="text-xs md:text-sm font-medium text-center"
                  style={{ color: metric.textColor }}
                >
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1A3F1C' }}></div>
              <span className="text-xs md:text-sm" style={{ color: '#1A3F1C' }}>successful Deliveries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D00000' }}></div>
              <span className="text-xs md:text-sm" style={{ color: '#1A3F1C' }}>cancelled Deliveries</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFCA3A' }}></div>
              <span className="text-xs md:text-sm" style={{ color: '#1A3F1C' }}>Processing Deliveries</span>
            </div>
          </div>
        </div>

        {/* Most Frequent Zone */}
        <div
          className="rounded-xl p-4 md:p-6 mb-6"
          style={{ backgroundColor: '#1A3F1C' }}
        >
          <h3 className="text-lg md:text-xl font-bold text-white mb-4">
            Most Frequent Zone: {rider.mostFrequentZone || rider.zone}
          </h3>
          <div className="bg-white rounded-lg h-48 md:h-64 flex items-center justify-center">
            <p className="text-gray-400">Map placeholder</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rider.accountStatus === 'active' ? (
            <button
              onClick={() => setSuspendModal(true)}
              className="py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: '#FFCA3A',
                color: '#1A3F1C'
              }}
            >
              Suspend Account
            </button>
          ) : (
            <button
              onClick={() => setActivateModal(true)}
              className="py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
              style={{
                backgroundColor: '#1A3F1C'
              }}
            >
              Activate Account
            </button>
          )}
          <button
            onClick={() => setDeleteModal(true)}
            className="py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-white"
            style={{
              backgroundColor: '#D00000'
            }}
          >
            Delete Account
          </button>
        </div>

        {/* Modals */}
        <ConfirmModal
          isOpen={suspendModal}
          onClose={() => setSuspendModal(false)}
          onConfirm={confirmSuspend}
          title="Are you sure, you want to suspend this rider?"
          loading={suspendMutation.isPending}
        />

        <ConfirmModal
          isOpen={activateModal}
          onClose={() => setActivateModal(false)}
          onConfirm={confirmActivate}
          title="Are you sure, you want to activate this rider?"
          loading={activateMutation.isPending}
        />

        <ConfirmModal
          isOpen={deleteModal}
          onClose={() => setDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Are you sure, you want to delete this account?"
          loading={deleteMutation.isPending}
        />

        <SuccessModal
          isOpen={successModal.isOpen}
          title={successModal.message}
          onClose={() => {
            setSuccessModal({ isOpen: false, message: '' });
            router.push('/operations/riders');
          }}
        />
      </div>
    </div>
  );
}