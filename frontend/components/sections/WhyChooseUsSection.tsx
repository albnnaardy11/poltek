"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const reasons = [
  {
    title: "Kurikulum Berbasis Industri",
    desc: "Program studi dirancang bersama dengan industri untuk memastikan relevansi dengan kebutuhan pasar kerja terkini.",
  },
  {
    title: "Fasilitas Modern & Lengkap",
    desc: "Laboratorium, bengkel industri, perpustakaan digital, dan workshop dengan peralatan terkini.",
  },
  {
    title: "Dosen Berpengalaman",
    desc: "Tenaga pengajar profesional dengan pengalaman industri dan sertifikasi internasional.",
  },
  {
    title: "Program Magang Terintegrasi",
    desc: "Kesempatan magang di perusahaan ternama sebagai bagian dari kurikulum pembelajaran.",
  },
  {
    title: "Sertifikasi Kompetensi",
    desc: "Dapatkan sertifikasi profesi yang diakui industri untuk meningkatkan daya saing karir.",
  },
  {
    title: "Biaya Terjangkau",
    desc: "Investasi pendidikan yang kompetitif dengan berbagai pilihan beasiswa dan cicilan.",
  },
  {
    title: "Jaringan Alumni Kuat",
    desc: "Bergabung dengan komunitas alumni yang tersebar di berbagai industri dan perusahaan.",
  },
  {
    title: "Akreditasi Unggul",
    desc: "Program studi terakreditasi dengan standar nasional dan internasional.",
  },
  {
    title: "Lokasi Strategis",
    desc: "Kampus mudah diakses dengan transportasi umum dan dekat dengan kawasan industri.",
  },
  {
    title: "Lulusan Siap Kerja",
    desc: "Track record penyerapan lulusan yang tinggi di industri dalam 6 bulan pertama.",
  },
];

export default function WhyChooseUsSection() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  return (
    <section className="w-full py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-14" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-[#0e162e]">10 Alasan Kuliah</span>{" "}
            <span className="text-[#0e162e]">di</span>{" "}
            <span className="text-[#FF6700]">Politeknik Kami</span>{" "}
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#0e162e]">
            Bergabunglah dengan ribuan mahasiswa yang telah memilih masa depan
            cerah bersama kami.
          </p>
        </div>

        {/* Grid Desktop */}
        <div className="hidden md:grid grid-cols-2 gap-6">
          {reasons.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-6 flex gap-4"
              data-aos="fade-up"
              data-aos-delay={index * 60}
            >
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <CheckCircleIcon className="w-7 h-7 text-purple-600" />
              </div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Version */}
        <div className="md:hidden space-y-4">
          {reasons.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex gap-3 items-start"
              data-aos="fade-up"
              data-aos-delay={index * 60}
            >
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                <CheckCircleIcon className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
