import { Medal, MapPin, CheckCircle } from 'lucide-react';
import { TopVendor } from '@/lib/api/services/vendor.service';

interface VendorTopChartProps {
  topVendors: TopVendor[];
  loading?: boolean;
}

export function VendorTopChart({ topVendors, loading = false }: VendorTopChartProps) {
  if (loading) {
    return (
      <div className="mb-6 w-full">
        <div className="h-7 w-48 bg-gray-300 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl h-44 bg-gray-300 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getRankConfig = (rank: 1 | 2 | 3) => ({
    1: { gradient: 'linear-gradient(135deg,#D97523 0%,#F4A460 100%)', label: '1st' },
    2: { gradient: 'linear-gradient(135deg,#8B8B8B 0%,#C0C0C0 100%)', label: '2nd' },
    3: { gradient: 'linear-gradient(135deg,#8B4513 0%,#CD7F32 100%)', label: '3rd' },
  }[rank]);

  return (
    <div className="mb-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Vendor <span className="text-gray-500 font-normal">| Top Chart</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {topVendors.map((vendor) => {
          const config = getRankConfig(vendor.rank);
          return (
            <div
              key={vendor.id}
              className="rounded-xl p-5 relative overflow-hidden"
              style={{ background: config.gradient }}
            >
              {/* Rank Badge */}
              <div className="absolute top-4 right-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold bg-white/30 text-white">
                  {config.label}
                </div>
              </div>

              {/* Info */}
              <div className="flex items-start gap-3">
                {/* Avatar — fallback to initial when src is empty/missing */}
                {vendor.avatar ? (
                  <img
                    src={vendor.avatar}
                    alt={vendor.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white flex-shrink-0 bg-white/30 flex items-center justify-center text-white text-xl font-bold">
                    {vendor.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg mb-0.5 text-white truncate">
                    {vendor.name}
                  </h3>
                  <p className="text-sm mb-0.5 text-white">{vendor.phone}</p>
                  <div className="flex items-center gap-1 mb-1.5">
                    <MapPin className="w-3 h-3 text-white flex-shrink-0" />
                    <p className="text-xs text-white truncate">{vendor.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />
                    <p className="text-sm font-semibold text-white">
                      {vendor.completedOrders} Completed
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative medal */}
              <div className="absolute bottom-3 right-3 opacity-20">
                <Medal className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}