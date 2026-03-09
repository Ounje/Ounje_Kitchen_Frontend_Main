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

  useEffect(() => {
    if (!id) return;
    financeService.getTransactionDetail(id)
      .then(setDetail)
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
      style={{ backgroundColor: '#E8F7E8' }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl print:shadow-none print:rounded-none print:max-w-full"
        style={{ backgroundColor: '#E8F7E8' }}
        id="transaction-slip"
      >
        <ModalWatermark />

        {/* Header */}
        <div className="relative flex items-center justify-center px-12 py-5 border-b border-[#98EF9B]/50">
          <h1
            className="font-bold text-sm sm:text-base text-center break-all"
            style={{ color: '#1A3F1C' }}
          >
            {loading ? '—' : detail?.orderId}
          </h1>
          <button
            onClick={() => router.back()}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors print:hidden"
          >
            <X className="w-5 h-5" style={{ color: '#1A3F1C' }} />
          </button>
        </div>

        <div className="relative px-5 sm:px-8 py-5 space-y-5">
          {loading ? (
            <div className="space-y-3 py-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : !detail ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Transaction not found.</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg text-white text-sm"
                style={{ backgroundColor: '#1A3F1C' }}
              >
                Go Back
              </button>
            </div>
          ) : (
            <>
              {/* Personal Details */}
              <section>
                <p className="text-sm font-semibold mb-2" style={{ color: '#1A3F1C' }}>
                  Personal Details
                </p>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm"
                  style={{ backgroundColor: '#98EF9B' }}
                >
                  <span style={{ color: '#1A3F1C' }}>
                    <b>Customer:</b> {detail.customerName}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>
                    <b>Vendor:</b> {detail.vendorName}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>
                    <b>Order Type:</b> {detail.orderType}
                  </span>
                </div>
              </section>

              {/* Transaction Details */}
              <section>
                <p className="text-sm font-semibold mb-2" style={{ color: '#1A3F1C' }}>
                  Transaction Details
                </p>
                <div
                  className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm"
                  style={{ backgroundColor: '#98EF9B' }}
                >
                  <span style={{ color: '#1A3F1C' }}>
                    <b>Order ID:</b> {detail.orderId}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>
                    <b>Payment Method:</b> {detail.paymentMethod}
                  </span>
                  <span className="break-all" style={{ color: '#1A3F1C' }}>
                    <b>Transaction ID:</b> {detail.transactionId}
                  </span>
                  <span style={{ color: '#1A3F1C' }}>
                    <b>Amount:</b> ₦{detail.amount.toLocaleString()}
                  </span>
                </div>
              </section>

              {/* Order Details */}
              <section>
                <p className="text-sm font-semibold mb-2" style={{ color: '#1A3F1C' }}>
                  Order Details
                </p>
                <div
                  className="rounded-lg px-4 py-4 space-y-2 text-sm"
                  style={{ backgroundColor: '#98EF9B', color: '#1A3F1C' }}
                >
                  {costRows.map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-28 flex-shrink-0">{label}</span>
                      <div className="flex-1 border-b border-[#1A3F1C]/20" />
                      <span className="font-medium">₦{value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between font-semibold pt-2 border-t border-[#1A3F1C]/30"
                  >
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
              style={{ backgroundColor: '#1A3F1C' }}
            >
              Download Slip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}