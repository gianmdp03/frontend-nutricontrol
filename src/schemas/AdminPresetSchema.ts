import * as z from "zod/mini";

export const adminPresetSchema = z.object({
  adminName: z
    .string()
    .check(
      z.minLength(1, "El nombre del administrador es obligatorio"),
      z.maxLength(50, "El nombre no puede exceder los 50 caracteres"),
    ),
  specialty: z
    .string()
    .check(
      z.minLength(1, "La especialidad es obligatoria"),
      z.maxLength(50, "La especialidad no puede exceder los 50 caracteres"),
    ),
  exequatur: z
    .string()
    .check(
      z.minLength(1, "El exequátur es obligatorio"),
      z.maxLength(10, "El exequátur no puede exceder los 10 caracteres"),
    ),
});

export type AdminPresetFormValues = z.infer<typeof adminPresetSchema>;
