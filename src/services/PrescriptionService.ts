import { PrescriptionDetailDTO, PrescriptionRequestDTO } from "@/types/Prescription";
import { ApiError, handleResponseError } from "@/utils/ApiError";

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
      await handleResponseError(response);
    }

    return response.json();
  },

  createManualPrescription: async (
    data: PrescriptionRequestDTO,
    token: string,
  ): Promise<PrescriptionDetailDTO> => {
    const response = await fetch(`${API_URL}/prescriptions/admin/manual`, {
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

  getPatientPrescriptions: async (token: string): Promise<PrescriptionDetailDTO[]> => {
    const response = await fetch(`${API_URL}/prescriptions/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      await handleResponseError(response);
    }
    const data = await response.json();
    return data.content || data || [];
  },

  getManualPrescriptions: async (token: string): Promise<PrescriptionDetailDTO[]> => {
    const response = await fetch(`${API_URL}/prescriptions/admin/manual`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    return data.content || data || [];
  },
};
