import PremiumFAQHub from "@/components/sections/PremiumFAQHub";
import { getPublicFaqs } from "@/actions/public";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FaqMainPage() {
  const allFaqs = await getPublicFaqs();

  return (
    <PremiumFAQHub 
      title="Ada yang bisa Kami bantu?" 
      subtitle="Hub Pusat Bantuan"
      description="Segala informasi yang Anda butuhkan untuk memulai perjalanan masa depan di Politeknik Prestasi Prima ada di sini."
      initialFaqs={allFaqs}
      showCategories={true}
    />
  );
}
