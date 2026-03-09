'use client';

import Link from 'next/link';
import { Eye, Lock, Unlock, Trash2 } from 'lucide-react';
import { AccountStatusBadge, RiderStatusBadge } from './StatusBadge';
import { Rider } from '@/lib/api/services/rider.service';

interface RidersTableProps {
  riders: Rider[];
  currentPage: number;
  /** Passed from parent so S/N stays correct when page size changes */
  pageLimit: number;
  onSuspend: (riderId: string) => void;
  onActivate: (riderId: string) => void;
  onDelete: (riderId: string) => void;
}

export function RidersTable({
  riders,
  currentPage,
  pageLimit,
  onSuspend,
  onActivate,
  onDelete,
}: RidersTableProps) {
  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      motorcycle: 'Motorcycle',
      bicycle: 'Bicycle',
      car: 'Car',
    };
    return labels[mode] || mode;
  };

  const thCls = 'px-4 py-3 text-left font-medium text-sm whitespace-nowrap';

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr style={{ backgroundColor: '#98EF9B' }}>
            <th className={thCls} style={{ color: '#1A3F1C', width: 48 }}>S/N</th>
            <th className={thCls} style={{ color: '#1A3F1C' }}>Name</th>
            <th className={thCls} style={{ color: '#1A3F1C' }}>Phone Number</th>
            <th className={thCls} style={{ color: '#1A3F1C' }}>Zones</th>
            <th className={thCls} style={{ color: '#1A3F1C' }}>Account Status</th>
            <th className={thCls} style={{ color: '#1A3F1C' }}>Rider Status</th>
            <th className={thCls} style={{ color: '#1A3F1C' }}>Mode of Delivery</th>
            <th className={thCls} style={{ color: '#1A3F1C', width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {riders.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-16 text-center text-gray-400 text-sm">
                No riders found.
              </td>
            </tr>
          ) : (
            riders.map((rider, index) => (
              <tr
                key={rider.id}
                className="border-b border-gray-100 hover:bg-[#f7fdf7] transition-colors"
              >
                {/* S/N */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {(currentPage - 1) * pageLimit + index + 1}
                </td>

                {/* Name */}
                <td className="px-4 py-4">
                  <span className="text-sm font-medium" style={{ color: '#1A3F1C' }}>
                    {rider.name}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-4 py-4 text-sm whitespace-nowrap" style={{ color: '#1A3F1C' }}>
                  {rider.phone}
                </td>

                {/* Zone */}
                <td className="px-4 py-4 text-sm max-w-[160px] truncate" style={{ color: '#1A3F1C' }}>
                  {rider.zone}
                </td>

                {/* Account Status */}
                <td className="px-4 py-4">
                  <AccountStatusBadge status={rider.accountStatus} />
                </td>

                {/* Rider Status */}
                <td className="px-4 py-4">
                  <RiderStatusBadge status={rider.riderStatus} />
                </td>

                {/* Mode */}
                <td className="px-4 py-4 text-sm whitespace-nowrap" style={{ color: '#1A3F1C' }}>
                  {getModeLabel(rider.modeOfDelivery)}
                </td>

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <Link
                      href={`/operations/riders/${rider.id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ backgroundColor: '#1A3F1C' }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Link>

                    {/* Suspend / Activate */}
                    {rider.accountStatus === 'active' ? (
                      <button
                        onClick={() => onSuspend(rider.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Suspend Account"
                      >
                        <Lock className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(rider.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                        style={{ backgroundColor: '#37A449' }}
                        title="Activate Account"
                      >
                        <Unlock className="w-4 h-4 text-white" />
                      </button>
                    )}

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(rider.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ backgroundColor: '#D00000' }}
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}