"use client";

import { useEffect, useState } from "react";
import { Bell, ExternalLink, Trash2, Radio } from "lucide-react";
import Link from "next/link";
import { subscribeToPushNotifications } from "@/lib/push-notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notificationService } from "@/lib/api/services/notification.service";
import { NotificationDetailModal } from "@/components/ui/notification-detail-modal";

interface NotificationBellProps {
  className?: string;
  portal?: string;
}

const typeAccent: Record<string, string> = {
  promo_approval_request: "border-l-amber-400 bg-amber-50",
  promo_approved: "border-l-green-400 bg-green-50",
  promo_declined: "border-l-red-400 bg-red-50",
  promo_approval_processed: "border-l-gray-200 bg-gray-50",
  order_update: "border-l-blue-400 bg-blue-50",
  general: "border-l-indigo-300 bg-white",
  broadcast: "border-l-indigo-300 bg-white",
};

const BROADCAST_TYPES = new Set(["broadcast", "general"]);

const inboxRouteMap: Record<string, string> = {
  Operations: "/operations/inbox",
  IT: "/it/inbox",
  Finance: "/finance/inbox",
  Admin: "/admin/inbox",
};

type BellTab = "notifications" | "broadcasts";

export function NotificationBell({ className, portal }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BellTab>("notifications");
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const queryClient = useQueryClient();

  const inboxBase = (portal && inboxRouteMap[portal]) || null;

  useEffect(() => {
    subscribeToPushNotifications();
  }, []);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications", portal],
    queryFn: async () => {
      const res: any = await notificationService.getAllNotifications(
        portal ? { targetPortal: portal } : undefined
      );
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
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const clearMutation = useMutation({
    mutationFn: () => notificationService.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setOpen(false);
    },
  });

  const notifs = notifications.filter((n: any) => !BROADCAST_TYPES.has(n.type));
  const broadcasts = notifications.filter((n: any) => BROADCAST_TYPES.has(n.type));

  const unreadNotifs = notifs.filter((n: any) => !n.read).length;
  const unreadBroadcasts = broadcasts.filter((n: any) => !n.read).length;
  const totalUnread = unreadNotifs + unreadBroadcasts;

  const activeItems = activeTab === "notifications" ? notifs.slice(0, 5) : broadcasts.slice(0, 5);

  const handleOpen = (notif: any) => {
    setSelectedNotification(notif);
    setOpen(false);
  };

  const viewAllHref = inboxBase ? `${inboxBase}?tab=${activeTab}` : null;

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`relative ${className || "text-white hover:bg-white/10 active:bg-white/20 h-9 w-9 sm:h-10 sm:w-10"}`}
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {totalUnread > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[320px] p-0 shadow-xl border border-gray-200 bg-white rounded-xl overflow-hidden"
          align="end"
          sideOffset={8}
        >
          {/* Tabs header */}
          <div className="bg-[#1A3F1C]">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab("notifications")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
                  activeTab === "notifications"
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <Bell className="h-3 w-3" />
                Notifications
                {unreadNotifs > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadNotifs}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("broadcasts")}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors ${
                  activeTab === "broadcasts"
                    ? "text-white border-b-2 border-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                <Radio className="h-3 w-3" />
                Broadcasts
                {unreadBroadcasts > 0 && (
                  <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadBroadcasts}
                  </span>
                )}
              </button>
            </div>
          </div>

          <ScrollArea className="h-60 bg-white">
            {activeItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-400">
                <Bell className="h-7 w-7 opacity-20" />
                <p className="text-xs">Nothing here yet</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {activeItems.map((notif: any, index: number) => {
                  const accent = typeAccent[notif.type] || typeAccent.general;
                  return (
                    <button
                      key={notif.id || notif._id || index}
                      type="button"
                      onClick={() => handleOpen(notif)}
                      className={`flex items-start gap-2.5 px-3 py-2.5 text-left w-full hover:brightness-95 transition-all border-l-[3px] ${accent}`}
                    >
                      <div className="mt-1 shrink-0">
                        {!notif.read ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 block" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200 block" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-[11px] font-bold line-clamp-1 ${!notif.read ? "text-gray-900" : "text-gray-500"}`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-gray-400 shrink-0">
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleDateString()
                              : "Now"}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                          {notif.message}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          <div className="px-3 py-2 border-t bg-gray-50 flex items-center justify-between gap-2">
            {viewAllHref ? (
              <Link
                href={viewAllHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#1A3F1C] hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
                View all
              </Link>
            ) : (
              <span />
            )}
            {notifications.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-[10px] h-7 text-red-600 hover:text-red-700 hover:bg-red-50 gap-1 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Clear all notifications?")) clearMutation.mutate();
                }}
                disabled={clearMutation.isPending}
              >
                <Trash2 className="h-3 w-3" />
                {clearMutation.isPending ? "Clearing..." : "Clear all"}
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <NotificationDetailModal
        notification={selectedNotification}
        open={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
      />
    </>
  );
}
