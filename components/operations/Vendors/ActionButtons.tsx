"use client";

import { useRouter } from "next/navigation";

interface ActionButtonsProps {
  vendorId: string;
  accountStatus: "active" | "suspended";
}

export function ActionButtons({ vendorId, accountStatus }: ActionButtonsProps) {
  const router = useRouter();
  const isSuspended = accountStatus === "suspended";

  return (
    <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={() =>
          router.push(
            `/operations/vendors/${vendorId}/actions/${isSuspended ? "activate" : "suspend"}`
          )
        }
        className={`px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity ${
          isSuspended ? "bg-[#1a3f1c] text-white" : "bg-amber-400 text-[#1a3f1c]"
        }`}
      >
        {isSuspended ? "Activate Account" : "Suspend Account"}
      </button>
      <button
        type="button"
        onClick={() => router.push(`/operations/vendors/${vendorId}/actions/delete`)}
        className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:opacity-90 transition-opacity"
      >
        Delete Account
      </button>
    </div>
  );
}
