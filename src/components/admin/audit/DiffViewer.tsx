"use client";

import React from "react";
import { Shield, AlertTriangle, Clock, User, Activity } from "lucide-react";

interface DiffViewerProps {
  before: any;
  after: any;
}

/**
 * COMPONENT: Deep Diff Visualizer
 * Highlights changes between two JSON snapshots.
 */
export function DiffViewer({ before, after }: DiffViewerProps) {
  const keys = Array.from(new Set([...Object.keys(before || {}), ...Object.keys(after || {})]));

  return (
    <div className="grid grid-cols-2 gap-4 font-mono text-xs p-3 bg-slate-950 rounded-lg border border-slate-800">
      <div className="space-y-1">
        <div className="text-slate-500 mb-2 uppercase tracking-tighter border-b border-slate-800 pb-1">Before Mutation</div>
        {keys.map(key => {
          const isChanged = JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]);
          return (
            <div key={key} className={`truncate ${isChanged ? 'text-red-400 bg-red-400/10' : 'text-slate-400'}`}>
              <span className="opacity-50">{key}:</span> {JSON.stringify(before?.[key])}
            </div>
          );
        })}
      </div>
      <div className="space-y-1">
        <div className="text-slate-500 mb-2 uppercase tracking-tighter border-b border-slate-800 pb-1">After Mutation</div>
        {keys.map(key => {
          const isChanged = JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]);
          return (
            <div key={key} className={`truncate ${isChanged ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-400'}`}>
              <span className="opacity-50">{key}:</span> {JSON.stringify(after?.[key])}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function RiskBadge({ score }: { score: number }) {
  const color = score > 70 ? "bg-red-500" : score > 30 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-lg ${color}`}>
      {score > 50 ? <AlertTriangle size={10} /> : <Shield size={10} />}
      RISK: {score}
    </div>
  );
}
