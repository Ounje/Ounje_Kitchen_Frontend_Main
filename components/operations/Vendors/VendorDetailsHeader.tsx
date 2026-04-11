'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { vendorService, Vendor } from '@/lib/api/services/vendor.service';
import { StatusBadge } from './StatusBadge';
import { CACBadge } from './CACBadge';
import { toast } from 'sonner';

interface VendorDetailsHeaderProps {
  vendor: Vendor;
}

export function VendorDetailsHeader({ vendor }: VendorDetailsHeaderProps) {
  const [alerting, setAlerting] = useState(false);

  const handleAlertVendor = async () => {
    try {
      setAlerting(true);
      await vendorService.alertVendor(vendor.id);
      toast.success('Vendor has been alerted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to alert vendor');
    } finally {
      setAlerting(false);
    }
  };

  const renderStars = () => {
    const fullStars = Math.floor(vendor.rating);
    const hasHalf = vendor.rating % 1 >= 0.5;
    return [0, 1, 2, 3, 4].map((i) => {
      if (i < fullStars)
        return <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFCA3A] text-[#FFCA3A]" />;
      if (i === fullStars && hasHalf)
        return (
          <Star
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FFCA3A] text-[#FFCA3A]"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        );
      return <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFCA3A]" />;
    });
  };

  const isRegistered = vendor.businessStatus === 'registered' && vendor.cacNumber;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

        {/* Photo — guard against empty/null src */}
        <div className="flex-shrink-0 flex sm:block justify-center">
          {vendor.avatar ? (
            <img
              src={vendor.avatar}
              alt={vendor.name}
              className="w-40 h-36 sm:w-52 sm:h-44 rounded-xl object-cover"
            />
          ) : (
            <div
              className="w-40 h-36 sm:w-52 sm:h-44 rounded-xl flex items-center justify-center text-4xl font-bold"
              style={{ backgroundColor: '#98EF9B', color: '#1A3F1C' }}
            >
              {(vendor.name ?? '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-2 text-sm">
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Name:</span>
            <span className="break-words" style={{ color: '#1A3F1C' }}>{vendor.name}</span>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Phone number:</span>
            <span style={{ color: '#1A3F1C' }}>{vendor.phone}</span>
          </div>
          {vendor.serviceType && (
            <div className="flex flex-wrap gap-x-1">
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>Service Type:</span>
              <span style={{ color: '#1A3F1C' }}>{vendor.serviceType}</span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Rating:</span>
            <div className="flex items-center gap-0.5">{renderStars()}</div>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Address:</span>
            <span className="break-words" style={{ color: '#1A3F1C' }}>{vendor.address}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>CAC:</span>
            {vendor.cacNumber && (
              <span style={{ color: '#1A3F1C' }}>{vendor.cacNumber}</span>
            )}
            <CACBadge isRegistered={!!isRegistered} />
            {isRegistered && (
              <button
                onClick={handleAlertVendor}
                disabled={alerting}
                className="px-3 py-1 rounded text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#1A3F1C' }}
              >
                {alerting ? 'Alerting...' : 'Alert Vendor'}
              </button>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex sm:items-start justify-center sm:justify-end flex-shrink-0">
          <StatusBadge status={vendor.accountStatus} size="lg" />
        </div>

      </div>
    </div>
  );
}