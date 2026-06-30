"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { vendorService, type Vendor, type Buyer } from "@/lib/api/services/vendor.service";
import { VendorDetailsHeader } from "@/components/operations/Vendors/VendorDetailsHeader";
import { VendorMetrics } from "@/components/operations/Vendors/VendorMetrics";
import { VendorBuyerCard } from "@/components/operations/Vendors/VendorBuyerCard";
import { ActionButtons } from "@/components/operations/Vendors/ActionButtons";
import { VendorDetailsSkeleton } from "../loaders/VendorDetailsSkeleton";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function VendorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const vendorId = params.id as string;

  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyerLoading, setBuyerLoading] = useState(true);
  const [isExplorer, setIsExplorer] = useState(false);

  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        setLoading(true);
        const data = await vendorService.getVendorById(vendorId);
        setVendor(data);
        setIsExplorer(data.isExplorer);
      } catch (error: any) {
        toast.error(error.message || "Failed to load vendor details");
      } finally {
        setLoading(false);
      }
    };

    const fetchMostFrequentBuyer = async () => {
      try {
        setBuyerLoading(true);
        const data = await vendorService.getMostFrequentBuyer(vendorId);
        setBuyer(data);
      } catch (error: any) {
        console.error("Failed to load buyer:", error);
      } finally {
        setBuyerLoading(false);
      }
    };

    fetchVendorDetails();
    fetchMostFrequentBuyer();
  }, [vendorId]);

  if (loading) return <VendorDetailsSkeleton />;

  if (!vendor) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Vendor not found.</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1a3f1c]"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-black text-[#1a3f1c]">Vendor Details</h1>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back to vendors"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <VendorDetailsHeader vendor={{ ...vendor, isExplorer }} />
      <VendorMetrics vendor={vendor} />
      <VendorBuyerCard buyer={buyer} loading={buyerLoading} />
      <ActionButtons
        vendorId={vendor.id}
        accountStatus={vendor.accountStatus}
        isExplorer={isExplorer}
        onExplorerToggled={setIsExplorer}
      />
    </div>
  );
}
