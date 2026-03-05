// app/operations/riders/components/RidersTable.tsx
'use client';

import Link from 'next/link';
import { Eye, Lock, Trash2 } from 'lucide-react';
import { AccountStatusBadge, RiderStatusBadge } from './StatusBadge';
import { Rider } from '@/lib/api/services/rider.service';

interface RidersTableProps {
  riders: Rider[];
  currentPage: number;
  onSuspend: (riderId: string) => void;
  onActivate: (riderId: string) => void;
  onDelete: (riderId: string) => void;
}

export function RidersTable({ riders, currentPage, onSuspend, onActivate, onDelete }: RidersTableProps) {
  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      motorcycle: 'Motorcycle',
      bicycle: 'Bicycle',
      car: 'Car'
    };
    return labels[mode] || mode;
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Horizontal scroll container for mobile/tablet */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr style={{ backgroundColor: '#98EF9B' }}>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>S/N</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Name</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Phone Number</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Zones</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Account Status</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Rider Status</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Mode of Delivery</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr
                key={rider.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {/* Serial Number */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {(currentPage - 1) * 8 + index + 1}
                </td>

                {/* Name */}
                <td className="px-4 py-4">
                  <span className="text-sm font-medium" style={{ color: '#1A3F1C' }}>
                    {rider.name}
                  </span>
                </td>

                {/* Phone Number */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {rider.phone}
                </td>

                {/* Zones */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
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

                {/* Mode of Delivery */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {getModeLabel(rider.modeOfDelivery)}
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* View Button - Dark Green Circle */}
                    <Link
                      href={`/operations/riders/${rider.id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#1A3F1C' }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Link>

                    {/* Suspend/Activate Button - Yellow Circle */}
                    {rider.accountStatus === 'active' ? (
                      <button
                        onClick={() => onSuspend(rider.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Suspend Account"
                      >
                        <Lock className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onActivate(rider.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Activate Account"
                      >
                        <Lock className="w-4 h-4 text-white" />
                      </button>
                    )}

                    {/* Delete Button - Red Circle */}
                    <button
                      onClick={() => onDelete(rider.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#D00000' }}
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}