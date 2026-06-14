"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Check, Mail } from "lucide-react";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (currentPassword: string, newPassword: string, alternativeEmail: string) => void;
  isForced?: boolean;
}

interface PasswordValidation {
  hasUppercase: boolean;
  hasNumber: boolean;
  hasMinLength: boolean;
}

export default function ChangePasswordModal({
  open,
  onOpenChange,
  onSubmit,
  isForced = false,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alternativeEmail, setAlternativeEmail] = useState("");

  const [validation, setValidation] = useState<PasswordValidation>({
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setAlternativeEmail("");
      setValidation({
        hasUppercase: false,
        hasNumber: false,
        hasMinLength: false,
      });
      setPasswordsMatch(true);
    }
  }, [open]);

  // Validate password in real-time
  useEffect(() => {
    setValidation({
      hasUppercase: /[A-Z]/.test(newPassword),
      hasNumber: /[0-9]/.test(newPassword),
      hasMinLength: newPassword.length >= 8,
    });
  }, [newPassword]);

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [newPassword, confirmPassword]);

  const calculateStrength = (): number => {
    let strength = 0;
    if (validation.hasUppercase) strength += 33.33;
    if (validation.hasNumber) strength += 33.33;
    if (validation.hasMinLength) strength += 33.34;
    return strength;
  };

  const strength = calculateStrength();
  const isValid =
    validation.hasUppercase &&
    validation.hasNumber &&
    validation.hasMinLength &&
    passwordsMatch &&
    confirmPassword;

  const getStrengthColor = () => {
    if (strength < 40) return "#ef4444"; // red
    if (strength < 80) return "#f59e0b"; // orange
    return "#10b981"; // green
  };

  const handleProceed = () => {
    if (!isValid || !currentPassword) return;
    onSubmit(currentPassword, newPassword, alternativeEmail.trim());
  };

  const handleDiscard = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={isForced ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ backgroundColor: "#e8f7e8" }}>
        {/* Close button */}
        {!isForced && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-black/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">Change Password</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Update password for enhanced account security.
          </DialogDescription>
        </DialogHeader>

        <div className="border-t border-gray-300 my-4" />

        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 bg-white"
              placeholder="Enter current password"
            />
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 bg-white"
              placeholder="Enter new password"
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 bg-white"
              placeholder="Confirm new password"
            />
            {!passwordsMatch && confirmPassword && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
          </div>

          {/* Alternative Email */}
          <div>
            <Label
              htmlFor="alternativeEmail"
              className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
            >
              <Mail className="h-4 w-4 text-blue-500" />
              Personal Email
              <span className="text-xs text-gray-400 font-normal">(OTP will be sent here)</span>
            </Label>
            <Input
              id="alternativeEmail"
              type="email"
              value={alternativeEmail}
              onChange={(e) => setAlternativeEmail(e.target.value)}
              className="mt-1 bg-white"
              placeholder="e.g. yourname@gmail.com"
            />
            <p className="text-xs text-gray-400 mt-1">
              Use a personal email (Gmail, Yahoo, etc.) if your work email isn&apos;t receiving
              messages yet.
            </p>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${strength}%`,
                    backgroundColor: getStrengthColor(),
                  }}
                />
              </div>
            </div>
          )}

          {/* Validation Checklist */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Weak Password. Must Contain:</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                {validation.hasUppercase ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                )}
                <span className={validation.hasUppercase ? "text-green-600" : "text-gray-600"}>
                  At least 1 uppercase
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {validation.hasNumber ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                )}
                <span className={validation.hasNumber ? "text-green-600" : "text-gray-600"}>
                  At least 1 number
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {validation.hasMinLength ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-gray-400" />
                )}
                <span className={validation.hasMinLength ? "text-green-600" : "text-gray-600"}>
                  At least 8 characters
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          {!isForced && (
            <Button
              onClick={handleDiscard}
              className="flex-1 py-6"
              style={{ backgroundColor: "#ffca3a", color: "#1a3f1c" }}
            >
              Discard
            </Button>
          )}
          <Button
            onClick={handleProceed}
            disabled={!isValid || !currentPassword}
            className="flex-1 py-6"
            style={{
              backgroundColor: isValid && currentPassword ? "#1a3f1c" : "#d1d5db",
              color: isValid && currentPassword ? "white" : "#6b7280",
            }}
          >
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
