"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';

import dynamic from "next/dynamic";
import { Crosshair, Menu, X, MapPin, Info, DoorOpen, Trees, Music, MonitorPlay, Utensils, ShoppingBag, Monitor, Wifi, Building, Car, Shield, Briefcase, FileText, Tv, Armchair, Laptop } from "lucide-react";
import Link from 'next/link';

// ─── DYNAMIC IMPORT (no SSR) ───────────────────────────────────
const ReactPhotoSphereViewer = dynamic(
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => <LoadingScreen /> }
);

// ─── LOADING SCREEN ────────────────────────────────────────────
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-[#131432] absolute inset-0 z-[9999]">
    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
      <div className="absolute inset-0 border-4 border-slate-700 rounded-full" />
      <div className="absolute inset-0 border-4 border-orange-500 rounded-full border-t-transparent border-l-transparent animate-[spin_2s_linear_infinite]" />
      <div className="absolute inset-2 border-4 border-slate-800 rounded-full" />
      <div className="absolute inset-2 border-4 border-orange-400 rounded-full border-b-transparent border-r-transparent animate-[spin_3s_linear_infinite_reverse]" />
      <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(241,90,36,0.3)] p-2">
        <img src="/images/logo_politeknik.png" alt="Logo" className="w-full h-auto object-contain animate-pulse" />
      </div>
    </div>
    <div className="text-center">
      <h2 className="text-orange-400 font-bold tracking-[0.2em] text-lg uppercase mb-2">Loading Virtual Tour</h2>
      <p className="text-slate-400 text-xs tracking-widest uppercase">Mempersiapkan Tampilan 360°</p>
    </div>
  </div>
);

