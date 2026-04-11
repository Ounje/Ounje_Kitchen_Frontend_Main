// 'use client';

// import { Staff } from '@/lib/user-data';

// interface StaffModalContentProps {
//   staff: Staff;
//   onClose: () => void;
// }

// export function StaffModalContent({ staff, onClose }: StaffModalContentProps) {
//   return (
//     <div className="p-6 space-y-6">
//       {/* Header with back button */}
//       <div className="flex items-center gap-3 mb-6">
//         <button
//           onClick={onClose}
//           className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <h2 className="text-2xl font-bold text-foreground">Staff Information</h2>
//       </div>

//       {/* User Info Card */}
//       <div className="bg-linear-to-br from-secondary/80 to-secondary rounded-lg p-6 space-y-4">
//         <div className="flex items-start gap-4">
//           <div className="shrink-0">
//             {staff.avatar && (
//               <img
//                 src={staff.avatar}
//                 alt={staff.name}
//                 className="w-20 h-20 rounded-lg object-cover border-2 border-secondary-foreground/20"
//               />
//             )}
//           </div>
//           <div className="flex-1 space-y-2">
//             <div className="text-sm text-foreground">
//               <span className="font-semibold">Name:</span> {staff.name}
//             </div>
//             <div className="text-sm text-foreground">
//               <span className="font-semibold">Role:</span> {staff.role || 'Staff'}
//             </div>
//             <div className="text-sm text-foreground">
//               <span className="font-semibold">Email:</span> {staff.email}
//             </div>
//             <div className="text-sm text-foreground">
//               <span className="font-semibold">Phone Number:</span> {staff.phoneNumber}
//             </div>
//             <div className="text-sm text-foreground">
//               <span className="font-semibold">Line Manager:</span> {staff.lineManager}
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
// import { superAdminApi, type Staff } from '@/lib/api/api';

// interface StaffModalContentProps {
//   staff: Staff;
//   onClose: () => void;
// }

// export function StaffModalContent({ staff: rowData, onClose }: StaffModalContentProps) {
//   const [staff, setStaff] = useState<Staff>(rowData);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     let cancelled = false;
//     superAdminApi.staff
//       .getById(rowData.id)
//       .then((data) => { if (!cancelled) setStaff(data); })
//       .catch(() => { if (!cancelled) toast.error('Could not load full staff details'); })
//       .finally(() => { if (!cancelled) setLoading(false); });
//     return () => { cancelled = true; };
//   }, [rowData.id]);

//   const phone  = staff.phoneNumber ?? staff.phone ?? '—';
//   const status = staff.statusOfAccount ?? staff.status ?? '—';

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <button
//           onClick={onClose}
//           className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <h2 className="text-2xl font-bold text-foreground">Staff Information</h2>
//       </div>

//       {loading ? (
//         <div className="space-y-3">
//           <Skeleton className="h-32 w-full rounded-xl" />
//           <Skeleton className="h-20 w-full rounded-xl" />
//         </div>
//       ) : (
//         <div className="bg-secondary rounded-xl p-5 space-y-4">
//           <div className="flex items-start gap-4">
//             {/* Avatar */}
//             {staff.avatar ? (
//               <img
//                 src={staff.avatar}
//                 alt={staff.name}
//                 className="w-20 h-20 rounded-xl object-cover border-2 border-secondary-foreground/20 shrink-0"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-xl bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center shrink-0">
//                 {staff.name?.[0]?.toUpperCase() ?? '?'}
//               </div>
//             )}

//             {/* Info rows */}
//             <div className="flex-1 space-y-2">
//               <InfoRow label="Name"         value={staff.name} />
//               <InfoRow label="Role"         value={staff.role ?? 'Staff'} />
//               <InfoRow label="Department"   value={staff.department ?? '—'} />
//               <InfoRow label="Email"        value={staff.email} />
//               <InfoRow label="Phone Number" value={phone} />
//               <InfoRow label="Line Manager" value={staff.lineManager ?? '—'} />
//               <div className="flex items-center gap-2 text-sm text-foreground">
//                 <span className="font-semibold">Status:</span>
//                 <StatusBadge status={status} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Shared micro-components ─────────────────────────────────────────────────

// function StatusBadge({ status }: { status: string }) {
//   const s = status.toLowerCase();
//   const cls =
//     s === 'active'      ? 'bg-green-100 text-green-700'   :
//     s === 'suspended'   ? 'bg-red-100   text-red-700'     :
//     s === 'pending'     ? 'bg-yellow-100 text-yellow-700' :
//     s === 'deactivated' ? 'bg-gray-100  text-gray-600'    :
//                           'bg-primary   text-primary-foreground';
//   return <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${cls}`}>{status}</span>;
// }

// function InfoRow({ label, value }: { label: string; value: string }) {
//   return (
//     <div className="text-sm text-foreground">
//       <span className="font-semibold">{label}: </span>
//       <span>{value}</span>
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { superAdminApi, type Staff } from '@/lib/api/api';

interface StaffModalContentProps {
  staff: Staff;
  onClose: () => void;
}

export function StaffModalContent({ staff: rowData, onClose }: StaffModalContentProps) {
  const [staff, setStaff] = useState<Staff>(rowData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    superAdminApi.staff
      .getById(rowData.id)
      .then((res) => { if (!cancelled) setStaff(res.data); })
      .catch(() => { if (!cancelled) toast.error('Could not load full staff details'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [rowData.id]);

  const phone  = staff.phoneNumber ?? staff.phone ?? '—';
  const status = staff.statusOfAccount ?? staff.status ?? '—';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-foreground">Staff Information</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : (
        <div className="bg-secondary rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            {staff.avatar ? (
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-20 h-20 rounded-xl object-cover border-2 border-secondary-foreground/20 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-primary/20 text-primary font-bold text-2xl flex items-center justify-center shrink-0">
                {staff.name?.[0]?.toUpperCase() ?? '?'}
              </div>
            )}

            {/* Info rows */}
            <div className="flex-1 space-y-2">
              <InfoRow label="Name"         value={staff.name ?? '—'} />
              <InfoRow label="Role"         value={staff.role ?? 'Staff'} />
              <InfoRow label="Department"   value={staff.department ?? '—'} />
              <InfoRow label="Email"        value={staff.email} />
              <InfoRow label="Phone Number" value={phone} />
              <InfoRow label="Line Manager" value={staff.lineManager ?? '—'} />
              <div className="flex items-center gap-2 text-sm text-foreground">
                <span className="font-semibold">Status:</span>
                <StatusBadge status={status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared micro-components ─────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const cls =
    s === 'active'      ? 'bg-green-100 text-green-700'   :
    s === 'suspended'   ? 'bg-red-100   text-red-700'     :
    s === 'pending'     ? 'bg-yellow-100 text-yellow-700' :
    s === 'deactivated' ? 'bg-gray-100  text-gray-600'    :
                          'bg-primary   text-primary-foreground';
  return <span className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${cls}`}>{status}</span>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-sm text-foreground">
      <span className="font-semibold">{label}: </span>
      <span>{value}</span>
    </div>
  );
}