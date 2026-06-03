"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { nutritionalPlanSchema, NutritionalPlanFormValues } from "@/schemas/NutritionalPlanSchema";
import { createManualNutritionalPlanAction } from "@/actions/nutritionalPlanActions";
import ManualDocumentList from "@/components/admin/documents/ManualDocumentList";

const DAYS_OF_WEEK = [
  { key: "MONDAY", label: "Lunes" },
  { key: "TUESDAY", label: "Martes" },
  { key: "WEDNESDAY", label: "Miércoles" },
  { key: "THURSDAY", label: "Jueves" },
  { key: "FRIDAY", label: "Viernes" },
  { key: "SATURDAY", label: "Sábado" },
  { key: "SUNDAY", label: "Domingo" },
] as const;

export default function ManualNutritionalPlanPage() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<typeof DAYS_OF_WEEK[number]["key"]>("MONDAY");
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(nutritionalPlanSchema),
    defaultValues: {
      patientName: "",
      age: "",
      textareaTexto: "",
      userId: undefined,
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

  const onSubmit = (data: any) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      // Cast the userId explicitly to null since it's manual/unregistered
      const payload = {
        ...data,
        userId: null,
      };

      const res = await createManualNutritionalPlanAction(payload);

      if (res.success) {
        setSuccessMessage("Plan nutricional creado con éxito.");
        reset();
        setActiveDay("MONDAY");
        setRefreshKey((prev) => prev + 1);
      } else {
        setErrorMessage(res.error || "Hubo un error al crear el plan nutricional.");
      }
    });
  };

  // Safe checks for errors in weeklyMenu
  const getDayErrors = (dayKey: string) => {
    const weeklyErrors = errors.weeklyMenu as any;
    return weeklyErrors?.[dayKey];
  };

  const activeDayErrors = getDayErrors(activeDay);

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 relative overflow-hidden"
      >
        {/* Gradients */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="border-b border-slate-100 pb-5 mb-6">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
            Generación Manual (Paciente no registrado)
          </span>
          <h2 className="text-2xl font-extrabold text-slate-800 mt-1">Generar Plan Nutricional</h2>
          <p className="text-sm text-slate-500 mt-1">
            Diseña un plan alimenticio semanal estructurado con recomendaciones personalizadas para un paciente externo.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {successMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-2xl border border-emerald-100 flex items-center gap-3 animate-pulse">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 bg-red-50 text-red-700 text-sm font-semibold rounded-2xl border border-red-100 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Group 1: General Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Nombre Completo del Paciente
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                {...register("patientName")}
                className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
                  errors.patientName
                    ? "border-red-300 focus:ring-red-100"
                    : "border-slate-200 focus:border-rose-400"
                }`}
              />
              {errors.patientName?.message && (
                <p className="text-xs text-red-500 font-bold mt-1">
                  {errors.patientName.message.toString()}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Edad del Paciente
              </label>
              <input
                type="text"
                placeholder="Ej: 32 años"
                {...register("age")}
                className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
                  errors.age
                    ? "border-red-300 focus:ring-red-100"
                    : "border-slate-200 focus:border-rose-400"
                }`}
              />
              {errors.age?.message && (
                <p className="text-xs text-red-500 font-bold mt-1">
                  {errors.age.message.toString()}
                </p>
              )}
            </div>
          </div>

          {/* Recommendations Textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Recomendaciones Generales e Indicaciones
            </label>
            <textarea
              rows={4}
              placeholder="Ej: Mantener una buena hidratación (al menos 2.5 litros diarios), evitar azúcares ultraprocesados y respetar los horarios..."
              {...register("textareaTexto")}
              className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                errors.textareaTexto
                  ? "border-red-300 focus:ring-red-100"
                  : "border-slate-200 focus:border-rose-400"
              }`}
            />
            {errors.textareaTexto?.message && (
              <p className="text-xs text-red-500 font-bold mt-1">
                {errors.textareaTexto.message.toString()}
              </p>
            )}
          </div>

          {/* Weekly Menu Section */}
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Menú Semanal por Día
              </label>
              <p className="text-xs text-slate-400 mt-0.5">
                Completa el menú para cada día de la semana. Haz clic en las pestañas para cambiar de día.
              </p>
            </div>

            {/* Day Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = activeDay === day.key;
                const hasErrors = !!getDayErrors(day.key);
                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => setActiveDay(day.key)}
                    className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
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

            {/* Meals Inputs for Active Day */}
            <div className="bg-slate-50/50 rounded-2xl p-4 sm:p-5 border border-slate-100 space-y-4">
              <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wide">
                Menú del {DAYS_OF_WEEK.find((d) => d.key === activeDay)?.label}
              </h4>

              {/* Breakfast */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase">Desayuno</label>
                <textarea
                  rows={2}
                  placeholder={`Desayuno para el día ${DAYS_OF_WEEK.find((d) => d.key === activeDay)?.label.toLowerCase()}...`}
                  {...register(`weeklyMenu.${activeDay}.breakfast` as const)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                    activeDayErrors?.breakfast
                      ? "border-red-300 focus:ring-red-100"
                      : "border-slate-200 focus:border-rose-400"
                  }`}
                />
                {activeDayErrors?.breakfast && (
                  <p className="text-xs text-red-500 font-bold mt-0.5">
                    {activeDayErrors.breakfast.message}
                  </p>
                )}
              </div>

              {/* Lunch */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase">Almuerzo</label>
                <textarea
                  rows={2}
                  placeholder={`Almuerzo para el día ${DAYS_OF_WEEK.find((d) => d.key === activeDay)?.label.toLowerCase()}...`}
                  {...register(`weeklyMenu.${activeDay}.lunch` as const)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                    activeDayErrors?.lunch
                      ? "border-red-300 focus:ring-red-100"
                      : "border-slate-200 focus:border-rose-400"
                  }`}
                />
                {activeDayErrors?.lunch && (
                  <p className="text-xs text-red-500 font-bold mt-0.5">
                    {activeDayErrors.lunch.message}
                  </p>
                )}
              </div>

              {/* Dinner */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase">Cena</label>
                <textarea
                  rows={2}
                  placeholder={`Cena para el día ${DAYS_OF_WEEK.find((d) => d.key === activeDay)?.label.toLowerCase()}...`}
                  {...register(`weeklyMenu.${activeDay}.dinner` as const)}
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
                    activeDayErrors?.dinner
                      ? "border-red-300 focus:ring-red-100"
                      : "border-slate-200 focus:border-rose-400"
                  }`}
                />
                {activeDayErrors?.dinner && (
                  <p className="text-xs text-red-500 font-bold mt-0.5">
                    {activeDayErrors.dinner.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                reset();
                setErrorMessage(null);
                setSuccessMessage(null);
                setActiveDay("MONDAY");
              }}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-colors cursor-pointer text-center"
            >
              Limpiar Formulario
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl text-sm transition-all hover:shadow-md active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando Plan...</span>
                </>
              ) : (
                <span>Crear Plan Nutricional</span>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <ManualDocumentList
        type="nutritional-plan"
        refreshKey={refreshKey}
      />
    </div>
  );
}
