import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-16">

        {/* ================= LEFT SIDE (IMAGE ONLY) ================= */}
        <div className="relative w-full flex justify-center md:justify-start">
          <Image
            src="/images/sections/About/about.svg"
            alt="Direktur"
            width={480}
            height={600}
            className="object-contain"
            priority
          />
        </div>

        {/* ================= RIGHT SIDE (TEXT) ================= */}
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4">
            Tentang <span className="text-[#ff7a00]">Kami</span>
          </h2>

          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-[520px]">
            Kami adalah lembaga pendidikan yang berkomitmen mencetak generasi unggul,
            kreatif, dan siap menghadapi tantangan masa depan. Dengan dukungan tenaga
            pendidik profesional serta fasilitas modern, kami menghadirkan pengalaman
            belajar berbasis praktik nyata.
          </p>

          <div className="mt-8">
            <button className="inline-flex items-center gap-3 bg-[#1D234E] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#161c3d] transition">
              Selengkapnya
              <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
