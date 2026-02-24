import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import FloatingButtons from "@/components/FloatingButtons";

import { getPublicSettings } from "@/actions/public";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getPublicSettings();

  return (
    <>
      <Header settings={settings} />
      <main>{children}</main>
      <FloatingButtons />
      <Footer settings={settings} />
    </>
  );
}
