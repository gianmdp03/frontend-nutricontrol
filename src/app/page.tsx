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
import { getUserMedicalRecordAction } from "@/actions/medicalRecordActions";
import MedicalRecordBanner from "@/components/patient/MedicalRecordBanner";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ROLE_ADMIN";

  let showMedicalRecordBanner = false;
  if (session && !isAdmin) {
    try {
      const res = await getUserMedicalRecordAction();
      if (res.success && res.data) {
        const { age, weight, height } = res.data;
        showMedicalRecordBanner = !age || age.trim() === "" || weight <= 0 || height <= 0;
      } else {
        showMedicalRecordBanner = true;
      }
    } catch (error) {
      console.error("Error checking medical record status in Home:", error);
    }
  }

  return (
    <>
      {showMedicalRecordBanner && <MedicalRecordBanner />}
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

