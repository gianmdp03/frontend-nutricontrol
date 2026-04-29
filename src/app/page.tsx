import BackgroundGlow from "@/components/ui/BackgroundGlow";
import About from "../components/landing/About";
import Consultation from "../components/landing/Consultation";
import ConsultationInfo from "../components/landing/ConsultationInfo";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden grow">
      <Navbar />
      <BackgroundGlow />
      <Hero />
      <Services />
      <ConsultationInfo />
      <Consultation />
      <About />
      <Footer />
    </main>
  );
}
