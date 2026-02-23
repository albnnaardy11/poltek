import { getAuditIntelligence } from "@/lib/intelligence/oracle-service";
import { DiffViewer, RiskBadge } from "@/components/admin/audit/DiffViewer";
import { Clock, User, HardDrive, ShieldAlert, Activity } from "lucide-react";

export default async function AuditCommandCenter() {
  const feed = await getAuditIntelligence(20);

  return (
    <div className="flex flex-col gap-6 p-6 min-h-screen bg-slate-950 text-slate-200">
      <header className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
            <ShieldAlert className="text-emerald-500" />
            AEGIS COMMAND CENTER
          </h1>
          <p className="text-xs text-slate-500 font-mono">Real-time Semantic Intelligence & Zero-Trust Governance</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded flex items-center gap-3">
            <Activity className="text-emerald-500 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">System Health</div>
              <div className="text-sm font-bold text-white">NOMINAL</div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[85vh] pr-2 custom-scrollbar">
        {feed.map((log) => (
          <div key={log.id} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all group">
            <div className="flex items-center justify-between p-4 bg-slate-900">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                  <User size={18} className="text-slate-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.adminName}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded uppercase font-mono tracking-tighter">
                      {log.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><HardDrive size={12} /> {log.entity}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <RiskBadge score={log.riskScore} />
            </div>
            
            <div className="p-4 border-t border-slate-800/50">
               <DiffViewer before={log.diff.before} after={log.diff.after} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
