"use client";

import { useState } from "react";

interface ProgramItem {
  title: string;
  img: string;
  label: string;
  desc: string;
  link: string;
  highlight?: boolean;
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
        highlight: true,
      },
      {
        title: "Manajemen Pemasaran",
        img: "/images/sections/program/programdummy.png",
        label: "Program D3",
        desc: "Pemasaran Digital & Modern",
        link: "#",
        highlight: true,
      },
      {
        title: "Manajemen Perangkat Lunak",
        img: "/images/sections/program/programdummy.png",
        label: "Program D3",
        desc: "Software Development Foundation",
        link: "#",
        highlight: true,
      },
    ],
    D4: [
      {
        title: "Teknologi Rekayasa Perangkat Lunak",
        img: "/images/sections/program/programdummy.png",
        label: "Program D4",
        desc: "Advanced Software Engineering",
        link: "#",
        highlight: true,
      },
      {
        title: "Teknologi Produksi Multimedia",
        img: "/images/sections/program/programdummy.png",
        label: "Program D4",
        desc: "Creative Digital Content",
        link: "#",
        highlight: true,
      },
    ],
  };

  return (
    <section className="w-full py-24 bg-white flex flex-col items-center">
      {/* Title */}
      <h2 className="text-4xl font-bold text-center">
        Program <span className="text-orange-500">Akademik</span>
      </h2>
      <p className="max-w-xl text-center text-gray-500 mt-3 text-sm">
        Menjadi politeknik vokasi terdepan yang unggul, terpercaya, dan mampu
        mencetak insan terampil berakhlak dengan penguasaan teknologi serta
        kontribusi global.
      </p>

      {/* Tabs */}
      <div className="flex gap-4 mt-10">
        {(["D3", "D4"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-10 py-2 rounded-full border transition-all duration-300 font-semibold text-sm ${
              activeTab === tab
                ? "bg-orange-500 text-white border-orange-500 shadow"
                : "border-orange-500 text-orange-500 hover:bg-orange-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Program Grid */}
      <div className="grid md:grid-cols-3 gap-12 mt-16 w-full max-w-7xl px-6">
        {programs[activeTab].map((prog: ProgramItem, idx: number) => (
          <div
            key={idx}
            className="relative rounded-3xl overflow-hidden shadow-lg group cursor-pointer h-[480px] flex items-end p-8 text-white transition-transform duration-300 hover:scale-[1.03]"
            style={{
              backgroundImage: `url(${prog.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Highlight Badge */}
            <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs px-3 py-1 rounded-full shadow">
              {prog.label}
            </span>

            {/* Content */}
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold drop-shadow-lg">
                {prog.title}
              </h3>

              <p className="text-sm opacity-90 mt-1">{prog.desc}</p>

              <a
                href={prog.link}
                className="text-sm mt-4 inline-block underline decoration-1 hover:text-orange-300 transition"
              >
                Pelajari Lebih Lanjut ↗
              </a>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/75 to-black/20"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
