"use server";

import { AdminPresetService } from "@/services/AdminPresetService";
import { AdminPresetRequestDTO } from "@/types/AdminPreset";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

export async function saveAdminPresetAction(data: AdminPresetRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { error: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { error: "No tienes permisos para realizar esta acción." };
  }

  try {
    const response = await AdminPresetService.savePreset(data, token);
    revalidatePath("/profile");
    return { success: true, data: response };
  } catch (error: any) {
    return { error: error.message || "Hubo un problema al guardar la configuración." };
  }
}
