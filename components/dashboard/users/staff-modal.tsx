'use client';

import { Staff } from '@/lib/user-data';

interface StaffModalContentProps {
  staff: Staff;
  onClose: () => void;
}

export function StaffModalContent({ staff, onClose }: StaffModalContentProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
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

      {/* User Info Card */}
      <div className="bg-linear-to-br from-secondary/80 to-secondary rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="shrink-0">
            {staff.avatar && (
              <img
                src={staff.avatar}
                alt={staff.name}
                className="w-20 h-20 rounded-lg object-cover border-2 border-secondary-foreground/20"
              />
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-sm text-foreground">
              <span className="font-semibold">Name:</span> {staff.name}
            </div>
            <div className="text-sm text-foreground">
              <span className="font-semibold">Role:</span> {staff.role || 'Staff'}
            </div>
            <div className="text-sm text-foreground">
              <span className="font-semibold">Email:</span> {staff.email}
            </div>
            <div className="text-sm text-foreground">
              <span className="font-semibold">Phone Number:</span> {staff.phoneNumber}
            </div>
            <div className="text-sm text-foreground">
              <span className="font-semibold">Line Manager:</span> {staff.lineManager}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
