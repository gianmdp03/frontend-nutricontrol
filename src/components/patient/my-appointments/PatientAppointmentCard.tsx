"use client";

import React, { useState } from "react";
import ReviewModal from "./ReviewModal";

import { Appointment } from "@/types/Appointment";

export const formatTime = (timeStr: string) => {
  return timeStr.slice(0, 5);
};

type Props = {
  appointment: Appointment;
  isToday: boolean;
};

export function PatientAppointmentCard({ appointment, isToday }: Props) {
  const [showDetails, setShowDetails] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Consideramos cancelado si está en alguno de estos 3 estados
  const isCancelled =
    appointment.appointmentStatus === "CANCELLED" ||
    appointment.appointmentStatus === "CANCELLED_REFUND" ||
    appointment.appointmentStatus === "CANCELLED_WITHOUT_REFUND";

  // Determinar si el turno ya finalizó (estado COMPLETED o fecha en el pasado, y no en curso)
  const isCompleted =
    !isCancelled &&
    appointment.appointmentStatus !== "IN_PROGRESS" &&
    (appointment.appointmentStatus === "COMPLETED" ||
      appointment.appointmentStatus === "FINISHED" ||
      new Date(`${appointment.date}T${appointment.endTime || "23:59:59"}`) < new Date());

  const doctorName = appointment.admin
    ? `Dra. ${appointment.admin.name} ${appointment.admin.lastname}`
    : "Dra. Zully María Cepeda Morel";

  return (
    <div
      className={`relative bg-white rounded-2xl p-5 transition-all duration-200 border ${
        isToday && !isCancelled
          ? "border-emerald-100 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)] hover:border-emerald-300 hover:shadow-[0_8px_30px_-4px_rgba(16,185,129,0.15)]"
          : isCancelled
            ? "border-slate-100 shadow-sm opacity-60 bg-slate-50"
            : isCompleted
              ? "border-indigo-100 hover:border-indigo-200 shadow-sm"
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
          ) : isCompleted ? (
             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
               <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
               Finalizado
             </span>
          ) : appointment.appointmentStatus === "IN_PROGRESS" ? (
             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
               <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
               En Curso
             </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              {appointment.appointmentStatus === "CONFIRMED" ? "Confirmado" : "Pendiente"}
            </span>
          )}
          {appointment.appointmentType === "NUTRITIONAL" ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
              Nutricional
            </span>
          ) : appointment.appointmentType === "CONSULTATION" ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              Consulta General
            </span>
          ) : null}
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1 focus:outline-none"
        >
          {showDetails ? "Ocultar detalles" : "Ver detalles"}
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Botón directo de reseña si finalizó */}
      {isCompleted && !appointment.hasReviewed && !reviewSubmitted && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs hover:shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.24.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.175 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.77-.57-.37-1.81.588-1.81h4.906a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Dejar mi Reseña
          </button>
        </div>
      )}

      {/* Modal para ingresar la valoración */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        doctorName={doctorName}
        appointmentId={appointment.id}
        onSuccess={() => setReviewSubmitted(true)}
      />

      {/* Botón directo de Videollamada si el turno está confirmado/en progreso y no está colapsado */}
      {!showDetails && (appointment.appointmentStatus === "CONFIRMED" || appointment.appointmentStatus === "IN_PROGRESS") && appointment.meetingLink && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <a
            href={appointment.meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Unirse a la videollamada
          </a>
        </div>
      )}

      {/* Sección Detalle del Turno */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5">
          {(appointment.appointmentStatus === "CONFIRMED" || appointment.appointmentStatus === "IN_PROGRESS") && appointment.meetingLink ? (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2.5 text-emerald-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-sm text-emerald-950">Link de Google Meet disponible</h5>
                  <p className="text-[11px] text-emerald-700">Tu sala virtual está lista para la consulta.</p>
                </div>
              </div>
              <a
                href={appointment.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl text-sm transition-colors shadow-xs"
              >
                Unirse a la videollamada
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ) : (
            <div className="text-xs text-slate-600 space-y-2.5 bg-slate-50/50 border border-slate-100 rounded-xl p-3.5">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Nutricionista:</span>
                <span className="font-semibold text-slate-800">
                  {appointment.admin ? `Dra. ${appointment.admin.name} ${appointment.admin.lastname}` : "Nutricionista"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-400">Horario:</span>
                <span className="font-semibold text-slate-800">
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ID Referencia:</span>
                <span className="font-mono text-slate-500">#{appointment.id}</span>
              </div>

              {appointment.appointmentStatus === "PENDING" && (
                <div className="mt-2.5 p-2.5 bg-amber-50/50 border border-amber-100 rounded-lg text-amber-700 text-[11px] leading-normal flex gap-2">
                  <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>El link de Google Meet estará disponible una vez que se confirme el pago de la consulta.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

