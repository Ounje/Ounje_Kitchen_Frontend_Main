"use client";

import Link from "next/link";
import { ChevronRight, Bike } from "lucide-react";
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

export function RidersTable({ riders, currentPage, pageLimit }: RidersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="modern-table min-w-225">
        <thead>
          <tr>
            <th className="w-12">#</th>
            <th>Rider</th>
            <th>Phone</th>
            <th>Zone</th>
            <th>Account</th>
            <th>Status</th>
            <th>Mode</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {riders.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center">
                <Bike className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No riders found</p>
              </td>
            </tr>
          ) : riders.map((r, i) => (
            <tr key={r.id}>
              <td className="text-gray-400 tabular-nums">{(currentPage - 1) * pageLimit + i + 1}</td>
              <td>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-[#98ef9b]/40 ring-2 ring-white shadow-sm flex items-center justify-center">
                    {r.photo ? (
                      <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-black text-[#1a3f1c] select-none">
                        {(r.name || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-gray-900">{r.name}</span>
                </div>
              </td>
              <td className="text-gray-600 font-medium tabular-nums">{formatNigerianPhone(r.phone)}</td>
              <td className="text-gray-500 max-w-40 truncate">{r.zone || "—"}</td>
              <td><AccountStatusBadge status={r.accountStatus} /></td>
              <td><RiderStatusBadge status={r.riderStatus} /></td>
              <td className="text-gray-500 whitespace-nowrap">{MODE_LABEL[r.modeOfDelivery] ?? r.modeOfDelivery}</td>
              <td className="text-right">
                <Link href={`/operations/riders/${r.id}`}
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
