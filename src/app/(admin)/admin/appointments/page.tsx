import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AdminAppointmentCard } from "@/components/admin/appointments/AdminAppointmentCard";
import { AppointmentService } from "@/services/AppointmentService";
import { getServerSession } from "next-auth";

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

export const formatTime = (timeStr: string) => {
  return timeStr.slice(0, 5);
};

export default async function AdminAppointments() {
  const token = (await getServerSession(authOptions))?.user?.backendToken || "";
  const appointments = await AppointmentService.listAdminAppointments(token);

  // Calculamos la fecha actual en formato YYYY-MM-DD respetando la zona horaria local
  const todayStr = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });

  // Ordenamos los turnos (más cercanos primero) y luego por hora
  const sortedAppointments = [...appointments].sort((a, b) => {
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
          <h1 className="text-3xl font-bold text-slate-800">
            Gestión de Turnos
          </h1>
          <p className="text-slate-500 mt-1">
            Administra tus próximas citas y horarios de atención.
          </p>
        </div>
        
      </div>

      {/* SECCIÓN HOY */}
      {todayAppointments.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
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
              <p className="text-sm text-rose-500 font-medium capitalize">
                {formatDate(todayStr)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {todayAppointments.map((app: any) => (
              <AdminAppointmentCard
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
                      <AdminAppointmentCard
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
            No hay turnos programados
          </h3>
          <p className="text-slate-500 mt-1 max-w-sm mx-auto">
            No tienes pacientes agendados en este momento. Los turnos nuevos
            aparecerán aquí.
          </p>
        </div>
      )}
    </div>
  );
}
