"use client";

import Link from "next/link";
import { Eye, Lock, Unlock, Trash2, Bike } from "lucide-react";
import { AccountStatusBadge, RiderStatusBadge } from "./StatusBadge";
import { formatNigerianPhone } from "@/lib/utils/formatPhone";
import { Rider } from "@/lib/api/services/rider.service";

interface RidersTableProps {
  riders: Rider[];
  currentPage: number;
  pageLimit: number;
  onSuspend: (riderId: string) => void;
  onActivate: (riderId: string) => void;
  onDelete: (riderId: string) => void;
}

const MODE_LABEL: Record<string, string> = {
  motorcycle: "Motorcycle",
  bicycle:    "Bicycle",
  car:        "Car",
};

export function RidersTable({ riders, currentPage, pageLimit, onSuspend, onActivate, onDelete }: RidersTableProps) {
  const thCls = "px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap";

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className={thCls}>#</th>
            <th className={thCls}>Rider</th>
            <th className={thCls}>Phone</th>
            <th className={thCls}>Zone</th>
            <th className={thCls}>Account</th>
            <th className={thCls}>Status</th>
            <th className={thCls}>Mode</th>
            <th className={thCls}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {riders.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center">
                <Bike className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No riders found</p>
              </td>
            </tr>
          ) : riders.map((r, i) => (
            <tr key={r.id} className="hover:bg-gray-50/60 transition-colors group">
              <td className="px-4 py-3.5 text-sm text-gray-400 tabular-nums">{(currentPage - 1) * pageLimit + i + 1}</td>
              <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{r.name}</td>
              <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap tabular-nums">{formatNigerianPhone(r.phone)}</td>
              <td className="px-4 py-3.5 text-sm text-gray-500 max-w-40 truncate">{r.zone}</td>
              <td className="px-4 py-3.5"><AccountStatusBadge status={r.accountStatus} /></td>
              <td className="px-4 py-3.5"><RiderStatusBadge status={r.riderStatus} /></td>
              <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">{MODE_LABEL[r.modeOfDelivery] ?? r.modeOfDelivery}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                  <Link href={`/operations/riders/${r.id}`} title="View Details"
                    className="w-7 h-7 rounded-lg bg-[#1a3f1c] flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                    <Eye className="w-3.5 h-3.5 text-white" />
                  </Link>

                  {r.accountStatus === "active" ? (
                    <button type="button" onClick={() => onSuspend(r.id)} title="Suspend"
                      className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                      <Lock className="w-3.5 h-3.5 text-white" />
                    </button>
                  ) : (
                    <button type="button" onClick={() => onActivate(r.id)} title="Activate"
                      className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                      <Unlock className="w-3.5 h-3.5 text-white" />
                    </button>
                  )}

                  <button type="button" onClick={() => onDelete(r.id)} title="Delete"
                    className="w-7 h-7 rounded-lg bg-red-500 flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
