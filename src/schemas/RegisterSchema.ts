import * as z from "zod/mini";

export const registerSchema = z.object({
  name: z
    .string()
    .check(
      z.minLength(2, { error: "El nombre debe tener al menos 2 caracteres" }),
    ),
  lastname: z
    .string()
    .check(
      z.minLength(2, { error: "El apellido debe tener al menos 2 caracteres" }),
    ),
  username: z.string().check(
    z.minLength(3, {
      error: "El nombre de usuario debe tener al menos 3 caracteres",
    }),
  ),
  email: z
    .string()
    .check(z.email({ error: "Introduce un correo electrónico válido" })),
  password: z.string().check(
    z.minLength(6, {
      error: "La contraseña debe tener al menos 6 caracteres",
    }),
  ),
  timezone: z
    .string()
    .check(z.minLength(1, { error: "La zona horaria es obligatoria" })),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
