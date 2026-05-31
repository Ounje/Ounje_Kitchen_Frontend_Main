'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { ModalWatermark } from '@/components/finance/ModalWatermark';
import financeService, { type WithdrawalDetail } from '@/lib/api/services/finance.service';

function StatusBadge({ status }: { status: 'PASS' | 'FAIL' }) {
  return (
    <span
      className="px-2.5 py-0.5 rounded text-xs font-bold text-white"
      className={status === "PASS" ? "bg-[#1a3f1c]" : "bg-red-600"}
    >
      {status}
    </span>
  );
}

export default function WithdrawalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [detail, setDetail]   = useState<WithdrawalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    if (!id) return;
    setError(false);
    financeService.getWithdrawalDetail(id)
      .then((res: any) => {
        // Backend wraps single objects in { success, data: { ... } }
        const payload = res?.data ?? res;
        setDetail(payload as WithdrawalDetail);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => window.print();

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center py-6 px-4 print:p-0"
      className="bg-gray-50"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl print:shadow-none print:rounded-none print:max-w-full"
        className="bg-gray-50"
        id="withdrawal-slip"
      >
        <ModalWatermark />

        {/* Header */}
        <div className="relative flex items-center justify-center px-12 py-5 border-b border-[#98EF9B]/50">
          <h1
            className="font-bold text-sm sm:text-base text-center break-all"
            className="text-[#1a3f1c]"
          >
            {loading ? '—' : detail?.withdrawalId ?? '—'}
          </h1>
          <button
            onClick={() => router.back()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors print:hidden"
          >
            <X className="w-5 h-5" className="text-[#1a3f1c]" />
          </button>
        </div>

        <div className="relative px-5 sm:px-8 py-5 space-y-5">
          {loading ? (
            <div className="space-y-3 py-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : error || !detail ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {error ? 'Failed to load withdrawal.' : 'Withdrawal not found.'}
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg text-white text-sm"
                className="bg-[#1a3f1c]"
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {/* Personal Details */}
              <section>
                <p className="text-sm font-semibold mb-2" className="text-[#1a3f1c]">
                  Personal Details
                </p>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm"
                  className="bg-[#98ef9b]/40"
                >
                  <span className="text-[#1a3f1c]">
                    <b>Vendor:</b> {detail.vendorName}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Bank:</b> {detail.bankName}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Account Number:</b> {detail.accountNumber}
                  </span>
                </div>
              </section>

              {/* Transaction Details */}
              <section>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold underline decoration-blue-500 text-blue-600 cursor-default">
                    Transaction Details
                  </p>
                  <p className="text-sm" className="text-[#1a3f1c]">
                    Payment Method: {detail.paymentMethod}
                  </p>
                </div>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm"
                  className="bg-[#98ef9b]/40"
                >
                  <span className="break-all" className="text-[#1a3f1c]">
                    <b>Withdrawal ID:</b> {detail.withdrawalId}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Amount:</b> ₦{detail.amount.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-2" className="text-[#1a3f1c]">
                    <b>Status:</b>
                    <StatusBadge status={detail.status} />
                  </span>
                </div>
              </section>

              {/* Note */}
              <section>
                <p className="text-sm font-semibold mb-2" className="text-[#1a3f1c]">
                  Note
                </p>
                <div
                  className="rounded-lg px-4 py-3 text-sm"
                  className="bg-[#98ef9b]/40 text-[#1a3f1c]"
                >
                  {detail.note}
                </div>
              </section>
            </>
          )}

          {!loading && detail && (
            <button
              onClick={handleDownload}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity print:hidden"
              className="bg-[#1a3f1c]"
            >
              Download Slip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}