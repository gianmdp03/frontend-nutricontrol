import { PrescriptionDetailDTO, PrescriptionRequestDTO } from "@/types/Prescription";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const PrescriptionService = {
  createPrescription: async (
    data: PrescriptionRequestDTO,
    token: string,
  ): Promise<PrescriptionDetailDTO> => {
    const response = await fetch(`${API_URL}/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMsg = await response.text().catch(() => "");
      throw new Error(errorMsg || "Error al crear la receta médica");
    }

    return response.json();
  },

  getPatientPrescriptions: async (token: string): Promise<PrescriptionDetailDTO[]> => {
    try {
      const response = await fetch(`${API_URL}/prescriptions/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.content || data || [];
      }
    } catch (e) {
      console.warn("Failed fetching from /prescriptions/user, trying generic", e);
    }

    try {
      const response = await fetch(`${API_URL}/prescriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.content || data || [];
      }
    } catch (e) {
      console.error("Failed fetching prescriptions", e);
    }
    return [];
  },
};
