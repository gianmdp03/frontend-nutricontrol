"use server";

import { PrescriptionService } from "@/services/PrescriptionService";
import { PrescriptionRequestDTO } from "@/types/Prescription";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";

export async function createPrescriptionAction(data: PrescriptionRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, message: "No tienes permisos para realizar esta acción.", error: "No tienes permisos para realizar esta acción." };
  }

  try {
    const response = await PrescriptionService.createPrescription(data, token);
    revalidatePath("/admin/appointments");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createPrescriptionAction:", error);
    return { success: false, message: "Hubo un problema al guardar la receta.", error: "Hubo un problema al guardar la receta." };
  }
}

export async function createManualPrescriptionAction(data: PrescriptionRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, message: "No tienes permisos para realizar esta acción.", error: "No tienes permisos para realizar esta acción." };
  }

  try {
    const response = await PrescriptionService.createManualPrescription(data, token);
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createManualPrescriptionAction:", error);
    return { success: false, message: "Hubo un problema al guardar la receta manual.", error: "Hubo un problema al guardar la receta manual." };
  }
}
