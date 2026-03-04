"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { RiBuilding4Line, RiGroupLine, RiTimeLine, RiToolsLine, RiCloseLine, RiCompass3Line, RiArrowRightLine } from "react-icons/ri";
import dynamic from "next/dynamic";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";

const ReactPhotoSphereViewer = dynamic(
  // @ts-ignore
  () => import("react-photo-sphere-viewer").then((mod) => mod.ReactPhotoSphereViewer),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full w-full bg-[#020617] text-white">Initializing 360 VIEWER...</div> }
);

interface Facility {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  tourImage?: string;
  image?: string;
  capacity?: string;
  features: string[];
  tags: string[];
  sceneId: string;
  isVirtualTour: boolean;
}

function TourContent({ facilities }: { facilities: any[] }) {
  const searchParams = useSearchParams();
  const initialScene = searchParams?.get("scene");

  const tourFacilities = facilities.filter(f => f.isVirtualTour);
  
  const [activeScene, setActiveScene] = useState<string>(
    initialScene && tourFacilities.some(f => f.sceneId === initialScene) 
      ? initialScene 
      : (tourFacilities[0]?.sceneId || "")
  );

  const currentFacility = tourFacilities.find(f => f.sceneId === activeScene);
  const [isDetailOpen, setIsDetailOpen] = useState(true);

  // Sync with URL
  useEffect(() => {
    if (initialScene && tourFacilities.some(f => f.sceneId === initialScene)) {
      setActiveScene(initialScene);
    }
  }, [initialScene]);

  const handleSceneChange = (sceneId: string) => {
    setActiveScene(sceneId);
    // Push state to browser without full reload if possible
    const url = new URL(window.location.href);
    url.searchParams.set('scene', sceneId);
    window.history.pushState({}, '', url);
  };

  if (tourFacilities.length === 0) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-center p-6">
        <div className="max-w-md">
          <RiCompass3Line className="text-7xl text-orange-500 mx-auto mb-6 animate-pulse" />
          <h1 className="text-3xl font-black text-white mb-4">No Tour Data</h1>
          <p className="text-gray-500 font-bold mb-8">Belum ada fasilitas yang dikonfigurasi untuk Virtual Tour 360°.</p>
          <Link href="/facility" className="bg-orange-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs">Kembali ke Fasilitas</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="fixed inset-0 bg-[#020617] overflow-hidden">
      {/* 360 VIEWER */}
      <div className="absolute inset-0 w-full h-full z-0">
        <ReactPhotoSphereViewer
          key={activeScene}
          src={currentFacility?.tourImage || currentFacility?.image || ""}
          height={"100%"}
          width={"100%"}
          defaultZoomLvl={0}
          navbar={false}
          // @ts-ignore
          autorotateDelay={3000}
          // @ts-ignore
          autorotateSpeed="1rpm"
        />
      </div>

      {/* TOP OVERLAY: NAVIGATION */}
      <div className="absolute top-0 left-0 right-0 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-none z-50">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 pointer-events-auto"
        >
          <Link href="/facility" className="group w-14 h-14 bg-white/10 backdrop-blur-3xl hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-all border border-white/10">
             <RiCloseLine className="text-2xl group-hover:rotate-90 transition-all duration-300" />
          </Link>
          <div className="flex flex-col">
             <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tighter leading-none">PRESTASI <span className="text-orange-500">EXPO</span></h1>
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mt-2">Immersive Experience</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center bg-white/10 backdrop-blur-3xl p-2 rounded-full border border-white/10 pointer-events-auto"
        >
          <div className="flex gap-1">
            {tourFacilities.map((loc) => (
              <button
                key={loc.sceneId}
                onClick={() => handleSceneChange(loc.sceneId)}
                className={`
                  px-4 sm:px-6 py-2 sm:py-3 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all
                  ${activeScene === loc.sceneId ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}
                `}
              >
                {loc.title}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* BOTTOM OVERLAY: INFO PANELS */}
      <AnimatePresence>
        {isDetailOpen && currentFacility && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="absolute bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col lg:flex-row items-end lg:items-center justify-between gap-8 z-40 pointer-events-none"
          >
            {/* LEFT: LOCATION INFO */}
            <div className="w-full lg:max-w-2xl bg-white/5 backdrop-blur-3xl rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 border border-white/10 pointer-events-auto">
               <div className="flex flex-wrap gap-3 mb-8">
                  {currentFacility.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-5 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest">{tag}</span>
                  ))}
               </div>

               <div className="space-y-4">
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-none">{currentFacility.title}</h2>
                  <p className="text-base sm:text-xl text-white/50 font-bold leading-relaxed">{currentFacility.subtitle}</p>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-12 mt-12 pt-12 border-t border-white/5">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3"><RiBuilding4Line className="text-orange-500 text-xl" /><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Space Type</span></div>
                     <p className="text-sm sm:text-lg font-black text-white uppercase">{currentFacility.category}</p>
                  </div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3"><RiGroupLine className="text-orange-500 text-xl" /><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Capacity</span></div>
                     <p className="text-sm sm:text-lg font-black text-white uppercase">{currentFacility.capacity || "N/A"}</p>
                  </div>
                  <div className="hidden sm:block space-y-4">
                     <div className="flex items-center gap-3"><RiTimeLine className="text-orange-500 text-xl" /><span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Operating</span></div>
                     <p className="text-sm sm:text-lg font-black text-white uppercase">24 Hours</p>
                  </div>
               </div>
            </div>

            {/* RIGHT: THUMBNAILS & CTA */}
            <div className="flex flex-col gap-6 pointer-events-auto">
               <div className="flex gap-4 p-4 bg-white/5 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] border border-white/10">
                  {tourFacilities.map((loc) => (
                    <button
                      key={loc.sceneId}
                      onClick={() => handleSceneChange(loc.sceneId)}
                      className={`
                        relative w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] overflow-hidden transition-all duration-500 border-2
                        ${activeScene === loc.sceneId ? 'border-orange-500 scale-110 shadow-2xl' : 'border-transparent opacity-40 hover:opacity-100'}
                      `}
                    >
                      <Image src={loc.tourImage || loc.image || "/images/placeholder.jpg"} alt={loc.title} fill className="object-cover" unoptimized />
                    </button>
                  ))}
               </div>
               
               <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="bg-white text-[#020617] px-8 sm:px-12 py-4 sm:py-6 rounded-full font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-4 hover:bg-orange-500 hover:text-white transition-all shadow-2xl"
               >
                  <span>Hide Details</span>
                  <RiArrowRightLine className="text-xl" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsDetailOpen(true)}
        className={`fixed bottom-10 right-10 w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-2xl z-50 transition-all duration-500 ${isDetailOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 ring-4 ring-orange-500/20 animate-bounce'}`}
      >
        <RiCompass3Line className="text-4xl" />
      </button>

      {/* AUDIO / INTERACTIVE HINTS */}
      <div className="fixed bottom-10 left-10 flex flex-col gap-4 pointer-events-auto z-50">
          <div className="flex items-center gap-4 group">
             <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white"><RiToolsLine /></div>
             <span className="text-[8px] font-black text-white/0 group-hover:text-white uppercase tracking-widest transition-all">Scroll to Zoom</span>
          </div>
      </div>
    </main>
  );
}

export default function TourClient({ initialFacilities }: { initialFacilities: any[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">Loading Tour...</div>}>
      <TourContent facilities={initialFacilities} />
    </Suspense>
  );
}
