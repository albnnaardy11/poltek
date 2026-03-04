import { getFacilities } from "@/actions/cms";
import FacilityClient from "@/components/facility/FacilityClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fasilitas Kampus | SMK PRESTASI PRIMA",
  description: "Eksplorasi infrastruktur dan fasilitas unggulan SMK PRESTASI PRIMA dengan teknologi kelas dunia.",
};

export const dynamic = "force-dynamic";

export default async function FacilityPage() {
  const facilities = await getFacilities();

  return <FacilityClient initialFacilities={facilities} />;
}
