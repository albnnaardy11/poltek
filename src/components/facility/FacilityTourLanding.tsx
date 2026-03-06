"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RiCompass3Line, RiPlayFill, RiArrowRightLine } from "react-icons/ri";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface Facility {
  id: string;
  title: string;
  subtitle?: string | null;
  category: string;
  description: string;
  image?: string | null;
  tourImage?: string | null;
  capacity?: string | null;
  sceneId?: string | null;
  isVirtualTour: boolean;
  tags?: any;
}

// ── OPTIMIZED ANIMATION VARIANTS (Hardware Accelerated, No CPU Bottlenecks) ── 
const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1]; // CSS easeOutCubic

export default function FacilityTourLanding({ facilities }: { facilities: Facility[] }) {
  const [count, setCount] = useState(0);
  const tourFacilities = facilities.filter((f) => f.isVirtualTour);

  // Animated counter for "Scene 360"
  useEffect(() => {
    let current = 0;
    const target = tourFacilities.length;
    if (target === 0) return;
    const timer = setInterval(() => {
      current = Math.min(current + 1, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 80);
    return () => clearInterval(timer);
  }, [tourFacilities.length]);

  const heroImage = tourFacilities[0]?.tourImage || tourFacilities[0]?.image;

  return (
    <div className={`${jakarta.className} min-h-screen bg-[#090D1F] selection:bg-[#F47920]/30`}>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[100svh] pt-20 flex flex-col overflow-hidden">
        {/* BG Photo */}
        {heroImage && (
          <motion.div 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: smoothEase }}
            className="absolute inset-0 z-0"
          >
            <Image 
              src={heroImage} 
              alt="Hero Preview" 
              fill 
              priority
              className="object-cover opacity-25 object-center" 
              unoptimized 
            />
          </motion.div>
        )}
        
        {/* Gradient cover base */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D1F]/80 via-[#090D1F]/60 to-[#090D1F] z-10" />

        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }}
        />

        {/* Glow orbs - Optimized with Hardware Accelerated Radial Gradients (No heavy CSS blur) */}
        <div 
          className="absolute top-0 right-0 w-[800px] h-[800px] z-10 pointer-events-none" 
          style={{ background: "radial-gradient(circle, rgba(244,121,32,0.12) 0%, rgba(244,121,32,0) 70%)" }}
        />
        <div 
          className="absolute bottom-0 left-0 w-[700px] h-[700px] z-10 pointer-events-none" 
          style={{ background: "radial-gradient(circle, rgba(67,56,202,0.15) 0%, rgba(67,56,202,0) 70%)" }}
        />

        {/* ── Center content ── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-6 pb-20">
          <div className="text-center max-w-4xl w-full flex flex-col items-center gap-7 -mt-6">
            
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl shadow-black/20"
            >
              <span className="w-2 h-2 rounded-full bg-[#F47920] animate-pulse glow-shadow" style={{boxShadow: "0 0 10px #F47920"}} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">360° Immersive Experience</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: 0.2 }}
              className="text-5xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] font-black text-white leading-[1.05] tracking-tight"
            >
              Jelajahi Kampus<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47920] to-orange-300 drop-shadow-lg">Tanpa Batas</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: 0.3 }}
              className="text-white/60 text-base lg:text-lg leading-relaxed max-w-lg mx-auto font-medium"
            >
              Masuki setiap sudut lingkungan Politeknik Prestasi Prima melalui teknologi virtual tour 360° interaktif!
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: smoothEase, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full max-w-xl mx-auto"
            >
              <Link
                href="/virtual-tour"
                className="inline-flex items-center justify-center gap-3 bg-[#F47920] hover:bg-orange-500 text-white w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#F47920]/25 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <RiPlayFill className="text-lg" />
                Mulai Eksplorasi
              </Link>
              <a
                href="#explore"
                className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Daftar Fasilitas
              </a>
            </motion.div>

            {/* ── EXPLORE MAP ── */}
            <motion.a
              href="#explore"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease: smoothEase }}
              className="mt-10 flex flex-col items-center gap-4 group cursor-pointer select-none w-full max-w-sm mx-auto z-30 opacity-70 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center justify-center gap-5 w-full">
                <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1" />
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/50 group-hover:text-white/90 transition-colors duration-300">
                  Explore Map
                </span>
                <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1" />
              </div>
              <div className="flex flex-col items-center gap-1 group-hover:translate-y-1 transition-transform duration-300">
                <svg width="16" height="8" viewBox="0 0 14 8" fill="none" className="opacity-40 animate-pulse">
                  <path d="M1 1L7 7L13 1" stroke="#F47920" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="16" height="8" viewBox="0 0 14 8" fill="none" className="opacity-80">
                  <path d="M1 1L7 7L13 1" stroke="#F47920" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </motion.a>

          </div>
        </div>
      </section>

      {/* ══════ STATS SECTION ══════ */}
      <section className="relative z-20 w-full max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { value: count.toString(), label: "Scene 360°" },
            { value: "4K", label: "HD Resolution" },
            { value: "24/7", label: "Online Akses" },
          ].map((s, idx) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: smoothEase }}
              className="group flex flex-col items-center justify-center rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 px-4 py-8 sm:py-12 transition-all duration-300"
            >
              <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter mb-2 group-hover:scale-105 group-hover:text-[#F47920] transition-all duration-500">
                {s.value}
              </div>
              <div className="text-[10px] font-black text-white/40 group-hover:text-[#F47920]/80 uppercase tracking-[0.2em] transition-colors duration-300">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ FACILITIES GRID ══════ */}
      <section id="explore" className="relative max-w-7xl mx-auto px-6 py-20 lg:py-24">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, ease: smoothEase }}
           className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-1 bg-[#F47920] rounded-full" />
              <span className="text-[#F47920] font-black uppercase tracking-[0.2em] text-[10px]">Immersive View</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              Sudut Pandang <span className="text-[#F47920]">Baru</span>
            </h2>
          </div>
          <p className="text-white/45 text-sm sm:text-base leading-relaxed max-w-md md:text-right font-medium">
            Pilih area kampus yang ingin ditelusuri. Jelajahi fasilitas modern Politeknik Prestasi Prima secara lebih dekat dan nyata.
          </p>
        </motion.div>

        {tourFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {tourFacilities.map((facility, index) => {
              const tags: string[] = Array.isArray(facility.tags) ? facility.tags : [];
              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                  transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: smoothEase }}
                  className="group flex flex-col rounded-[2rem] overflow-hidden bg-[#121826] border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 shadow-2xl shadow-black/40 cursor-pointer"
                >
                  {/* Aspect video ensures image holds its shape perfectly and lazy loads properly */}
                  <div className="relative w-full aspect-video bg-black/50 overflow-hidden">
                    <Image
                      src={facility.tourImage || facility.image || "/images/placeholder.jpg"}
                      alt={facility.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized={true}
                    />

                    {/* Simpler Gradient overlay (faster gpu render) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                    <div className="absolute top-5 right-5 h-8 px-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/90 font-bold text-xs tracking-widest gap-2 group-hover:bg-[#F47920]/90 group-hover:border-[#F47920] transition-colors duration-300">
                      <RiCompass3Line className="text-sm" />
                      <span>360°</span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-10">
                       <div className="flex flex-wrap gap-2 mb-3">
                        {tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                        {facility.title}
                      </h3>
                      {facility.subtitle && (
                        <p className="text-white/60 text-sm font-medium mt-1 line-clamp-1">
                          {facility.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-5 bg-[#121826] flex-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/50 transition-colors">
                      Inisiasi Tour
                    </span>
                    <Link
                      href={`/virtual-tour${facility.sceneId ? `?scene=${facility.sceneId}` : ""}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-[#F47920] group-hover:text-orange-400 font-black text-[11px] uppercase tracking-[0.15em] transition-colors duration-200"
                    >
                      Launch 360°
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#F47920]/50 group-hover:bg-[#F47920]/20 transition-colors duration-200">
                        <RiArrowRightLine className="text-xs group-hover:-rotate-45 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl bg-white/[0.02]"
          >
            <RiCompass3Line className="text-6xl text-white/10 mb-4 animate-pulse" />
            <p className="text-white/30 font-bold uppercase tracking-widest text-sm">
              Belum ada fasilitas Virtual Tour.
            </p>
          </motion.div>
        )}
      </section>

      {/* ══════ CTA ══════ */}
      <section className="relative max-w-7xl mx-auto px-6 pb-24">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "0px 0px -50px 0px" }}
           transition={{ duration: 0.8, ease: smoothEase }}
           className="relative rounded-[2.5rem] overflow-hidden bg-[#0F1426] border border-white/5 py-16 px-6 sm:px-12 text-center shadow-2xl shadow-black/50"
        >
          {/* Performant Glow Effect */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-40" 
            style={{ background: "radial-gradient(ellipse at top, rgba(244,121,32,0.15) 0%, rgba(244,121,32,0) 70%)" }}
          />

          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              Mulai Masa Depan Anda <span className="text-[#F47920] italic">Di Sini</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-xl mx-auto mb-8 font-medium">
              Bergabunglah dengan ribuan mahasiswa terbaik dan buktikan sendiri fasilitas kelas dunia yang siap mendukung perjalanan akademik Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pendaftaran"
                className="inline-flex items-center justify-center bg-[#F47920] hover:bg-orange-500 text-white w-full sm:w-auto px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] shadow-lg shadow-[#F47920]/20 transition-all duration-300 hover:-translate-y-1"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/program"
                className="inline-flex items-center justify-center bg-white/5 hover:bg-white/10 text-white w-full sm:w-auto px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.15em] border border-white/10 transition-all duration-300 hover:-translate-y-1"
              >
                Info Program
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
