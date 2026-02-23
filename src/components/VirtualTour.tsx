"use client";

import React, { useState, useEffect } from "react";
// Import CSS bawaannya wajib agar fitur jalan
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import "@photo-sphere-viewer/compass-plugin/index.css";
import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { CompassPlugin } from '@photo-sphere-viewer/compass-plugin';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';

// Import Next Dynamic agar kita disable proses render dari Sisi Server
import dynamic from "next/dynamic";
import { Loader2, Home, Crosshair, ChevronLeft, Menu, X } from "lucide-react";
import Link from 'next/link';

// Memuat komponen secara dinamis (tanpa SSR)
const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer
    ),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
);

const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-full w-full bg-[#131432] absolute inset-0 z-[9999]">
    {/* Animated Modern Circular Loader */}
    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
      <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent border-l-transparent animate-[spin_2s_linear_infinite]"></div>
      <div className="absolute inset-2 border-4 border-slate-800 rounded-full"></div>
      <div className="absolute inset-2 border-4 border-orange-400 rounded-full border-b-transparent border-r-transparent animate-[spin_3s_linear_infinite_reverse]"></div>
      <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(241,90,36,0.3)] p-2">
        {/* Replace with your actual logo from public folder */}
        <img
          src="/images/logo_politeknik.png"
          alt="Politeknik Logo"
          className="w-full h-auto object-contain animate-pulse duration-1000"
        />
      </div>
    </div>
    
    {/* Loading Text */}
    <div className="text-center">
      <h2 className="text-primary font-bold tracking-[0.2em] text-lg uppercase mb-2">
        Loading Virtual Tour
      </h2>
      <p className="text-slate-400 text-xs tracking-widest uppercase">
        Mempersiapkan Tampilan 360&deg;
      </p>
    </div>
  </div>
);

// Map of available scenes based on the copied directory
const SCENES = [
  { id: "halaman-depan", name: "Halaman Depan", image: "/images/tour360/halaman-depan.jpeg" },
  { id: "aula", name: "Aula", image: "/images/tour360/aula.jpeg" },
  { id: "kantin", name: "Kantin", image: "/images/tour360/kantin.jpeg" },
  { id: "kelas", name: "Kelas", image: "/images/tour360/kelas.jpeg" },
  { id: "lab", name: "Laboratorium", image: "/images/tour360/lab.jpeg" },
  { id: "mushola", name: "Mushola", image: "/images/tour360/mushola.jpeg" },
  { id: "parkiran", name: "Parkiran", image: "/images/tour360/parkiran.jpeg" },
  { id: "ruang-staff", name: "Ruang Staff", image: "/images/tour360/ruang-staff.jpeg" },
];

