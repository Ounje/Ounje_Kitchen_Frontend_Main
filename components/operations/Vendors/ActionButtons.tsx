'use client';

import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  vendorId:      string;
  accountStatus: 'active' | 'suspended';
}

export function ActionButtons({ vendorId, accountStatus }: ActionButtonsProps) {
  const router = useRouter();
  const isSuspended = accountStatus === 'suspended';

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full mt-2">
      <button
        onClick={() => router.push(`/operations/vendors/${vendorId}/actions/${isSuspended ? 'activate' : 'suspend'}`)}
        className="flex-1 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#1A3F1C] hover:opacity-90 active:scale-95 transition-all"
        style={{ backgroundColor: '#FFCA3A' }}
      >
        {isSuspended ? 'Activate Account' : 'Suspend Account'}
      </button>
      <button
        onClick={() => router.push(`/operations/vendors/${vendorId}/actions/delete`)}
        className="flex-1 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-white hover:opacity-90 active:scale-95 transition-all"
        style={{ backgroundColor: '#D00000' }}
      >
        Delete Account
      </button>
    </div>
  );
}