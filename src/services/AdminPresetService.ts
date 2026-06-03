import { AdminPresetDetailDTO, AdminPresetRequestDTO } from "@/types/AdminPreset";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const AdminPresetService = {
  getPreset: async (token: string): Promise<AdminPresetDetailDTO> => {
    const response = await fetch(`${API_URL}/admin-preset`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { id: 0, adminName: "", specialty: "", exequatur: "" };
      }
      await handleResponseError(response);
    }

    return response.json();
  },

  savePreset: async (
    data: AdminPresetRequestDTO,
    token: string,
  ): Promise<AdminPresetDetailDTO> => {
    const response = await fetch(`${API_URL}/admin-preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return response.json();
  },
};
