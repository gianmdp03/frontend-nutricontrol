"use server";

import { AppointmentService } from "@/services/AppointmentService";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function createAppointmentAction(data: {
  startTime: string;
  adminId: string;
}) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado. Por favor, iniciá sesión." };
  }

  let response;
  try {
    response = await AppointmentService.createAppointment(data, token);
  } catch (error) {
    return {
      error: "Hubo un problema de conexión con el servidor al crear el turno",
    };
  }

  if (response?.approveLink) {
    redirect(response.approveLink);
  } else {
    return { error: "No se recibió un link de pago válido" };
  }
}
