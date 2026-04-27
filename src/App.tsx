import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Wrench, 
  Bell, 
  User,
  Search,
  Plus,
  ChevronRight,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";

import Catalogue from "./pages/Catalogue";
import Overview from "./pages/Overview";
import Bookings from "./pages/Bookings";
import Tickets from "./pages/Tickets";
import Notifications from "./pages/Notifications";

const SidebarItem: React.FC<{ icon: any, label: string, path: string, active: boolean }> = ({ icon: Icon, label, path, active }) => {
  return (
    <Link to={path}>
      <motion.div
        whileHover={{ x: 2 }}
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-none transition-all",
          active ? "bg-zinc-900 text-zinc-50" : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
        )}
        title={label}
      >
        <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
      </motion.div>
    </Link>
  );
};

function Sidebar() {
  const location = useLocation();
  
  const items = [
    { icon: LayoutDashboard, label: "Overview", path: "/" },
    { icon: BookOpen, label: "Catalogue", path: "/catalogue" },
    { icon: Calendar, label: "My Bookings", path: "/bookings" },
    { icon: Wrench, label: "Maintenance", path: "/tickets" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
  ];

  return (
    <aside className="w-20 border-r border-zinc-200 flex flex-col items-center py-8 bg-white h-screen sticky top-0 z-20">
      <Link to="/" className="w-10 h-10 bg-zinc-900 rounded-none flex items-center justify-center text-white font-black text-xl mb-12 italic tracking-tighter">
        S
      </Link>
      
      <nav className="flex flex-col gap-6 items-center flex-1">
        {items.map((item) => (
          <SidebarItem 
            key={item.path} 
            icon={item.icon}
            label={item.label}
            path={item.path}
            active={location.pathname === item.path} 
          />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-6 items-center">
        <div className="text-[10px] font-mono rotate-180 [writing-mode:vertical-lr] text-zinc-400 tracking-widest uppercase py-4 border-t border-zinc-100 italic">
          v1.0.4_CORE
        </div>
        <button className="text-zinc-400 hover:text-red-500 transition-colors p-3">
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}

function TopBar() {
  const { pathname } = useLocation();
  const getPageTitle = () => {
    switch(pathname) {
      case '/': return { main: 'SYSTEM', sub: 'CORE' };
      case '/catalogue': return { main: 'ASSET', sub: 'HUB' };
      case '/bookings': return { main: 'SCHED', sub: 'NET' };
      case '/tickets': return { main: 'FAULT', sub: 'LOG' };
      case '/notifications': return { main: 'VIBE', sub: 'FEED' };
      default: return { main: 'SYSTEM', sub: 'CORE' };
    }
  };

  const title = getPageTitle();

  return (
    <header className="px-12 pt-12 pb-8 flex justify-between items-start">
      <div>
        <h1 className="text-[100px] md:text-[120px] font-black leading-[0.8] tracking-tighter text-zinc-900 uppercase">
          {title.main}<br/><span className="text-zinc-300">{title.sub}</span>
        </h1>
        <p className="mt-6 text-[10px] font-mono text-zinc-400 uppercase tracking-[0.3em] font-bold">
          Smart Campus Operations Infrastructure / {title.main}.{title.sub}
        </p>
      </div>
      
      <div className="flex flex-col items-end gap-3 mt-4">
        <div className="flex items-center gap-2 group">
          <div className="relative">
            <input 
              type="text" 
              placeholder="GLOBAL_SEARCH" 
              className="bg-transparent border-b border-zinc-200 py-1 pr-8 text-[11px] font-mono focus:border-zinc-900 outline-none transition-all w-32 focus:w-48"
            />
            <Search size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="px-3 py-1 border border-zinc-900 text-[9px] font-black uppercase tracking-tighter bg-zinc-900 text-white">Status: Live</div>
          <div className="text-2xl font-light text-zinc-400 font-mono tracking-tighter">04.27.2026</div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-zinc-50">
        <Sidebar />
        <div className="flex-1 flex flex-col relative">
          <div className="absolute inset-0 industrial-grid pointer-events-none"></div>
          <TopBar />
          <main className="flex-1 relative z-10">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/notifications" element={<Notifications />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
