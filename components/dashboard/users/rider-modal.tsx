// 'use client';

// import { Rider } from '@/lib/user-data';

// interface RiderModalContentProps {
//   rider: Rider;
//   onClose: () => void;
// }

// export function RiderModalContent({ rider, onClose }: RiderModalContentProps) {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <h2 className="text-2xl font-bold text-foreground">Rider's Information</h2>
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
//       <div className="bg-linear-to-br from-secondary/80 to-secondary rounded-lg p-6 space-y-4">
//         <div className="flex items-start gap-4">
//           <div className="shrink-0">
//             {rider.avatar && (
//               <img
//                 src={rider.avatar}
//                 alt={rider.name}
//                 className="w-20 h-20 rounded-full object-cover border-2 border-secondary-foreground/20"
//               />
//             )}
//           </div>
//           <div className="flex-1">
//             <div className="flex items-center justify-between mb-2">
//               <h3 className="text-lg font-semibold text-foreground">{rider.name}</h3>
//               <span className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
//                 {rider.statusOfAccount}
//               </span>
//             </div>
//             <div className="space-y-2 text-sm text-foreground/80">
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">★ Rating:</span> {rider.rating} ({rider.reviewCount})
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">📱 Phone:</span> {rider.phoneNumber}
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-medium">📍 Zone:</span> {rider.address}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-2 gap-4">
//         {/* Total Orders */}
//         <div className="bg-secondary rounded-lg p-6 space-y-4">
//           <h4 className="font-bold text-foreground text-lg">Total Orders: {rider.totalDeliveries}</h4>
//           <div className="space-y-3">
//             <div className="bg-primary rounded-lg px-4 py-3 text-white text-center font-semibold">
//               <div className="text-2xl">{rider.totalDeliveries - 7}</div>
//               <div className="text-xs opacity-90">Delivered orders</div>
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <div className="bg-accent rounded-lg px-3 py-2 text-accent-foreground text-center font-semibold text-sm">
//                 <div>5</div>
//                 <div className="text-xs">Outgoing orders</div>
//               </div>
//               <div className="bg-red-500 rounded-lg px-3 py-2 text-white text-center font-semibold text-sm">
//                 <div>2</div>
//                 <div className="text-xs">Rejected order</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Most Frequent Zone */}
//         <div className="bg-primary rounded-lg p-6 space-y-4">
//           <h4 className="font-bold text-primary-foreground text-lg">Most frequent zone</h4>
//           <div className="bg-primary-foreground/10 rounded-lg overflow-hidden flex items-center justify-center h-24">
//             <div className="text-center text-sm text-primary-foreground">
//               <div className="font-semibold">Zone Preview</div>
//               <div className="text-xs opacity-75">(Map will display here)</div>
//             </div>
//           </div>
//           <div className="text-sm text-primary-foreground">
//             <div className="font-semibold">📍 {rider.address}</div>
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
// import { superAdminApi, type Rider } from '@/lib/api/api';

// interface RiderModalContentProps {
//   rider: Rider;
//   onClose: () => void;
// }

// export function RiderModalContent({ rider: rowData, onClose }: RiderModalContentProps) {
//   const [rider, setRider] = useState<Rider>(rowData);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     superAdminApi.riders
//       .getById(rowData.id)
//       .then((data) => { if (!cancelled) setRider(data); })
//       .catch(() => { if (!cancelled) toast.error('Could not load full rider details'); })
//       .finally(() => { if (!cancelled) setLoading(false); });
//     return () => { cancelled = true; };
//   }, [rowData.id]);

