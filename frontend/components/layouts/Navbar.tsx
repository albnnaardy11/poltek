"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X, Phone, Mail, Globe } from "lucide-react";

// ======================= DATA MENU ======================= //

const LANGUAGES = [
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇺🇸" },
];

const MENU = [
  {
    id: 1,
    title: "Profil",
    items: [
      { label: "Sejarah", url: "/profil/sejarah" },
      { label: "Visi & Misi", url: "/profil/visi-misi" },
      { label: "Sambutan Direktur", url: "/profil/sambutan-direktur" },
      { label: "Fasilitas", url: "/profil/fasilitas" },
    ],
  },
  {
    id: 2,
    title: "Akademik",
    items: [{ label: "Akreditasi", url: "/akademik/akreditasi" }],
    subgroups: [
  {
    title: "Program D3",
    items: [
      {
        label: "D3 Manajemen Pemasaran",
        url: "/site/program/d3_manajemen_pemasaran",
      },
      {
        label: "D3 Administrasi Perkantoran",
        url: "/site/program/d3_administrasi_perkantoran",
      },
      {
        label: "D3 Rekayasa Perangkat Lunak",
        url: "/site/program/d3_rekayasa_perangkat_lunak",
      },
    ],
  },
  {
    title: "Program D4",
    items: [
      {
        label: "D4 Bisnis Digital",
        url: "/site/program/d4_bisnis_digital",
      },
      {
        label: "D4 TR Jaringan Komputer",
        url: "/site/program/d4_teknologi_rekayasa_jaringan_komputer",
      },
      {
        label: "D4 TR Multimedia",
        url: "/site/program/d4_teknologi_rekayasa_multimedia",
      },
    ],
  },
],
  },
  {
    id: 3,
    title: "Informasi",
    items: [
      { label: "Berita", url: "/informasi/berita" },
      { label: "Agenda", url: "/informasi/agenda" },
      { label: "Pengumuman", url: "/informasi/pengumuman" },
    ],
  },
  {
    id: 4,
    title: "Dokumentasi",
    items: [
      { label: "Galeri", url: "/dokumentasi/galeri" },
      { label: "Dokumen", url: "/dokumentasi/dokumen" },
    ],
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openLang, setOpenLang] = useState(false);
  const [currentLang, setCurrentLang] = useState("id");

  const selectedLang = LANGUAGES.find((l) => l.code === currentLang);

  // ======================= COMPONENT ======================= //

  return (
    <header className="w-full shadow-sm sticky top-0 z-[999] bg-white">

      {/* ================= TOP BAR ================= */}
      <div className="w-full bg-[#1A2147] text-white text-sm px-6 md:px-12 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-end gap-6 py-2">

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => setOpenLang(!openLang)}
              className="flex items-center gap-2 hover:text-gray-300 transition"
            >
              <Globe size={16} />
              {selectedLang?.flag} {selectedLang?.name}
            </button>

            {openLang && (
              <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md py-2 w-40 z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code);
                      setOpenLang(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                  >
                    <span>{lang.flag}</span> {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Phone size={16} /> +62 851-9932-8825
          </div>

          <div className="flex items-center gap-2">
            <Mail size={16} /> poltek.prestasiprima@gmail.id
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <nav className="px-6 md:px-12 py-4 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo_politeknik.png"
              alt="Logo Politeknik"
              width={50}
              height={50}
            />
            <span className="font-semibold text-gray-800 text-lg whitespace-nowrap">
              <span className="text-orange-600">Politeknik</span> Prestasi Prima
            </span>
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-8 font-medium">
            <li>
              <Link href="/" className="hover:text-orange-600">Beranda</Link>
            </li>

            {/* Loop Menu Desktop */}
            {MENU.map((menu) => (
              <li key={menu.id} className="relative group">
                <button className="flex items-center gap-1 hover:text-orange-600">
                  {menu.title} <ChevronDown size={16} />
                </button>

                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-60 bg-white shadow-lg py-3
                    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                    translate-y-2 group-hover:translate-y-0 transition-all duration-300">

                  {/* Items */}
                  {menu.items?.map((item) => (
                    <Link
                      key={item.url}
                      href={item.url}
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Subgroups */}
                  {menu.subgroups?.map((sub) => (
                    <div key={sub.title} className="relative group/sub">
                      <span className="block px-4 py-2 hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                        {sub.title} <ChevronDown size={14} />
                      </span>

                      <div className="absolute left-full top-0 w-60 bg-white shadow-lg py-3
                          opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible
                          translate-x-2 group-hover/sub:translate-x-0 transition-all duration-200">

                        {sub.items.map((child) => (
                          <Link
                            key={child.url}
                            href={child.url}
                            className="block px-4 py-2 hover:bg-gray-50"
                          >
                            {child.label}
                          </Link>
                        ))}

                      </div>
                    </div>
                  ))}

                </div>
              </li>
            ))}

            <li>
              <Link href="/brosur" className="hover:text-orange-600">Download Brosur</Link>
            </li>
          </ul>

          {/* MOBILE BUTTON */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-white border shadow-sm animate-fadeIn">
            <ul className="space-y-4 font-medium">

              {/* Language */}
              <li>
                <button
                  className="w-full flex justify-between items-center py-2"
                  onClick={() => setOpenLang(!openLang)}
                >
                  <span className="flex items-center gap-2">
                    <Globe size={18} /> {selectedLang?.flag} {selectedLang?.name}
                  </span>
                  <ChevronDown className={`${openLang ? "rotate-180" : ""} transition`} />
                </button>

                {openLang && (
                  <div className="mt-2 pl-4 border-l space-y-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setOpenLang(false);
                        }}
                        className="flex items-center gap-2 hover:text-orange-600"
                      >
                        {lang.flag} {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </li>

              {/* Loop Menu Mobile */}
              {MENU.map((menu) => (
                <li key={menu.id}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === menu.id ? null : menu.id)}
                    className="w-full flex justify-between items-center py-2"
                  >
                    {menu.title}
                    <ChevronDown
                      className={`transition ${openDropdown === menu.id ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openDropdown === menu.id && (
                    <div className="mt-2 pl-4 space-y-3 border-l">

                      {/* Items */}
                      {menu.items?.map((item) => (
                        <Link
                          key={item.url}
                          href={item.url}
                          className="block text-sm hover:text-orange-600"
                        >
                          {item.label}
                        </Link>
                      ))}

                      {/* Subgroups */}
                      {menu.subgroups?.map((sub) => (
                        <details key={sub.title} className="text-sm">
                          <summary className="cursor-pointer py-1 hover:text-orange-600">
                            {sub.title}
                          </summary>

                          <div className="pl-4 mt-1 space-y-1">
                            {sub.items.map((child) => (
                              <Link
                                key={child.url}
                                href={child.url}
                                className="block hover:text-orange-600"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ))}

                    </div>
                  )}
                </li>
              ))}

              {/* Brosur */}
              <li>
                <Link href="/brosur" className="block py-2 hover:text-orange-600">
                  Download Brosur
                </Link>
              </li>

            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
