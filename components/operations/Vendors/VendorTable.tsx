"use client";

import Link from "next/link";
import { Eye, Lock, Trash2, PauseCircle, PlayCircle, Store } from "lucide-react";
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
  const thCls = "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap";

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className={thCls}>#</th>
            <th className={thCls}>Vendor</th>
            <th className={thCls}>Phone</th>
            <th className={thCls}>Address</th>
            <th className={thCls}>Business</th>
            <th className={thCls}>Account</th>
            <th className={thCls}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {vendors.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center">
                <Store className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No vendors found</p>
              </td>
            </tr>
          ) : vendors.map((v, i) => (
            <tr key={v.id} className="hover:bg-gray-50/60 transition-colors group">
              <td className="px-4 py-3.5 text-sm text-gray-400 tabular-nums">{(currentPage - 1) * pageLimit + i + 1}</td>
              <td className="px-4 py-3.5">
                <span className="text-sm font-medium text-gray-800">{v.name}</span>
              </td>
              <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap tabular-nums">{formatNigerianPhone(v.phone)}</td>
              <td className="px-4 py-3.5 text-sm text-gray-500 max-w-50 truncate">{v.address}</td>
              <td className="px-4 py-3.5"><BusinessStatusBadge status={v.businessStatus} /></td>
              <td className="px-4 py-3.5"><StatusBadge status={v.accountStatus} size="sm" /></td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Link href={`/operations/vendors/${v.id}`} title="View Details"
                    className="w-7 h-7 rounded-lg bg-[#1a3f1c] flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </Link>

                  {v.accountStatus === "active" ? (
                    <Link href={`/operations/vendors/${v.id}/actions/suspend`} title="Suspend"
                      className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                      <PauseCircle className="w-3.5 h-3.5 text-white" />
                    </Link>
                  ) : v.businessStatus === "unregistered" ? (
                    <div title="Business not registered"
                      className="w-7 h-7 rounded-lg bg-amber-200 flex items-center justify-center opacity-50 cursor-not-allowed shrink-0">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                    </div>
                  ) : (
                    <Link href={`/operations/vendors/${v.id}/actions/activate`} title="Activate"
                      className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                      <PlayCircle className="w-3.5 h-3.5 text-white" />
                    </Link>
                  )}

                  <Link href={`/operations/vendors/${v.id}/actions/delete`} title="Delete"
                    className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
