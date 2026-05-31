'use client';

import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  loading?: boolean;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, loading = false }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto" className="bg-[#1a3f1c]">
        <h2 className="text-white text-base sm:text-xl font-semibold text-center mb-6 sm:mb-8">
          {title}
        </h2>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 sm:py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
            className="bg-amber-400 text-[#1a3f1c]"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 sm:py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
            className="bg-[#98ef9b]/50 text-[#1a3f1c]"
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto" className="bg-[#1a3f1c]">
        <h2 className="text-white text-base sm:text-xl font-semibold text-center mb-6 sm:mb-8">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-full py-2.5 sm:py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm sm:text-base"
          className="bg-[#98ef9b]/50 text-[#1a3f1c]"
        >
          Go Back To Home!
        </button>
      </div>
    </div>
  );
}