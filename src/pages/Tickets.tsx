import { useState } from "react";
import { Ticket } from "../types";
import { TicketCard } from "../components/ui/TicketCard";
import { Plus, Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Tickets() {
  const [loading] = useState(false);
  
  // Static mock for now
  const tickets: Ticket[] = [
    { 
      id: "TIC-1234", 
      resourceId: "1", 
      location: "Main Block", 
      category: "Electrical", 
      description: "Lights flickering in the back row of Lecture Hall A.", 
      priority: "MEDIUM", 
      status: "OPEN", 
      reporterId: "u1", 
      images: [], 
      createdAt: new Date().toISOString() 
    },
    { 
      id: "TIC-5678", 
      resourceId: "2", 
      location: "Tech Wing", 
      category: "Software", 
      description: "Visual Studio Code keeps crashing on workstation 15.", 
      priority: "HIGH", 
      status: "IN_PROGRESS", 
      reporterId: "u2", 
      assigneeId: "tech-1",
      images: [], 
      createdAt: new Date().toISOString() 
    },
  ];

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
      className="px-12 pb-12 max-w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic mb-2">FAULT_TICKET_LOG</h3>
          <p className="text-zinc-500 text-xs font-mono">Real-time infrastructure health monitoring and resolution tracking.</p>
        </div>

        <button className="flex items-center gap-2 bg-zinc-900 text-zinc-50 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10">
          <Plus size={16} />
          <span>INITIALIZE_TICKET</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-white border border-zinc-200 p-8">
        <div className="md:col-span-2 relative">
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase mb-2 block">Search_Records</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="ENTER_QUERY..."
              className="w-full pl-10 pr-4 py-3 border border-zinc-200 outline-none text-xs font-mono focus:border-zinc-900 bg-zinc-50/30"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase mb-2 block">State_Filter</label>
          <div className="flex border border-zinc-200 p-1">
            <button className="flex-1 py-2 text-[10px] font-black bg-zinc-900 text-zinc-50">ALL</button>
            <button className="flex-1 py-2 text-[10px] font-black text-zinc-400 hover:text-zinc-900">OPEN</button>
            <button className="flex-1 py-2 text-[10px] font-black text-zinc-400 hover:text-zinc-900">RESOLVED</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </motion.div>
  );
}
