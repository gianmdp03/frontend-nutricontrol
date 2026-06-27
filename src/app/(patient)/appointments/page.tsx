import AppointmentBooking from "@/components/patient/booking/AppointmentBooking";
import { AppointmentService } from "@/services/AppointmentService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agendar Turno",
  description: "Agenda una consulta médica o nutricional virtual con la Dra. Zully Cepeda. Elige tu fecha, hora y tipo de consulta de forma 100% digital.",
};

export default async function BookingPage() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;
  if (!token) {
    throw new Error("Debes iniciar sesión para confirmar el turno.");
  }
  // 1. Llamás a tu endpoint directo desde el servidor
  // Next.js hace la petición a Spring Boot antes de mandarle el HTML al usuario
  const availableSlots =
    await AppointmentService.getAvailableAppointments(token);

  // 2. Definís la lista de médicos (por ahora hardcodeada con una sola opción como dijiste)
  const doctorsList = [
    { value: "1", label: "Dra. Zully" }, // Asegurate de que el 'value' coincida con el ID real de la base de datos
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Reservar Turno
        </h1>
        <p className="mt-2 text-gray-600">
          Seleccioná un profesional y elegí tu horario.
        </p>
      </div>

      {/* 3. Le inyectás la data al formulario */}
      <AppointmentBooking
        doctorsList={doctorsList}
        availableSlots={availableSlots}
      />
    </div>
  );
}
