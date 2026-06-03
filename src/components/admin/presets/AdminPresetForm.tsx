"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminPresetSchema, AdminPresetFormValues } from "@/schemas/AdminPresetSchema";
import { saveAdminPresetAction } from "@/actions/adminPresetActions";
import { AdminPresetDetailDTO } from "@/types/AdminPreset";

interface AdminPresetFormProps {
  initialData?: AdminPresetDetailDTO;
}

export default function AdminPresetForm({ initialData }: AdminPresetFormProps) {
  const [isPending, startTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminPresetFormValues>({
    resolver: zodResolver(adminPresetSchema),
    defaultValues: {
      adminName: initialData?.adminName || "",
      specialty: initialData?.specialty || "",
      exequatur: initialData?.exequatur || "",
    },
  });

  const onSubmit = (data: AdminPresetFormValues) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    startTransition(async () => {
      const res = await saveAdminPresetAction(data);
      if (res.success) {
        setSuccessMessage("Configuración de preset guardada correctamente.");
      } else {
        setErrorMessage(res.error || "Ocurrió un error al guardar el preset.");
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Preset para Recetas y Certificados</h2>
          <p className="text-xs text-slate-500">Datos predeterminados que aparecerán firmados en tus documentos médicos.</p>
        </div>
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

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Nombre del Profesional</label>
          <input
            type="text"
            placeholder="Ej: Dra. María Pérez"
            {...register("adminName")}
            className={`w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
              errors.adminName ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-rose-400"
            }`}
          />
          {errors.adminName && (
            <p className="text-[11px] text-red-500 font-bold mt-0.5">{errors.adminName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Especialidad</label>
          <input
            type="text"
            placeholder="Ej: Nutrición y Dietética"
            {...register("specialty")}
            className={`w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
              errors.specialty ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-rose-400"
            }`}
          />
          {errors.specialty && (
            <p className="text-[11px] text-red-500 font-bold mt-0.5">{errors.specialty.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase">Exequátur / Matrícula Profesional</label>
          <input
            type="text"
            placeholder="Ej: 12345-67"
            {...register("exequatur")}
            className={`w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border rounded-xl text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-100 ${
              errors.exequatur ? "border-red-300 focus:ring-red-100" : "border-slate-200 focus:border-rose-400"
            }`}
          />
          {errors.exequatur && (
            <p className="text-[11px] text-red-500 font-bold mt-0.5">{errors.exequatur.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl text-sm transition-all hover:shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              <span>Guardando preset...</span>
            </>
          ) : (
            <span>Guardar Configuración</span>
          )}
        </button>
      </form>
    </div>
  );
}
