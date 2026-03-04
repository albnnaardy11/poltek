"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { 
  RiHospitalLine,
  RiFlaskLine,
  RiBook3Line,
  RiBuilding2Line,
  RiBasketballLine,
  RiSearch2Line,
  RiCloseLine,
  RiCheckDoubleLine,
  RiGroupLine,
  RiTimeLine,
  RiArrowRightUpLine
} from "react-icons/ri";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type Category = "all" | "lab" | "kelas" | "umum" | "olahraga";

interface Facility {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  capacity?: string;
  features: string[];
}

const CATEGORIES = [
  { id: "all", label: "Semua", icon: RiHospitalLine },
  { id: "lab", label: "Laboratorium", icon: RiFlaskLine },
  { id: "kelas", label: "Ruang Kelas", icon: RiBook3Line },
  { id: "umum", label: "Umum", icon: RiBuilding2Line },
  { id: "olahraga", label: "Olahraga", icon: RiBasketballLine },
];

export default function FacilityClient({ initialFacilities }: { initialFacilities: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const filteredFacilities = initialFacilities.filter(f => {
    const matchesCategory = activeCategory === "all" || f.category === activeCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className={`${jakarta.className} min-h-screen bg-white selection:bg-[#FF6B00] selection:text-white`}>
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-0 pb-16 lg:pt-8 lg:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,#FF6B0008_0%,transparent_50%)] -z-10" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] -z-10" />
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-[#FF6B00]/5 rounded-full blur-[180px] -z-10 animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 sm:gap-24 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="lg:col-span-7 order-1"
          >
            <motion.div variants={itemVariants} className="relative mb-8">
                <h1 className="flex flex-col items-center lg:items-start text-center lg:text-left tracking-tighter">
                   <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full mb-6 max-w-fit">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-[8px] sm:text-xs font-black text-orange-600 uppercase tracking-[0.2em]">World Class Facility</span>
                   </div>
                  <span className="text-4xl sm:text-7xl lg:text-9xl font-black text-[#020617] leading-[0.85]">
                     ULTRA <br className="sm:hidden" />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#020617] via-[#FF6B00] to-orange-500">FACILITIES</span>
                  </span>
               </h1>
            </motion.div>

            <motion.p variants={itemVariants} className="text-sm sm:text-2xl text-gray-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 sm:mb-14 border-l-0 lg:border-l-4 border-[#FF6B00] pl-0 lg:pl-6 text-center lg:text-left">
               Standardisasi <span className="text-[#020617] font-bold">Infrastruktur Teknologi</span> kelas dunia untuk melahirkan <span className="text-[#FF6B00] font-black italic">Digital Leaders</span> masa depan.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center gap-10 sm:gap-14">
              <Link
                href="#explore"
                className="group relative inline-flex items-center gap-4 sm:gap-6 bg-[#020617] text-white pl-6 sm:pl-10 pr-2 sm:pr-4 py-2 sm:py-4 rounded-full shadow-2xl shadow-[#020617]/20 hover:shadow-[#FF6B00]/20 transition-all duration-700 active:scale-95 border border-white/5"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 <span className="relative z-10 font-black text-[12px] uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all duration-500">Discover Spaces</span>
                 <div className="relative z-10 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#FF6B00] transition-colors duration-500 overflow-hidden">
                    <RiArrowRightUpLine className="text-2xl group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500 absolute" />
                    <RiArrowRightUpLine className="text-2xl -translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 absolute" />
                 </div>
              </Link>

                <div className="flex items-center gap-8 sm:gap-12">
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                     <span className="text-3xl sm:text-5xl font-black text-[#020617] leading-none mb-1">12<span className="text-[#FF6B00]">+</span></span>
                     <span className="text-[7px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Master Labs</span>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                     <span className="text-3xl sm:text-5xl font-black text-[#020617] leading-none mb-1">24<span className="text-[#FF6B00]">h</span></span>
                     <span className="text-[7px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Digital Hub</span>
                  </div>
                </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 relative order-2"
          >
            <div className="relative z-10 rounded-[2rem] sm:rounded-[4rem] overflow-hidden group max-w-[300px] sm:max-w-none mx-auto lg:mx-0">
               <Image
                 src="/images/facility/modelfacility.png"
                 alt="Elite Facility Visual"
                 width={1000}
                 height={1000}
                 className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-[3s]"
                 priority
                 unoptimized
               />
            </div>
            <div className="absolute -inset-10 border-2 border-dashed border-gray-100 rounded-[5rem] -z-10 animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-0 bg-[#FF6B00]/5 rounded-full blur-[100px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* ================= FILTER SECTION ================= */}
      <section id="explore" className="max-w-7xl mx-auto px-6 mb-20 relative z-20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={itemVariants}
          className="bg-[#050A1F] rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(2,6,23,0.4)] p-6 sm:p-12 lg:p-16 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 blur-[100px] -z-10" />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-16">
             <div className="max-w-xl">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-1 bg-[#FF6B00] rounded-full" />
                   <span className="text-[#FF6B00] font-black text-[10px] uppercase tracking-[0.4em]">Smart Navigator</span>
                </div>
                <h3 className="text-4xl lg:text-5xl font-black text-white leading-tight">Cari & Filter <br /> Fasilitas Impian</h3>
             </div>
             
              <div className="relative flex-1 max-w-2xl group">
                <input
                  type="text"
                  placeholder="Cari Fasilitas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl sm:rounded-[2rem] py-4 sm:py-6 pl-14 sm:pl-18 pr-6 sm:pr-10 focus:bg-white/10 focus:border-[#FF6B00] transition-all outline-none font-bold text-white text-base sm:text-lg placeholder-white/20 shadow-inner"
                />
                <RiSearch2Line className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 text-[#FF6B00] group-hover:scale-110 transition-transform" />
              </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-start">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  relative flex items-center gap-3 sm:gap-4 px-6 sm:px-10 py-3 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] font-bold text-[8px] sm:text-[10px] uppercase tracking-[0.15em] transition-all duration-500
                  ${activeCategory === cat.id 
                    ? 'bg-[#FF6B00] text-white shadow-[0_20px_40px_-10px_rgba(255,107,0,0.5)]' 
                    : 'bg-white/5 text-white/40 hover:text-white border border-white/10'
                  }
                `}
              >
                {activeCategory === cat.id && (
                   <motion.div 
                     layoutId="activeFilterBg"
                     className="absolute inset-0 bg-[#FF6B00] rounded-[2rem] -z-10"
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                )}
                <cat.icon className={`text-2xl ${activeCategory === cat.id ? 'text-white' : 'text-[#FF6B00]'}`} />
                <span>{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ================= FACILITIES GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
           <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-2 h-6 bg-[#FF6B00] rounded-full" />
                 <span className="text-[#020617]/40 font-bold text-[10px] uppercase tracking-[0.3em]">Integrated Campus</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-[#020617] tracking-tighter leading-none mb-6">
                Eksplorasi <br />
                <span className="text-[#FF6B00]">Infrastruktur</span>
              </h2>
           </div>
           <div className="px-6 py-3 bg-white rounded-xl shadow-xs border border-gray-100">
              <span className="text-[10px] font-bold text-[#020617] uppercase tracking-wider">{filteredFacilities.length} Fasilitas</span>
           </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeCategory}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            exit="hidden"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-8"
          >
            {filteredFacilities.map((facility: any) => (
              <motion.div
                key={facility.id}
                variants={itemVariants}
                onClick={() => setSelectedFacility(facility)}
                className="group cursor-pointer bg-white rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] transition-shadow duration-500 border border-gray-50 flex flex-col h-full"
              >
                <motion.div className="relative h-72 rounded-[2.5rem] overflow-hidden mb-8">
                  <Image src={facility.image || "/images/placeholder.jpg"} alt={facility.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" unoptimized />
                  <div className="absolute top-5 left-5 z-20">
                     <div className="bg-[#020617]/40 backdrop-blur-xl border border-white/20 whitespace-nowrap px-4 py-2 rounded-full flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">
                           {CATEGORIES.find(c => c.id === facility.category)?.label || facility.category}
                        </span>
                     </div>
                  </div>
                  <div className="absolute bottom-5 right-5 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#020617] shadow-xl translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                    {(() => {
                      const CatIcon = CATEGORIES.find(c => c.id === facility.category)?.icon || RiHospitalLine;
                      return <CatIcon className="text-xl" />;
                    })()}
                  </div>
                </motion.div>

                <div className="px-4 pb-4 flex flex-col flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-[#020617] mb-3 sm:mb-4 group-hover:text-[#FF6B00] transition-colors duration-300 tracking-tight leading-tight">{facility.title}</h3>
                  <p className="text-gray-400 text-sm font-semibold leading-relaxed mb-8 line-clamp-3">{facility.description.replace(/<[^>]*>?/gm, '')}</p>
                  <div className="mt-auto pt-10 border-t border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100"><RiGroupLine className="text-lg" /></div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Capacity</span>
                            <span className="text-[12px] font-bold text-[#020617] uppercase tracking-wide leading-none">{facility.capacity || "N/A"}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-4 border-l border-gray-100 pl-4 ml-4">
                         <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100"><RiBuilding2Line className="text-lg" /></div>
                         <div className="flex flex-col">
                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1.5">Quantity</span>
                            <span className="text-[12px] font-bold text-[#020617] uppercase tracking-wide leading-none">{facility.quantity || 1} Unit</span>
                         </div>
                      </div>
                     <div className="group/cta relative">
                        <div className="relative flex items-center bg-[#020617] rounded-full p-1 w-12 group-hover/cta:w-36 group-hover/cta:bg-[#FF6B00] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white transition-transform duration-500 group-hover/cta:rotate-45">
                              <RiArrowRightUpLine className="text-xl" />
                           </div>
                           <span className="text-[9px] font-black text-white uppercase tracking-[0.2em] ml-3 whitespace-nowrap opacity-0 group-hover/cta:opacity-100 transition-all duration-300 delay-100">View Space</span>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredFacilities.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-48 bg-gray-50 rounded-[5rem] border-4 border-dashed border-gray-100">
            <h3 className="text-5xl font-black text-[#020617] mb-4">No Match Found</h3>
            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-[10px]">Try adjusting your search terms</p>
          </motion.div>
        )}
      </section>
      
      {/* 360 VIRTUAL TOUR CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-32 sm:pb-24">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(2,6,23,0.3)] min-h-[450px] sm:min-h-[550px] flex items-center bg-[#050A1F]">
          <div className="absolute inset-0 opacity-40">
            <Image src="/images/facility/360.jpeg" alt="360 Virtual Tour" fill className="object-cover group-hover:scale-105 transition-transform duration-[3s]" unoptimized />
          </div>
          <div className="absolute -top-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 bg-[#FF6B00]/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse" />
          <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-24 text-center z-10 py-12 sm:py-20">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-3xl px-6 py-2.5 rounded-full border border-white/10 mb-10">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,1)] animate-ping" />
              <span className="text-white font-black uppercase tracking-[0.3em] text-[10px]">Immersive Experience</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1] mb-6 sm:mb-8 tracking-tighter">Eksplorasi Kampus <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-orange-500">Virtual 360°</span></h2>
            <Link href="/facility-tour">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center gap-4 sm:gap-10 bg-white/5 backdrop-blur-2xl border border-white/10 hover:border-white/20 pl-6 sm:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 rounded-full transition-shadow duration-500 overflow-hidden shadow-2xl group/cta2">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-orange-400 -translate-x-full group-hover/cta2:translate-x-0 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                  <span className="relative z-10 text-white font-black text-[9px] sm:text-[11px] uppercase tracking-[0.3em] group-hover:tracking-[0.5em] transition-all duration-500">Mulai Jelajah</span>
                  <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center text-[#FF6B00] shadow-xl transition-all duration-500 group-hover/cta2:rotate-45 group-hover/cta2:scale-110"><RiArrowRightUpLine className="text-2xl sm:text-3xl" /></div>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* MODAL & DETAILS */}
      <AnimatePresence>
        {selectedFacility && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div onClick={() => setSelectedFacility(null)} className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 40 }} className="relative w-full max-w-6xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh] lg:max-h-[85vh] z-10">
              <button onClick={() => setSelectedFacility(null)} className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-xl hover:bg-[#FF6B00] hover:text-white rounded-full text-[#020617] transition-all duration-300 flex items-center justify-center border border-black/5 group"><RiCloseLine className="text-xl sm:text-2xl group-hover:rotate-90 transition-transform" /></button>
              <div className="lg:w-1/2 relative h-[350px] lg:h-auto overflow-hidden">
                <Image src={selectedFacility.image || "/images/placeholder.jpg"} alt={selectedFacility.title} fill className="object-cover" unoptimized />
                <div className="absolute bottom-10 left-10 right-10">
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-4"><RiTimeLine className="text-[#FF6B00]" /><span className="text-[10px] font-black text-white uppercase tracking-widest">Akses Mahasiswa</span></div>
                   <h3 className="text-3xl font-black text-white leading-tight">{selectedFacility.title}</h3>
                </div>
              </div>
              <div className="lg:w-1/2 p-8 lg:p-20 overflow-y-auto bg-white custom-scrollbar">
                <div className="max-w-xl">
                  <div className="flex items-center gap-3 mb-8"><div className="w-2 h-8 bg-[#FF6B00] rounded-full" /><span className="text-gray-400 font-black text-[10px] uppercase tracking-[0.3em]">{selectedFacility.category}</span></div>
                  <div className="prose prose-orange max-w-none text-gray-500 font-semibold mb-12" dangerouslySetInnerHTML={{ __html: selectedFacility.description }} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-14">
                    <div className="bg-[#050A1F] p-8 rounded-[2.5rem] text-white">
                      <p className="text-[10px] uppercase opacity-50 mb-2">Capacity</p>
                      <p className="text-xl font-black">{selectedFacility.capacity || "N/A"}</p>
                    </div>
                  </div>
                  <div className="mb-16">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase mb-8 tracking-widest">Fasilitas Ekstra</h4>
                    <div className="flex flex-wrap gap-4">
                      {selectedFacility.features?.map((f: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 px-5 py-3 rounded-2xl text-[10px] font-black uppercase text-slate-700">
                           <RiCheckDoubleLine className="text-orange-500" /> {f}
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedFacility.isVirtualTour && (
                    <Link href={`/facility-tour?scene=${selectedFacility.sceneId}`} className="w-full bg-[#FF6B00] text-white py-6 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">Mulai Virtual Tour</Link>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
