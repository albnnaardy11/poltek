import { getFacilityById } from "@/actions/cms";
import FacilityForm from "../FacilityForm";
import { notFound } from "next/navigation";

export default async function EditFacilityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const facility = await getFacilityById(id);

  if (!facility) {
    notFound();
  }

  return <FacilityForm initialData={facility} />;
}
