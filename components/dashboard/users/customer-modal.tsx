// 'use client';

// import { Customer } from '@/lib/user-data';

// interface CustomerModalContentProps {
//   customer: Customer;
//   onClose: () => void;
// }

// export function CustomerModalContent({ customer, onClose }: CustomerModalContentProps) {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header with close button */}
//       <div className="flex items-start justify-between gap-4">
//         <h2 className="text-2xl font-bold text-foreground">Customer&apos;s Information</h2>
//         <button
//           onClick={onClose}
//           className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>

//       {/* User Info Card */}
//       <div className="bg-linear-to-br from-secondary/80 to-secondary rounded-lg p-6">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex items-center gap-4 flex-1">
//             <div className="shrink-0">
//               {customer.avatar && (
//                 <img
//                   src={customer.avatar}
//                   alt={customer.name}
//                   className="w-16 h-16 rounded-full object-cover border-2 border-secondary-foreground/20"
//                 />
//               )}
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-semibold text-foreground mb-3">{customer.name}</h3>
//               <div className="space-y-1 text-sm text-foreground/80">
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">📱</span> {customer.phoneNumber}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">✉️</span> {customer.email}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-medium">📍</span> {customer.address}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shrink-0">
//             {customer.statusOfAccount}
//           </span>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 gap-4">
//         {/* Order Statistics */}
//         <div className="bg-secondary rounded-lg p-6 space-y-4">
//           <h4 className="font-bold text-foreground text-lg">Order number</h4>
//           <div className="flex items-center justify-between">
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <span className="w-8 h-8 rounded bg-primary text-white font-semibold flex items-center justify-center text-sm">
//                   7
//                 </span>
//                 <span className="text-sm text-foreground/70">successful orders</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-8 h-8 rounded bg-red-500 text-white font-semibold flex items-center justify-center text-sm">
//                   2
//                 </span>
//                 <span className="text-sm text-foreground/70">cancelled orders</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="w-8 h-8 rounded bg-accent text-accent-foreground font-semibold flex items-center justify-center text-sm">
//                   1
//                 </span>
//                 <span className="text-sm text-foreground/70">pending orders</span>
//               </div>
//             </div>
//             <div className="w-24 h-24 rounded-full border-8 border-accent bg-secondary flex items-center justify-center">
//               <div className="text-center">
//                 <div className="text-xl font-bold text-foreground">10</div>
//                 <div className="text-xs text-foreground/70">total</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Most Used Vendor */}
//         <div className="bg-primary rounded-lg p-6 space-y-4">
//           <h4 className="font-bold text-primary-foreground text-lg">Most used vendor</h4>
//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="w-14 h-14 rounded-lg bg-primary-foreground/20 shrink-0 overflow-hidden">
//                 <img
//                   src={customer.avatar}
//                   alt="Vendor"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="font-semibold text-primary-foreground text-sm truncate">
//                   Iya Bolu - Adekunle
//                 </div>
//                 <div className="text-xs text-primary-foreground/80">123 old simpson Avenue (yaba zone)</div>
//               </div>
//             </div>
//             <div className="bg-secondary rounded-lg px-3 py-2 text-center">
//               <div className="text-sm font-semibold text-foreground">Total orders: 5</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import { Skeleton } from '@/components/ui/skeleton';
// import { toast } from 'sonner';
// import { superAdminApi, type Customer } from '@/lib/api/api';

// interface CustomerModalContentProps {
//   customer: Customer; // partial row data from the table
//   onClose: () => void;
// }

// export function CustomerModalContent({ customer: rowData, onClose }: CustomerModalContentProps) {
//   const [customer, setCustomer] = useState<Customer>(rowData);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     superAdminApi.customers
//       .getById(rowData.id)
//       .then((data) => { if (!cancelled) setCustomer(data); })
//       .catch(() => { if (!cancelled) toast.error('Could not load full customer details'); })
//       .finally(() => { if (!cancelled) setLoading(false); });
//     return () => { cancelled = true; };
//   }, [rowData.id]);

//   const phone   = customer.phoneNumber ?? customer.phone ?? '—';
//   const address = customer.address ?? '—';
//   const status  = customer.statusOfAccount ?? customer.status ?? '—';

//   // Derive total from breakdown if available, otherwise fall back to totalOrders
//   const successful = customer.successfulOrders ?? 0;
//   const cancelled_ = customer.cancelledOrders  ?? 0;
//   const pending    = customer.pendingOrders     ?? 0;
//   const total      = (successful + cancelled_ + pending) || (customer.totalOrders ?? 0);

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <h2 className="text-2xl font-bold text-foreground">Customer&apos;s Information</h2>
//         <button
//           onClick={onClose}
//           className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//           </svg>
//         </button>
//       </div>

