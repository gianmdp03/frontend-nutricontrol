import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { ScheduleRuleDetailDTO } from "@/types/ScheduleRule";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const ScheduleRuleService = {
  create: async (
    data: ScheduleRuleFormValues,
    token: string,
  ): Promise<ScheduleRuleDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  update: async (
    id: string,
    data: ScheduleRuleFormValues,
    token: string,
  ): Promise<ScheduleRuleDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
  delete: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/schedule-rules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });
    if (!response.ok) await handleResponseError(response);
  },
  get: async (token: string): Promise<ScheduleRuleDetailDTO[]> => {
    const response = await fetch(`${API_URL}/schedule-rules`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) await handleResponseError(response);
    const data = await response.json();
    return data.content || [];
  },
  getById: async (
    id: string,
    token: string,
  ): Promise<ScheduleRuleDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-rules/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) await handleResponseError(response);
    return response.json();
  },
};
