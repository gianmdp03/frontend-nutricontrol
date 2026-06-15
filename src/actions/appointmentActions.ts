"use server";

import { AppointmentService } from "@/services/AppointmentService";
import { PaymentService } from "@/services/PaymentService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";
import { AppointmentType } from "@/types/Appointment";

export async function createAppointmentAction(data: {
  startTime: string;
  adminId: string;
  appointmentType: AppointmentType;
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
    await PaymentService.confirmPayment(paypalOrderId, token);
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in confirmPaymentAction:", error);
    return { success: false, message: "Hubo un problema de conexión al confirmar el pago.", error: "Hubo un problema de conexión al confirmar el pago." };
  }
}

export async function startAppointmentAction(id: number) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    throw new Error("No estás autenticado.");
  }

  return await AppointmentService.startAppointment(id, token);
}

export async function completeAppointmentAction(id: number) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    throw new Error("No estás autenticado.");
  }

  return await AppointmentService.completeAppointment(id, token);
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