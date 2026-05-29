import { AdminPresetDetailDTO, AdminPresetRequestDTO } from "@/types/AdminPreset";

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
      throw new Error("Error al obtener la configuración de preset");
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
      const errorMsg = await response.text().catch(() => "");
      throw new Error(errorMsg || "Error al guardar el preset");
    }

    return response.json();
  },
};
