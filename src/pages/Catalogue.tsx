import { useState, useEffect } from "react";
import { Resource, ResourceType } from "../types";
import { apiService } from "../services/api";
import { ResourceCard } from "../components/ui/ResourceCard";
import { Filter, Grid, List as ListIcon, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Catalogue() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<ResourceType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    apiService.getResources()
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filtered = resources.filter(r => {
    const matchesType = typeFilter === "ALL" || r.type === typeFilter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = r.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesType && matchesSearch && matchesLocation;
  });

  const filterOptions = [
    { value: "ALL", label: "ALL_ASSETS" },
    { value: "LECTURE_HALL", label: "LECTURE_HALLS" },
    { value: "LAB", label: "LABORATORIES" },
    { value: "MEETING_ROOM", label: "MEETING_ROOMS" },
    { value: "EQUIPMENT", label: "EQUIPMENT" },
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
      className="px-12 pb-12 max-w-full overflow-x-hidden"
    >
      {/* Filtering Interface */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 border-t border-b border-zinc-200 py-8">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase">Filter_by_Type</label>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value as any)}
                className={`px-3 py-1.5 text-[10px] font-mono font-bold transition-all border ${
                  typeFilter === opt.value 
                    ? "bg-zinc-900 text-zinc-50 border-zinc-900" 
                    : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase">Search_Asset_Name</label>
          <div className="relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ENTER_NAME..."
              className="w-full bg-white border border-zinc-200 px-4 py-2 text-xs font-mono focus:border-zinc-900 outline-none"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-mono font-bold text-zinc-400 tracking-widest uppercase">Filter_by_Location</label>
          <div className="relative">
            <input 
              type="text" 
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="ENTER_LOCATION..."
              className="w-full bg-white border border-zinc-200 px-4 py-2 text-xs font-mono focus:border-zinc-900 outline-none"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 text-[10px] text-zinc-400 font-mono tracking-[0.2em] font-bold">
        <span>RES_COUNT: [{filtered.length}/{resources.length}]</span>
        <div className="flex items-center gap-4">
          <span>SORT: ALPHA_ASC</span>
          <div className="w-px h-4 bg-zinc-200"></div>
          <div className="flex items-center gap-2">
            <button className="p-1 text-zinc-900 font-bold border-b border-zinc-900"><Grid size={14} /></button>
            <button className="p-1 opacity-20 hover:opacity-100 transition-opacity"><ListIcon size={14} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-zinc-200 bg-white">
          <p className="text-zinc-300 font-mono text-xs font-bold tracking-widest uppercase">No_Asset_Records_Matches_Criteria</p>
          <button 
            onClick={() => { setSearchQuery(""); setLocationFilter(""); setTypeFilter("ALL"); }}
            className="mt-4 text-[10px] font-mono font-black border-b border-zinc-900 pb-1"
          >
            RESET_FILTERS
          </button>
        </div>
      )}
    </motion.div>
  );
}
