// app/operations/customers/components/ConfirmActionModal.tsx
'use client';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  confirmText = 'Yes',
  cancelText = 'No',
  loading = false
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-8 max-w-md w-full"
        style={{ backgroundColor: '#1A3F1C' }}
      >
        <h2 className="text-white text-xl font-semibold text-center mb-8">
          {title}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: '#FFCA3A',
              color: '#1A3F1C'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{
              backgroundColor: '#98EF9B',
              color: '#1A3F1C'
            }}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}