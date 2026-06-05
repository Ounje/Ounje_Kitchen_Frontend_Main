"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, RefreshCw, ArrowLeft, Utensils, Package, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { foodItemService, comboService } from "@/lib/api/services/accountSetup.service";

type MenuTab = "food-items" | "combos";

interface Props {
  vendorId: string;
  portal: "it" | "operations";
}

// ── Food Item Form ─────────────────────────────────────────────────────────────
function FoodItemForm({
  vendorId,
  existing,
  onClose,
  onSuccess,
}: {
  vendorId: string;
  existing?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!existing;
  const [form, setForm] = useState({
    name:        existing?.name        ?? "",
    description: existing?.description ?? "",
    price:       existing?.price?.toString() ?? "",
    category:    existing?.category    ?? "",
    imageUrl:    existing?.imageUrl    ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        description: form.description || undefined,
        price:       parseFloat(form.price),
        category:    form.category    || undefined,
        imageUrl:    form.imageUrl    || undefined,
      };
      if (isEdit) {
        await foodItemService.update(vendorId, existing._id, payload);
        toast.success("Food item updated");
      } else {
        await foodItemService.create(vendorId, payload);
        toast.success("Food item added");
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
            {isEdit ? "Edit Food Item" : "Add Food Item"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label>Name <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Jollof Rice" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description…" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price (₦) <span className="text-red-500">*</span></Label>
              <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="1500" min={0} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={form.category} onChange={e => set("category", e.target.value)} placeholder="e.g. Rice" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Image URL</Label>
            <Input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-[#1a3f1c] hover:bg-[#1a3f1c]/90" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Combo Form ─────────────────────────────────────────────────────────────────
function ComboForm({
  vendorId,
  existing,
  onClose,
  onSuccess,
}: {
  vendorId: string;
  existing?: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const isEdit = !!existing;
  const [form, setForm] = useState({
    name:        existing?.name        ?? "",
    description: existing?.description ?? "",
    price:       existing?.price?.toString() ?? "",
    imageUrl:    existing?.imageUrl    ?? "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name:        form.name,
        description: form.description || undefined,
        price:       parseFloat(form.price),
        imageUrl:    form.imageUrl    || undefined,
      };
      if (isEdit) {
        await comboService.update(vendorId, existing._id, payload);
        toast.success("Combo updated");
      } else {
        await comboService.create(vendorId, payload);
        toast.success("Combo added");
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
            {isEdit ? "Edit Combo" : "Add Combo"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <Label>Name <span className="text-red-500">*</span></Label>
            <Input value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Family Feast" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Short description…" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Price (₦) <span className="text-red-500">*</span></Label>
              <Input type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="3500" min={0} />
            </div>
            <div className="space-y-1.5">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={e => set("imageUrl", e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-[#1a3f1c] hover:bg-[#1a3f1c]/90" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Combo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function VendorMenuPage({ vendorId, portal }: Props) {
  const router   = useRouter();
  const [tab, setTab] = useState<MenuTab>("food-items");
  const [items,   setItems]   = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [editTarget,   setEditTarget]   = useState<any>(null);
  const [deletingId,   setDeletingId]   = useState<string | null>(null);
  const [togglingId,   setTogglingId]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      let res: any;
      if (tab === "food-items") res = await foodItemService.list(vendorId);
      else                      res = await comboService.list(vendorId);
      setItems(res?.data ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, [tab, vendorId]);

  useEffect(() => { setItems([]); fetch(); }, [tab]); // eslint-disable-line

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      if (tab === "food-items") await foodItemService.remove(vendorId, id);
      else                      await comboService.remove(vendorId, id);
      toast.success("Deleted");
      fetch();
    } catch (err: any) {
      toast.error(err?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      if (tab === "food-items") await foodItemService.toggle(vendorId, id);
      else                      await comboService.toggle(vendorId, id);
      fetch();
    } catch (err: any) {
      toast.error(err?.message || "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-gray-500"
            onClick={() => router.push(`/${portal}/account-setup`)}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-black text-[#1a3f1c]">Vendor Menu</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage food items and combos for this vendor</p>
          </div>
        </div>
        <Button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          className="bg-[#1a3f1c] hover:bg-[#1a3f1c]/90 gap-2"
        >
          <Plus className="w-4 h-4" /> Add {tab === "food-items" ? "Food Item" : "Combo"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {([
          { key: "food-items", label: "Food Items", icon: <Utensils className="w-4 h-4" /> },
          { key: "combos",     label: "Combos",     icon: <Package  className="w-4 h-4" /> },
        ] as { key: MenuTab; label: string; icon: React.ReactNode }[]).map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t.key ? "bg-white text-[#1a3f1c] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.icon}{t.label}
          </button>
        ))}
        <Button variant="ghost" size="sm" className="ml-1" onClick={fetch} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 border-b border-gray-50 animate-pulse bg-gray-50/50" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            {tab === "food-items" ? <Utensils className="w-10 h-10 opacity-20" /> : <Package className="w-10 h-10 opacity-20" />}
            <p className="text-sm font-medium">No {tab === "food-items" ? "food items" : "combos"} yet</p>
            <p className="text-xs">Use the Add button above to create one</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Name</th>
                  {tab === "food-items" && (
                    <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Variants</th>
                  )}
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                  <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {items.map((item: any) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-gray-800">
                      {tab === "food-items"
                        ? (item.category || item.name || "—")
                        : (item.name || item.comboName || "—")}
                    </td>
                    {tab === "food-items" && (
                      <td className="px-4 py-3.5 text-gray-500 text-xs">
                        {item.subCategory?.length ?? 0} item{item.subCategory?.length !== 1 ? "s" : ""}
                      </td>
                    )}
                    <td className="px-4 py-3.5 text-gray-700 text-xs font-semibold">
                      {tab === "food-items"
                        ? (item.subCategory?.[0]?.price
                            ? `₦${Number(item.subCategory[0].price).toLocaleString()}`
                            : item.price ? `₦${Number(item.price).toLocaleString()}` : "—")
                        : (item.price ?? item.basePrice)
                            ? `₦${Number(item.price ?? item.basePrice).toLocaleString()}`
                            : "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        item.isAvailable !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {item.isAvailable !== false ? "Available" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-[#1a3f1c]"
                          onClick={() => handleToggle(item._id)}
                          disabled={togglingId === item._id}
                          title={item.isAvailable !== false ? "Hide item" : "Make available"}
                        >
                          {item.isAvailable !== false
                            ? <ToggleRight className="w-4 h-4 text-green-600" />
                            : <ToggleLeft  className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-[#1a3f1c]"
                          onClick={() => { setEditTarget(item); setShowForm(true); }}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showForm && tab === "food-items" && (
        <FoodItemForm
          vendorId={vendorId}
          existing={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSuccess={() => { setShowForm(false); setEditTarget(null); fetch(); }}
        />
      )}
      {showForm && tab === "combos" && (
        <ComboForm
          vendorId={vendorId}
          existing={editTarget}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSuccess={() => { setShowForm(false); setEditTarget(null); fetch(); }}
        />
      )}
    </div>
  );
}
