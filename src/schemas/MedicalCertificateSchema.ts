import * as z from "zod/mini";

export const medicalCertificateSchema = z.object({
  patientName: z
    .string()
    .check(z.minLength(1, "El nombre del paciente es obligatorio")),
  age: z
    .string()
    .check(z.minLength(1, "La edad es obligatoria")),
  textareaTexto: z
    .string()
    .check(z.minLength(1, "El cuerpo del certificado es obligatorio")),
  userId: z.optional(z.number()),
});

export type MedicalCertificateFormValues = z.infer<typeof medicalCertificateSchema>;
