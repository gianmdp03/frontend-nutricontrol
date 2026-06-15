"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PatientMedicalRecordModal from "@/components/admin/documents/PatientMedicalRecordModal";
import PrescriptionFormModal from "@/components/admin/documents/PrescriptionFormModal";
import MedicalCertificateFormModal from "@/components/admin/documents/MedicalCertificateFormModal";
import NutritionalPlanFormModal from "@/components/admin/documents/NutritionalPlanFormModal";
import MedicalHistoryModal from "@/components/admin/documents/MedicalHistoryModal";
import { startAppointmentAction, completeAppointmentAction } from "@/actions/appointmentActions";

import { Appointment } from "@/types/Appointment";

interface AdminAppointmentDetailClientProps {
  appointment: Appointment;
}

export default function AdminAppointmentDetailClient({ appointment: initialAppointment }: AdminAppointmentDetailClientProps) {
  // Estado local para manejar las transiciones del turno sin recargar la página
  const [appointment, setAppointment] = useState(initialAppointment);
  const [loading, setLoading] = useState(false);

  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isNutritionalPlanOpen, setIsNutritionalPlanOpen] = useState(false);
  const [isMedicalHistoryOpen, setIsMedicalHistoryOpen] = useState(false);

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

  // --- HANDLERS DEL CICLO DE VIDA DEL TURNO ---
  const handleStart = async () => {
    try {
      setLoading(true);
      const updated = await startAppointmentAction(appointment.id);
      setAppointment(updated);
      
      // Abre el meet automáticamente
      if (updated.meetingLink) {
        window.open(updated.meetingLink, '_blank');
      }
    } catch (error) {
      console.error("Error al iniciar el turno:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      const updated = await completeAppointmentAction(appointment.id);
      setAppointment(updated);
    } catch (error) {
      console.error("Error al finalizar el turno:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper para renderizar el badge de estado correctamente
  const renderStatusBadge = () => {
    if (isCancelled) {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-2"></span>
          Cancelado
        </span>
      );
    }
    if (appointment.appointmentStatus === "COMPLETED") {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
          Finalizado
        </span>
      );
    }
    if (appointment.appointmentStatus === "IN_PROGRESS") {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-xs animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2"></span>
          En Curso
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
        Confirmado
      </span>
    );
  };

  // Helper para renderizar el tipo de consulta
  const renderTypeBadge = () => {
    if (appointment.appointmentType === "NUTRITIONAL") {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-xs">
          Nutricional
        </span>
      );
    }
    if (appointment.appointmentType === "CONSULTATION") {
      return (
        <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 shadow-xs">
          Consulta General
        </span>
      );
    }
    return null;
  };

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
          {renderTypeBadge()}
          {renderStatusBadge()}
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

          {/* Card: Turno Finalizado (Reemplaza a la sala si ya se completó) */}
          {appointment.appointmentStatus === "COMPLETED" && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50/50 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-xs relative overflow-hidden text-center">
              <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Consulta Finalizada</h3>
              <p className="text-sm text-emerald-700/80 mt-1">
                Este turno fue marcado como completado exitosamente.
              </p>
            </div>
          )}

          {/* Card: Sala de Consulta (Video Call) - Sólo si no está cancelado ni completado */}
          {!isCancelled && appointment.appointmentStatus !== "COMPLETED" && (
            <div className="bg-gradient-to-r from-rose-50 to-orange-50/50 rounded-3xl p-6 sm:p-8 border border-rose-100/50 shadow-xs relative overflow-hidden transition-all">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 text-rose-600">
                <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-rose-950">
                    {appointment.appointmentStatus === "IN_PROGRESS" ? "Videollamada en Curso" : "Sala de Videollamada"}
                  </h3>
                  <p className="text-sm text-rose-700/80 mt-0.5">
                    {appointment.appointmentStatus === "IN_PROGRESS" 
                      ? "La consulta está actualmente activa. No te olvides de finalizarla cuando termines." 
                      : "Accede a la sesión virtual de consulta en tiempo real con tu paciente."}
                  </p>
                </div>

                {appointment.meetingLink ? (
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    
                    {appointment.appointmentStatus === "CONFIRMED" && (
                      <button
                        onClick={handleStart}
                        disabled={loading}
                        className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-98 disabled:opacity-70"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {loading ? "Iniciando..." : "Iniciar Turno y Abrir Meet"}
                      </button>
                    )}

                    {appointment.appointmentStatus === "IN_PROGRESS" && (
                      <>
                        <a
                          href={appointment.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-white text-rose-600 font-bold rounded-xl text-sm border border-rose-200 transition-all shadow-sm hover:shadow-md hover:bg-rose-50 active:scale-98"
                        >
                          Reabrir Meet
                        </a>
                        <button
                          onClick={handleComplete}
                          disabled={loading}
                          className="inline-flex justify-center items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg active:scale-98 disabled:opacity-70"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                          {loading ? "Finalizando..." : "Finalizar Turno"}
                        </button>
                      </>
                    )}
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
            <div className={`bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4 ${appointment.appointmentStatus === 'IN_PROGRESS' ? 'ring-2 ring-rose-200 shadow-rose-100' : ''}`}>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block flex items-center justify-between">
                Gestión Documental
                {appointment.appointmentStatus === 'IN_PROGRESS' && (
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </span>
              
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
                    Emitir Certificado
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

                <button
                  onClick={() => setIsMedicalHistoryOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 bg-blue-50/50 hover:bg-blue-50 text-blue-700 font-bold rounded-2xl text-sm border border-blue-100/30 transition-all hover:translate-x-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Historia Médica
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

          <MedicalHistoryModal
            isOpen={isMedicalHistoryOpen}
            onClose={() => setIsMedicalHistoryOpen(false)}
            patientId={patientId}
            patientName={patientName}
          />
        </>
      )}
    </div>
  );
}