// app/operations/customers/components/CustomerTable.tsx
'use client';

import Link from 'next/link';
import { Eye, Lock, Trash2, PauseCircle, PlayCircle } from 'lucide-react';
import { StatusBadge } from '@/components/operations/StatusBadge';
import { Customer } from '@/lib/api/services/customer.service';

interface CustomerTableProps {
  customers: Customer[];
  currentPage: number;
}

export function CustomerTable({ customers, currentPage }: CustomerTableProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#37A449' }}>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">S/N</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Email</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Account Status</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Orders</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr
                key={customer.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                style={{
                  backgroundColor: index % 2 === 0 ? '#D4FFDE' : 'white'
                }}
              >
                {/* Serial Number */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {(currentPage - 1) * 8 + index + 1}
                </td>

                {/* Avatar + Name */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={customer.avatar}
                      alt={customer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium" style={{ color: '#1A3F1C' }}>
                      {customer.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-4 py-4 text-sm" style={{ color: '#1A3F1C' }}>
                  {customer.email}
                </td>

                {/* Account Status */}
                <td className="px-4 py-4">
                  <StatusBadge status={customer.accountStatus} size="sm" />
                </td>

                {/* Orders Count */}
                <td className="px-4 py-4 text-sm font-medium" style={{ color: '#1A3F1C' }}>
                  {customer.orders}
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* View Button - Green Circle */}
                    <Link
                      href={`/operations/customers/${customer.id}`}
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: '#37A449' }}
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-white" />
                    </Link>

                    {/* Suspend/Activate Button - Yellow Circle */}
                    {customer.accountStatus === 'active' ? (
                      <Link
                        href={`/operations/customers/${customer.id}/actions/suspend`}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Suspend Account"
                      >
                        <PauseCircle className="w-4 h-4 text-white" />
                      </Link>
                    ) : customer.accountStatus === 'suspended' ? (
                      <Link
                        href={`/operations/customers/${customer.id}/actions/activate`}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Activate Account"
                      >
                        <PlayCircle className="w-4 h-4 text-white" />
                      </Link>
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"
                        style={{ backgroundColor: '#FFCA3A' }}
                        title="Unverified - Lock"
                      >
                        <Lock className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* Delete Button - Red Circle */}
                    <Link
                      href={`/operations/customers/${customer.id}/actions/delete`}
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