"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormValues, registerSchema } from "@/schemas/RegisterSchema";
import TimezoneSelector from "@/components/ui/TimezoneSelector";

export default function RegisterPage() {
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      timezone: "America/Argentina/Buenos_Aires",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (tz) {
          setValue("timezone", tz);
        }
      } catch (err) {
        console.error("Error al detectar zona horaria:", err);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (res.ok) {
        // Redirigimos al login con un parámetro en la URL para mostrar un mensaje de éxito
        router.push("/login?registered=true");
      } else {
        const errorData = await res.json();
        setGlobalError(
          errorData.message ||
            "Ocurrió un error al registrarse. El correo o nombre de usuario podría ya estar en uso.",
        );
      }
    } catch (err) {
      setGlobalError(
        "No se pudo conectar con el servidor. Intenta de nuevo más tarde.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a Tu Médico RD para gestionar tus turnos
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {globalError && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center border border-red-200">
              {globalError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Campo Nombre */}
            <div>
              <input
                {...register("name")}
                type="text"
                className={`appearance-none rounded-lg w-full px-3 py-3 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
                placeholder="Nombre"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Campo Apellido */}
            <div>
              <input
                {...register("lastname")}
                type="text"
                className={`appearance-none rounded-lg w-full px-3 py-3 border ${
                  errors.lastname ? "border-red-500" : "border-gray-300"
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
                placeholder="Apellido"
              />
              {errors.lastname && (
                <p className="mt-1 text-xs text-red-500 font-medium">
                  {errors.lastname.message}
                </p>
              )}
            </div>
          </div>

          {/* Campo Nombre de Usuario */}
          <div>
            <input
              {...register("username")}
              type="text"
              className={`appearance-none rounded-lg w-full px-3 py-3 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
              placeholder="Nombre de usuario"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Campo Email */}
          <div>
            <input
              {...register("email")}
              type="email"
              className={`appearance-none rounded-lg w-full px-3 py-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
              placeholder="Correo electrónico"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Password */}
          <div>
            <input
              {...register("password")}
              type="password"
              className={`appearance-none rounded-lg w-full px-3 py-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm`}
              placeholder="Contraseña"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Campo Zona Horaria */}
          <TimezoneSelector
            label="Zona horaria"
            error={errors.timezone?.message}
            value={watch("timezone")}
            onChange={(tz) =>
              setValue("timezone", typeof tz === "string" ? tz : tz.value)
            }
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-rose-500 hover:bg-rose-600 focus:ring-2 focus:ring-rose-500 disabled:bg-rose-400 transition-colors"
          >
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-600">¿Ya tienes una cuenta? </span>
          <Link
            href="/login"
            className="font-medium text-rose-500 hover:text-rose-600"
          >
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
