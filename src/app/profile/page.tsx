import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import AdminPresetForm from "@/components/admin/presets/AdminPresetForm";
import { AdminPresetService } from "@/services/AdminPresetService";
import PatientDocumentsView from "@/components/patient/documents/PatientDocumentsView";
import { PrescriptionService } from "@/services/PrescriptionService";
import { MedicalCertificateService } from "@/services/MedicalCertificateService";
import { NutritionalPlanService } from "@/services/NutritionalPlanService";
import { PrescriptionDetailDTO } from "@/types/Prescription";
import { MedicalCertificateDetailDTO } from "@/types/MedicalCertificate";
import { NutritionalPlanDetailDTO } from "@/types/NutritionalPlan";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { name, email, role } = session.user;
  const token = session.user.backendToken || "";
  let presetData = undefined;
  let prescriptions: PrescriptionDetailDTO[] = [];
  let certificates: MedicalCertificateDetailDTO[] = [];
  let nutritionalPlans: NutritionalPlanDetailDTO[] = [];

  if (role === "ROLE_ADMIN") {
    try {
      presetData = await AdminPresetService.getPreset(token);
    } catch (e) {
      console.error("Error loading admin preset in ProfilePage:", e);
    }
  }

  if (role === "ROLE_PATIENT") {
    try {
      prescriptions = await PrescriptionService.getPatientPrescriptions(token);
    } catch (e) {
      console.error("Error loading patient prescriptions in ProfilePage:", e);
    }

    try {
      certificates = await MedicalCertificateService.getPatientMedicalCertificates(token);
    } catch (e) {
      console.error("Error loading patient medical certificates in ProfilePage:", e);
    }

    try {
      nutritionalPlans = await NutritionalPlanService.getPatientNutritionalPlans(token);
    } catch (e) {
      console.error("Error loading patient nutritional plans in ProfilePage:", e);
    }
  }
  const userName = name || "Usuario";
  const userRole = role === "ROLE_ADMIN" ? "Administrador" : "Paciente";
  const nameParts = userName.trim().split(" ");
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
    : userName.substring(0, 2).toUpperCase();

  const isPatient = role === "ROLE_PATIENT";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar variant="HOME" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="h-32 bg-linear-to-r from-rose-400 to-orange-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
              <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                <svg className="w-48 h-48 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            
            <div className="px-8 pb-8 relative">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="h-24 w-24 rounded-full bg-white p-1.5 shadow-md">
                  <div className="h-full w-full rounded-full bg-linear-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
                  </div>
                </div>
                <div>
                  <button disabled className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-400 text-sm font-medium rounded-lg cursor-not-allowed transition-colors">
                    Editar Perfil (Pronto)
                  </button>
                </div>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{userName}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <p className="text-slate-500 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {email}
                  </p>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                    {userRole}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {isPatient ? (
              <>
                {/* Tarjeta 1: Mis Turnos */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Mis Turnos
                  </h2>
                  <div className="flex flex-col items-center justify-center flex-1 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Revisa tus turnos agendados o agenda uno nuevo.</p>
                    <Link href="/my-appointments" className="mt-5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95">
                      Ir a mis turnos
                    </Link>
                  </div>
                </div>

                {/* Tarjeta 2: Mi Ficha Médica */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Mi Ficha Médica
                  </h2>
                  <div className="flex flex-col items-center justify-center flex-1 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Actualiza tu peso, altura, medicamentos e historial médico.</p>
                    <Link href="/medical-record" className="mt-5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95">
                      Gestionar Ficha
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* AdminPreset Form */}
                <AdminPresetForm initialData={presetData} />

                {/* Tarjeta Admin Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Panel de Administración
                  </h2>
                  <div className="flex flex-col items-center justify-center flex-1 py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                      <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">Accede a las herramientas de gestión del sistema.</p>
                    <Link href="/admin" className="mt-5 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium rounded-lg shadow-sm transition-all hover:shadow-md active:scale-95">
                      Ir al Panel
                    </Link>
                  </div>
                </div>
              </>
            )}
            
          </div>

          {isPatient && (
            <PatientDocumentsView
              prescriptions={prescriptions}
              certificates={certificates}
              nutritionalPlans={nutritionalPlans}
              token={token}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
