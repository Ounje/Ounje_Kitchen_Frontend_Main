// app/operations/customers/components/CustomerDetailsHeader.tsx
import { Customer } from '@/lib/api/services/customer.service';
import { StatusBadge } from './StatusBadge';

interface CustomerDetailsHeaderProps {
  customer: Customer;
}

export function CustomerDetailsHeader({ customer }: CustomerDetailsHeaderProps) {
  return (
    <div className="bg-white rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={customer.avatar}
            alt={customer.name}
            className="w-36 h-36 md:w-[154px] md:h-[154px] rounded-2xl object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="space-y-2">
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Name:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{customer.name}</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Phone number:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{customer.phone}</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Email:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{customer.email}</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: '#1A3F1C' }}>
                Address:{' '}
              </span>
              <span style={{ color: '#1A3F1C' }}>{customer.address}</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex md:items-start justify-end">
          <StatusBadge status={customer.accountStatus} size="lg" />
        </div>
      </div>
    </div>
  );
}