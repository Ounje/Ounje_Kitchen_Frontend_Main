"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Gift,
  BookOpen,
  ClipboardList,
  Trophy,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  RefreshCw,
  Users,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Pagination from "@/components/Pagination";
import rewardsService, {
  type CatalogItem,
  type CatalogItemData,
  type CustomerRewardEntry,
  type LuckyOrderDraw,
  type RewardStats,
} from "@/lib/api/services/rewards.service";

// ── Constants ──────────────────────────────────────────────────────────────

const REWARD_CATEGORIES = [
  { value: "order streak", label: "Order Streak" },
  { value: "mystery reward", label: "Mystery Reward" },
  { value: "food level", label: "Food Level" },
  { value: "lucky order", label: "Lucky Order" },
  { value: "explorer", label: "Explorer" },
  { value: "community milestone", label: "Community Milestone" },
  { value: "treasure_hunt", label: "Treasure Hunt" },
  { value: "secret drop", label: "Secret Drop" },
];

const REWARD_TYPES = [
  { value: "free delivery", label: "Free Delivery" },
  { value: "wallet credit", label: "Wallet Credit" },
  { value: "free item", label: "Free Item" },
  { value: "priority delivery", label: "Priority Delivery" },
  { value: "badge only", label: "Badge Only" },
  { value: "vip status", label: "VIP Status" },
];

const STATUS_COLORS: Record<string, string> = {
  unlocked: "bg-yellow-100 text-yellow-700",
  redeemed: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-500",
};

const TABS = [
  { id: "catalog", label: "Reward Catalog", icon: BookOpen },
  { id: "ledger", label: "Redemption Ledger", icon: ClipboardList },
  { id: "lucky-order", label: "Lucky Order", icon: Trophy },
];

const DEFAULT_CATALOG_FORM: CatalogItemData = {
  category: "",
  label: "",
  rewardType: "",
  triggerValue: undefined,
  walletCreditAmount: 0,
  freeItemDescription: "",
  isMysteryPoolMember: false,
};

// ── Main Page ──────────────────────────────────────────────────────────────

export default function RewardsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTab = searchParams.get("tab") || "catalog";

  const setTab = (tab: string) => router.push(`/operations/rewards?tab=${tab}`);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <Gift className="w-6 h-6 text-[#1a3f1c]" />
          <h1 className="text-2xl font-bold text-[#1a3f1c]">Rewards</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Configure reward catalog, view redemptions, and run Lucky Order draws
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "border-[#1a3f1c] text-[#1a3f1c]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === "catalog" && <CatalogTab />}
      {activeTab === "ledger" && <LedgerTab />}
      {activeTab === "lucky-order" && <LuckyOrderTab />}
    </div>
  );
}

// ── Catalog Tab ────────────────────────────────────────────────────────────

