import { MedicalRecordDetailDTO } from "@/types/MedicalRecord";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const MedicalRecordService = {
  // POST /api/medical-records
  saveOrUpdateMedicalRecord: async (
    data: MedicalRecordDetailDTO,
    token: string,
  ): Promise<MedicalRecordDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorMsg = await response.text().catch(() => "");
      throw new Error(errorMsg || "Error al guardar la ficha médica");
    }

    return response.json();
  },

  // GET /api/medical-records
  getUserMedicalRecord: async (token: string): Promise<MedicalRecordDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-records`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // En caso de que no exista aún, devolvemos un objeto vacío para inicializar
        return { weight: 0, height: 0, medicalHistory: "", medication: "" };
      }
      throw new Error("Error al obtener la ficha médica");
    }

    return response.json();
  },

  // GET /api/medical-records/admin/{patientId}
  getPatientMedicalRecord: async (
    patientId: string | number,
    token: string,
  ): Promise<MedicalRecordDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-records/admin/${patientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener la ficha médica del paciente");
    }

    return response.json();
  },
};
