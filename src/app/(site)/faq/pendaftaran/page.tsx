import PremiumFAQHub from "@/components/sections/PremiumFAQHub";
import { getPublicFaqs } from "@/actions/public";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FaqPendaftaranPage() {
  const faqs = await getPublicFaqs("Pendaftaran");

  return (
    <PremiumFAQHub 
      title="Tentang Pendaftaran"
      subtitle="Informasi Pendaftaran 2026/2027"
      description="Temukan informasi lengkap mengenai alur, persyaratan, dan jadwal pendaftaran mahasiswa baru di Politeknik Prestasi Prima."
      initialFaqs={faqs}
      showCategories={false} 
    />
  );
}
