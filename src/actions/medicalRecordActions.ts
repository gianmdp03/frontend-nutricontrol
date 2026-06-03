"use server";

import { MedicalRecordService } from "@/services/MedicalRecordService";
import { MedicalRecordDetailDTO } from "@/types/MedicalRecord";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";

export async function saveOrUpdateMedicalRecordAction(data: MedicalRecordDetailDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado. Por favor, inicia sesión.", error: "No estás autenticado. Por favor, inicia sesión." };
  }

  try {
    const response = await MedicalRecordService.saveOrUpdateMedicalRecord(data, token);
    revalidatePath("/profile");
    revalidatePath("/medical-record");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in saveOrUpdateMedicalRecordAction:", error);
    return {
      success: false,
      message: "Hubo un problema al guardar la ficha médica.",
      error: "Hubo un problema al guardar la ficha médica.",
    };
  }
}

export async function getUserMedicalRecordAction() {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  try {
    const data = await MedicalRecordService.getUserMedicalRecord(token);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in getUserMedicalRecordAction:", error);
    return {
      success: false,
      message: "Hubo un problema al obtener tu ficha médica.",
      error: "Hubo un problema al obtener tu ficha médica.",
    };
  }
}

export async function getPatientMedicalRecordAction(patientId: string | number) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session?.user?.role !== "ROLE_ADMIN") {
    return { success: false, message: "Acceso no autorizado. Se requieren permisos de administrador.", error: "Acceso no autorizado. Se requieren permisos de administrador." };
  }

  try {
    const data = await MedicalRecordService.getPatientMedicalRecord(patientId, token);
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in getPatientMedicalRecordAction:", error);
    return {
      success: false,
      message: "Hubo un problema al obtener la ficha médica del paciente.",
      error: "Hubo un problema al obtener la ficha médica del paciente.",
    };
  }
}
