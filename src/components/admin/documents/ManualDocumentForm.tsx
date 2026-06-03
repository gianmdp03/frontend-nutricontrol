"use client";

import React, { useState, useTransition } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { ZodMiniType } from "zod/mini";

export interface ManualDocumentFormValues {
  patientName: string;
  age: string;
  textareaTexto: string;
  userId?: number | null;
}

interface ManualDocumentFormProps {
  title: string;
  subtitle: string;
  textareaLabel: string;
  textareaPlaceholder: string;
  schema: ZodMiniType<ManualDocumentFormValues>;
  onSubmitAction: (data: ManualDocumentFormValues) => Promise<{ success?: boolean; error?: string; data?: unknown }>;
  successRedirectUrl?: string;
  buttonLabel: string;
  onSuccess?: () => void;
}

export default function ManualDocumentForm({
  title,
  subtitle,
  textareaLabel,
  textareaPlaceholder,
  schema,
  onSubmitAction,
  successRedirectUrl,
  buttonLabel,
  onSuccess,
}: ManualDocumentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ManualDocumentFormValues>({
    resolver: zodResolver(schema as unknown as Parameters<typeof zodResolver>[0]) as unknown as Resolver<ManualDocumentFormValues, unknown>,
    defaultValues: {
      patientName: "",
      age: "",
      textareaTexto: "",
      userId: undefined,
    },
  });

  const onSubmit = (data: ManualDocumentFormValues) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await onSubmitAction({
        ...data,
        userId: null, // Pure manual mode, always unregistered
      });

      if (res.success) {
        setSuccessMessage("Documento clínico emitido con éxito.");
        reset();
        onSuccess?.();
        if (successRedirectUrl) {
          setTimeout(() => {
            router.push(successRedirectUrl);
          }, 1500);
        }
      } else {
        setErrorMessage(res.error || "Hubo un error al emitir el documento.");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/60 relative overflow-hidden"
    >
      {/* Decorative Gradient Background */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-400/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="border-b border-slate-100 pb-5 mb-6">
        <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
          Generación Manual (Paciente no registrado)
        </span>
        <h2 className="text-2xl font-extrabold text-slate-800 mt-1">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        {/* Patient Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
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
          {errors.patientName && (
            <p className="text-xs text-red-500 font-bold mt-1">{errors.patientName.message}</p>
          )}
        </div>

        {/* Patient Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
            Edad del Paciente
          </label>
          <input
            type="text"
            placeholder="Ej: 32 años, 6 meses"
            {...register("age")}
            className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
              errors.age
                ? "border-red-300 focus:ring-red-100"
                : "border-slate-200 focus:border-rose-400"
            }`}
          />
          {errors.age && (
            <p className="text-xs text-red-500 font-bold mt-1">{errors.age.message}</p>
          )}
        </div>

        {/* Body Textarea */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
            {textareaLabel}
          </label>
          <textarea
            rows={8}
            placeholder={textareaPlaceholder}
            {...register("textareaTexto")}
            className={`w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 resize-none ${
              errors.textareaTexto
                ? "border-red-300 focus:ring-red-100"
                : "border-slate-200 focus:border-rose-400"
            }`}
          />
          {errors.textareaTexto && (
            <p className="text-xs text-red-500 font-bold mt-1">{errors.textareaTexto.message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-3">
          <button
            type="button"
            onClick={() => {
              reset();
              setErrorMessage(null);
              setSuccessMessage(null);
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
                <span>Guardando...</span>
              </>
            ) : (
              <span>{buttonLabel}</span>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
