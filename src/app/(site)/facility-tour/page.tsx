import { getFacilities } from "@/actions/cms";
import TourClient from "@/components/facility/TourClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "360° Virtual Tour | SMK PRESTASI PRIMA",
  description: "Jelajahi kampus SMK PRESTASI PRIMA secara virtual dengan teknologi 360 derajat.",
};

export const dynamic = "force-dynamic";

export default async function TourPage() {
  const facilities = await getFacilities();

  return <TourClient initialFacilities={facilities} />;
}
