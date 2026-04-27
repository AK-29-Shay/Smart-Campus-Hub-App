import React from "react";
import { Ticket } from "../../types";
import { cn } from "../../lib/utils";
import { AlertTriangle, Clock, CheckCircle2, User } from "lucide-react";
import { motion } from "framer-motion";

const priorityColors: any = {
  LOW: "border-blue-200 bg-blue-50 text-blue-700",
  MEDIUM: "border-yellow-200 bg-yellow-50 text-yellow-700",
  HIGH: "border-orange-200 bg-orange-50 text-orange-700",
  URGENT: "border-red-200 bg-red-50 text-red-700"
};

const statusIcons: any = {
  OPEN: AlertTriangle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle2,
  CLOSED: CheckCircle2,
  REJECTED: AlertTriangle
};

export const TicketCard: React.FC<{ ticket: Ticket }> = ({ ticket }) => {
  const StatusIcon = statusIcons[ticket.status] || AlertTriangle;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-zinc-200 rounded-none p-6 group transition-all"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] border",
          priorityColors[ticket.priority].replace('bg-blue-50', 'bg-zinc-50').replace('bg-yellow-50', 'bg-zinc-50').replace('bg-orange-50', 'bg-zinc-50').replace('bg-red-50', 'bg-zinc-50')
        )}>
          {ticket.priority}_PRIORITY
        </div>
        <div className="text-[9px] font-mono font-bold text-zinc-300">
          LOG_IDX: {ticket.id.substring(0, 8)}
        </div>
      </div>

      <h3 className="font-black text-sm uppercase tracking-tight mb-2 group-hover:underline decoration-zinc-200 decoration-2 underline-offset-4">{ticket.category}</h3>
      <p className="text-[11px] text-zinc-500 mb-8 line-clamp-2 italic font-mono leading-relaxed">{ticket.description}</p>
      
      <div className="grid grid-cols-1 gap-2 mb-8">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-400 uppercase">
          <User size={12} className="text-zinc-300" />
          <span>ASSIGNED_TO: {ticket.assigneeId || 'NULL'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            ticket.status === 'OPEN' ? "bg-amber-500" : 
            ticket.status === 'IN_PROGRESS' ? "bg-blue-500" : 
            "bg-emerald-500"
          )} />
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900">
            {ticket.status}
          </span>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest border border-zinc-900 px-4 py-2 hover:bg-zinc-900 hover:text-zinc-50 transition-all">
          PROCESS
        </button>
      </div>
    </motion.div>
  );
}
