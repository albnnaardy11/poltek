"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import { 
  RiCompass3Fill, 
  RiFocus3Line, 
  RiArrowRightUpLine
} from "react-icons/ri";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

interface TourLocation {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
}

const TOUR_LOCATIONS: TourLocation[] = [
  {
    id: "halaman-depan",
    title: "Halaman Depan",
    subtitle: "Gerbang Utama Kampus",
    description: "Pintu masuk utama kampus Politeknik Prestasi Prima yang asri dan merepresentasikan wajah institusi kami.",
    image: "/images/tour360/halaman-depan.jpeg",
    tags: ["Gerbang Utama", "Area Publik"]
  },
  {
    id: "aula",
    title: "Aula Serbaguna",
    subtitle: "Pusat Kegiatan Kampus",
    description: "Aula luas untuk berbagai kegiatan akademik, seminar, serta event mahasiswa yang terintegrasi dengan berbagai fasilitas.",
    image: "/images/tour360/aula.jpeg",
    tags: ["Event Space", "Main Hall"]
  },
  {
    id: "kantin",
    title: "Kantin Digital",
    subtitle: "Food & Beverage",
    description: "Area relaksasi dan tempat berinteraksi mahasiswa dengan sajian kuliner lezat yang tertata bersih.",
    image: "/images/tour360/kantin.jpeg",
    tags: ["Food Court", "Hangout"]
  },
  {
    id: "kelas",
    title: "Ruang Kelas",
    subtitle: "Smart Learning Environment",
    description: "Ruang kelas modern dengan tempat duduk ergonomis yang mendukung kenyamanan belajar mengajar yang maksimal.",
    image: "/images/tour360/kelas.jpeg",
    tags: ["Smart Class", "Interactive"]
  },
  {
    id: "lab",
    title: "Laboratorium Komputer",
    subtitle: "High-Spec Digital Workshop",
    description: "Laboratorium berspesifikasi tinggi untuk praktik programming, desain, dan jaringan dengan koneksi internet cepat.",
    image: "/images/tour360/lab.jpeg",
    tags: ["IT Lab", "Modern PC", "High Speed"]
  },
  {
    id: "mushola",
    title: "Mushola",
    subtitle: "Area Ibadah",
    description: "Fasilitas ibadah yang luas, bersih dan nyaman untuk mendukung kegiatan spiritual civitas akademika.",
    image: "/images/tour360/mushola.jpeg",
    tags: ["Spiritual", "Quiet Space"]
  },
  {
    id: "parkiran",
    title: "Area Parkir",
    subtitle: "Fasilitas Kendaraan",
    description: "Area parkir luas dengan kapasitas besar yang dijaga oleh petugas keamanan selama jam operasional kampus (24 Jam).",
    image: "/images/tour360/parkiran.jpeg",
    tags: ["Secure", "Spacious"]
  },
  {
    id: "ruang-staff",
    title: "Ruang Staff",
    subtitle: "Pusat Layanan Administrasi",
    description: "Ruang kerja staf modern dan pusat pelayanan terpadu administrasi akademik bagi kebutuhan mahasiswa.",
    image: "/images/tour360/ruang-staff.jpeg",
    tags: ["Admin", "Layanan Terpadu"]
  }
];

