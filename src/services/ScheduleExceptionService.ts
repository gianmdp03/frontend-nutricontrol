import { ScheduleExceptionFormValues } from "@/schemas/ScheduleExceptionSchema";
import { ScheduleExceptionDetailDTO } from "@/types/ScheduleException";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const ScheduleExceptionService = {
  create: async (
    data: ScheduleExceptionFormValues,
    token: string,
  ): Promise<ScheduleExceptionDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-exceptions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  update: async (
    id: string,
    data: ScheduleExceptionFormValues,
    token: string,
  ): Promise<ScheduleExceptionDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-exceptions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/schedule-exceptions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) await handleResponseError(response);
  },
  get: async (token: string): Promise<ScheduleExceptionDetailDTO[]> => {
    const response = await fetch(`${API_URL}/schedule-exceptions`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) await handleResponseError(response);
    const data = await response.json();

    return data.content || [];
  },
  getById: async (
    id: string,
    token: string,
  ): Promise<ScheduleExceptionDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-exceptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
};
