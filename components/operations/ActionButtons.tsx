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
    <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={() => navigate(isSuspended ? 'activate' : 'suspend')}
        className={`px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity ${
          isSuspended
            ? 'bg-[#1a3f1c] text-white'
            : 'bg-amber-400 text-[#1a3f1c]'
        }`}
      >
        {isSuspended ? 'Activate Account' : 'Suspend Account'}
      </button>
      <button
        type="button"
        onClick={() => navigate('delete')}
        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:opacity-90 transition-opacity"
      >
        Delete Account
      </button>
    </div>
  );
}