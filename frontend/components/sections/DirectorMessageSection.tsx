"use client";

export default function DirectorMessageSection() {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-10 lg:px-20">
      
      {/* Title */}
      <h2 className="text-3xl md:text-4xl font-bold text-[#1A1F2C] mb-8">
        Sambutan <span className="text-orange-500">Direktur</span>
      </h2>

      {/* Wrapper Banner */}
      <div
        className="
          relative w-full rounded-3xl overflow-hidden shadow-xl 
          flex items-stretch
        "
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1D1F52] via-[#793B88] to-[#F97316]" />

        {/* === LEFT TEXT BOX === */}
        <div
          className="
            relative z-10 flex-1 
            bg-gradient-to-r from-[#1D1F52] via-[#793B88]/70 to-transparent
            p-8 md:p-10 rounded-l-3xl text-white 
          "
        >
          <p className="text-sm md:text-base leading-relaxed font-medium">
            Komitmen kami adalah mewujudkan lulusan yang tidak hanya memiliki
            keterampilan dan kecakapan digital, tetapi juga kepribadian yang
            “unggul” dan “terpercaya”. Kami percaya pada pembentukan karakter
            yang berlandaskan iman, ketakwaan, kecerdasan, percaya diri, dan
            kesetiaan pada nilai-nilai Pancasila.
          </p>
        </div>

        {/* === RIGHT IMAGE + NAME BOX === */}
        <div className="relative flex items-end">
          
          {/* Foto Direktur */}
          <img
            // src="/images/sections/About/about.svg"
            alt="Direktur"
            className="relative z-10 w-[200px] md:w-[260px] lg:w-[300px] object-contain translate-y-4"
          />

          {/* Name Badge */}
          <div
            className="
              absolute bottom-0 right-0 translate-y-1/2
              bg-[#0F1B47] text-white 
              px-6 py-4 rounded-tl-3xl shadow-lg
            "
          >
            <h4 className="font-semibold text-sm md:text-base">
              Dr. Wannen Pakpahan, MM.
            </h4>
            <p className="text-xs opacity-80">
              Direktur Poltek Prestasi Prima
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
