import { Star, MapPin } from 'lucide-react';
import { Vendor } from '@/lib/api/services/customer.service';

interface CustomerVendorCardProps {
  vendor: Vendor | null;
  loading?: boolean;
}

export function CustomerVendorCard({ vendor, loading = false }: CustomerVendorCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-pulse">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 w-full">
            <div className="h-5 w-32 bg-gray-300 rounded" />
            <div className="h-4 w-48 bg-gray-300 rounded" />
            <div className="h-4 w-40 bg-gray-300 rounded" />
          </div>
          <div className="h-16 w-24 bg-gray-300 rounded-lg flex-shrink-0" />
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
        <p className="text-center text-gray-500 text-sm">No vendor data available</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 sm:p-6 mb-6 w-full flex flex-col sm:flex-row items-start sm:items-center gap-4"
      style={{ backgroundColor: '#1A3F1C' }}
    >
      {/* Vendor Photo */}
      <div className="flex-shrink-0">
        <img
          src={vendor.photo}
          alt={vendor.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
        />
      </div>

      {/* Vendor Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-xl font-bold text-white mb-1">Most Used Vendor</h3>
        <p className="text-white font-semibold mb-1 text-sm sm:text-base">{vendor.name}</p>
        <div className="flex items-center gap-2 mb-1.5">
          <Star className="w-4 h-4 text-[#FFCA3A] fill-[#FFCA3A] flex-shrink-0" />
          <span className="text-white text-sm">
            {vendor.rating} ({vendor.ratingCount})
          </span>
        </div>
        <div className="flex items-start gap-1">
          <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
          <span className="text-white text-sm break-words">{vendor.address}</span>
        </div>
      </div>

      {/* Orders Count Badge */}
      <div className="bg-white rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-center flex-shrink-0 self-start sm:self-center">
        <p className="text-xs mb-1" style={{ color: '#1A3F1C' }}>Orders here</p>
        <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#1A3F1C' }}>
          {vendor.ordersCount}
        </p>
      </div>
    </div>
  );
}