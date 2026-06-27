"use server";

import { ServiceFormValues, serviceSchema } from "@/schemas/ServiceSchema";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { ServiceService } from "@/services/ServiceService";
import { ApiError } from "@/utils/ApiError";

export async function deleteServiceAction(id: string, token: string) {
  try {
    await ServiceService.delete(id, token);
    updateTag("services-list");
    revalidatePath("/admin/services");
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in deleteServiceAction:", error);
    return { success: false, message: "Hubo un problema al eliminar el servicio.", error: "Hubo un problema al eliminar el servicio." };
  }
}

export async function createServiceAction(data: ServiceFormValues, token: string) {
  try {
    await ServiceService.create(data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createServiceAction:", error);
    return { success: false, message: "Hubo un problema de conexión con el servidor", error: "Hubo un problema de conexión con el servidor" };
  }

  updateTag("services-list");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateServiceAction(id: string, data: ServiceFormValues, token: string) {
  try {
    await ServiceService.update(id, data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in updateServiceAction:", error);
    return { success: false, message: "Hubo un problema de conexión con el servidor", error: "Hubo un problema de conexión con el servidor" };
  }

  updateTag("services-list");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}
