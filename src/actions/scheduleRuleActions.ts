"use server";

import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { ScheduleRuleService } from "@/services/ScheduleRuleService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteScheduleRuleAction(id: string, token:string) {
  await ScheduleRuleService.delete(id, token);
  revalidatePath("/admin/schedule-rules");
}

export async function createScheduleRuleAction(data: ScheduleRuleFormValues, token:string) {
  try {
    await ScheduleRuleService.create(data, token);
  } catch (error) {
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-rules");
  redirect("/admin/schedule-rules");
}

export async function updateScheduleRuleAction(
  id: string,
  data: ScheduleRuleFormValues,
  token:string
) {
  try {
    await ScheduleRuleService.update(id, data, token);
  } catch (error) {
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-rules");
  redirect("/admin/schedule-rules");
}
