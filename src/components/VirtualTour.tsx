"use client";

import React, { useState, useEffect } from "react";
// Import CSS bawaannya wajib agar fitur jalan
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

// Import Next Dynamic agar kita disable proses render dari Sisi Server
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

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
  <div className="flex flex-col items-center justify-center h-full min-h-[500px] w-full bg-slate-900 rounded-xl">
    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
    <p className="text-white mt-4 font-bold tracking-widest text-sm uppercase">
      Loading Virtual Tour
    </p>
  </div>
);

// Map of available scenes based on the copied directory
const SCENES = [
  { id: "v360-1", name: "Area 1", image: "/assets/360View/v360-1.jpg" },
  { id: "v360-2", name: "Area 2", image: "/assets/360View/v360-2.jpg" },
  { id: "v360-3", name: "Area 3", image: "/assets/360View/v360-3.jpg" },
  { id: "v360-4", name: "Area 4", image: "/assets/360View/v360-4.jpg" },
  { id: "v360-5", name: "Area 5", image: "/assets/360View/v360-5.jpg" },
  { id: "v360-6", name: "Area 6", image: "/assets/360View/v360-6.jpg" },
  { id: "v360-7", name: "Area 7", image: "/assets/360View/v360-7.jpg" },
  { id: "v360-8", name: "Area 8", image: "/assets/360View/v360-8.jpg" },
  { id: "v360-9", name: "Area 9", image: "/assets/360View/v360-9.jpg" },
  { id: "v360-10", name: "Area 10", image: "/assets/360View/v360-10.jpg" },
  { id: "v360-11", name: "Area 11", image: "/assets/360View/v360-11.jpg" },
];

export default function VirtualTour() {
  const [isClient, setIsClient] = useState(false);
  const [currentScene, setCurrentScene] = useState(SCENES[0]);

  // Pastikan komponen kita hanya berjalan di browser
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <LoadingScreen />;

  return (
    <div className="relative w-full h-[80vh] min-h-[600px] bg-slate-900 overflow-hidden shadow-2xl rounded-2xl group border border-border">
      {/* OVERLAY: Sidebar Navigasi Kiri */}
      <div className="absolute left-4 top-4 z-10 w-48 sm:w-64 max-h-[95%] bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 flex flex-col overflow-hidden text-white shadow-xl transition-all">
        <div className="bg-primary/90 p-4 flex justify-between items-center font-bold tracking-wider text-sm uppercase">
          NAVIGASI
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {SCENES.map((scene) => {
            const isActive = currentScene.id === scene.id;
            return (
              <button
                key={scene.id}
                onClick={() => setCurrentScene(scene)}
                className={`w-full p-3 hover:bg-white/10 text-left transition-all rounded-lg text-sm font-medium ${
                  isActive
                    ? "text-primary border-l-4 border-primary bg-white/5"
                    : "text-slate-200 border-l-4 border-transparent"
                }`}
              >
                {scene.name}
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
        navbar={["zoom", "move", "caption", "fullscreen"]}
      />

      {/* Caption Kanan Bawah */}
      <div className="absolute bottom-16 sm:bottom-6 right-4 z-10 bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl text-white font-medium border border-white/10 shadow-xl pointer-events-none">
        Melihat: <span className="text-primary ml-1">{currentScene.name}</span>
      </div>
    </div>
  );
}
