import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingShare from "@/components/FloatingShare";
import CookieBanner from "@/components/CookieBanner";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <FloatingShare 
        url={typeof window !== 'undefined' ? window.location.href : "https://www.readers24.com"} 
        title="Readers 24 | Premium Journalism"
      />
      <main>{children}</main>
      <CookieBanner />
      <Footer />
    </>
  );
}
