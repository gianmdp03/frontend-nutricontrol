"use server";

import { serviceSchema } from "@/schemas/ServiceSchema";
import { deleteService, createService, updateService } from "@/services/ServiceService"; // Asegurate de tener estas funciones
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flattenError } from "zod/mini";

export type FormState = {
  errors?: {
    name?: string[];
    description?: string[];
  };
  message?: string | null;
  success?: boolean;
};

export async function deleteServiceAction(id: string) {
  await deleteService(id);
  revalidatePath("/admin/services");
}

export async function createOrUpdateServiceAction(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  
  // 1. Extraemos los datos (incluido el ID si existe)
  const id = formData.get("id") as string | null; 
  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  // 2. Validamos con Zod
  const validatedFields = serviceSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: flattenError(validatedFields.error).fieldErrors,
      message: "Por favor, corrija los errores marcados",
      success: false,
    };
  }

  const { name, description } = validatedFields.data;

  try {
    if (id) {
      // SI HAY ID -> ACTUALIZAMOS (PUT)
      await updateService(id, { name, description });
    } else {
      // SI NO HAY ID -> CREAMOS (POST)
      await createService({ name, description });
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error de conexión con el servidor",
      success: false,
    };
  }

  // 3. Limpiamos el caché y mandamos al usuario de vuelta a la lista
  revalidatePath("/admin/services");
  redirect("/admin/services"); 
}