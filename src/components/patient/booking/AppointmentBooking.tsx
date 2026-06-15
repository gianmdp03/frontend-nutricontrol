"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentSchema,
  AppointmentFormValues,
} from "@/schemas/AppointmentSchema";
import FormSelect from "@/components/ui/FormSelect";
import { useEffect, useState } from "react";
import { AppointmentSlot } from "@/services/AppointmentService";
import { createAppointmentAction } from "@/actions/appointmentActions";

const APPOINTMENT_PRICE = process.env.NEXT_PUBLIC_APPOINTMENT_PRICE || "20";

interface Props {
  doctorsList: { value: string; label: string }[];
  availableSlots: AppointmentSlot[];
}

export default function AppointmentBooking({
  doctorsList,
  availableSlots,
}: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      adminId: doctorsList.length === 1 ? doctorsList[0].value : "",
    },
  });

  useEffect(() => {
    register("appointmentType");
  }, [register]);

  const selectedAdmin = watch("adminId");
  const selectedDate = watch("date");
  const selectedTime = watch("startTime");
  const selectedType = watch("appointmentType");

  const selectedDoctorLabel = doctorsList.find((d) => d.value === selectedAdmin)?.label || "";

  const getSelectedDateLabel = (dateStr: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "UTC",
    });
  };

  useEffect(() => {
    setValue("date", "");
    setValue("startTime", "");
  }, [selectedAdmin, selectedType, setValue]);

  // Filtramos por el administrador seleccionado
  const filteredSlots = availableSlots.filter(
    (slot) => slot.adminId.toString() === selectedAdmin
  );

  // Agrupamos por fecha convirtiendo el UTC a la hora local del dispositivo
  const groupedSlots = filteredSlots.reduce((acc, slot) => {
    // Convertimos el string UTC a un objeto Date (que automáticamente lo adapta a la zona local)
    const dateObj = new Date(slot.startTimeUTC);

    // Extraemos la fecha en la zona horaria del dispositivo (YYYY-MM-DD)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const localDateStr = `${year}-${month}-${day}`;

    // Extraemos la hora en la zona horaria del dispositivo (HH:mm)
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const localTimeStr = `${hours}:${minutes}`;

    if (!acc[localDateStr]) {
      acc[localDateStr] = [];
    }
    if (!acc[localDateStr].includes(localTimeStr)) {
      acc[localDateStr].push(localTimeStr);
    }
    return acc;
  }, {} as Record<string, string[]>);

  // Obtenemos los días ordenados
  const daysList = Object.entries(groupedSlots).sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  );

  // Ordenamos los horarios de cada día
  daysList.forEach(([_, times]) => {
    times.sort();
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    const selectedSlot = availableSlots.find((slot) => {
      const dateObj = new Date(slot.startTimeUTC);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const localDateStr = `${year}-${month}-${day}`;

      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      const localTimeStr = `${hours}:${minutes}`;

      return (
        slot.adminId.toString() === data.adminId &&
        localDateStr === data.date &&
        localTimeStr === data.startTime
      );
    });

    if (!selectedSlot) {
      alert("No se encontró el horario seleccionado. Por favor, volvé a intentarlo.");
      return;
    }

    const payload = {
      startTime: selectedSlot.startTimeUTC,
      adminId: data.adminId,
      appointmentType: data.appointmentType,
    };

    const result = await createAppointmentAction(payload);
    
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-8"
    >
      {/* 1. SECCIÓN: Elegir Médico */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
          1. Profesional
        </h2>
        <FormSelect
          label="Médico / Especialista"
          registration={register("adminId")}
          error={errors.adminId?.message}
          options={doctorsList}
        />
      </div>

      {/* 2. SECCIÓN: Tipo de Consulta */}
      {mounted && selectedAdmin && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
            2. Tipo de Consulta
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("appointmentType", "NUTRITIONAL", { shouldValidate: true })}
              className={`flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                selectedType === "NUTRITIONAL"
                  ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/10"
              }`}
            >
              <div className={`p-2 rounded-xl mb-3 ${selectedType === "NUTRITIONAL" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-md">Consulta Nutricional</span>
              <span className="text-xs text-gray-500 mt-1">
                Planes alimenticios personalizados, seguimiento antropométrico y objetivos corporales.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setValue("appointmentType", "CONSULTATION", { shouldValidate: true })}
              className={`flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left cursor-pointer ${
                selectedType === "CONSULTATION"
                  ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/10"
              }`}
            >
              <div className={`p-2 rounded-xl mb-3 ${selectedType === "CONSULTATION" ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-600"}`}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-md">Consulta General</span>
              <span className="text-xs text-gray-500 mt-1">
                Dudas generales, revisión de estudios médicos y consultas clínicas generales.
              </span>
            </button>
          </div>
          {errors.appointmentType?.message && (
            <p className="text-red-500 text-sm mt-2">{errors.appointmentType.message as string}</p>
          )}
        </div>
      )}

      {/* 3. SECCIÓN: Elegir Horario */}
      {mounted && selectedAdmin && selectedType && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
            3. Horario disponible
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {daysList.map(([dateString, times]) => {
              const niceDate = new Date(dateString).toLocaleDateString(
                "es-AR",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  timeZone: "UTC",
                },
              );

              return (
                <div
                  key={dateString}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                >
                  <h3 className="text-md font-bold text-gray-700 capitalize mb-3">
                    {niceDate}
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {times.map((time) => {
                      const isSelected =
                        selectedDate === dateString && selectedTime === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setValue("date", dateString, {
                              shouldValidate: true,
                            });
                            setValue("startTime", time, {
                              shouldValidate: true,
                            });
                          }}
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-black text-white border-black shadow-md scale-105"
                              : "bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. SECCIÓN: Resumen y Precio */}
      {mounted && selectedAdmin && selectedType && selectedDate && selectedTime && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/60 pb-2">
            Resumen del Turno
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs font-medium">Profesional</span>
              <span className="font-semibold text-slate-900">{selectedDoctorLabel}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs font-medium">Tipo de Consulta</span>
              <span className="font-semibold text-slate-900">
                {selectedType === "NUTRITIONAL" ? "Consulta Nutricional" : "Consulta General"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs font-medium">Fecha</span>
              <span className="font-semibold text-slate-900 capitalize">{getSelectedDateLabel(selectedDate)}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 block text-xs font-medium">Horario</span>
              <span className="font-semibold text-slate-900">{selectedTime} hs</span>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
            <div>
              <span className="text-slate-900 font-bold block text-base">Total a pagar</span>
              <span className="text-xs text-slate-500">El pago se procesará de forma segura</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-emerald-600">${APPOINTMENT_PRICE} USD</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={!mounted || isSubmitting || !selectedTime || !selectedAdmin || !selectedType}
          className="w-full bg-blue-600 text-white font-medium py-3.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg cursor-pointer"
        >
          {isSubmitting ? "Procesando reserva..." : "Confirmar Turno"}
        </button>
      </div>
    </form>
  );
}
