import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Users
} from "lucide-react";
import { cn } from "../lib/utils";

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-none relative">
      <div className="flex justify-between items-start mb-8">
        <div className={cn("p-2 pb-1 border-b-2", color.replace('bg-', 'border-'))}>
          <Icon size={18} className="text-zinc-900" />
        </div>
        {trend && (
          <div className="text-[10px] text-emerald-600 font-black font-mono tracking-tighter">
            {trend} INC
          </div>
        )}
      </div>
      <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1 font-mono">{title}</p>
      <h3 className="text-4xl font-black tracking-tighter text-zinc-900 italic serif">{value}</h3>
      <div className="absolute top-2 right-2 flex gap-0.5 opacity-20">
        <div className="w-0.5 h-0.5 bg-zinc-900"></div>
        <div className="w-0.5 h-0.5 bg-zinc-900"></div>
      </div>
    </div>
  );
}

export default function Overview() {
  const stats = [
    { title: "ACTIVE_SESSIONS", value: "12", icon: Calendar, trend: "+2", color: "bg-zinc-900" },
    { title: "NODE_DENSITY", value: "84%", icon: TrendingUp, trend: "+5%", color: "bg-zinc-900" },
    { title: "PENDING_QUEUES", value: "03", icon: Clock, color: "bg-zinc-900" },
    { title: "OPEN_FAULTS", value: "02", icon: AlertCircle, color: "bg-zinc-900" },
  ];

  const recentActivity = [
    { type: 'booking', title: 'Main Hall', status: 'approved', time: '10:22:04', user: 'Prof. Miller' },
    { type: 'incident', title: 'A/C Fault in Lab 4', status: 'open', time: '10:14:58', user: 'Tech Team' },
    { type: 'booking', title: 'Meeting Room 2', status: 'pending', time: '09:45:12', user: 'John Doe' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-12 pb-12 max-w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">SYSTEM_ACTIVITY_LOG</h3>
            <button className="text-[10px] font-mono font-black text-zinc-900 border-b border-zinc-900">EXPORT_CSV</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-6 bg-white p-6 border border-zinc-100 hover:border-zinc-900 transition-all group overflow-hidden">
                <div className="font-mono text-[10px] text-zinc-300 shrink-0">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tight">{activity.title}</p>
                  <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">{activity.user} / ID:9482</p>
                </div>
                <div className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-tighter border-l-2",
                  activity.status === 'approved' ? "text-emerald-600 border-emerald-600" : 
                  activity.status === 'pending' ? "text-amber-500 border-amber-500" :
                  "text-red-500 border-red-500"
                )}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-8 pb-4 border-b border-zinc-200">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">NODE_ALLOCATION</h3>
          </div>
          <div className="bg-white border border-zinc-200 p-8">
            <div className="space-y-8">
              {[
                { name: 'CENTRAL_NODE_A', usage: 92 },
                { name: 'LAB_COMP_GRID_4', usage: 78 },
                { name: 'GUEST_PROTO_V3', usage: 65 },
              ].map((loc, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">{loc.name}</span>
                    <span className="text-[14px] font-black font-mono tracking-tighter">{loc.usage}%</span>
                  </div>
                  <div className="h-0.5 bg-zinc-100 w-full relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${loc.usage}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className="h-full bg-zinc-900"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 h-20 bg-zinc-50 border border-zinc-100 flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 industrial-grid opacity-10"></div>
               <span className="text-[9px] font-mono font-black text-zinc-300">TELEMETRY_STREAM_CONNECTED</span>
            </div>
            
            <button className="w-full mt-8 py-3 bg-zinc-900 text-zinc-50 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 rounded-none">
              <CheckCircle2 size={12} />
              ALLOCATE_RESOURCES
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Missing imports in stats component
import { Building2, Monitor } from "lucide-react";
