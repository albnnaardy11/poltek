import PremiumFAQHub from "@/components/sections/PremiumFAQHub";
import { getPublicFaqs } from "@/actions/public";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FaqProgramStudiPage() {
  const faqs = await getPublicFaqs("Program Studi");

  return (
    <PremiumFAQHub 
      title="Tentang Program Studi"
      subtitle="Akademik & Kurikulum"
      description="Pelajari lebih lanjut mengenai jurusan, kurikulum berbasis industri, dan prospek karir lulusan Politeknik Prestasi Prima."
      initialFaqs={faqs}
      showCategories={false} 
    />
  );
}
