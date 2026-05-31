"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ChangePasswordModal from "@/components/shared/ChangePasswordModal";
import ConfirmPasswordChangeModal from "@/components/shared/ConfirmPasswordChangeModal";
import OTPVerificationModal from "@/components/shared/OTPVerificationModal";
import PasswordChangeSuccessModal from "@/components/shared/PasswordChangeSuccessModal";

interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department?: string;
  isHead?: boolean;
  isSuperAdmin?: boolean;
  avatar?: string;
}

interface SettingsPageProps {
  // API service for the specific portal (it, operations, finance, etc.)
  apiService: {
    getProfile: () => Promise<any>;
    updateProfile: (data: any) => Promise<any>;
    uploadAvatar: (formData: FormData) => Promise<any>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<any>;
    verifyOTP: (otp: string) => Promise<any>;
    resendOTP: () => Promise<any>;
  };
  // Optional: callback to update sidebar avatar
  onAvatarUpdate?: (avatarUrl: string) => void;
}

export default function SettingsPage({ apiService, onAvatarUpdate }: SettingsPageProps) {
  const { refreshUser, user: authUser } = useAuth(); // ✅ Get refreshUser from AuthContext
  
  useEffect(() => {
    if (authUser?.mustChangePassword) {
      setPasswordModalOpen(true);
    }
  }, [authUser?.mustChangePassword]);


  // Profile data
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
    
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });


  
  // Avatar upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Saving state
  const [saving, setSaving] = useState(false);
  
  // Password change modals
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [confirmPasswordModalOpen, setConfirmPasswordModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  // Password data for passing between modals
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

   const handleSuccessClose = async () => {
    setSuccessModalOpen(false);
    setPasswordData({ currentPassword: "", newPassword: "" });
    
    // ✅ Refresh user to update mustChangePassword flag
    await refreshUser();
  };

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProfile();
      setProfile(data.user);
      setEditedData({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        phone: data.user.phone || "",
      });
      if (data.user.avatar) {
        setAvatarPreview(data.user.avatar);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleDiscardChanges = () => {
    // Revert to original data
    if (profile) {
      setEditedData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || "",
      });
      setAvatarPreview(profile.avatar || null);
    }
    setIsEditMode(false);
  };

  const handleSaveChanges = async () => {
    if (!editedData.firstName.trim() || !editedData.lastName.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    setSaving(true);
    try {
      await apiService.updateProfile({
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        phone: editedData.phone,
      });
      
      toast.success("Profile updated successfully");
      await fetchProfile(); // Refetch to get updated data
      setIsEditMode(false);
      
      // ✅ Refresh user in AuthContext to update sidebar name
      await refreshUser();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

     const resizedFile = await resizeImage(file, 400, 400);

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(resizedFile);

    // Upload to backend
    setUploadingAvatar(true);
  try {
    const formData = new FormData();
    formData.append('avatar', resizedFile);
    
    const result = await apiService.uploadAvatar(formData);
    toast.success("Profile picture updated successfully");
    
    // Update profile with new avatar URL
    if (profile) {
      setProfile({ ...profile, avatar: result.avatarUrl });
    }
    
    // ✅ Refresh user in AuthContext to update sidebar
    await refreshUser();
    
    // Callback to update sidebar avatar (if provided)
    if (onAvatarUpdate && result.avatarUrl) {
      onAvatarUpdate(result.avatarUrl);
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to upload profile picture");
    // Revert preview on error
    if (profile?.avatar) {
      setAvatarPreview(profile.avatar);
    } else {
      setAvatarPreview(null);
    }
  } finally {
    setUploadingAvatar(false);
  }
  };
  
  // ✅ Helper function to resize image
  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          0.85 // 85% quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

  const handlePasswordChangeClick = () => {
    setPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (currentPassword: string, newPassword: string) => {
    setPasswordData({ currentPassword, newPassword });
    setPasswordModalOpen(false);
    setConfirmPasswordModalOpen(true);
  };

  const handleConfirmPasswordChange = async () => {
    setConfirmPasswordModalOpen(false);
    
    try {
      // Call change password endpoint which sends OTP
      await apiService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      // Open OTP modal
      setOtpModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate password change");
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      await apiService.verifyOTP(otp);
      
      // Close OTP modal and show success
      setOtpModalOpen(false);
      setSuccessModalOpen(true);
    } catch (error: any) {
      throw error; // Let OTP modal handle the error
    }
  };

  const handleResendOTP = async () => {
    try {
      await apiService.resendOTP();
      toast.success("OTP resent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to resend OTP");
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#1a3f1c]" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Failed to load profile</p>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
  
  // Dynamic access level based on user type
  const getAccessLevel = () => {
    if (profile.isSuperAdmin) return "Super Admin";
    if (profile.isHead) return "Admin";
    return "Staff";
  };
  
  // Dynamic role based on department and position
  const getRole = () => {
    if (profile.isSuperAdmin) return "Super Admin";
    if (profile.isHead && profile.department) {
      return `${profile.department} Head`;
    }
    return profile.department || "Staff";
  };

  const accessLevel = getAccessLevel();
  const role = getRole();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="w-full space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Profile Picture Section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-24 h-24 md:w-28 md:h-28 border-4 border-white shadow-lg">
              <AvatarImage src={avatarPreview || undefined} alt={fullName} />
              <AvatarFallback className="text-2xl font-bold bg-[#1a3f1c] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <Button
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="gap-2"
              style={{ backgroundColor: '#1a3f1c' }}
            >
              <Camera className="h-4 w-4" />
              Change Picture
            </Button>
          </div>
        </div>

        {/* Profile Form Card */}
        <Card 
          className="border shadow-sm bg-[#98ef9b]/50"
        >
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Name */}
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={editedData.firstName}
                  onChange={(e) => setEditedData({ ...editedData, firstName: e.target.value })}
                  disabled={!isEditMode}
                  placeholder="#000000"
                  className={`mt-1 border border-[#000000] ${!isEditMode ? 'bg-white text-[#000000]' : 'bg-white'}`}
                />
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 mt-2">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={editedData.lastName}
                  onChange={(e) => setEditedData({ ...editedData, lastName: e.target.value })}
                  disabled={!isEditMode}
                  className={`mt-1 border border-[#000000] ${!isEditMode ? 'bg-white' : 'bg-white'}`}
                />
              </div>

              {/* E-mail */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  E-mail
                </Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="mt-1 border border-[#000000] bg-white"
                />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={editedData.phone}
                  onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                  disabled={!isEditMode}
                  className={`mt-1 border border-[#000000] ${!isEditMode ? 'bg-white' : 'bg-white'}`}
                />
              </div>

              {/* Department - Only show if user has department */}
              {profile.department && (
                <div>
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                    Department
                  </Label>
                  <Input
                    id="department"
                    value={profile.department}
                    disabled
                    className="mt-1 border border-[#000000] bg-white"
                  />
                </div>
              )}

              {/* Access Level */}
              <div>
                <Label htmlFor="accessLevel" className="text-sm font-medium text-gray-700">
                  Access Level
                </Label>
                <Input
                  id="accessLevel"
                  value={accessLevel}
                  disabled
                  className="mt-1 border border-[#000000] bg-white"
                />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Input
                  id="role"
                  value={role}
                  disabled
                  className="mt-1 border border-[#000000] bg-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isEditMode ? (
            <>
              <Button
                onClick={handleEditClick}
                className="px-8 py-6 text-base"
                style={{ backgroundColor: '#1a3f1c' }}
              >
                Edit Information
              </Button>
              <Button
                onClick={handlePasswordChangeClick}
                className="px-8 py-6 text-base"
                style={{ backgroundColor: '#ffca3a', color: '#1a3f1c' }}
              >
                Change Password
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleDiscardChanges}
                disabled={saving}
                className="px-8 py-6 text-base bg-red-400 hover:bg-red-500 text-white"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSaveChanges}
                disabled={saving}
                className="px-8 py-6 text-base"
                style={{ backgroundColor: '#1a3f1c' }}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Password Change Modals */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onOpenChange={setPasswordModalOpen}
        onSubmit={handlePasswordSubmit}
        isForced={authUser?.mustChangePassword}
      />

      <ConfirmPasswordChangeModal
        open={confirmPasswordModalOpen}
        onOpenChange={setConfirmPasswordModalOpen}
        onConfirm={handleConfirmPasswordChange}
      />

      <OTPVerificationModal
        open={otpModalOpen}
        onOpenChange={setOtpModalOpen}
        onVerify={handleOTPVerify}
        onResend={handleResendOTP}
      />

      <PasswordChangeSuccessModal
        open={successModalOpen}
        onClose={handleSuccessClose}
      />
    </div>
  );
}