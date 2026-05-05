import * as z from "zod/mini";

export const appointmentSchema = z.object({
  adminId: z.string().check(z.minLength(1, "Por favor, elegí un profesional.")),
  date: z.string("Elegí un día."),
  startTime: z.string("Elegí un horario."),
});

// Inferimos el tipo exactamente igual que siempre
export type AppointmentFormValues = z.infer<typeof appointmentSchema>;