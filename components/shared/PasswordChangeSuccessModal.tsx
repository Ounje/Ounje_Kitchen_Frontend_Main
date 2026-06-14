"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

interface PasswordChangeSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PasswordChangeSuccessModal({
  open,
  onClose,
}: PasswordChangeSuccessModalProps) {
  const { logout } = useAuth();

  const handleContinue = async () => {
    onClose();
    // ✅ Log user out so they login with new password
    await logout();
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-sm p-0 overflow-hidden"
        style={{ backgroundColor: "#1a3f1c" }}
      >
        <DialogTitle className="sr-only">Password Changed Successfully</DialogTitle>

        <div className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-[#98ef9b]" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Password Changed Successfully
            </h2>
            <p className="text-sm text-white/80">Please log in again with your new password</p>
          </div>

          <Button
            onClick={handleContinue}
            className="w-full py-6 text-base font-semibold"
            style={{ backgroundColor: "#98ef9b", color: "#1a3f1c" }}
          >
            Continue to Login
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
