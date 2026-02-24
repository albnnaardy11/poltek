import { notFound } from "next/navigation";
import { getProgramBySlug, getPublicSeo } from "@/actions/public";
import ProgramDetailTemplate from "@/components/program/ProgramDetailTemplate";
import { ProgramDetail } from "@/data/programs";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/program/${slug}`;
  
  const [seo, program] = await Promise.all([
     getPublicSeo(path),
     getProgramBySlug(slug)
  ]);

  if (seo) {
    return {
      title: seo.title,
      description: seo.description || undefined,
      keywords: seo.keywords || undefined
    };
  }

  return {
    title: program ? `${program.title} | Politeknik Prestasi Prima` : "Program Studi",
    description: program?.description || "Program Studi Politeknik Prestasi Prima"
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProgramDynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const programData = await getProgramBySlug(slug);

  if (!programData) {
    return notFound();
  }

  // Transform Prisma data to ProgramDetail format
  // Ensure we safely cast and provide defaults for optional fields
  const formattedData: ProgramDetail = {
    id: programData.id,
    title: programData.title,
    // Cast degree to literal union type safely
    degree: (programData.degree === "D3" || programData.degree === "D4") ? programData.degree : "D3", 
    subtitle: programData.subtitle,
    description: programData.description,
    longDescription: programData.longDescription,
    heroImage: programData.heroImage,
    color: programData.color,
    // Safely cast JSON fields to arrays, defaulting to empty arrays if null/undefined
    competencies: (programData.competencies as any[]) || [],
    careers: (programData.careers as any[]) || [],
    tools: (programData.tools as any[]) || [],
    stats: (programData.stats as any[]) || [],
  };

  return <ProgramDetailTemplate data={formattedData} />;
}
