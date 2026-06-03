"use server";

import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { ScheduleExceptionService } from "@/services/ScheduleExceptionService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/utils/ApiError";

export async function deleteScheduleExceptionAction(id: string, token: string) {
  try {
    await ScheduleExceptionService.delete(id, token);
    revalidatePath("/admin/schedule-exceptions");
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in deleteScheduleExceptionAction:", error);
    return { success: false, message: "Hubo un problema al eliminar la excepción.", error: "Hubo un problema al eliminar la excepción." };
  }
}

export async function createScheduleExceptionAction(
  data: ScheduleExceptionFormValues,
  token: string,
) {
  try {
    const dataToSend = {
      ...data,
      reason: data.reason === "" ? undefined : data.reason,
    };
    await ScheduleExceptionService.create(dataToSend, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createScheduleExceptionAction:", error);
    return { success: false, message: "Hubo un problema de conexión con el servidor", error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-exceptions");
  redirect("/admin/schedule-exceptions");
}

export async function updateScheduleExceptionAction(
  id: string,
  data: ScheduleExceptionFormValues,
  token: string,
) {
  try {
    const dataToSend = {
      ...data,
      reason: data.reason === "" ? undefined : data.reason,
    };
    await ScheduleExceptionService.update(id, dataToSend, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in updateScheduleExceptionAction:", error);
    return { success: false, message: "Hubo un problema de conexión con el servidor", error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-exceptions");
  redirect("/admin/schedule-exceptions");
}
