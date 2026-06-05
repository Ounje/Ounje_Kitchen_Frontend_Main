"use client";

import Link from "next/link";
import { ChevronRight, Store } from "lucide-react";
import { BusinessStatusBadge } from "./BusinessStatusBadge";
import { formatNigerianPhone } from "@/lib/utils/formatPhone";
import { StatusBadge } from "./StatusBadge";
import { Vendor } from "@/lib/api/services/vendor.service";

interface VendorTableProps {
  vendors: Vendor[];
  currentPage: number;
  pageLimit: number;
}

export function VendorTable({ vendors, currentPage, pageLimit }: VendorTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="modern-table min-w-190">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th>Vendor</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Business</th>
            <th>Account</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center">
                <Store className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No vendors found</p>
              </td>
            </tr>
          ) : vendors.map((v, i) => (
            <tr key={v.id}>
              <td className="text-gray-400 tabular-nums">{(currentPage - 1) * pageLimit + i + 1}</td>
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#98ef9b]/40 ring-2 ring-white shadow-sm flex items-center justify-center">
                    <span className="text-[10px] font-black text-[#1a3f1c] select-none">
                      {(v.name || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">{v.name}</span>
                </div>
              </td>
              <td className="text-gray-600 font-medium tabular-nums">{formatNigerianPhone(v.phone)}</td>
              <td className="text-gray-500 max-w-45 truncate">{v.address || "—"}</td>
              <td><BusinessStatusBadge status={v.businessStatus} /></td>
              <td><StatusBadge status={v.accountStatus} size="sm" /></td>
              <td className="text-right">
                <Link href={`/operations/vendors/${v.id}`}
                  className="inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-full bg-gray-50 text-xs font-bold text-[#1a3f1c] hover:bg-[#1a3f1c] hover:text-white transition-all">
                  Details <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
