import React, { useState, useEffect } from "react";
import { Booking, Resource } from "../types";
import { apiService } from "../services/api";
import { Calendar as CalendarIcon, Clock, MapPin, Search, Filter, Plus, ChevronRight, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [purpose, setPurpose] = useState("");
  const [attendees, setAttendees] = useState("10");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsData, resourcesData] = await Promise.all([
        apiService.getBookings(),
        apiService.getResources()
      ]);
      setBookings(bookingsData);
      setResources(resourcesData.filter(r => r.status === "ACTIVE"));
      if (resourcesData.length > 0) {
        setSelectedResourceId(resourcesData[0].id);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = () => {
    // Pre-populate times with some reasonable defaults
    const now = new Date();
    const inOneHour = new Date(now.getTime() + 3600000);
    const inThreeHours = new Date(now.getTime() + 3 * 3600000);
    
    // Format to YYYY-MM-DDTHH:MM
    const formatDateTimeLocal = (date: Date) => {
      const pad = (num: number) => String(num).padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    setStartTime(formatDateTimeLocal(inOneHour));
    setEndTime(formatDateTimeLocal(inThreeHours));
    setShowModal(true);
    setError("");
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResourceId || !purpose || !startTime || !endTime) {
      setError("ALL_FIELDS_REQUIRED");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("INVALID_TIME_SEQUENCE");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      const newBooking = await apiService.createBooking({
        resourceId: selectedResourceId,
        userId: "admin_01", // logged in user ID identifier
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        purpose,
        attendees: Number(attendees) || 1
      });

      // Fetch updated notifications / create a system notification for the booking
      await apiService.createNotification({
        userId: "all",
        title: "RESOURCE_ALLOCATED",
        message: `New booking "${purpose}" approved for Resource ID: ${selectedResourceId}`,
        type: "booking"
      });

      setBookings(prev => [newBooking, ...prev]);
      setShowModal(false);
      setPurpose("");
    } catch (err: any) {
      setError(err.message || "ALLOCATION_FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  const getResourceName = (id: string) => {
    const res = resources.find(r => r.id === id);
    return res ? res.name : `Resource #${id}`;
  };

  const getResourceLocation = (id: string) => {
    const res = resources.find(r => r.id === id);
    return res ? res.location : "Campus Main";
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-900 pb-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic mb-2">PERSONAL_ALLOCATION_LOG</h3>
          <p className="text-zinc-500 text-xs font-mono">Records of secured resource periods for active sessions</p>
        </div>

        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-zinc-900 text-zinc-50 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 cursor-pointer"
        >
          <Plus size={16} />
          <span>ALLOCATE_NEW</span>
        </button>
      </div>

      <div className="space-y-4">
        {bookings.map((booking, i) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white border border-zinc-200 rounded-none overflow-hidden hover:border-zinc-900 transition-all group flex flex-col md:flex-row"
          >
            <div className="w-full md:w-48 bg-zinc-50 flex flex-row md:flex-col items-center justify-between md:justify-center p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-100">
              <div className="flex items-center gap-3 md:flex-col md:gap-0">
                <CalendarIcon className="text-zinc-300 md:mb-4" size={24} strokeWidth={1} />
                <div className="md:text-center">
                  <p className="text-xl md:text-2xl font-black text-zinc-900 italic serif leading-none">
                    {new Date(booking.startTime).toLocaleDateString('en-US', { day: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                    {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short' })}
                  </p>
                </div>
              </div>
              <span className="md:hidden px-3 py-1 bg-zinc-900 text-white font-mono text-[9px] font-bold">
                {booking.id.substring(0, 6)}
              </span>
            </div>

            <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="text-sm font-black uppercase tracking-tight">{booking.purpose}</h3>
                  <span className={cn(
                    "px-3 py-0.5 text-[8px] font-black uppercase tracking-widest border-l-2",
                    booking.status === 'APPROVED' ? "text-emerald-600 border-emerald-600 bg-emerald-50/50" : 
                    booking.status === 'PENDING' ? "text-amber-500 border-amber-500 bg-amber-50/50" :
                    "text-red-500 border-red-500 bg-red-50/50"
                  )}>
                    {booking.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                    <MapPin size={12} className="text-zinc-300 shrink-0" />
                    <span className="truncate">{getResourceName(booking.resourceId)} // {getResourceLocation(booking.resourceId)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 uppercase">
                    <Clock size={12} className="text-zinc-300 shrink-0" />
                    <span>
                      {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })} - 
                      {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                <button className="text-[10px] font-black text-zinc-300 hover:text-zinc-900 transition-colors uppercase tracking-widest cursor-pointer">
                  REVOKE
                </button>
                <div className="w-px h-6 bg-zinc-100 hidden md:block"></div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all cursor-pointer">
                  INSPECT
                  <ChevronRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-24 border border-dashed border-zinc-200 bg-white">
          <CalendarIcon className="mx-auto text-zinc-200 mb-4 animate-pulse" size={40} strokeWidth={1} />
          <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-1">NO_ACTIVE_ALLOCATIONS</p>
          <p className="text-[10px] font-mono text-zinc-300 uppercase">Select assets from the catalogue to secure booking slots.</p>
        </div>
      )}

      {/* ALLOCATION MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-zinc-950 p-6 md:p-8 max-w-lg w-full relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-300 mb-6 border-b border-zinc-100 pb-2">
                Allocate_Resource_Node
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">SECURE_NEW_SESSION</h2>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500 text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateBooking} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                    Select_Asset_Node
                  </label>
                  <select
                    value={selectedResourceId}
                    onChange={(e) => setSelectedResourceId(e.target.value)}
                    className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                  >
                    {resources.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type} // {r.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                    Session_Purpose
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Advanced AI Seminar"
                    className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                      Attendees
                    </label>
                    <input
                      type="number"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                      Node_Security
                    </label>
                    <input
                      type="text"
                      disabled
                      value="LEVEL_02_SECURE"
                      className="w-full bg-zinc-50 border border-zinc-100 text-zinc-400 px-4 py-2.5 text-xs font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                      Start_Date_Time
                    </label>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                      End_Date_Time
                    </label>
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-zinc-900 text-zinc-50 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  {submitting ? "PROVISIONING..." : "COMMIT_PROVISION_REQUEST"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