// ─── MODERN COMPASS ────────────────────────────────────────────
const ModernCompass = ({ yawDeg, isMobile }: { yawDeg: number; isMobile: boolean }) => {
  // Responsif: 85px di mobile, 110px di desktop
  const size = isMobile ? 85 : 110;
  const r = size / 2;
  const directions = [
    { label: 'N', deg: 0, major: true },
    { label: 'NE', deg: 45, major: false },
    { label: 'E', deg: 90, major: true },
    { label: 'SE', deg: 135, major: false },
    { label: 'S', deg: 180, major: true },
    { label: 'SW', deg: 225, major: false },
    { label: 'W', deg: 270, major: true },
    { label: 'NW', deg: 315, major: false },
  ];
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="absolute z-40 select-none" style={{ width: size, height: size, top: 'clamp(12px, 2vw, 20px)', right: 'clamp(12px, 2vw, 20px)' }}>
      <div className="rounded-full shadow-[0_0_30px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(255,255,255,0.05)]" style={{ width: size, height: size, background: 'radial-gradient(circle at 30% 30%, rgba(30,35,80,0.95), rgba(10,11,26,0.98))', border: '2px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: '100%', height: '100%', transform: `rotate(${-yawDeg}deg)`, transition: 'transform 0.15s linear', position: 'relative' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {[0.28, 0.42].map((ratio) => (
              <circle key={ratio} cx={r} cy={r} r={r * ratio} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            ))}
            {ticks.map((deg) => {
              const isMajor = deg % 90 === 0;
              const isMinor45 = deg % 45 === 0;
              const rad = (deg - 90) * (Math.PI / 180);
              const outerR = r - 6;
              const tickLen = isMajor ? 10 : isMinor45 ? 7 : 4;
              const innerR = outerR - tickLen;
              return <line key={deg} x1={r + Math.cos(rad) * outerR} y1={r + Math.sin(rad) * outerR} x2={r + Math.cos(rad) * innerR} y2={r + Math.sin(rad) * innerR} stroke={isMajor ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'} strokeWidth={isMajor ? 1.5 : 0.8} />;
            })}
            {[0, 45, 90, 135].map((deg) => {
              const rad = (deg - 90) * (Math.PI / 180);
              const spokeR = r * 0.38;
              return <line key={deg} x1={r - Math.cos(rad) * spokeR} y1={r - Math.sin(rad) * spokeR} x2={r + Math.cos(rad) * spokeR} y2={r + Math.sin(rad) * spokeR} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
            })}
            {directions.map(({ label, deg, major }) => {
              const rad = (deg - 90) * (Math.PI / 180);
              const labelR = r - 20;
              const isNorth = deg === 0;
              return <text key={label} x={r + Math.cos(rad) * labelR} y={r + Math.sin(rad) * labelR + 0.5} textAnchor="middle" dominantBaseline="middle" fontSize={major ? (isNorth ? 11 : 9) : 6} fontWeight={major ? 'bold' : '500'} fontFamily="system-ui, sans-serif" fill={isNorth ? '#ef4444' : major ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'} letterSpacing={major ? '0.05em' : '0'}>{label}</text>;
            })}
            <polygon points={`${r},${r - r * 0.36} ${r - 5},${r + 4} ${r},${r - 4} ${r + 5},${r + 4}`} fill="url(#needleNorth)" filter="url(#needleShadow)" />
            <polygon points={`${r},${r + r * 0.36} ${r - 5},${r - 4} ${r},${r + 4} ${r + 5},${r - 4}`} fill="url(#needleSouth)" />
            <circle cx={r} cy={r} r={4} fill="#1e1e3a" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <circle cx={r} cy={r} r={2} fill="rgba(255,255,255,0.7)" />
            <defs>
              <linearGradient id="needleNorth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" /><stop offset="100%" stopColor="#b91c1c" /></linearGradient>
              <linearGradient id="needleSouth" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#93c5fd" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
              <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#ef4444" floodOpacity="0.5" /></filter>
            </defs>
          </svg>
        </div>
        <div style={{ position: 'absolute', top: 1, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid rgba(244,121,32,0.9)', filter: 'drop-shadow(0 0 4px rgba(244,121,32,0.7))' }} />
      </div>
    </div>
  );
};

// ─── MINIMAP ───────────────────────────────────────────────────
// Posisi tiap scene pada denah kampus (dalam % dari 0-100)
// Koordinat disesuaikan dengan layout kampus secara umum
const MINIMAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "halaman-depan": { x: 48, y: 15 },
  "aula":          { x: 70, y: 35 },
  "parkiran":      { x: 48, y: 85 },
  "kantin":        { x: 78, y: 65 },
  "kelas":         { x: 62, y: 55 },
  "lab":           { x: 30, y: 45 },
  "mushola":       { x: 20, y: 65 },
  "ruang-staff":   { x: 35, y: 25 },
};

const Minimap = ({ currentSceneId, scenes, onSceneChange }: { currentSceneId: string; scenes: typeof SCENES; onSceneChange: (s: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute bottom-20 right-5 z-40 select-none">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#0d0e22]/90 backdrop-blur-xl border border-white/10 text-white text-xs font-bold px-3 py-2 rounded-full shadow-lg hover:border-orange-400/50 transition-all"
      >
        <MapPin className="w-3.5 h-3.5 text-orange-400" />
        <span className="uppercase tracking-wider">Denah</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-10 right-0 w-52 h-44 bg-[#0d0e22]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden">
          {/* Map background - stylized campus layout */}
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
            {/* Ground */}
            <rect x="0" y="0" width="100" height="100" fill="rgba(15,17,40,0.8)" />
            {/* Road/path */}
            <rect x="42" y="0" width="16" height="100" fill="rgba(255,255,255,0.03)" rx="1" />
            <rect x="0" y="42" width="100" height="16" fill="rgba(255,255,255,0.03)" rx="1" />
            {/* Buildings (simplified blocks) */}
            <rect x="55" y="18" width="28" height="20" rx="2" fill="rgba(53,32,121,0.4)" stroke="rgba(100,80,200,0.3)" strokeWidth="0.5" />
            <rect x="24" y="18" width="16" height="12" rx="2" fill="rgba(53,32,121,0.3)" stroke="rgba(100,80,200,0.3)" strokeWidth="0.5" />
            <rect x="55" y="48" width="22" height="22" rx="2" fill="rgba(53,32,121,0.4)" stroke="rgba(100,80,200,0.3)" strokeWidth="0.5" />
            <rect x="14" y="48" width="20" height="28" rx="2" fill="rgba(53,32,121,0.35)" stroke="rgba(100,80,200,0.3)" strokeWidth="0.5" />
            <rect x="38" y="78" width="24" height="14" rx="2" fill="rgba(53,32,121,0.3)" stroke="rgba(100,80,200,0.3)" strokeWidth="0.5" />
            {/* Grid lines */}
            {[20, 40, 60, 80].map(v => (
              <React.Fragment key={v}>
                <line x1={v} y1="0" x2={v} y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                <line x1="0" y1={v} x2="100" y2={v} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
              </React.Fragment>
            ))}
          </svg>

          {/* Scene dots */}
          <div className="absolute inset-0">
            {scenes.map((scene) => {
              const pos = MINIMAP_POSITIONS[scene.id] || { x: 50, y: 50 };
              const isActive = scene.id === currentSceneId;
              return (
                <button
                  key={scene.id}
                  onClick={() => { onSceneChange(scene); setIsOpen(false); }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  title={scene.name}
                >
                  {isActive ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(244,121,32,0.8)] border-2 border-white/80 z-10 relative" />
                      <div className="absolute inset-0 rounded-full bg-orange-400/50 animate-ping" />
                    </>
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white/40 border border-white/20 hover:bg-white/70 transition-colors" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Label */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0d0e22] to-transparent px-3 py-1.5">
            <p className="text-[9px] text-white/40 uppercase tracking-widest text-center">Denah Kampus</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── HOTSPOT POPUP ─────────────────────────────────────────────
interface MarkerInfo {
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

// Icon renderer untuk popup berdasarkan nama
const ICON_MAP: Record<string, React.ElementType> = {
  DoorOpen, Trees, Music, MonitorPlay, Utensils, ShoppingBag,
  Monitor, Wifi, Building, Car, Shield, Briefcase, FileText,
  Tv, Armchair, Laptop, MapPin, Info,
};

const MarkerIcon = ({ name, className }: { name: string; className?: string }) => {
  const Icon = ICON_MAP[name] ?? MapPin;
  return <Icon className={className} />;
};
const HotspotPopup = ({ info, onClose }: { info: MarkerInfo; onClose: () => void }) => (
  <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-72 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="bg-gradient-to-br from-[#1a1b45]/98 to-[#0d0e22]/98 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/20 flex items-center justify-center">
            <MarkerIcon name={info.icon} className="w-4 h-4 text-orange-400" />
          </div>
          <h3 className="text-white font-bold text-sm tracking-wide">{info.title}</h3>
        </div>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-slate-300 text-xs leading-relaxed">{info.description}</p>
      </div>
      {/* Footer accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
    </div>
  </div>
);

// ─── SCENE DATA ────────────────────────────────────────────────
interface Marker {
  id: string;
  position: { yaw: string; pitch: string };
  info: MarkerInfo;
}
interface Scene {
  id: string;
  name: string;
  image: string;
  description: string;
  markers: Marker[];
}

const SCENES: Scene[] = [
  {
    id: "halaman-depan",
    name: "Halaman Depan",
    image: "/images/tour360/halaman-depan.jpeg",
    description: "Pintu masuk utama kampus Politeknik Prestasi Prima.",
    markers: [
      { id: "hd-1", position: { yaw: "0deg", pitch: "-5deg" }, info: { icon: "DoorOpen", title: "Gerbang Utama", description: "Gerbang resmi kampus yang menjadi akses masuk utama civitas akademika dan tamu." } },
    ],
  },
  {
    id: "aula",
    name: "Aula",
    image: "/images/tour360/aula.jpeg",
    description: "Aula serbaguna kampus untuk kegiatan akademik dan non-akademik.",
    markers: [
      { id: "au-1", position: { yaw: "0deg", pitch: "0deg" }, info: { icon: "Music", title: "Panggung Utama", description: "Panggung aula yang digunakan untuk seminar, dan acara besar kampus." } },
    ],
  },
  {
    id: "kantin",
    name: "Kantin",
    image: "/images/tour360/kantin.jpeg",
    description: "Kantin kampus dengan berbagai pilihan menu makanan dan minuman.",
    markers: [
      { id: "kt-1", position: { yaw: "30deg", pitch: "-5deg" }, info: { icon: "Utensils", title: "Area Makan", description: "Area makan yang nyaman dengan kapasitas menampung ratusan mahasiswa sekaligus." } },
    ],
  },
  {
    id: "kelas",
    name: "Kelas",
    image: "/images/tour360/kelas.jpeg",
    description: "Ruang kelas modern dengan fasilitas belajar mengajar terdepan.",
    markers: [
      { id: "kl-2", position: { yaw: "170deg", pitch: "-10deg" }, info: { icon: "Armchair", title: "Tempat Duduk Ergonomis", description: "Meja dan kursi dirancang ergonomis untuk kenyamanan belajar selama berjam-jam." } },
    ],
  },
  {
    id: "lab",
    name: "Laboratorium",
    image: "/images/tour360/lab.jpeg",
    description: "Laboratorium komputer berspesifikasi tinggi untuk praktik mahasiswa.",
    markers: [
      { id: "lb-1", position: { yaw: "0deg", pitch: "0deg" }, info: { icon: "Laptop", title: "Komputer High-Spec", description: "Puluhan unit PC dengan spesifikasi terkini mendukung praktik programming, desain, dan jaringan." } },
      { id: "lb-2", position: { yaw: "220deg", pitch: "-5deg" }, info: { icon: "Wifi", title: "Koneksi Internet", description: "Jaringan internet berkecepatan tinggi tersedia di seluruh area laboratorium." } },
    ],
  },
  {
    id: "mushola",
    name: "Mushola",
    image: "/images/tour360/mushola.jpeg",
    description: "Mushola kampus yang bersih dan nyaman untuk ibadah civitas akademika.",
    markers: [
      { id: "ms-1", position: { yaw: "0deg", pitch: "-5deg" }, info: { icon: "Building", title: "Ruang Sholat", description: "Ruang sholat yang luas dan bersih, mampu menampung jamaah dalam jumlah besar." } },
    ],
  },
  {
    id: "parkiran",
    name: "Parkiran",
    image: "/images/tour360/parkiran.jpeg",
    description: "Area parkir kampus yang luas dan terorganisir.",
    markers: [
      { id: "pk-1", position: { yaw: "60deg", pitch: "-8deg" }, info: { icon: "Car", title: "Parkir Kendaraan", description: "Area parkir luas dengan kapasitas ratusan kendaraan roda dua dan roda empat." } },
      { id: "pk-2", position: { yaw: "240deg", pitch: "-5deg" }, info: { icon: "Shield", title: "Pos Keamanan", description: "Dijaga oleh petugas keamanan selama jam operasional kampus." } },
    ],
  },
  {
    id: "ruang-staff",
    name: "Ruang Staff",
    image: "/images/tour360/ruang-staff.jpeg",
    description: "Ruang kerja staf dan administrasi kampus.",
    markers: [
      { id: "rs-1", position: { yaw: "0deg", pitch: "0deg" }, info: { icon: "Briefcase", title: "Area Kerja", description: "Ruang kerja modern dengan workstation lengkap untuk staf administrasi dan dosen." } },
      { id: "rs-2", position: { yaw: "180deg", pitch: "-5deg" }, info: { icon: "FileText", title: "Layanan Akademik", description: "Pusat layanan administrasi akademik untuk mahasiswa, termasuk KRS, KHS, dan surat menyurat." } },
    ],
  },
];

// ─── MAIN COMPONENT ────────────────────────────────────────────
export default function VirtualTour() {
  const [isClient, setIsClient] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene>(SCENES[0]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPanoramaLoaded, setIsPanoramaLoaded] = useState(false);
  const [yawDeg, setYawDeg] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeMarker, setActiveMarker] = useState<MarkerInfo | null>(null);
  const viewerRef = useRef<any>(null);
  const markersPluginRef = useRef<any>(null);

  useEffect(() => {
    setIsClient(true);
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);

    // Deep link detection
    const params = new URLSearchParams(window.location.search);
    const targetId = params.get("scene");
    if (targetId) {
      const match = SCENES.find((s) => s.id === targetId);
      if (match) {
        setCurrentScene(match);
      }
    }

    // Buka sidebar hanya di layar >= 768px (desktop/tablet landscape)
    if (!mobile) setIsNavOpen(true);
  }, []);
  if (!isClient) return <LoadingScreen />;

  // ── Scene change with fade transition ──
  const handleChangeScene = (scene: Scene) => {
    if (currentScene.id === scene.id || isTransitioning) return;
    setActiveMarker(null);
    setIsTransitioning(true);
    // Fade overlay appears, then we swap scene after 350ms
    setTimeout(() => {
      setIsPanoramaLoaded(false);
      setCurrentScene(scene);
    }, 350);
  };

  // ── Register viewer & plugins ──
  const handleReady = (instance: any) => {
    viewerRef.current = instance;
    markersPluginRef.current = instance.getPlugin(MarkersPlugin);

    instance.addEventListener('panorama-loaded', () => {
      setIsPanoramaLoaded(true);
      setIsTransitioning(false);

      // Add markers for current scene
      if (markersPluginRef.current) {
        markersPluginRef.current.clearMarkers();
        currentScene.markers.forEach((m) => {
          markersPluginRef.current.addMarker({
            id: m.id,
            position: m.position,
            html: `<div style="
              width:34px; height:34px;
              background:linear-gradient(135deg,#F47920,#d95d0b);
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:2px solid rgba(255,255,255,0.6);
              box-shadow:0 4px 15px rgba(244,121,32,0.5);
              cursor:pointer;
              display:flex; align-items:center; justify-content:center;
            ">
              <svg style="transform:rotate(45deg);" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>`,
            size: { width: 34, height: 34 },
            anchor: 'bottom center',
            tooltip: { content: m.info.title, position: 'top' },
            data: m.info,
          });
        });

        markersPluginRef.current.addEventListener('select-marker', (e: any) => {
          setActiveMarker(e.marker.data as MarkerInfo);
        });
      }
    });

    instance.addEventListener('position-updated', (e: any) => {
      setYawDeg((e.position.yaw * 180) / Math.PI);
    });
  };

  // Re-add markers when scene changes
  const plugins = [
    [AutorotatePlugin, { autostartDelay: 2500, autorotateSpeed: '1rpm' }],
    [MarkersPlugin, {}],
    [GyroscopePlugin, { absolutePosition: true }],
  ];

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-900 overflow-hidden">

      {/* ── LOADING / TRANSITION OVERLAY ── */}
      <div className={`absolute inset-0 z-[9998] pointer-events-none transition-opacity duration-350 ${(!isPanoramaLoaded || isTransitioning) ? 'opacity-100' : 'opacity-0'}`}>
        <LoadingScreen />
      </div>

      {/* ── CUSTOM COMPASS ── */}
      {isPanoramaLoaded && <ModernCompass yawDeg={yawDeg} isMobile={isMobile} />}

      {/* ── MINIMAP ── */}
      {isPanoramaLoaded && (
        <Minimap currentSceneId={currentScene.id} scenes={SCENES} onSceneChange={handleChangeScene} />
      )}

      {/* ── HOTSPOT POPUP ── */}
      {activeMarker && <HotspotPopup info={activeMarker} onClose={() => setActiveMarker(null)} />}

      {/* ── FLOATING MENU BUTTON (shown when sidebar is closed) ── */}
      <button
        onClick={() => setIsNavOpen(true)}
        className={`absolute left-3 sm:left-6 top-3 sm:top-6 z-20 flex items-center justify-center p-3.5 bg-gradient-to-br from-[#131432]/95 to-[#0a0b1a]/95 backdrop-blur-xl rounded-2xl border border-white/10 text-white shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500 hover:scale-105 hover:shadow-[0_15px_30px_rgba(53,32,121,0.5)] ${isNavOpen ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* ── SIDEBAR NAVIGATION ── */}
      <div className={`absolute left-3 sm:left-4 md:left-6 top-3 sm:top-4 md:top-8 z-30 flex flex-col w-40 sm:w-52 md:w-64 max-h-[75vh] bg-gradient-to-b from-[#131432]/97 to-[#0a0b1a]/97 backdrop-blur-2xl rounded-2xl border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left ${isNavOpen ? 'translate-x-0 opacity-100 scale-100 pointer-events-auto' : '-translate-x-[120%] opacity-0 scale-95 pointer-events-none'}`}>
        <div className="pt-5 pb-4 px-5 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold tracking-[0.2em] text-xs uppercase text-white">NAVIGASI</h3>
          <button onClick={() => setIsNavOpen(false)} className="flex justify-center items-center w-8 h-8 rounded-full bg-white/5 hover:bg-[#F47920] text-slate-300 hover:text-white transition-all duration-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-3 py-3 space-y-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {SCENES.map((scene) => {
            const isActive = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => handleChangeScene(scene)}
                className={`w-full py-3 px-4 relative rounded-xl text-left transition-all duration-300 text-xs font-medium flex items-center overflow-hidden group ${isActive ? 'bg-[#2d1b66] text-white border border-[#352079]' : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'}`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#F47920] to-[#ea580c] shadow-[0_0_10px_rgba(244,121,32,0.8)]" />}
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'translate-x-1.5 font-bold' : 'group-hover:translate-x-1'}`}>{scene.name}</span>
                {isActive && <Info className="w-3 h-3 ml-auto text-white/40 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        {/* Scene description - hanya di layar >= sm */}
        <div className="hidden sm:block px-4 py-3 border-t border-white/5">
          <p className="text-[10px] text-slate-400 leading-relaxed">{currentScene.description}</p>
        </div>
      </div>

      {/* ── 360 VIEWER ── */}
      <ReactPhotoSphereViewer
        key={currentScene.id}
        src={currentScene.image}
        height={"100%"}
        width={"100%"}
        defaultZoomLvl={0}
        navbar={false}
        onReady={handleReady}
        plugins={plugins as any}
      />

      {/* ── SCENE TITLE BADGE ── */}
      <div className={`absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isNavOpen && isMobile
          ? 'opacity-0 scale-75 -translate-y-3 blur-sm'
          : 'opacity-100 scale-100 translate-y-0 blur-0'
      }`}>
        <div className="bg-gradient-to-r from-[#131432]/90 via-[#352079]/90 to-[#131432]/90 backdrop-blur-md px-6 py-2 rounded-full text-white font-medium border border-white/10 shadow-[0_8px_32px_rgba(53,32,121,0.4)] tracking-wide text-xs sm:text-sm flex items-center gap-2 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
          {currentScene.name}
        </div>
      </div>

      {/* ── BACK HOME BUTTON ── */}
      <Link href="/" className="absolute bottom-5 right-5 z-20 group flex items-center justify-center gap-2 bg-gradient-to-br from-[#F47920] to-[#d95d0b] hover:from-[#ea580c] hover:to-[#c2410c] px-5 py-2.5 rounded-full text-white font-medium shadow-[0_8px_30px_rgba(244,121,32,0.4)] hover:shadow-[0_8px_30px_rgba(244,121,32,0.6)] hover:-translate-y-1 transition-all duration-300 border border-white/20">
        <Crosshair className="w-4 h-4 opacity-90 group-hover:rotate-90 transition-transform duration-500" />
        <span className="text-xs font-bold tracking-wider">BERANDA</span>
      </Link>
    </div>
  );
}
