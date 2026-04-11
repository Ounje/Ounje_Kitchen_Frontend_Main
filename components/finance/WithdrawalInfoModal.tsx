'use client';

import { X } from 'lucide-react';
import { ModalWatermark } from './ModalWatermark';
import type { WithdrawalDetail } from '@/lib/api/services/finance.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detail: WithdrawalDetail | null;
  loading?: boolean;
  onDownload?: () => void;
}

function StatusBadge({ status }: { status: 'PASS' | 'FAIL' }) {
  return (
    <span
      className="px-2.5 py-0.5 rounded text-xs font-bold text-white"
      style={{ backgroundColor: status === 'PASS' ? '#1A3F1C' : '#D00000' }}
    >
      {status}
    </span>
  );
}

export function WithdrawalInfoModal({ isOpen, onClose, detail, loading, onDownload }: Props) {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (onDownload) { onDownload(); return; }
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl print:shadow-none print:rounded-none print:max-w-full bg-[#E8F7E8] dark:bg-slate-900 border border-transparent dark:border-border"
        id="withdrawal-slip"
      >
        <ModalWatermark />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-[#98EF9B]/50 dark:border-border">
          <h2 className="font-bold text-base sm:text-lg text-center flex-1 pr-8 break-all text-[#1A3F1C] dark:text-primary">
            {detail?.withdrawalId ?? '—'}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors print:hidden"
          >
            <X className="w-5 h-5 text-[#1A3F1C] dark:text-foreground" />
          </button>
        </div>

        <div className="relative px-5 sm:px-8 py-5 space-y-5">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1A3F1C] dark:border-primary" />
            </div>
          ) : detail ? (
            <>
              {/* Personal Details */}
              <div>
                <p className="text-sm font-semibold mb-2 text-[#1A3F1C] dark:text-primary/90">Personal Details</p>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm bg-[#98EF9B] dark:bg-primary/20"
                >
                  <span className="text-[#1A3F1C] dark:text-primary/90"><b>Vendor:</b> {detail.vendorName}</span>
                  <span className="text-[#1A3F1C] dark:text-primary/90"><b>Bank:</b> {detail.bankName}</span>
                  <span className="text-[#1A3F1C] dark:text-primary/90"><b>Account Number:</b> {detail.accountNumber}</span>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold underline text-blue-600 dark:text-blue-400 cursor-pointer">Transaction Details</p>
                  <p className="text-sm text-[#1A3F1C] dark:text-primary/90">Payment Method: {detail.paymentMethod}</p>
                </div>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm bg-[#98EF9B] dark:bg-primary/20"
                >
                  <span className="break-all text-[#1A3F1C] dark:text-primary/90">
                    <b>Withdrawal ID:</b> {detail.withdrawalId}
                  </span>
                  <span className="text-[#1A3F1C] dark:text-primary/90">
                    <b>Amount:</b> ₦{detail.amount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-2 text-[#1A3F1C] dark:text-primary/90">
                    <b>Status:</b> <StatusBadge status={detail.status} />
                  </span>
                </div>
              </div>

              {/* Note */}
              <div>
                <p className="text-sm font-semibold mb-2 text-[#1A3F1C] dark:text-primary/90">Note</p>
                <div
                  className="rounded-lg px-4 py-3 text-sm bg-[#98EF9B] dark:bg-primary/20 text-[#1A3F1C] dark:text-primary/90"
                >
                  {detail.note}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-8">No data available</p>
          )}

          {/* Download Slip */}
          <button
            onClick={handleDownload}
            className="w-full py-3.5 rounded-xl text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity bg-primary print:hidden"
          >
            Download Slip
          </button>
        </div>
      </div>
    </div>
  );
}