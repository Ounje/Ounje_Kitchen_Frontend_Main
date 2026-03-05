// app/operations/customers/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { customerService, type Customer, type Vendor } from '@/lib/api/services/customer.service';
import { CustomerDetailsHeader } from '@/components/operations/CustomerDetailsHeader';
import { CustomerStats } from '@/components/operations/CustomerStats';
import { CustomerVendorCard } from '@/components/operations/CustomerVendorCard';
import { ActionButtons } from '@/components/operations/ActionButtons';
import { CustomerDetailsSkeleton } from '@/app/operations/customers/loaders/CustomerDetailsSkeleton';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorLoading, setVendorLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomerById(customerId);
        setCustomer(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load customer details');
      } finally {
        setLoading(false);
      }
    };

    const fetchMostUsedVendor = async () => {
      try {
        setVendorLoading(true);
        const data = await customerService.getMostUsedVendor(customerId);
        setVendor(data);
      } catch (error: any) {
        // Vendor data is optional, so just log error
        console.error('Failed to load vendor:', error);
      } finally {
        setVendorLoading(false);
      }
    };

    fetchCustomerDetails();
    fetchMostUsedVendor();
  }, [customerId]);

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#E8F7E8' }}>
        <CustomerDetailsSkeleton />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8F7E8' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
            Customer not found
          </h2>
          <button
            onClick={() => router.push('/operations/customers')}
            className="px-6 py-2 rounded-lg text-white"
            style={{ backgroundColor: '#1A3F1C' }}
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8F7E8' }}>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold" style={{ color: '#1A3F1C' }}>
            Customer's Details
          </h1>
          <button
            onClick={() => router.push('/operations/customers')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        {/* Customer Details Header */}
        <CustomerDetailsHeader customer={customer} />

        {/* Activities Stats */}
        <CustomerStats customer={customer} />

        {/* Most Used Vendor */}
        <CustomerVendorCard vendor={vendor} loading={vendorLoading} />

        {/* Action Buttons */}
        <ActionButtons
          customerId={customer.id}
          accountStatus={customer.accountStatus}
        />
      </div>
    </div>
  );
}