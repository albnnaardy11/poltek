"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function NewsSection() {
  const news = [
    {
      category: "Event",
      title: "Campus Tour, Menyaksikan Keseruan Film Merdeka Atau Mati",
      img: "/images/sections/news/newsdummy.jpeg",
      date: "25 November 2025",
      excerpt:
        "Ikuti kegiatan campus tour dan rasakan pengalaman belajar yang menyenangkan sambil mengenal budaya kampus.",
      link: "#",
    },
    {
      category: "Berita",
      title: "Workshop Digital Marketing untuk Mahasiswa",
      img: "/images/sections/news/newsdummy.jpeg",
      date: "20 November 2025",
      excerpt:
        "Workshop ini memberikan wawasan terbaru dalam dunia digital marketing, khusus untuk mahasiswa Politeknik Prestasi Prima.",
      link: "#",
    },
    {
      category: "Pengumuman",
      title: "Pendaftaran Magang Semester Ganjil Dibuka",
      img: "/images/sections/news/newsdummy.jpeg",
      date: "15 November 2025",
      excerpt:
        "Mahasiswa bisa mendaftar untuk magang di perusahaan mitra kami dengan berbagai pilihan lokasi industri.",
      link: "#",
    },
  ];

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const categoryColors: { [key: string]: string } = {
    Event: "bg-orange-500",
    Berita: "bg-purple-600",
    Pengumuman: "bg-blue-600",
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollAmount, setScrollAmount] = useState(0);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setScrollAmount(carouselRef.current.scrollLeft - 300);
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setScrollAmount(carouselRef.current.scrollLeft + 300);
    }
  };

  return (
    <section className="py-24 bg-white px-6 flex flex-col items-center">
      {/* Title */}
      <h2
        className="text-4xl md:text-5xl font-bold text-center mb-14"
        data-aos="fade-up"
      >
        <span className="text-purple-800">Update </span>
        <span className="text-orange-500">Terbaru kami</span>
      </h2>

      {/* Desktop Grid */}
      <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {news.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            {/* Image */}
            <div className="w-full h-56 relative overflow-hidden rounded-t-2xl">
              <Image
                src={item.img}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Category Badge */}
              <span
                className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${
                  categoryColors[item.category] || "bg-gray-400"
                }`}
              >
                {item.category}
              </span>

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>

            {/* Content */}
            <div className="p-5 bg-white relative z-10">
              <p className="text-gray-400 text-xs">{item.date}</p>
              <h3 className="text-gray-800 font-semibold text-lg leading-snug mt-2">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                {item.excerpt}
              </p>
              <a
                href={item.link}
                className="text-orange-500 text-sm mt-3 inline-block hover:underline"
              >
                Baca Selengkapnya →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="relative w-full lg:hidden mt-6">
        {/* Carousel container */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
        >
          {news.map((item, idx) => (
            <div
              key={idx}
              className="snap-start min-w-[280px] max-w-[280px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              <div className="w-full h-48 relative overflow-hidden rounded-t-2xl">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow ${
                    categoryColors[item.category] || "bg-gray-400"
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <div className="p-4 bg-white">
                <p className="text-gray-400 text-xs">{item.date}</p>
                <h3 className="text-gray-800 font-semibold text-base mt-1">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {item.excerpt}
                </p>
                <a
                  href={item.link}
                  className="text-orange-500 text-sm mt-2 inline-block hover:underline"
                >
                  Baca Selengkapnya →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={scrollLeft}
          className="absolute top-1/2 -left-2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition z-10"
        >
          &#8592;
        </button>
        <button
          onClick={scrollRight}
          className="absolute top-1/2 -right-2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full hover:bg-gray-100 transition z-10"
        >
          &#8594;
        </button>
      </div>

      {/* Footer Button */}
      <a
        href="#"
        className="mt-12 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full shadow-lg hover:bg-purple-700 hover:scale-105 transition-all duration-300"
      >
        Lihat Semua Berita
      </a>
    </section>
  );
}
