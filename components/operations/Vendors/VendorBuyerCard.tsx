import { MapPin } from "lucide-react";
import { Buyer } from "@/lib/api/services/vendor.service";

interface VendorBuyerCardProps {
  buyer: Buyer | null;
  loading?: boolean;
}

export function VendorBuyerCard({ buyer, loading = false }: VendorBuyerCardProps) {
  if (loading) {
    return (
      <div className="glass-card p-4 sm:p-6 mb-6 w-full animate-pulse">
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
      <div className="glass-card p-4 sm:p-6 mb-6 w-full">
        <p className="text-center text-gray-500 text-sm">No frequent buyer data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card hover-lift rounded-2xl p-5 sm:p-7 mb-6 w-full flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-br from-[#1a3f1c] to-[#2a5c2d] border border-white/10 shadow-[0_8px_30px_rgb(26,63,28,0.15)] relative overflow-hidden group">
      {/* Decorative background accent */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ffca3a] rounded-full mix-blend-overlay filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
      {/* Avatar */}
      <div className="flex-shrink-0">
        {buyer.avatar ? (
          <img
            src={buyer.avatar}
            alt={buyer.name}
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white"
          />
        ) : (
          <div
            className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#98EF9B] flex items-center justify-center
            text-[#1A3F1C] font-bold text-xl flex-shrink-0 border-2 border-white"
          >
            {buyer.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
          Most Frequent Buyer
        </p>
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{buyer.name}</h3>
        {buyer.address && (
          <div className="flex items-start gap-1">
            <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
            <span className="text-white text-sm break-words">{buyer.address}</span>
          </div>
        )}
      </div>

      {/* Orders count */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 sm:px-8 py-4 sm:py-5 text-center flex-shrink-0 self-start sm:self-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-500 z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1a3f1c]/70 mb-1">
          Orders Here
        </p>
        <p className="text-4xl sm:text-5xl font-black text-[#1a3f1c]">
          {buyer.totalOrders ?? buyer.ordersCount ?? 0}
        </p>
      </div>
    </div>
  );
}
