import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppointmentService } from "@/services/AppointmentService";
import { ScheduleExceptionService } from "@/services/ScheduleExceptionService";
import { ScheduleRuleService } from "@/services/ScheduleRuleService";
import { ServiceService } from "@/services/ServiceService";
import { getServerSession } from "next-auth";
import Link from "next/link";

// Funciones de formato consistentes con el resto de la aplicación
const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = new Date(`${dateStr}T12:00:00`); // Forzamos mediodía para evitar desfases de zona horaria
  return date.toLocaleDateString("es-ES", options);
};

const formatTime = (timeStr: string) => {
  return timeStr.slice(0, 5);
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken || "";
  const userName = session?.user?.name || "Doctora";
  const userLastName = session?.user?.lastname || "";
  const fullName = userLastName ? `${userName} ${userLastName}` : userName;

  let appointments: any[] = [];
  let services: any[] = [];
  let rules: any[] = [];
  let exceptions: any[] = [];
  let hasError = false;

  // Obtenemos los datos de forma robusta con manejo de errores individual
  try {
    if (token) {
      appointments = await AppointmentService.listAdminAppointments(token);
    }
  } catch (error) {
    console.error("Error al cargar turnos del administrador:", error);
    hasError = true;
  }

  try {
    services = await ServiceService.get();
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    hasError = true;
  }

  try {
    if (token) {
      rules = await ScheduleRuleService.get(token);
    }
  } catch (error) {
    console.error("Error al cargar reglas de horarios:", error);
    hasError = true;
  }

  try {
    if (token) {
      exceptions = await ScheduleExceptionService.get(token);
    }
  } catch (error) {
    console.error("Error al cargar excepciones de horarios:", error);
    hasError = true;
  }

  // --- CÁLCULO DE MÉTRICAS ---

  // 1. Turnos activos (PENDING o CONFIRMED)
  const activeAppointments = appointments.filter(
    (app) => app.appointmentStatus === "CONFIRMED" || app.appointmentStatus === "PENDING"
  );

  // Turnos programados para hoy
  const todayStr = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  const todayAppointments = activeAppointments.filter((app) => app.date === todayStr);

  // 2. Servicios cargados
  const totalServices = services.length;

  // 3. Días de la semana que trabaja
  const uniqueDays = Array.from(new Set(rules.map((rule) => rule.dayOfWeek)));
  const totalWorkingDays = uniqueDays.length;

  const dayNamesES: Record<string, string> = {
    MONDAY: "Lunes",
    TUESDAY: "Martes",
    WEDNESDAY: "Miércoles",
    THURSDAY: "Jueves",
    FRIDAY: "Viernes",
    SATURDAY: "Sábado",
    SUNDAY: "Domingo",
  };
  const order = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const workingDaysSorted = uniqueDays
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map((day) => dayNamesES[day] || day);
  const workingDaysListStr = workingDaysSorted.length > 0 
    ? workingDaysSorted.join(", ") 
    : "Sin días configurados";

  // 4. Excepciones de horario cargadas
  const totalExceptions = exceptions.length;

  // Próximos turnos a atender (ordenados por fecha y hora, máximo 3)
  const upcomingSortedAppointments = [...activeAppointments]
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 3);

  // Fecha actual en español para el saludo
  const todayDateFormatted = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 rounded-3xl p-8 text-white shadow-lg">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-15 pointer-events-none">
          <svg className="w-80 h-80" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="relative z-10 space-y-2">
          <p className="text-rose-100 text-sm font-semibold tracking-wider uppercase">
            {todayDateFormatted}
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            ¡Hola, Dra. {fullName}!
          </h1>
          <p className="text-rose-50 text-base md:text-lg max-w-2xl font-light">
            Bienvenida a tu panel de control. Aquí tienes el estado general de tu agenda y consultorio para el día de hoy.
          </p>
        </div>
      </div>

      {hasError && (
        <div className="alert alert-warning shadow-sm rounded-2xl flex gap-3 text-amber-800 bg-amber-50 border border-amber-100">
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="font-bold">Aviso de conexión</h3>
            <div className="text-xs">Hubo un inconveniente temporal para conectar con el servidor. Es posible que algunas métricas se muestren desactualizadas.</div>
          </div>
        </div>
      )}

      {/* Grid de Métricas / Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Turnos por Atender */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Próximos Turnos
              </span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {activeAppointments.length}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Turnos por atender en total
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
              {todayAppointments.length} hoy
            </span>
            <Link href="/admin/appointments" className="text-xs font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Ver agenda
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Tarjeta 2: Servicios Cargados */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Servicios Ofrecidos
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {totalServices}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Servicios cargados en el sistema
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Configuraciones activas
            </span>
            <Link href="/admin/services" className="text-xs font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Gestionar
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Tarjeta 3: Días de Trabajo */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Días de Atención
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {totalWorkingDays}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Días laborales a la semana
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="text-[11px] text-slate-400 font-medium truncate max-w-full" title={workingDaysListStr}>
              {workingDaysListStr}
            </div>
            <div className="flex justify-end">
              <Link href="/admin/schedule-rules" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Configurar días
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tarjeta 4: Excepciones Cargadas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Excepciones de Horario
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              {totalExceptions}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Fechas excepcionales cargadas
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Días bloqueados/asueto
            </span>
            <Link href="/admin/schedule-exceptions" className="text-xs font-bold text-purple-500 hover:text-purple-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              Gestionar
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Sección inferior: Próximos Turnos (Resumen de Agenda) */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Próximos Turnos en tu Agenda
            </h2>
            <p className="text-sm text-slate-500">
              Citas médicas más cercanas ordenadas cronológicamente.
            </p>
          </div>
          <Link href="/admin/appointments" className="btn btn-sm btn-ghost hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2">
            Ver agenda completa
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {upcomingSortedAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingSortedAppointments.map((app) => {
              const isTodayApp = app.date === todayStr;
              return (
                <div 
                  key={app.id} 
                  className={`relative bg-slate-50 hover:bg-slate-100/70 border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isTodayApp 
                      ? "border-rose-100 shadow-[0_4px_12px_rgba(244,63,94,0.05)]" 
                      : "border-slate-100"
                  }`}
                >
                  {isTodayApp && (
                    <span className="absolute top-0 right-5 -translate-y-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-rose-500 text-white uppercase shadow-sm">
                      HOY
                    </span>
                  )}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-rose-500 uppercase tracking-wider">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        {formatTime(app.startTime)} - {formatTime(app.endTime)}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 text-base line-clamp-1">
                      {app.user ? `${app.user.name} ${app.user.lastname}` : "Turno Reservado"}
                    </h3>
                    
                    <p className="text-xs text-slate-500 capitalize line-clamp-1">
                      {formatDate(app.date)}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                      Confirmado
                    </span>
                    <span className="text-slate-400 font-light">
                      Ref: #{app.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <div className="w-12 h-12 rounded-full bg-white shadow-xs flex items-center justify-center mx-auto text-slate-400 mb-3">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-700">
              No hay turnos próximos agendados
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No tienes pacientes pendientes en este momento. Los nuevos turnos agendados por tus pacientes se listarán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
