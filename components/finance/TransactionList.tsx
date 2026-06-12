'use client';

import { Fragment } from 'react';
import { Info, FileDown, Receipt } from 'lucide-react';
import type { TransactionGroup } from '@/lib/api/services/finance.service';

// ── Payment method badge ──────────────────────────────────────────────────────
function PaymentBadge({ method }: { method: string }) {
  const lower = method.toLowerCase();
  const cls =
    lower.includes('bank') || lower.includes('dva') || lower.includes('transfer')
      ? 'bg-amber-100 text-amber-700 border-amber-200'
      : lower.includes('card')
        ? 'bg-blue-100 text-blue-700 border-blue-200'
        : lower.includes('wallet')
          ? 'bg-purple-100 text-purple-700 border-purple-200'
          : 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${cls} whitespace-nowrap`}>
      {method}
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

const thCls = 'px-4 py-3 text-left text-[11px] font-black uppercase tracking-wide text-[#1a3f1c] whitespace-nowrap';

interface Props {
  groups: TransactionGroup[];
  onInfo:  (id: string) => void;
  onPrint: (id: string) => void;
}

export function TransactionList({ groups, onInfo, onPrint }: Props) {
  const allTx  = groups.flatMap(g => g.transactions);
  const total  = allTx.reduce((s, tx) => s + (tx.amount ?? 0), 0);

  if (groups.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-xl p-12 text-center">
        <Receipt className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-semibold">No transactions found for this period.</p>
        <p className="text-gray-300 text-xs mt-1">Try adjusting the date range or search filters.</p>
      </div>
    );
  }

  // running counter across all groups
  let rowNum = 0;

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          {allTx.length} transaction{allTx.length !== 1 ? 's' : ''}
        </p>
        <p className="text-sm font-black text-[#1a3f1c]">
          Total: ₦{total.toLocaleString()}
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="bg-[#98ef9b] border-b border-border">
                <th className={thCls}>#</th>
                <th className={thCls}>Customer</th>
                <th className={thCls}>Vendor</th>
                <th className={thCls}>Amount</th>
                <th className={thCls}>Order ID</th>
                <th className={thCls}>Txn ID</th>
                <th className={thCls}>Type</th>
                <th className={thCls}>Time</th>
                <th className={thCls}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {groups.map(group => {
                const groupTotal = group.transactions.reduce((s, t) => s + (t.amount ?? 0), 0);
                return (
                  <Fragment key={group.date}>
                    {/* ── Date group header row ── */}
                    <tr className="bg-[#1a3f1c]/5 border-y border-border/40">
                      <td colSpan={9} className="px-4 py-2">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#1a3f1c]/60">
                          {group.date}
                        </span>
                        <span className="ml-2 text-[11px] text-gray-400">
                          {group.transactions.length} txn{group.transactions.length !== 1 ? 's' : ''} &nbsp;·&nbsp; ₦{groupTotal.toLocaleString()}
                        </span>
                      </td>
                    </tr>

                    {group.transactions.map(tx => {
                      rowNum += 1;
                      return (
                        <tr key={tx.id} className="border-b border-border/40 hover:bg-[#98ef9b]/10 transition-colors">

                          {/* # */}
                          <td className="px-4 py-3 text-xs text-gray-400 font-bold">{rowNum}</td>

                          {/* Customer */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500">
                                {tx.customerAvatar
                                  ? <img src={tx.customerAvatar} alt={tx.customerName} className="w-full h-full object-cover" />
                                  : (tx.customerName ?? 'U')[0].toUpperCase()
                                }
                              </div>
                              <span className="text-sm font-semibold text-foreground max-w-[140px] truncate whitespace-nowrap">
                                {tx.customerName}
                              </span>
                            </div>
                          </td>

                          {/* Vendor */}
                          <td className="px-4 py-3 text-sm text-foreground/70 max-w-[130px] truncate whitespace-nowrap">
                            {tx.vendorName}
                          </td>

                          {/* Amount + payment badge */}
                          <td className="px-4 py-3">
                            <p className="text-sm font-black text-[#1a3f1c] whitespace-nowrap">
                              ₦{(tx.amount ?? 0).toLocaleString()}
                            </p>
                            <div className="mt-0.5">
                              <PaymentBadge method={tx.paymentMethod ?? '—'} />
                            </div>
                          </td>

                          {/* Order ID */}
                          <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                            {shortId(String(tx.orderId))}
                          </td>

                          {/* Transaction ID */}
                          <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                            {shortId(tx.transactionId)}
                          </td>

                          {/* Order Type */}
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#1a3f1c]/10 text-[#1a3f1c] whitespace-nowrap">
                              {tx.orderType}
                            </span>
                          </td>

                          {/* Time */}
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                            {fmtTime(tx.createdAt)}
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => onInfo(tx.id)}
                                title="View details"
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1a3f1c] hover:bg-[#163318] transition-colors"
                              >
                                <Info className="w-3.5 h-3.5 text-white" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onPrint(tx.id)}
                                title="Download slip"
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FFCA3A] hover:bg-[#e5b535] transition-colors"
                              >
                                <FileDown className="w-3.5 h-3.5 text-[#1a3f1c]" />
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
    </div>
  );
}
