import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

// Use DIRECT_URL for script execution
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    },
  },
})

const staticFaqs = [
  // Pendaftaran
  {
    question: "Bagaimana cara mendaftar ke Politeknik Prestasi Prima?",
    answer: "Proses pendaftaran sangat mudah! Anda dapat melakukannya 100% online melalui dashboard pendaftaran kami atau datang langsung ke kampus untuk dipandu oleh tim admisi kami yang ramah.",
    category: "Pendaftaran",
    order: 1
  },
  {
    question: "Apa saja syarat dokumen yang diperlukan?",
    answer: "Cukup siapkan scan Ijazah SMA/SMK sederajat, Kartu Keluarga, dan Pas Foto terbaru. Semua dokumen diupload dalam format digital lewat portal pendaftaran.",
    category: "Pendaftaran",
    order: 2
  },
  {
    question: "Berapa biaya pendaftaran mahasiswa baru?",
    answer: "Biaya pendaftaran mengikuti kebijakan tahun akademik berjalan. Anda dapat melihat rincian biaya lengkap di halaman Biaya Kuliah atau bertanya langsung via WhatsApp Admissions.",
    category: "Pendaftaran",
    order: 3
  },
  // Program Studi
  {
    question: "Program studi apa saja yang tersedia?",
    answer: "Kami menawarkan berbagai program vokasi unggulan mulai dari D3 Administrasi Perkantoran, Manajemen Pemasaran, hingga D4 Teknologi Rekayasa Perangkat Lunak, Jaringan Komputer, dan Multimedia.",
    category: "Program Studi",
    order: 4
  },
  {
    question: "Berapa lama masa studi untuk masing-masing jenjang?",
    answer: "Jenjang Diploma 3 (D3) ditempuh dalam waktu 3 tahun (6 semester), sedangkan Diploma 4 (D4/Sarjana Terapan) ditempuh dalam waktu 4 tahun (8 semester).",
    category: "Program Studi",
    order: 5
  },
  {
    question: "Bagaimana ketersediaan praktik industri/magang?",
    answer: "Seluruh program studi memiliki kemitraan dengan perusahaan terkemuka. Mahasiswa diwajibkan mengikuti magang industri untuk mengasah skill praktis sebelum memasuki dunia kerja.",
    category: "Program Studi",
    order: 6
  },
  // Sistem Pembelajaran
  {
    question: "Bagaimana metode pembelajaran di Poltek Presma?",
    answer: "Kami menerapkan Kurikulum Berbasis Kompetensi (KBK) dengan porsi praktikum yang lebih besar (60% Praktik, 40% Teori) serta metode Problem-Based Learning yang relevan dengan tantangan dunia kerja.",
    category: "Sistem Pembelajaran",
    order: 7
  },
  {
    question: "Apakah tersedia fasilitas laboratorium pendukung?",
    answer: "Setiap program studi didukung oleh laboratorium khusus sesuai bidangnya, seperti Lab Multimedia, Lab Pemrograman, dan Lab Administrasi Digital dengan software standar industri terbaru.",
    category: "Sistem Pembelajaran",
    order: 8
  },
  {
    question: "Apakah ada kurikulum berbasis industri?",
    answer: "Benar sekali. Kami berkolaborasi dengan asosiasi profesi dan perusahaan teknologi untuk menyusun kurikulum agar setiap kompetensi yang diajarkan sesuai dengan kebutuhan real di lapangan.",
    category: "Sistem Pembelajaran",
    order: 9
  },
];

async function main() {
  console.log('🔄 Memulai sinkronisasi FAQ Lengkap ke Database...');
  
  try {
    await prisma.$connect();
    // Clear existing
    await prisma.faq.deleteMany({});
    
    for (const faq of staticFaqs) {
      // @ts-ignore
      await prisma.faq.create({
        data: faq
      });
      console.log(`✅ Berhasil: [${faq.category}] ${faq.question}`);
    }
    
    console.log('🚀 Sinkronisasi selesai! Semua menu FAQ sekarang terhubung ke CMS.');
  } catch (err) {
    console.error('❌ Database error:', err);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
