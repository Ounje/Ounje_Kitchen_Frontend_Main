'use client';

import { Info, Printer } from 'lucide-react';
import type { TransactionGroup } from '@/lib/api/services/finance.service';

interface Props {
  groups: TransactionGroup[];
  onInfo: (transactionId: string) => void;
  onPrint: (transactionId: string) => void;
}

export function TransactionList({ groups, onInfo, onPrint }: Props) {
  if (groups.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-400 text-sm">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {groups.map(group => (
        <div key={group.date}>
          {/* Date heading */}
          <p className="text-xs font-black uppercase tracking-widest text-[#1a3f1c]/50 mb-3 ml-1">
            {group.date}
          </p>

          {/* Group card */}
          <div
            className="rounded-2xl overflow-hidden divide-y divide-primary/10 bg-secondary border border-primary/5 shadow-sm"
          >
            {group.transactions.map((tx, idx) => (
              <div
                key={tx.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-white/10 transition-colors group`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                  {tx.customerAvatar ? (
                    <img src={tx.customerAvatar} alt={tx.customerName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-400" />
                  )}
                </div>

                {/* Info left */}
                <div className="flex-1 min-w-0 text-xs sm:text-sm text-[#1a3f1c]">
                  <p className="font-semibold truncate">
                    {tx.customerName} made payment of ₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="truncate">Vendor: {tx.vendorName}</p>
                  <p className="truncate">Order Type: {tx.orderType}</p>
                </div>

                {/* Info right */}
                <div className="hidden sm:block flex-1 min-w-0 text-xs sm:text-sm text-[#1a3f1c]">
                  <p className="truncate">Order ID: {tx.orderId}</p>
                  <p className="truncate">Payment Method: {tx.paymentMethod}</p>
                  <p className="truncate">Transaction ID: {tx.transactionId}</p>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => onInfo(tx.id)}
                    className="px-5 py-2 rounded-xl text-xs font-black text-white hover:opacity-90 transition-all bg-primary shadow-sm active:scale-95"
                  >
                    Info
                  </button>
                  <button
                    onClick={() => onPrint(tx.id)}
                    className="px-4 py-1.5 rounded text-xs font-semibold text-white hover:opacity-90 transition-opacity bg-[#1a3f1c]"
                  >
                    Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}