import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/layout/Preloader";

export default function SiteLayout({ children }) {
  return (
    <SmoothScroll>
      <Preloader />
      <Header />
      <main id="content">{children}</main>
      <Footer />
    </SmoothScroll>
  );
}
