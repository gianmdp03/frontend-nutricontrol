"use client";

import { useState, FormEvent } from "react";
import { ForgotEmailWizardProps } from "@/types/Auth";
import { forgotEmailAction } from "@/actions/authActions";

export default function ForgotEmailWizard({ onClose, onForgotPassword }: ForgotEmailWizardProps) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Por favor, ingresa tu nombre de usuario.");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await forgotEmailAction(username.trim());
    setIsLoading(false);

    if (response.success && response.data) {
      setEmail(response.data);
    } else {
      setError(response.message || "No se encontró ningún correo asociado a este nombre de usuario.");
    }
  };

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Cabecera decorativa simple */}
      <div className="text-center space-y-1">
        <div className="mx-auto w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Recuperar Correo
        </h3>
        <p className="text-xs text-gray-500 px-4">
          {!email 
            ? "Ingresa tu nombre de usuario para mostrar el correo asociado a tu cuenta." 
            : "Hemos encontrado la cuenta vinculada a ese nombre de usuario."}
        </p>
      </div>

      {/* Alertas de Error */}
      {error && (
        <div 
          id="forgot-email-error"
          className="bg-red-50 text-red-600 p-3 rounded-lg text-xs text-center border border-red-100 animate-pulse font-medium"
        >
          {error}
        </div>
      )}

      {!email ? (
        /* Formulario para ingresar username */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="forgot-email-username" className="block text-xs font-semibold text-gray-700">
              Nombre de Usuario
            </label>
            <input
              id="forgot-email-username"
              type="text"
              required
              disabled={isLoading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all shadow-sm"
              placeholder="Ej: usuario123"
            />
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <button
              id="forgot-email-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-rose-350 transition-all cursor-pointer shadow-md shadow-rose-100"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Buscando correo...
                </>
              ) : (
                "Buscar mi email"
              )}
            </button>
            <button
              id="forgot-email-cancel-btn"
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full text-center py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      ) : (
        /* Vista de Éxito */
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-emerald-50 border border-emerald-150 rounded-xl p-5 text-center space-y-3">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-medium">
                El correo asociado a tu cuenta es:
              </p>
              <p 
                id="forgot-email-result-value"
                className="mt-2 text-base font-bold text-emerald-900 tracking-wide bg-white/70 py-2 px-3 rounded-lg border border-emerald-100/50 shadow-inner select-all inline-block font-mono"
              >
                {email}
              </p>
            </div>
          </div>


          <div className="flex flex-col space-y-2 pt-2">
            <button
              id="forgot-email-to-forgot-password-btn"
              type="button"
              onClick={onForgotPassword}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all cursor-pointer shadow-md shadow-rose-100"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <button
              id="forgot-email-back-login-btn"
              type="button"
              onClick={onClose}
              className="w-full text-center py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Volver al Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
