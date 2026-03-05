// app/operations/customers/components/ActionButtons.tsx
import Link from 'next/link';

interface ActionButtonsProps {
  customerId: string;
  accountStatus: 'active' | 'suspended' | 'unverified';
}

export function ActionButtons({ customerId, accountStatus }: ActionButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Show Suspend button if Active */}
      {accountStatus === 'active' && (
        <Link
          href={`/operations/customers/${customerId}/actions/suspend`}
          className="flex-1 py-3 px-6 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#FFCA3A',
            color: '#1A3F1C'
          }}
        >
          Suspend Account
        </Link>
      )}

      {/* Show Activate button if Suspended or Unverified */}
      {(accountStatus === 'suspended' || accountStatus === 'unverified') && (
        <Link
          href={`/operations/customers/${customerId}/actions/activate`}
          className="flex-1 py-3 px-6 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#37A449',
            color: 'white'
          }}
        >
          Activate Account
        </Link>
      )}

      {/* Delete button (always shown) */}
      <Link
        href={`/operations/customers/${customerId}/actions/delete`}
        className="flex-1 py-3 px-6 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
        style={{
          backgroundColor: '#D00000',
          color: 'white'
        }}
      >
        Delete Account
      </Link>
    </div>
  );
}