import { getFacilities } from "@/actions/cms";
import FacilitiesList from "./FacilitiesList";

export const dynamic = "force-dynamic";

export default async function FacilitiesAdminPage() {
  const facilities = await getFacilities();

  return <FacilitiesList initialFacilities={facilities} />;
}
