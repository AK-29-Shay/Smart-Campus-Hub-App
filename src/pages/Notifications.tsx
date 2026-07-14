import { useState, useEffect } from "react";
import { Notification } from "../types";
import { apiService } from "../services/api";
import { Bell, Check, Trash2, Clock, Info, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await apiService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await apiService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeIcon = (type: string) => {
    const t = (type || "").toLowerCase();
    switch (t) {
      case 'booking': 
      case 'approved':
        return CheckCircle2;
      case 'ticket': 
      case 'incident':
        return AlertCircle;
      default: return Info;
    }
  };

  const getTypeColor = (type: string) => {
    const t = (type || "").toLowerCase();
    switch (t) {
      case 'booking':
      case 'approved':
        return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case 'ticket':
      case 'incident':
        return "text-rose-500 bg-rose-50 border-rose-100";
      default:
        return "text-blue-500 bg-blue-50 border-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <Loader2 className="animate-spin text-zinc-300" size={32} strokeWidth={1} />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 sm:px-8 md:px-12 pb-12 max-w-full"
    >
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">SYSTEM_BROADCAST_LOG</h3>
        <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest bg-zinc-100 px-3 py-1 font-bold">
          Active_Alerts: {notifications.filter(n => !n.read).length}
        </span>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((n, i) => {
            const Icon = getTypeIcon(n.type);
            const colorClass = getTypeColor(n.type);
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={cn(
                  "flex items-start gap-4 sm:gap-8 p-4 sm:p-6 md:p-8 transition-all group cursor-pointer border border-zinc-100",
                  n.read ? "bg-zinc-50/50 opacity-60" : "bg-white hover:bg-zinc-50"
                )}
              >
                <div className={cn("w-10 h-10 flex items-center justify-center border", colorClass)}>
                  <Icon size={18} strokeWidth={2} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1 sm:gap-4 mb-2">
                    <h3 className={cn(
                      "text-sm font-black uppercase tracking-tight truncate",
                      !n.read && "group-hover:underline underline-offset-4 decoration-zinc-200"
                    )}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-300 font-bold tracking-tighter shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs font-mono tracking-tight leading-relaxed">
                    {n.message}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2 sm:ml-0 shrink-0">
                  {!n.read && (
                    <button onClick={() => markAsRead(n.id)} className="text-zinc-300 hover:text-emerald-600 transition-colors p-1" title="Mark as Read">
                      <Check size={18} strokeWidth={3} />
                    </button>
                  )}
                  <button onClick={() => removeNotification(n.id)} className="text-zinc-300 hover:text-red-500 transition-colors p-1" title="Delete">
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-24 border border-dashed border-zinc-200 bg-white">
          <Bell className="mx-auto text-zinc-200 mb-4 animate-pulse" size={40} strokeWidth={1} />
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">NO_SYSTEM_MESSAGES</h3>
          <p className="text-[10px] font-mono text-zinc-300 uppercase tracking-tight">The broadcast stream is currently empty.</p>
        </div>
      )}
    </motion.div>
  );
}
