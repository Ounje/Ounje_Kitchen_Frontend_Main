// 'use client';

// interface FlagConfirmModalProps {
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// export function FlagConfirmModal({ onConfirm, onCancel }: FlagConfirmModalProps) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-primary rounded-lg p-8 max-w-md w-full text-center space-y-6">
//         <h2 className="text-2xl font-bold text-primary-foreground">
//           Are you sure, you want to flag this order?
//         </h2>
//         <div className="flex gap-4 justify-center">
//           <button
//             onClick={onCancel}
//             className="px-8 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             No
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-8 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
//           >
//             Yes
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// interface FlagSuccessModalProps {
//   onClose: () => void;
// }

// export function FlagSuccessModal({ onClose }: FlagSuccessModalProps) {
//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-primary rounded-lg p-8 max-w-md w-full text-center space-y-6">
//         <h2 className="text-2xl font-bold text-primary-foreground">
//           The order has successfully been flagged!
//         </h2>
//         <button
//           onClick={onClose}
//           className="px-8 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity w-full"
//         >
//           Go Back To Home!
//         </button>
//       </div>
//     </div>
//   );
// }


'use client';

import { Loader2 } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Flag Confirm Modal
// ─────────────────────────────────────────────────────────────────────────────

interface FlagConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  /** Shows a spinner on the Yes button while the API call is in-flight */
  loading?: boolean;
}

export function FlagConfirmModal({ onConfirm, onCancel, loading = false }: FlagConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-primary-foreground">
          Are you sure you want to flag this order?
        </h2>
        <p className="text-primary-foreground/80 text-sm">
          This will mark the order for review and notify the operations team.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2 min-w-[72px] justify-center"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Flag Success Modal
// ─────────────────────────────────────────────────────────────────────────────

interface FlagSuccessModalProps {
  onClose: () => void;
}

export function FlagSuccessModal({ onClose }: FlagSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl p-8 max-w-md w-full text-center space-y-6">
        <div className="text-5xl">✅</div>
        <h2 className="text-2xl font-bold text-primary-foreground">
          The order has successfully been flagged!
        </h2>
        <p className="text-primary-foreground/80 text-sm">
          The order has been marked for review. The operations team will follow up.
        </p>
        <button
          onClick={onClose}
          className="px-8 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity w-full"
        >
          Go Back To Home!
        </button>
      </div>
    </div>
  );
}