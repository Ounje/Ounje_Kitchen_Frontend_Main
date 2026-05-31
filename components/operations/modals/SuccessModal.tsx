'use client';

interface SuccessModalProps {
  isOpen:    boolean;
  title?:    string;
  onGoHome:  () => void;
}

export function SuccessModal({
  isOpen,
  title = 'Action completed successfully!',
  onGoHome,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 shadow-2xl space-y-6 text-center bg-[#1a3f1c]"
      >
        {/* Check icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[#98ef9b] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#1A3F1C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <p className="text-white text-base sm:text-lg font-semibold leading-snug">
          {title}
        </p>

        {/* Go Home */}
        <button
          onClick={onGoHome}
          className="w-full py-3 rounded-xl text-sm font-bold text-[#1A3F1C] bg-[#98ef9b] hover:opacity-90 transition-opacity"
        >
          Go to Customers
        </button>
      </div>
    </div>
  );
}