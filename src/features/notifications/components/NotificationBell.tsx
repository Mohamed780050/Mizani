"use client";

import React, { useState, useEffect, useTransition } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell, Check, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { getNotificationsAction, markNotificationsReadAction } from "../actions/notification-actions";
import { ScrollArea } from "@/components/ui/scroll-area";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string | Date;
};

export function NotificationBell({ initialCount = 0 }: { initialCount?: number }) {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialCount);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      // Fetch latest when opened
      startTransition(async () => {
        const res = await getNotificationsAction();
        if (res.success && res.data) {
          setNotifications(res.data as Notification[]);
        }
      });
    }
  }, [open]);

  const handleMarkAsRead = async () => {
    startTransition(async () => {
      await markNotificationsReadAction();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BUDGET_ALERT":
        return <AlertTriangle className="size-4 text-amber-500" />;
      case "GOAL_REACHED":
        return <Check className="size-4 text-emerald-500" />;
      case "RECURRING_DEDUCTED":
        return <Info className="size-4 text-blue-500" />;
      case "LIMIT_WARNING":
        return <AlertCircle className="size-4 text-rose-500" />;
      default:
        return <Info className="size-4 text-emerald-500" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary/50 rounded-full">
          <Bell className="size-6" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-2.5 bg-rose-500 rounded-full border-2 border-[#f7f9ff] dark:border-[#080b0e]" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 md:w-96 p-0 bg-[#f7f9ff] dark:bg-[#080b0e] border-border/50 shadow-2xl rounded-2xl overflow-hidden"
      >
        <div className="p-4 bg-card border-b border-border/50 flex items-center justify-between">
           <h3 className="font-bold tracking-tight">Sanctuary Alerts</h3>
           {unreadCount > 0 && (
             <button 
               onClick={handleMarkAsRead}
               disabled={isPending}
               className="text-xs text-primary font-semibold hover:underline"
             >
               Mark all read
             </button>
           )}
        </div>
        
        <ScrollArea className="h-80">
           {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center">
                 <Bell className="size-8 text-muted-foreground/30 mb-3" />
                 <p className="text-sm font-medium text-muted-foreground">No alerts actively monitored in your sanctuary.</p>
              </div>
           ) : (
             <div className="divide-y divide-border/30">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 transition-colors hover:bg-secondary/20 flex gap-4 ${n.isRead ? 'opacity-70' : 'bg-primary/5'}`}>
                     <div className="mt-1 flex-shrink-0">
                       <div className="size-8 rounded-full bg-card border border-border shadow-sm flex flex-col items-center justify-center">
                         {getIcon(n.type)}
                       </div>
                     </div>
                     <div className="space-y-1">
                        <h4 className="text-sm font-bold leading-tight">{n.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                        <p className="text-[10px] text-muted-foreground font-mono uppercase font-bold pt-1">
                          {new Date(n.createdAt).toLocaleDateString()}
                        </p>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
