"use server";

import { ServiceFormValues, serviceSchema } from "@/schemas/ServiceSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ServiceService } from "@/services/ServiceService";

export type ServiceFormState = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function deleteServiceAction(id: string) {
  await ServiceService.delete(id);
  revalidatePath("/admin/services");
}

export async function createServiceAction(data: ServiceFormValues) {
  try {
    await ServiceService.create(data);
  } catch (error) {
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function updateServiceAction(id: string, data: ServiceFormValues) {
  try {
    await ServiceService.update(id, data);
  } catch (error) {
    return { error: "Hubo un problema de conexión con el servidor" };
  }

  revalidatePath("/admin/services");
  redirect("/admin/services");
}
