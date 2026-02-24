import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const seoData = [
  {
    path: "/",
    title: "Politeknik Prestasi Prima | Future-Proof Your Digital Career",
    description: "Transformasi potensi menjadi kompetensi global di Politeknik Prestasi Prima. Pendidikan vokasi premium dengan ekosistem teknologi mutakhir. Join the Future.",
    keywords: "high-tech education, digital transformation academy, vokasi industri 4.0, pusat keunggulan teknologi"
  },
  {
    path: "/program",
    title: "Spesialisasi Industri - Program Vokasi Politeknik Prestasi Prima",
    description: "Kurikulum yang didesain bersama raksasa industri. Pilih spesialisasi yang mendefinisikan dekade ini. Dari Informatika hingga Manajemen Digital.",
    keywords: "industry-aligned curriculum, tech specialization, advanced vocational training"
  },
  {
    path: "/faq",
    title: "Panduan & Transparansi Akademik | Politeknik Prestasi Prima",
    description: "Kami percaya pada keterbukaan informasi. Temukan detail operasional, kebijakan akademik, dan dukungan karir dalam satu kanal informasi terpadu.",
    keywords: "academic transparency, student support center, vocational education guide"
  }
];

async function main() {
  console.log('Seeding SEO settings...');
  
  // Get all programs to add prodi specific SEO
  const programs = await prisma.program.findMany();
  
  for (const prog of programs) {
    seoData.push({
      path: `/program/${prog.slug}`,
      title: `Jadi ${prog.title} Elit | Politeknik Prestasi Prima`,
      description: `Bergabung dengan prodi ${prog.title} paling progresif. Praktek langsung dengan tech stack terbaru dan kurikulum industri. Siap kerja sebelum lulus!`,
      keywords: `${prog.title.toLowerCase()}, kuliah vokasi, prospek kerja ${prog.title.toLowerCase()}, sertifikasi industri`
    });
  }

  for (const item of seoData) {
    await prisma.seoSetting.upsert({
      where: { path: item.path },
      update: item,
      create: item,
    });
    console.log(`✅ Upserted SEO for ${item.path}`);
  }

  console.log('SEO Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
