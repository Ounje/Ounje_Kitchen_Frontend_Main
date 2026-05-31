import { Vendor } from "@/lib/api/services/vendor.service";
import { ShoppingBag, XCircle, Clock, Hash } from "lucide-react";

interface VendorMetricsProps {
  vendor: Vendor;
}

export function VendorMetrics({ vendor }: VendorMetricsProps) {
  const metrics = [
    { label: "Successful", value: vendor.successfulOrders, icon: ShoppingBag, color: "text-green-700",  bg: "bg-green-50",       border: "border-green-100"       },
    { label: "Cancelled",  value: vendor.cancelledOrders,  icon: XCircle,     color: "text-red-700",    bg: "bg-red-50",         border: "border-red-100"         },
    { label: "Pending",    value: vendor.pendingOrders,     icon: Clock,       color: "text-amber-700",  bg: "bg-amber-50",       border: "border-amber-100"       },
    { label: "Total",      value: vendor.totalOrders,       icon: Hash,        color: "text-[#1a3f1c]",  bg: "bg-[#98ef9b]/20",   border: "border-[#98ef9b]/40"    },
  ];

  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Performance Metrics</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className={`glass-card hover-lift p-4 flex items-center gap-4 ${m.border}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg} ${m.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-black ${m.color} leading-none`}>{m.value ?? 0}</p>
                <p className="text-xs font-bold text-gray-500 mt-1">{m.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
