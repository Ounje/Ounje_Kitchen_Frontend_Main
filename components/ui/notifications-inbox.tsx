"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle, Trash2, ShoppingBag, Tag, Info } from "lucide-react";
import { notificationService } from "@/lib/api/services/notification.service";
import { NotificationDetailModal } from "@/components/ui/notification-detail-modal";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";

const BROADCAST_TYPES = new Set(["broadcast", "general"]);

const typeAccent: Record<string, string> = {
  promo_approval_request: "border-l-amber-400 bg-amber-50",
  promo_approved: "border-l-green-400 bg-green-50",
  promo_declined: "border-l-red-400 bg-red-50",
  promo_approval_processed: "border-l-gray-200 bg-gray-50",
  order_update: "border-l-blue-400 bg-blue-50",
};

const typeIcon: Record<string, React.ReactNode> = {
  order_update: <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />,
  promo_approval_request: <Tag className="w-3.5 h-3.5 text-amber-500" />,
  promo_approved: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
  promo_declined: <Info className="w-3.5 h-3.5 text-red-500" />,
  promo_approval_processed: <CheckCircle className="w-3.5 h-3.5 text-gray-400" />,
};

type FilterType = "all" | "unread" | "order_update" | "promo";

const notifFilters: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "order_update", label: "Orders" },
  { key: "promo", label: "Promos" },
];

interface NotificationsInboxProps {
  portal: string;
}

function ItemRow({
  notif,
  onOpen,
  onMarkRead,
  onDelete,
}: {
  notif: any;
  onOpen: (n: any) => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const id = notif._id || notif.id;
  const accent = typeAccent[notif.type] || "border-l-gray-200 bg-white";
  const icon = typeIcon[notif.type] || <Bell className="w-3.5 h-3.5 text-gray-400" />;

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2 border-l-[3px] ${accent} hover:brightness-[0.97] transition-all`}
    >
      <div className="shrink-0">
        {!notif.read ? (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" />
        ) : (
          <span className="w-1.5 h-1.5 rounded-full bg-gray-200 block" />
        )}
      </div>
      <div className="shrink-0">{icon}</div>
      <button type="button" className="flex-1 min-w-0 text-left" onClick={() => onOpen(notif)}>
        <div className="flex items-center justify-between gap-2">
          <span
            className={`text-xs font-semibold line-clamp-1 ${!notif.read ? "text-gray-900" : "text-gray-500"}`}
          >
            {notif.title}
          </span>
          <span className="text-[10px] text-gray-400 shrink-0">
            {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : "Now"}
          </span>
        </div>
        <p className="text-[11px] text-gray-500 line-clamp-1">{notif.message}</p>
      </button>
      <div className="flex items-center gap-0.5 shrink-0">
        {!notif.read && (
          <button
            type="button"
            title="Mark as read"
            className="p-1 rounded text-blue-500 hover:bg-blue-50 transition-colors"
            onClick={() => onMarkRead(id)}
          >
            <CheckCircle className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          type="button"
          title="Delete"
          className="p-1 rounded text-red-400 hover:bg-red-50 transition-colors"
          onClick={() => {
            if (confirm("Delete this notification?")) onDelete(id);
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function NotificationsInbox({ portal }: NotificationsInboxProps) {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [selected, setSelected] = useState<any | null>(null);

  const { data: all = [], isLoading } = useQuery({
    queryKey: ["notifications", portal],
    queryFn: async () => {
      const res: any = await notificationService.getAllNotifications({ targetPortal: portal });
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

  const notifItems = all.filter((n: any) => !BROADCAST_TYPES.has(n.type));

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
    onError: () => toast.error("Failed to mark as read"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteBroadcast(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Deleted");
    },
    onError: () => toast.error("Failed to delete"),
  });

  const markAllMutation = useMutation({
    mutationFn: async () => {
      const unread = notifItems.filter((n: any) => !n.read);
      await Promise.all(unread.map((n: any) => notificationService.markAsRead(n._id || n.id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All marked as read");
    },
  });

  const filtered = notifItems.filter((n: any) => {
    if (filter === "unread") return !n.read;
    if (filter === "order_update") return n.type === "order_update";
    if (filter === "promo") return n.type?.startsWith("promo_");
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const unreadCount = notifItems.filter((n: any) => !n.read).length;

  return (
    <div className="p-3 sm:p-5 max-w-4xl mx-auto space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <h1 className="text-base font-black text-gray-900 tracking-tight">Inbox</h1>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs text-[#1A3F1C] border-[#1A3F1C]/30 hover:bg-[#1A3F1C]/5"
            onClick={() => markAllMutation.mutate()}
            disabled={markAllMutation.isPending}
          >
            <CheckCircle className="w-3 h-3" />
            {markAllMutation.isPending ? "Marking..." : "Mark all read"}
          </Button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {notifFilters.map((f) => {
          const count =
            f.key === "all"
              ? notifItems.length
              : f.key === "unread"
                ? unreadCount
                : f.key === "order_update"
                  ? notifItems.filter((n: any) => n.type === "order_update").length
                  : notifItems.filter((n: any) => n.type?.startsWith("promo_")).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => {
                setFilter(f.key);
                setPage(1);
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all border ${
                filter === f.key
                  ? "bg-[#1A3F1C] text-white border-[#1A3F1C]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#1A3F1C]/40 hover:text-[#1A3F1C]"
              }`}
            >
              {f.label}
              {count > 0 && (
                <span
                  className={`ml-1 text-[10px] font-bold px-1 py-px rounded-full ${
                    filter === f.key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
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
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center h-28 text-gray-400 text-sm">
            Loading...
          </div>
        ) : paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 gap-2 text-gray-400">
            <Bell className="h-8 w-8 opacity-15" />
            <p className="text-xs">Nothing here yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {paginated.map((notif: any, i: number) => (
              <ItemRow
                key={notif._id || notif.id || i}
                notif={notif}
                onOpen={setSelected}
                onMarkRead={(id) => markReadMutation.mutate(id)}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
        {filtered.length > 0 && (
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
