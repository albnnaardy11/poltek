"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface VisitorChartProps {
  data: { label: string; value: number; views: number }[];
}

export function VisitorChart({ data }: VisitorChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 200;
  const padding = 20;

  // Calculate coordinates
  const maxValue = Math.max(...data.map(d => d.value), 10) + 10;
  const xStep = width / (data.length > 1 ? data.length - 1 : 1);

  const points = data.map((d, i) => {
    const x = i * xStep;
    const y = height - padding - ((d.value / maxValue) * (height - padding * 2));
    return { x, y, ...d };
  });

  const generatePath = () => {
    const d = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
    return d;
  };

  const generateFillPath = () => {
    const d = generatePath();
    // Close the path to fill under the curve
    return `${d} L${points[points.length - 1].x},${height} L0,${height} Z`;
  };

  return (
    <div className="h-64 w-full relative">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4338CA" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#f97316" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
             <stop offset="0%" stopColor="#4338CA" />
             <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Fill under line */}
        <path 
          d={generateFillPath()} 
          fill="url(#chartGradient)"
        />

        {/* The line itself */}
        <path 
          d={generatePath()} 
          fill="none" 
          stroke="url(#lineGradient)" 
          strokeWidth="4" 
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Grid Lines */}
        {[0, 1, 2, 3, 4].map(i => {
           const y = height - padding - (i * ((height - padding * 2) / 4));
           return (
             <line key={i} x1="0" y1={y} x2={width} y2={y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="5,5" />
           )
        })}

        {/* Interactive Points & Hitboxes */}
        {points.map((p, i) => (
          <g key={i}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={hoveredIndex === i ? "8" : "5"} 
              fill="white" 
              stroke={i < 3 ? "#4338CA" : "#f97316"} 
              strokeWidth={hoveredIndex === i ? "4" : "3"} 
              className="transition-all duration-300"
            />
            {/* Invisible hitbox for easier hovering */}
            <rect
              x={p.x - xStep / 2}
              y="0"
              width={xStep}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-crosshair"
            />
          </g>
        ))}
      </svg>

      {/* Custom Tooltip Overlay */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `calc(${(points[hoveredIndex].y / height) * 100}% - 14px)`
            }}
          >
            <div className="bg-[#1E1B4B] text-white px-3 py-2 rounded-xl text-xs font-bold shadow-2xl flex flex-col items-center gap-1 min-w-max border border-white/10">
              <span className="text-[9px] text-white/50 uppercase tracking-widest">{points[hoveredIndex].label}</span>
              <div className="flex items-center gap-3">
                 <span className="text-sm font-black text-orange-400">{points[hoveredIndex].value} <span className="text-white/80 font-medium text-[9px]">UNIK</span></span>
                 <div className="w-[1px] h-3 bg-white/20" />
                 <span className="text-sm font-black text-indigo-400">{points[hoveredIndex].views} <span className="text-white/80 font-medium text-[9px]">VIEWS</span></span>
              </div>
              
              {/* Tooltip Triangle */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1E1B4B] rotate-45 border-r border-b border-white/10" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between mt-4 text-[10px] font-bold text-slate-400 capitalize">
         {data.map((d, i) => (
            <span key={i} className={hoveredIndex === i ? "text-orange-500 transition-colors" : "transition-colors"}>{d.label}</span>
         ))}
      </div>
    </div>
  );
}
