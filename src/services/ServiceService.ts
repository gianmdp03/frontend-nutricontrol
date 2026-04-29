import { ServiceFormValues } from "@/schemas/ServiceSchema";
import { ServiceDetailDTO } from "@/types/Service";

const API_URL = process.env.API_URL as string;

export const ServiceService = {
  create: async (data: ServiceFormValues) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear el servicio");
    return response.json();
  },
  update: async (id: string, data: ServiceFormValues) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar el servicio");
    return response.json();
  },
  delete: async (id: string) => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el servicio");
  },
  get: async () => {
    const response = await fetch(`${API_URL}/services/public`, {
      next: { tags: ["services-list"] },
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Error al obtener los servicios");
    const data = await response.json();
    return data.content || [];
  },
  getById: async (id: string) => {
    const response = await fetch(`${API_URL}/services/public/${id}`);
    if (!response.ok) throw new Error("Error al obtener el servicio");
    const data = await response.json();
    return data;
  },
};
