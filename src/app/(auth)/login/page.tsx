"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, loginSchema } from "@/schemas/LoginSchema";
import ForgotPasswordWizard from "@/components/auth/ForgotPasswordWizard";
import ForgotEmailWizard from "@/components/auth/ForgotEmailWizard";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  const [isRecoveringEmail, setIsRecoveringEmail] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Limpiar el toast automáticamente
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas. Revisa tu email y contraseña.");
      setIsLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  const handleRecoverySuccess = () => {
    setIsRecovering(false);
    setToast({
      type: "success",
      message: "Tu contraseña ha sido restablecida. Ya puedes iniciar sesión.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Toast Flotante Premium */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 animate-bounce">
          <div className="bg-emerald-50 text-emerald-600 px-5 py-3.5 rounded-xl border border-emerald-250 shadow-2xl flex items-center space-x-2.5 transition-all duration-300">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 transition-all duration-300">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Tu Médico RD
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 italic">
            Gestión de Turnos Médicos
          </p>
        </div>

        {isRecovering ? (
          <ForgotPasswordWizard
            onClose={() => setIsRecovering(false)}
            onSuccess={handleRecoverySuccess}
          />
        ) : isRecoveringEmail ? (
          <ForgotEmailWizard
            onClose={() => setIsRecoveringEmail(false)}
            onForgotPassword={() => {
              setIsRecoveringEmail(false);
              setIsRecovering(true);
            }}
          />
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center border border-red-200 animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Campo Email */}
              <div>
                <input
                  {...register("email")}
                  type="email"
                  className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Correo electrónico"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <input
                  {...register("password")}
                  type="password"
                  className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Contraseña"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
                
                {/* Enlaces de recuperación */}
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => setIsRecoveringEmail(true)}
                    className="font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer focus:outline-none"
                  >
                    ¿Olvidaste tu correo?
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRecovering(true)}
                    className="font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer focus:outline-none"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors cursor-pointer"
            >
              {isLoading ? "Validando..." : "Entrar al Sistema"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
