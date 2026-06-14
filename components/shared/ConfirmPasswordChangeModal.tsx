"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmPasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function ConfirmPasswordChangeModal({
  open,
  onOpenChange,
  onConfirm,
}: ConfirmPasswordChangeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden"
        style={{ backgroundColor: "#1a3f1c", borderRadius: "1rem" }}
      >
        {/* ✅ ADD THIS - Hidden but accessible to screen readers */}
        <DialogTitle className="sr-only">Confirm Password Change</DialogTitle>

        <div className="p-8 text-center space-y-6">
          <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
            Are you sure, you want to change your password?
          </h2>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => onOpenChange(false)}
              className="px-8 py-6 text-base font-semibold"
              style={{ backgroundColor: "#ffca3a", color: "#1a3f1c" }}
            >
              No
            </Button>
            <Button
              onClick={onConfirm}
              className="px-8 py-6 text-base font-semibold"
              style={{ backgroundColor: "#98ef9b", color: "#1a3f1c" }}
            >
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
