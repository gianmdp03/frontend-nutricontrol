import * as z from "zod/mini";

export const scheduleExceptionSchema = z.object({
  date: z
    .string()
    .check(
      z.regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido"),
      z.refine(
        (val) => {
          const select = new Date(val);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return select >= today;
        },
        { message: "La fecha no puede ser anterior a hoy" },
      ),
    ),
  startTime: z
    .string()
    .check(
      z.regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "El horario debe ser válido (HH:mm)",
      ),
    ),
  endTime: z
    .string()
    .check(
      z.regex(
        /^([01]\d|2[0-3]):([0-5]\d)$/,
        "El horario debe ser válido (HH:mm)",
      ),
    ),
  reason: z.optional(z.string()),
});

export type ScheduleExceptionFormValues = z.infer<
  typeof scheduleExceptionSchema
>;
