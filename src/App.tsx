import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
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
  LogOut,
  ShieldCheck,
  Settings,
  Sun,
  Moon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "./lib/utils";
import { AuthProvider, useAuth } from "./AuthContext";

import Catalogue from "./pages/Catalogue";
import Overview from "./pages/Overview";
import Bookings from "./pages/Bookings";
import Tickets from "./pages/Tickets";
import Notifications from "./pages/Notifications";
import { UserRole } from "./types";

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
  const { role, logout } = useAuth();
  
  const allItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/", roles: ["USER", "ADMIN", "TECHNICIAN"] },
    { icon: BookOpen, label: "Catalogue", path: "/catalogue", roles: ["USER", "ADMIN", "TECHNICIAN"] },
    { icon: Calendar, label: "My Bookings", path: "/bookings", roles: ["USER", "ADMIN", "TECHNICIAN"] }, // allow admin/tech to see bookings log too
    { icon: Wrench, label: "Maintenance", path: "/tickets", roles: ["ADMIN", "TECHNICIAN"] },
    { icon: Bell, label: "Notifications", path: "/notifications", roles: ["USER", "ADMIN", "TECHNICIAN"] },
  ];

  const items = allItems.filter(item => item.roles.includes(role || ""));

  return (
    <aside className="hidden md:flex w-20 border-r border-zinc-200 flex-col items-center py-8 bg-white h-screen sticky top-0 z-20">
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
        <div className="text-[10px] font-mono rotate-180 [writing-mode:vertical-lr] text-zinc-400 tracking-widest uppercase py-4 border-t border-zinc-100 italic font-bold">
          v1.1.0_{role || 'GUEST'}
        </div>
        <button 
          onClick={logout}
          className="text-zinc-400 hover:text-red-500 transition-colors p-3 cursor-pointer"
        >
          <LogOut size={20} />
        </button>
      </div>
    </aside>
  );
}

function BottomNav() {
  const location = useLocation();
  const { role, logout } = useAuth();

  const allItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/", roles: ["USER", "ADMIN", "TECHNICIAN"] },
    { icon: BookOpen, label: "Catalogue", path: "/catalogue", roles: ["USER", "ADMIN", "TECHNICIAN"] },
    { icon: Calendar, label: "Bookings", path: "/bookings", roles: ["USER", "ADMIN", "TECHNICIAN"] },
    { icon: Wrench, label: "Tickets", path: "/tickets", roles: ["ADMIN", "TECHNICIAN"] },
    { icon: Bell, label: "Alerts", path: "/notifications", roles: ["USER", "ADMIN", "TECHNICIAN"] },
  ];

  const items = allItems.filter(item => item.roles.includes(role || ""));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200 z-50 flex justify-around items-center px-2 shadow-lg">
      {items.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path} className="flex-1 py-1 flex flex-col items-center justify-center">
            <div className={cn(
              "p-2 rounded-none transition-all flex flex-col items-center justify-center",
              active ? "text-zinc-900 font-bold" : "text-zinc-400"
            )}>
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[8px] font-mono tracking-tighter mt-1 font-bold uppercase">{item.label}</span>
            </div>
          </Link>
        );
      })}
      <button 
        onClick={logout}
        className="flex-1 py-1 flex flex-col items-center justify-center text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
        title="Logout"
      >
        <LogOut size={18} strokeWidth={1.5} />
        <span className="text-[8px] font-mono tracking-tighter mt-1 font-bold uppercase">LOGOUT</span>
      </button>
    </nav>
  );
}

