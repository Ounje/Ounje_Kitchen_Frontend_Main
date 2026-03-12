'use client';

import { Vendor } from '@/lib/user-data';

interface VendorModalContentProps {
  vendor: Vendor;
  onClose: () => void;
}

export function VendorModalContent({ vendor, onClose }: VendorModalContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Vendor's Information</h2>
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
      <div className="bg-linear-to-br from-secondary/80 to-secondary rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {vendor.avatar && (
              <img
                src={vendor.avatar}
                alt={vendor.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-secondary-foreground/20"
              />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">{vendor.name}</h3>
              <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
                {vendor.statusOfAccount}
              </span>
            </div>
            <div className="space-y-2 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <span className="font-medium">★ Rating:</span> {vendor.rating} ({vendor.reviewCount})
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📱 Phone:</span> {vendor.phoneNumber}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">📍 Zone:</span> {vendor.address}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total Orders */}
        <div className="bg-secondary rounded-lg p-6 space-y-4">
          <h4 className="font-bold text-foreground text-lg">Total Orders: {vendor.totalOrders}</h4>
          <div className="space-y-3">
            <div className="bg-primary rounded-lg px-4 py-3 text-white text-center font-semibold">
              <div className="text-2xl">30</div>
              <div className="text-xs opacity-90">Delivered orders</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-accent rounded-lg px-3 py-2 text-accent-foreground text-center font-semibold text-sm">
                <div>32</div>
                <div className="text-xs">Received orders</div>
              </div>
              <div className="bg-red-500 rounded-lg px-3 py-2 text-white text-center font-semibold text-sm">
                <div>2</div>
                <div className="text-xs">Rejected order</div>
              </div>
            </div>
          </div>
        </div>

        {/* Most Frequent Buyer */}
        <div className="bg-primary rounded-lg p-6 space-y-4">
          <h4 className="font-bold text-primary-foreground text-lg">Most frequent buyer</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg bg-primary-foreground/20 shrink-0 overflow-hidden">
                <img
                  src={vendor.avatar}
                  alt="Buyer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-primary-foreground text-sm">Madu South Okechukwu</div>
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
