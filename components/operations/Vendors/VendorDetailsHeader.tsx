// app/operations/vendors/components/VendorDetailsHeader.tsx
'use client';

import { Star } from 'lucide-react';
import { Vendor } from '@/lib/api/services/vendor.service';
import { StatusBadge } from './StatusBadge';
import { CACBadge } from './CACBadge';
import { toast } from 'sonner';
import { vendorService } from '@/lib/api/services/vendor.service';
import { useState } from 'react';

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

  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(vendor.rating);
    const hasHalfStar = vendor.rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-[#FFCA3A] text-[#FFCA3A]"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 fill-[#FFCA3A] text-[#FFCA3A]"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            className="w-5 h-5 text-[#FFCA3A]"
          />
        );
      }
    }
    return stars;
  };

  const isRegistered = vendor.businessStatus === 'registered' && vendor.cacNumber;

  return (
    <div className="bg-white rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Vendor Photo */}
        <div className="flex-shrink-0">
          <img
            src={vendor.avatar}
            alt={vendor.name}
            className="w-full md:w-[240px] h-[200px] rounded-xl object-cover"
          />
        </div>

        {/* Vendor Details */}
        <div className="flex-1">
          <div className="space-y-2">
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Name:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{vendor.name}</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Phone number:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{vendor.phone}</span>
            </div>
            {vendor.serviceType && (
              <div>
                <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                  Service Type:{' '}
                </span>
                <span style={{ color: '#1A3F1C' }}>{vendor.serviceType}</span>
              </div>
            )}
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Rating:{' '}
              </span>
              <div className="inline-flex items-center gap-1 ml-2">
                {renderStars()}
              </div>
            </div>
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Address:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{vendor.address}</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                CAC:{' '}
              </span>
              {vendor.cacNumber ? (
                <span style={{ color: '#1A3F1C' }}>{vendor.cacNumber}</span>
              ) : null}
              <span className="ml-2">
                <CACBadge isRegistered={isRegistered} />
              </span>
              {isRegistered && (
                <button
                  onClick={handleAlertVendor}
                  disabled={alerting}
                  className="ml-3 px-4 py-1.5 rounded text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor: '#1A3F1C' }}
                >
                  {alerting ? 'Alerting...' : 'Alert Vendor'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex md:items-start justify-end">
          <StatusBadge status={vendor.accountStatus} size="lg" />
        </div>
      </div>
    </div>
  );
}