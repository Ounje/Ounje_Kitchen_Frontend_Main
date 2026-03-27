"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationItem } from "./NotificationItem";
import { useNotifications } from "@/hooks/useNotifications";

export default function NotificationsList() {
  const { notifications, isLoading, isError } = useNotifications();

  return (
    <Card 
      className="border-none shadow-sm"
      style={{ backgroundColor: '#98ef9b' }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#1a3f1c]">
            Notifications/Alerts
          </h2>
          <Button
            size="sm"
            className="h-8 bg-[#1a3f1c] hover:bg-[#2a5f2c] text-white"
          >
            Show all
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3 pt-0">
        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-4 border-[#1a3f1c] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-sm text-red-600">
            Failed to load notifications
          </div>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No notifications available
          </div>
        )}

        {!isLoading && !isError && notifications.length > 0 && (
          <ScrollArea className="h-[350px]">
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}