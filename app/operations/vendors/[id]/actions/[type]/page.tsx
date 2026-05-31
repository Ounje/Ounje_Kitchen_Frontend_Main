'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { vendorService } from '@/lib/api/services/vendor.service';
import { ConfirmActionModal } from '@/components/operations/Vendors/Modal/ConfirmActionModal';
import { SuccessModal } from '@/components/operations/Vendors/Modal/SuccessModal';
import { toast } from 'sonner';

type ActionType = 'suspend' | 'activate' | 'delete';

const actionConfig = {
  suspend: {
    confirmTitle: 'Are you sure, you want to suspend this user?',
    successTitle: "You've successfully suspended a user!",
  },
  activate: {
    confirmTitle: 'Are you sure, you want to activate this user?',
    successTitle: 'The account has been activated successfully!',
  },
  delete: {
    confirmTitle: 'Are you sure, you want to delete this account?',
    successTitle: 'The account has successfully been deleted!',
  },
};

export default function VendorActionPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;
  const actionType = params.type as ActionType;

  const [showConfirm, setShowConfirm] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!['suspend', 'activate', 'delete'].includes(actionType)) {
      toast.error('Invalid action type');
      router.push('/operations/vendors');
    }
  }, [actionType, router]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      switch (actionType) {
        case 'suspend':
          await vendorService.suspendVendor(vendorId);
          break;
        case 'activate':
          await vendorService.activateVendor(vendorId);
          break;
        case 'delete':
          await vendorService.deleteVendor(vendorId);
          break;
      }
      setShowConfirm(false);
      setShowSuccess(true);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${actionType} vendor`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => router.push(`/operations/vendors/${vendorId}`);
  const handleGoHome = () => router.push('/operations/vendors');

  const config = actionConfig[actionType];

  return (
    <div className="min-h-screen w-full" className="bg-gray-50">
      <ConfirmActionModal
        isOpen={showConfirm}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={config?.confirmTitle}
        loading={loading}
      />
      <SuccessModal
        isOpen={showSuccess}
        title={config?.successTitle}
        onGoHome={handleGoHome}
      />
    </div>
  );
}