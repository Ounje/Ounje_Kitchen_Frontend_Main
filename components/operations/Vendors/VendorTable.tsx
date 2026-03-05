// app/operations/vendors/components/VendorTable.tsx
'use client';

import Link from 'next/link';
import { Eye, Lock, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { BusinessStatusBadge } from './BusinessStatusBadge';
import { StatusBadge } from './StatusBadge';
import { Vendor } from '@/lib/api/services/vendor.service';

interface VendorTableProps {
  vendors: Vendor[];
  currentPage: number;
}

export function VendorTable({ vendors, currentPage }: VendorTableProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#37A449' }}>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">S/N</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Phone Number</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Address</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Business Status</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Account Status</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, index) => (
              <tr
                key={vendor.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {/* Serial Number */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {(currentPage - 1) * 7 + index + 1}
                </td>

                {/* Name */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" style={{ color: '#1A3F1C' }}>
                      {vendor.name}
                    </span>
                  </div>
                </td>

                {/* Phone Number */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {vendor.phone}
                </td>

                {/* Address */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {vendor.address}
                </td>

                {/* Business Status */}
                <td className="px-4 py-4">
                  <BusinessStatusBadge status={vendor.businessStatus} />
                </td>

                {/* Account Status */}
                <td className="px-4 py-4">
                  <StatusBadge status={vendor.accountStatus} size="sm" />
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* View Button - Green Circle */}
                    <Link
                      href={`/operations/vendors/${vendor.id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#37A449' }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Link>

                    {/* Suspend/Activate Button - Yellow Circle */}
                    {vendor.accountStatus === 'active' ? (
                      <Link
                        href={`/operations/vendors/${vendor.id}/actions/suspend`}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Suspend Account"
                      >
                        <PauseCircle className="w-4 h-4 text-white" />
                      </Link>
                    ) : vendor.businessStatus === 'unregistered' ? (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Business Not Registered"
                      >
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <Link
                        href={`/operations/vendors/${vendor.id}/actions/activate`}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Activate Account"
                      >
                        <PlayCircle className="w-4 h-4 text-white" />
                      </Link>
                    )}

                    {/* Delete Button - Red Circle */}
                    <Link
                      href={`/operations/vendors/${vendor.id}/actions/delete`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#D00000' }}
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Link>
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