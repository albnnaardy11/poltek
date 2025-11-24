"use client";

export default function Tools() {
  // Load logo-1.png sampai logo-10.png
  const logos = Array.from({ length: 10 }).map(
    (_, i) => `/images/program/rpl/logo (${i + 1}).png`
  );

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">

        {/* Title */}
        <span className="inline-block bg-[#0F1B3D] text-white text-sm px-6 py-2 rounded-full font-medium">
          Tools dan Equipment
        </span>

        <p className="text-[#0F1B3D] mt-3 font-medium">
          untuk Pembelajaran Keahlian RPL
          <br />
          Rekayasa Perangkat Lunak
        </p>

        {/* Logo Slider */}
        <div className="mt-12 overflow-hidden">
          <div className="flex gap-6 w-max animate-marquee">
            {logos.concat(logos).map((src, idx) => (
              <div
                key={idx}
                className="shrink-0 w-32 h-20 flex items-center justify-center bg-white rounded-xl shadow border border-gray-100"
              >
                <img
                  src={src}
                  alt={`tool-${idx}`}
                  className="max-h-14 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
}
