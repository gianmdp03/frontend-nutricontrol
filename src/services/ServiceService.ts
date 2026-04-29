import { ServiceDetailDTO } from "@/types/Service";

export async function getServices(): Promise<ServiceDetailDTO[]> {
  const response = await fetch(`${process.env.API_URL}/services/public`, {
    next: { tags: ["services-list"] },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Error en la API");

  const data = await response.json();

  return data.content || [];
}

export async function deleteService(id: string) {
  const response = await fetch(`${process.env.API_URL}/services/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    return true;
  }
}

export async function createService(data: {
  name: string;
  description: string;
}) {
  const response = await fetch(`${process.env.API_URL}/services`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al crear el servicio");
  return response.json();
}

export async function updateService(
  id: string,
  data: { name: string; description: string },
) {
  const response = await fetch(`${process.env.API_URL}/services/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Error al actualizar el servicio");
}

export async function getServiceById(id: string): Promise<ServiceDetailDTO> {
  const response = await fetch(`${process.env.API_URL}/services/public/${id}`)
  if (!response.ok) {
    throw new Error("Error de conexión");
  }
  const data = await response.json();

  return data;
}
