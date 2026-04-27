import { useState } from "react";
import { Notification } from "../types";
import { Bell, Check, Trash2, Clock, Info, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      userId: "u1",
      title: "Booking Approved",
      message: "Your request for Lecture Hall A on May 15 has been approved.",
      type: "booking",
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: "n2",
      userId: "u1",
      title: "Ticket Update",
      message: "Technician assigned to 'A/C Fault in Lab 4'.",
      type: "ticket",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: "n3",
      userId: "u1",
      title: "System Maintenance",
      message: "The hub will be offline for 30 minutes tonight at 11 PM.",
      type: "system",
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'booking': return CheckCircle2;
      case 'ticket': return AlertCircle;
      default: return Info;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-12 pb-12 max-w-full"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">SYSTEM_BROADCAST_LOG</h3>
        <button 
          className="text-[10px] font-mono font-black text-zinc-900 border-b border-zinc-900"
          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        >
          MARK_ALL_READ
        </button>
      </div>

      <div className="space-y-px bg-zinc-200 border border-zinc-200 shadow-xl shadow-zinc-900/5">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => {
            const Icon = getTypeIcon(n.type);
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={cn(
                  "flex items-start gap-8 p-8 transition-all group cursor-pointer",
                  n.read ? "bg-zinc-50/50 opacity-60" : "bg-white hover:bg-zinc-50"
                )}
              >
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-10 h-10 rounded-none flex items-center justify-center transition-all border",
                    n.read ? "text-zinc-300 border-zinc-100" : "bg-zinc-900 text-zinc-50 border-zinc-900"
                  )}>
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="text-[8px] font-mono font-black text-zinc-300">#{n.id.substring(0,4)}</span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      !n.read && "group-hover:underline underline-offset-4 decoration-zinc-200"
                    )}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-300 font-bold tracking-tighter">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono italic leading-relaxed max-w-3xl">
                    {n.message}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-zinc-300 hover:text-emerald-600 transition-colors">
                      <Check size={18} strokeWidth={3} />
                    </button>
                  )}
                  <button onClick={() => removeNotification(n.id)} className="text-zinc-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white">
            <p className="text-zinc-300 font-mono text-xs font-bold tracking-widest uppercase">No_Broadcast_Logs_Available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
