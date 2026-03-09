'use client';

import { Info, Trash2 } from 'lucide-react';
import type { DashboardWithdrawalRow } from '@/lib/api/services/finance.service';

interface Props {
  rows: DashboardWithdrawalRow[];
  onInfo: (row: DashboardWithdrawalRow) => void;
  onDelete: (id: string) => void;
}

function StatusBadge({ status }: { status: 'Successful' | 'Failed' }) {
  return (
    <span
      className="px-3 py-1 rounded text-xs font-semibold text-white whitespace-nowrap"
      style={{ backgroundColor: status === 'Successful' ? '#1A3F1C' : '#D00000' }}
    >
      {status}
    </span>
  );
}

export function DashboardWithdrawalTable({ rows, onInfo, onDelete }: Props) {
  const thCls = 'px-4 py-3 text-sm font-semibold text-left whitespace-nowrap';

  return (
    <div className="bg-white rounded-xl overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr style={{ backgroundColor: '#98EF9B' }}>
              <th className={thCls} style={{ color: '#1A3F1C' }}>User</th>
              <th className={thCls} style={{ color: '#1A3F1C' }}>Role</th>
              <th className={thCls} style={{ color: '#1A3F1C' }}>Process</th>
              <th className={thCls} style={{ color: '#1A3F1C' }}>Status</th>
              <th className={thCls} style={{ color: '#1A3F1C' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                  No withdrawals
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className="border-b border-gray-100 hover:bg-[#f7fdf7] transition-colors">
                  {/* User */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {row.userAvatar ? (
                          <img src={row.userAvatar} alt={row.userName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                            {row.userName[0]}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium whitespace-nowrap" style={{ color: '#1A3F1C' }}>
                        {row.userName}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 text-sm" style={{ color: '#1A3F1C' }}>{row.role}</td>

                  {/* Process */}
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-3 py-1.5 rounded text-xs font-semibold text-center leading-tight"
                      style={{ backgroundColor: '#FFCA3A', color: '#1A3F1C' }}
                    >
                      Request For Withdrawal<br />
                      ₦{row.amount.toLocaleString()}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onInfo(row)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors"
                        title="View Info"
                      >
                        <Info className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete(row.id)}
                        className="w-8 h-8 rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                        style={{ backgroundColor: '#D00000' }}
                        title="Delete"
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
    </div>
  );
}