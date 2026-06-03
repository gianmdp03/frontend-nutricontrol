import { handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const PaymentService = {
  confirmPayment: async (paypalOrderId: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/payments/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paypalOrderId }),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }
  },
};
