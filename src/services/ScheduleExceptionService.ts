import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { ScheduleExceptionDetailDTO } from "@/types/ScheduleException";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const ScheduleExceptionService = {
  create: async (
    data: ScheduleExceptionFormValues,
    token: string,
  ): Promise<ScheduleExceptionDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-exceptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear la excepción");
    return response.json();
  },
  update: async (
    id: string,
    data: ScheduleExceptionFormValues,
    token: string,
  ): Promise<ScheduleExceptionDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-exceptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar la excepción");
    return response.json();
  },
  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/schedule-exceptions/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la excepción");
  },
  get: async (token: string): Promise<ScheduleExceptionDetailDTO[]> => {
    const response = await fetch(`${API_URL}/schedule-exceptions`);
    if (!response.ok) throw new Error("Error al obtener las excepciones");
    const data = await response.json();

    return data.content || [];
  },
  getById: async (
    id: string,
    token: string,
  ): Promise<ScheduleExceptionDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-exceptions/${id}`);
    if (!response.ok) throw new Error("Error al obtener la excepción");
    return response.json();
  },
};