function CatalogTab() {
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CatalogItem | null>(null);
  const [form, setForm] = useState<CatalogItemData>(DEFAULT_CATALOG_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery<CatalogItem[]>({
    queryKey: ["rewards-catalog"],
    queryFn: async () => {
      const res = await rewardsService.getCatalogItems({ active: "all" });
      return res.data ?? res ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CatalogItemData) => rewardsService.createCatalogItem(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rewards-catalog"] });
      toast.success("Reward item created");
      setDialogOpen(false);
      setForm(DEFAULT_CATALOG_FORM);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to create item"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CatalogItemData> }) =>
      rewardsService.updateCatalogItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rewards-catalog"] });
      toast.success("Reward item updated");
      setDialogOpen(false);
      setEditing(null);
      setForm(DEFAULT_CATALOG_FORM);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to update item"),
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? rewardsService.deactivateCatalogItem(id) : rewardsService.reactivateCatalogItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rewards-catalog"] }),
    onError: (e: Error) => toast.error(e.message ?? "Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rewardsService.deleteCatalogItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rewards-catalog"] });
      toast.success("Reward item deleted");
      setDeleteConfirmId(null);
    },
    onError: (e: Error) => toast.error(e.message ?? "Failed to delete item"),
  });

  const openEdit = (item: CatalogItem) => {
    setEditing(item);
    setForm({
      category: item.category,
      label: item.label,
      rewardType: item.rewardType,
      triggerValue: item.triggerValue,
      walletCreditAmount: item.walletCreditAmount,
      freeItemDescription: item.freeItemDescription,
      isMysteryPoolMember: item.isMysteryPoolMember,
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

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} reward item(s) configured</p>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) {
              setEditing(null);
              setForm(DEFAULT_CATALOG_FORM);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-[#1a3f1c] hover:bg-[#1a3f1c]/90 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Reward Item" : "New Reward Item"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Label *</label>
                <Input
                  required
                  placeholder="e.g. 5th Order Free Delivery"
                  value={form.label}
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Category *</label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  >
                    <option value="">Select category</option>
                    {REWARD_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">Reward Type *</label>
                  <select
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={form.rewardType}
                    onChange={(e) => setForm((f) => ({ ...f, rewardType: e.target.value }))}
                  >
                    <option value="">Select type</option>
                    {REWARD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Trigger Value</label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 5 (every 5th order)"
                    value={form.triggerValue ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        triggerValue: e.target.value ? Number(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>

              {form.rewardType === "wallet credit" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Wallet Credit Amount (₦)</label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="e.g. 500"
                    value={form.walletCreditAmount ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, walletCreditAmount: Number(e.target.value) }))
                    }
                  />
                </div>
              )}

              {form.rewardType === "free item" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Free Item Description</label>
                  <Input
                    placeholder="e.g. Free Drink of your choice"
                    value={form.freeItemDescription ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, freeItemDescription: e.target.value }))
                    }
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mystery-pool"
                  checked={form.isMysteryPoolMember ?? false}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isMysteryPoolMember: e.target.checked }))
                  }
                />
                <label htmlFor="mystery-pool" className="text-sm">
                  Include in Mystery Reward pool
                </label>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#1a3f1c] hover:bg-[#1a3f1c]/90 text-white"
              >
                {isPending ? "Saving…" : editing ? "Update Item" : "Create Item"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Trigger</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  No reward items configured yet. Create the first one.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.label}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{item.category}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{item.rewardType}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.triggerValue != null ? `Every ${item.triggerValue}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {item.rewardType === "wallet credit"
                      ? `₦${item.walletCreditAmount?.toLocaleString()}`
                      : item.freeItemDescription || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-gray-400 hover:text-[#1a3f1c] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleMutation.mutate({ id: item._id, active: item.active })}
                        disabled={toggleMutation.isPending}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title={item.active ? "Deactivate" : "Reactivate"}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(item._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 space-y-4 shadow-xl">
            <h3 className="font-semibold text-gray-900">Delete reward item?</h3>
            <p className="text-sm text-gray-500">
              This is permanent. Consider deactivating instead to preserve history.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteConfirmId)}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Ledger Tab ─────────────────────────────────────────────────────────────

function LedgerTab() {
  const qc = useQueryClient();
  const [entries, setEntries] = useState<CustomerRewardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 20 });
  const [statusFilter, setStatusFilter] = useState("");
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const { data: stats = [] } = useQuery<RewardStats[]>({
    queryKey: ["rewards-ledger-stats"],
    queryFn: async () => {
      const res = await rewardsService.getLedgerStats();
      return res.data ?? [];
    },
  });

  const loadEntries = useCallback(async (page: number, status: string) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (status) params.status = status;
      const res = await rewardsService.getLedger(params);
      setEntries(res.data ?? []);
      setPagination({
        page: res.page ?? page,
        totalPages: res.pages ?? 1,
        total: res.total ?? 0,
        limit: res.limit ?? 20,
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to load ledger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntries(1, statusFilter);
  }, [statusFilter]);

  const handleRedeem = async (id: string) => {
    setRedeemingId(id);
    try {
      await rewardsService.markRedeemed(id);
      toast.success("Reward marked as redeemed");
      loadEntries(pagination.page, statusFilter);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to mark as redeemed");
    } finally {
      setRedeemingId(null);
    }
  };

  const statMap = Object.fromEntries(stats.map((s) => [s._id, s.count]));

  return (
    <div className="space-y-5">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["unlocked", "redeemed", "expired"].map((s) => (
          <div key={s} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
            <p className="text-xs text-gray-400 capitalize">{s}</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{statMap[s] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            className="appearance-none pl-3 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a3f1c]/20"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="unlocked">Unlocked</option>
            <option value="redeemed">Redeemed</option>
            <option value="expired">Expired</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
        <span className="text-sm text-gray-400">{pagination.total} records</span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Reward</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  No reward entries found
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{entry.customer?.name ?? "—"}</p>
                      <p className="text-xs text-gray-400">{entry.customer?.phone ?? ""}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{entry.label}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{entry.rewardType}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {entry.rewardType === "wallet credit"
                      ? `₦${entry.walletCreditAmount?.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[entry.status] ?? ""}`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(entry.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    {entry.status === "unlocked" &&
                      ["free delivery", "free item", "priority delivery"].includes(
                        entry.rewardType
                      ) && (
                        <button
                          onClick={() => handleRedeem(entry._id)}
                          disabled={redeemingId === entry._id}
                          className="flex items-center gap-1.5 text-xs font-medium text-green-700 hover:text-green-800 disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {redeemingId === entry._id ? "Marking…" : "Mark Redeemed"}
                        </button>
                      )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        pageSize={pagination.limit}
        onPageChange={(p) => loadEntries(p, statusFilter)}
        onPageSizeChange={(s) => {
          setPagination((prev) => ({ ...prev, limit: s }));
          loadEntries(1, statusFilter);
        }}
      />
    </div>
  );
}

// ── Lucky Order Tab ────────────────────────────────────────────────────────

function LuckyOrderTab() {
  const [drawing, setDrawing] = useState(false);
  const [history, setHistory] = useState<LuckyOrderDraw[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [histPagination, setHistPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
  });

  const { data: pool, refetch: refetchPool } = useQuery<{ eligibleCount: number }>({
    queryKey: ["lucky-order-pool"],
    queryFn: async () => {
      const res = await rewardsService.getLuckyOrderPool();
      return res.data ?? { eligibleCount: 0 };
    },
  });

  const { data: todayDraw, refetch: refetchToday } = useQuery<LuckyOrderDraw | null>({
    queryKey: ["lucky-order-today"],
    queryFn: async () => {
      const res = await rewardsService.getLuckyOrderToday();
      return res.data ?? null;
    },
  });

  const loadHistory = useCallback(async (page: number) => {
    setHistoryLoading(true);
    try {
      const res = await rewardsService.getLuckyOrderHistory({ page, limit: 10 });
      setHistory(res.data ?? []);
      setHistPagination({
        page: res.page ?? page,
        totalPages: res.pages ?? 1,
        total: res.total ?? 0,
        limit: res.limit ?? 10,
      });
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to load draw history");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory(1);
  }, []);

  const runDraw = async () => {
    setDrawing(true);
    try {
      const res = await rewardsService.runLuckyOrderDraw();
      toast.success(`🎉 Winner selected: ${res.data?.winner?.name}`);
      refetchToday();
      refetchPool();
      loadHistory(1);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to run draw");
    } finally {
      setDrawing(false);
    }
  };

  const alreadyRanToday = !!todayDraw;

  return (
    <div className="space-y-6">
      {/* Top row: pool + run draw */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Eligible pool card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a3f1c]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#1a3f1c]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Eligible Customers</p>
              <p className="text-2xl font-bold text-gray-900">{pool?.eligibleCount ?? "—"}</p>
              <p className="text-xs text-gray-400">Ordered in the last 30 days</p>
            </div>
          </div>
        </div>

        {/* Run draw card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Today&apos;s Draw</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {alreadyRanToday
                ? "Draw already completed for today"
                : "No draw has been run yet today"}
            </p>
          </div>
          <Button
            onClick={runDraw}
            disabled={drawing || alreadyRanToday}
            className="mt-4 bg-[#ffca3a] hover:bg-[#ffca3a]/90 text-[#1a3f1c] font-semibold gap-2 disabled:opacity-50"
          >
            <Trophy className="w-4 h-4" />
            {drawing ? "Running draw…" : alreadyRanToday ? "Draw Already Run" : "Run Today's Draw"}
          </Button>
        </div>
      </div>

      {/* Today's winner */}
      {todayDraw && (
        <div className="bg-gradient-to-r from-[#ffca3a]/20 to-[#ffca3a]/10 border border-[#ffca3a]/40 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-[#1a3f1c]" />
            <h3 className="font-semibold text-[#1a3f1c]">Today&apos;s Winner</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500">Name</p>
              <p className="font-medium text-gray-900">{todayDraw.winner?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <p className="font-medium text-gray-900">{todayDraw.winner?.phone ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Reward</p>
              <p className="font-medium text-gray-900">
                {todayDraw.rewardCatalogItem?.label ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Pool Size</p>
              <p className="font-medium text-gray-900">{todayDraw.eligiblePoolSize} customers</p>
            </div>
          </div>
        </div>
      )}

      {/* Draw history */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Draw History</h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Winner</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Reward</th>
                <th className="px-4 py-3 text-left">Pool Size</th>
                <th className="px-4 py-3 text-left">Run By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historyLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    No draws have been run yet
                  </td>
                </tr>
              ) : (
                history.map((draw) => (
                  <tr key={draw._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{draw.date}</td>
                    <td className="px-4 py-3 text-gray-700">{draw.winner?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-500">{draw.winner?.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {draw.rewardCatalogItem?.label ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{draw.eligiblePoolSize}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {draw.triggeredBy
                        ? `${draw.triggeredBy.firstName} ${draw.triggeredBy.lastName}`
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-3">
          <Pagination
            currentPage={histPagination.page}
            totalPages={histPagination.totalPages}
            pageSize={histPagination.limit}
            onPageChange={(p) => loadHistory(p)}
            onPageSizeChange={(s) => {
              setHistPagination((prev) => ({ ...prev, limit: s }));
              loadHistory(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
