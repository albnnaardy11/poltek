import { getFacilities } from "@/actions/cms";
import FacilityTourLanding from "@/components/facility/FacilityTourLanding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Tour 360° | Politeknik Prestasi Prima",
  description: "Jelajahi kampus Politeknik Prestasi Prima secara virtual dengan teknologi 360 derajat.",
};

export const dynamic = "force-dynamic";

export default async function TourPage() {
  const facilities = await getFacilities();
  // Clear SSR cache in Turbopack
  return <FacilityTourLanding facilities={facilities as any} />;
}
