"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle, Trash2, ShoppingBag, Radio, Tag, Info } from "lucide-react";
import { notificationService } from "@/lib/api/services/notification.service";
import { NotificationDetailModal } from "@/components/ui/notification-detail-modal";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

const PAGE_SIZE = 15;

const typeAccent: Record<string, string> = {
  promo_approval_request: "border-l-amber-400 bg-amber-50",
  promo_approved: "border-l-green-400 bg-green-50",
  promo_declined: "border-l-red-400 bg-red-50",
  promo_approval_processed: "border-l-gray-200 bg-gray-50",
  order_update: "border-l-blue-400 bg-blue-50",
  general: "border-l-indigo-300 bg-white",
  broadcast: "border-l-indigo-300 bg-white",
};

const typeIcon: Record<string, React.ReactNode> = {
  order_update: <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />,
  promo_approval_request: <Tag className="w-3.5 h-3.5 text-amber-500" />,
  promo_approved: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  promo_declined: <Info className="w-3.5 h-3.5 text-red-500" />,
  promo_approval_processed: <CheckCircle className="w-3.5 h-3.5 text-gray-400" />,
  general: <Radio className="w-3.5 h-3.5 text-indigo-400" />,
  broadcast: <Radio className="w-3.5 h-3.5 text-indigo-400" />,
};

type FilterType = "all" | "unread" | "order_update" | "broadcast" | "promo";

const filters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "order_update", label: "Orders" },
  { key: "broadcast", label: "Broadcasts" },
  { key: "promo", label: "Promos" },
];

export default function NotificationsInboxPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<any | null>(null);

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["notifications", "Operations"],
    queryFn: async () => {
      const res: any = await notificationService.getAllNotifications({
        targetPortal: "Operations",
      });
      return (
        Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.notifications)
              ? res.notifications
              : []
      ) as any[];
    },
    staleTime: 15000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Failed to mark as read"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      const unread = all.filter((n: any) => !n.read);
      await Promise.all(unread.map((n: any) => notificationService.markAsRead(n._id || n.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All marked as read");
    },
  });

  // Client-side filter
  const filtered = all.filter((n: any) => {
    if (activeFilter === "unread") return !n.read;
    if (activeFilter === "order_update") return n.type === "order_update";
    if (activeFilter === "broadcast") return n.type === "broadcast" || n.type === "general";
    if (activeFilter === "promo") return n.type?.startsWith("promo_");
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = all.filter((n: any) => !n.read).length;

  const handleFilterChange = (f: FilterType) => {
    setActiveFilter(f);
    setPage(1);
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs text-[#1A3F1C] border-[#1A3F1C]/30 hover:bg-[#1A3F1C]/5"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {markAllMutation.isPending ? "Marking..." : "Mark all as read"}
          </Button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {filters.map((f) => {
          const count =
            f.key === "all"
              ? all.length
              : f.key === "unread"
                ? all.filter((n: any) => !n.read).length
                : f.key === "order_update"
                  ? all.filter((n: any) => n.type === "order_update").length
                  : f.key === "broadcast"
                    ? all.filter((n: any) => n.type === "broadcast" || n.type === "general").length
                    : all.filter((n: any) => n.type?.startsWith("promo_")).length;

          return (
            <button
              key={f.key}
              type="button"
              onClick={() => handleFilterChange(f.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                activeFilter === f.key
                  ? "bg-[#1A3F1C] text-white border-[#1A3F1C] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1A3F1C]/40 hover:text-[#1A3F1C]"
              }`}
            >
              {f.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeFilter === f.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
            Loading...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
            <Bell className="h-10 w-10 opacity-15" />
            <p className="text-sm">No notifications here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((notif: any, i: number) => {
              const accent = typeAccent[notif.type] || typeAccent.general;
              const icon = typeIcon[notif.type] || typeIcon.general;
              const id = notif._id || notif.id;
              return (
                <div
                  key={id || i}
                  className={`flex items-start gap-3 px-4 py-3 border-l-[3px] ${accent} hover:brightness-[0.97] transition-all`}
                >
                  {/* Unread dot */}
                  <div className="mt-1.5 shrink-0">
                    {!notif.read ? (
                      <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-gray-200 block" />
                    )}
                  </div>

                  {/* Type icon */}
                  <div className="mt-1 shrink-0">{icon}</div>

                  {/* Content — clickable */}
                  <button
                    type="button"
                    className="flex-1 min-w-0 text-left"
                    onClick={() => setSelected(notif)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-sm font-bold line-clamp-1 ${!notif.read ? "text-gray-900" : "text-gray-500"}`}
                      >
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Now"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{notif.message}</p>
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    {!notif.read && (
                      <button
                        type="button"
                        title="Mark as read"
                        className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                        onClick={() => markReadMutation.mutate(id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      title="Delete"
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      onClick={() => {
                        if (confirm("Delete this notification?")) deleteMutation.mutate(id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > pageSize && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
            pageSizeOptions={[10, 15, 25, 50]}
          />
        )}
      </div>

      <NotificationDetailModal
        notification={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
