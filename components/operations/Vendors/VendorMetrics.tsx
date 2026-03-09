import { Vendor } from '@/lib/api/services/vendor.service';

interface VendorMetricsProps {
  vendor: Vendor;
}

export function VendorMetrics({ vendor }: VendorMetricsProps) {
  const metrics = [
    { value: vendor.successfulOrders, label: 'successful orders', bgColor: '#1A3F1C', textColor: 'white' },
    { value: vendor.cancelledOrders,  label: 'cancelled orders',  bgColor: '#D00000', textColor: 'white' },
    { value: vendor.pendingOrders,    label: 'pending orders',    bgColor: '#FFCA3A', textColor: '#1A3F1C' },
    { value: vendor.totalOrders,      label: 'Total',             bgColor: '#98EF9B', textColor: '#1A3F1C' },
  ];

  const legend = [
    { color: '#1A3F1C', label: 'successful orders' },
    { color: '#D00000', label: 'cancelled orders' },
    { color: '#FFCA3A', label: 'pending orders' },
  ];

  return (
    <div className="mb-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Performance Metrics
      </h2>

      {/* 2 cols mobile → 4 cols md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[100px]"
            style={{ backgroundColor: m.bgColor }}
          >
            <div className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2" style={{ color: m.textColor }}>
              {m.value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-center leading-tight" style={{ color: m.textColor }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
        {legend.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs sm:text-sm" style={{ color: '#1A3F1C' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}