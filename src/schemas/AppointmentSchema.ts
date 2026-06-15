import * as z from "zod/mini";

export const appointmentTypeEnum = z.enum(
  [
    "NUTRITIONAL",
    "CONSULTATION",
  ],
  {
    error: () => ({ message: "Por favor, seleccioná el tipo de turno." }),
  }
);

export const appointmentSchema = z.object({
  adminId: z.string().check(z.minLength(1, "Por favor, elegí un profesional.")),
  date: z.string("Elegí un día."),
  startTime: z.string("Elegí un horario."),
  appointmentType: appointmentTypeEnum,
});

// Inferimos el tipo exactamente igual que siempre
export type AppointmentFormValues = z.infer<typeof appointmentSchema>;