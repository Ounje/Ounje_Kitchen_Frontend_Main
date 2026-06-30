"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Compass } from "lucide-react";
import { vendorService } from "@/lib/api/services/vendor.service";
import { toast } from "sonner";

interface ActionButtonsProps {
  vendorId: string;
  accountStatus: "active" | "suspended";
  isExplorer: boolean;
  onExplorerToggled?: (newValue: boolean) => void;
}

export function ActionButtons({
  vendorId,
  accountStatus,
  isExplorer,
  onExplorerToggled,
}: ActionButtonsProps) {
  const router = useRouter();
  const isSuspended = accountStatus === "suspended";
  const [explorerStatus, setExplorerStatus] = useState(isExplorer);
  const [togglingExplorer, setTogglingExplorer] = useState(false);

  const handleExplorerToggle = async () => {
    try {
      setTogglingExplorer(true);
      const result = await vendorService.toggleExplorerStatus(vendorId);
      setExplorerStatus(result.isExplorer);
      onExplorerToggled?.(result.isExplorer);
      toast.success(
        result.isExplorer
          ? "Vendor added to Restaurant Explorer program"
          : "Vendor removed from Restaurant Explorer program"
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to update Explorer status");
    } finally {
      setTogglingExplorer(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 pt-4 mt-4 border-t border-gray-100">
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
        onClick={handleExplorerToggle}
        disabled={togglingExplorer}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 ${
          explorerStatus ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
        }`}
      >
        <Compass className="w-4 h-4" />
        {togglingExplorer
          ? "Updating…"
          : explorerStatus
            ? "Remove from Explorer"
            : "Add to Explorer"}
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
