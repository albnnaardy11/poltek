"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#0F1B3D] pt-16 pb-24 text-white"
      style={{
        backgroundImage: "url('/images/program/patern_box.svg')",
        backgroundRepeat: "repeat",
        backgroundSize: "1500px",        // bisa kamu ubah sesuai kebutuhan
        opacity: 1,
      }}
    >
      {/* Overlay untuk memperhalus pattern */}
      <div className="absolute inset-0 bg-[#0F1B3D]/80 pointer-events-none" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div className="space-y-6">
          <span className="inline-block bg-[#F15A24]/10 text-[#F15A24] text-sm px-4 py-1 rounded-full border border-[#F15A24]/30">
            Program Vokasi Teknologi
          </span>

          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            Diploma III —
            <span className="block text-[#F15A24]">
              Rekayasa Perangkat Lunak
            </span>
          </h1>

          <p className="text-gray-300 leading-relaxed max-w-lg">
            Program studi vokasi yang mempersiapkan profesional muda
            untuk menjadi software engineer handal dengan keterampilan
            praktis dan siap kerja.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="#about"
              className="bg-[#F15A24] px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-orange-600 transition"
            >
              Pelajari Lebih Lanjut
            </Link>

            <Link
              href="/brosur.pdf"
              className="bg-white text-[#0F1B3D] px-6 py-3 rounded-xl font-semibold shadow-md border hover:bg-gray-100 transition"
            >
              Download Brosur
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative w-full">
          {/* Orange Icon */}
          <div className="absolute -top-4 -right-4 bg-[#F15A24] text-white p-3 rounded-full shadow-lg z-10">
            <span className="text-xl">&lt;/&gt;</span>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/images/program/hero-rpl.png"
              alt="RPL Hero"
              width={720}
              height={480}
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="relative mt-16 text-center space-y-3">
        <p className="text-gray-300 text-sm">Scroll ke bawah</p>

        <div className="w-5 h-8 mx-auto border-2 border-gray-300 rounded-full flex items-start justify-center overflow-hidden relative">
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-scrollDown" />
        </div>
      </div>

    </section>
  );
}
