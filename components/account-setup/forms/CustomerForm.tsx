"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { customerSetupService } from "@/lib/api/services/accountSetup.service";

interface Props {
  existing?: any;
  onClose: () => void;
  onSuccess: () => void;
}

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

export default function CustomerForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;
  const profile = existing?.profile;

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    email: existing?.email ?? "",
    phone: existing?.phone?.toString() ?? "",
    address: existing?.address ?? "",
    img: existing?.img ?? "",
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
      if (isEdit) {
        await customerSetupService.update(existing._id, {
          name: form.name,
          phone: form.phone,
          address: form.address,
          img: form.img || undefined,
        });
        toast.success("Customer updated");
      } else {
        await customerSetupService.create({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: form.address || undefined,
        });
        toast.success("Customer account created");
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
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[#1a3f1c] font-black">
            {isEdit ? "Edit Customer" : "Create Customer"}
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
                    className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${profile?.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {profile?.isActive ? "Active" : "Inactive"}
                  </span>
                  {profile?.isSuspended && (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                      Suspended
                    </span>
                  )}
                  {profile?.isDeleted && (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-red-100 text-red-600">
                      Deleted
                    </span>
                  )}
                </div>
                {profile?.isSuspended && (
                  <div className="grid grid-cols-2 gap-3">
                    <InfoRow label="Suspension Reason" value={profile?.suspensionReason} />
                    <InfoRow
                      label="Suspended At"
                      value={
                        profile?.suspendedAt
                          ? new Date(profile.suspendedAt).toLocaleDateString()
                          : undefined
                      }
                    />
                  </div>
                )}
                {profile?.isDeleted && profile?.deletionReason && (
                  <InfoRow label="Deletion Reason" value={profile.deletionReason} />
                )}
              </>
            )}

            {/* Personal Details */}
            <Section title="Personal Details" />

            {isEdit && form.img && (
              <div className="flex items-center gap-3">
                <img
                  src={form.img}
                  alt={form.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-xs text-gray-400">Current profile picture</p>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="name">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Amara Okafor"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                  {isEdit && <span className="text-xs text-gray-400 ml-1">(locked)</span>}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="amara@example.com"
                  disabled={isEdit}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="08012345678"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                placeholder="12 Adeola Street, Lagos"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="img">Profile Picture URL</Label>
              <Input
                id="img"
                value={form.img}
                onChange={(e) => set("img", e.target.value)}
                placeholder="https://…"
              />
            </div>

            {/* Edit-only read-only sections */}
            {isEdit && (
              <>
                <Section title="Preferences" />
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow
                    label="Marketing Emails"
                    value={profile?.preferences?.marketingEmails !== false ? "Enabled" : "Disabled"}
                  />
                  <InfoRow
                    label="Push Notifications"
                    value={
                      profile?.preferences?.pushNotifications !== false ? "Enabled" : "Disabled"
                    }
                  />
                </div>

                {Array.isArray(profile?.savedAddresses) && profile.savedAddresses.length > 0 && (
                  <>
                    <Section title={`Saved Addresses (${profile.savedAddresses.length})`} />
                    <div className="space-y-2">
                      {profile.savedAddresses.map((sa: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                        >
                          <span className="font-semibold text-[#1a3f1c]">{sa.label}</span>
                          <span className="text-gray-600 ml-2">{sa.address}</span>
                          {sa.details && (
                            <span className="text-gray-400 ml-1 text-xs">· {sa.details}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <Section title="Account Info" />
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow
                    label="Member Since"
                    value={
                      existing?.createdAt
                        ? new Date(existing.createdAt).toLocaleDateString()
                        : undefined
                    }
                  />
                  <InfoRow label="Role" value={existing?.role} />
                </div>
              </>
            )}

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
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Customer"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
