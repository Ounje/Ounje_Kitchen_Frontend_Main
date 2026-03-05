// app/operations/vendors/components/VendorTopChart.tsx
import { Medal, MapPin, CheckCircle } from 'lucide-react';
import { TopVendor } from '@/lib/api/services/vendor.service';

interface VendorTopChartProps {
  topVendors: TopVendor[];
  loading?: boolean;
}

export function VendorTopChart({ topVendors, loading = false }: VendorTopChartProps) {
  if (loading) {
    return (
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl p-6 h-48 bg-gray-300 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const getRankConfig = (rank: 1 | 2 | 3) => {
    const configs = {
      1: {
        gradient: 'linear-gradient(135deg, #D97523 0%, #F4A460 100%)',
        textColor: 'white',
        label: '1st'
      },
      2: {
        gradient: 'linear-gradient(135deg, #8B8B8B 0%, #C0C0C0 100%)',
        textColor: 'white',
        label: '2nd'
      },
      3: {
        gradient: 'linear-gradient(135deg, #8B4513 0%, #CD7F32 100%)',
        textColor: 'white',
        label: '3rd'
      }
    };
    return configs[rank];
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Vendor <span className="text-gray-600">| Top Chart</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topVendors.map((vendor) => {
          const config = getRankConfig(vendor.rank);
          return (
            <div
              key={vendor.id}
              className="rounded-xl p-6 relative overflow-hidden"
              style={{
                background: config.gradient
              }}
            >
              {/* Rank Badge */}
              <div className="absolute top-4 right-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    color: config.textColor
                  }}
                >
                  {config.label}
                </div>
              </div>

              {/* Vendor Info */}
              <div className="flex items-start gap-4">
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white"
                />
                <div className="flex-1">
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: config.textColor }}
                  >
                    {vendor.name}
                  </h3>
                  <p
                    className="text-sm mb-1"
                    style={{ color: config.textColor }}
                  >
                    {vendor.phone}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3" style={{ color: config.textColor }} />
                    <p
                      className="text-xs"
                      style={{ color: config.textColor }}
                    >
                      {vendor.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" style={{ color: config.textColor }} />
                    <p
                      className="text-sm font-semibold"
                      style={{ color: config.textColor }}
                    >
                      {vendor.completedOrders} Completed
                    </p>
                  </div>
                </div>
              </div>

              {/* Medal Icon */}
              <div className="absolute bottom-4 right-4 opacity-20">
                <Medal
                  className="w-20 h-20"
                  style={{ color: config.textColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}