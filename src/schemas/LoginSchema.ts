import * as z from "zod/mini";

export const loginSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .check(z.minLength(6, "La contraseña debe tener al menos 6 caracteres")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