//       {loading ? (
//         <ModalSkeleton />
//       ) : (
//         <>
//           {/* Profile card */}
//           <div className="bg-secondary rounded-xl p-5">
//             <div className="flex items-start justify-between gap-4">
//               <div className="flex items-center gap-4 flex-1">
//                 <Avatar name={customer.name} src={customer.avatar} size="lg" />
//                 <div className="space-y-1">
//                   <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
//                   <InfoLine icon="📱" value={phone} />
//                   <InfoLine icon="✉️" value={customer.email} />
//                   <InfoLine icon="📍" value={address} />
//                 </div>
//               </div>
//               <StatusBadge status={status} />
//             </div>
//           </div>

//           {/* Stats grid */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Order breakdown */}
//             <div className="bg-secondary rounded-xl p-5 space-y-4">
//               <h4 className="font-bold text-foreground text-lg">Order number</h4>
//               <div className="flex items-center justify-between gap-4">
//                 <div className="space-y-2">
//                   <StatBadge color="bg-primary"  value={successful} label="successful orders" />
//                   <StatBadge color="bg-red-500"   value={cancelled_} label="cancelled orders"  />
//                   <StatBadge color="bg-accent"    value={pending}    label="pending orders"    />
//                 </div>
//                 <DonutTotal total={total} />
//               </div>
//             </div>

//             {/* Most used vendor */}
//             <div className="bg-primary rounded-xl p-5 space-y-4">
//               <h4 className="font-bold text-primary-foreground text-lg">Most used vendor</h4>
//               {customer.mostUsedVendor ? (
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-3">
//                     <Avatar
//                       name={customer.mostUsedVendor.name}
//                       src={customer.mostUsedVendor.avatar}
//                       size="md"
//                       className="rounded-lg"
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-primary-foreground text-sm truncate">
//                         {customer.mostUsedVendor.name}
//                       </p>
//                       {customer.mostUsedVendor.address && (
//                         <p className="text-xs text-primary-foreground/70 truncate">
//                           {customer.mostUsedVendor.address}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                   <div className="bg-secondary rounded-lg px-3 py-2 text-center">
//                     <p className="text-sm font-semibold text-foreground">
//                       Total orders: {customer.mostUsedVendor.totalOrders}
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <p className="text-primary-foreground/60 text-sm">No vendor data yet</p>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ─── Shared micro-components (private to this file) ──────────────────────────

// function ModalSkeleton() {
//   return (
//     <div className="space-y-4">
//       <Skeleton className="h-28 w-full rounded-xl" />
//       <div className="grid grid-cols-2 gap-4">
//         <Skeleton className="h-44 rounded-xl" />
//         <Skeleton className="h-44 rounded-xl" />
//       </div>
//     </div>
//   );
// }

// function Avatar({
//   name,
//   src,
//   size = 'md',
//   className = '',
// }: {
//   name?: string;
//   src?: string;
//   size?: 'sm' | 'md' | 'lg';
//   className?: string;
// }) {
//   const dim =
//     size === 'lg' ? 'w-20 h-20 text-2xl' :
//     size === 'md' ? 'w-14 h-14 text-lg'  :
//                     'w-10 h-10 text-sm';
//   if (src) {
//     return (
//       <img
//         src={src}
//         alt={name}
//         className={`${dim} rounded-full object-cover shrink-0 border-2 border-secondary-foreground/20 ${className}`}
//       />
//     );
//   }
//   return (
//     <div
//       className={`${dim} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 ${className}`}
//     >
//       {(name ?? '?')[0]?.toUpperCase()}
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const s = status.toLowerCase();
//   const cls =
//     s === 'active'      ? 'bg-green-100 text-green-700' :
//     s === 'suspended'   ? 'bg-red-100   text-red-700'   :
//     s === 'pending'     ? 'bg-yellow-100 text-yellow-700' :
//     s === 'deactivated' ? 'bg-gray-100  text-gray-600'  :
//                           'bg-primary   text-primary-foreground';
//   return (
//     <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize shrink-0 ${cls}`}>
//       {status}
//     </span>
//   );
// }

// function InfoLine({ icon, value }: { icon: string; value: string }) {
//   return (
//     <div className="flex items-center gap-2 text-sm text-foreground/80">
//       <span>{icon}</span>
//       <span>{value}</span>
//     </div>
//   );
// }

// function StatBadge({ color, value, label }: { color: string; value: number; label: string }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span
//         className={`w-8 h-8 rounded ${color} text-white font-semibold flex items-center justify-center text-sm shrink-0`}
//       >
//         {value}
//       </span>
//       <span className="text-sm text-foreground/70">{label}</span>
//     </div>
//   );
// }

