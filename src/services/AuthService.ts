import { ApiError, handleResponseError } from "@/utils/ApiError";
import { AuthenticationPasswordDTO } from "@/types/User";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const AuthService = {
  requestVerificationCode: async (email: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/forgot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return await response.text();
  },

  verifyCode: async (email: string, code: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/verify/${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return await response.text();
  },

  changePassword: async (dto: AuthenticationPasswordDTO): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/forgot/change`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return await response.text();
  },

  forgotEmail: async (username: string): Promise<string> => {
    const response = await fetch(`${API_URL}/auth/forgot-email/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return await response.text();
  },
};
