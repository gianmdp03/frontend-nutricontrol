import { MedicalCertificateDetailDTO, MedicalCertificateRequestDTO } from "@/types/MedicalCertificate";
import { ApiError, handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const MedicalCertificateService = {
  createMedicalCertificate: async (
    data: MedicalCertificateRequestDTO,
    token: string,
  ): Promise<MedicalCertificateDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-certificates`, {
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

  createManualMedicalCertificate: async (
    data: MedicalCertificateRequestDTO,
    token: string,
  ): Promise<MedicalCertificateDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-certificates/admin/manual`, {
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

  getPatientMedicalCertificates: async (token: string): Promise<MedicalCertificateDetailDTO[]> => {
    try {
      const response = await fetch(`${API_URL}/medical-certificates/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.content || data || [];
      }
      console.warn(`Failed fetching from /medical-certificates/user, status: ${response.status}`);
    } catch (e) {
      console.warn("Failed fetching from /medical-certificates/user, trying generic", e);
    }

    const response = await fetch(`${API_URL}/medical-certificates`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      await handleResponseError(response);
    }
    const data = await response.json();
    return data.content || data || [];
  },

  getManualMedicalCertificates: async (token: string): Promise<MedicalCertificateDetailDTO[]> => {
    const response = await fetch(`${API_URL}/medical-certificates/admin/manual`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    return data.content || data || [];
  },
};
