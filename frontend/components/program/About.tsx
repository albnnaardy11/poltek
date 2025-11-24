"use client";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-[#F15A24]">
          Tentang Program Studi
        </h2>

        {/* Card Container */}
        <div className="mt-10 bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          {/* Fake Browser Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-red-400 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
            <span className="w-3 h-3 bg-green-400 rounded-full"></span>

            <span className="ml-3 text-sm font-semibold text-orange-600">
              innovation.code
            </span>
          </div>

          {/* Description Text */}
          <p className="text-gray-700 leading-relaxed">
            Program Diploma III Rekayasa Perangkat Lunak adalah program vokasi
            yang berfokus pada keterampilan praktis di bidang software
            engineering. Mahasiswa dibekali kemampuan pemrograman, pengelolaan
            database, pengembangan web dan mobile, serta software testing dan
            deployment. Pembelajaran dilakukan secara hands-on melalui
            project-based learning yang menyerupai kondisi kerja nyata di
            industri teknologi.
          </p>

          {/* Code Box */}
          <div className="mt-5 bg-[#0F1B3D] text-white rounded-xl p-4 font-mono text-sm">
            <p className="opacity-90">
              <span className="text-purple-400">program</span>
              <span className="text-white">.</span>
              <span className="text-blue-400">initialize</span>
              <span className="text-white">()</span> <br />
              <span className="text-pink-400">→</span>{" "}
              <span className="text-green-400">ready</span>
              <span className="text-white">.</span>
              <span className="text-yellow-300">to_build_the_future</span>
              <span className="text-white">()</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
