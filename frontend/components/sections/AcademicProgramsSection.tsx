"use client";

import { useState } from "react";

interface ProgramItem {
  title: string;
  img: string;
  label: string;
  desc: string;
  link: string;
}

interface ProgramGroup {
  [key: string]: ProgramItem[];
}

export default function AcademicProgramsSection() {
  const [activeTab, setActiveTab] = useState<"D3" | "D4">("D3");

  const programs: ProgramGroup = {
    D3: [
      {
        title: "Administrasi Perkantoran",
        img: "/images/sections/program/programdummy.png",
        label: "Program D3",
        desc: "Administrasi Perkantoran Modern",
        link: "#",
      },
      {
        title: "Manajemen Pemasaran",
        img: "/images/sections/program/programdummy.png",
        label: "Program D3",
        desc: "Pemasaran Digital & Modern",
        link: "#",
      },
      {
        title: "Manajemen Perangkat Lunak",
        img: "/images/sections/program/programdummy.png",
        label: "Program D3",
        desc: "Software Development Foundation",
        link: "#",
      },
    ],
    D4: [
      {
        title: "Teknologi Rekayasa Perangkat Lunak",
        img: "/images/sections/program/programdummy.png",
        label: "Program D4",
        desc: "Advanced Software Engineering",
        link: "#",
      },
      {
        title: "Teknologi Produksi Multimedia",
        img: "/images/sections/program/programdummy.png",
        label: "Program D4",
        desc: "Creative Digital Content",
        link: "#",
      },
    ],
  };

  return (
    <section className="w-full py-24 bg-white flex flex-col items-center">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center">
        Program <span className="text-orange-500">Akademik</span>
      </h2>

      <p className="max-w-2xl text-center text-gray-500 mt-4 text-sm md:text-sm">
        Menjadi politeknik vokasi terdepan yang unggul dan mampu mencetak insan
        terampil berakhlak dengan penguasaan teknologi serta kontribusi global.
      </p>

      {/* Tabs */}
      <div className="flex gap-6 mt-10">
        {(["D3", "D4"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-w-[180px] py-3 rounded-full border transition-all duration-300 font-semibold text-base
        ${
          activeTab === tab
            ? "bg-orange-500 text-white border-orange-500 shadow-lg"
            : "border-orange-500 text-orange-500 hover:bg-orange-50"
        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Program Grid */}
      <div className="grid md:grid-cols-3 gap-12 mt-16 w-full max-w-7xl px-6">
        {programs[activeTab].map((prog, idx) => (
          <div
            key={idx}
            className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer h-[480px] flex items-end p-8 text-white transition-all duration-300 hover:scale-[1.03]"
            style={{
              backgroundImage: `url(${prog.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/20 opacity-70 group-hover:opacity-90 transition-all duration-500"></div>

            {/* BADGE (Hidden by default, show on hover) */}
            <span
              className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow 
              opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            >
              {prog.label}
            </span>

            {/* CONTENT */}
            <div className="relative z-10 w-full">
              {/* TITLE (Always visible) */}
              <h3 className="text-2xl font-semibold drop-shadow-lg">
                {prog.title}
              </h3>

              {/* DESC + LINK (Hidden by default) */}
              <div className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 mt-2">
                <p className="text-sm opacity-90">{prog.desc}</p>

                <a
                  href={prog.link}
                  className="text-sm mt-4 inline-block underline decoration-1 hover:text-orange-300 transition"
                >
                  Pelajari Lebih Lanjut ↗
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
