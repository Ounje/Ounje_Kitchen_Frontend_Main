'use client';

import { Loader2 } from 'lucide-react';

interface ConfirmActionModalProps {
  isOpen:    boolean;
  title?:    string;
  loading?:  boolean;
  onConfirm: () => void;
  onClose:   () => void;
}

export function ConfirmActionModal({
  isOpen,
  title = 'Are you sure you want to perform this action?',
  loading = false,
  onConfirm,
  onClose,
}: ConfirmActionModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-2xl space-y-6 text-center bg-[#1a3f1c]"
      >
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
        </div>

        {/* Title */}
        <p className="text-white text-base sm:text-lg font-semibold leading-snug">
          {title}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-[#1A3F1C] bg-[#FFCA3A] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Yes, Confirm'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}