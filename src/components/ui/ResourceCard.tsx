import React, { useState } from "react";
import { Resource } from "../../types";
import { cn } from "../../lib/utils";
import { MapPin, Users, Monitor, Building2, HelpCircle, QrCode, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

const typeIcons: any = {
  LECTURE_HALL: Building2,
  LAB: Monitor,
  MEETING_ROOM: Users,
  EQUIPMENT: HelpCircle
};

export const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const [showQR, setShowQR] = useState(false);
  const Icon = typeIcons[resource.type] || HelpCircle;

  const resourceUrl = `${window.location.origin}/catalogue/${resource.id}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-zinc-200 rounded-none p-6 group relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={cn(
          "w-10 h-10 rounded-none flex items-center justify-center transition-colors border",
          resource.status === 'ACTIVE' ? "bg-zinc-900 border-zinc-900 text-zinc-50" : "bg-zinc-50 border-zinc-100 text-zinc-300"
        )}>
          <Icon size={18} strokeWidth={1.5} />
        </div>
        <div className="flex flex-col items-end">
          <span className={cn(
            "text-[9px] font-mono font-black uppercase tracking-tighter",
            resource.status === 'ACTIVE' ? "text-emerald-600" : "text-zinc-400"
          )}>
            ST: {resource.status}
          </span>
          <span className="text-[8px] font-mono text-zinc-300">ID://{resource.id}</span>
        </div>
      </div>

      <h3 className="font-bold text-sm mb-4 leading-tight group-hover:underline underline-offset-4 decoration-zinc-300 transition-all">
        {resource.name}
      </h3>
      
      <div className="space-y-3 mt-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
          <MapPin size={12} className="text-zinc-300" />
          <span>{resource.location}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-tight">
          <Users size={12} className="text-zinc-300" />
          <span>CAP: {resource.capacity}</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
            {resource.type}
          </span>
          <button 
            onClick={() => setShowQR(true)}
            className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors border border-transparent hover:border-zinc-200"
            title="Generate QR Code"
          >
            <QrCode size={14} />
          </button>
        </div>
        <button 
          className="bg-zinc-900 text-zinc-50 px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors disabled:bg-zinc-100 disabled:text-zinc-300 disabled:cursor-not-allowed"
          disabled={resource.status !== 'ACTIVE'}
        >
          ALLOCATE
        </button>
      </div>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-10 border border-zinc-900 shadow-2xl relative max-w-xs w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowQR(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
                title="Close"
              >
                <X size={16} />
              </button>
              
              <div className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-zinc-300 mb-8 border-b border-zinc-100 pb-2 w-full text-center">
                Asset_Link_Generator
              </div>
              
              <div className="p-4 border border-zinc-100 bg-zinc-50">
                <QRCodeSVG value={resourceUrl} size={150} level="H" />
              </div>

              <div className="mt-8 text-center">
                <p className="text-[11px] font-bold text-zinc-900 uppercase tracking-tight mb-1">{resource.name}</p>
                <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">ID: {resource.id}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 w-full text-center">
                <p className="text-[8px] font-mono text-zinc-300 leading-tight">
                  SCAN TO ACCESS COMPREHENSIVE<br/>FACILITY TELEMETRY & SPECS
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
