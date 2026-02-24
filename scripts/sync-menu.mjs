import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    },
  },
})

const MENU = [
  {
    id: "profil",
    title: "Profil",
    items: [
      { label: "Sejarah Poltek", url: "/history" },
      { label: "Profile Kampus", url: "/about" },
      { label: "Sambutan Direktur", url: "/director-message" },
      { label: "Dosen & Staff", url: "/about" },
    ],
    subgroups: [
      {
        title: "Fasilitas",
        items: [
          { label: "Facility", url: "/facility" },
          { label: "Virtual Tour", url: "/facility-tour" },
        ],
      },
      {
        title: "FAQ",
        items: [
          { label: "Pendaftaran", url: "/faq/pendaftaran" },
          { label: "Program Studi", url: "/faq/program-studi" },
          { label: "Sistem Pembelajaran", url: "/faq/sistem-pembelajaran" },
        ],
      },
    ],
  },
  {
    id: "akademik",
    title: "Akademik",
    items: [
      { label: "Program Studi", url: "/studyProgram" },
    ],
    subgroups: [
      {
        title: "Program D3",
        items: [
          { label: "D3 Manajemen Pemasaran", url: "/program/d3_manajemen_pemasaran" },
          { label: "D3 Administrasi Perkantoran", url: "/program/d3_administrasi_perkantoran" },
          { label: "D3 Rekayasa Perangkat Lunak", url: "/program/d3_rekayasa_perangkat_lunak" },
        ],
      },
      {
        title: "Program D4",
        items: [
          { label: "D4 Bisnis Digital", url: "/program/d4_bisnis_digital" },
          { label: "D4 TR Jaringan Komputer", url: "/program/d4_teknologi_rekayasa_jaringan_komputer" },
          { label: "D4 TR Multimedia", url: "/program/d4_teknologi_rekayasa_multimedia" },
        ],
      },
    ],
  },
  {
    id: "dokumentasi",
    title: "Dokumentasi",
    items: [
      { label: "Gallery", url: "/gallery" },
      { label: "Berita", url: "/news" },
    ],
  },
  {
    id: "informasi",
    title: "Informasi",
    items: [
      { label: "Biaya Kuliah", url: "/biaya" },
      { label: "Syarat Pendaftaran", url: "/syarat" },
      { label: "Hubungi Kami", url: "/contact" },
    ],
  },
];

async function main() {
  console.log('🔄 Memulai sinkronisasi Menu Dinamis...');
  
  try {
    await prisma.$connect();
    // Clear existing
    // @ts-ignore
    await prisma.navigation.deleteMany({});
    
    let globalOrder = 0;

    for (const root of MENU) {
      globalOrder++;
      // @ts-ignore
      const rootNav = await prisma.navigation.create({
        data: {
          title: root.title,
          url: root.url || null,
          parentId: null,
          order: globalOrder,
          type: "HEADER"
        }
      });

      // Basic items
      if (root.items) {
        for (const item of root.items) {
          globalOrder++;
          // @ts-ignore
          await prisma.navigation.create({
            data: {
              title: item.label,
              url: item.url,
              parentId: rootNav.id,
              order: globalOrder,
              type: "HEADER"
            }
          });
        }
      }

      // Subgroups
      if (root.subgroups) {
        for (const sg of root.subgroups) {
          globalOrder++;
          // @ts-ignore
          const sgNav = await prisma.navigation.create({
            data: {
              title: sg.title,
              url: null,
              parentId: rootNav.id,
              order: globalOrder,
              type: "HEADER"
            }
          });

          for (const item of sg.items) {
            globalOrder++;
            // @ts-ignore
            await prisma.navigation.create({
              data: {
                title: item.label,
                url: item.url,
                parentId: sgNav.id,
                order: globalOrder,
                type: "HEADER"
              }
            });
          }
        }
      }
    }
    
    console.log('🚀 Sinkronisasi Menu selesai!');
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
