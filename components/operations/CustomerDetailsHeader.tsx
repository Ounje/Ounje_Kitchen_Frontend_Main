import { Customer } from '@/lib/api/services/customer.service';
import { StatusBadge } from './StatusBadge';

interface CustomerDetailsHeaderProps {
  customer: Customer;
}

export function CustomerDetailsHeader({ customer }: CustomerDetailsHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

        {/* Avatar */}
        <div className="flex-shrink-0 flex sm:block justify-center">
          {customer.avatar ? (
            <img
              src={customer.avatar}
              alt={customer.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover"
            />
          ) : (
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400"
            >
              {customer.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Name:</span>
            <span className="break-words" style={{ color: '#1A3F1C' }}>{customer.name}</span>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Phone number:</span>
            <span style={{ color: '#1A3F1C' }}>{customer.phone}</span>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Email:</span>
            <span className="break-all" style={{ color: '#1A3F1C' }}>{customer.email}</span>
          </div>
          <div className="flex flex-wrap gap-x-1">
            <span className="font-semibold" style={{ color: '#1A3F1C' }}>Address:</span>
            <span className="break-words" style={{ color: '#1A3F1C' }}>{customer.address}</span>
          </div>
        </div>

        {/* Status Badge — top-right on desktop, below avatar on mobile */}
        <div className="flex sm:items-start justify-center sm:justify-end">
          <StatusBadge status={customer.accountStatus} size="lg" />
        </div>

      </div>
    </div>
  );
}