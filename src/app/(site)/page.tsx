import HeroSection from "@/components/sections/HeroSection";
import QuickActionSection from "@/components/sections/QuickActionSection";
import AboutSection from "@/components/sections/AboutSection";
import VisionMissionSection from "@/components/sections/VisionMissionSection";
import AcademicProgramsSection from "@/components/sections/AcademicProgramsSection";
import DirectorMessageSection from "@/components/sections/DirectorMessageSection";
import VirtualTourSection from "@/components/sections/VirtualTourSection";
import NewsSection from "@/components/sections/NewsSection";
import FAQSection from "@/components/sections/FAQSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";

import { getLatestNews, getPublicFaqs, getPublicSeo } from "@/actions/public";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPublicSeo("/");
  
  if (!seo) return {
    title: "Politeknik Prestasi Prima",
    description: "Membangun Masa Depan Digital bersama Politeknik Prestasi Prima"
  };

  return {
    title: seo.title,
    description: seo.description || undefined,
    keywords: seo.keywords || undefined,
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const latestNews = await getLatestNews();
  const faqs = await getPublicFaqs();

  return (
    <main className="min-h-screen w-full">
      
      {/* 1. Hero / Banner */}
      <HeroSection />

      {/* 2. Quick Action / Menu Singkat */}
      <QuickActionSection />

      {/* 3. Tentang Kampus */}
      <AboutSection />

      {/* 4. Visi & Misi */}
      <VisionMissionSection />

      {/* 10. Why Choose Us */}
      <WhyChooseUsSection />

      {/* 5. Program Akademik */}
      <AcademicProgramsSection />

      {/* 6. Sambutan Direktur */}
      <DirectorMessageSection />

      {/* 7. Virtual Tour */}
      <VirtualTourSection />

      {/* 8. Berita Terbaru */}
      <NewsSection initialNews={latestNews} />

      {/* 9. FAQ */}
      <FAQSection initialFaqs={faqs} />


    </main>
  );
}
