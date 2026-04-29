import { ServiceFormValues } from "@/schemas/ServiceSchema";
import { ServiceDetailDTO } from "@/types/Service";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const ServiceService = {
  create: async (data: ServiceFormValues): Promise<ServiceDetailDTO> => {
    const response = await fetch(`${API_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear el servicio");
    return response.json();
  },
  update: async (
    id: string,
    data: ServiceFormValues,
  ): Promise<ServiceDetailDTO> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar el servicio");
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el servicio");
  },
  get: async (): Promise<ServiceDetailDTO[]> => {
    const response = await fetch(`${API_URL}/services/public`, {
      next: { tags: ["services-list"] },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Error al obtener los servicios");
    const data = await response.json();
    return data.content || [];
  },
  getById: async (id: string): Promise<ServiceDetailDTO> => {
    const response = await fetch(`${API_URL}/services/public/${id}`);
    if (!response.ok) throw new Error("Error al obtener el servicio");
    const data = await response.json();
    return data;
  },
};