export default function FacilityVirtualTourPage() {
  return (
    <main className={`${jakarta.className} min-h-screen bg-[#080c1b] text-white selection:bg-[#F15A24]/30`}>
      {/* 1. HERO SECTION - Immersive Design */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Parallax Image */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="/images/tour360/hero.jpg"
            alt="Virtual Tour Politeknik"
            fill
            priority
            className="object-cover opacity-60 brightness-75 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c1b]/80 via-transparent to-[#080c1b]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c1b] via-transparent to-[#080c1b]/80" />
        </motion.div>

        {/* Animated HUD Elements */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#F15A24]/10 rounded-full"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 mb-8 mx-auto">
              <RiCompass3Fill className="text-[#F15A24] text-xl animate-pulse" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">360° Immersive Experience</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.05] tracking-tight">
              Jelajahi Kampus <br />
              <span className="bg-gradient-to-r from-[#F15A24] via-[#ff7c3d] to-[#F15A24] bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">Tanpa Batas</span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
              Masuki setiap sudut lingkungan Politeknik Prestasi Prima melalui teknologi virtual tour 360° berkualitas tinggi, langsung dari layar Anda.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Link 
                href="/virtual-tour"
                className="group relative bg-[#F15A24] text-white px-10 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl shadow-[#F15A24]/30 overflow-hidden"
              >
                <span className="relative z-10">Mulai Eksplorasi Cepat</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-0 opacity-10" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 cursor-pointer"
          onClick={() => document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Explore Map</span>
          <div className="w-1 h-12 bg-gradient-to-b from-[#F15A24] to-transparent rounded-full" />
        </motion.div>
      </section>

      {/* 2. EXPLORE SECTION - The Tour Grid */}
      <section id="explore-section" className="relative py-32 bg-[#080c1b]">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <div className="inline-flex items-center gap-2 text-[#F15A24] font-black uppercase tracking-widest text-xs mb-4">
                <span className="w-8 h-[2px] bg-[#F15A24]" />
                Interactive Map
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white">Sudut Pandang <span className="text-[#F15A24]">Baru</span></h2>
            </div>
            <p className="text-gray-400 max-w-md font-medium">
              Pilih lokasi yang ingin Anda telusuri secara detail. Saat ini seluruh tour terintegrasi ke dalam satu pengalaman 360° yang imersif.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
            {TOUR_LOCATIONS.map((loc, idx) => (
              <motion.div
                key={loc.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link
                  href={`/virtual-tour?scene=${loc.id}`}
                  className="group block relative rounded-[2rem] overflow-hidden bg-[#1D234E]/30 border border-white/5 hover:border-[#F15A24]/30 transition-all duration-500 cursor-pointer h-full"
                >
                  {/* Image Wrap */}
                  <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                    <Image
                      src={loc.image}
                      alt={loc.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080c1b] via-[#080c1b]/20 to-transparent" />
                    
                    {/* Floating Action Badge */}
                    <div className="absolute top-6 right-6 flex gap-2">
                      <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 group-hover:bg-[#F15A24] group-hover:text-white transition-all shadow-xl">
                        <RiFocus3Line className="text-2xl" />
                      </div>
                    </div>

                    {/* Content Over Post */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {loc.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black mb-2 group-hover:text-[#F15A24] transition-colors">{loc.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2 opacity-80">{loc.subtitle}</p>
                    </div>
                  </div>

                  {/* Hover Reveal Info */}
                  <div className="p-6 md:p-8 border-t border-white/5 bg-[#080c1b]/50 backdrop-blur-md">
                    <div className="flex items-center justify-between group/btn">
                      <span className="text-sm font-bold uppercase tracking-widest text-white/90">Inisiasi Tour</span>
                      <div className="flex items-center gap-2 text-[#F15A24] font-black">
                        <span className="text-xs">LAUNCH 360°</span>
                        <RiArrowRightUpLine className="text-xl transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION - Immersive End */}
      <section className="relative py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#F15A24]/5 to-transparent" />
        
        {/* Animated Background Logo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] z-0">
          <Image src="/images/logo_politeknik.png" alt="Logo" width={800} height={800} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-7xl font-black mb-8 leading-tight">
              Mulai Masa Depan Anda <br />
              <span className="text-[#F15A24]">Di Sini</span>
            </h2>
            <p className="text-gray-400 text-lg mb-12 font-medium"> Bergabunglah dengan institusi vokasi terbaik yang telah terbukti menghasilkan lulusan kompeten dengan fasilitas berstandar internasional. </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
               <Link href="https://wa.me/6285199328825" className="w-full sm:w-auto bg-[#F15A24] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-[#F15A24]/30 hover:scale-105 transition-transform">
                  Daftar Sekarang
               </Link>
               <Link href="/virtual-tour" className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                  Eksplorasi Fasilitas
               </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 6s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
