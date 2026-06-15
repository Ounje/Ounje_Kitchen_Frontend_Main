"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { riderSetupService } from "@/lib/api/services/accountSetup.service";

interface Props {
  existing?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const DELIVERY_MODES = ["Bicycle", "Motorcycle"];
const AREAS = ["Lekki", "Victoria Island", "Ikeja", "Surulere", "Yaba", "Ajah", "Ikoyi", "Other"];
const RIDER_STATUSES = ["pending", "available", "busy", "offline", "deactivated"];

function Section({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
      <div className="h-px bg-gray-100 mt-1" />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
      <div className="min-h-9 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
        {value ?? <span className="text-gray-400">—</span>}
      </div>
    </div>
  );
}

export default function RiderForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;

  const [form, setForm] = useState({
    // User / identity
    name: existing?.user?.name ?? "",
    email: existing?.user?.email ?? "",
    phone: existing?.user?.phone?.toString() ?? "",
    // Rider profile
    modeOfDelivery: existing?.modeOfDelivery ?? "",
    operatingArea: (existing?.operatingArea ?? []).join(", "),
    isActive: existing?.isActive !== undefined ? (existing.isActive ? "true" : "false") : "false",
    status: existing?.status ?? "pending",
    setupComplete: existing?.setupComplete ? "true" : "false",
    // Documents
    driversLicense: existing?.driversLicense ?? "",
    nin: existing?.nin ?? "",
    profilePicture: existing?.profilePicture ?? "",
    // Guarantor
    guarantorName: existing?.guarantor?.name ?? "",
    guarantorPhone: existing?.guarantor?.phone ?? "",
    guarantorNin: existing?.guarantor?.nin ?? "",
    // Bank
    bankAccountNumber: existing?.bankDetails?.accountNumber ?? "",
    bankCode: existing?.bankDetails?.bankCode ?? "",
    bankAccountName: existing?.bankDetails?.accountName ?? "",
    bankName: existing?.bankDetails?.bankName ?? "",
  });

  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        phone: form.phone || undefined,
        modeOfDelivery: form.modeOfDelivery || undefined,
        operatingArea: form.operatingArea
          ? form.operatingArea
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : undefined,
        isActive: form.isActive === "true",
        status: form.status || undefined,
        setupComplete: form.setupComplete === "true",
        driversLicense: form.driversLicense || undefined,
        nin: form.nin || undefined,
        profilePicture: form.profilePicture || undefined,
        guarantorName: form.guarantorName || undefined,
        guarantorPhone: form.guarantorPhone || undefined,
        guarantorNin: form.guarantorNin || undefined,
        bankAccountNumber: form.bankAccountNumber || undefined,
        bankCode: form.bankCode || undefined,
        bankAccountName: form.bankAccountName || undefined,
        bankName: form.bankName || undefined,
      };

      if (isEdit) {
        await riderSetupService.update(existing._id, payload);
        toast.success("Rider updated");
      } else {
        payload.email = form.email;
        await riderSetupService.create(payload);
        toast.success("Rider account created");
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[#1a3f1c] font-black">
            {isEdit ? "Edit Rider" : "Create Rider"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            {/* Account Status — edit only */}
            {isEdit && (
              <>
                <Section title="Account Status" />
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${existing?.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {existing?.isActive ? "Active" : "Inactive"}
                  </span>
                  {existing?.status && (
                    <span className="text-[10px] font-black capitalize px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {existing.status}
                    </span>
                  )}
                  {existing?.tier && (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                      {existing.tier}
                    </span>
                  )}
                  {existing?.isSuspended && (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                      Suspended
                    </span>
                  )}
                  {existing?.isDeleted && (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-red-100 text-red-600">
                      Deleted
                    </span>
                  )}
                </div>
                {existing?.isSuspended && (
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="Suspension Reason" value={existing?.suspensionReason} />
                    <InfoRow
                      label="Suspended At"
                      value={
                        existing?.suspendedAt
                          ? new Date(existing.suspendedAt).toLocaleDateString()
                          : undefined
                      }
                    />
                  </div>
                )}

                {/* Rider Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <InfoRow label="Rank" value={existing?.rank} />
                  <InfoRow label="Total Deliveries" value={existing?.totalDeliveries} />
                  <InfoRow
                    label="Avg Rating"
                    value={
                      existing?.ratings?.average != null
                        ? `${existing.ratings.average.toFixed(1)} (${existing.ratings.count ?? 0})`
                        : existing?.averageRating != null
                          ? `${existing.averageRating.toFixed(1)} (${existing.ratingCount ?? 0})`
                          : undefined
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <InfoRow
                    label="Today's Earnings"
                    value={
                      existing?.earnings?.today != null
                        ? `₦${existing.earnings.today.toLocaleString()}`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Week's Earnings"
                    value={
                      existing?.earnings?.week != null
                        ? `₦${existing.earnings.week.toLocaleString()}`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Total Earnings"
                    value={
                      existing?.earnings?.total != null
                        ? `₦${existing.earnings.total.toLocaleString()}`
                        : undefined
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow
                    label="Member Since"
                    value={
                      existing?.createdAt
                        ? new Date(existing.createdAt).toLocaleDateString()
                        : undefined
                    }
                  />
                  <InfoRow label="Setup Complete" value={existing?.setupComplete ? "Yes" : "No"} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow label="Rider ID" value={existing?.riderId} />
                  <InfoRow label="Paystack Recipient" value={existing?.paystackRecipientCode} />
                  <InfoRow
                    label="Acceptance Rate"
                    value={
                      existing?.acceptanceRate != null ? `${existing.acceptanceRate}%` : undefined
                    }
                  />
                  <InfoRow
                    label="Orders (Offered / Accepted)"
                    value={
                      existing?.ordersOffered != null
                        ? `${existing.ordersOffered} / ${existing.ordersAccepted ?? 0}`
                        : undefined
                    }
                  />
                </div>
              </>
            )}

            {/* Personal Details */}
            <Section title="Personal Details" />

            {/* Profile picture from user.img — read-only */}
            {isEdit && existing?.user?.img && (
              <div className="flex items-center gap-3">
                <img
                  src={existing.user.img}
                  alt={existing.user?.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-xs text-gray-400">Profile picture</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Emeka Nwosu"
                />
              </div>
              <div className="space-y-1.5">
                <Label>
                  Email <span className="text-red-500">*</span>
                  {isEdit && <span className="text-xs text-gray-400 ml-1">(locked)</span>}
                </Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="rider@example.com"
                  disabled={isEdit}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="08012345678"
                />
              </div>
              {isEdit && <InfoRow label="Address" value={existing?.user?.address} />}
            </div>

            {/* Rider Details */}
            <Section title="Rider Details" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Mode of Delivery</Label>
                <Select value={form.modeOfDelivery} onValueChange={(v) => set("modeOfDelivery", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_MODES.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Operating Area</Label>
                <Select value={form.operatingArea} onValueChange={(v) => set("operatingArea", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {AREAS.map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Active</Label>
                <Select value={form.isActive} onValueChange={(v) => set("isActive", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RIDER_STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="capitalize">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Setup Complete</Label>
                <Select value={form.setupComplete} onValueChange={(v) => set("setupComplete", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Documents */}
            <Section title="Documents" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>NIN</Label>
                <Input
                  value={form.nin}
                  onChange={(e) => set("nin", e.target.value)}
                  placeholder="NIN number"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Driver&apos;s License No.</Label>
                <Input
                  value={form.driversLicense}
                  onChange={(e) => set("driversLicense", e.target.value)}
                  placeholder="License number"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Profile Picture URL</Label>
                <Input
                  value={form.profilePicture}
                  onChange={(e) => set("profilePicture", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>

            {/* Guarantor */}
            <Section title="Guarantor" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Guarantor Name</Label>
                <Input
                  value={form.guarantorName}
                  onChange={(e) => set("guarantorName", e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Guarantor Phone</Label>
                <Input
                  value={form.guarantorPhone}
                  onChange={(e) => set("guarantorPhone", e.target.value)}
                  placeholder="08012345678"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Guarantor NIN</Label>
                <Input
                  value={form.guarantorNin}
                  onChange={(e) => set("guarantorNin", e.target.value)}
                  placeholder="Guarantor NIN"
                />
              </div>
            </div>

            {/* Notification Preferences — read-only */}
            {isEdit && (
              <>
                <Section title="Notification Preferences" />
                <div className="grid grid-cols-3 gap-3">
                  <InfoRow
                    label="New Requests"
                    value={
                      existing?.notificationPreferences?.newRequests !== false
                        ? "Enabled"
                        : "Disabled"
                    }
                  />
                  <InfoRow
                    label="Earnings"
                    value={
                      existing?.notificationPreferences?.earnings !== false ? "Enabled" : "Disabled"
                    }
                  />
                  <InfoRow
                    label="Promotions"
                    value={
                      existing?.notificationPreferences?.promotions !== false
                        ? "Enabled"
                        : "Disabled"
                    }
                  />
                </div>
              </>
            )}

            {/* Bank Details */}
            <Section title="Bank Details" />
            {isEdit && existing?.bankDetails?.status && (
              <div className="flex gap-2 mb-1">
                <span
                  className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    existing.bankDetails.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : existing.bankDetails.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  Bank {existing.bankDetails.status}
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Account Number</Label>
                <Input
                  value={form.bankAccountNumber}
                  onChange={(e) => set("bankAccountNumber", e.target.value)}
                  placeholder="0123456789"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bank Name</Label>
                <Input
                  value={form.bankName}
                  onChange={(e) => set("bankName", e.target.value)}
                  placeholder="e.g. GTBank"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Account Name</Label>
                <Input
                  value={form.bankAccountName}
                  onChange={(e) => set("bankAccountName", e.target.value)}
                  placeholder="Name on account"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Bank Code</Label>
                <Input
                  value={form.bankCode}
                  onChange={(e) => set("bankCode", e.target.value)}
                  placeholder="058"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#1a3f1c] hover:bg-[#1a3f1c]/90"
                disabled={saving}
              >
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Rider"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
