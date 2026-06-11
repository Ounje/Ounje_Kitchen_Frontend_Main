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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 shrink-0 w-32">{label}</span>
      <span className="text-xs font-medium text-gray-700 text-right">{value ?? "—"}</span>
    </div>
  );
}

export default function CustomerForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;
  const profile = existing?.profile ?? null;

  const [form, setForm] = useState({
    name:    existing?.name    ?? "",
    email:   existing?.email   ?? "",
    phone:   String(existing?.phone ?? ""),
    address: existing?.address ?? "",
    img:     existing?.img     ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

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
          name:    form.name,
          phone:   form.phone,
          address: form.address,
          img:     form.img || undefined,
        });
        toast.success("Customer updated");
      } else {
        await customerSetupService.create({
          name:    form.name,
          email:   form.email,
          phone:   form.phone || undefined,
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

  const dva = profile?.titanAccount;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[#1a3f1c] font-black">
            {isEdit ? "Edit Customer" : "Create Customer"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[78vh] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-4 pt-3">

            {/* ── Editable fields ─────────────────────────────── */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                value={form.name}
                onChange={e => set("name", e.target.value)}
                placeholder="e.g. Amara Okafor"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
                {isEdit && <span className="text-xs text-gray-400 ml-1">(cannot be changed)</span>}
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="amara@example.com"
                disabled={isEdit}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="08012345678"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={e => set("address", e.target.value)}
                  placeholder="12 Adeola Street, Lagos"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="img">Profile Picture URL</Label>
              <Input
                id="img"
                value={form.img}
                onChange={e => set("img", e.target.value)}
                placeholder="https://…"
              />
            </div>

            {/* ── Read-only profile info (edit mode only) ────── */}
            {isEdit && profile && (
              <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Account Info</p>
                <InfoRow
                  label="Status"
                  value={
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      profile.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {profile.isActive ? "Active" : "Inactive"}
                    </span>
                  }
                />
                <InfoRow label="Rank" value={profile.rank ?? "—"} />
                <InfoRow label="Paystack Code" value={profile.paystackCustomerCode ?? "—"} />
                {dva?.accountNumber && (
                  <>
                    <InfoRow label="DVA Bank" value={dva.bankName ?? "—"} />
                    <InfoRow label="DVA Account" value={dva.accountNumber} />
                    <InfoRow label="DVA Name" value={dva.accountName ?? "—"} />
                  </>
                )}
                {Array.isArray(profile.savedAddresses) && profile.savedAddresses.length > 0 && (
                  <InfoRow label="Saved Addresses" value={`${profile.savedAddresses.length} saved`} />
                )}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-[#1a3f1c] hover:bg-[#1a3f1c]/90" disabled={saving}>
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Customer"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
