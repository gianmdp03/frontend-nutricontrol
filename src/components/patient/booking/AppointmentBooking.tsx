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

  const selectedAdmin = watch("adminId");
  const selectedDate = watch("date");
  const selectedTime = watch("startTime");

  useEffect(() => {
    setValue("date", "");
    setValue("startTime", "");
  }, [selectedAdmin, setValue]);

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

      {/* 2. SECCIÓN: Elegir Horario */}
      {mounted && selectedAdmin && (
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

      <div className="pt-4 border-t">
        <button
          type="submit"
          disabled={!mounted || isSubmitting || !selectedTime || !selectedAdmin}
          className="w-full bg-blue-600 text-white font-medium py-3.5 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg"
        >
          {isSubmitting ? "Procesando reserva..." : "Confirmar Turno"}
        </button>
      </div>
    </form>
  );
}