function RoleGate({ children, roles }: { children: React.ReactNode, roles: UserRole[] }) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(role as UserRole)) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function Login() {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError("CREDENTIALS_REQUIRED");
      return;
    }

    if (cleanEmail === "admin@campus.hub" && cleanPassword === "admin123") {
      login("ADMIN");
    } else if ((cleanEmail === "tech@campus.hub" || cleanEmail === "technician@campus.hub") && cleanPassword === "tech123") {
      login("TECHNICIAN");
    } else if (cleanEmail === "user@campus.hub" && cleanPassword === "user123") {
      login("USER");
    } else if (cleanEmail.includes("@") && cleanPassword.length >= 4) {
      login("USER");
    } else {
      setError("INVALID_AUTH_CREDENTIALS");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSubmitting(true);
      setError("");
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "GOOGLE_AUTH_FAILED_OR_BLOCKED");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (role: "ADMIN" | "TECHNICIAN" | "USER") => {
    if (role === "ADMIN") {
      setEmail("admin@campus.hub");
      setPassword("admin123");
    } else if (role === "TECHNICIAN") {
      setEmail("tech@campus.hub");
      setPassword("tech123");
    } else {
      setEmail("user@campus.hub");
      setPassword("user123");
    }
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 relative">
      <div className="absolute inset-0 industrial-grid pointer-events-none"></div>
      <div className="bg-white border border-zinc-200 p-8 sm:p-12 max-w-md w-full relative z-10 shadow-xl shadow-zinc-900/5">
        <div className="w-12 h-12 bg-zinc-900 flex items-center justify-center text-white font-black text-2xl italic mb-10">S</div>
        <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">ACCESS_PORTAL</h1>
        <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-8 border-b border-zinc-100 pb-4">
          Smart Campus Operations / Secure Authentication
        </p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500 text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider">
            {error}
          </div>
        )}

        {/* GOOGLE SIGN IN BUTTON */}
        <button
          type="button"
          disabled={submitting}
          onClick={handleGoogleLogin}
          className="w-full border border-zinc-900 hover:bg-zinc-900 hover:text-zinc-50 bg-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm mb-6 disabled:bg-zinc-100 disabled:text-zinc-400"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.5-.1.1.9 2.5 1.7h.03v3.13h4.94c2.88-2.66 4.54-6.58 4.54-11.23z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.86-3c-1.08.72-2.45 1.16-4.1 1.16-3.15 0-5.83-2.13-6.78-5.01H.22v3.1C2.2 21.2 6.8 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.22 14.25c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3V6.55H.22C-.23 8.35-.48 10.13-.48 12s.25 3.65.7 5.45l4.5-3.5H5.22z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 6.8 0 2.2 2.8.22 6.55l4.5 3.5c.95-2.88 3.63-5.01 6.78-5.01z"
            />
          </svg>
          <span>{submitting ? "CONNECTING..." : "CONTINUE_WITH_GOOGLE"}</span>
        </button>

        <div className="relative my-6 text-center">
          <span className="absolute inset-x-0 top-1/2 border-b border-zinc-100"></span>
          <span className="relative bg-white px-4 text-[8px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
            OR_SECURE_KEY
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
              EMAIL_ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@campus.hub"
              className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
              SECURE_PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-zinc-900 text-zinc-50 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 cursor-pointer"
          >
            VERIFY_AND_LAUNCH
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-zinc-100">
          <p className="text-[10px] font-mono font-black text-zinc-300 uppercase tracking-widest mb-4">
            Secured_Hardcoded_Keys
          </p>
          <div className="space-y-2">
            {[
              { label: "ADMIN_NODE", role: "ADMIN" as const, email: "admin@campus.hub", pass: "admin123" },
              { label: "TECH_NODE", role: "TECHNICIAN" as const, email: "tech@campus.hub", pass: "tech123" },
              { label: "USER_NODE", role: "USER" as const, email: "user@campus.hub", pass: "user123" },
            ].map((item) => (
              <div
                key={item.role}
                onClick={() => handleQuickFill(item.role)}
                className="p-3 border border-zinc-100 hover:border-zinc-300 cursor-pointer transition-all flex items-center justify-between group bg-zinc-50/50"
              >
                <div>
                  <p className="text-[11px] font-black text-zinc-800 group-hover:text-zinc-900 transition-colors uppercase">
                    {item.label}
                  </p>
                  <p className="text-[9px] font-mono text-zinc-400">
                    {item.email} / {item.pass}
                  </p>
                </div>
                <span className="text-[9px] font-mono font-bold text-zinc-300 group-hover:text-zinc-900 border border-transparent group-hover:border-zinc-200 px-2 py-0.5 transition-all">
                  LOAD
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  const { pathname } = useLocation();
  const { user, updateUserRoleInDb, theme, toggleTheme } = useAuth();
  const [timeStr, setTimeStr] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, "0");
      const day = pad(now.getDate());
      const month = pad(now.getMonth() + 1);
      const year = now.getFullYear();
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      setTimeStr(`${day}.${month}.${year} | ${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
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
    <header className="px-4 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-12 pb-4 md:pb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4">
      <div>
        <h1 className="text-[48px] sm:text-[72px] md:text-[100px] lg:text-[120px] font-black leading-[0.8] tracking-tighter text-zinc-900 uppercase">
          {title.main}<br/><span className="text-zinc-300">{title.sub}</span>
        </h1>
        <p className="mt-3 md:mt-6 text-[9px] sm:text-[10px] font-mono text-zinc-400 uppercase tracking-[0.3em] font-bold">
          Smart Campus Operations Infrastructure / {title.main}.{title.sub} / AUTH:{user?.role || 'GUEST'}
        </p>
      </div>
      
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-4 md:gap-3 border-t border-zinc-100 md:border-none pt-4 md:pt-0 mt-2 md:mt-0">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-black uppercase text-zinc-900">{user?.displayName}</span>
            <span className="text-[9px] font-mono text-zinc-400">{user?.email}</span>
          </div>
          <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center border border-zinc-200">
            <User size={18} className="text-zinc-400" />
          </div>
        </div>
        <div className="flex flex-col md:items-end gap-2 md:gap-1.5">
          <div className="flex items-center gap-2">
            <div className="px-2.5 py-0.5 border border-zinc-900 text-[9px] font-black uppercase tracking-tighter bg-zinc-900 text-white">Security: High</div>

            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="px-2 py-1 border border-zinc-300 hover:border-zinc-900 bg-white text-zinc-900 text-[9px] font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer uppercase h-[21px]"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            >
              {theme === "dark" ? (
                <>
                  <Sun size={10} strokeWidth={2.5} />
                  <span>LIGHT</span>
                </>
              ) : (
                <>
                  <Moon size={10} strokeWidth={2.5} />
                  <span>DARK</span>
                </>
              )}
            </button>
          </div>
          <div className="text-sm md:text-md font-mono font-black text-zinc-500 tracking-tighter">{timeStr}</div>
        </div>
      </div>
    </header>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col relative pb-20 md:pb-0">
        <div className="absolute inset-0 industrial-grid pointer-events-none"></div>
        <TopBar />
        <main className="flex-1 relative z-10">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout><Overview /></MainLayout>} />
          <Route path="/catalogue" element={<MainLayout><Catalogue /></MainLayout>} />
          
          {/* USER Routes */}
          <Route path="/bookings" element={
            <RoleGate roles={["USER", "ADMIN", "TECHNICIAN"]}>
              <MainLayout><Bookings /></MainLayout>
            </RoleGate>
          } />
          
          {/* ADMIN & TECHNICIAN Routes */}
          <Route path="/tickets" element={
            <RoleGate roles={["ADMIN", "TECHNICIAN"]}>
              <MainLayout><Tickets /></MainLayout>
            </RoleGate>
          } />
          
          <Route path="/notifications" element={<MainLayout><Notifications /></MainLayout>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
