// "use client";

// import { useState } from "react";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { X } from "lucide-react";
// import Image from "next/image";
// import OrderContentTab from "@/components/operations/tabs/OrderContentTab";
// import InvolvedPartyTab from "@/components/operations/tabs/InvolvedPartyTab";
// import MapFeatureTab from "@/components/operations/tabs/MapFeatureTab";
// import AssignRiderModal from "@/components/operations/modals/AssignRiderModal";

// interface OrderDetailsModalProps {
//   order: any;
//   open: boolean;
//   onClose: () => void;
// }

// type TabType = "content" | "party" | "map";

// export default function OrderDetailsModal({
//   order,
//   open,
//   onClose,
// }: OrderDetailsModalProps) {
//   const [activeTab, setActiveTab] = useState<TabType>("content");
//   const [assignRiderOpen, setAssignRiderOpen] = useState(false);

//   const tabs = [
//     { id: "content" as TabType, label: "Order Content" },
//     { id: "party" as TabType, label: "Involved Party Details" },
//     { id: "map" as TabType, label: "Map Feature" },
//   ];

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onClose}>
//         <DialogContent
//           className="max-w-[95vw] sm:max-w-3xl max-h-[95vh] overflow-y-auto p-0"
//           style={{ backgroundColor: "#e8f7e8" }}
//         >
//           {/* Close Button */}
//           <button
//             onClick={onClose}
//             className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full p-2 bg-white hover:bg-gray-100 transition-colors z-10"
//             aria-label="Close"
//           >
//             <X className="h-5 w-5 sm:h-6 sm:w-6" />
//           </button>

//           <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
//             {/* Header */}
//             <div className="text-center space-y-2">
//               <DialogTitle className="text-xl sm:text-2xl font-bold">
//                 Order Details
//               </DialogTitle>
//             </div>

//             {/* Order Info */}
//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="relative w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
//                 <Image
//                   src={order.imageUrl}
//                   alt="Food"
//                   fill
//                   className="object-cover"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm sm:text-base">
//                   <span className="font-semibold">Order ID:</span> {order.orderId}
//                 </p>
//                 <p className="text-sm sm:text-base">
//                   <span className="font-semibold">Order Type:</span> {order.orderType}
//                 </p>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="grid grid-cols-3 gap-2 sm:gap-3">
//               {tabs.map((tab) => (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`
//                     py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium
//                     transition-colors touch-manipulation
//                     ${
//                       activeTab === tab.id
//                         ? "bg-[#1a3f1c] text-white"
//                         : "bg-[#98ef9b] text-[#1a3f1c] hover:bg-[#88df8b]"
//                     }
//                   `}
//                 >
//                   {tab.label}
//                 </button>
//               ))}
//             </div>

//             {/* Status Bar */}
//             <div className="bg-[#1a3f1c] text-white text-center py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base">
//               {order.status === "delivered" ? "SUCCESSFUL" : order.status.toUpperCase()}
//             </div>

//             {/* Tab Content */}
//             <div className="min-h-[300px]">
//               {activeTab === "content" && <OrderContentTab order={order} />}
//               {activeTab === "party" && (
//                 <InvolvedPartyTab
//                   order={order}
//                   onAssignRider={() => setAssignRiderOpen(true)}
//                 />
//               )}
//               {activeTab === "map" && <MapFeatureTab order={order} />}
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Assign Rider Modal */}
//       <AssignRiderModal
//         open={assignRiderOpen}
//         onClose={() => setAssignRiderOpen(false)}
//         orderId={order.orderId}
//       />
//     </>
//   );
// }
