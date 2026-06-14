import { Star, MapPin } from "lucide-react";
import { Vendor } from "@/lib/api/services/customer.service";

interface CustomerVendorCardProps {
  vendor: Vendor | null;
  loading?: boolean;
}

export function CustomerVendorCard({ vendor, loading = false }: CustomerVendorCardProps) {
  if (loading) {
    return (
      <div className="glass-card p-4 sm:p-6 mb-6 w-full">
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
      <div className="glass-card p-4 sm:p-6 mb-6 w-full">
        <p className="text-center text-gray-500 text-sm">No vendor data available</p>
      </div>
    );
  }

  return (
    <div className="glass-card hover-lift rounded-2xl p-5 sm:p-7 mb-6 w-full flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-gradient-to-br from-[#1a3f1c] to-[#2a5c2d] border border-white/10 shadow-[0_8px_30px_rgb(26,63,28,0.15)] relative overflow-hidden group">
      {/* Decorative background accent */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ffca3a] rounded-full mix-blend-overlay filter blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
      {/* Vendor Photo */}
      <div className="flex-shrink-0">
        <img
          src={vendor.photo}
          alt={vendor.name}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
        />
      </div>

      {/* Vendor Details */}
      <div className="flex-1 min-w-0 z-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
          Most Used Vendor
        </p>
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{vendor.name}</h3>
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
      <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 sm:px-8 py-4 sm:py-5 text-center flex-shrink-0 self-start sm:self-center shadow-lg border border-white/20 group-hover:scale-105 transition-transform duration-500 z-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#1a3f1c]/70 mb-1">
          Orders Here
        </p>
        <p className="text-4xl sm:text-5xl font-black text-[#1a3f1c]">{vendor.ordersCount}</p>
      </div>
    </div>
  );
}
