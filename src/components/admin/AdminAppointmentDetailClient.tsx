"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PatientMedicalRecordModal from "../ui/PatientMedicalRecordModal";
import PrescriptionFormModal from "./PrescriptionFormModal";
import MedicalCertificateFormModal from "./MedicalCertificateFormModal";
import NutritionalPlanFormModal from "./NutritionalPlanFormModal";

interface AdminAppointmentDetailClientProps {
  appointment: any;
}

export default function AdminAppointmentDetailClient({ appointment }: AdminAppointmentDetailClientProps) {
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isNutritionalPlanOpen, setIsNutritionalPlanOpen] = useState(false);

  const isCancelled =
    appointment.appointmentStatus === "CANCELLED" ||
    appointment.appointmentStatus === "CANCELLED_REFUND" ||
    appointment.appointmentStatus === "CANCELLED_WITHOUT_REFUND";

  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(`${dateStr}T12:00:00`);
    return date.toLocaleDateString("es-ES", options);
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  const patientId = appointment.user ? parseInt(appointment.user.id, 10) || 0 : 0;
  const patientName = appointment.user ? `${appointment.user.name} ${appointment.user.lastname || ""}` : "Turno Reservado";

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 md:p-6 min-h-screen">
      {/* Volver y Título */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/appointments"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la Agenda
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Detalles de la Cita Médica
          </h1>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-400 font-bold">Ref: #{appointment.id}</span>
          {isCancelled ? (
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
              Cancelado
            </span>
          ) : (
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
              Confirmado
            </span>
          )}
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información de la Cita */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Resumen del Turno */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-3 mb-5">
              Información de Agenda
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Fecha de la Cita</span>
                <span className="text-base font-bold text-slate-700 capitalize">
                  {formatDate(appointment.date)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Horario</span>
                <span className="text-base font-bold text-slate-700 flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Profesional a Cargo</span>
                <span className="text-base font-bold text-slate-700">
                  Dra. {appointment.admin?.name} {appointment.admin?.lastname || ""}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase">Estado del Pago</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  Completado
                </span>
              </div>

            </div>
          </div>

          {/* Card: Sala de Consulta (Video Call) */}
          {!isCancelled && (
            <div className="bg-gradient-to-r from-rose-50 to-orange-50/50 rounded-3xl p-6 sm:p-8 border border-rose-100/50 shadow-xs relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 text-rose-600">
                <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-950">Sala de Videollamada</h3>
                  <p className="text-sm text-rose-700/80 mt-0.5">
                    Accede a la sesión virtual de consulta en tiempo real con tu paciente.
                  </p>
                </div>

                {appointment.meetingLink ? (
                  <div className="pt-2">
                    <a
                      href={appointment.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-98"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Unirse a la Videollamada
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 border border-slate-100 text-slate-500 text-xs rounded-xl flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>El enlace de la reunión virtual se habilitará una vez que se aproxime el horario pactado.</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Columna Derecha: Paciente y Acciones Clínicas */}
        <div className="space-y-6">
          
          {/* Card del Paciente */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center space-y-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Paciente Asignado</span>
            
            <div className="h-16 w-16 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-black mx-auto shadow-xs">
              {appointment.user?.name?.[0] || "P"}
            </div>

            <div>
              <h4 className="font-extrabold text-slate-800 text-lg">
                {patientName}
              </h4>
              <p className="text-xs text-slate-400 font-semibold">{appointment.user?.email || "Sin email registrado"}</p>
            </div>

            {appointment.user && (
              <button
                onClick={() => setIsRecordOpen(true)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 rounded-xl text-sm transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Ver Ficha Médica
              </button>
            )}
          </div>

          {/* Card: Acciones Clínicas rápidas */}
          {!isCancelled && appointment.user && (
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Gestión Documental</span>
              
              <div className="space-y-2">
                <button
                  onClick={() => setIsPrescriptionOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 bg-rose-50/50 hover:bg-rose-50 text-rose-700 font-bold rounded-2xl text-sm border border-rose-100/30 transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    Emitir Receta Médica
                  </span>
                  <span>+</span>
                </button>

                <button
                  onClick={() => setIsCertificateOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 bg-orange-50/50 hover:bg-orange-50 text-orange-700 font-bold rounded-2xl text-sm border border-orange-100/30 transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Emitir Certificado Médico
                  </span>
                  <span>+</span>
                </button>

                <button
                  onClick={() => setIsNutritionalPlanOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 font-bold rounded-2xl text-sm border border-emerald-100/30 transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Emitir Plan Nutricional
                  </span>
                  <span>+</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Modales */}
      {appointment.user && (
        <>
          <PatientMedicalRecordModal
            isOpen={isRecordOpen}
            onClose={() => setIsRecordOpen(false)}
            patientId={patientId}
            patientName={patientName}
          />

          <PrescriptionFormModal
            isOpen={isPrescriptionOpen}
            onClose={() => setIsPrescriptionOpen(false)}
            patientId={patientId}
            patientName={patientName}
          />

          <MedicalCertificateFormModal
            isOpen={isCertificateOpen}
            onClose={() => setIsCertificateOpen(false)}
            patientId={patientId}
            patientName={patientName}
          />

          <NutritionalPlanFormModal
            isOpen={isNutritionalPlanOpen}
            onClose={() => setIsNutritionalPlanOpen(false)}
            patientId={patientId}
            patientName={patientName}
          />
        </>
      )}
    </div>
  );
}
