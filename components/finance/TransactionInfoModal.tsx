"use client";

import { X } from "lucide-react";
import { ModalWatermark } from "./ModalWatermark";
import type { TransactionDetail } from "@/lib/api/services/finance.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  detail: TransactionDetail | null;
  loading?: boolean;
  onDownload?: () => void;
}

export function TransactionInfoModal({ isOpen, onClose, detail, loading, onDownload }: Props) {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    window.print();
  };

  const rows = detail
    ? [
        { label: "Order Cost", value: detail.orderCost },
        { label: "Service Cost", value: detail.serviceCost },
        { label: "Platform Markup", value: detail.platformMarkup },
        { label: "Combo Markup", value: detail.comboMarkup },
        { label: "Delivery Fee", value: detail.deliveryFee },
      ]
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-50">
        <ModalWatermark />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-[#98EF9B]/50">
          <h2 className="font-bold text-base sm:text-lg text-center flex-1 pr-8 text-[#1a3f1c]">
            {detail?.orderId ?? "—"}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5 text-[#1a3f1c]" />
          </button>
        </div>

        <div className="relative px-5 sm:px-8 py-5 space-y-5">
          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1a3f1c]" />
            </div>
          ) : detail ? (
            <>
              {/* Personal Details */}
              <div>
                <p className="text-sm font-semibold mb-2 text-[#1a3f1c]">Personal Details</p>
                <div className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm bg-gray-50 border-b border-gray-100">
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
              </div>

              {/* Transaction Details */}
              <div>
                <p className="text-sm font-semibold mb-2 text-[#1a3f1c]">Transaction Details</p>
                <div className="rounded-lg px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm bg-gray-50 border-b border-gray-100">
                  <span className="text-[#1a3f1c]">
                    <b>Order ID:</b> {detail.orderId}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Payment Method:</b> {detail.paymentMethod}
                  </span>
                  <span className="break-all text-[#1a3f1c]">
                    <b>Transaction ID:</b> {detail.transactionId}
                  </span>
                  <span className="text-[#1a3f1c]">
                    <b>Amount:</b> ₦{detail.amount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <p className="text-sm font-semibold mb-2 text-[#1a3f1c]">Order Details</p>
                <div className="rounded-lg px-4 py-3 text-sm space-y-2 bg-[#98ef9b]/40 text-[#1a3f1c]">
                  {rows.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span>{label}</span>
                      <div className="flex-1 mx-3 border-b border-[#1A3F1C]/20" />
                      <span>₦{value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#1A3F1C]/30 pt-2 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₦{detail.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">No data available</p>
          )}

          <button
            onClick={handleDownload}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity bg-[#1a3f1c]"
          >
            Download Slip
          </button>
        </div>
      </div>
    </div>
  );
}
