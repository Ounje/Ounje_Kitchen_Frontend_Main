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
const FULFILLMENT = [
  { value: "on_demand", label: "On Demand" },
  { value: "preorder", label: "Pre-Order" },
];
const ZONES = ["Lekki", "Victoria Island", "Ikeja", "Surulere", "Yaba", "Ajah", "Ikoyi", "Other"];

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

export default function VendorForm({ existing, onClose, onSuccess }: Props) {
  const isEdit = !!existing;
  const store = existing?.storeDetails?.[0] ?? {};

  const [form, setForm] = useState({
    // Owner / identity (used in create; displayed read-only in edit)
    name: existing?.owner?.name ?? "",
    email: existing?.owner?.email ?? "",
    phone: existing?.owner?.phone?.toString() ?? "",
    address: existing?.owner?.address ?? "",
    // Vendor profile
    vendorName: existing?.name ?? "",
    description: existing?.description ?? "",
    profileImage: existing?.profileImage ?? "",
    logoUrl: existing?.logoUrl ?? "",
    bannerUrl: existing?.bannerUrl ?? "",
    isActive: existing?.isActive !== undefined ? (existing.isActive ? "true" : "false") : "true",
    // Store
    storeName: store.storeName ?? "",
    storeType: store.storeType ?? "",
    servicesOffered: Array.isArray(store.servicesOffered)
      ? store.servicesOffered.join(", ")
      : (store.servicesOffered ?? ""),
    ninID: store.ninID ?? "",
    CACNumber: store.CACNumber ?? "",
    needsCACSupport: store.needsCACSupport ? "true" : "false",
    // Location
    locationAddress: existing?.location?.address ?? "",
    latitude: existing?.location?.coordinates?.[1]?.toString() ?? "",
    longitude: existing?.location?.coordinates?.[0]?.toString() ?? "",
    zone: existing?.zone ?? "",
    // Fulfillment
    fulfillmentType: existing?.fulfillmentSettings?.type ?? "on_demand",
    preparationTimeMin: existing?.fulfillmentSettings?.preparationTimeMin?.toString() ?? "30",
    minOrderAmount: existing?.fulfillmentSettings?.minOrderAmount?.toString() ?? "500",
    deliveryPrice: existing?.fulfillmentSettings?.deliveryPrice?.toString() ?? "0",
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
    if (!form.vendorName.trim() || (!isEdit && (!form.name.trim() || !form.email.trim()))) {
      toast.error(
        isEdit ? "Vendor name is required" : "Owner name, email, and vendor name are required"
      );
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const payload: Record<string, any> = {
          name: form.vendorName,
          description: form.description || undefined,
          profileImage: form.profileImage || undefined,
          logoUrl: form.logoUrl || undefined,
          bannerUrl: form.bannerUrl || undefined,
          isActive: form.isActive === "true",
          zone: form.zone || undefined,
          location: (() => {
            const lat = parseFloat(form.latitude);
            const lng = parseFloat(form.longitude);
            const hasCoords = !isNaN(lat) && !isNaN(lng);
            if (!form.locationAddress && !hasCoords) return undefined;
            return {
              type: "Point",
              ...(hasCoords ? { coordinates: [lng, lat] } : {}),
              address: form.locationAddress || undefined,
            };
          })(),
          fulfillmentSettings: {
            type: form.fulfillmentType,
            preparationTimeMin: form.preparationTimeMin
              ? parseInt(form.preparationTimeMin)
              : undefined,
            minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
            deliveryPrice: form.deliveryPrice ? parseFloat(form.deliveryPrice) : undefined,
            autoAcceptOrders: form.autoAcceptOrders === "true",
          },
          bankDetails:
            form.bankAccountNumber || form.bankCode || form.bankName
              ? {
                  accountNumber: form.bankAccountNumber || undefined,
                  bankCode: form.bankCode || undefined,
                  accountName: form.bankAccountName || undefined,
                  bankName: form.bankName || undefined,
                }
              : undefined,
          storeDetails: form.storeName
            ? [
                {
                  // Preserve existing fields (status, isVerifiedBusiness, timePeriod, etc.)
                  ...(existing?.storeDetails?.[0] ?? {}),
                  storeName: form.storeName,
                  storeType: form.storeType || undefined,
                  // Keep as string — schema type is String (not array)
                  servicesOffered: form.servicesOffered || undefined,
                  ninID: form.ninID || undefined,
                  CACNumber: form.CACNumber || undefined,
                  needsCACSupport: form.needsCACSupport === "true",
                },
              ]
            : undefined,
        };
        await vendorSetupService.update(existing._id, payload);
        toast.success("Vendor updated");
      } else {
        const payload: Record<string, any> = {
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          address: form.address || undefined,
          vendorName: form.vendorName,
          description: form.description || undefined,
          profileImage: form.profileImage || undefined,
          logoUrl: form.logoUrl || undefined,
          bannerUrl: form.bannerUrl || undefined,
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
          needsCACSupport: form.needsCACSupport === "true",
          locationAddress: form.locationAddress || undefined,
          latitude: form.latitude ? parseFloat(form.latitude) : undefined,
          longitude: form.longitude ? parseFloat(form.longitude) : undefined,
          zone: form.zone || undefined,
          fulfillmentType: form.fulfillmentType,
          preparationTimeMin: form.preparationTimeMin
            ? parseInt(form.preparationTimeMin)
            : undefined,
          minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
          deliveryPrice: form.deliveryPrice ? parseFloat(form.deliveryPrice) : undefined,
          autoAcceptOrders: form.autoAcceptOrders === "true",
          bankAccountNumber: form.bankAccountNumber || undefined,
          bankCode: form.bankCode || undefined,
          bankAccountName: form.bankAccountName || undefined,
          bankName: form.bankName || undefined,
        };
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
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-[#1a3f1c] font-black">
            {isEdit ? "Edit Vendor" : "Create Vendor"}
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
                  {existing?.isVerified && (
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Verified
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
                <div className="grid grid-cols-3 gap-3">
                  <InfoRow
                    label="Avg Rating"
                    value={
                      existing?.averageRating != null
                        ? `${existing.averageRating.toFixed(1)} (${existing.ratingCount ?? 0})`
                        : undefined
                    }
                  />
                  <InfoRow
                    label="Balance (₦)"
                    value={
                      existing?.balance != null ? existing.balance.toLocaleString() : undefined
                    }
                  />
                  <InfoRow
                    label="Member Since"
                    value={
                      existing?.createdAt
                        ? new Date(existing.createdAt).toLocaleDateString()
                        : undefined
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <InfoRow label="Vendor ID" value={existing?.vendorId} />
                  <InfoRow label="Tier" value={existing?.tier} />
                  <InfoRow
                    label="Ranking Score"
                    value={existing?.rankingScore != null ? existing.rankingScore : undefined}
                  />
                  <InfoRow label="Paystack Recipient" value={existing?.paystackRecipientCode} />
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
              </>
            )}

            {/* Owner Details */}
            <Section title="Owner Details" />
            {isEdit && existing?.owner?.img && (
              <div className="flex items-center gap-3 pb-1">
                <img
                  src={existing.owner.img}
                  alt={existing.owner?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <p className="text-xs text-gray-400">Owner profile picture</p>
              </div>
            )}
            {isEdit ? (
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="Full Name" value={existing?.owner?.name} />
                <InfoRow label="Email" value={existing?.owner?.email} />
                <InfoRow label="Phone" value={existing?.owner?.phone} />
                <InfoRow label="Address" value={existing?.owner?.address} />
              </div>
            ) : (
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
                  </Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="vendor@example.com"
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
            )}

            {/* Vendor Profile */}
            <Section title="Vendor Profile" />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 col-span-2">
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

            {/* Images */}
            <Section title="Images" />
            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <Label>Profile Image URL</Label>
                <Input
                  value={form.profileImage}
                  onChange={(e) => set("profileImage", e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Logo URL</Label>
                <Input
                  value={form.logoUrl}
                  onChange={(e) => set("logoUrl", e.target.value)}
                  placeholder="https://…"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Banner URL</Label>
                <Input
                  value={form.bannerUrl}
                  onChange={(e) => set("bannerUrl", e.target.value)}
                  placeholder="https://…"
                />
              </div>
            </div>
            {(form.profileImage || form.logoUrl || form.bannerUrl) && (
              <div className="flex gap-4 flex-wrap pt-1">
                {form.profileImage && (
                  <div className="text-center">
                    <img
                      src={form.profileImage}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Profile</p>
                  </div>
                )}
                {form.logoUrl && (
                  <div className="text-center">
                    <img
                      src={form.logoUrl}
                      alt="Logo"
                      className="w-12 h-12 rounded object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Logo</p>
                  </div>
                )}
                {form.bannerUrl && (
                  <div className="text-center">
                    <img
                      src={form.bannerUrl}
                      alt="Banner"
                      className="w-28 h-12 rounded object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Banner</p>
                  </div>
                )}
              </div>
            )}

            {/* Store Details */}
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
              <div className="space-y-1.5">
                <Label>Needs CAC Support</Label>
                <Select
                  value={form.needsCACSupport}
                  onValueChange={(v) => set("needsCACSupport", v)}
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
              {isEdit && store.status && <InfoRow label="Store Status" value={store.status} />}
              {isEdit && store.isVerifiedBusiness !== undefined && (
                <InfoRow
                  label="Verified Business"
                  value={store.isVerifiedBusiness ? "Yes" : "No"}
                />
              )}
              {isEdit && store.isOpen !== undefined && (
                <InfoRow label="Currently Open" value={store.isOpen ? "Open" : "Closed"} />
              )}
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

            {/* Store Time Periods (set from mobile app) */}
            {isEdit && Array.isArray(store.timePeriod) && store.timePeriod.length > 0 && (
              <>
                <Section title="Store Hours (from mobile)" />
                <div className="grid grid-cols-2 gap-2">
                  {store.timePeriod.map((t: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                    >
                      <span className="font-semibold capitalize text-gray-700">{t.day}</span>
                      <span className="text-xs text-gray-500">
                        {t.openingHour} – {t.closingHour}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Location */}
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

            {/* Operating Hours — read-only display */}
            {isEdit &&
              Array.isArray(existing?.operatingHours) &&
              existing.operatingHours.length > 0 && (
                <>
                  <Section title="Operating Hours" />
                  <div className="grid grid-cols-2 gap-2">
                    {existing.operatingHours.map((h: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm"
                      >
                        <span className="font-semibold capitalize text-gray-700">{h.day}</span>
                        <span
                          className={`text-xs ${h.isOpen ? "text-green-600" : "text-gray-400"}`}
                        >
                          {h.isOpen ? `${h.open} – ${h.close}` : "Closed"}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

            {/* Fulfillment Settings */}
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
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
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
                <Label>Delivery Price (₦)</Label>
                <Input
                  type="number"
                  value={form.deliveryPrice}
                  onChange={(e) => set("deliveryPrice", e.target.value)}
                  placeholder="0"
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

            {/* Bank Details */}
            <Section title="Bank Details" />
            <p className="text-xs text-gray-400 -mt-1">
              Bank details are stored securely and not displayed on load.
            </p>
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
