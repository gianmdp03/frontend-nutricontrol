"use client";

import { useState } from "react";

export const formatTime = (timeStr: string) => {
  return timeStr.slice(0, 5);
};

type Props = {
  appointment: any; // Using any or importing the right type
  isToday: boolean;
  onCancel?: () => void;
};

export function AdminAppointmentCard({
  appointment,
  isToday,
  onCancel,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  
  const onToggleDropdown = () => setIsOpen(!isOpen);
  const isCancelled = appointment.appointmentStatus === "CANCELLED";

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 transition-all duration-200 border ${
        isToday && !isCancelled
          ? "border-rose-100 shadow-[0_4px_20px_-4px_rgba(244,63,94,0.1)] hover:border-rose-300 hover:shadow-[0_8px_30px_-4px_rgba(244,63,94,0.15)]"
          : isCancelled
            ? "border-slate-100 shadow-sm opacity-60 bg-slate-50"
            : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
      }`}
    >
      {/* Decoración superior para HOY */}
      {isToday && !isCancelled && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-400 to-orange-400 rounded-t-2xl"></div>
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
            {/* Aquí a futuro iría el nombre del paciente, ahora mostramos que es un turno */}
            <h4
              className={`font-bold text-lg ${isCancelled ? "text-slate-500 line-through" : "text-slate-800"}`}
            >
              Turno Reservado
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

        {/* Dropdown Options */}
        <div className="relative">
          <button
            onClick={onToggleDropdown}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-100"
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
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>

          {isOpen && (
            <>
              {/* Overlay invisible para cerrar al clickear afuera */}
              <div
                className="fixed inset-0 z-10"
                onClick={onToggleDropdown}
              ></div>

              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-20 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
                <div className="p-1.5">
                  <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors flex items-center gap-2">
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Ver detalles
                  </button>

                  {!isCancelled && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        if (onCancel) onCancel();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 mt-1"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Cancelar Turno
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Badge de Estado */}
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

        {/* Placeholder Doctora Zully */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[10px]">
            {appointment.admin.name[0]}
          </div>
          <span className="hidden sm:inline">
            Dra. {appointment.admin.lastname}
          </span>
        </div>
      </div>
    </div>
  );
}
