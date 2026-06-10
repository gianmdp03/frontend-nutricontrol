import {
  MedicalHistoryRequestDTO,
  MedicalHistoryDetailDTO,
  MedicalHistoryTrackingRequestDTO,
  MedicalHistoryUpdateDTO,
} from "@/types/MedicalHistory";
import { handleResponseError } from "@/utils/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const MedicalHistoryService = {
  createFirst: async (
    data: MedicalHistoryRequestDTO,
    token: string,
  ): Promise<MedicalHistoryDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-histories/first`, {
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

  addTracking: async (
    userId: number,
    data: MedicalHistoryTrackingRequestDTO,
    token: string,
  ): Promise<MedicalHistoryDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-histories/${userId}`, {
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

  getById: async (userId: number, token: string): Promise<MedicalHistoryDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-histories/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return response.json();
  },

  checkExists: async (userId: number, token: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/medical-histories/exists/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    const data = await response.json();
    if (typeof data === "object" && data !== null && "exists" in data) {
      return !!data.exists;
    }
    return !!data;
  },

  update: async (
    userId: number,
    data: MedicalHistoryUpdateDTO,
    token: string,
  ): Promise<MedicalHistoryDetailDTO> => {
    const response = await fetch(`${API_URL}/medical-histories/${userId}`, {
      method: "PATCH",
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

  downloadPDF: async (
    userId: number,
    token: string,
    trackingId?: number,
  ): Promise<Blob> => {
    let url = `${API_URL}/medical-histories/pdf/${userId}`;
    if (trackingId) {
      url += `?trackingId=${trackingId}`;
    }
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      await handleResponseError(response);
    }

    return response.blob();
  },
};
