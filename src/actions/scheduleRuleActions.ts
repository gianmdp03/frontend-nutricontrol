"use server";

import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { ScheduleRuleService } from "@/services/ScheduleRuleService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError } from "@/utils/ApiError";

export async function deleteScheduleRuleAction(id: string, token: string) {
  try {
    await ScheduleRuleService.delete(id, token);
    revalidatePath("/admin/schedule-rules");
    return { success: true };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in deleteScheduleRuleAction:", error);
    return { success: false, message: "Hubo un problema al eliminar el horario.", error: "Hubo un problema al eliminar el horario." };
  }
}

export async function createScheduleRuleAction(data: ScheduleRuleFormValues, token: string) {
  try {
    await ScheduleRuleService.create(data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in createScheduleRuleAction:", error);
    return { success: false, message: "Hubo un problema de conexión con el servidor", error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-rules");
  redirect("/admin/schedule-rules");
}

export async function updateScheduleRuleAction(
  id: string,
  data: ScheduleRuleFormValues,
  token: string
) {
  try {
    await ScheduleRuleService.update(id, data, token);
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message, errors: error.details, error: error.message };
    }
    console.error("Error in updateScheduleRuleAction:", error);
    return { success: false, message: "Hubo un problema de conexión con el servidor", error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-rules");
  redirect("/admin/schedule-rules");
}
