import * as z from "zod/mini";

export const dailyMenuSchema = z.object({
  breakfast: z
    .string()
    .check(z.minLength(1, "El desayuno es obligatorio")),
  lunch: z
    .string()
    .check(z.minLength(1, "El almuerzo es obligatorio")),
  dinner: z
    .string()
    .check(z.minLength(1, "La cena es obligatoria")),
});

export const weeklyMenuSchema = z.object({
  MONDAY: dailyMenuSchema,
  TUESDAY: dailyMenuSchema,
  WEDNESDAY: dailyMenuSchema,
  THURSDAY: dailyMenuSchema,
  FRIDAY: dailyMenuSchema,
  SATURDAY: dailyMenuSchema,
  SUNDAY: dailyMenuSchema,
});

export const nutritionalPlanSchema = z.object({
  patientName: z
    .string()
    .check(z.minLength(1, "El nombre del paciente es obligatorio")),
  age: z
    .string()
    .check(z.minLength(1, "La edad es obligatoria")),
  textareaTexto: z
    .string()
    .check(z.minLength(1, "Las recomendaciones son obligatorias")),
  weeklyMenu: weeklyMenuSchema,
  userId: z.optional(z.number()),
});

export type NutritionalPlanFormValues = z.infer<typeof nutritionalPlanSchema>;
