import Image from "next/image";

export default function VisionMissionSection() {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* ================= LEFT CONTENT ================= */}
        <div>
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-snug mb-10">
            Visi & Misi <span className="text-[#ff7a00]">Politeknik</span>
          </h2>

          {/* ---- VISI ---- */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-[#1D234E] flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="12" r="8" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-[#1A1A1A]">
                Visi Politeknik
              </h3>
            </div>

            <p className="text-gray-700 leading-relaxed max-w-xl text-[15.5px]">
              Menjadi politeknik vokasi terdepan yang unggul, terpercaya, dan
              mampu mencetak insan terampil berakhlak dengan penguasaan
              teknologi serta kontribusi global.
            </p>
          </div>

          {/* ---- MISI ---- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              {/* Modern Mission Icon */}
              <div className="w-11 h-11 rounded-full bg-[#1D234E] flex items-center justify-center">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4"></path>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
              </div>

              <h3 className="text-xl font-semibold text-[#1A1A1A]">
                Misi Politeknik
              </h3>
            </div>

            <ul className="space-y-4 text-gray-700 leading-relaxed text-[15.5px] max-w-xl list-decimal list-inside">
              <li>
                Menyelenggarakan pendidikan vokasi yang berkualitas melalui
                kurikulum Merdeka, pembelajaran digital, serta integrasi teori
                dan praktik industri.
              </li>
              <li>
                Menyiapkan lulusan yang kompeten dan mampu bersaing pada era
                revolusi industri 4.0 dan globalisasi sesuai bidang keahliannya.
              </li>
              <li>
                Mendorong kreativitas, inovasi, dan jiwa kewirausahaan agar
                lulusan mampu menciptakan solusi serta peluang usaha baru.
              </li>
              <li>
                Mewujudkan tata kelola kampus adaptif, berkelanjutan, dan
                selaras dengan perkembangan teknologi serta dinamika sosial
                ekonomi.
              </li>
            </ul>
          </div>
        </div>

        {/* ================= RIGHT IMAGE ================= */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/images/Model.png"
            alt="Visi Misi Politeknik"
            width={420}
            height={500}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
