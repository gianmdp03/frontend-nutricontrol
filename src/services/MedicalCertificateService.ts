import { MedicalCertificateDetailDTO, MedicalCertificateRequestDTO } from "@/types/MedicalCertificate";

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
      const errorMsg = await response.text().catch(() => "");
      throw new Error(errorMsg || "Error al crear el certificado médico");
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
    } catch (e) {
      console.warn("Failed fetching from /medical-certificates/user, trying generic", e);
    }

    try {
      const response = await fetch(`${API_URL}/medical-certificates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.content || data || [];
      }
    } catch (e) {
      console.error("Failed fetching medical certificates", e);
    }
    return [];
  },
};
