import React from "react";

export const formatTime = (timeStr: string) => {
  return timeStr.slice(0, 5);
};

type Props = {
  appointment: any;
  isToday: boolean;
};

export function PatientAppointmentCard({ appointment, isToday }: Props) {
  // Consideramos cancelado si está en alguno de estos 3 estados
  const isCancelled =
    appointment.appointmentStatus === "CANCELLED" ||
    appointment.appointmentStatus === "CANCELLED_REFUND" ||
    appointment.appointmentStatus === "CANCELLED_WITHOUT_REFUND";

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 transition-all duration-200 border ${
        isToday && !isCancelled
          ? "border-emerald-100 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:border-emerald-300 hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)]"
          : isCancelled
            ? "border-slate-100 shadow-sm opacity-60 bg-slate-50"
            : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
      }`}
    >
      {/* Decoración superior para HOY */}
      {isToday && !isCancelled && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-400 to-teal-400 rounded-t-2xl"></div>
      )}

      <div className="flex justify-between items-start">
        <div className="flex gap-4 items-center">
          <div
            className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 border ${
              isCancelled
                ? "bg-slate-100 border-slate-200 text-slate-400"
                : "bg-slate-50 border-slate-100 text-slate-800"
            }`}
          >
            <span className="text-lg font-bold leading-none">
              {formatTime(appointment.startTime)}
            </span>
          </div>
          <div>
            <h4
              className={`font-bold text-lg ${isCancelled ? "text-slate-500 line-through" : "text-slate-800"}`}
            >
              {appointment.admin
                ? `Dra. ${appointment.admin.name} ${appointment.admin.lastname}`
                : "Nutricionista"}
            </h4>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <svg
                className="w-4 h-4"
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
              {formatTime(appointment.startTime)} -{" "}
              {formatTime(appointment.endTime)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCancelled ? (
             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
               <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
               Cancelado
             </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              Confirmado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
