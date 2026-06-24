"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronRight, Trash2 } from "lucide-react";
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

// Notification type → accent colour
const typeAccent: Record<string, string> = {
  promo_approval_request: "border-l-amber-400  bg-amber-50",
  promo_approved: "border-l-green-400  bg-green-50",
  promo_declined: "border-l-red-400    bg-red-50",
  promo_approval_processed: "border-l-gray-300   bg-gray-50",
  order_update: "border-l-blue-400   bg-blue-50",
  general: "border-l-indigo-300 bg-white",
  broadcast: "border-l-indigo-300 bg-white",
};

export function NotificationBell({ className, portal }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Register service worker and subscribe to web push after login
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
    staleTime: 15000, // Reuse notification data for 15 seconds
  });

  const clearMutation = useMutation({
    mutationFn: () => notificationService.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setOpen(false);
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  const handleOpen = (notif: any) => {
    setSelectedNotification(notif);
    setOpen(false);
  };

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
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>

        {/* Popover must have an explicit solid background */}
        <PopoverContent
          className="w-[340px] p-0 shadow-xl border border-gray-200 bg-white rounded-xl overflow-hidden"
          align="end"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1A3F1C]">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-white/80" />
              <h4 className="text-sm font-semibold text-white">Notifications</h4>
            </div>
            {unreadCount > 0 ? (
              <span className="text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            ) : (
              <span className="text-[10px] text-white/60">All caught up</span>
            )}
          </div>

          <ScrollArea className="h-[320px] bg-white">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3 text-gray-400">
                <Bell className="h-8 w-8 opacity-20" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {notifications.map((notif: any, index: number) => {
                  const accent = typeAccent[notif.type] || typeAccent.general;
                  return (
                    <button
                      key={notif.id || notif._id || index}
                      onClick={() => handleOpen(notif)}
                      className={`flex items-start gap-3 p-3.5 text-left w-full hover:brightness-95 transition-all border-l-[3px] ${accent}`}
                    >
                      {/* Unread dot */}
                      <div className="mt-1 shrink-0">
                        {!notif.read ? (
                          <span className="w-2 h-2 rounded-full bg-blue-500 block" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-gray-200 block" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span
                            className={`text-xs font-bold leading-snug line-clamp-1 ${!notif.read ? "text-gray-900" : "text-gray-600"}`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[9px] text-gray-400 shrink-0">
                            {notif.createdAt
                              ? new Date(notif.createdAt).toLocaleDateString()
                              : "Now"}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mt-0.5">
                          {notif.message}
                        </p>
                        {notif.type === "promo_approval_request" && !notif.read && (
                          <span className="inline-block mt-1 text-[9px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                            ⚡ Needs Approval
                          </span>
                        )}
                        {notif.type === "promo_approval_processed" && (
                          <span className="inline-block mt-1 text-[9px] bg-gray-400 text-white px-1.5 py-0.5 rounded-full font-semibold">
                            ✓ Processed
                          </span>
                        )}
                        {notif.type === "promo_approved" && (
                          <span className="inline-block mt-1 text-[9px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                            ✓ Approved
                          </span>
                        )}
                        {notif.type === "promo_declined" && (
                          <span className="inline-block mt-1 text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                            ✗ Declined
                          </span>
                        )}
                      </div>

                      <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0 mt-1" />
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer - Clear All */}
          {notifications.length > 0 && (
            <div className="p-2 border-t bg-gray-50 flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to clear all notifications?")) {
                    clearMutation.mutate();
                  }
                }}
                disabled={clearMutation.isPending}
              >
                <Trash2 className="h-3 w-3" />
                {clearMutation.isPending ? "Clearing..." : "Clear All"}
              </Button>
            </div>
          )}
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
