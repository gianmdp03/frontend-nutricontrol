import * as z from "zod/mini";

export const prescriptionSchema = z.object({
  patientName: z
    .string()
    .check(z.minLength(1, "El nombre del paciente es obligatorio")),
  age: z
    .string()
    .check(z.minLength(1, "La edad es obligatoria")),
  textareaTexto: z
    .string()
    .check(z.minLength(1, "El cuerpo de la receta es obligatorio")),
  userId: z.number(),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;
