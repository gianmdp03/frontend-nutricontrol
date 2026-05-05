"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  appointmentSchema,
  AppointmentFormValues,
} from "@/schemas/AppointmentSchema";
import FormSelect from "@/components/ui/FormSelect";
import { useEffect } from "react";

interface Props {
  doctorsList: { value: string; label: string }[];
  availableSlots: Record<string, string[]>;
}

export default function AppointmentBooking({
  doctorsList,
  availableSlots,
}: Props) {
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

  const selectedAdmin = watch("adminId");
  const selectedDate = watch("date");
  const selectedTime = watch("startTime");

  useEffect(() => {
    setValue("date", "");
    setValue("startTime", "");
  }, [selectedAdmin, setValue]);

  const daysList = Object.entries(availableSlots);

  const onSubmit = async (data: AppointmentFormValues) => {
    console.log("Enviando turno a Spring Boot (sin auth):", data);
    // await createAppointmentAction(data);
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

      {/* 2. SECCIÓN: Elegir Horario */}
      {selectedAdmin && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
            2. Horario disponible
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
                          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all border ${
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

      {/* Botón Final */}
      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={isSubmitting || !selectedTime || !selectedAdmin}
          className="w-full bg-blue-600 text-white font-medium py-3.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {isSubmitting ? "Procesando reserva..." : "Confirmar Turno"}
        </button>
      </div>
    </form>
  );
}
