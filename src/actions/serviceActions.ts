"use server";

import { ServiceFormValues, serviceSchema } from "@/schemas/ServiceSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ServiceService } from "@/services/ServiceService";


export async function deleteServiceAction(id: string, token: string) {
  await ServiceService.delete(id, token);
  revalidatePath("/admin/services");
}

export async function createServiceAction(data: ServiceFormValues, token: string) {
  try {
    await ServiceService.create(data, token);
  } catch (error) {
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateServiceAction(id: string, data: ServiceFormValues, token: string) {
  try {
    await ServiceService.update(id, data, token);
  } catch (error) {
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}
