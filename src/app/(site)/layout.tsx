import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import FloatingButtons from "@/components/FloatingButtons";

import { getPublicSettings, getPublicMenu } from "@/actions/public";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, menu] = await Promise.all([
    getPublicSettings(),
    getPublicMenu()
  ]);

  return (
    <>
      <Header settings={settings} menu={menu} />

      <main>{children}</main>
      <FloatingButtons settings={settings} />
      <Footer settings={settings} initialMenu={menu} />
    </>
  );
}
