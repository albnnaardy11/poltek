"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCompass3Line, RiPlayFill, RiArrowRightLine } from "react-icons/ri";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const CATEGORY_MAP: Record<string, string> = {
  lab: "Laboratorium",
  kelas: "Ruang Kelas",
  umum: "Fasilitas Umum",
  olahraga: "Olahraga",
};

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

export default function FacilityTourLanding({ facilities }: { facilities: Facility[] }) {
  const [count, setCount] = useState(0);
  const tourFacilities = facilities.filter((f) => f.isVirtualTour);

  // Animated counter
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
    <div className={`${jakarta.className} min-h-screen bg-[#090D1F]`}>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[100svh] pt-20 flex flex-col overflow-hidden">
        {/* BG Photo */}
        {heroImage && (
          <div className="absolute inset-0 z-0">
            <Image src={heroImage} alt="Hero" fill className="object-cover opacity-25" unoptimized />
          </div>
        )}
        {/* Gradient cover */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#090D1F]/70 via-[#090D1F]/60 to-[#090D1F] z-10" />

        {/* Grid dot pattern */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "44px 44px" }}
        />

        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F47920]/8 rounded-full blur-[150px] z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-700/8 rounded-full blur-[130px] z-10 pointer-events-none" />

        {/* ── Center content ── */}
        <div className="relative z-20 flex-1 flex items-center justify-center px-6 pb-20">
          <div className="text-center max-w-4xl w-full flex flex-col items-center gap-8 -mt-3">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#F47920] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/70">360° Immersive Experience</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-[6.5rem] font-black text-white leading-[1.05] tracking-tight"
            >
              Jelajahi Kampus<br />
              <span className="text-[#F47920]">Tanpa Batas</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-white/55 text-base lg:text-lg leading-relaxed max-w-md mx-auto"
            >
              Masuki setiap sudut lingkungan Politeknik Prestasi Prima melalui teknologi virtual tour 360° berkualitas tinggi, langsung dari kenyamanan layar Anda.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mt-2 w-full max-w-2xl mx-auto"
            >
              <Link
                href="/virtual-tour"
                className="inline-flex items-center justify-center gap-3 bg-[#F47920] hover:bg-orange-500 text-white w-full sm:w-auto px-14 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-[#F47920]/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <RiPlayFill className="text-xl" />
                Mulai Eksplorasi
              </Link>
              <a
                href="#explore"
                className="inline-flex items-center justify-center gap-3 bg-white/8 hover:bg-white/15 text-white w-full sm:w-auto px-14 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] border border-white/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                Daftar Fasilitas
              </a>
            </motion.div>

            {/* ── EXPLORE MAP — Moved inside hero content ── */}
            <motion.a
              href="#explore"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-8 flex flex-col items-center gap-4 group cursor-pointer select-none w-full max-w-md mx-auto z-30"
            >
              <div className="flex items-center justify-center gap-6 w-full">
                <motion.div
                  animate={{ scaleX: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-px bg-gradient-to-r from-transparent to-white/30 origin-right"
                />
                <span className="text-[11px] font-black uppercase tracking-[0.7em] text-white/40 group-hover:text-white/80 transition-colors duration-300">
                  Explore Map
                </span>
                <motion.div
                  animate={{ scaleX: [0.3, 1, 0.3] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-px bg-gradient-to-l from-transparent to-white/30 origin-left"
                />
              </div>
              {/* Staggered chevrons (Larger) */}
              <div className="flex flex-col items-center gap-1">
                {[0, 1].map((i) => (
                  <motion.svg
                    key={i}
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.25 }}
                    width="20" height="10" viewBox="0 0 14 8" fill="none"
                  >
                    <path d="M1 1L7 7L13 1" stroke="#F47920" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                ))}
              </div>
            </motion.a>

          </div>
        </div>
      </section>

      {/* ══════ STATS SECTION (Separated from Hero) ══════ */}
      <section className="relative z-20 w-full max-w-6xl mx-auto px-6 py-24 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { value: count.toString(), label: "Scene 360°" },
              { value: "4K", label: "HD Resolution" },
              { value: "24/7", label: "Online Akses" },
            ].map((s, index) => (
              <motion.div 
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="group relative flex flex-col items-center justify-center rounded-[2.5rem] bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-white/20 backdrop-blur-xl px-4 py-12 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(244,121,32,0.2)]"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F47920]/0 to-[#F47920]/0 group-hover:from-[#F47920]/5 group-hover:to-transparent rounded-[2.5rem] transition-colors duration-500" />
                
                <div className="relative text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                  {s.value}
                </div>
                <div className="relative text-[11px] lg:text-xs font-black text-[#F47920] uppercase tracking-[0.4em] drop-shadow-md">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════ FACILITIES GRID ══════ */}
      <section id="explore" className="max-w-7xl mx-auto px-6 py-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-0.5 bg-[#F47920] rounded-full" />
              <span className="text-[#F47920] font-black uppercase tracking-[0.3em] text-[9px]">Immersional</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Sudut Pandang <span className="text-[#F47920]">Baru</span>
            </h2>
          </div>
          <p className="text-white/45 text-base lg:text-lg leading-relaxed max-w-md lg:text-right">
            Pilih lokasi yang ingin Anda telusuri secara detail. Setiap area dilengkapi informasi interaktif untuk memandu perjalanan Anda.
          </p>
        </motion.div>

        {/* 2-Col Grid */}
        {tourFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tourFacilities.map((facility, index) => {
              const tags: string[] = Array.isArray(facility.tags) ? facility.tags : [];
              return (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.5, delay: (index % 2) * 0.12 }}
                  className="group relative rounded-[1.75rem] overflow-hidden bg-[#111827] border border-white/10 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/50 cursor-pointer"
                >
                  {/* ── Full-card image ── */}
                  <div className="relative h-[340px] overflow-hidden">
                    <Image
                      src={facility.tourImage || facility.image || "/images/placeholder.jpg"}
                      alt={facility.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />

                    {/* Dark gradient — heavier at bottom for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                    {/* ── Compass icon — top right ── */}
                    <div className="absolute top-5 right-5 w-9 h-9 bg-white/10 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white/80 group-hover:bg-[#F47920]/20 group-hover:border-[#F47920]/40 group-hover:text-[#F47920] transition-all duration-300">
                      <RiCompass3Line className="text-base" />
                    </div>

                    {/* ── Tags row — lower inside image ── */}
                    <div className="absolute bottom-[90px] left-6 flex flex-wrap gap-2">
                      {tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* ── Title + subtitle — bottom of image ── */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
                      <h3 className="text-2xl font-black text-white leading-tight tracking-tight">
                        {facility.title}
                      </h3>
                      {facility.subtitle && (
                        <p className="text-white/45 text-sm font-medium mt-1 line-clamp-1">
                          {facility.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ── Bottom action bar ── */}
                  <div className="flex items-center justify-between px-6 py-4 border-t border-white/8 bg-[#0d1117]">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                      Inisiasi Tour
                    </span>
                    <Link
                      href={`/virtual-tour${facility.sceneId ? `?scene=${facility.sceneId}` : ""}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 text-[#F47920] hover:text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 group/cta"
                    >
                      Launch 360°
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-[#F47920]/50 group-hover/cta:bg-[#F47920]/20 transition-all duration-200">
                        <RiArrowRightLine className="text-xs -rotate-45" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <RiCompass3Line className="text-7xl text-white/10 mb-6 animate-pulse" />
            <p className="text-white/20 font-black uppercase tracking-widest text-sm">
              Belum ada fasilitas Virtual Tour tersedia.
            </p>
            <p className="text-white/10 text-xs mt-2">Tambahkan dari panel admin → Fasilitas</p>
          </div>
        )}
      </section>

      {/* ══════ CTA ══════ */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] overflow-hidden bg-[#0E1328] border border-white/8 py-24 px-8 text-center"
        >
          {/* Decorative glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F47920]/12 blur-[100px] pointer-events-none rounded-full" />
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "36px 36px" }}
          />

          <div className="relative z-10">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Mulai Masa Depan Anda<br />
              <span className="text-[#F47920] italic">Di Sini</span>
            </h2>
            <p className="text-white/45 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Bergabunglah dengan ribuan mahasiswa terbaik dan buktikan sendiri fasilitas kelas dunia yang siap mendukung perjalanan akademik Anda bersama kami.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/pendaftaran"
                className="inline-flex items-center gap-3 bg-[#F47920] hover:bg-orange-500 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#F47920]/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="/program"
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border border-white/10 transition-all duration-300 hover:-translate-y-0.5"
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
