"use client";

import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/lib/api/services/notification.service";

export function useNotifications() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["notifications_widget"],
    queryFn: async () => {
      const res: any = await notificationService.getAllNotifications();
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
    refetchInterval: 10000, // Poll every 10 seconds
  });

  return {
    notifications: data || [],
    isLoading,
    isError: !!error,
    refresh: refetch,
  };
}
