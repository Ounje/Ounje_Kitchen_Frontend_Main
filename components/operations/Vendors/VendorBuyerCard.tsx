import { MapPin } from 'lucide-react';
import { Buyer } from '@/lib/api/services/vendor.service';

interface VendorBuyerCardProps {
  buyer:    Buyer | null;
  loading?: boolean;
}

export function VendorBuyerCard({ buyer, loading = false }: VendorBuyerCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-gray-300 rounded" />
            <div className="h-4 w-48 bg-gray-300 rounded" />
          </div>
          <div className="h-16 w-24 bg-gray-300 rounded-lg flex-shrink-0" />
        </div>
      </div>
    );
  }

  if (!buyer) {
    return (
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
        <p className="text-center text-gray-500 text-sm">No frequent buyer data available</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 sm:p-6 mb-6 w-full flex flex-col sm:flex-row items-start sm:items-center gap-4"
      style={{ backgroundColor: '#1A3F1C' }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {buyer.avatar ? (
          <img src={buyer.avatar} alt={buyer.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white" />
        ) : (
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#98EF9B] flex items-center justify-center
            text-[#1A3F1C] font-bold text-xl flex-shrink-0 border-2 border-white">
            {buyer.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base sm:text-xl font-bold text-white mb-1">Most Frequent Buyer</h3>
        <p className="text-white font-semibold text-sm sm:text-base mb-1">{buyer.name}</p>
        {buyer.address && (
          <div className="flex items-start gap-1">
            <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
            <span className="text-white text-sm break-words">{buyer.address}</span>
          </div>
        )}
      </div>

      {/* Orders count */}
      <div className="bg-white rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-center flex-shrink-0 self-start sm:self-center">
        <p className="text-xs mb-1" style={{ color: '#1A3F1C' }}>Orders here</p>
        <p className="text-3xl sm:text-4xl font-bold" style={{ color: '#1A3F1C' }}>
          {buyer.totalOrders ?? buyer.ordersCount ?? 0}
        </p>
      </div>
    </div>
  );
}