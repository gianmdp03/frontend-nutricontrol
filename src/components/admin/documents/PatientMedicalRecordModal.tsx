"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPatientMedicalRecordAction } from "@/actions/medicalRecordActions";
import { MedicalRecordDetailDTO } from "@/types/MedicalRecord";

interface PatientMedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | number;
  patientName: string;
}

export default function PatientMedicalRecordModal({
  isOpen,
  onClose,
  patientId,
  patientName,
}: PatientMedicalRecordModalProps) {
  const [record, setRecord] = useState<MedicalRecordDetailDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !patientId) return;

    async function fetchRecord() {
      setLoading(true);
      setError(null);
      const res = await getPatientMedicalRecordAction(patientId);
      if (res.success && res.data) {
        setRecord(res.data);
      } else {
        // En caso de que el backend lance error de recurso no encontrado, puede indicar que aún no tiene ficha
        setRecord(null);
        // Si es un error crítico de conexión o permisos, lo mostramos
        if (res.error && !res.error.toLowerCase().includes("not found") && !res.error.toLowerCase().includes("404")) {
          setError(res.error);
        }
      }
      setLoading(false);
    }

    fetchRecord();
  }, [isOpen, patientId]);

  const formatDate = (dateVal?: any) => {
    if (!dateVal) return "N/A";
    try {
      const parseDateSafe = (dateVal: any): Date => {
        if (!dateVal) return new Date(0);
        if (dateVal instanceof Date) return dateVal;
        if (typeof dateVal === "string" && /^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateVal)) {
          const [datePart, timePart = ""] = dateVal.split(" ");
          const [day, month, year] = datePart.split("/").map(Number);
          const [hour = 0, minute = 0, second = 0] = timePart ? timePart.split(":").map(Number) : [];
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (Array.isArray(dateVal)) {
          const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
          return new Date(year, month - 1, day, hour, minute, second);
        }
        if (typeof dateVal === "object") {
          const year = dateVal.year || dateVal.yearValue || 0;
          const month = dateVal.monthValue || dateVal.month || 1;
          const day = dateVal.dayOfMonth || dateVal.day || 1;
          const hour = dateVal.hour || dateVal.hours || 0;
          const minute = dateVal.minute || dateVal.minutes || 0;
          const second = dateVal.second || dateVal.seconds || 0;
          if (year > 0) {
            let monthIndex = 0;
            if (typeof month === "number") {
              monthIndex = month - 1;
            } else if (typeof month === "string") {
              const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
              const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
              const mLower = month.toLowerCase();
              const idx = months.indexOf(mLower);
              if (idx !== -1) monthIndex = idx;
              else {
                const idxShort = shortMonths.indexOf(mLower.substring(0, 3));
                if (idxShort !== -1) monthIndex = idxShort;
              }
            }
            return new Date(year, monthIndex, day, hour, minute, second);
          }
        }
        const parsed = new Date(dateVal);
        if (isNaN(parsed.getTime())) {
          const fallback = new Date(`${dateVal}T12:00:00`);
          return isNaN(fallback.getTime()) ? parsed : fallback;
        }
        return parsed;
      };

      const parsedDate = parseDateSafe(dateVal);
      return parsedDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100/80 z-10 max-h-[85vh] overflow-y-auto custom-scrollbar"
          >
            {/* Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* Cabecera */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Historial Clínico</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-0.5">{patientName}</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido */}
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                <p className="text-sm text-slate-400 font-medium">Buscando ficha médica del paciente...</p>
              </div>
            ) : error ? (
              <div className="py-6 text-center text-red-600 bg-red-50 border border-red-100 rounded-2xl p-4 flex flex-col items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs font-semibold">{error}</p>
              </div>
            ) : record ? (
              /* Ficha Médica Existente */
              <div className="space-y-6">
                
                {/* Métricas Corporales */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Edad</span>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">
                      {record.age || "N/A"} <span className="text-sm font-bold text-slate-500">años</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Peso Corporal</span>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">
                      {record.weight} <span className="text-sm font-bold text-slate-500">kg</span>
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-xs font-semibold text-slate-400 block uppercase">Altura</span>
                    <span className="text-2xl font-black text-slate-800 mt-1 block">
                      {record.height} <span className="text-sm font-bold text-slate-500">cm</span>
                    </span>
                  </div>
                </div>

                {/* Historial Clínico */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Antecedentes Patológicos / Clínicos
                  </h4>
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap min-h-[80px]">
                    {record.medicalHistory || "Ninguno declarado por el paciente."}
                  </div>
                </div>

                {/* Medicamentos */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Medicamentos / Suplementos Dietéticos
                  </h4>
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap min-h-[60px]">
                    {record.medication || "Ninguno declarado por el paciente."}
                  </div>
                </div>

                {/* Pie de Ficha */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>ID Paciente: #{patientId}</span>
                  <span>Última actualización: {formatDate(record.lastUpdateDate)}</span>
                </div>

              </div>
            ) : (
              /* Ficha no completada aún */
              <div className="py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xs text-slate-400 mb-3.5">
                  <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Ficha Médica Pendiente</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-[280px] mx-auto leading-relaxed">
                  Este paciente aún no ha completado sus datos clínicos en su panel de perfil.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
