// app/operations/customers/components/CustomerStats.tsx
import { Customer } from '@/lib/api/services/customer.service';

interface CustomerStatsProps {
  customer: Customer;
}

export function CustomerStats({ customer }: CustomerStatsProps) {
  const stats = [
    {
      value: customer.successfulOrders,
      label: 'successful orders',
      bgColor: '#1A3F1C',
      textColor: 'white'
    },
    {
      value: customer.cancelledOrders,
      label: 'cancelled orders',
      bgColor: '#D00000',
      textColor: 'white'
    },
    {
      value: customer.pendingOrders,
      label: 'pending orders',
      bgColor: '#FFCA3A',
      textColor: '#1A3F1C'
    },
    {
      value: customer.totalOrders,
      label: 'Total',
      bgColor: '#98EF9B',
      textColor: '#1A3F1C'
    }
  ];

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Activities
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl p-6 flex flex-col items-center justify-center"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div
              className="text-5xl font-bold mb-2"
              style={{ color: stat.textColor }}
            >
              {stat.value}
            </div>
            <div
              className="text-sm font-medium text-center"
              style={{ color: stat.textColor }}
            >
              {stat.label}
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