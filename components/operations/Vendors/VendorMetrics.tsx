// app/operations/vendors/components/VendorMetrics.tsx
import { Vendor } from '@/lib/api/services/vendor.service';

interface VendorMetricsProps {
  vendor: Vendor;
}

export function VendorMetrics({ vendor }: VendorMetricsProps) {
  const metrics = [
    {
      value: vendor.successfulOrders,
      label: 'successful orders',
      bgColor: '#1A3F1C',
      textColor: 'white'
    },
    {
      value: vendor.cancelledOrders,
      label: 'cancelled orders',
      bgColor: '#D00000',
      textColor: 'white'
    },
    {
      value: vendor.pendingOrders,
      label: 'pending orders',
      bgColor: '#FFCA3A',
      textColor: '#1A3F1C'
    },
    {
      value: vendor.totalOrders,
      label: 'Total',
      bgColor: '#98EF9B',
      textColor: '#1A3F1C'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Performance Metrics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-xl p-6 flex flex-col items-center justify-center min-h-[120px]"
            style={{ backgroundColor: metric.bgColor }}
          >
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: metric.textColor }}
            >
              {metric.value}
            </div>
            <div
              className="text-sm font-medium text-center"
              style={{ color: metric.textColor }}
            >
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#1A3F1C' }}></div>
          <span className="text-sm" style={{ color: '#1A3F1C' }}>successful orders</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#D00000' }}></div>
          <span className="text-sm" style={{ color: '#1A3F1C' }}>cancelled orders</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#FFCA3A' }}></div>
          <span className="text-sm" style={{ color: '#1A3F1C' }}>pending orders</span>
        </div>
      </div>
    </div>
  );
}