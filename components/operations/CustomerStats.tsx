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
      textColor: 'white',
    },
    {
      value: customer.cancelledOrders,
      label: 'cancelled orders',
      bgColor: '#D00000',
      textColor: 'white',
    },
    {
      value: customer.pendingOrders,
      label: 'pending orders',
      bgColor: '#FFCA3A',
      textColor: '#1A3F1C',
    },
    {
      value: customer.totalOrders,
      label: 'Total',
      bgColor: '#98EF9B',
      textColor: '#1A3F1C',
    },
  ];

  const legend = [
    { color: '#1A3F1C', label: 'successful orders' },
    { color: '#D00000', label: 'cancelled orders' },
    { color: '#FFCA3A', label: 'pending orders' },
  ];

  return (
    <div className="mb-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Activities
      </h2>

      {/* Stat cards — 2 cols on mobile, 4 on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[100px]"
            style={{ backgroundColor: stat.bgColor }}
          >
            <div
              className="text-3xl sm:text-5xl font-bold mb-1 sm:mb-2"
              style={{ color: stat.textColor }}
            >
              {stat.value}
            </div>
            <div
              className="text-xs sm:text-sm font-medium text-center leading-tight"
              style={{ color: stat.textColor }}
            >
              {stat.label}
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