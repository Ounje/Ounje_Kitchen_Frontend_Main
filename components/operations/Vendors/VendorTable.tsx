'use client';

import Link from 'next/link';
import { Eye, Lock, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { BusinessStatusBadge } from './BusinessStatusBadge';
import { StatusBadge } from './StatusBadge';
import { Vendor } from '@/lib/api/services/vendor.service';

interface VendorTableProps {
  vendors: Vendor[];
  currentPage: number;
  /** Passed from the parent so serial numbers stay correct when page size changes */
  pageLimit: number;
}

export function VendorTable({ vendors, currentPage, pageLimit }: VendorTableProps) {
  const thCls = 'px-4 py-3 text-left text-white font-medium text-sm whitespace-nowrap';

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr style={{ backgroundColor: '#37A449' }}>
            <th className={thCls} style={{ width: 48 }}>S/N</th>
            <th className={thCls}>Name</th>
            <th className={thCls}>Phone Number</th>
            <th className={thCls}>Address</th>
            <th className={thCls}>Business Status</th>
            <th className={thCls}>Account Status</th>
            <th className={thCls} style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vendors.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">
                No vendors found.
              </td>
            </tr>
          ) : (
            vendors.map((vendor, index) => (
              <tr
                key={vendor.id}
                className="border-b border-gray-100 hover:bg-[#f7fdf7] transition-colors"
              >
                {/* S/N */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {(currentPage - 1) * pageLimit + index + 1}
                </td>

                {/* Name */}
                <td className="px-4 py-4">
                  <span className="text-sm font-medium" style={{ color: '#1A3F1C' }}>
                    {vendor.name}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-4 py-4 text-sm whitespace-nowrap" style={{ color: '#1A3F1C' }}>
                  {vendor.phone}
                </td>

                {/* Address */}
                <td className="px-4 py-4 text-sm max-w-[200px] truncate" style={{ color: '#1A3F1C' }}>
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

                {/* Actions */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <Link
                      href={`/operations/vendors/${vendor.id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ backgroundColor: '#37A449' }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Link>

                    {/* Suspend / Activate / Locked */}
                    {vendor.accountStatus === 'active' ? (
                      <Link
                        href={`/operations/vendors/${vendor.id}/actions/suspend`}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Suspend Account"
                      >
                        <PauseCircle className="w-4 h-4 text-white" />
                      </Link>
                    ) : vendor.businessStatus === 'unregistered' ? (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed flex-shrink-0"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Business Not Registered"
                      >
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <Link
                        href={`/operations/vendors/${vendor.id}/actions/activate`}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Activate Account"
                      >
                        <PlayCircle className="w-4 h-4 text-white" />
                      </Link>
                    )}

                    {/* Delete */}
                    <Link
                      href={`/operations/vendors/${vendor.id}/actions/delete`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0"
                      style={{ backgroundColor: '#D00000' }}
                      title="Delete Account"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </Link>
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