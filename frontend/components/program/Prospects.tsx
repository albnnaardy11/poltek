"use client";

import { Cpu, Database, Code, Smartphone, Layout, Gamepad } from "lucide-react";

const data = [
  { icon: Cpu, title: "Front-End Developer", salary: "6–12 jt/bulan" },
  { icon: Database, title: "Back-End Developer", salary: "7–15 jt/bulan" },
  { icon: Code, title: "Full-Stack Developer", salary: "10–20 jt/bulan" },
  { icon: Smartphone, title: "Mobile Developer", salary: "8–15 jt/bulan" },
  { icon: Layout, title: "UI/UX Designer", salary: "6–12 jt/bulan" },
  { icon: Gamepad, title: "Game Developer", salary: "8–11 jt/bulan" },
];

export default function Prospects() {
  return (
    <section
  className="py-20 bg-[#0F1B3D] bg-[url('/images/program/patern_start.svg')] bg-no-repeat bg-contain bg-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Title */}
        <h3 className="text-3xl lg:text-4xl font-extrabold text-white text-center mb-12">
          Prospek Karir
        </h3>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.map((d) => (
            <div
              key={d.title}
              className="group bg-white/10 backdrop-blur rounded-2xl p-6 text-white border border-white/10 hover:-translate-y-2 transition shadow-lg"
            >
              <div className="flex items-start gap-4">

                {/* Icon Box */}
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center group-hover:opacity-90 transition">
                  <d.icon className="w-6 h-6" />
                </div>

                {/* Text */}
                <div>
                  <div className="font-semibold text-white">
                    {d.title}
                  </div>
                  <div className="text-sm mt-1 text-orange-400 font-medium">
                    {d.salary}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
