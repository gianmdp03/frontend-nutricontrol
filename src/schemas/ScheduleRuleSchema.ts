import * as z from "zod/mini";

export const dayOfWeekEnum = z.enum(
  [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ],
  {
    error: () => ({ message: "Por favor elija un día válido" }),
  },
);

export const scheduleRuleSchema = z.object({
  dayOfWeek: dayOfWeekEnum,
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
});

export type ScheduleRuleFormValues = z.infer<typeof scheduleRuleSchema>;