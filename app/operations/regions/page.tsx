"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Truck,
  Tag,
  Percent,
  Users,
  ChevronDown,
  ChevronUp,
  Power,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { regionService, RegionData } from "@/lib/api/services/region.service";
import { apiClient } from "@/lib/client";
import { ENDPOINTS } from "@/lib/config";

interface Region {
  _id: string;
  name: string;
  description?: string;
  markupRate: number;
  serviceFeeRate: number;
  freeDelivery: boolean;
  deliveryFeeMultiplier: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  vendors?: { _id: string; name: string; isActive: boolean }[];
}

const DEFAULT_FORM: RegionData = {
  name: "",
  description: "",
  markupRate: 0.1,
  serviceFeeRate: 0.1,
  freeDelivery: false,
  deliveryFeeMultiplier: 1.0,
  isActive: true,
};

function fmtRate(rate: number) {
  return `${(rate * 100).toFixed(0)}%`;
}

export default function RegionsPage() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Region | null>(null);
  const [form, setForm] = useState<RegionData>(DEFAULT_FORM);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [vendorSearch, setVendorSearch] = useState("");
  const [vendorSearchResults, setVendorSearchResults] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [searchLoading, setSearchLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["regions"],
    queryFn: async () => {
      const res = (await regionService.getRegions()) as { data: Region[] };
      return res.data ?? [];
    },
  });

  const regions: Region[] = data ?? [];

  const createMutation = useMutation({
    mutationFn: (d: RegionData) => regionService.createRegion(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["regions"] });
      toast.success("Region created successfully");
      setDialogOpen(false);
      setForm(DEFAULT_FORM);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to create region"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RegionData> }) =>
      regionService.updateRegion(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["regions"] });
      toast.success("Region updated successfully");
      setDialogOpen(false);
      setEditing(null);
      setForm(DEFAULT_FORM);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to update region"),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => regionService.toggleRegion(id),
    onSuccess: (res: any) => {
      qc.invalidateQueries({ queryKey: ["regions"] });
      toast.success(res?.message ?? "Region updated");
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to toggle region"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => regionService.deleteRegion(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["regions"] });
      setDeleteConfirmId(null);
      toast.success("Region permanently deleted");
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to delete region"),
  });

  const assignMutation = useMutation({
    mutationFn: ({
      regionId,
      vendorId,
      unassign,
    }: {
      regionId: string;
      vendorId: string;
      unassign?: boolean;
    }) =>
      unassign
        ? regionService.unassignVendorFromRegion(regionId, vendorId)
        : regionService.assignVendorToRegion(regionId, vendorId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["regions"] });
      qc.invalidateQueries({ queryKey: ["region-detail", vars.regionId] });
      toast.success(vars.unassign ? "Vendor removed from region" : "Vendor assigned to region");
      setVendorSearch("");
      setVendorSearchResults([]);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to update vendor assignment"),
  });

  const { data: regionDetail } = useQuery({
    queryKey: ["region-detail", expandedRegion],
    queryFn: async () => {
      if (!expandedRegion) return null;
      const res = (await regionService.getRegionById(expandedRegion)) as { data: Region };
      return res.data;
    },
    enabled: !!expandedRegion,
  });

  const openCreate = () => {
    setEditing(null);
    setForm(DEFAULT_FORM);
    setDialogOpen(true);
  };

  const openEdit = (region: Region) => {
    setEditing(region);
    setForm({
      name: region.name,
      description: region.description ?? "",
      markupRate: region.markupRate,
      serviceFeeRate: region.serviceFeeRate,
      freeDelivery: region.freeDelivery,
      deliveryFeeMultiplier: region.deliveryFeeMultiplier,
      isActive: region.isActive,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      updateMutation.mutate({ id: editing._id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleVendorSearch = async (query: string) => {
    setVendorSearch(query);
    if (query.trim().length < 2) {
      setVendorSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await apiClient.get<{ vendors: { _id: string; name: string }[] }>(
        ENDPOINTS.OPERATIONS.VENDORS,
        { params: { search: query, limit: "8" } }
      );
      setVendorSearchResults((res as any)?.vendors ?? (res as any)?.data ?? []);
    } catch {
      setVendorSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#1A3F1C]" />
            Region Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure pricing rules per region — markup, service fee, delivery fee, and free
            delivery.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openCreate}
              className="bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              New Region
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Region" : "Create Region"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Region Name *
                </Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Lekki Phase 1"
                  className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C] h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Description
                </Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Optional description"
                  className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C] h-9 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Markup Rate (0 = no markup)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={form.markupRate}
                    onChange={(e) => setForm((f) => ({ ...f, markupRate: Number(e.target.value) }))}
                    className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C] h-9 text-sm"
                  />
                  <p className="text-xs text-gray-400">Current: {fmtRate(form.markupRate)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Service Fee Rate (0 = no fee)
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={form.serviceFeeRate}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, serviceFeeRate: Number(e.target.value) }))
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C] h-9 text-sm"
                  />
                  <p className="text-xs text-gray-400">Current: {fmtRate(form.serviceFeeRate)}</p>
                </div>
              </div>

              {/* Free Delivery Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Free Delivery</p>
                  <p className="text-xs text-gray-400">Customer pays ₦0 delivery fee</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, freeDelivery: !f.freeDelivery }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.freeDelivery ? "bg-[#1A3F1C]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.freeDelivery ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Delivery Fee Multiplier */}
              {!form.freeDelivery && (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Delivery Fee Multiplier (1.0 = normal)
                  </Label>
                  <Input
                    type="number"
                    min={0.1}
                    max={3.0}
                    step={0.05}
                    value={form.deliveryFeeMultiplier}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, deliveryFeeMultiplier: Number(e.target.value) }))
                    }
                    className="bg-gray-50 border-gray-200 focus:border-[#1A3F1C] h-9 text-sm"
                  />
                  <p className="text-xs text-gray-400">
                    {form.deliveryFeeMultiplier < 1
                      ? `${((1 - form.deliveryFeeMultiplier) * 100).toFixed(0)}% cheaper delivery`
                      : form.deliveryFeeMultiplier > 1
                        ? `${((form.deliveryFeeMultiplier - 1) * 100).toFixed(0)}% more expensive delivery`
                        : "Normal delivery pricing"}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1A3F1C] hover:bg-[#1A3F1C]/90 text-white"
              >
                {isPending ? "Saving…" : editing ? "Update Region" : "Create Region"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Regions Table */}
      <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-900 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800">
              <TableHead className="font-semibold text-xs uppercase text-gray-500">
                Region
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-gray-500">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Markup
                </span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-gray-500">
                <span className="flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  Service Fee
                </span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-gray-500">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" />
                  Delivery
                </span>
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-gray-500">
                Status
              </TableHead>
              <TableHead className="font-semibold text-xs uppercase text-gray-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                  Loading regions…
                </TableCell>
              </TableRow>
            ) : regions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-10">
                  No regions yet. Create your first region.
                </TableCell>
              </TableRow>
            ) : (
              regions.map((region) => (
                <TableRow
                  key={region._id}
                  className={`cursor-pointer transition-colors ${
                    expandedRegion === region._id
                      ? "bg-[#1A3F1C]/5 dark:bg-[#1A3F1C]/20"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => {
                    setExpandedRegion(expandedRegion === region._id ? null : region._id);
                    setVendorSearch("");
                    setVendorSearchResults([]);
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expandedRegion === region._id ? (
                        <ChevronUp className="w-4 h-4 text-[#1A3F1C]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">
                          {region.name}
                        </p>
                        {region.description && (
                          <p className="text-xs text-gray-400">{region.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${region.markupRate === 0 ? "text-green-600" : "text-gray-700"}`}
                    >
                      {region.markupRate === 0 ? "None" : fmtRate(region.markupRate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-sm font-medium ${region.serviceFeeRate === 0 ? "text-green-600" : "text-gray-700"}`}
                    >
                      {region.serviceFeeRate === 0 ? "None" : fmtRate(region.serviceFeeRate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {region.freeDelivery ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                        Free
                      </Badge>
                    ) : (
                      <span
                        className={`text-sm font-medium ${region.deliveryFeeMultiplier !== 1 ? "text-amber-600" : "text-gray-700"}`}
                      >
                        {region.deliveryFeeMultiplier}×
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        region.isActive
                          ? "bg-green-100 text-green-700 border-green-200 text-xs"
                          : "bg-gray-100 text-gray-500 border-gray-200 text-xs"
                      }
                    >
                      {region.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        title="Edit region"
                        onClick={() => openEdit(region)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-[#1A3F1C]"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title={region.isActive ? "Deactivate region" : "Activate region"}
                        onClick={() => toggleMutation.mutate(region._id)}
                        className={`p-1.5 rounded transition-colors ${
                          region.isActive
                            ? "hover:bg-amber-50 text-gray-500 hover:text-amber-600"
                            : "hover:bg-green-50 text-gray-400 hover:text-green-600"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete region permanently"
                        onClick={() => setDeleteConfirmId(region._id)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation dialog */}
      {deleteConfirmId &&
        (() => {
          const target = regions.find((r) => r._id === deleteConfirmId);
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Delete Region</h3>
                    <p className="text-xs text-gray-500">This cannot be undone</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {target?.name}
                  </span>
                  ? All vendor assignments to this region will be unlinked.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(null)}
                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(deleteConfirmId)}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-60"
                  >
                    {deleteMutation.isPending ? "Deleting…" : "Yes, Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Vendor Assignment Panel — shown below table when a region is selected */}
      {expandedRegion &&
        (() => {
          const selected = regions.find((r) => r._id === expandedRegion);
          if (!selected) return null;
          return (
            <div className="rounded-xl border border-[#1A3F1C]/20 bg-white dark:bg-gray-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#1A3F1C]" />
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Vendors in <span className="text-[#1A3F1C]">{selected.name}</span>
                  </h2>
                </div>
                <button
                  type="button"
                  title="Close panel"
                  onClick={() => {
                    setExpandedRegion(null);
                    setVendorSearch("");
                    setVendorSearchResults([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              </div>

              {/* Assigned vendor chips */}
              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {regionDetail?.vendors && regionDetail.vendors.length > 0 ? (
                  regionDetail.vendors.map((v) => (
                    <div
                      key={v._id}
                      className="flex items-center gap-1.5 bg-[#1A3F1C]/5 border border-[#1A3F1C]/20 rounded-full px-3 py-1.5 text-sm"
                    >
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{v.name}</span>
                      <button
                        type="button"
                        title={`Remove ${v.name} from region`}
                        onClick={() =>
                          assignMutation.mutate({
                            regionId: selected._id,
                            vendorId: v._id,
                            unassign: true,
                          })
                        }
                        className="text-gray-400 hover:text-red-500 ml-0.5 text-base leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No vendors assigned yet.</p>
                )}
              </div>

              {/* Vendor search */}
              <div className="relative max-w-md">
                <Input
                  placeholder="Search vendor name to assign…"
                  value={vendorSearch}
                  onChange={(e) => handleVendorSearch(e.target.value)}
                  className="bg-gray-50 border-gray-200 h-10 text-sm"
                />
                {vendorSearchResults.length > 0 && (
                  <div className="absolute top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50 overflow-hidden">
                    {vendorSearchResults.map((v) => (
                      <button
                        key={v._id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          assignMutation.mutate({ regionId: selected._id, vendorId: v._id });
                          setVendorSearch("");
                          setVendorSearchResults([]);
                        }}
                        className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-[#1A3F1C]/5 text-gray-800 dark:text-gray-200 border-b border-gray-100 last:border-0"
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                )}
                {searchLoading && <p className="text-xs text-gray-400 mt-1">Searching…</p>}
              </div>
            </div>
          );
        })()}
    </div>
  );
}
