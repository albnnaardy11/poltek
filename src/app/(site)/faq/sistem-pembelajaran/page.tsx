import PremiumFAQHub from "@/components/sections/PremiumFAQHub";
import { getPublicFaqs } from "@/actions/public";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FaqSistemPembelajaranPage() {
  const faqs = await getPublicFaqs("Sistem Pembelajaran");

  return (
    <PremiumFAQHub 
      title="Sistem Pembelajaran"
      subtitle="Knowledge & Skill"
      description="Temukan bagaimana metode belajar-mengajar di Politeknik Prestasi Prima mempersiapkan Anda menjadi profesional digital kelas dunia."
      initialFaqs={faqs}
      showCategories={false} 
    />
  );
}
