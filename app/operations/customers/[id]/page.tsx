"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { customerService, type Customer, type Vendor } from "@/lib/api/services/customer.service";
import { CustomerDetailsHeader } from "@/components/operations/CustomerDetailsHeader";
import { CustomerStats } from "@/components/operations/CustomerStats";
import { CustomerVendorCard } from "@/components/operations/CustomerVendorCard";
import { ActionButtons } from "@/components/operations/ActionButtons";
import { CustomerDetailsSkeleton } from "@/app/operations/customers/loaders/CustomerDetailsSkeleton";
import { X } from "lucide-react";
import { toast } from "sonner";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [vendorLoading, setVendorLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomerById(customerId);
        setCustomer(data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load customer details");
      } finally {
        setLoading(false);
      }
    };

    const fetchMostUsedVendor = async () => {
      try {
        setVendorLoading(true);
        const data = await customerService.getMostUsedVendor(customerId);
        setVendor(data);
      } catch (error: any) {
        console.error("Failed to load vendor:", error);
      } finally {
        setVendorLoading(false);
      }
    };

    fetchCustomerDetails();
    fetchMostUsedVendor();
  }, [customerId]);

  if (loading) return <CustomerDetailsSkeleton />;

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-75">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Customer not found.</p>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#1a3f1c]"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-black text-[#1a3f1c]">Customer Details</h1>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back to customers"
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <CustomerDetailsHeader customer={customer} />
      <CustomerStats customer={customer} />
      <CustomerVendorCard vendor={vendor} loading={vendorLoading} />
      <ActionButtons customerId={customer.id} accountStatus={customer.accountStatus} />
    </div>
  );
}
