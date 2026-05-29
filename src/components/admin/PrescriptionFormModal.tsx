"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { prescriptionSchema, PrescriptionFormValues } from "@/schemas/PrescriptionSchema";
import { createPrescriptionAction } from "@/actions/prescriptionActions";

interface PrescriptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
}

export default function PrescriptionFormModal({
  isOpen,
  onClose,
  patientId,
  patientName,
}: PrescriptionFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientName: patientName,
      age: "",
      textareaTexto: "",
      userId: patientId,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        patientName: patientName,
        age: "",
        textareaTexto: "",
        userId: patientId,
      });
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, patientId, patientName, reset]);

  const onSubmit = (data: PrescriptionFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await createPrescriptionAction(data);
      if (res.success) {
        setSuccessMessage("Receta médica creada con éxito.");
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setErrorMessage(res.error || "Hubo un error al registrar la receta.");
      }
    });
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

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-10"
          >
            {/* Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Documento Clínico</span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">Crear Receta Médica</h3>
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {successMessage && (
                <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Hidden Patient ID */}
              <input type="hidden" {...register("userId", { valueAsNumber: true })} />

              {/* Patient Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Paciente</label>
                <input
                  type="text"
                  readOnly
                  {...register("patientName")}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Patient Age */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Edad del Paciente</label>
                <input
                  type="text"
                  placeholder="Ej: 28 años, 8 meses"
                  {...register("age")}
                  className={`w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
                    errors.age ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-rose-400"
                  }`}
                />
                {errors.age && (
                  <p className="text-[11px] text-red-500 font-bold mt-0.5">{errors.age.message}</p>
                )}
              </div>

              {/* Textarea Cuerpo */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Indicaciones / Cuerpo de la Receta</label>
                <textarea
                  rows={6}
                  placeholder="Escribe la prescripción, medicamentos, dosis e indicaciones médicas aquí..."
                  {...register("textareaTexto")}
                  className={`w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                    errors.textareaTexto ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-rose-400"
                  }`}
                />
                {errors.textareaTexto && (
                  <p className="text-[11px] text-red-500 font-bold mt-0.5">{errors.textareaTexto.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Emitir Receta</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
