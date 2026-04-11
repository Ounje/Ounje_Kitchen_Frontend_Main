'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, CheckCircle, AlertCircle, Clock, Circle, DollarSign, Star } from "lucide-react";

interface NotificationItemProps {
  notification: any;
}

// Map notification type to icon + colours
const typeConfig: Record<string, { icon: any; iconBg: string; iconColor: string }> = {
  order:   { icon: Circle,       iconBg: 'bg-blue-100',   iconColor: 'text-blue-600' },
  user:    { icon: CheckCircle,  iconBg: 'bg-green-100',  iconColor: 'text-green-600' },
  system:  { icon: AlertCircle, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  payment: { icon: DollarSign,  iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  rating:  { icon: Star,        iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
  query:   { icon: Clock,       iconBg: 'bg-gray-100',   iconColor: 'text-gray-600' },
  general: { icon: Bell,        iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  broadcast: { icon: Bell,      iconBg: 'bg-indigo-100', iconColor: 'text-indigo-600' },
  promo_approval_request: { icon: AlertCircle, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  promo_approved:         { icon: CheckCircle, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
  promo_declined:         { icon: Circle,      iconBg: 'bg-red-100',   iconColor: 'text-red-600' },
};

export default function NotificationItem({ notification }: NotificationItemProps) {
  const initials = (notification.title || notification.message || '??').slice(0, 2).toUpperCase();
  const config = typeConfig[notification.type] || typeConfig.general;
  const IconComp = config.icon;
  const isUnread = !notification.read;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isUnread ? 'bg-white' : 'bg-gray-50/60'}`}>
      {/* Avatar with type icon overlay */}
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-[#1A3F1C]/10 text-[#1A3F1C] text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className={`absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full ${config.iconBg} ring-2 ring-white`}>
          <IconComp className={`h-2.5 w-2.5 ${config.iconColor}`} />
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <div className="flex items-center gap-1.5">
          {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
          <p className={`text-xs leading-snug line-clamp-1 ${isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-600'}`}>
            {notification.title}
          </p>
        </div>
        <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
        <p className="text-[10px] text-gray-400">
          {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : 'Just now'}
        </p>
      </div>
    </div>
  );
}
