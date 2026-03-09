'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { vendorService, type Vendor, type Buyer } from '@/lib/api/services/vendor.service';
import { VendorDetailsHeader } from '@/components/operations/Vendors/VendorDetailsHeader';
import { VendorMetrics } from '@/components/operations/Vendors/VendorMetrics';
import { VendorBuyerCard } from '@/components/operations/Vendors/VendorBuyerCard';
import { ActionButtons } from '@/components/operations/Vendors/ActionButtons';
import { VendorDetailsSkeleton } from '../loaders/VendorDetailsSkeleton';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function VendorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerLoading, setBuyerLoading] = useState(true);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const data = await vendorService.getVendorById(vendorId);
        setVendor(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load vendor details');
      } finally {
        setLoading(false);
      }
    };

    const fetchMostFrequentBuyer = async () => {
      try {
        setBuyerLoading(true);
        const data = await vendorService.getMostFrequentBuyer(vendorId);
        setBuyer(data);
      } catch (error: any) {
        console.error('Failed to load buyer:', error);
      } finally {
        setBuyerLoading(false);
      }
    };

    fetchVendorDetails();
    fetchMostFrequentBuyer();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
        <VendorDetailsSkeleton />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ backgroundColor: '#E8F7E8' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
            Vendor not found
          </h2>
          <button
            onClick={() => router.push('/operations/vendors')}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">

        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#1A3F1C' }}>
            Vendor's Details
          </h1>
          <button
            onClick={() => router.push('/operations/vendors')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        {/* Vendor Details Header */}
        <VendorDetailsHeader vendor={vendor} />

        {/* Performance Metrics */}
        <VendorMetrics vendor={vendor} />

        {/* Most Frequent Buyer */}
        <VendorBuyerCard buyer={buyer} loading={buyerLoading} />

        {/* Action Buttons */}
        <ActionButtons
          vendorId={vendor.id}
          accountStatus={vendor.accountStatus}
        />

      </div>
    </div>
  );
}