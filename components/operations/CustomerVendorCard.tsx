// app/operations/customers/components/CustomerVendorCard.tsx
import { Star, MapPin } from 'lucide-react';
import { Vendor } from '@/lib/api/services/customer.service';

interface CustomerVendorCardProps {
  vendor: Vendor | null;
  loading?: boolean;
}

export function CustomerVendorCard({ vendor, loading = false }: CustomerVendorCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-16 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-white rounded-xl p-6 mb-6">
        <p className="text-center text-gray-500">No vendor data available</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4"
      style={{ backgroundColor: '#1A3F1C' }}
    >
      {/* Vendor Photo */}
      <div className="flex-shrink-0">
        <img
          src={vendor.photo}
          alt={vendor.name}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>

      {/* Vendor Details */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1">Most Used Vendor</h3>
        <p className="text-white font-semibold mb-1">{vendor.name}</p>
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-[#FFCA3A] fill-[#FFCA3A]" />
          <span className="text-white text-sm">
            {vendor.rating} ({vendor.ratingCount})
          </span>
        </div>
        <div className="flex items-start gap-1">
          <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
          <span className="text-white text-sm">{vendor.address}</span>
        </div>
      </div>

      {/* Orders Count Badge */}
      <div className="bg-white rounded-lg px-6 py-4 text-center">
        <p className="text-xs mb-1" style={{ color: '#1A3F1C' }}>
          Orders here
        </p>
        <p className="text-4xl font-bold" style={{ color: '#1A3F1C' }}>
          {vendor.ordersCount}
        </p>
      </div>
    </div>
  );
}