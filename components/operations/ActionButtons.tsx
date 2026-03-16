'use client';

import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  customerId: string;
  accountStatus: 'active' | 'suspended' | 'unverified';
}

export function ActionButtons({ customerId, accountStatus }: ActionButtonsProps) {
  const router = useRouter();

  const navigate = (type: 'suspend' | 'activate' | 'delete') => {
    router.push(`/operations/customers/${customerId}/actions/${type}`);
  };

  const isSuspended = accountStatus === 'suspended';

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-2">
      {/* Suspend / Activate toggle */}
      <button
        onClick={() => navigate(isSuspended ? 'activate' : 'suspend')}
        className="flex-1 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#1A3F1C] transition-opacity hover:opacity-90 active:scale-95"
        style={{ backgroundColor: '#FFCA3A' }}
      >
        {isSuspended ? 'Activate Account' : 'Suspend Account'}
      </button>

      {/* Delete */}
      <button
        onClick={() => navigate('delete')}
        className="flex-1 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
        style={{ backgroundColor: '#D00000' }}
      >
        Delete Account
      </button>
    </div>
  );
}