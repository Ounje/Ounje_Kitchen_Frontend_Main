import { Customer } from "@/lib/api/services/customer.service";
import { ShoppingBag, XCircle, Clock, Hash } from "lucide-react";

interface CustomerStatsProps {
  customer: Customer;
}

const stats = (c: Customer) => [
  {
    label: "Successful",
    value: c.successfulOrders,
    icon: ShoppingBag,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    label: "Cancelled",
    value: c.cancelledOrders,
    icon: XCircle,
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    label: "Pending",
    value: c.pendingOrders,
    icon: Clock,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    label: "Total",
    value: c.totalOrders,
    icon: Hash,
    color: "text-[#1a3f1c]",
    bg: "bg-[#98ef9b]/20",
    border: "border-[#98ef9b]/40",
  },
];

export function CustomerStats({ customer }: CustomerStatsProps) {
  return (
    <div className="mb-4">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        Order Activity
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {stats(customer).map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`glass-card hover-lift p-4 flex items-center gap-4 ${s.border}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color} shrink-0`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-black ${s.color} leading-none`}>{s.value ?? 0}</p>
                <p className="text-xs font-bold text-gray-500 mt-1">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
