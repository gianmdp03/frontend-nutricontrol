"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { nutritionalPlanSchema, NutritionalPlanFormValues } from "@/schemas/NutritionalPlanSchema";
import { createNutritionalPlanAction } from "@/actions/nutritionalPlanActions";

const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Lunes" },
  { key: "TUESDAY", label: "Martes" },
  { key: "WEDNESDAY", label: "Miércoles" },
  { key: "THURSDAY", label: "Jueves" },
  { key: "FRIDAY", label: "Viernes" },
  { key: "SATURDAY", label: "Sábado" },
  { key: "SUNDAY", label: "Domingo" },
] as const;

interface NutritionalPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
  patientName: string;
}

export default function NutritionalPlanFormModal({
  isOpen,
  onClose,
  patientId,
  patientName,
}: NutritionalPlanFormModalProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<typeof DAYS_OF_WEEK[number]["key"]>("MONDAY");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NutritionalPlanFormValues>({
    resolver: zodResolver(nutritionalPlanSchema),
    defaultValues: {
      patientName: patientName,
      age: "",
      textareaTexto: "",
      userId: patientId,
      weeklyMenu: {
        MONDAY: { breakfast: "", lunch: "", dinner: "" },
        TUESDAY: { breakfast: "", lunch: "", dinner: "" },
        WEDNESDAY: { breakfast: "", lunch: "", dinner: "" },
        THURSDAY: { breakfast: "", lunch: "", dinner: "" },
        FRIDAY: { breakfast: "", lunch: "", dinner: "" },
        SATURDAY: { breakfast: "", lunch: "", dinner: "" },
        SUNDAY: { breakfast: "", lunch: "", dinner: "" },
      },
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        patientName: patientName,
        age: "",
        textareaTexto: "",
        userId: patientId,
        weeklyMenu: {
          MONDAY: { breakfast: "", lunch: "", dinner: "" },
          TUESDAY: { breakfast: "", lunch: "", dinner: "" },
          WEDNESDAY: { breakfast: "", lunch: "", dinner: "" },
          THURSDAY: { breakfast: "", lunch: "", dinner: "" },
          FRIDAY: { breakfast: "", lunch: "", dinner: "" },
          SATURDAY: { breakfast: "", lunch: "", dinner: "" },
          SUNDAY: { breakfast: "", lunch: "", dinner: "" },
        },
      });
      setErrorMessage(null);
      setSuccessMessage(null);
      setActiveDay("MONDAY");
    }
  }, [isOpen, patientId, patientName, reset]);

  const onSubmit = (data: NutritionalPlanFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await createNutritionalPlanAction(data);
      if (res.success) {
        setSuccessMessage("Plan nutricional creado con éxito.");
        setTimeout(() => {
          onClose();
          setSuccessMessage(null);
        }, 1500);
      } else {
        setErrorMessage(res.error || "Hubo un error al registrar el plan nutricional.");
      }
    });
  };

  const getDayErrors = (dayKey: string) => {
    const weeklyErrors = errors.weeklyMenu as Record<string, { breakfast?: { message?: string }; lunch?: { message?: string }; dinner?: { message?: string } }> | undefined;
    return weeklyErrors?.[dayKey];
  };

  const activeDayErrors = getDayErrors(activeDay);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
            className="relative bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-10 my-8 max-h-[90vh] flex flex-col"
          >
            {/* Gradient Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4 shrink-0">
              <div>
                <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Documento Clínico</span>
                <h3 className="text-xl font-extrabold text-slate-800 mt-0.5">Emitir Plan Nutricional</h3>
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

            {/* Form Wrap Scrollable */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto flex-1 pr-1">
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

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              {/* Recommendations */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Recomendaciones e indicaciones generales</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Mantenerse hidratado, evitar azúcares, comer a horario..."
                  {...register("textareaTexto")}
                  className={`w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                    errors.textareaTexto ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-rose-400"
                  }`}
                />
                {errors.textareaTexto && (
                  <p className="text-[11px] text-red-500 font-bold mt-0.5">{errors.textareaTexto.message}</p>
                )}
              </div>

              {/* Weekly menu section inside modal */}
              <div className="space-y-3 pt-1">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Menú Semanal</label>
                  <span className="text-[10px] text-slate-400">Selecciona el día para editar</span>
                </div>

                {/* Week Tabs */}
                <div className="flex flex-wrap gap-1">
                  {DAYS_OF_WEEK.map((day) => {
                    const isSelected = activeDay === day.key;
                    const hasErrors = !!getDayErrors(day.key);
                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => setActiveDay(day.key)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? "bg-rose-500 text-white shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-600"
                        } ${hasErrors ? "ring-2 ring-red-300" : ""}`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>

                {/* active day editor */}
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100/60 space-y-3">
                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Breakfast */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Desayuno</label>
                      <textarea
                        rows={1.5}
                        placeholder="Comida matutina..."
                        {...register(`weeklyMenu.${activeDay}.breakfast` as const)}
                        className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                          activeDayErrors?.breakfast ? "border-red-300" : "border-slate-200 focus:border-rose-400"
                        }`}
                      />
                      {activeDayErrors?.breakfast && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{activeDayErrors.breakfast.message}</p>
                      )}
                    </div>

                    {/* Lunch */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Almuerzo</label>
                      <textarea
                        rows={1.5}
                        placeholder="Comida de mediodía..."
                        {...register(`weeklyMenu.${activeDay}.lunch` as const)}
                        className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                          activeDayErrors?.lunch ? "border-red-300" : "border-slate-200 focus:border-rose-400"
                        }`}
                      />
                      {activeDayErrors?.lunch && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{activeDayErrors.lunch.message}</p>
                      )}
                    </div>

                    {/* Dinner */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Cena</label>
                      <textarea
                        rows={1.5}
                        placeholder="Comida nocturna..."
                        {...register(`weeklyMenu.${activeDay}.dinner` as const)}
                        className={`w-full px-3 py-1.5 bg-white border rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                          activeDayErrors?.dinner ? "border-red-300" : "border-slate-200 focus:border-rose-400"
                        }`}
                      />
                      {activeDayErrors?.dinner && (
                        <p className="text-[10px] text-red-500 font-bold mt-0.5">{activeDayErrors.dinner.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 shrink-0">
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
                    <span>Emitir Plan Nutricional</span>
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
