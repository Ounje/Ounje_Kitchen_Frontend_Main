'use client';

interface FlagConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function FlagConfirmModal({ onConfirm, onCancel }: FlagConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-lg p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-primary-foreground">
          Are you sure, you want to flag this order?
        </h2>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="px-8 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

interface FlagSuccessModalProps {
  onClose: () => void;
}

export function FlagSuccessModal({ onClose }: FlagSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-lg p-8 max-w-md w-full text-center space-y-6">
        <h2 className="text-2xl font-bold text-primary-foreground">
          The order has successfully been flagged!
        </h2>
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
