import React, { useState, useEffect } from "react";
import { Ticket, Resource } from "../types";
import { apiService } from "../services/api";
import { TicketCard } from "../components/ui/TicketCard";
import { Plus, Search, SlidersHorizontal, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [selectedResourceId, setSelectedResourceId] = useState("");
  const [category, setCategory] = useState("ELECTRICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsData, resourcesData] = await Promise.all([
        apiService.getTickets(),
        apiService.getResources()
      ]);
      setTickets(ticketsData);
      setResources(resourcesData);
      if (resourcesData.length > 0) {
        setSelectedResourceId(resourcesData[0].id);
        setLocation(resourcesData[0].location);
      }
    } catch (err) {
      console.error("Failed to load tickets data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResourceChange = (resId: string) => {
    setSelectedResourceId(resId);
    const selected = resources.find(r => r.id === resId);
    if (selected) {
      setLocation(selected.location);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !priority || !description || !location) {
      setError("ALL_FIELDS_REQUIRED");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      
      const newTicket = await apiService.createTicket({
        resourceId: selectedResourceId,
        category,
        priority: priority as any,
        location,
        description,
        reporterId: "tech@campus.hub", // technician identity fallback
      });

      // Broadcast system alert for high-priority tickets
      if (priority === "HIGH" || priority === "URGENT") {
        await apiService.createNotification({
          userId: "all",
          title: "FAULT_ALERT_EMERGENCY",
          message: `Priority fault [${category}] registered in ${location}: ${description}`,
          type: "ticket"
        });
      } else {
        await apiService.createNotification({
          userId: "all",
          title: "FAULT_REPORT_REGISTERED",
          message: `New incident reported in ${location}: ${description}`,
          type: "ticket"
        });
      }

      setTickets(prev => [newTicket, ...prev]);
      setShowModal(false);
      setDescription("");
    } catch (err: any) {
      setError(err.message || "TICKET_CREATION_FAILED");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 italic mb-2">FAULT_TICKET_LOG</h3>
          <p className="text-zinc-500 text-xs font-mono">Real-time infrastructure health monitoring and resolution tracking.</p>
        </div>

        <button 
          onClick={() => {
            setShowModal(true);
            setError("");
          }}
          className="flex items-center justify-center gap-2 bg-zinc-900 text-zinc-50 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 cursor-pointer"
        >
          <Plus size={16} />
          <span>INITIALIZE_TICKET</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white border border-zinc-200 p-4 sm:p-6 md:p-8">
        <div className="md:col-span-2 relative">
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase mb-2 block">Search_Records</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Query descriptions, categories or nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 pl-10 pr-4 py-3 text-xs font-mono outline-none focus:border-zinc-900 transition-all placeholder-zinc-300"
            />
            <Search className="absolute left-3.5 top-3.5 text-zinc-300" size={16} />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase mb-2 block">Filter_Attributes</label>
          <button className="w-full border border-zinc-200 px-4 py-3 text-xs font-mono flex items-center justify-between hover:border-zinc-900 transition-colors uppercase">
            <span>Show_All_Tickets</span>
            <SlidersHorizontal size={14} className="text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-24 bg-white border border-zinc-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">NO_FAULTS_FOUND</h3>
          <p className="text-[10px] font-mono text-zinc-300 uppercase">The campus infrastructure telemetry indicates normal status.</p>
        </div>
      )}

      {/* FAULT TICKET CREATION MODAL */}
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
                Fault_Diagnostic_Portal
              </div>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-6">INITIALIZE_FAULT_TICKET</h2>

              {error && (
                <div className="mb-6 p-3 bg-red-50 border-l-2 border-red-500 text-[10px] font-mono text-red-600 font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <form onSubmit={handleCreateTicket} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                    Associated_Resource_Node
                  </label>
                  <select
                    value={selectedResourceId}
                    onChange={(e) => handleResourceChange(e.target.value)}
                    className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                  >
                    <option value="">NO_SPECIFIC_NODE</option>
                    {resources.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                      Fault_Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all uppercase"
                    >
                      <option value="ELECTRICAL">ELECTRICAL</option>
                      <option value="MECHANICAL">MECHANICAL</option>
                      <option value="HVAC">HVAC</option>
                      <option value="SOFTWARE">SOFTWARE</option>
                      <option value="NETWORK">NETWORK</option>
                      <option value="PLUMBING">PLUMBING</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                      Priority_Level
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all uppercase"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="URGENT">URGENT</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                    Physical_Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Science Wing Block C Room 102"
                    className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase block">
                    Diagnostic_Description
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide precise details of fault symptoms..."
                    className="w-full bg-white border border-zinc-200 px-4 py-2.5 text-xs font-mono focus:border-zinc-900 outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-zinc-900 text-zinc-50 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-200 disabled:text-zinc-400"
                >
                  {submitting ? "INITIALIZING..." : "LOG_TICKET_DIAGNOSTICS"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
