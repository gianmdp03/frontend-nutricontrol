"use server";

import { NutritionalPlanService } from "@/services/NutritionalPlanService";
import { NutritionalPlanRequestDTO } from "@/types/NutritionalPlan";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";
import { ApiError } from "@/utils/ApiError";

export async function createNutritionalPlanAction(data: NutritionalPlanRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, message: "No tienes permisos para realizar esta acción.", error: "No tienes permisos para realizar esta acción." };
  }

  try {
    const response = await NutritionalPlanService.createNutritionalPlan(data, token);
    revalidatePath("/admin/appointments");
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createNutritionalPlanAction:", error);
    return { success: false, message: "Hubo un problema al guardar el plan nutricional.", error: "Hubo un problema al guardar el plan nutricional." };
  }
}

export async function createManualNutritionalPlanAction(data: NutritionalPlanRequestDTO) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.backendToken;

  if (!token) {
    return { success: false, message: "No estás autenticado.", error: "No estás autenticado." };
  }

  if (session.user.role !== "ROLE_ADMIN") {
    return { success: false, message: "No tienes permisos para realizar esta acción.", error: "No tienes permisos para realizar esta acción." };
  }

  try {
    const response = await NutritionalPlanService.createManualNutritionalPlan(data, token);
    return { success: true, data: response };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createManualNutritionalPlanAction:", error);
    return { success: false, message: "Hubo un problema al guardar el plan nutricional manual.", error: "Hubo un problema al guardar el plan nutricional manual." };
  }
}
