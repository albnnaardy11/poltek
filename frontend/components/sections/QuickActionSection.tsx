"use client";

import React from "react";

export default function PmbSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-24 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* === CARD 1 === */}
        <a
          href="#"
          className="
            group relative block h-[420px] rounded-2xl p-7 bg-white/90 backdrop-blur
            border border-zinc-200 shadow-md
            transition-all duration-500 
            hover:-translate-y-3 hover:shadow-2xl
            overflow-hidden flex flex-col
          "
        >
          {/* Highlight Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
          </div>

          {/* Icon Wrapper */}
          <div className="mb-6 mt-2">
            <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <i className="ri-macbook-line text-[#1D234E] text-5xl" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-[#111827] mb-3 leading-snug">
            Daftar Kuliah di Politeknik Prestasi Prima Bisa dari Mana Saja
          </h3>

          <p className="text-[15px] font-medium text-zinc-600 mb-4 leading-relaxed">
            Banyak pilihan beasiswa sampai dengan kuliah gratis 100%
          </p>

          <span className="mt-auto text-sm text-[#1D234E] font-semibold group-hover:underline">
            Info Beasiswa →
          </span>
        </a>

        {/* === CARD 2 === */}
        <a
          href="#"
          className="
            group relative block h-[420px] rounded-2xl p-7 
            bg-[#1D234E] text-white shadow-md
            transition-all duration-500
            hover:-translate-y-3 hover:shadow-2xl
            overflow-hidden flex flex-col
          "
        >
          {/* Animated Shine Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/40 rounded-2xl transition-all duration-500" />

          {/* Moving Gradient Light */}
          <div className="absolute -inset-10 opacity-0 group-hover:opacity-40 bg-[radial-gradient(circle_at_top_right,white,transparent_40%)] transition-all duration-700" />

          <div className="mb-6 mt-2">
            <div className="w-20 h-20 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <i className="ri-wallet-line text-white text-5xl" />
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3 leading-snug">
            Kuliah di Politeknik Prestasi Prima Tidak Mahal
          </h3>

          <p className="text-[15px] font-medium text-white/80 mb-4 leading-relaxed">
            Cek biaya perkuliahan disini
          </p>

          <span className="mt-auto text-sm text-white font-semibold group-hover:underline">
            Info Biaya Kuliah →
          </span>
        </a>

        {/* === CARD 3 === */}
        <a
          href="#"
          className="
            group relative block h-[420px] rounded-2xl p-7 
            bg-gradient-to-br from-[#ff7a00] to-[#ff8f2a]
            text-white shadow-md
            transition-all duration-500
            hover:-translate-y-3 hover:shadow-2xl
            overflow-hidden flex flex-col
          "
        >
          {/* Diagonal Shine */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-linear-to-br from-white/10 to-transparent transition duration-700" />

          <div className="mb-6 mt-2">
            <div className="w-20 h-20 rounded-xl bg-black/10 flex items-center justify-center group-hover:scale-110 transition duration-300">
              <i className="ri-file-text-line text-white text-5xl" />
            </div>
          </div>

          <h3 className="text-xl font-bold mb-3 leading-snug">
            Sudah Siap Daftar Kuliah di Politeknik Prestasi Prima?
          </h3>

          <p className="text-[15px] font-medium text-white/90 mb-4 leading-relaxed">
            Klik tombol di bawah ini untuk melakukan pendaftaran online
          </p>

          <span className="mt-auto text-sm font-semibold group-hover:underline">
            Info PMB Prestasi Prima →
          </span>
        </a>
      </div>
    </section>
  );
}
