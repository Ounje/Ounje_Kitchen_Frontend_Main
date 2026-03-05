// app/operations/vendors/components/VendorBuyerCard.tsx
import { MapPin } from 'lucide-react';
import { Buyer } from '@/lib/api/services/vendor.service';

interface VendorBuyerCardProps {
  buyer: Buyer | null;
  loading?: boolean;
}

export function VendorBuyerCard({ buyer, loading = false }: VendorBuyerCardProps) {
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

  if (!buyer) {
    return (
      <div className="bg-white rounded-xl p-6 mb-6">
        <p className="text-center text-gray-500">No buyer data available</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6 mb-6 flex flex-col md:flex-row items-start md:items-center gap-4"
      style={{ backgroundColor: '#1A3F1C' }}
    >
      {/* Buyer Photo */}
      <div className="flex-shrink-0">
        <img
          src={buyer.photo}
          alt={buyer.name}
          className="w-20 h-20 rounded-full object-cover"
        />
      </div>

      {/* Buyer Details */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-white mb-1">Most Frequent Buyer</h3>
        <p className="text-white font-semibold mb-1">{buyer.name}</p>
        <div className="flex items-start gap-1">
          <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
          <span className="text-white text-sm">{buyer.address}</span>
        </div>
      </div>

      {/* Orders Count Badge */}
      <div className="bg-white rounded-lg px-6 py-4 text-center">
        <p className="text-xs mb-1" style={{ color: '#1A3F1C' }}>
          Orders here
        </p>
        <p className="text-4xl font-bold" style={{ color: '#1A3F1C' }}>
          {buyer.ordersCount}
        </p>
      </div>
    </div>
  );
}