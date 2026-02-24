import { getGallery } from "@/actions/cms";
import GalleryClient from "./GalleryClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function GalleryPage() {
  const data = await getGallery();
  
  return <GalleryClient initialData={data} />;
}
