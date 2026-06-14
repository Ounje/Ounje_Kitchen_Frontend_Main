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

function Section({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
      <div className="h-px bg-gray-100 mt-1" />
    </div>
  );
}

export default function RiderForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;

  const [form, setForm] = useState({
    // User / identity
    name: existing?.user?.name ?? "",
    email: existing?.user?.email ?? "",
    phone: existing?.user?.phone ?? "",
    address: existing?.user?.address ?? "",
    // Rider profile
    modeOfDelivery: existing?.modeOfDelivery ?? "",
    operatingArea: (existing?.operatingArea ?? []).join(", "),
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
        address: form.address || undefined,
        modeOfDelivery: form.modeOfDelivery || undefined,
        operatingArea: form.operatingArea
          ? form.operatingArea
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : undefined,
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
      <DialogContent className="max-w-xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[#1a3f1c] font-black">
            {isEdit ? "Edit Rider" : "Create Rider"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <Section title="Personal Details" />
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
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Residential address"
                />
              </div>
            </div>

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
            </div>

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

            <Section title="Bank Details" />
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
