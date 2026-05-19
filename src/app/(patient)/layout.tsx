import Navbar from "@/components/layout/Navbar";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  // Aquí podés crear un Navbar específico o pasarle una prop al original
  return (
    <>
      <Navbar variant="APPOINTMENT_PATIENT" /> 
      <main>{children}</main>
    </>
  );
}