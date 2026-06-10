"use server";

import { MedicalHistoryService } from "@/services/MedicalHistoryService";
import {
  MedicalHistoryRequestDTO,
  MedicalHistoryDetailDTO,
  MedicalHistoryTrackingRequestDTO,
  MedicalHistoryUpdateDTO,
} from "@/types/MedicalHistory";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: Record<string, string>;
}

export async function checkMedicalHistoryExistsAction(
  userId: number,
): Promise<ActionResponse<boolean>> {
  console.log("[DEBUG ACTION] checkMedicalHistoryExistsAction para userId:", userId);
  try {
    console.log("[DEBUG ACTION] Obteniendo sesión de servidor...");
    const session = await getServerSession(authOptions);
    console.log("[DEBUG ACTION] Sesión obtenida:", session ? "Sí" : "No");
    const token = session?.user?.backendToken;
    console.log("[DEBUG ACTION] Token de backend:", token ? "Presente" : "Ausente");

    if (!token) {
      console.log("[DEBUG ACTION] Error: No hay token en la sesión.");
      return { success: false, error: "No estás autenticado.", message: "No estás autenticado." };
    }

    console.log("[DEBUG ACTION] Llamando a MedicalHistoryService.checkExists...");
    const exists = await MedicalHistoryService.checkExists(userId, token);
    console.log("[DEBUG ACTION] checkExists retorno:", exists);
    return { success: true, data: exists };
  } catch (error) {
    console.error("[DEBUG ACTION] Error capturado en checkMedicalHistoryExistsAction:", error);
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.details as Record<string, string>, message: error.message };
    }
    return { success: false, error: "Error al verificar la existencia de la historia médica.", message: "Error al verificar la existencia de la historia médica." };
  }
}

export async function getMedicalHistoryAction(
  userId: number,
): Promise<ActionResponse<MedicalHistoryDetailDTO>> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, error: "No estás autenticado.", message: "No estás autenticado." };
  }

  try {
    const data = await MedicalHistoryService.getById(userId, token);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.details as Record<string, string>, message: error.message };
    }
    console.error("Error in getMedicalHistoryAction:", error);
    return { success: false, error: "Error al obtener la historia médica.", message: "Error al obtener la historia médica." };
  }
}

export async function createFirstMedicalHistoryAction(
  data: MedicalHistoryRequestDTO,
): Promise<ActionResponse<MedicalHistoryDetailDTO>> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, error: "No estás autenticado.", message: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, error: "Acceso denegado.", message: "Acceso denegado." };
  }

  try {
    const response = await MedicalHistoryService.createFirst(data, token);
    revalidatePath("/admin/appointments");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.details as Record<string, string>, message: error.message };
    }
    console.error("Error in createFirstMedicalHistoryAction:", error);
    return { success: false, error: "Error al registrar la historia médica inicial.", message: "Error al registrar la historia médica inicial." };
  }
}

export async function addMedicalHistoryTrackingAction(
  userId: number,
  data: MedicalHistoryTrackingRequestDTO,
): Promise<ActionResponse<MedicalHistoryDetailDTO>> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, error: "No estás autenticado.", message: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, error: "Acceso denegado.", message: "Acceso denegado." };
  }

  try {
    const response = await MedicalHistoryService.addTracking(userId, data, token);
    revalidatePath("/admin/appointments");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.details as Record<string, string>, message: error.message };
    }
    console.error("Error in addMedicalHistoryTrackingAction:", error);
    return { success: false, error: "Error al registrar la evolución de la consulta.", message: "Error al registrar la evolución de la consulta." };
  }
}

export async function updateMedicalHistoryAction(
  userId: number,
  data: MedicalHistoryUpdateDTO,
): Promise<ActionResponse<MedicalHistoryDetailDTO>> {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, error: "No estás autenticado.", message: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, error: "Acceso denegado.", message: "Acceso denegado." };
  }

  try {
    const response = await MedicalHistoryService.update(userId, data, token);
    revalidatePath("/admin/appointments");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, error: error.message, errors: error.details as Record<string, string>, message: error.message };
    }
    console.error("Error in updateMedicalHistoryAction:", error);
    return { success: false, error: "Error al actualizar los datos de la historia médica.", message: "Error al actualizar los datos de la historia médica." };
  }
}
