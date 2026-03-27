'use client';

import { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  name: string;
  message: string;
  orderInfo: string;
  avatar?: ReactNode;
  rightAction?: ReactNode;
}

export function NotificationItem({
  name,
  message,
  orderInfo,
  avatar,
  rightAction,
}: NotificationItemProps) {
  return (
    <div className="bg-[#98EF9B] rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="flex-1">
        <h4 className="font-semibold text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">{orderInfo}</p>
      </div>
      <div className="flex items-center gap-2">
        {avatar && <div className="text-2xl">{avatar}</div>}
        {rightAction ? (
          rightAction
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="bg-foreground text-background hover:bg-foreground/90"
          >
            <Trash2 size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