export default function VirtualTour() {
  const [isClient, setIsClient] = useState(false);
  const [currentScene, setCurrentScene] = useState(SCENES[0]);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isPanoramaLoaded, setIsPanoramaLoaded] = useState(false);

  // Pastikan komponen kita hanya berjalan di browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <LoadingScreen />;

  // Handler pergantian scene (memicu loading screen kustom kita kembali muncul)
  const handleChangeScene = (scene: any) => {
    if (currentScene.id !== scene.id) {
      setIsPanoramaLoaded(false); // Munculkan LoadingScreen kustom
      setCurrentScene(scene);
    }
  };

  // Tangkap event ketika scene DALAM viewer sudah beres dimuat
  const handleReady = (instance: any) => {
    instance.addEventListener('panorama-loaded', () => {
      setIsPanoramaLoaded(true);
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-900 overflow-hidden group">
      
      {/* KUSTOM LOADING SCREEN KITA (Muncul di atas Viewer) */}
      {!isPanoramaLoaded && <LoadingScreen />}
      
      {/* CSS Override untuk Kompasagar tidak bertabrakan dengan Navigasi */}
      <style jsx global>{`
        .psv-compass {
          width: 85px !important;
          height: 85px !important;
          top: 25px !important;
          right: 25px !important;
          left: auto !important;
          background: rgba(13, 14, 34, 0.85) !important;
          border: 2px solid rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(12px);
          border-radius: 50%;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          z-index: 40 !important;
        }
      `}</style>
      {/* Floating Menu Button (Muncul jika sidebar navigasi ditutup) */}
      <button 
        onClick={() => setIsNavOpen(true)}
        className={`absolute left-6 top-6 sm:top-8 z-20 flex items-center justify-center p-3.5 bg-gradient-to-br from-[#131432]/95 to-[#0a0b1a]/95 backdrop-blur-xl rounded-2xl border border-white/10 text-white shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-105 hover:bg-[#352079] hover:shadow-[0_15px_30px_rgba(53,32,121,0.5)] ${
          isNavOpen ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'
        }`}
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* OVERLAY: Sidebar Navigasi Kiri */}
      <div className={`absolute left-6 top-6 sm:top-8 z-30 flex flex-col w-48 sm:w-64 max-h-[85vh] bg-gradient-to-b from-[#131432]/95 to-[#0a0b1a]/95 backdrop-blur-2xl rounded-3xl border border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-left ${
        isNavOpen ? 'translate-x-0 opacity-100 scale-100 pointer-events-auto' : '-translate-x-[120%] opacity-0 scale-95 pointer-events-none'
      }`}>
        {/* Header Card */}
        <div className="pt-6 pb-4 px-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold tracking-[0.2em] text-sm uppercase text-white drop-shadow-md">
            NAVIGASI
          </h3>
          <button 
            onClick={() => setIsNavOpen(false)}
            className="flex justify-center items-center w-8 h-8 rounded-full bg-white/5 hover:bg-[#F47920] text-slate-300 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F47920]/50 -mr-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Isi Menu */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          {SCENES.map((scene) => {
            const isActive = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => handleChangeScene(scene)}
                className={`w-full py-3.5 px-5 relative rounded-2xl text-left transition-all duration-300 text-sm font-medium flex items-center overflow-hidden group ${
                  isActive
                    ? "bg-[#2d1b66] text-white shadow-inner border border-[#352079]"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                {isActive && (
                   <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#F47920] to-[#ea580c] shadow-[0_0_15px_rgba(244,121,32,0.8)]"></div>
                )}
                {!isActive && (
                   <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white/20 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                )}
                <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'translate-x-1 font-bold tracking-wide' : 'group-hover:translate-x-1'}`}>{scene.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 360 VIEWER CONTAINER */}
      <ReactPhotoSphereViewer
        src={currentScene.image}
        height={"100%"}
        width={"100%"}
        defaultZoomLvl={0}
        navbar={false}
        onReady={handleReady}
        plugins={[
          [AutorotatePlugin, {
            autostartDelay: 2000,
            autorotateSpeed: '1rpm',
          }],
          [CompassPlugin, {
            hotspots: [
              { yaw: '0deg', color: '#ef4444' },     // Utara - Merah
              { yaw: '90deg', color: '#facc15' },    // Timur - Kuning
              { yaw: '180deg', color: '#facc15' },   // Selatan - Kuning
              { yaw: '270deg', color: '#facc15' },   // Barat - Kuning
            ],
          }],
          [GyroscopePlugin, {
            absolutePosition: true,
          }]
        ]}
      />

      {/* Floating Panel Tengah Atas (Melihat Area) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        {/* Caption Area Saat Ini (Premium Gradient Pill) */}
        <div className="bg-gradient-to-r from-[#131432]/90 via-[#352079]/90 to-[#131432]/90 backdrop-blur-md px-8 py-2.5 rounded-full text-white font-medium border border-white/10 shadow-[0_8px_32px_rgba(53,32,121,0.4)] transition-all pointer-events-none tracking-wide text-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFFF] animate-pulse"></span>
          {currentScene.name}
        </div>
      </div>
      
      {/* Tombol Kembali ke Beranda (Kanan Bawah - Premium Orange Gradient) */}
      <Link 
        href="/"
        className="absolute bottom-6 right-6 z-20 group flex items-center justify-center gap-2 bg-gradient-to-br from-[#F47920] to-[#d95d0b] hover:from-[#ea580c] hover:to-[#c2410c] backdrop-blur-md px-6 py-3 rounded-full text-white font-medium shadow-[0_8px_30px_rgba(244,121,32,0.4)] hover:shadow-[0_8px_30px_rgba(244,121,32,0.6)] hover:-translate-y-1 transition-all duration-300 border border-white/20"
      >
        <Crosshair className="w-4 h-4 opacity-90 group-hover:rotate-90 transition-transform duration-500" />
        <span className="text-sm font-bold tracking-wider">BERANDA</span>
      </Link>
    </div>
  );
}
