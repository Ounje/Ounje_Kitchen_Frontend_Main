"use client";

import { useState } from "react";
import { Star, Phone, MapPin, Building2, Compass } from "lucide-react";
import { vendorService, Vendor } from "@/lib/api/services/vendor.service";
import { StatusBadge } from "./StatusBadge";
import { CACBadge } from "./CACBadge";
import { formatNigerianPhone } from "@/lib/utils/formatPhone";
import { toast } from "sonner";

interface VendorDetailsHeaderProps {
  vendor: Vendor;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "fill-[#ffca3a] text-[#ffca3a]" : "text-gray-200"}`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500 tabular-nums">
        {rating > 0 ? rating.toFixed(1) : "No ratings"}
      </span>
    </div>
  );
}

export function VendorDetailsHeader({ vendor }: VendorDetailsHeaderProps) {
  const [alerting, setAlerting] = useState(false);

  const handleAlertVendor = async () => {
    try {
      setAlerting(true);
      await vendorService.alertVendor(vendor.id);
      toast.success("Vendor alerted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to alert vendor");
    } finally {
      setAlerting(false);
    }
  };

  const isRegistered = vendor.businessStatus === "registered" && vendor.cacNumber;

  return (
    <div className="glass-card hover-lift p-6 mb-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="shrink-0">
          {vendor.avatar ? (
            <img
              src={vendor.avatar}
              alt={vendor.name}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#98ef9b]/40 flex items-center justify-center text-xl font-bold text-[#1a3f1c]">
              {(vendor.name ?? "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2 className="text-base font-bold text-gray-900 truncate">{vendor.name}</h2>
            <div className="flex items-center gap-1.5">
              {vendor.isExplorer && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                  <Compass className="w-3 h-3" />
                  Explorer
                </span>
              )}
              <StatusBadge status={vendor.accountStatus} size="sm" />
            </div>
          </div>

          <StarRating rating={vendor.rating ?? 0} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 mt-2.5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="tabular-nums">{formatNigerianPhone(vendor.phone) || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <CACBadge isRegistered={!!isRegistered} />
              {vendor.cacNumber && (
                <span className="text-xs text-gray-400 ml-1">{vendor.cacNumber}</span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 sm:col-span-2">
              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{vendor.address || "—"}</span>
            </div>
          </div>
        </div>
      </div>

      {isRegistered && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleAlertVendor}
            disabled={alerting}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1a3f1c] text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {alerting ? "Alerting…" : "Alert Vendor"}
          </button>
        </div>
      )}
    </div>
  );
}