//   const phone  = rider.phoneNumber ?? rider.phone ?? '—';
//   const status = rider.statusOfAccount ?? rider.status ?? '—';
//   const total  = rider.totalDeliveries ?? rider.totalOrders ?? 0;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-start justify-between gap-4">
//         <h2 className="text-2xl font-bold text-foreground">Rider's Information</h2>
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
//             <div className="flex items-start gap-4">
//               <Avatar name={rider.name} src={rider.avatar} size="lg" />
//               <div className="flex-1">
//                 <div className="flex items-center justify-between mb-2 gap-3">
//                   <h3 className="text-lg font-semibold text-foreground">{rider.name}</h3>
//                   <StatusBadge status={status} />
//                 </div>
//                 <div className="space-y-1">
//                   {rider.rating != null && (
//                     <InfoLine
//                       icon="★"
//                       value={`${rider.rating}${rider.reviewCount != null ? ` (${rider.reviewCount} reviews)` : ''}`}
//                     />
//                   )}
//                   <InfoLine icon="📱" value={phone} />
//                   <InfoLine icon="📍" value={rider.address ?? '—'} />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats grid */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* Delivery breakdown */}
//             <div className="bg-secondary rounded-xl p-5 space-y-4">
//               <h4 className="font-bold text-foreground text-lg">
//                 Total Orders: {total}
//               </h4>
//               <div className="space-y-2">
//                 <div className="bg-primary rounded-lg px-4 py-3 text-white text-center font-semibold">
//                   <div className="text-2xl">{rider.deliveredOrders ?? '—'}</div>
//                   <div className="text-xs opacity-90">Delivered orders</div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="bg-accent rounded-lg px-3 py-2 text-accent-foreground text-center font-semibold text-sm">
//                     <div>{rider.outgoingOrders ?? '—'}</div>
//                     <div className="text-xs">Outgoing orders</div>
//                   </div>
//                   <div className="bg-red-500 rounded-lg px-3 py-2 text-white text-center font-semibold text-sm">
//                     <div>{rider.rejectedOrders ?? '—'}</div>
//                     <div className="text-xs">Rejected orders</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Most frequent zone */}
//             <div className="bg-primary rounded-xl p-5 space-y-4">
//               <h4 className="font-bold text-primary-foreground text-lg">Most frequent zone</h4>
//               <div className="bg-primary-foreground/10 rounded-lg overflow-hidden flex items-center justify-center h-24">
//                 <div className="text-center text-sm text-primary-foreground">
//                   <div className="font-semibold">Zone Preview</div>
//                   <div className="text-xs opacity-75">(Map will display here)</div>
//                 </div>
//               </div>
//               {rider.mostFrequentZone ? (
//                 <p className="text-sm text-primary-foreground font-semibold">
//                   📍 {rider.mostFrequentZone}
//                 </p>
//               ) : rider.address ? (
//                 <p className="text-sm text-primary-foreground font-semibold">
//                   📍 {rider.address}
//                 </p>
//               ) : null}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// // ─── Shared micro-components ─────────────────────────────────────────────────

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
//   name, src, size = 'md', className = '',
// }: {
//   name?: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string;
// }) {
//   const dim = size === 'lg' ? 'w-20 h-20 text-2xl' : size === 'md' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm';
//   if (src) {
//     return <img src={src} alt={name} className={`${dim} rounded-full object-cover shrink-0 border-2 border-secondary-foreground/20 ${className}`} />;
//   }
//   return (
//     <div className={`${dim} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 ${className}`}>
//       {(name ?? '?')[0]?.toUpperCase()}
//     </div>
//   );
// }

// function StatusBadge({ status }: { status: string }) {
//   const s = status.toLowerCase();
//   const cls =
//     s === 'active'      ? 'bg-green-100 text-green-700'   :
//     s === 'suspended'   ? 'bg-red-100   text-red-700'     :
//     s === 'pending'     ? 'bg-yellow-100 text-yellow-700' :
//     s === 'deactivated' ? 'bg-gray-100  text-gray-600'    :
//                           'bg-primary   text-primary-foreground';
//   return <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize shrink-0 ${cls}`}>{status}</span>;
// }

// function InfoLine({ icon, value }: { icon: string; value: string }) {
//   return (
//     <div className="flex items-center gap-2 text-sm text-foreground/80">
//       <span>{icon}</span><span>{value}</span>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { superAdminApi, type Rider } from '@/lib/api/api';

interface RiderModalContentProps {
  rider: Rider;
  onClose: () => void;
}

