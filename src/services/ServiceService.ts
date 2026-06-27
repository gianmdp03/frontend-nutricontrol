import { ServiceFormValues } from "@/schemas/ServiceSchema";
import { ServiceDetailDTO } from "@/types/Service";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const ServiceService = {
  create: async (data: ServiceFormValues, token: string): Promise<ServiceDetailDTO> => {
    const response = await fetch(`${API_URL}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`},
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  update: async (
    id: string,
    data: ServiceFormValues,
    token:string
  ): Promise<ServiceDetailDTO> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`},
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/services/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`}
    });
    if (!response.ok) await handleResponseError(response);
  },
  get: async (): Promise<ServiceDetailDTO[]> => {
    const response = await fetch(`${API_URL}/services/public`, {
      next: { tags: ["services-list"] },
      cache: "force-cache",
    });
    if (!response.ok) await handleResponseError(response);
    const data = await response.json();
    return data.content || [];
  },
  getById: async (id: string): Promise<ServiceDetailDTO> => {
    const response = await fetch(`${API_URL}/services/public/${id}`, {
      next: { tags: ["services-list", `service-${id}`] },
      cache: "force-cache",
    });
    if (!response.ok) await handleResponseError(response);
    const data = await response.json();
    return data;
  },
};
