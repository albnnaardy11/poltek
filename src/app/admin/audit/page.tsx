"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  ShieldAlert, 
  Clock, 
  User, 
  Activity, 
  ChevronRight, 
  Database, 
  Terminal,
  Search,
  RefreshCcw,
  Calendar,
  Layers,
  Zap,
  Tag,
  AtSign,
  Monitor
} from "lucide-react";
import { getAuditLogs } from "@/actions/cms";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string | null;
  details: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  admin: {
    name: string | null;
    email: string;
  };
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const data = await getAuditLogs();
    setLogs(data as any);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.email.toLowerCase().includes(search.toLowerCase()) ||
      log.admin.name?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === "ALL" || log.action === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "UPDATE": return "bg-amber-50 text-amber-600 border-amber-100";
      case "DELETE": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case "News": return <Tag size={14} />;
      case "Program": return <Layers size={14} />;
      case "SeoSetting": return <Zap size={14} />;
      case "Navigation": return <Activity size={14} />;
      default: return <Database size={14} />;
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sistem Security</p>
              <h4 className="text-xl font-black text-slate-900">Audit Trails</h4>
           </div>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Activity size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Aktivitas</p>
              <h4 className="text-xl font-black text-slate-900">{logs.length} <span className="text-sm text-slate-300 font-bold ml-1">Langkah</span></h4>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
           <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
              <Clock size={28} />
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sesi Aktif</p>
              <h4 className="text-xl font-black text-slate-900">Real-time <span className="text-sm text-slate-300 font-bold ml-1">Feed</span></h4>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {/* Controls */}
        <div className="p-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/30">
           <div className="flex items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 w-64">
                 <Search size={16} className="text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Cari aktivitas..." 
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   className="bg-transparent outline-none text-xs font-bold text-slate-600 w-full"
                 />
              </div>
              <button 
                onClick={fetchLogs}
                className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
              >
                 <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
              </button>
           </div>
           
           <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
              {["ALL", "CREATE", "UPDATE", "DELETE"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  {f === "ALL" ? "Semua" : f}
                </button>
              ))}
           </div>
        </div>

        {/* Timeline Content */}
        <div className="p-8 lg:p-12 relative">
           {/* Timeline Line */}
           <div className="absolute left-[3.5rem] lg:left-[4.5rem] top-12 bottom-12 w-[2px] bg-slate-100" />

           <div className="space-y-12">
              {loading ? (
                <div className="py-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <Terminal size={40} className="text-slate-100 animate-pulse" />
                      <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Decrypting Logs...</p>
                   </div>
                </div>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={log.id} 
                    className="relative flex items-start gap-8 lg:gap-14"
                  >
                     {/* Time & Circle */}
                     <div className="flex flex-col items-center gap-4 w-15 lg:w-20 shrink-0">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                          {format(new Date(log.createdAt), "HH:mm", { locale: id })}
                        </span>
                        <div className={`w-10 h-10 rounded-2xl border-4 border-white shadow-xl z-20 flex items-center justify-center transition-transform hover:scale-110 cursor-help ${
                           log.action === "DELETE" ? 'bg-rose-500 text-white shadow-rose-200' : 
                           log.action === "CREATE" ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                           'bg-amber-500 text-white shadow-amber-200'
                        }`}>
                           {log.action === "DELETE" ? <RefreshCcw size={16} className="rotate-45" /> : 
                            log.action === "CREATE" ? <Activity size={16} /> : 
                            <RefreshCcw size={16} />}
                        </div>
                     </div>

                     {/* Content Card */}
                     <div className="flex-1 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 p-6 lg:p-8 rounded-[2rem] border border-transparent hover:border-slate-100 transition-all group">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                           <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                 <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getActionColor(log.action)}`}>
                                    {log.action}
                                 </span>
                                 <span className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                    {getEntityIcon(log.entity)} {log.entity}
                                 </span>
                              </div>
                              <h5 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                                 {log.admin.name || log.admin.email.split('@')[0]} <span className="text-slate-400 font-bold mx-1">telah melakukan</span> {log.action.toLowerCase()} <span className="text-slate-400 font-bold">pada</span> {log.entity}
                              </h5>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-4">
                                 <span className="flex items-center gap-1.5"><Calendar size={12} /> {format(new Date(log.createdAt), "dd MMMM yyyy", { locale: id })}</span>
                                 <span className="flex items-center gap-1.5"><Tag size={12} /> ID: {log.entityId || 'N/A'}</span>
                              </p>
                           </div>

                           <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                                 {log.admin.name?.[0] || 'A'}
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-[10px] font-black text-slate-900 leading-none">{log.admin.name || "Admin"}</span>
                                 <span className="text-[9px] font-bold text-slate-400 mt-1 flex items-center gap-1"><AtSign size={8} /> {log.admin.email}</span>
                              </div>
                           </div>
                        </div>

                        {/* Metadata / Technical Info */}
                        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                              <Monitor size={14} className="text-slate-300" />
                              <span className="truncate max-w-[200px]" title={log.userAgent || ""}>{log.userAgent || "Unknown Device"}</span>
                           </div>
                           <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 justify-end">
                              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-500 font-mono">{log.ipAddress || "0.0.0.0"}</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-20 text-center">
                   <div className="flex flex-col items-center gap-4">
                      <Terminal size={40} className="text-slate-100" />
                      <p className="text-sm font-bold text-slate-400">Tidak ada aktivitas ditemukan.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
