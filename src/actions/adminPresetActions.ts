"use server";

import { AdminPresetService } from "@/services/AdminPresetService";
import { AdminPresetRequestDTO } from "@/types/AdminPreset";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";

export async function saveAdminPresetAction(data: AdminPresetRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, message: "No tienes permisos para realizar esta acción.", error: "No tienes permisos para realizar esta acción." };
  }

  try {
    const response = await AdminPresetService.savePreset(data, token);
    revalidatePath("/profile");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in saveAdminPresetAction:", error);
    return { success: false, message: "Hubo un problema al guardar la configuración.", error: "Hubo un problema al guardar la configuración." };
  }
}
