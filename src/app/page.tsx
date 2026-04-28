import BackgroundGlow from "@/components/BackgroundGlow";
import About from "./_components/About";
import Consultation from "./_components/Consultation";
import ConsultationInfo from "./_components/ConsultationInfo";
import Hero from "./_components/Hero";
import Services from "./_components/Services";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundGlow />
      <Hero />
      <Services />
      <ConsultationInfo />
      <Consultation />
      <About />
    </main>
  );
}
