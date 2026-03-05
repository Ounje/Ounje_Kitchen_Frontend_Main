// app/operations/vendors/components/SuccessModal.tsx
'use client';

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  onGoHome: () => void;
}

export function SuccessModal({ isOpen, title, onGoHome }: SuccessModalProps) {
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
        <button
          onClick={onGoHome}
          className="w-full py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
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