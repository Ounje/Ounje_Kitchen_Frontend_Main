'use client';

import { Order } from '@/lib/orders-data';

interface OrderInfoModalProps {
  order: Order;
  onClose: () => void;
  onFlagClick: () => void;
}

export function OrderInfoModal({ order, onClose, onFlagClick }: OrderInfoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Order Information</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Image */}
          <img
            src={order.foodImage}
            alt="Order"
            className="w-full h-48 object-cover rounded-lg"
          />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-[#98EF9B] rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground mb-3">Customer Details</h3>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="text-foreground font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-foreground">{order.customerAddress}</span>
              </div>
            </div>

            {/* Vendor Details */}
            <div className="bg-[#98EF9B] rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-foreground mb-3">Vendor Details</h3>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="text-foreground font-medium">{order.vendorName}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-foreground">21, Old yaba road, surulere.</span>
              </div>
            </div>

            {/* Rider Details */}
            <div className="bg-[#98EF9B] rounded-lg p-2 space-y-1">
              <h3 className="font-semibold text-foreground mb-3">Rider Details</h3>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-foreground"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                <span className="text-foreground font-medium">{order.riderName}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-600 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-foreground">{order.riderZone}</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-[#98EF9B] rounded-lg p-2 space-y-1">
              <h3 className="font-semibold text-foreground mb-3">Order Details</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-lg text-black">
                    <span className="font-medium">Order ID : </span>{" "}
                    {order.orderId}
                </p>
                </div>
                <div>
                  <p className="text-lg text-black">
                    <span className="font-medium">Amount Paid :</span>{" "}
                    ₦{order.amountPaid.toLocaleString()}
                </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="text-center py-4 border-y border-border">
            <p className="text-lg font-semibold text-foreground">
              Status: <span className="text-primary capitalize">{order.status}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer">
              Print Slip
            </button>
            <button
              onClick={onFlagClick}
              className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Flag Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
