"use server";

import { AuthService } from "@/services/AuthService";
import { ApiError } from "@/utils/ApiError";
import { AuthenticationPasswordDTO } from "@/types/User";
import { ActionResponse, ActionResponseWithData } from "@/types/Auth";

export async function requestVerificationCodeAction(
  email: string,
): Promise<ActionResponse> {
  try {
    const message = await AuthService.requestVerificationCode(email);
    return {
      success: true,
      message: message || "Código de verificación enviado con éxito.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        error: error.message,
        details: error.details,
      };
    }
    console.error("Error in requestVerificationCodeAction:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al solicitar el código de verificación.",
      error: "Ocurrió un error inesperado al solicitar el código de verificación.",
    };
  }
}

export async function verifyCodeAction(
  email: string,
  code: string,
): Promise<ActionResponseWithData<string>> {
  try {
    const token = await AuthService.verifyCode(email, code);
    return {
      success: true,
      message: "Código verificado con éxito.",
      data: token,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: "El código es inválido o ha expirado.",
        error: error.message,
      };
    }
    console.error("Error in verifyCodeAction:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al verificar el código.",
      error: "Ocurrió un error inesperado al verificar el código.",
    };
  }
}

export async function changePasswordAction(
  dto: AuthenticationPasswordDTO,
): Promise<ActionResponse> {
  try {
    const message = await AuthService.changePassword(dto);
    return {
      success: true,
      message: message || "Contraseña restablecida con éxito.",
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        message: error.message,
        error: error.message,
        details: error.details,
      };
    }
    console.error("Error in changePasswordAction:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al restablecer la contraseña.",
      error: "Ocurrió un error inesperado al restablecer la contraseña.",
    };
  }
}

export async function forgotEmailAction(
  username: string,
): Promise<ActionResponseWithData<string>> {
  try {
    const email = await AuthService.forgotEmail(username);
    return {
      success: true,
      message: "Correo electrónico recuperado con éxito.",
      data: email,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.statusCode === 404) {
        return {
          success: false,
          message: "No se encontró ningún correo asociado a este nombre de usuario.",
          error: "UserNotFound",
        };
      }
      return {
        success: false,
        message: error.message,
        error: error.message,
        details: error.details,
      };
    }
    console.error("Error in forgotEmailAction:", error);
    return {
      success: false,
      message: "Ocurrió un error inesperado al buscar el correo electrónico.",
      error: "UnexpectedError",
    };
  }
}

