import { ScheduleRuleFormValues } from "@/schemas/ScheduleRuleSchema";
import { ScheduleRuleDetailDTO } from "@/types/ScheduleRule";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const ScheduleRuleService = {
  create: async (
    data: ScheduleRuleFormValues,
  ): Promise<ScheduleRuleDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear el horario");
    return response.json();
  },
  update: async (
    id: string,
    data: ScheduleRuleFormValues,
  ): Promise<ScheduleRuleDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar el horario");
    return response.json();
  },
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/schedule-rules/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el horario");
  },
  get: async (): Promise<ScheduleRuleDetailDTO[]> => {
    const response = await fetch(`${API_URL}/schedule-rules`);
    if (!response.ok) throw new Error("Error al obtener los horarios");
    const data = await response.json();
    return data.content || [];
  },
  getById: async (id: string): Promise<ScheduleRuleDetailDTO> => {
    const response = await fetch(`${API_URL}/schedule-rules/${id}`);
    if (!response.ok) throw new Error("Error al obtener los horarios");
    const data = await response.json();
    return data;
  },
};
