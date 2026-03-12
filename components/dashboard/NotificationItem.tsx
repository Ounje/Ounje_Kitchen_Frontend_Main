"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Circle, CheckCircle, AlertCircle, Clock } from "lucide-react";
import type { Notification } from "@/types";

interface NotificationItemProps {
  notification: Notification;
}

const statusIcons = {
  order: <Circle className="h-5 w-5 text-blue-500 fill-blue-500" />,
  user: <CheckCircle className="h-5 w-5 text-green-600" />,
  system: <AlertCircle className="h-5 w-5 text-yellow-500" />,
  payment: <Circle className="h-5 w-5 text-purple-500 fill-purple-500" />,
  rating: <Circle className="h-5 w-5 text-orange-500 fill-orange-500" />,
  query: <Clock className="h-5 w-5 text-gray-600" />,
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  // Extract user name from title or message
  const displayText = notification.title || notification.message;
  
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/50 transition-colors">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-gray-300 text-gray-700 text-xs">
          {displayText.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm text-gray-900 font-semibold">
          {notification.title}
        </p>
        <p className="text-xs text-gray-600">
          {notification.message}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0 rounded-full"
      >
        {statusIcons[notification.type]}
      </Button>
    </div>
  );
}
