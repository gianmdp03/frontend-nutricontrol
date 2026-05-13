import BackgroundGlow from "@/components/ui/BackgroundGlow";
import About from "../components/landing/About";
import Consultation from "../components/landing/Consultation";
import ConsultationInfo from "../components/landing/ConsultationInfo";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function Home() {
  return (
    <>
      <ScrollToTop />
      <BackgroundGlow />
      <Hero />
      <Services />
      <ConsultationInfo />
      <Consultation />
      <About />
      <Footer />
    </>
  );
}
