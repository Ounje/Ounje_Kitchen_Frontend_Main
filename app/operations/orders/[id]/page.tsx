"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useRouteGuard } from "@/hooks/useRouteGuard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import OrderContentTab from "@/components/operations/tabs/OrderContentTab";
import InvolvedPartyTab from "@/components/operations/tabs/InvolvedPartyTab";
import MapFeatureTab from "@/components/operations/tabs/MapFeatureTab";
import AssignRiderModal from "@/components/operations/modals/AssignRiderModal";
import { mockOrders } from "@/lib/mock-data/operations";

type TabType = "content" | "party" | "map";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const { shouldRender, Reloading } = useRouteGuard({ returnRenderFlag: true });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("content");
  const [assignRiderOpen, setAssignRiderOpen] = useState(false);

  // ✅ Unwrap params Promise with React.use()
  const { id } = use(params);

  // Find order by ID (convert URL slug back to order ID format)
  const orderId = id.toUpperCase().replace(/-/g, ' ');
  const order = mockOrders.find(
    (o) => o.orderId.toLowerCase().replace(/\s+/g, '-') === id
  );

  const tabs = [
    { id: "content" as TabType, label: "Order Content" },
    { id: "party" as TabType, label: "Involved Party Details" },
    { id: "map" as TabType, label: "Map Feature" },
  ];

  if (Reloading || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin text-[#1a3f1c]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-xl text-gray-600">Order not found</p>
        <Button
          onClick={() => router.push("/operations/orders")}
          className="bg-[#1a3f1c] hover:bg-[#164016] text-white"
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        variant="ghost"
        className="gap-2 hover:bg-[#98ef9b] text-[#1a3f1c]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Button>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Order Details</h1>
      </div>

      {/* Order Info Card */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={order.imageUrl}
              alt="Food"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Order ID:</span> {order.orderId}
            </p>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Order Type:</span> {order.orderType}
            </p>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">Date:</span> {order.date}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              py-3 sm:py-4 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium
              transition-colors touch-manipulation
              ${
                activeTab === tab.id
                  ? "bg-[#1a3f1c] text-white"
                  : "bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#88df8b]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Bar */}
      <div className="bg-[#1a3f1c] text-white text-center py-3 rounded-lg font-semibold text-sm sm:text-base">
        {order.status === "delivered" ? "SUCCESSFUL" : order.status.toUpperCase()}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 min-h-[400px]">
        {activeTab === "content" && <OrderContentTab order={order} />}
        {activeTab === "party" && (
          <InvolvedPartyTab
            order={order}
            onAssignRider={() => setAssignRiderOpen(true)}
          />
        )}
        {activeTab === "map" && <MapFeatureTab order={order} />}
      </div>

      {/* Assign Rider Modal */}
      <AssignRiderModal
        open={assignRiderOpen}
        onClose={() => setAssignRiderOpen(false)}
        orderId={order.orderId}
      />
    </div>
  );
}