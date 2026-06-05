"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { customerSetupService } from "@/lib/api/services/accountSetup.service";

interface Props {
  existing?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomerForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;

  const [form, setForm] = useState({
    name:    existing?.name    ?? "",
    email:   existing?.email   ?? "",
    phone:   existing?.phone   ?? "",
    address: existing?.address ?? "",
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

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#1a3f1c] font-black">
            {isEdit ? "Edit Customer" : "Create Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-[#1a3f1c] hover:bg-[#1a3f1c]/90" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
