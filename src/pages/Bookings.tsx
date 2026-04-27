import { useState } from "react";
import { Booking } from "../types";
import { Calendar as CalendarIcon, Clock, MapPin, Search, Filter, Plus, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatDate } from "../lib/utils";

export default function Bookings() {
  const [loading] = useState(false);
  
  const bookings: Booking[] = [
    {
      id: "B-101",
      resourceId: "1",
      userId: "u1",
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 93600000).toISOString(),
      purpose: "Advanced Networking Lecture",
      attendees: 150,
      status: "APPROVED",
      createdAt: new Date().toISOString()
    },
    {
      id: "B-102",
      resourceId: "2",
      userId: "u1",
      startTime: new Date(Date.now() + 172800000).toISOString(),
      endTime: new Date(Date.now() + 180000000).toISOString(),
      purpose: "Self-study session",
      attendees: 5,
      status: "PENDING",
      createdAt: new Date().toISOString()
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-12 pb-12 max-w-full"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-zinc-900 pb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic mb-2">PERSONAL_ALLOCATION_LOG</h3>
          <p className="text-zinc-500 text-xs font-mono">Records of secured resource periods for user: admin_01</p>
        </div>

        <button className="flex items-center gap-2 bg-zinc-900 text-zinc-50 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10">
          <Plus size={16} />
          <span>ALLOCATE_NEW</span>
        </button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-zinc-200 rounded-none overflow-hidden hover:border-zinc-900 transition-all group flex flex-col md:flex-row"
          >
            <div className="w-full md:w-48 bg-zinc-50 flex flex-col items-center justify-center p-8 border-r border-zinc-100">
              <CalendarIcon className="text-zinc-300 mb-4" size={24} strokeWidth={1} />
              <p className="text-2xl font-black text-zinc-900 italic serif leading-none">
                {new Date(booking.startTime).toLocaleDateString('en-US', { day: '2-digit' })}
              </p>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short' })}
              </p>
            </div>

            <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-tight">{booking.purpose}</h3>
                  <span className={cn(
                    "px-3 py-0.5 text-[8px] font-black uppercase tracking-widest border-l-2",
                    booking.status === 'APPROVED' ? "text-emerald-600 border-emerald-600" : 
                    booking.status === 'PENDING' ? "text-amber-500 border-amber-500" :
                    "text-red-500 border-red-500"
                  )}>
                    {booking.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wide">
                  <div className="flex items-center gap-2">
                    <Clock size={12} strokeWidth={2.5} />
                    <span>{new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={12} strokeWidth={2.5} />
                    <span>RES_ID: {booking.resourceId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <button className="text-[10px] font-black text-zinc-300 hover:text-zinc-900 transition-colors uppercase tracking-widest">
                  REVOKE
                </button>
                <div className="w-px h-6 bg-zinc-100"></div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                  INSPECT
                  <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-3xl">
          <p className="text-gray-400 font-medium italic">You haven't made any bookings yet.</p>
          <button className="mt-4 text-black font-bold underline underline-offset-4">Browse Catalogue</button>
        </div>
      )}
    </motion.div>
  );
}
