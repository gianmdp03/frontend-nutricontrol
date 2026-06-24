import BackgroundGlow from "@/components/ui/BackgroundGlow";
import About from "../components/landing/About";
import Consultation from "../components/landing/Consultation";
import ConsultationInfo from "../components/landing/ConsultationInfo";
import Hero from "../components/landing/Hero";
import Services from "../components/landing/Services";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Navbar from "@/components/layout/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import BottomComponent from "@/components/layout/BottomComponent";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  const isAdmin =
    (await getServerSession(authOptions))?.user?.role === "ROLE_ADMIN";
  return (
    <>
      <Navbar variant="HOME" />
      <ScrollToTop />
      <BackgroundGlow />
      <Hero isAdmin={isAdmin} />
      <Services />
      <ConsultationInfo />
      <About />
      <BottomComponent />
      <Footer />
    </>
  );
}