// function DonutTotal({ total }: { total: number }) {
//   return (
//     <div className="w-24 h-24 rounded-full border-8 border-accent bg-secondary flex items-center justify-center shrink-0">
//       <div className="text-center">
//         <div className="text-xl font-bold text-foreground">{total}</div>
//         <div className="text-xs text-foreground/70">total</div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { superAdminApi, type Customer } from "@/lib/api/api";

interface CustomerModalContentProps {
  customer: Customer; // partial row data from the table
  onClose: () => void;
}

export function CustomerModalContent({ customer: rowData, onClose }: CustomerModalContentProps) {
  const [customer, setCustomer] = useState<Customer>(rowData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    superAdminApi.customers
      .getById(rowData.id)
      .then((res) => {
        if (!cancelled) setCustomer(res.data.customer);
      })
      .catch(() => {
        if (!cancelled) toast.error("Could not load full customer details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [rowData.id]);

  const phone = customer.phoneNumber ?? customer.phone ?? "—";
  const address = customer.address ?? "—";
  const status = customer.statusOfAccount ?? customer.status ?? "—";

  // Derive total from breakdown if available, otherwise fall back to totalOrders
  const successful = customer.successfulOrders ?? 0;
  const cancelled_ = customer.cancelledOrders ?? 0;
  const pending = customer.pendingOrders ?? 0;
  const total = successful + cancelled_ + pending || (customer.totalOrders ?? 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Customer&apos;s Information</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <ModalSkeleton />
      ) : (
        <>
          {/* Profile card */}
          <div className="bg-secondary rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Avatar name={customer.name} src={customer.avatar} size="lg" />
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-foreground">{customer.name}</h3>
                  <InfoLine icon="📱" value={phone} />
                  <InfoLine icon="✉️" value={customer.email} />
                  <InfoLine icon="📍" value={address} />
                </div>
              </div>
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Order breakdown */}
            <div className="bg-secondary rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-foreground text-lg">Order number</h4>
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <StatBadge color="bg-primary" value={successful} label="successful orders" />
                  <StatBadge color="bg-red-500" value={cancelled_} label="cancelled orders" />
                  <StatBadge color="bg-accent" value={pending} label="pending orders" />
                </div>
                <DonutTotal total={total} />
              </div>
            </div>

            {/* Most used vendor */}
            <div className="bg-primary rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-primary-foreground text-lg">Most used vendor</h4>
              {customer.mostUsedVendor ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={customer.mostUsedVendor.name}
                      src={customer.mostUsedVendor.avatar}
                      size="md"
                      className="rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-primary-foreground text-sm truncate">
                        {customer.mostUsedVendor.name}
                      </p>
                      {customer.mostUsedVendor.address && (
                        <p className="text-xs text-primary-foreground/70 truncate">
                          {customer.mostUsedVendor.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="bg-secondary rounded-lg px-3 py-2 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      Total orders: {customer.mostUsedVendor.totalOrders}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-primary-foreground/60 text-sm">No vendor data yet</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shared micro-components (private to this file) ──────────────────────────

function ModalSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-44 rounded-xl" />
        <Skeleton className="h-44 rounded-xl" />
      </div>
    </div>
  );
}

function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim =
    size === "lg"
      ? "w-20 h-20 text-2xl"
      : size === "md"
        ? "w-14 h-14 text-lg"
        : "w-10 h-10 text-sm";
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${dim} rounded-full object-cover shrink-0 border-2 border-secondary-foreground/20 ${className}`}
      />
    );
  }
  return (
    <div
      className={`${dim} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 ${className}`}
    >
      {(name ?? "?")[0]?.toUpperCase()}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s === "active"
      ? "bg-green-100 text-green-700"
      : s === "suspended"
        ? "bg-red-100   text-red-700"
        : s === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : s === "deactivated"
            ? "bg-gray-100  text-gray-600"
            : "bg-primary   text-primary-foreground";
  return (
    <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize shrink-0 ${cls}`}>
      {status}
    </span>
  );
}

function InfoLine({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-foreground/80">
      <span>{icon}</span>
      <span>{value}</span>
    </div>
  );
}

function StatBadge({ color, value, label }: { color: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-8 h-8 rounded ${color} text-white font-semibold flex items-center justify-center text-sm shrink-0`}
      >
        {value}
      </span>
      <span className="text-sm text-foreground/70">{label}</span>
    </div>
  );
}

function DonutTotal({ total }: { total: number }) {
  return (
    <div className="w-24 h-24 rounded-full border-8 border-accent bg-secondary flex items-center justify-center shrink-0">
      <div className="text-center">
        <div className="text-xl font-bold text-foreground">{total}</div>
        <div className="text-xs text-foreground/70">total</div>
      </div>
    </div>
  );
}
