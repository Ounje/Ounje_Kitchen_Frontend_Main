import Image from "next/image";
import { Customer } from "@/lib/api/services/customer.service";
import { StatusBadge } from "./StatusBadge";
import { formatNigerianPhone } from "@/lib/utils/formatPhone";
import { Mail, Phone, MapPin, User } from "lucide-react";

interface CustomerDetailsHeaderProps {
  customer: Customer;
}

export function CustomerDetailsHeader({ customer }: CustomerDetailsHeaderProps) {
  const initials = customer.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="glass-card hover-lift p-6 mb-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {customer.avatar ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden ring-2 ring-gray-100">
              <Image
                src={customer.avatar}
                alt={customer.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#98ef9b]/40 flex items-center justify-center text-xl font-bold text-[#1a3f1c]">
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-base font-bold text-gray-900 truncate">{customer.name}</h2>
            <StatusBadge status={customer.accountStatus} size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="tabular-nums">{formatNigerianPhone(customer.phone) || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{customer.email || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{customer.address || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
