'use client';

import { Customer } from '@/lib/user-data';

interface CustomerModalContentProps {
  customer: Customer;
  onClose: () => void;
}

export function CustomerModalContent({ customer, onClose }: CustomerModalContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header with close button */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Customer's Information</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* User Info Card */}
      <div className="bg-linear-to-br from-secondary/80 to-secondary rounded-lg p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="shrink-0">
              {customer.avatar && (
                <img
                  src={customer.avatar}
                  alt={customer.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-secondary-foreground/20"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-3">{customer.name}</h3>
              <div className="space-y-1 text-sm text-foreground/80">
                <div className="flex items-center gap-2">
                  <span className="font-medium">📱</span> {customer.phoneNumber}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">✉️</span> {customer.email}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📍</span> {customer.address}
                </div>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shrink-0">
            {customer.statusOfAccount}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Order Statistics */}
        <div className="bg-secondary rounded-lg p-6 space-y-4">
          <h4 className="font-bold text-foreground text-lg">Order number</h4>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-primary text-white font-semibold flex items-center justify-center text-sm">
                  7
                </span>
                <span className="text-sm text-foreground/70">successful orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-red-500 text-white font-semibold flex items-center justify-center text-sm">
                  2
                </span>
                <span className="text-sm text-foreground/70">cancelled orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-accent text-accent-foreground font-semibold flex items-center justify-center text-sm">
                  1
                </span>
                <span className="text-sm text-foreground/70">pending orders</span>
              </div>
            </div>
            <div className="w-24 h-24 rounded-full border-8 border-accent bg-secondary flex items-center justify-center">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">10</div>
                <div className="text-xs text-foreground/70">total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Used Vendor */}
        <div className="bg-primary rounded-lg p-6 space-y-4">
          <h4 className="font-bold text-primary-foreground text-lg">Most used vendor</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-primary-foreground/20 shrink-0 overflow-hidden">
                <img
                  src={customer.avatar}
                  alt="Vendor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-primary-foreground text-sm truncate">
                  Iya Bolu - Adekunle
                </div>
                <div className="text-xs text-primary-foreground/80">123 old simpson Avenue (yaba zone)</div>
              </div>
            </div>
            <div className="bg-secondary rounded-lg px-3 py-2 text-center">
              <div className="text-sm font-semibold text-foreground">Total orders: 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
