import * as z from "zod/mini";

export const serviceSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(3, "El nombre debe tener al menos 3 caracteres"),
      z.maxLength(50, "El nombre es demasiado largo"),
    ),
  description: z.string(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
