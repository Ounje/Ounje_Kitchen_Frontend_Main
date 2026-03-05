// app/operations/riders/components/ActionModals.tsx
'use client';

import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  loading = false
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto"
        style={{ backgroundColor: '#1A3F1C' }}
      >
        <h2 className="text-white text-lg md:text-xl font-semibold text-center mb-6 md:mb-8">
          {title}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 md:py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm md:text-base"
            style={{
              backgroundColor: '#FFCA3A',
              color: '#1A3F1C'
            }}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 md:py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm md:text-base"
            style={{
              backgroundColor: '#98EF9B',
              color: '#1A3F1C'
            }}
          >
            {loading ? 'Processing...' : 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
}

export function SuccessModal({ isOpen, title, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="rounded-2xl p-6 md:p-8 w-full max-w-md mx-auto"
        style={{ backgroundColor: '#1A3F1C' }}
      >
        <h2 className="text-white text-lg md:text-xl font-semibold text-center mb-6 md:mb-8">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-full py-2.5 md:py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm md:text-base"
          style={{
            backgroundColor: '#98EF9B',
            color: '#1A3F1C'
          }}
        >
          Go Back To Home!
        </button>
      </div>
    </div>
  );
}