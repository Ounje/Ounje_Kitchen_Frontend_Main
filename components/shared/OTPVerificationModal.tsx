"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface OTPVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
}

export default function OTPVerificationModal({
  open,
  onOpenChange,
  onVerify,
  onResend,
}: OTPVerificationModalProps) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      // Focus first input
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  // Countdown timer
  useEffect(() => {
    if (open && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [open, timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      toast.error("Please paste numbers only");
      return;
    }

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setVerifying(true);
    try {
      await onVerify(otpString);
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      await onResend();
      setTimer(60); // Reset timer
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      // Error handled in parent
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isComplete = otp.every((digit) => digit !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#e8f7e8" }}>
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-black/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Enter Verification Code
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            A one time six-digit code has been sent to your email; fill in the numbers you received.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t border-gray-300 my-4" />

        <div className="space-y-6">
          {/* OTP Input Boxes */}
          <div>
            <p className="text-sm text-center mb-3 text-gray-700">Fill in the codes here</p>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold bg-white"
                />
              ))}
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-sm text-gray-700">{formatTime(timer)} seconds</p>
          </div>

          {/* Resend Link */}
          <div className="text-center">
            <p className="text-sm text-gray-700">
              {"Didn't get any code?"}{" "}
              <button
                onClick={handleResend}
                disabled={timer > 0}
                className={`font-semibold ${
                  timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"
                }`}
              >
                Click here.
              </button>
            </p>
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={!isComplete || verifying}
            className="w-full py-6 text-base"
            style={{
              backgroundColor: isComplete ? "#1a3f1c" : "#d1d5db",
              color: isComplete ? "white" : "#6b7280",
            }}
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
