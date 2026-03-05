// app/operations/vendors/components/ActionButtons.tsx
import Link from 'next/link';

interface ActionButtonsProps {
  vendorId: string;
  accountStatus: 'active' | 'suspended';
}

export function ActionButtons({ vendorId, accountStatus }: ActionButtonsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Show Suspend button if Active */}
      {accountStatus === 'active' && (
        <Link
          href={`/operations/vendors/${vendorId}/actions/suspend`}
          className="flex-1 py-3 px-6 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#FFCA3A',
            color: '#1A3F1C'
          }}
        >
          Suspend Account
        </Link>
      )}

      {/* Show Activate button if Suspended */}
      {accountStatus === 'suspended' && (
        <Link
          href={`/operations/vendors/${vendorId}/actions/activate`}
          className="flex-1 py-3 px-6 rounded-lg text-center font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: '#1A3F1C',
            color: 'white'
          }}
        >
          Activate Account
        </Link>
      )}

      {/* Delete button (always shown) */}
      <Link
        href={`/operations/vendors/${vendorId}/actions/delete`}
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