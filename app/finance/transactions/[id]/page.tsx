'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { ModalWatermark } from '@/components/finance/ModalWatermark';
import financeService, { type TransactionDetail } from '@/lib/api/services/finance.service';

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [detail, setDetail]   = useState<TransactionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    if (!id) return;
    setError(false);
    financeService.getTransactionDetail(id)
      .then((res) => setDetail(res as TransactionDetail))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => window.print();

  const costRows = detail
    ? [
        { label: 'Order Cost',   value: detail.orderCost },
        { label: 'Service Cost', value: detail.serviceCost },
        { label: 'Delivery Fee', value: detail.deliveryFee },
      ]
    : [];

  return (
    <div
      className="min-h-screen w-full flex items-start justify-center py-6 px-4 print:p-0"
      className="bg-gray-50"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl print:shadow-none print:rounded-none print:max-w-full"
        className="bg-gray-50"
        id="transaction-slip"
      >
        <ModalWatermark />

        {/* Header */}
        <div className="relative flex items-center justify-center px-12 py-5 border-b border-[#98EF9B]/50">
          <h1
            className="font-bold text-sm sm:text-base text-center break-all"
            className="text-[#1a3f1c]"
          >
            {loading ? '—' : detail?.orderId ?? '—'}
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
                {error ? 'Failed to load transaction.' : 'Transaction not found.'}
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
                  className="bg-gray-50 border-b border-gray-100"
                >
                  <span className="text-[#1a3f1c]">
                    <b>Customer:</b> {detail.customerName}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Vendor:</b> {detail.vendorName}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Order Type:</b> {detail.orderType}
                  </span>
                </div>
              </section>

              {/* Transaction Details */}
              <section>
                <p className="text-sm font-semibold mb-2" className="text-[#1a3f1c]">
                  Transaction Details
                </p>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                  className="bg-gray-50 border-b border-gray-100"
                >
                  <span className="text-[#1a3f1c]">
                    <b>Order ID:</b> {detail.orderId}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Payment Method:</b> {detail.paymentMethod}
                  </span>
                  <span className="break-all" className="text-[#1a3f1c]">
                    <b>Transaction ID:</b> {detail.transactionId}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Amount:</b> ₦{detail.amount.toLocaleString()}
                  </span>
                </div>
              </section>

              {/* Order Details */}
              <section>
                <p className="text-sm font-semibold mb-2" className="text-[#1a3f1c]">
                  Order Details
                </p>
                <div
                  className="rounded-lg px-4 py-4 space-y-2 text-sm"
                  className="bg-[#98ef9b]/40 text-[#1a3f1c]"
                >
                  {costRows.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-28 flex-shrink-0">{label}</span>
                      <div className="flex-1 border-b border-[#1A3F1C]/20" />
                      <span className="font-medium">₦{value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold pt-2 border-t border-[#1A3F1C]/30">
                    <span>Total</span>
                    <span>₦{detail.total.toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </>
          )}

          {/* Download CTA */}
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