export function RiderModalContent({ rider: rowData, onClose }: RiderModalContentProps) {
  const [rider, setRider] = useState<Rider>(rowData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    superAdminApi.riders
      .getById(rowData.id)
      .then((res) => { if (!cancelled) setRider(res.data.rider); })
      .catch(() => { if (!cancelled) toast.error('Could not load full rider details'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [rowData.id]);

  const phone  = rider.phoneNumber ?? rider.phone ?? '—';
  const status = rider.statusOfAccount ?? rider.status ?? '—';
  const total  = rider.totalDeliveries ?? rider.totalOrders ?? 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Rider's Information</h2>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {loading ? (
        <ModalSkeleton />
      ) : (
        <>
          {/* Profile card */}
          <div className="bg-secondary rounded-xl p-5">
            <div className="flex items-start gap-4">
              <Avatar name={rider.name} src={rider.avatar} size="lg" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 gap-3">
                  <h3 className="text-lg font-semibold text-foreground">{rider.name}</h3>
                  <StatusBadge status={status} />
                </div>
                <div className="space-y-1">
                  {rider.rating != null && (
                    <InfoLine
                      icon="★"
                      value={`${rider.rating}${rider.reviewCount != null ? ` (${rider.reviewCount} reviews)` : ''}`}
                    />
                  )}
                  <InfoLine icon="📱" value={phone} />
                  <InfoLine icon="📍" value={rider.address ?? '—'} />
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Delivery breakdown */}
            <div className="bg-secondary rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-foreground text-lg">
                Total Orders: {total}
              </h4>
              <div className="space-y-2">
                <div className="bg-primary rounded-lg px-4 py-3 text-white text-center font-semibold">
                  <div className="text-2xl">{rider.deliveredOrders ?? '—'}</div>
                  <div className="text-xs opacity-90">Delivered orders</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-accent rounded-lg px-3 py-2 text-accent-foreground text-center font-semibold text-sm">
                    <div>{rider.outgoingOrders ?? '—'}</div>
                    <div className="text-xs">Outgoing orders</div>
                  </div>
                  <div className="bg-red-500 rounded-lg px-3 py-2 text-white text-center font-semibold text-sm">
                    <div>{rider.rejectedOrders ?? '—'}</div>
                    <div className="text-xs">Rejected orders</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Most frequent zone */}
            <div className="bg-primary rounded-xl p-5 space-y-4">
              <h4 className="font-bold text-primary-foreground text-lg">Most frequent zone</h4>
              <div className="bg-primary-foreground/10 rounded-lg overflow-hidden flex items-center justify-center h-24">
                <div className="text-center text-sm text-primary-foreground">
                  <div className="font-semibold">Zone Preview</div>
                  <div className="text-xs opacity-75">(Map will display here)</div>
                </div>
              </div>
              {rider.mostFrequentZone ? (
                <p className="text-sm text-primary-foreground font-semibold">
                  📍 {rider.mostFrequentZone}
                </p>
              ) : rider.address ? (
                <p className="text-sm text-primary-foreground font-semibold">
                  📍 {rider.address}
                </p>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Shared micro-components ─────────────────────────────────────────────────

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
  name, src, size = 'md', className = '',
}: {
  name?: string; src?: string; size?: 'sm' | 'md' | 'lg'; className?: string;
}) {
  const dim = size === 'lg' ? 'w-20 h-20 text-2xl' : size === 'md' ? 'w-14 h-14 text-lg' : 'w-10 h-10 text-sm';
  if (src) {
    return <img src={src} alt={name} className={`${dim} rounded-full object-cover shrink-0 border-2 border-secondary-foreground/20 ${className}`} />;
  }
  return (
    <div className={`${dim} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center shrink-0 ${className}`}>
      {(name ?? '?')[0]?.toUpperCase()}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s === 'active'      ? 'bg-green-100 text-green-700'   :
    s === 'suspended'   ? 'bg-red-100   text-red-700'     :
    s === 'pending'     ? 'bg-yellow-100 text-yellow-700' :
    s === 'deactivated' ? 'bg-gray-100  text-gray-600'    :
                          'bg-primary   text-primary-foreground';
  return <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize shrink-0 ${cls}`}>{status}</span>;
}

function InfoLine({ icon, value }: { icon: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-foreground/80">
      <span>{icon}</span><span>{value}</span>
    </div>
  );
}