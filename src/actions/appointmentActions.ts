"use server";

import { AppointmentService } from "@/services/AppointmentService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError, handleResponseError } from "@/utils/ApiError";

export async function createAppointmentAction(data: {
  startTime: string;
  adminId: string;
}) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado. Por favor, iniciá sesión.", error: "No estás autenticado. Por favor, iniciá sesión." };
  }

  let response;
  try {
    response = await AppointmentService.createAppointment(data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createAppointmentAction:", error);
    return {
      success: false,
      message: "Hubo un problema de conexión con el servidor al crear el turno",
      error: "Hubo un problema de conexión con el servidor al crear el turno",
    };
  }

  if (response?.approveLink) {
    redirect(response.approveLink);
  } else {
    return { success: false, message: "No se recibió un link de pago válido", error: "No se recibió un link de pago válido" };
  }
}

export async function confirmPaymentAction(paypalOrderId: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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

    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in confirmPaymentAction:", error);
    return { success: false, message: "Hubo un problema de conexión al confirmar el pago.", error: "Hubo un problema de conexión al confirmar el pago." };
  }
}

export async function cancelAdminAppointmentAction(id: number, refund: boolean = true) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  try {
    await AppointmentService.cancelAdminAppointment(id, refund, token);
    revalidatePath("/admin/appointments"); 
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in cancelAdminAppointmentAction:", error);
    return { success: false, message: "Hubo un problema al cancelar el turno.", error: "Hubo un problema al cancelar el turno." };
  }
}