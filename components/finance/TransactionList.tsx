'use client';

import { Fragment } from 'react';
import { Info, FileDown, Receipt } from 'lucide-react';
import type { TransactionGroup } from '@/lib/api/services/finance.service';

// ── Payment method badge ──────────────────────────────────────────────────────
function PaymentBadge({ method }: { method: string }) {
  const lower = (method ?? '').toLowerCase();
  const cls =
    lower.includes('bank') || lower.includes('dva') || lower.includes('transfer')
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : lower.includes('card')
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : lower.includes('wallet')
          ? 'bg-purple-100 text-purple-700 border-purple-200'
          : 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold border ${cls} whitespace-nowrap`}>
      {method || '—'}
    </span>
  );
}

const fmtTime = (d?: string) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: true });
  } catch { return '—'; }
};

const shortId = (id?: string | null) => {
  if (!id) return '—';
  const s = String(id);
  return s.length > 16 ? `${s.slice(0, 6)}…${s.slice(-4)}` : s;
};

const thCls = 'px-4 py-3 text-sm font-semibold text-left whitespace-nowrap';

interface Props {
  groups:  TransactionGroup[];
  onInfo:  (id: string) => void;
  onPrint: (id: string) => void;
}

export function TransactionList({ groups, onInfo, onPrint }: Props) {
  if (groups.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center">
        <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-semibold">No transactions found.</p>
        <p className="text-gray-300 text-xs mt-1">Try adjusting the date range or search filters.</p>
      </div>
    );
  }

  let rowNum = 0;

  return (
    <div className="bg-surface border border-border rounded-xl w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">

          {/* ── Header ── */}
          <thead>
            <tr className="bg-[#98ef9b] dark:bg-[#1a3f1c]/20 border-b border-border">
              <th className={`${thCls} text-foreground/90`}>#</th>
              <th className={`${thCls} text-foreground/90`}>Customer</th>
              <th className={`${thCls} text-foreground/90`}>Vendor</th>
              <th className={`${thCls} text-foreground/90`}>Amount</th>
              <th className={`${thCls} text-foreground/90`}>Order ID</th>
              <th className={`${thCls} text-foreground/90`}>Txn ID</th>
              <th className={`${thCls} text-foreground/90`}>Type</th>
              <th className={`${thCls} text-foreground/90`}>Time</th>
              <th className={`${thCls} text-foreground/90`}>Actions</th>
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {groups.map(group => {
              const groupTotal = group.transactions.reduce((s, t) => s + (t.amount ?? 0), 0);
              return (
                <Fragment key={group.date}>
                  {/* Date separator */}
                  <tr className="bg-[#1a3f1c]/[0.04] border-y border-border/30">
                    <td colSpan={9} className="px-4 py-2">
                      <span className="text-xs font-semibold text-foreground/60">{group.date}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {group.transactions.length} txn{group.transactions.length !== 1 ? 's' : ''} · ₦{groupTotal.toLocaleString()}
                      </span>
                    </td>
                  </tr>

                  {/* Transaction rows */}
                  {group.transactions.map(tx => {
                    rowNum += 1;
                    return (
                      <tr key={tx.id} className="border-b border-border hover:bg-surface-secondary transition-colors">

                        {/* # */}
                        <td className="px-4 py-3 text-sm text-muted-foreground">{rowNum}</td>

                        {/* Customer */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                              {tx.customerAvatar
                                ? <img src={tx.customerAvatar} alt={tx.customerName} className="w-full h-full object-cover" />
                                : (tx.customerName ?? 'U')[0].toUpperCase()
                              }
                            </div>
                            <span className="text-sm font-bold text-foreground whitespace-nowrap max-w-[140px] truncate">
                              {tx.customerName}
                            </span>
                          </div>
                        </td>

                        {/* Vendor */}
                        <td className="px-4 py-3 text-sm font-medium text-foreground max-w-[140px] truncate whitespace-nowrap">
                          {tx.vendorName}
                        </td>

                        {/* Amount + payment badge */}
                        <td className="px-4 py-3">
                          <p className="text-sm font-bold text-[#1a3f1c] whitespace-nowrap">
                            ₦{(tx.amount ?? 0).toLocaleString()}
                          </p>
                          <div className="mt-0.5">
                            <PaymentBadge method={tx.paymentMethod ?? '—'} />
                          </div>
                        </td>

                        {/* Order ID */}
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                          {shortId(String(tx.orderId))}
                        </td>

                        {/* Transaction ID */}
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                          {shortId(tx.transactionId)}
                        </td>

                        {/* Order Type */}
                        <td className="px-4 py-3">
                          <span className="inline-block px-3 py-1 rounded text-xs font-semibold bg-[#FFCA3A] dark:bg-yellow-500/20 text-[#1A3F1C] dark:text-yellow-400 whitespace-nowrap">
                            {tx.orderType}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {fmtTime(tx.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onInfo(tx.id)}
                              title="View details"
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-surface-secondary hover:bg-surface-secondary/80 border border-border transition-colors"
                            >
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onPrint(tx.id)}
                              title="Download slip"
                              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1a3f1c] hover:opacity-80 transition-opacity"
                            >
                              <FileDown className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
