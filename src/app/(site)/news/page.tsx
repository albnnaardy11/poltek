import { getNews } from "@/actions/cms";
import NewsClient from "./NewsClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function NewsPage() {
  const news = await getNews();
  
  return <NewsClient initialNews={news} />;
}
