import { motion } from "framer-motion";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  MapPin,
  Users,
  Building2,
  Monitor
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../AuthContext";

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
  const { user, role } = useAuth();

  const getStats = () => {
    switch(role) {
      case 'ADMIN':
        return [
          { title: "ACTIVE_SESSIONS", value: "124", icon: Calendar, trend: "+12", color: "bg-zinc-900" },
          { title: "SYSTEM_UTIL", value: "84%", icon: TrendingUp, trend: "+5%", color: "bg-zinc-900" },
          { title: "PENDING_QUEUES", value: "08", icon: Clock, color: "bg-zinc-900" },
          { title: "OPEN_FAULTS", value: "03", icon: AlertCircle, color: "bg-zinc-900" },
        ];
      case 'TECHNICIAN':
        return [
          { title: "ASSIGNED_TASKS", value: "05", icon: Wrench, color: "bg-zinc-900" },
          { title: "OPEN_INCIDENTS", value: "03", icon: AlertCircle, color: "bg-zinc-900" },
          { title: "AVG_FIX_TIME", value: "42m", icon: Clock, trend: "-10%", color: "bg-zinc-900" },
          { title: "SYSTEM_UPTIME", value: "99.9%", icon: TrendingUp, color: "bg-zinc-900" },
        ];
      default: // USER
        return [
          { title: "MY_ACTIVE_SESSIONS", value: "02", icon: Calendar, color: "bg-zinc-900" },
          { title: "SECURED_CREDITS", value: "750", icon: TrendingUp, trend: "+50", color: "bg-zinc-900" },
          { title: "PENDING_APPROVAL", value: "01", icon: Clock, color: "bg-zinc-900" },
          { title: "UNREAD_COMMS", value: "04", icon: Bell, color: "bg-zinc-900" },
        ];
    }
  };

  const getRecentActivity = () => {
    if (role === 'USER') {
      return [
        { type: 'booking', title: 'Library Study Pod B', status: 'approved', time: '10:22:04', user: 'Self' },
        { type: 'system', title: 'Booking Reminder', status: 'pending', time: '09:00:00', user: 'System' },
      ];
    }
    return [
      { type: 'booking', title: 'Main Hall', status: 'approved', time: '10:22:04', user: 'Prof. Miller' },
      { type: 'incident', title: 'A/C Fault in Lab 4', status: 'open', time: '10:14:58', user: 'Tech Team' },
      { type: 'booking', title: 'Meeting Room 2', status: 'pending', time: '09:45:12', user: 'John Doe' },
    ];
  };

  const stats = getStats();
  const recentActivity = getRecentActivity();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-4 sm:px-8 md:px-12 pb-12 max-w-full"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">
              {role === 'USER' ? 'PERSONAL_SESSION_LOG' : 'SYSTEM_ACTIVITY_LOG'}
            </h3>
            <button className="text-[10px] font-mono font-black text-zinc-900 border-b border-zinc-900 uppercase">
              {role === 'USER' ? 'VIEW_HISTORY' : 'EXPORT_CSV'}
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-white p-4 sm:p-6 border border-zinc-100 hover:border-zinc-900 transition-all group overflow-hidden">
                <div className="font-mono text-[10px] text-zinc-300 shrink-0">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm uppercase tracking-tight">{activity.title}</p>
                  <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">{activity.user} / ID:9482</p>
                </div>
                <div className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-tighter border-l-2 w-fit",
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
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">
              {role === 'USER' ? 'UPCOMING_SCHEDULE' : 'NODE_ALLOCATION'}
            </h3>
          </div>
          
          {role === 'USER' ? (
            <div className="space-y-6">
              {[
                { time: '14:00', loc: 'STUDY_POD_B', task: 'RESEARCH_BLOCK' },
                { time: '16:30', loc: 'LAB_GRID_4', task: 'PRACTICAL_EXAM' },
              ].map((item, i) => (
                <div key={i} className="border-l-4 border-zinc-900 pl-4 py-1">
                  <p className="text-[10px] font-mono font-black text-zinc-300">{item.time}</p>
                  <p className="font-black uppercase tracking-tight text-sm">{item.loc}</p>
                  <p className="text-[9px] font-mono text-zinc-400 uppercase">{item.task}</p>
                </div>
              ))}
              <div className="pt-6 border-t border-zinc-100 mt-8">
                <button className="w-full py-4 bg-zinc-900 text-zinc-50 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all">
                  NEW_BOOKING_REQUEST
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 p-4 sm:p-8">
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
                {role === 'ADMIN' ? 'OPTIMIZE_RESOURCES' : 'UPDATE_FAULT_LOGS'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Missing imports in stats component
import { Bell, Wrench } from "lucide-react";
