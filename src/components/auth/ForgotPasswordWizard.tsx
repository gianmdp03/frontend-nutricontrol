"use client";

import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent, ClipboardEvent, FormEvent } from "react";
import { ForgotPasswordWizardProps } from "@/types/Auth";
import { requestVerificationCodeAction, verifyCodeAction, changePasswordAction } from "@/actions/authActions";

export default function ForgotPasswordWizard({ onClose, onSuccess }: ForgotPasswordWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [token, setToken] = useState<string>("");
  
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Limpiar errores cuando cambia de paso
  useEffect(() => {
    setError("");
    setSuccessMsg("");
  }, [step]);

  // Validar formato de email
  const validateEmail = (emailVal: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailVal);
  };

  // Paso 1: Enviar correo de recuperación
  const handleRequestCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await requestVerificationCodeAction(email);
    setIsLoading(false);

    if (response.success) {
      setSuccessMsg(response.message);
      // Retrasar ligeramente la transición para que el usuario pueda ver el mensaje de éxito
      setTimeout(() => {
        setStep(2);
      }, 1500);
    } else {
      setError(response.message || "Ocurrió un error. Intenta de nuevo.");
    }
  };

  // Paso 2: Controladores del input OTP de 6 casilleros
  const handleOtpChange = (element: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = element.target.value;
    if (/[^a-zA-Z0-9]/.test(value)) return; // Solo caracteres alfanuméricos

    const newOtp = [...otp];
    // Tomar solo el último caracter ingresado
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Mover foco al siguiente input si tiene contenido
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Si el casillero actual está vacío y se presiona retroceso, borrar el anterior y enfocarlo
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        otpInputsRef.current[index - 1]?.focus();
      } else {
        // Borrar el casillero actual
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 0) return;

    const newOtp = [...otp];
    const codeChars = pastedData.substring(0, 6).split("");

    for (let i = 0; i < 6; i++) {
      if (codeChars[i] && /[a-zA-Z0-9]/.test(codeChars[i])) {
        newOtp[i] = codeChars[i];
      }
    }
    setOtp(newOtp);

    // Poner el foco en el último casillero lleno o en el sexto
    const focusIndex = Math.min(codeChars.length - 1, 5);
    otpInputsRef.current[focusIndex]?.focus();
  };

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Por favor, ingresa el código completo de 6 dígitos.");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await verifyCodeAction(email, code);
    setIsLoading(false);

    if (response.success && response.data) {
      setToken(response.data);
      setSuccessMsg("Código validado con éxito.");
      setTimeout(() => {
        setStep(3);
      }, 1200);
    } else {
      setError(response.message || "Código inválido o expirado.");
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    const response = await requestVerificationCodeAction(email);
    setIsLoading(false);

    if (response.success) {
      setSuccessMsg("Se ha reenviado un nuevo código de verificación a tu correo.");
    } else {
      setError(response.message || "Error al reenviar el código. Intenta nuevamente.");
    }
  };

  // Paso 3: Restablecer contraseña
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 6 || password.length > 64) {
      setError("La contraseña debe tener entre 6 y 64 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    setError("");

    const response = await changePasswordAction({
      email,
      token,
      password,
    });
    setIsLoading(false);

    if (response.success) {
      setSuccessMsg("¡Contraseña actualizada con éxito! Redirigiendo...");
      // Limpiar estados
      setEmail("");
      setOtp(Array(6).fill(""));
      setToken("");
      setPassword("");
      setConfirmPassword("");
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } else {
      setError(response.message || "Error al actualizar la contraseña. Revisa los datos de seguridad.");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Cabecera del Stepper */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          {/* Círculo Paso 1 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= 1 ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "bg-gray-100 text-gray-400"
            }`}
          >
            {step > 1 ? "✓" : "1"}
          </div>
          <span className={`text-xs font-semibold ${step >= 1 ? "text-gray-900" : "text-gray-400"}`}>
            Solicitar
          </span>
        </div>

        {/* Línea Divisoria */}
        <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${step >= 2 ? "bg-rose-500" : "bg-gray-200"}`} />

        <div className="flex items-center space-x-2">
          {/* Círculo Paso 2 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= 2 ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "bg-gray-100 text-gray-400"
            }`}
          >
            {step > 2 ? "✓" : "2"}
          </div>
          <span className={`text-xs font-semibold ${step >= 2 ? "text-gray-900" : "text-gray-400"}`}>
            Validar
          </span>
        </div>

        {/* Línea Divisoria */}
        <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${step >= 3 ? "bg-rose-500" : "bg-gray-200"}`} />

        <div className="flex items-center space-x-2">
          {/* Círculo Paso 3 */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              step >= 3 ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "bg-gray-100 text-gray-400"
            }`}
          >
            3
          </div>
          <span className={`text-xs font-semibold ${step >= 3 ? "text-gray-900" : "text-gray-400"}`}>
            Restablecer
          </span>
        </div>
      </div>

      {/* Título y Subtítulo según el Paso */}
      <div className="text-center space-y-1">
        <h3 className="text-xl font-bold text-gray-900">
          {step === 1 && "Recuperar Contraseña"}
          {step === 2 && "Validar Código"}
          {step === 3 && "Nueva Contraseña"}
        </h3>
        <p className="text-xs text-gray-500">
          {step === 1 && "Te enviaremos un código de un solo uso por correo electrónico."}
          {step === 2 && `Ingresa el código de 6 dígitos que enviamos a: ${email}`}
          {step === 3 && "Ingresa tu nueva contraseña para acceder al sistema."}
        </p>
      </div>

      {/* Alertas de Mensaje */}
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-xs text-center border border-red-150 animate-pulse">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg text-xs text-center border border-emerald-100">
          {successMsg}
        </div>
      )}

      {/* Formularios por Pasos */}
      {step === 1 && (
        <form onSubmit={handleRequestCode} className="space-y-4">
          <div>
            <label htmlFor="recovery-email" className="block text-xs font-semibold text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="recovery-email"
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition-all"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <button
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
                  Enviando código...
                </>
              ) : (
                "Enviar código de verificación"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full text-center py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <label className="block text-xs font-semibold text-gray-700">
              Código de verificación
            </label>
            {/* Input OTP Contenedor de 6 casilleros */}
            <div className="flex justify-center space-x-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputsRef.current[idx] = el;
                  }}
                  type="text"
                  maxLength={1}
                  required
                  disabled={isLoading}
                  value={digit}
                  onChange={(e) => handleOtpChange(e, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  onPaste={handleOtpPaste}
                  className="w-11 h-12 text-center text-lg font-bold text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all bg-gray-50 uppercase shadow-inner"
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <button
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
                  Validando código...
                </>
              ) : (
                "Validar Código"
              )}
            </button>
            
            <div className="text-center pt-2">
              <span className="text-xs text-gray-400">¿No recibiste el correo? </span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors disabled:text-rose-300 cursor-pointer"
              >
                Reenviar código
              </button>
            </div>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isLoading}
              className="w-full text-center py-2 text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            >
              Atrás (Cambiar correo)
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Campo Contraseña */}
          <div className="space-y-1">
            <label htmlFor="new-password" className="block text-xs font-semibold text-gray-700">
              Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm pr-10 transition-all"
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="space-y-1">
            <label htmlFor="confirm-new-password" className="block text-xs font-semibold text-gray-700">
              Confirmar Nueva Contraseña
            </label>
            <div className="relative">
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm pr-10 transition-all"
                placeholder="Repite la contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <button
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
                  Restableciendo contraseña...
                </>
              ) : (
                "Guardar Nueva Contraseña"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
