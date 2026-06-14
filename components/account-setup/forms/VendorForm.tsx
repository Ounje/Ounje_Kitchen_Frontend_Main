"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vendorSetupService } from "@/lib/api/services/accountSetup.service";

interface Props {
  existing?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const STORE_TYPES = ["Restaurant", "Bakery", "Grocery", "Pharmacy", "Supermarket", "Other"];
const FULFILLMENT = ["delivery", "pickup", "both"];
const ZONES = ["Lekki", "Victoria Island", "Ikeja", "Surulere", "Yaba", "Ajah", "Ikoyi", "Other"];

function Section({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{title}</p>
      <div className="h-px bg-gray-100 mt-1" />
    </div>
  );
}

export default function VendorForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;

  const store = existing?.storeDetails?.[0] ?? {};

  const [form, setForm] = useState({
    // User / identity
    name: existing?.owner?.name ?? "",
    email: existing?.owner?.email ?? "",
    phone: existing?.owner?.phone ?? "",
    address: existing?.owner?.address ?? "",
    // Vendor profile
    vendorName: existing?.name ?? "",
    description: existing?.description ?? "",
    // Store
    storeName: store.storeName ?? "",
    storeType: store.storeType ?? "",
    servicesOffered: Array.isArray(store.servicesOffered)
      ? store.servicesOffered.join(", ")
      : (store.servicesOffered ?? ""),
    ninID: store.ninID ?? "",
    CACNumber: store.CACNumber ?? "",
    // Location
    locationAddress: existing?.location?.address ?? "",
    latitude: existing?.location?.coordinates?.[1]?.toString() ?? "",
    longitude: existing?.location?.coordinates?.[0]?.toString() ?? "",
    zone: existing?.zone ?? "",
    // Fulfillment
    fulfillmentType: existing?.fulfillmentSettings?.type ?? "delivery",
    preparationTimeMin: existing?.fulfillmentSettings?.preparationTimeMin?.toString() ?? "30",
    minOrderAmount: existing?.fulfillmentSettings?.minOrderAmount?.toString() ?? "500",
    autoAcceptOrders: existing?.fulfillmentSettings?.autoAcceptOrders ? "true" : "false",
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
    if (!form.name.trim() || !form.email.trim() || !form.vendorName.trim()) {
      toast.error("Owner name, email, and vendor name are required");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, any> = {
        name: form.name,
        phone: form.phone || undefined,
        address: form.address || undefined,
        vendorName: form.vendorName,
        description: form.description || undefined,
        storeName: form.storeName || undefined,
        storeType: form.storeType || undefined,
        servicesOffered: form.servicesOffered
          ? form.servicesOffered
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean)
          : undefined,
        ninID: form.ninID || undefined,
        CACNumber: form.CACNumber || undefined,
        locationAddress: form.locationAddress || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        zone: form.zone || undefined,
        fulfillmentType: form.fulfillmentType,
        preparationTimeMin: form.preparationTimeMin ? parseInt(form.preparationTimeMin) : undefined,
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
        autoAcceptOrders: form.autoAcceptOrders === "true",
        bankAccountNumber: form.bankAccountNumber || undefined,
        bankCode: form.bankCode || undefined,
        bankAccountName: form.bankAccountName || undefined,
        bankName: form.bankName || undefined,
      };

      if (isEdit) {
        await vendorSetupService.update(existing._id, payload);
        toast.success("Vendor updated");
      } else {
        payload.email = form.email;
        await vendorSetupService.create(payload);
        toast.success("Vendor account created");
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
            {isEdit ? "Edit Vendor" : "Create Vendor"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <Section title="Owner Details" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Owner name"
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
                  placeholder="vendor@example.com"
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

            <Section title="Vendor Profile" />
            <div className="space-y-1.5">
              <Label>
                Vendor / Brand Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={form.vendorName}
                onChange={(e) => set("vendorName", e.target.value)}
                placeholder="e.g. Mama Nkechi Kitchen"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short description of the vendor…"
                rows={2}
              />
            </div>

            <Section title="Store Details" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Store Name</Label>
                <Input
                  value={form.storeName}
                  onChange={(e) => set("storeName", e.target.value)}
                  placeholder="Store name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Store Type</Label>
                <Select value={form.storeType} onValueChange={(v) => set("storeType", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {STORE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>NIN ID</Label>
                <Input
                  value={form.ninID}
                  onChange={(e) => set("ninID", e.target.value)}
                  placeholder="NIN number"
                />
              </div>
              <div className="space-y-1.5">
                <Label>CAC Number</Label>
                <Input
                  value={form.CACNumber}
                  onChange={(e) => set("CACNumber", e.target.value)}
                  placeholder="CAC reg number"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>
                Services Offered <span className="text-xs text-gray-400">(comma-separated)</span>
              </Label>
              <Input
                value={form.servicesOffered}
                onChange={(e) => set("servicesOffered", e.target.value)}
                placeholder="e.g. Jollof Rice, Fried Rice, Pepper Soup"
              />
            </div>

            <Section title="Location" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
                <Label>Location Address</Label>
                <Input
                  value={form.locationAddress}
                  onChange={(e) => set("locationAddress", e.target.value)}
                  placeholder="Store address"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Latitude</Label>
                <Input
                  value={form.latitude}
                  onChange={(e) => set("latitude", e.target.value)}
                  placeholder="6.4281"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Longitude</Label>
                <Input
                  value={form.longitude}
                  onChange={(e) => set("longitude", e.target.value)}
                  placeholder="3.4219"
                />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label>Zone</Label>
                <Select value={form.zone} onValueChange={(v) => set("zone", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {ZONES.map((z) => (
                      <SelectItem key={z} value={z}>
                        {z}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Section title="Fulfillment Settings" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fulfillment Type</Label>
                <Select
                  value={form.fulfillmentType}
                  onValueChange={(v) => set("fulfillmentType", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FULFILLMENT.map((f) => (
                      <SelectItem key={f} value={f} className="capitalize">
                        {f}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Prep Time (mins)</Label>
                <Input
                  type="number"
                  value={form.preparationTimeMin}
                  onChange={(e) => set("preparationTimeMin", e.target.value)}
                  placeholder="30"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Min Order (₦)</Label>
                <Input
                  type="number"
                  value={form.minOrderAmount}
                  onChange={(e) => set("minOrderAmount", e.target.value)}
                  placeholder="500"
                  min={0}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Auto-Accept Orders</Label>
                <Select
                  value={form.autoAcceptOrders}
                  onValueChange={(v) => set("autoAcceptOrders", v)}
                >
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
                  placeholder="e.g. Access Bank"
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
                  placeholder="044"
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
                {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Vendor"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
