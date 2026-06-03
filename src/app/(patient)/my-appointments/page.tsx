import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PatientAppointmentCard } from "@/components/patient/my-appointments/PatientAppointmentCard";
import { AppointmentService } from "@/services/AppointmentService";
import { getServerSession } from "next-auth";
import Link from "next/link";

export const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(`${dateStr}T12:00:00`); // Forzamos mediodía para evitar desfases de zona horaria
  return date.toLocaleDateString("es-ES", options);
};

// Utilidad para convertir horas de la zona horaria de origen (médico) a la zona horaria destino (paciente)
function convertTimezone(
  dateStr: string,
  timeStr: string,
  sourceTz: string,
  targetTz: string
): { date: string; time: string } {
  try {
    const utcDate = new Date(`${dateStr}T${timeStr}Z`);
    const formatterSource = new Intl.DateTimeFormat("en-US", {
      timeZone: sourceTz,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    
    const partsSource = formatterSource.formatToParts(utcDate);
    const getVal = (type: string) => partsSource.find(p => p.type === type)!.value;
    
    const sourceLocalDate = new Date(
      Date.UTC(
        Number(getVal("year")),
        Number(getVal("month")) - 1,
        Number(getVal("day")),
        Number(getVal("hour")),
        Number(getVal("minute")),
        Number(getVal("second"))
      )
    );
    
    const offsetMs = utcDate.getTime() - sourceLocalDate.getTime();
    const realUtcTimeMs = utcDate.getTime() + offsetMs;
    const realUtcDate = new Date(realUtcTimeMs);
    
    const formatterTarget = new Intl.DateTimeFormat("en-US", {
      timeZone: targetTz,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    
    const partsTarget = formatterTarget.formatToParts(realUtcDate);
    const getValT = (type: string) => partsTarget.find(p => p.type === type)!.value;
    
    const targetYear = getValT("year");
    const targetMonth = getValT("month").padStart(2, "0");
    const targetDay = getValT("day").padStart(2, "0");
    const targetHour = getValT("hour").padStart(2, "0");
    const targetMinute = getValT("minute").padStart(2, "0");
    
    return {
      date: `${targetYear}-${targetMonth}-${targetDay}`,
      time: `${targetHour}:${targetMinute}:00`,
    };
  } catch (error) {
    console.error("Error al convertir zona horaria:", error);
    return { date: dateStr, time: timeStr };
  }
}

export default async function MyAppointments() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken || "";
  const appointments = await AppointmentService.listPatientAppointments(token);

  // Zona horaria del paciente guardada en el usuario (fallback a Argentina/Buenos_Aires)
  const patientTz = session?.user?.timezone || "America/Argentina/Buenos_Aires";

  // Calculamos la fecha actual en formato YYYY-MM-DD respetando la zona horaria del paciente
  const todayStr = new Date().toLocaleDateString("en-CA", {
    timeZone: patientTz,
  });

  // Convertimos las fechas y horas a la zona horaria del paciente
  const convertedAppointments = appointments.map((app) => {
    const adminTz = app.admin?.timezone || "America/Santo_Domingo"; // fallback a Dominicana
    const startTimeConverted = convertTimezone(app.date, app.startTime, adminTz, patientTz);
    const endTimeConverted = convertTimezone(app.date, app.endTime, adminTz, patientTz);
    
    return {
      ...app,
      date: startTimeConverted.date,
      startTime: startTimeConverted.time,
      endTime: endTimeConverted.time,
    };
  });

  // Ordenamos los turnos (más cercanos primero) y luego por hora
  const sortedAppointments = [...convertedAppointments].sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });

  // Agrupamos por fecha
  const groupedAppointments = sortedAppointments.reduce(
    (acc, curr) => {
      if (!acc[curr.date]) {
        acc[curr.date] = [];
      }
      acc[curr.date].push(curr);
      return acc;
    },
    {} as Record<string, any[]>,
  );

  // Separar hoy del resto
  const todayAppointments = groupedAppointments[todayStr] || [];
  const upcomingDates = Object.keys(groupedAppointments)
    .filter((date) => date !== todayStr)
    .sort();

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mis Turnos</h1>
          <p className="text-slate-500 mt-1">
            Visualiza tus próximas citas y el historial de atención.
          </p>
        </div>
        <Link
          href="/appointments"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2 w-fit"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Reservar Nuevo Turno
        </Link>
      </div>

      {/* SECCIÓN HOY */}
      {todayAppointments.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Turnos de Hoy
              </h2>
              <p className="text-sm text-emerald-500 font-medium capitalize">
                {formatDate(todayStr)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {todayAppointments.map((app: any) => (
              <PatientAppointmentCard
                key={app.id}
                appointment={app}
                isToday={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* SECCIÓN PRÓXIMOS TURNOS */}
      {upcomingDates.length > 0 && (
        <section className="pt-6 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            Próximos Turnos
          </h2>

          <div className="space-y-10">
            {upcomingDates.map((date) => (
              <div key={date} className="relative">
                {/* Timeline decorator */}
                <div className="absolute left-0 top-2 bottom-0 w-px bg-slate-200 hidden sm:block ml-[11px]"></div>

                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Fecha Header */}
                  <div className="sm:w-48 shrink-0 flex items-start gap-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center shrink-0 hidden sm:flex mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 capitalize">
                        {formatDate(date).split(",")[0]}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {formatDate(date).split(",")[1]?.trim()}
                      </p>
                    </div>
                  </div>

                  {/* Tarjetas del día */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedAppointments[date].map((app: any) => (
                      <PatientAppointmentCard
                        key={app.id}
                        appointment={app}
                        isToday={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {appointments.length === 0 && (
        <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-700">
            No tienes turnos programados
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            Aún no tienes citas reservadas. ¿Deseas agendar una nueva consulta con nuestros profesionales?
          </p>
          <div className="mt-6">
             <Link
                href="/appointments"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center gap-2"
             >
                Agendar Turno
             </Link>
          </div>
        </div>
      )}
    </div>
  );
}
