"use server";

import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { ScheduleExceptionService } from "@/services/ScheduleExceptionService";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteScheduleExceptionAction(id: string, token: string) {
  await ScheduleExceptionService.delete(id, token);
  revalidatePath("/admin/schedule-exceptions");
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
    return { error: "Hubo un problema de conexión con el servidor" };
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
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/schedule-exceptions");
  redirect("/admin/schedule-exceptions");
}
